document.addEventListener('DOMContentLoaded', () => {
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

    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();

    // --- DOM Elements ---
    const loginOverlay = document.getElementById('login-overlay');
    const loginButton = document.getElementById('login-button');
    const passwordInput = document.getElementById('password-input');
    const loginError = document.getElementById('login-error');
    const mainWrapper = document.getElementById('main-wrapper');
    const logoutButton = document.getElementById('logout-button');
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const mainHeaderTitle = document.querySelector('#main-header h2');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mainContent = document.getElementById('main-content');
    const notificationBell = document.getElementById('notification-bell');
    const notificationCount = document.getElementById('notification-count');
    
    const requestsContainer = document.getElementById('requests-container');
    const ordersContainer = document.getElementById('orders-container');
    
    const modalOverlay = document.getElementById('details-modal-overlay');
    const modalContent = document.getElementById('modal-content');
    const closeModalButton = document.getElementById('close-modal-button');
    
    // --- State Management ---
    let roomsData = {};
    let notificationCounter = 0;
    const CORRECT_PASSWORD = 'admin'; // Replace with a more secure method in production

    // --- Authentication ---
    function checkAuth() {
        if (sessionStorage.getItem('isAdminAuthenticated') === 'true') {
            loginOverlay.classList.remove('active');
            mainWrapper.classList.remove('hidden');
            initAdminPanel();
        } else {
            loginOverlay.classList.add('active');
            mainWrapper.classList.add('hidden');
        }
    }

    loginButton.addEventListener('click', () => {
        if (passwordInput.value === CORRECT_PASSWORD) {
            sessionStorage.setItem('isAdminAuthenticated', 'true');
            checkAuth();
        } else {
            loginError.textContent = 'كلمة المرور غير صحيحة.';
            passwordInput.style.border = '1px solid var(--status-pending)';
        }
    });
    
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginButton.click();
        }
    });

    logoutButton.addEventListener('click', () => {
        sessionStorage.removeItem('isAdminAuthenticated');
        window.location.reload();
    });

    // --- UI Interactions ---
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('collapsed');
    });

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = item.dataset.page;
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Show selected page
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(`${pageId}-page`).classList.add('active');
            
            mainHeaderTitle.textContent = item.querySelector('span').textContent;
        });
    });
    
    closeModalButton.addEventListener('click', () => {
        modalOverlay.classList.add('hidden');
    });

    // --- Notifications ---
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast-notification');
        toast.textContent = message;
        toast.className = `show ${type}`;
        setTimeout(() => {
            toast.className = '';
        }, 3000);
    }
    
    function updateNotificationBell(count) {
        notificationCounter += count;
        if (notificationCounter > 0) {
            notificationCount.textContent = notificationCounter;
            notificationCount.classList.remove('hidden');
        } else {
            notificationCount.classList.add('hidden');
        }
    }

    // --- Data Rendering ---
    function renderRequests(requests) {
        requestsContainer.innerHTML = '';
        if (!requests || Object.keys(requests).length === 0) {
            requestsContainer.innerHTML = '<p>لا توجد طلبات خدمة حاليًا.</p>';
            return;
        }
        
        Object.entries(requests).forEach(([id, request]) => {
            if(!request.roomNumber || !request.text) return; // Skip malformed data
            
            const card = document.createElement('div');
            card.className = 'request-card';
            card.dataset.id = id;
            card.dataset.status = request.status || 'pending';
            card.dataset.room = request.roomNumber;

            card.innerHTML = `
                <div class="card-header">
                    <h3>غرفة ${request.roomNumber}</h3>
                    <span class="card-time">${new Date(request.timestamp).toLocaleString()}</span>
                </div>
                <div class="card-body">
                    <p>${request.text}</p>
                    ${request.rating ? `<div class="rating">التقييم: ${'★'.repeat(request.rating)}${'☆'.repeat(5 - request.rating)}</div>` : ''}
                </div>
                <div class="card-footer">
                    <button class="details-btn" data-type="request">عرض التفاصيل</button>
                </div>
            `;
            requestsContainer.appendChild(card);
        });
    }
    
    function renderOrders(orders) {
        ordersContainer.innerHTML = '';
        if (!orders || Object.keys(orders).length === 0) {
            ordersContainer.innerHTML = '<p>لا توجد طلبات طعام حاليًا.</p>';
            return;
        }
        
        Object.entries(orders).forEach(([id, order]) => {
            if(!order.roomNumber || !order.items) return; // Skip malformed data
            
            const card = document.createElement('div');
            card.className = 'order-card';
            card.dataset.id = id;
            card.dataset.status = order.status || 'pending';
            card.dataset.room = order.roomNumber;

            card.innerHTML = `
                <div class="card-header">
                    <h3>طلب طعام - غرفة ${order.roomNumber}</h3>
                    <span class="card-time">${new Date(order.timestamp).toLocaleString()}</span>
                </div>
                <div class="card-body">
                    <p class="items-summary">${order.items.length} أصناف</p>
                    <p class="order-total">الإجمالي: ${order.total.toFixed(2)} ج.م</p>
                </div>
                <div class="card-footer">
                     <button class="details-btn" data-type="order">عرض التفاصيل</button>
                </div>
            `;
            ordersContainer.appendChild(card);
        });
    }
    
    // --- Modal Logic ---
    function showDetailsModal(type, id) {
        const roomNumber = type === 'request' ? roomsData[id]?.roomNumber : roomsData[id]?.roomNumber;
        const data = roomsData[id];
        
        if (!data || !roomNumber) {
            showToast('لا يمكن العثور على تفاصيل الطلب.', 'error');
            return;
        }

        let detailsHtml = `
            <div class="modal-header">
                <h2>${type === 'request' ? 'طلب خدمة' : 'طلب طعام'} - غرفة ${roomNumber}</h2>
                <p>تاريخ الطلب: ${new Date(data.timestamp).toLocaleString()}</p>
            </div>
        `;
        
        // Add specific details
        if (type === 'request') {
            detailsHtml += `
                <div class="modal-section">
                    <h4>تفاصيل الطلب</h4>
                    <p>${data.text}</p>
                    ${data.rating ? `<p>التقييم: <strong>${data.rating}/5</strong></p>` : ''}
                </div>
            `;
        } else { // order
             detailsHtml += `
                <div class="modal-section">
                    <h4>الأصناف المطلوبة</h4>
                    <ul>
                        ${data.items.map(item => `<li>${item.quantity} x ${item.name_ar || item.en_name} - ${item.price.toFixed(2)} ج.م</li>`).join('')}
                    </ul>
                    <hr style="margin: 10px 0;">
                    <p><strong>الإجمالي: ${data.total.toFixed(2)} ج.م</strong></p>
                </div>
            `;
        }
        
        // Add conversation history
        const replies = roomsData[roomNumber]?.replies || {};
        detailsHtml += `
            <div class="modal-section">
                <h4>سجل المحادثة</h4>
                <div class="conversation-history">
                    <div class="message user">
                         <p class="message-text">${data.text}</p>
                         <p class="message-time">${new Date(data.timestamp).toLocaleTimeString()}</p>
                    </div>
                    ${Object.values(replies).sort((a,b) => a.timestamp - b.timestamp).map(reply => `
                        <div class="message admin">
                            <p class="message-text">${reply.text}</p>
                            <p class="message-time">${new Date(reply.timestamp).toLocaleTimeString()}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Add reply form
        detailsHtml += `
            <div class="modal-section">
                <h4>الرد على النزيل</h4>
                <form id="reply-form" data-room="${roomNumber}">
                    <textarea placeholder="اكتب ردك هنا..."></textarea>
                    <button type="submit">إرسال الرد</button>
                </form>
            </div>
        `;
        
        modalContent.innerHTML = detailsHtml;
        modalOverlay.classList.remove('hidden');

        // Add form submission listener
        const replyForm = document.getElementById('reply-form');
        replyForm.addEventListener('submit', handleReplySubmit);
    }
    
    async function handleReplySubmit(e) {
        e.preventDefault();
        const roomNumber = e.target.dataset.room;
        const textarea = e.target.querySelector('textarea');
        const replyText = textarea.value.trim();
        const button = e.target.querySelector('button');

        if (!replyText) {
            showToast('الرجاء كتابة رد.', 'error');
            return;
        }

        button.disabled = true;
        button.textContent = 'جاري الإرسال...';
        
        try {
            const repliesRef = db.ref(`rooms/room_${roomNumber}/replies`);
            await repliesRef.push({
                text: replyText,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
            textarea.value = '';
            showToast('تم إرسال الرد بنجاح.');
            
            // Optimistically update UI
             const history = modalContent.querySelector('.conversation-history');
             if (history) {
                 const newReply = document.createElement('div');
                 newReply.className = 'message admin';
                 newReply.innerHTML = `<p class="message-text">${replyText}</p><p class="message-time">الآن</p>`;
                 history.appendChild(newReply);
                 history.scrollTop = history.scrollHeight;
             }

        } catch (error) {
            console.error('Error sending reply:', error);
            showToast('حدث خطأ أثناء إرسال الرد.', 'error');
        } finally {
            button.disabled = false;
            button.textContent = 'إرسال الرد';
        }
    }
    
    document.body.addEventListener('click', (e) => {
        if(e.target.classList.contains('details-btn')) {
            const card = e.target.closest('.request-card, .order-card');
            const id = card.dataset.id;
            const type = e.target.dataset.type;
            showDetailsModal(type, id);
        }
    });


    // --- Firebase Listeners ---
    function initAdminPanel() {
        const roomsRef = db.ref('rooms');
        
        roomsRef.on('value', (snapshot) => {
            const allRooms = snapshot.val();
            roomsData = {};
            let allRequests = {};
            let allOrders = {};
            let activeRoomsCount = 0;
            
            if (allRooms) {
                 activeRoomsCount = Object.keys(allRooms).length;

                for (const roomKey in allRooms) {
                    const room = allRooms[roomKey];
                    const roomNumber = roomKey.replace('room_', '');

                    if (room.comments) {
                        Object.entries(room.comments).forEach(([id, comment]) => {
                           allRequests[id] = {...comment, roomNumber};
                           roomsData[id] = {...comment, roomNumber, replies: room.replies || {}};
                        });
                    }
                    if (room.orders) {
                        Object.entries(room.orders).forEach(([id, order]) => {
                            allOrders[id] = {...order, roomNumber};
                            roomsData[id] = {...order, roomNumber, replies: room.replies || {}};
                        });
                    }
                     if(room.replies){
                        roomsData[roomNumber] = { replies: room.replies };
                    }
                }
            }
            
            // Sort by timestamp desc
            allRequests = Object.fromEntries(Object.entries(allRequests).sort(([,a],[,b]) => b.timestamp - a.timestamp));
            allOrders = Object.fromEntries(Object.entries(allOrders).sort(([,a],[,b]) => b.timestamp - a.timestamp));
            
            renderRequests(allRequests);
            renderOrders(allOrders);
            updateDashboardStats(allRequests, allOrders, activeRoomsCount);
        });
        
        // New request/order listener for notifications
        let initialLoad = true;
        roomsRef.on('child_changed', (snapshot) => {
            if(initialLoad) return;
            showToast('تحديث جديد في غرفة ' + snapshot.key.replace('room_', ''), 'success');
            updateNotificationBell(1);
        });
        setTimeout(() => initialLoad = false, 2000);
    }
    
    // --- Dashboard Stats ---
    function updateDashboardStats(requests, orders, activeRooms) {
        const totalRequests = Object.keys(requests).length;
        const totalOrders = Object.keys(orders).length;
        
        document.getElementById('total-requests-stat').textContent = totalRequests;
        document.getElementById('total-orders-stat').textContent = totalOrders;
        document.getElementById('active-rooms-stat').textContent = activeRooms;

        const ratings = Object.values(requests).filter(r => r.rating).map(r => r.rating);
        const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 'N/A';
        document.getElementById('average-rating-stat').textContent = `${avgRating}/5`;

        // Render recent items
        const recentRequestsList = document.getElementById('recent-requests-list');
        recentRequestsList.innerHTML = Object.values(requests).slice(0, 5).map(r => `<div class="item"><span>غرفة ${r.roomNumber}</span><span>${new Date(r.timestamp).toLocaleTimeString()}</span></div>`).join('');
        
        const recentOrdersList = document.getElementById('recent-orders-list');
        recentOrdersList.innerHTML = Object.values(orders).slice(0, 5).map(o => `<div class="item"><span>غرفة ${o.roomNumber}</span><span>${o.total.toFixed(2)} ج.م</span></div>`).join('');
    }

    // --- Initial Load ---
    checkAuth();
});
