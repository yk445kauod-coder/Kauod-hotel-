document.addEventListener('DOMContentLoaded', function() {

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

    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.database();

    // --- DOM Elements ---
    const ordersList = document.getElementById('orders-list');
    const fullMenu = document.getElementById('full-menu');
    const modal = document.getElementById('order-details-modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');
    const sendReplyBtn = document.getElementById('send-reply-btn');
    const replyMessageInput = document.getElementById('reply-message');

    let currentOrder = null;
    let hasOrders = false;

    // --- Menu Data ---
    const menuData = [
        {
          id: "soups",
          name: "الشوربات",
          items: [
            {id: "soup1", name: "شوربة لسان عصفور", price: 35.00},
            {id: "soup2", name: "شوربة خضار", price: 50.00},
            {id: "soup3", name: "شوربة طماطم", price: 55.00},
          ]
        },
        {
          id: "appetizers",
          name: "المقبلات",
          items: [
            {id: "appetizer1", name: "سلطة خضراء", price: 30.00},
            {id: "appetizer4", name: "سلطة طحينة", price: 35.00},
            {id: "appetizer8", name: "بوم فريت", price: 40.00}
          ]
        },
        {
            id: "main-courses",
            name: "الأطباق الرئيسية",
            items: [
                {id: "main4", name: "كفتة مشوية", price: 200.00},
                {id: "main5", name: "فراخ مشوى", price: 215.00},
                {id: "main7", name: "فراخ بانيه", price: 250.00},
                {id: "main8", name: "شيش طاووق", price: 250.00},
            ]
        },
        {
            id: "desserts",
            name: "الحلويات",
            items: [
              {id: "dessert1", name: "ارز باللبن سادة", price: 35.00},
              {id: "dessert6", name: "أم على", price: 55.00},
              {id: "dessert9", name: "فروت سلاط", price: 85.00},
            ]
        },
        {
            id: "hot-drinks",
            name: "المشروبات الساخنة",
            items: [
              {id: "hotdrink1", name: "أعشاب", price: 35.00},
              {id: "hotdrink5", name: "شاى ليبتون", price: 40.00},
              {id: "hotdrink9", name: "قهوة تركى سنجل", price: 45.00},
            ]
        }
      ];

    // --- Functions ---

    /**
     * Renders the full food menu.
     */
    function renderMenu() {
        fullMenu.innerHTML = '';
        menuData.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'menu-category-card';
            
            let itemsHtml = '<ul>';
            category.items.forEach(item => {
                itemsHtml += `<li><span>${item.name}</span><span class="item-price">${item.price.toFixed(2)} ج.م</span></li>`;
            });
            itemsHtml += '</ul>';

            categoryCard.innerHTML = `
                <h3>${category.name}</h3>
                ${itemsHtml}
            `;
            fullMenu.appendChild(categoryCard);
        });
    }

    /**
     * Renders a single order card.
     * @param {string} roomId - The room ID.
     * @param {string} orderId - The order ID.
     * @param {object} orderData - The order data from Firebase.
     */
    function renderOrderCard(roomId, orderId, orderData) {
        if (!hasOrders) {
            ordersList.innerHTML = ''; // Clear "no orders" message
            hasOrders = true;
        }

        const existingCard = document.getElementById(`order-${orderId}`);
        if (existingCard) {
            // Update existing card if needed, e.g., status
            const statusEl = existingCard.querySelector('.order-status');
            statusEl.textContent = getStatusText(orderData.status || 'pending');
            statusEl.className = `order-status ${orderData.status || 'pending'}`;
            return;
        }

        const card = document.createElement('div');
        card.className = 'order-card new';
        card.id = `order-${orderId}`;
        card.onclick = () => showOrderDetails(roomId, orderId, orderData);

        const time = new Date(orderData.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        const totalItems = orderData.items.reduce((sum, item) => sum + item.quantity, 0);

        card.innerHTML = `
            <div class="order-card-header">
                <span class="room-number">غرفة ${roomId.replace('room_', '')}</span>
                <span class="order-time">${time}</span>
            </div>
            <div class="order-card-body">
                <p><strong>النزيل:</strong> ${orderData.guestName || 'غير مسجل'}</p>
                <p><strong>عدد الأصناف:</strong> ${totalItems}</p>
                <p><strong>الإجمالي:</strong> ${orderData.total.toFixed(2)} ج.م</p>
            </div>
            <div class="order-card-footer">
                <span class="order-status ${orderData.status || 'pending'}">${getStatusText(orderData.status || 'pending')}</span>
            </div>
        `;
        ordersList.prepend(card); // Add new orders to the top

        setTimeout(() => card.classList.remove('new'), 1000);
    }
    
    /**
     * Returns Arabic text for order status.
     * @param {string} status - The status from Firebase.
     */
    function getStatusText(status) {
        switch(status) {
            case 'processing': return 'قيد التنفيذ';
            case 'completed': return 'مكتمل';
            case 'pending':
            default:
                return 'معلق';
        }
    }


    /**
     * Shows the modal with order details.
     * @param {string} roomId - The room ID.
     * @param {string} orderId - The order ID.
     * @param {object} orderData - The order data.
     */
    function showOrderDetails(roomId, orderId, orderData) {
        currentOrder = { roomId, orderId, data: orderData };
        let itemsTable = `
            <h3>تفاصيل الطلب</h3>
            <p><strong>غرفة:</strong> ${roomId.replace('room_', '')}</p>
            <p><strong>النزيل:</strong> ${orderData.guestName || 'غير مسجل'}</p>
            <p><strong>الهاتف:</strong> ${orderData.guestPhone || 'N/A'}</p>
            <table class="order-items-table">
                <thead>
                    <tr>
                        <th>الصنف</th>
                        <th>الكمية</th>
                        <th>السعر</th>
                        <th>الإجمالي</th>
                    </tr>
                </thead>
                <tbody>
        `;
        orderData.items.forEach(item => {
            itemsTable += `
                <tr>
                    <td>${item.name_ar || item.en_name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
            `;
        });
        itemsTable += `
                </tbody>
            </table>
            <p class="total-price">الإجمالي الكلي: ${orderData.total.toFixed(2)} ج.م</p>
        `;
        
        modalBody.innerHTML = itemsTable;
        modal.style.display = 'block';
    }

    /**
     * Sends a reply to the guest.
     */
    async function sendReply() {
        const message = replyMessageInput.value.trim();
        if (!message || !currentOrder) {
            alert('الرجاء كتابة رد أولاً.');
            return;
        }

        const { roomId, orderId } = currentOrder;
        const repliesRef = db.ref(`rooms/${roomId}/replies`);

        try {
            sendReplyBtn.disabled = true;
            sendReplyBtn.textContent = 'جاري الإرسال...';
            
            await repliesRef.push({
                text: message,
                orderId: orderId, // Link reply to the order
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });

            // Update order status to 'processing'
            await db.ref(`rooms/${roomId}/orders/${orderId}`).update({ status: 'processing' });
            
            alert('تم إرسال الرد بنجاح!');
            replyMessageInput.value = '';
            modal.style.display = 'none';

        } catch (error) {
            console.error("Error sending reply: ", error);
            alert('حدث خطأ أثناء إرسال الرد.');
        } finally {
            sendReplyBtn.disabled = false;
            sendReplyBtn.textContent = 'إرسال الرد';
        }
    }


    /**
     * Listens for new food orders from all rooms.
     */
    function listenForOrders() {
        const roomsRef = db.ref('rooms');
        roomsRef.on('child_added', (roomSnapshot) => {
            const roomId = roomSnapshot.key;
            const ordersRef = db.ref(`rooms/${roomId}/orders`);
            
            ordersRef.on('child_added', (orderSnapshot) => {
                renderOrderCard(roomId, orderSnapshot.key, orderSnapshot.val());
            });

            ordersRef.on('child_changed', (orderSnapshot) => {
                renderOrderCard(roomId, orderSnapshot.key, orderSnapshot.val());
            });
        });
    }

    // --- Event Listeners ---
    closeButton.onclick = () => {
        modal.style.display = "none";
        currentOrder = null;
    };
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
            currentOrder = null;
        }
    };
    sendReplyBtn.onclick = sendReply;


    // --- Initial Load ---
    renderMenu();
    listenForOrders();
});
