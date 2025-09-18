document.addEventListener('DOMContentLoaded', function () {
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

    const roomsContainer = document.getElementById('rooms-container');
    const messagesContainer = document.getElementById('messages-container');
    const newOrdersContainer = document.getElementById('new-orders');
    const inProgressOrdersContainer = document.getElementById('in-progress-orders');
    const completedOrdersContainer = document.getElementById('completed-orders');
    
    const replyModal = document.getElementById('reply-modal');
    const closeModalBtn = document.querySelector('.close-button');
    const sendReplyBtn = document.getElementById('send-reply-btn');
    const replyModalTitle = document.getElementById('reply-modal-title');
    const modalGuestMessage = document.getElementById('modal-guest-message');
    const replyMessageTextarea = document.getElementById('reply-message');
    const notificationSound = document.getElementById('notification-sound');

    // Stats
    const activeRoomsStat = document.getElementById('active-rooms-stat');
    const newOrdersStat = document.getElementById('new-orders-stat');
    const newMessagesStat = document.getElementById('new-messages-stat');
    const newOrdersCountBadge = document.getElementById('new-orders-count');
    const newMessagesCountBadge = document.getElementById('new-messages-count');


    let currentReplyContext = null;

    // --- Navigation ---
    const navItems = document.querySelectorAll('.nav-item, .quick-access-item');
    const sections = document.querySelectorAll('.dashboard-section');

    function switchTab(targetId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(targetId).classList.add('active');

        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.target === targetId) {
                item.classList.add('active');
            }
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.dataset.target;
            switchTab(targetId);
        });
    });

    function playNotificationSound() {
        notificationSound.currentTime = 0;
        notificationSound.play().catch(error => console.error("Audio playback failed:", error));
    }
    
    function updateBadge(badge, count) {
        badge.textContent = count;
        if (count > 0) {
            badge.classList.add('visible');
        } else {
            badge.classList.remove('visible');
        }
    }


    // --- Rooms Logic ---
    function renderRooms(roomsData, activeUsers) {
        if (!roomsContainer) return;
        roomsContainer.innerHTML = '';
        const roomNumbers = Object.keys(roomsData);
        let activeRoomsCount = 0;

        // Sort rooms numerically
        roomNumbers.sort((a, b) => parseInt(a.replace('room_', '')) - parseInt(b.replace('room_', '')));

        for (const roomKey of roomNumbers) {
            const roomNumber = roomKey.replace('room_', '');
            const isActive = activeUsers.hasOwnProperty(roomKey);
            if (isActive) activeRoomsCount++;

            const roomCard = document.createElement('div');
            roomCard.className = 'room-card';
            roomCard.innerHTML = `
                <div class="room-card-header">
                    <h4>غرفة ${roomNumber}</h4>
                    <span class="room-status ${isActive ? 'occupied' : 'vacant'}">
                        ${isActive ? 'مشغولة' : 'شاغرة'}
                    </span>
                </div>
                <ul class="room-details">
                    <li><i class="fas fa-comment-dots"></i><span id="room-${roomNumber}-last-message">لا توجد رسائل</span></li>
                    <li><i class="fas fa-concierge-bell"></i><span id="room-${roomNumber}-pending-orders">0 طلبات معلقة</span></li>
                </ul>
            `;
            roomsContainer.appendChild(roomCard);
        }
        activeRoomsStat.textContent = activeRoomsCount;
    }

    // --- Messages Logic ---
    function renderMessages(messagesData) {
        if (!messagesContainer) return;
        messagesContainer.innerHTML = '';
        let newMessagesCount = 0;

        const allMessages = [];
        for (const roomKey in messagesData) {
             const roomMessages = messagesData[roomKey].comments;
             if(roomMessages) {
                 for(const msgId in roomMessages) {
                     allMessages.push({ ...roomMessages[msgId], roomKey, msgId, type: 'comment' });
                 }
             }
             const roomReplies = messagesData[roomKey].replies;
             if(roomReplies) {
                 for(const replyId in roomReplies) {
                     allMessages.push({ ...roomReplies[replyId], roomKey, replyId, type: 'reply' });
                 }
             }
        }

        allMessages.sort((a, b) => b.timestamp - a.timestamp);
        
        const latestUserMessages = {};
        for(const message of allMessages) {
            if(message.type === 'comment' && !latestUserMessages[message.roomKey]) {
                latestUserMessages[message.roomKey] = message;
            }
        }
        
        Object.values(latestUserMessages).forEach(message => {
            if (!message.isRead) newMessagesCount++;
            
            const messageItem = document.createElement('div');
            messageItem.className = `message-item ${!message.isRead ? 'unread' : ''}`;
            messageItem.dataset.room = message.roomKey;
            messageItem.dataset.id = message.msgId;

            const roomNumber = message.roomKey.replace('room_', '');
            const time = new Date(message.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

            let ratingHtml = '';
            if (message.rating) {
                ratingHtml = `<div class="message-rating">` + '★'.repeat(message.rating) + '☆'.repeat(5 - message.rating) + `</div>`;
            }

            messageItem.innerHTML = `
                <div class="message-header">
                    <span class="room-number">غرفة ${roomNumber} - ${message.guestName || ''}</span>
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-body">
                    <p>${message.text}</p>
                    ${ratingHtml}
                </div>
                <div class="message-actions">
                    <button class="reply-btn"><i class="fas fa-reply"></i> رد</button>
                </div>
            `;
            messagesContainer.appendChild(messageItem);

             // Update last message in room card
            const lastMessageSpan = document.getElementById(`room-${roomNumber}-last-message`);
            if (lastMessageSpan) {
                lastMessageSpan.textContent = message.text.substring(0, 30) + '...';
            }
        });

        newMessagesStat.textContent = newMessagesCount;
        updateBadge(newMessagesCountBadge, newMessagesCount);

        document.querySelectorAll('.message-item .reply-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const messageItem = e.target.closest('.message-item');
                const roomKey = messageItem.dataset.room;
                const messageId = messageItem.dataset.id;
                const guestMessage = messageItem.querySelector('.message-body p').textContent;
                
                openReplyModal({
                    type: 'message',
                    roomKey,
                    messageId,
                    guestMessage,
                    roomNumber: roomKey.replace('room_', '')
                });

                // Mark as read
                db.ref(`rooms/${roomKey}/comments/${messageId}/isRead`).set(true);
            });
        });
    }

    // --- Orders Logic ---
    function renderOrder(orderId, orderData) {
        const roomNumber = orderData.roomKey.replace('room_', '');
        const time = new Date(orderData.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: 'digit' });

        const orderCard = document.createElement('div');
        orderCard.className = `order-card ${orderData.status}`;
        orderCard.id = `order-${orderId}`;
        orderCard.dataset.id = orderId;
        orderCard.dataset.roomKey = orderData.roomKey;
        
        let itemsHtml = '';
        if (orderData.text) {
             itemsHtml = orderData.text.split(',').map(item => `<li>${item.trim()}</li>`).join('');
        }
       
        orderCard.innerHTML = `
            <div class="order-header">
                <span class="room-number">غرفة ${roomNumber}</span>
                <span class="order-time">${time}</span>
            </div>
            <div class="order-details">
                <ul>${itemsHtml}</ul>
                ${orderData.total ? `<div class="order-total">الإجمالي: ${orderData.total.toFixed(2)} ج.م</div>` : ''}
            </div>
            <div class="order-actions">
                ${orderData.status === 'new' ? '<button class="start-btn"><i class="fas fa-play"></i> بدء التنفيذ</button>' : ''}
                ${orderData.status === 'in-progress' ? '<button class="complete-btn"><i class="fas fa-check"></i> إتمام الطلب</button>' : ''}
                <button class="reply-btn"><i class="fas fa-reply"></i> رد على النزيل</button>
            </div>
        `;
        
        return orderCard;
    }
    
    function placeOrderInColumn(orderCard, status) {
        if (status === 'new') newOrdersContainer.prepend(orderCard);
        else if (status === 'in-progress') inProgressOrdersContainer.prepend(orderCard);
        else if (status === 'completed') completedOrdersContainer.prepend(orderCard);
        
        // Attach event listeners
        const startBtn = orderCard.querySelector('.start-btn');
        if (startBtn) startBtn.addEventListener('click', () => updateOrderStatus(orderCard.dataset.id, 'in-progress'));

        const completeBtn = orderCard.querySelector('.complete-btn');
        if (completeBtn) completeBtn.addEventListener('click', () => updateOrderStatus(orderCard.dataset.id, 'completed'));

        orderCard.querySelector('.reply-btn').addEventListener('click', () => {
             openReplyModal({
                type: 'order',
                roomKey: orderCard.dataset.roomKey,
                orderId: orderCard.dataset.id,
                guestMessage: `بخصوص طلبك رقم ${orderCard.dataset.id.slice(-4)}`,
                roomNumber: orderCard.dataset.roomKey.replace('room_', '')
            });
        });
    }

    function updateOrderStatus(orderId, newStatus) {
        db.ref(`orders/${orderId}/status`).set(newStatus);
    }
    
    function updateOrderStats(orders) {
        const orderCounts = { new: 0, 'in-progress': 0, completed: 0 };
        const pendingOrdersByRoom = {};

        Object.values(orders).forEach(order => {
            if (order.status) {
                orderCounts[order.status]++;
                if (order.status === 'new' || order.status === 'in-progress') {
                    const roomNumber = order.roomKey.replace('room_', '');
                    pendingOrdersByRoom[roomNumber] = (pendingOrdersByRoom[roomNumber] || 0) + 1;
                }
            }
        });
        
        newOrdersStat.textContent = orderCounts.new;
        updateBadge(newOrdersCountBadge, orderCounts.new);

        document.querySelectorAll('[id$="-pending-orders"]').forEach(span => span.textContent = '0 طلبات معلقة');
        for(const roomNumber in pendingOrdersByRoom) {
            const span = document.getElementById(`room-${roomNumber}-pending-orders`);
            if (span) {
                span.textContent = `${pendingOrdersByRoom[roomNumber]} طلبات معلقة`;
            }
        }
    }


    // --- Firebase Listeners ---
    function setupListeners() {
        const roomsRef = db.ref('rooms');
        const activeUsersRef = db.ref('active_users');
        const ordersRef = db.ref('orders');

        let roomsData = {};
        let activeUsersData = {};
        let ordersData = {};
        
        let initialOrdersLoaded = false;
        
        // Listen for all data changes
        db.ref().on('value', snapshot => {
            const allData = snapshot.val() || {};
            roomsData = allData.rooms || {};
            activeUsersData = allData.active_users || {};
            
            // Initial render
            renderRooms(roomsData, activeUsersData);
            renderMessages(roomsData);

            // Handle orders separately for real-time updates
        }, error => console.error(error));

        // Orders listener for granular updates
        ordersRef.on('child_added', (snapshot) => {
            const orderId = snapshot.key;
            const orderData = snapshot.val();
            ordersData[orderId] = orderData;
            
            const orderCard = renderOrder(orderId, orderData);
            placeOrderInColumn(orderCard, orderData.status);

            if (initialOrdersLoaded && orderData.status === 'new') {
                playNotificationSound();
                orderCard.classList.add('newly-added');
            }
            updateOrderStats(ordersData);
        });
        
        ordersRef.on('child_changed', (snapshot) => {
            const orderId = snapshot.key;
            const orderData = snapshot.val();
            ordersData[orderId] = orderData;
            
            const existingCard = document.getElementById(`order-${orderId}`);
            if (existingCard) existingCard.remove();
            
            const newCard = renderOrder(orderId, orderData);
            placeOrderInColumn(newCard, orderData.status);
            updateOrderStats(ordersData);
        });

        ordersRef.on('child_removed', (snapshot) => {
            const orderId = snapshot.key;
            delete ordersData[orderId];
            const existingCard = document.getElementById(`order-${orderId}`);
            if (existingCard) existingCard.remove();
            updateOrderStats(ordersData);
        });
        
        ordersRef.once('value', () => {
            initialOrdersLoaded = true;
        });
    }

    // --- Modal Logic ---
    function openReplyModal(context) {
        currentReplyContext = context;
        replyModalTitle.textContent = `الرد على نزيل غرفة ${context.roomNumber}`;
        modalGuestMessage.innerHTML = `<p>${context.guestMessage}</p>`;
        replyMessageTextarea.value = '';
        replyModal.style.display = 'block';
    }

    function closeReplyModal() {
        replyModal.style.display = 'none';
        currentReplyContext = null;
    }


    closeModalBtn.addEventListener('click', closeReplyModal);
    window.addEventListener('click', (e) => {
        if (e.target == replyModal) {
            closeReplyModal();
        }
    });

    sendReplyBtn.addEventListener('click', () => {
        if (!currentReplyContext || !replyMessageTextarea.value.trim()) return;

        const { roomKey } = currentReplyContext;
        const repliesRef = db.ref(`rooms/${roomKey}/replies`);
        
        const newReply = {
            text: replyMessageTextarea.value,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            isRead: false
        };

        repliesRef.push(newReply)
            .then(() => {
                console.log('Reply sent successfully');
                closeReplyModal();
            })
            .catch(error => console.error('Failed to send reply:', error));
    });
    
    // Initialize
    setupListeners();
    switchTab('dashboard-section'); // Start on dashboard
});
