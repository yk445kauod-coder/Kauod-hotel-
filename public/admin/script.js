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

    // --- Initialize Firebase ---
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.database();

    // --- DOM Elements ---
    const loginOverlay = document.getElementById('login-overlay');
    const adminPanel = document.getElementById('admin-panel');
    const loginButton = document.getElementById('login-button');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    const logoutButton = document.getElementById('logout-button');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');
    const modalOverlay = document.getElementById('details-modal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const sendReplyBtn = document.getElementById('send-reply-button');
    const replyTextarea = document.getElementById('reply-textarea');

    // --- State ---
    let currentRoomId = null;

    // --- Authentication ---
    function checkAuth() {
        if (sessionStorage.getItem('isAdminAuthenticated') === 'true') {
            loginOverlay.classList.add('hidden');
            adminPanel.classList.remove('hidden');
            loadInitialData();
        } else {
            loginOverlay.classList.remove('hidden');
            adminPanel.classList.add('hidden');
        }
    }

    loginButton.addEventListener('click', () => {
        if (passwordInput.value === 'admin123') {
            sessionStorage.setItem('isAdminAuthenticated', 'true');
            checkAuth();
        } else {
            loginError.textContent = 'كلمة المرور غير صحيحة.';
            setTimeout(() => loginError.textContent = '', 3000);
        }
    });

    logoutButton.addEventListener('click', () => {
        sessionStorage.removeItem('isAdminAuthenticated');
        checkAuth();
        location.reload();
    });

    // --- Navigation ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);

            sections.forEach(section => {
                section.classList.add('hidden');
            });
            document.getElementById(targetId).classList.remove('hidden');

            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // --- Data Loading & Real-time Updates ---
    function loadInitialData() {
        const roomsRef = db.ref('rooms');
        roomsRef.on('value', snapshot => {
            const roomsData = snapshot.val() || {};
            updateDashboard(roomsData);
            updateRoomsGrid(roomsData);
            updateMessagesList(roomsData);
            updateOrdersList(roomsData);
        });
    }

    function updateDashboard(roomsData) {
        let occupiedRooms = 0;
        let newMessages = 0;
        let newOrders = 0;
        let totalRating = 0;
        let ratingCount = 0;

        Object.values(roomsData).forEach(room => {
            occupiedRooms++;
            if (room.comments) {
                Object.values(room.comments).forEach(comment => {
                    if (!comment.isRead) newMessages++;
                    if (comment.rating) {
                        totalRating += comment.rating;
                        ratingCount++;
                    }
                });
            }
             if (room.orders) {
                Object.values(room.orders).forEach(order => {
                    if (order.status === 'pending') newOrders++;
                });
            }
        });

        document.getElementById('occupied-rooms-count').textContent = occupiedRooms;
        document.getElementById('new-messages-count').textContent = newMessages;
        document.getElementById('new-orders-count').textContent = newOrders;
        document.getElementById('average-rating').textContent = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 'N/A';
        document.getElementById('notification-count').textContent = newMessages + newOrders;
    }

    function updateRoomsGrid(roomsData) {
        const roomsGrid = document.getElementById('rooms-grid');
        roomsGrid.innerHTML = '';
        Object.keys(roomsData).forEach(roomId => {
            const roomData = roomsData[roomId];
            const roomCard = document.createElement('div');
            roomCard.className = 'room-card occupied'; // Simplified status
            
            const roomNumber = roomId.replace('room_', '');
            
            roomCard.innerHTML = `
                <div class="room-card-header">
                    <h3>غرفة ${roomNumber}</h3>
                    <span class="room-status occupied">مشغولة</span>
                </div>
                <div class="room-card-body">
                    <p><strong>آخر نشاط:</strong> ${roomData.lastActivity ? new Date(roomData.lastActivity).toLocaleString() : 'لا يوجد'}</p>
                </div>
                <div class="room-card-actions">
                    <button class="details-btn" data-room-id="${roomId}">عرض التفاصيل</button>
                </div>
            `;
            roomsGrid.appendChild(roomCard);
        });
         // Add event listeners for new buttons
        document.querySelectorAll('.details-btn').forEach(button => {
            button.addEventListener('click', () => {
                openDetailsModal(button.dataset.roomId);
            });
        });
    }

    function updateMessagesList(roomsData) {
        const messagesList = document.getElementById('messages-list');
        messagesList.innerHTML = '';
        const allMessages = [];

        Object.keys(roomsData).forEach(roomId => {
            const roomData = roomsData[roomId];
            if (roomData.comments) {
                Object.keys(roomData.comments).forEach(commentId => {
                    allMessages.push({ ...roomData.comments[commentId], roomId, commentId, type: 'comment' });
                });
            }
        });
        
        allMessages.sort((a, b) => b.timestamp - a.timestamp);

        allMessages.forEach(msg => {
            const messageItem = document.createElement('div');
            messageItem.className = `message-item ${!msg.isRead ? 'new' : ''}`;
            const roomNumber = msg.roomId.replace('room_', '');

            messageItem.innerHTML = `
                <div class="message-info">
                    <p><strong>غرفة ${roomNumber}:</strong> ${msg.text.substring(0, 50)}...</p>
                    <p class="meta">
                        <span>${new Date(msg.timestamp).toLocaleString()}</span>
                        ${msg.rating ? `<span> - <i class="fas fa-star" style="color: #FFC107;"></i> ${msg.rating}</span>` : ''}
                    </p>
                </div>
                <div class="message-actions">
                    <button class="details-btn" data-room-id="${msg.roomId}" data-comment-id="${msg.commentId}">الرد والتفاصيل</button>
                </div>
            `;
            messagesList.appendChild(messageItem);
        });
        document.querySelectorAll('.details-btn').forEach(button => {
            button.addEventListener('click', () => {
                openDetailsModal(button.dataset.roomId, button.dataset.commentId);
            });
        });
    }
    
    function updateOrdersList(roomsData) {
        const ordersList = document.getElementById('orders-list');
        ordersList.innerHTML = '';
        const allOrders = [];

        Object.keys(roomsData).forEach(roomId => {
            const roomData = roomsData[roomId];
            if (roomData.orders) {
                Object.keys(roomData.orders).forEach(orderId => {
                    allOrders.push({ ...roomData.orders[orderId], roomId, orderId });
                });
            }
        });

        allOrders.sort((a, b) => b.timestamp - a.timestamp);
        
        allOrders.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.className = `order-item ${order.status === 'pending' ? 'new' : ''}`;
             const roomNumber = order.roomId.replace('room_', '');

            orderItem.innerHTML = `
                 <div class="order-info">
                    <p><strong>طلب طعام من غرفة ${roomNumber}</strong></p>
                    <p>الإجمالي: ${order.total.toFixed(2)} ج.م</p>
                    <p class="meta">
                        <span>${new Date(order.timestamp).toLocaleString()}</span>
                         - <span class="status-${order.status}">${translateStatus(order.status)}</span>
                    </p>
                </div>
                <div class="order-actions">
                     <button class="details-btn" data-room-id="${order.roomId}" data-order-id="${order.orderId}">التفاصيل</button>
                     ${order.status === 'pending' ? `<button class="update-status-btn" data-room-id="${order.roomId}" data-order-id="${order.orderId}" data-new-status="processing">بدء التجهيز</button>` : ''}
                     ${order.status === 'processing' ? `<button class="update-status-btn" data-room-id="${order.roomId}" data-order-id="${order.orderId}" data-new-status="completed">تم التسليم</button>` : ''}
                </div>
            `;
            ordersList.appendChild(orderItem);
        });
        
        document.querySelectorAll('.details-btn').forEach(button => {
            button.addEventListener('click', () => {
                openDetailsModal(button.dataset.roomId, null, button.dataset.orderId);
            });
        });
        document.querySelectorAll('.update-status-btn').forEach(button => {
            button.addEventListener('click', () => {
                updateOrderStatus(button.dataset.roomId, button.dataset.orderId, button.dataset.newStatus);
            });
        });
    }


    // --- Modal ---
    async function openDetailsModal(roomId, commentId = null, orderId = null) {
        currentRoomId = roomId;
        const roomNumber = roomId.replace('room_', '');
        let content = '';

        const roomRef = db.ref(`rooms/${roomId}`);
        const snapshot = await roomRef.once('value');
        const roomData = snapshot.val();
        
        content += `<h4>سجل غرفة ${roomNumber}</h4>`;
        
        const allItems = [];
        if(roomData.comments) Object.entries(roomData.comments).forEach(([id, c]) => allItems.push({...c, id, type: 'comment'}));
        if(roomData.orders) Object.entries(roomData.orders).forEach(([id, o]) => allItems.push({...o, id, type: 'order'}));
        if(roomData.replies) Object.entries(roomData.replies).forEach(([id, r]) => allItems.push({...r, id, type: 'reply'}));

        allItems.sort((a,b) => a.timestamp - b.timestamp);

        content += '<div class="conversation-history">';
        allItems.forEach(item => {
            if(item.type === 'comment') {
                content += `<div class="chat-bubble guest"><p>${item.text}</p><span class="timestamp">${new Date(item.timestamp).toLocaleTimeString()}</span></div>`;
            } else if (item.type === 'order') {
                 content += `<div class="chat-bubble guest"><p><strong>طلب طعام:</strong> ${item.items.map(i => `${i.quantity}x ${i.name_ar}`).join(', ')}</p><span class="timestamp">${new Date(item.timestamp).toLocaleTimeString()}</span></div>`;
            } else if(item.type === 'reply') {
                content += `<div class="chat-bubble admin"><p>${item.text}</p><span class="timestamp">${new Date(item.timestamp).toLocaleTimeString()}</span></div>`;
            }
        });
        content += '</div>';

        modalTitle.textContent = `محادثة مع غرفة ${roomNumber}`;
        modalBody.innerHTML = content;
        modalOverlay.classList.remove('hidden');
    }

    modalCloseBtn.addEventListener('click', () => modalOverlay.classList.add('hidden'));

    sendReplyBtn.addEventListener('click', async () => {
        const text = replyTextarea.value.trim();
        if (!text || !currentRoomId) return;

        const replyData = {
            text: text,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            role: 'admin'
        };

        try {
            const repliesRef = db.ref(`rooms/${currentRoomId}/replies`);
            await repliesRef.push(replyData);
            showToast('تم إرسال الرد بنجاح.', 'success');
            replyTextarea.value = '';
            // Refresh modal content
            openDetailsModal(currentRoomId);
        } catch (error) {
            console.error("Error sending reply:", error);
            showToast('حدث خطأ أثناء إرسال الرد.', 'error');
        }
    });
    
    // --- Actions ---
    async function updateOrderStatus(roomId, orderId, newStatus) {
        const orderStatusRef = db.ref(`rooms/${roomId}/orders/${orderId}/status`);
        try {
            await orderStatusRef.set(newStatus);
            showToast(`تم تحديث حالة الطلب إلى: ${translateStatus(newStatus)}`, 'info');
             // Also send a reply to the guest
            const replyText = `تم تحديث حالة طلب الطعام الخاص بك. الحالة الآن: ${translateStatus(newStatus)}.`;
            const repliesRef = db.ref(`rooms/${roomId}/replies`);
             await repliesRef.push({
                text: replyText,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                role: 'admin'
            });

        } catch (error) {
            showToast('خطأ في تحديث حالة الطلب.', 'error');
            console.error('Error updating status:', error);
        }
    }


    // --- Utilities ---
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
    
    function translateStatus(status) {
        switch(status) {
            case 'pending': return 'معلق';
            case 'processing': return 'قيد التجهيز';
            case 'completed': return 'مكتمل';
            case 'cancelled': return 'ملغي';
            default: return status;
        }
    }

    // --- Initial Load ---
    checkAuth();
});
