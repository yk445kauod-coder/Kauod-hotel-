document.addEventListener('DOMContentLoaded', function () {
    // --- Firebase Configuration ---
    const firebaseConfig = {
        apiKey: "AIzaSyApgrwfyrVJYsihy9tUwPfazdNYZPqWbow",
        authDomain: "kaoud-hotel.firebaseapp.com",
        databaseURL: "https://kaoud-hotel-default-rtdb.firebaseio.com",
        projectId: "kaoud-hotel",
        storageBucket: "kaoud-hotel.appspot.com",
        messagingSenderId: "77309702077",
        appId: "1:77309702077:web:1eee14c06204def2eb6cd4"
    };

    // --- Initialize Firebase ---
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.database();

    // --- DOM Elements ---
    const loginModal = document.getElementById('login-modal');
    const loginBtn = document.getElementById('login-btn');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    const adminPanel = document.getElementById('admin-panel');
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const logoutBtns = [document.getElementById('logout-btn-sidebar'), document.getElementById('logout-btn-topbar')];
    
    // Food Order Containers
    const newOrdersContainer = document.getElementById('new-orders-container');
    const processingOrdersContainer = document.getElementById('processing-orders-container');
    const completedOrdersContainer = document.getElementById('completed-orders-container');
    const newOrdersCountEl = document.getElementById('new-orders-count');
    const processingOrdersCountEl = document.getElementById('processing-orders-count');
    const completedOrdersCountEl = document.getElementById('completed-orders-count');


    // --- Authentication ---
    const ADMIN_PASSWORD = "admin123";

    function checkSession() {
        if (sessionStorage.getItem('isAdminAuthenticated') === 'true') {
            loginModal.classList.remove('show');
            adminPanel.style.display = 'flex';
        } else {
            loginModal.classList.add('show');
            adminPanel.style.display = 'none';
        }
    }

    loginBtn.addEventListener('click', () => {
        if (passwordInput.value === ADMIN_PASSWORD) {
            sessionStorage.setItem('isAdminAuthenticated', 'true');
            checkSession();
        } else {
            loginError.classList.remove('d-none');
            setTimeout(() => loginError.classList.add('d-none'), 3000);
        }
    });

    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });

    logoutBtns.forEach(btn => btn.addEventListener('click', () => {
        sessionStorage.removeItem('isAdminAuthenticated');
        checkSession();
    }));

    // --- Navigation ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            
            pages.forEach(page => {
                page.classList.add('d-none');
            });
            document.getElementById(`${pageId}-page`).classList.remove('d-none');

            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // --- Realtime Data Listeners ---
    function listenForFoodOrders() {
        const ordersRef = db.ref('rooms');
        ordersRef.on('value', (snapshot) => {
            const roomsData = snapshot.val();
            if (!roomsData) return;
            
            // Clear containers
            newOrdersContainer.innerHTML = '';
            processingOrdersContainer.innerHTML = '';
            completedOrdersContainer.innerHTML = '';
            
            let newCount = 0;
            let processingCount = 0;
            let completedCount = 0;

            Object.entries(roomsData).forEach(([roomKey, roomData]) => {
                if (roomData.orders) {
                    const roomNumber = roomKey.replace('room_', '');
                    Object.entries(roomData.orders).forEach(([orderId, orderData]) => {
                        const card = createOrderCard(roomNumber, orderId, orderData);
                        switch (orderData.status) {
                            case 'processing':
                                processingOrdersContainer.prepend(card);
                                processingCount++;
                                break;
                            case 'completed':
                                completedOrdersContainer.prepend(card);
                                completedCount++;
                                break;
                            case 'pending':
                            default:
                                newOrdersContainer.prepend(card);
                                newCount++;
                                break;
                        }
                    });
                }
            });

            // Update counts
            newOrdersCountEl.textContent = newCount;
            processingOrdersCountEl.textContent = processingCount;
            completedOrdersCountEl.textContent = completedCount;
        });
    }

    function createOrderCard(roomNumber, orderId, order) {
        const card = document.createElement('div');
        card.className = `order-card status-${order.status || 'pending'}`;
        card.dataset.id = orderId;
        card.dataset.room = roomNumber;

        const itemsHtml = order.items.map(item => `<li><span class="quantity">${item.quantity}</span> ${item.name_ar}</li>`).join('');
        const formattedDate = new Date(order.timestamp).toLocaleString('ar-EG');

        card.innerHTML = `
            <div class="order-card-header">
                <span class="room-number">غرفة ${roomNumber}</span>
                <span class="timestamp"><i class="far fa-clock me-1"></i>${formattedDate}</span>
            </div>
            <p class="guest-name">${order.guestName || ''}</p>
            <ul class="order-items">${itemsHtml}</ul>
            <div class="order-total">
                الإجمالي: ${order.total.toFixed(2)} ج.م
            </div>
            <div class="order-actions mt-2 text-start">
                ${order.status !== 'processing' ? `<button class="btn btn-warning btn-sm" onclick="updateOrderStatus('${roomNumber}', '${orderId}', 'processing')">بدء التنفيذ</button>` : ''}
                ${order.status !== 'completed' ? `<button class="btn btn-success btn-sm ms-1" onclick="updateOrderStatus('${roomNumber}', '${orderId}', 'completed')">إتمام الطلب</button>` : ''}
            </div>
        `;
        return card;
    }
    
    window.updateOrderStatus = (roomNumber, orderId, newStatus) => {
        const orderRef = db.ref(`rooms/room_${roomNumber}/orders/${orderId}`);
        orderRef.update({ status: newStatus })
            .then(() => {
                Swal.fire({
                    title: 'تم!',
                    text: `تم تحديث حالة الطلب إلى "${newStatus === 'processing' ? 'قيد التنفيذ' : 'مكتمل'}".`,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            })
            .catch(error => {
                console.error("Error updating status: ", error);
                Swal.fire('خطأ!', 'لم نتمكن من تحديث حالة الطلب.', 'error');
            });
    }


    // --- Initial Load ---
    checkSession();
    if (sessionStorage.getItem('isAdminAuthenticated') === 'true') {
        listenForFoodOrders();
    }
});
