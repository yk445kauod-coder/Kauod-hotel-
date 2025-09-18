document.addEventListener('DOMContentLoaded', () => {
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

    const passwordPrompt = document.getElementById('password-prompt');
    const passwordInput = document.getElementById('password-input');
    const passwordSubmit = document.getElementById('password-submit');
    const adminPanel = document.getElementById('admin-panel');
    const loadingOverlay = document.getElementById('loading-overlay');
    const newOrdersContainer = document.getElementById('new-orders-container');
    const inProgressOrdersContainer = document.getElementById('in-progress-orders-container');
    const completedOrdersContainer = document.getElementById('completed-orders-container');
    const roomsList = document.getElementById('rooms-list');
    const chatList = document.getElementById('chat-list');
    const notificationSound = document.getElementById('notification-sound');

    const correctPassword = "admin"; // Replace with a more secure method in production

    passwordSubmit.addEventListener('click', () => {
        if (passwordInput.value === correctPassword) {
            passwordPrompt.style.display = 'none';
            adminPanel.style.display = 'flex';
            loadingOverlay.style.display = 'none';
            loadInitialData();
        } else {
            alert('Incorrect password.');
        }
    });
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        notificationSound.play();
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    function loadInitialData() {
        listenForRooms();
        listenForOrders();
        listenForMessages();
    }
    
    function listenForRooms() {
        const activeUsersRef = db.ref('active_users');
        activeUsersRef.on('value', (snapshot) => {
            const activeUsers = snapshot.val() || {};
            const activeRoomNumbers = Object.keys(activeUsers).map(key => key.replace('room_', ''));
            
            // Assuming total rooms from 101 to 120 for example
            const totalRooms = Array.from({length: 20}, (_, i) => 101 + i); 
            
            roomsList.innerHTML = '';
            totalRooms.forEach(roomNumber => {
                const isOccupied = activeRoomNumbers.includes(roomNumber.toString());
                const roomElement = document.createElement('div');
                roomElement.className = `room-card ${isOccupied ? 'occupied' : 'vacant'}`;
                roomElement.innerHTML = `
                    <div class="room-number">غرفة ${roomNumber}</div>
                    <div class="room-status">${isOccupied ? 'مشغولة' : 'شاغرة'}</div>
                `;
                roomsList.appendChild(roomElement);
            });
        });
    }

    function listenForOrders() {
        const ordersRef = db.ref('rooms');
        ordersRef.on('child_added', (roomSnapshot) => handleRoomForOrder(roomSnapshot));
        ordersRef.on('child_changed', (roomSnapshot) => handleRoomForOrder(roomSnapshot));
    }
    
    function handleRoomForOrder(roomSnapshot) {
        const roomData = roomSnapshot.val();
        const roomKey = roomSnapshot.key;
        const roomNumber = roomKey.replace('room_', '');

        if (roomData.comments) {
            Object.entries(roomData.comments).forEach(([commentId, comment]) => {
                if (comment.type === 'Food Order') {
                    const orderId = `order_${roomKey}_${commentId}`;
                    if (!document.getElementById(orderId)) {
                        createOrderCard(orderId, roomNumber, comment, commentId);
                        showNotification(`طلب طعام جديد من غرفة ${roomNumber}`);
                    }
                }
            });
        }
    }

    function createOrderCard(orderId, roomNumber, order, commentId) {
        const card = document.createElement('div');
        card.className = 'order-card new-order';
        card.id = orderId;
        const timestamp = new Date(order.timestamp).toLocaleTimeString('ar-EG');

        card.innerHTML = `
            <div class="order-header">
                <span class="room-number">غرفة ${roomNumber}</span>
                <span class="order-time">${timestamp}</span>
            </div>
            <div class="order-body">
                <p><strong>الاسم:</strong> ${order.guestName || 'غير محدد'}</p>
                <p><strong>الطلب:</strong> ${order.text}</p>
                <p><strong>الإجمالي:</strong> ${order.total} جم</p>
            </div>
            <div class="order-actions">
                <button class="action-btn start-processing">بدء التنفيذ</button>
                <button class="action-btn complete-order">إتمام الطلب</button>
            </div>
        `;
        
        newOrdersContainer.prepend(card);

        card.querySelector('.start-processing').addEventListener('click', () => {
            card.classList.remove('new-order');
            card.classList.add('in-progress-order');
            inProgressOrdersContainer.prepend(card);
            updateOrderStatusInDB(roomNumber, commentId, 'in-progress');
        });

        card.querySelector('.complete-order').addEventListener('click', () => {
            card.classList.remove('in-progress-order', 'new-order');
            card.classList.add('completed-order');
            completedOrdersContainer.prepend(card);
            updateOrderStatusInDB(roomNumber, commentId, 'completed');
        });
    }
    
    function updateOrderStatusInDB(roomNumber, commentId, status) {
        const commentRef = db.ref(`rooms/room_${roomNumber}/comments/${commentId}`);
        commentRef.update({ order_status: status });
    }

    function listenForMessages() {
        const roomsRef = db.ref('rooms');
        roomsRef.on('child_added', (roomSnapshot) => handleRoomForMessage(roomSnapshot));
        roomsRef.on('child_changed', (roomSnapshot) => handleRoomForMessage(roomSnapshot));
    }
    
    function handleRoomForMessage(roomSnapshot) {
        const roomData = roomSnapshot.val();
        const roomKey = roomSnapshot.key;
        const roomNumber = roomKey.replace('room_', '');

        if(roomData.comments || roomData.replies) {
             const existingCard = document.querySelector(`.chat-summary-card[data-room='${roomNumber}']`);
             if(existingCard) existingCard.remove();
             
             const card = document.createElement('div');
             card.className = 'chat-summary-card';
             card.setAttribute('data-room', roomNumber);

             const allMessages = [];
             if (roomData.comments) {
                Object.values(roomData.comments).forEach(c => allMessages.push(c));
             }
              if (roomData.replies) {
                Object.values(roomData.replies).forEach(r => allMessages.push(r));
             }
             allMessages.sort((a,b) => a.timestamp - b.timestamp);
             const lastMessage = allMessages[allMessages.length-1];

             card.innerHTML = `<div class="room-number">غرفة ${roomNumber}</div>
                             <p class="last-message">${lastMessage.text}</p>
                             <span class="message-time">${new Date(lastMessage.timestamp).toLocaleTimeString('ar-EG')}</span>`;
             
             chatList.prepend(card);

             card.addEventListener('click', () => openChatModal(roomNumber, roomData));
        }
    }
    
    function openChatModal(roomNumber, roomData) {
        const modal = document.getElementById('chat-modal');
        const content = document.getElementById('chat-modal-content');
        const closeBtn = document.getElementById('chat-modal-close');
        const messageContainer = document.getElementById('chat-messages');
        const replyInput = document.getElementById('chat-reply-input');
        const sendReplyBtn = document.getElementById('chat-send-reply');

        content.querySelector('h2').textContent = `المحادثة مع غرفة ${roomNumber}`;
        messageContainer.innerHTML = '';

        const allMessages = [];
        if (roomData.comments) {
            Object.values(roomData.comments).forEach(msg => allMessages.push({ ...msg, role: 'user' }));
        }
        if (roomData.replies) {
            Object.values(roomData.replies).forEach(msg => allMessages.push({ ...msg, role: 'admin' }));
        }

        allMessages.sort((a, b) => a.timestamp - b.timestamp);

        allMessages.forEach(msg => {
            const msgElement = document.createElement('div');
            msgElement.className = `chat-bubble ${msg.role}`;
            msgElement.innerHTML = `<p>${msg.text}</p><span class="timestamp">${new Date(msg.timestamp).toLocaleTimeString('ar-EG')}</span>`;
            messageContainer.appendChild(msgElement);
        });

        sendReplyBtn.onclick = () => {
            const replyText = replyInput.value.trim();
            if (replyText) {
                const repliesRef = db.ref(`rooms/room_${roomNumber}/replies`);
                const newReply = {
                    text: replyText,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                };
                push(repliesRef, newReply);
                replyInput.value = '';
            }
        };

        modal.style.display = 'flex';
        closeBtn.onclick = () => modal.style.display = 'none';
    }
});
