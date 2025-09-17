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
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();

    // --- DOM Elements ---
    const loginOverlay = document.getElementById('login-overlay');
    const loginBtn = document.getElementById('login-btn');
    const passwordInput = document.getElementById('password-input');
    const loginError = document.getElementById('login-error');
    const adminPanel = document.getElementById('admin-panel');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const logoutBtn = document.getElementById('logout-btn');
    
    const roomsContainer = document.getElementById('rooms-container');
    const messagesContainer = document.getElementById('messages-container');
    const ordersContainer = document.getElementById('orders-container');

    const detailsModal = document.getElementById('details-modal');
    const closeModalBtn = detailsModal.querySelector('.close-modal-btn');
    const modalBody = document.getElementById('modal-body');

    // --- Authentication ---
    const correctPassword = "admin"; // Simple password, replace with a secure method if needed

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

    loginBtn.addEventListener('click', () => {
        if (passwordInput.value === correctPassword) {
            sessionStorage.setItem('isAdminAuthenticated', 'true');
            checkAuth();
        } else {
            loginError.textContent = 'كلمة المرور غير صحيحة.';
            passwordInput.style.border = '1px solid red';
        }
    });
    
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });

    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('isAdminAuthenticated');
        checkAuth();
    });


    // --- UI Interactions ---
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('collapsed');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            contentSections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });

    closeModalBtn.addEventListener('click', () => detailsModal.classList.add('hidden'));
    detailsModal.addEventListener('click', (e) => {
        if (e.target === detailsModal) {
            detailsModal.classList.add('hidden');
        }
    });

    // --- Firebase Data Loading ---
    function loadInitialData() {
        const roomsRef = db.ref('rooms');
        
        roomsRef.on('value', (snapshot) => {
            const roomsData = snapshot.val();
            if (roomsData) {
                renderRooms(roomsData);
                renderMessagesAndOrders(roomsData);
                updateDashboardStats(roomsData);
            } else {
                 roomsContainer.innerHTML = '<p>لا توجد غرف لعرضها.</p>';
                 messagesContainer.innerHTML = '<p>لا توجد رسائل لعرضها.</p>';
                 ordersContainer.innerHTML = '<p>لا توجد طلبات لعرضها.</p>';
            }
        });
    }

    function renderRooms(rooms) {
        roomsContainer.innerHTML = '';
        Object.keys(rooms).forEach(roomId => {
            const roomData = rooms[roomId];
            const roomNumber = roomId.replace('room_', '');
            
            const comments = roomData.comments ? Object.values(roomData.comments) : [];
            const orders = roomData.orders ? Object.values(roomData.orders) : [];

            const card = document.createElement('div');
            card.className = 'room-card';
            card.dataset.status = 'مشغولة'; // Default status

            card.innerHTML = `
                <div class="room-card-header">
                    <h3>غرفة ${roomNumber}</h3>
                    <span class="status">مشغولة</span>
                </div>
                <div class="room-card-body">
                    <p>طلبات الخدمة: <strong>${comments.length}</strong></p>
                    <p>طلبات الطعام: <strong>${orders.length}</strong></p>
                    <p>آخر نشاط: <strong>${formatTimestamp(findLastActivity(roomData))}</strong></p>
                </div>
                <div class="room-card-actions">
                    <button class="action-btn view-details-btn" data-room-id="${roomId}">عرض التفاصيل</button>
                </div>
            `;
            roomsContainer.appendChild(card);
        });

        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const roomId = btn.dataset.roomId;
                showRoomDetails(roomId, rooms[roomId]);
            });
        });
    }
    
    function renderMessagesAndOrders(rooms) {
        messagesContainer.innerHTML = '';
        ordersContainer.innerHTML = '';
        
        const allMessages = [];
        const allOrders = [];

        Object.keys(rooms).forEach(roomId => {
            const roomData = rooms[roomId];
            const roomNumber = roomId.replace('room_', '');

            if (roomData.comments) {
                Object.values(roomData.comments).forEach(comment => {
                    allMessages.push({ ...comment, roomNumber, roomId, type: 'comment' });
                });
            }
             if (roomData.replies) {
                Object.values(roomData.replies).forEach(reply => {
                    allMessages.push({ ...reply, roomNumber, roomId, type: 'reply' });
                });
            }
            if (roomData.orders) {
                Object.values(roomData.orders).forEach(order => {
                    allOrders.push({ ...order, roomNumber, roomId });
                });
            }
        });
        
        // Sort by timestamp descending
        allMessages.sort((a,b) => b.timestamp - a.timestamp);
        allOrders.sort((a,b) => b.timestamp - a.timestamp);
        
        if (allMessages.length === 0) {
            messagesContainer.innerHTML = '<p>لا توجد رسائل لعرضها.</p>';
        } else {
             allMessages.forEach(msg => {
                const itemCard = createItemCard(msg);
                messagesContainer.appendChild(itemCard);
            });
        }
        
        if (allOrders.length === 0) {
             ordersContainer.innerHTML = '<p>لا توجد طلبات طعام لعرضها.</p>';
        } else {
             allOrders.forEach(order => {
                const itemCard = createItemCard(order);
                ordersContainer.appendChild(itemCard);
            });
        }
    }

    function createItemCard(item) {
        const card = document.createElement('div');
        card.className = 'item-card';

        let content = '';
        if (item.type === 'comment' || item.type === 'reply') { // Message
             content = `
                <div class="info">
                    <h4>${item.type === 'comment' ? 'رسالة من' : 'رد إلى'} غرفة ${item.roomNumber}</h4>
                    <p>${item.text}</p>
                </div>
                <div class="meta">
                    <span>${formatTimestamp(item.timestamp)}</span>
                    ${item.rating ? `<span>التقييم: ${'★'.repeat(item.rating)}</span>` : ''}
                </div>
            `;
        } else { // Order
            const itemsCount = item.items.reduce((sum, current) => sum + current.quantity, 0);
             content = `
                <div class="info">
                    <h4>طلب طعام من غرفة ${item.roomNumber}</h4>
                    <p>الاسم: ${item.guestName || 'غير مسجل'}</p>
                </div>
                <div class="meta">
                    <span>${formatTimestamp(item.timestamp)}</span>
                    <span>الأصناف: ${itemsCount}</span>
                    <span>الإجمالي: ${item.total.toFixed(2)} ج.م</span>
                </div>
            `;
        }
        
        card.innerHTML = `${content}
            <div class="actions">
                <button class="action-btn view-details-btn" data-room-id="${item.roomId}">عرض المحادثة</button>
            </div>
        `;
        
        card.querySelector('.view-details-btn').addEventListener('click', () => {
            db.ref('rooms/' + item.roomId).once('value', (snapshot) => {
                showRoomDetails(item.roomId, snapshot.val());
            });
        });

        return card;
    }

    function showRoomDetails(roomId, roomData) {
        const roomNumber = roomId.replace('room_', '');
        modalBody.innerHTML = `<h3>محادثة غرفة ${roomNumber}</h3>`;

        const chatHistory = document.createElement('div');
        chatHistory.className = 'chat-history';

        const comments = roomData.comments ? Object.entries(roomData.comments).map(([id, data]) => ({...data, id, type: 'comment'})) : [];
        const replies = roomData.replies ? Object.entries(roomData.replies).map(([id, data]) => ({...data, id, type: 'reply'})) : [];
        
        const allMessages = [...comments, ...replies].sort((a,b) => a.timestamp - b.timestamp);

        allMessages.forEach(msg => {
            const messageEl = document.createElement('div');
            messageEl.className = `chat-message ${msg.type === 'comment' ? 'user' : 'admin'}`;
            messageEl.innerHTML = `
                <div class="sender">${msg.type === 'comment' ? `النزيل (غرفة ${roomNumber})` : 'الإدارة'}</div>
                <p>${msg.text}</p>
                <div class="timestamp">${formatTimestamp(msg.timestamp)}</div>
            `;
            chatHistory.appendChild(messageEl);
        });

        modalBody.appendChild(chatHistory);
        
        // Reply Form
        const replyForm = document.createElement('div');
        replyForm.id = 'reply-form';
        replyForm.innerHTML = `
            <h4>إرسال رد</h4>
            <textarea id="reply-text-area" placeholder="اكتب ردك هنا..."></textarea>
            <button id="send-reply-btn">إرسال الرد</button>
        `;
        
        modalBody.appendChild(replyForm);

        document.getElementById('send-reply-btn').addEventListener('click', async () => {
            const replyText = document.getElementById('reply-text-area').value.trim();
            if (replyText) {
                const replyRef = db.ref(`rooms/${roomId}/replies`);
                try {
                    await replyRef.push({
                        text: replyText,
                        timestamp: firebase.database.ServerValue.TIMESTAMP
                    });
                    showToast('تم إرسال الرد بنجاح', 'success');
                    // No need to close modal immediately, let admin see the sent message
                } catch(err) {
                    showToast('خطأ في إرسال الرد', 'error');
                }
            }
        });

        detailsModal.classList.remove('hidden');
    }
    
    function updateDashboardStats(rooms) {
        let occupiedCount = 0;
        let serviceCount = 0;
        let orderCount = 0;
        let totalRating = 0;
        let ratingCount = 0;

        Object.values(rooms).forEach(room => {
            occupiedCount++;
            if (room.comments) {
                const comments = Object.values(room.comments);
                serviceCount += comments.length;
                comments.forEach(c => {
                    if (c.rating) {
                        totalRating += c.rating;
                        ratingCount++;
                    }
                });
            }
            if (room.orders) {
                orderCount += Object.values(room.orders).length;
            }
        });

        document.getElementById('occupied-rooms-count').textContent = occupiedCount;
        document.getElementById('service-requests-count').textContent = serviceCount;
        document.getElementById('food-orders-count').textContent = orderCount;
        document.getElementById('average-rating').textContent = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 'N/A';
    }


    // --- Utility Functions ---
    function formatTimestamp(ts) {
        if (!ts) return 'غير متوفر';
        return new Date(ts).toLocaleString('ar-EG', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }

    function findLastActivity(roomData) {
        const lastCommentTs = roomData.comments ? Math.max(...Object.values(roomData.comments).map(c => c.timestamp)) : 0;
        const lastReplyTs = roomData.replies ? Math.max(...Object.values(roomData.replies).map(r => r.timestamp)) : 0;
        const lastOrderTs = roomData.orders ? Math.max(...Object.values(roomData.orders).map(o => o.timestamp)) : 0;
        return Math.max(lastCommentTs, lastReplyTs, lastOrderTs);
    }
    
     function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        // Trigger the animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Remove the toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // --- Initial Load ---
    checkAuth();
});
