document.addEventListener('DOMContentLoaded', function() {
    const bodyElement = document.body;
    const htmlElement = document.documentElement;
    let userBalance = 0;
    let jwtToken = localStorage.getItem('jwtToken');
    let notificationCounter = 0;
    let notificationQueue = [];
    let items = [];
    let purchasedItems = [];

    bodyElement.classList.add('no-transitions');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const defaultTheme = prefersDark ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', defaultTheme);
        localStorage.setItem('theme', defaultTheme);
    }

    setTimeout(() => {
        bodyElement.classList.remove('no-transitions');
    }, 0);

    if (!jwtToken) {
        window.location.href = '../login';
        return;
    }

    loadData();

    initNotifications();

    const categoryButtons = document.querySelectorAll('.shop-category');
    const subcategoryContainers = document.querySelectorAll('.subcategories-container');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            subcategoryContainers.forEach(container => container.classList.remove('active'));

            const targetContainer = document.getElementById(`${category}-subcategories`) || document.getElementById(`${category}-items`);
            if (targetContainer) {
                targetContainer.classList.add('active');

                if (targetContainer.querySelector('.shop-subcategories')) {
                    const firstSubcategory = targetContainer.querySelector('.shop-subcategory');
                    if (firstSubcategory) {
                        const subcategories = targetContainer.querySelectorAll('.shop-subcategory');
                        subcategories.forEach(btn => btn.classList.remove('active'));
                        firstSubcategory.classList.add('active');
                        filterItemsBySubcategory(targetContainer, firstSubcategory.getAttribute('data-subcategory'));
                    }
                } else {
                    const items = targetContainer.querySelectorAll('.shop-item');
                    items.forEach(item => item.style.display = 'block');
                }
            }
        });
    });

    const subcategoryButtons = document.querySelectorAll('.shop-subcategory');
    subcategoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const parentContainer = this.closest('.subcategories-container');
            const buttons = parentContainer.querySelectorAll('.shop-subcategory');

            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            filterItemsBySubcategory(parentContainer, this.getAttribute('data-subcategory'));
        });
    });

    function filterItemsBySubcategory(container, subcategory) {
        const items = container.querySelectorAll('.shop-item');
        items.forEach(item => {
            if (item.getAttribute('data-subcategory') === subcategory) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    async function loadData() {
        await loadUserBalance();
        await loadPurchasedItems();
        await loadItems();

        const activeContainer = document.querySelector('.subcategories-container.active');
        if (activeContainer) {
            if (activeContainer.querySelector('.shop-subcategories')) {
                const activeSubcategory = activeContainer.querySelector('.shop-subcategory.active');
                if (activeSubcategory) {
                    filterItemsBySubcategory(activeContainer, activeSubcategory.getAttribute('data-subcategory'));
                }
            } else {
                const items = activeContainer.querySelectorAll('.shop-item');
                items.forEach(item => item.style.display = 'block');
            }
        }
    }

    async function loadPurchasedItems() {
        try {
            const response = await fetch('/api/items/owned', {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${jwtToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error('Ошибка загрузки купленных товаров');

            const purchasedItemsData = await response.json();
            purchasedItems = purchasedItemsData;
        } catch (error) {
            console.error('Ошибка загрузки купленных товаров:', error);
            showNotification('Ошибка загрузки купленных товаров', 'error');
        }
    }

    async function loadItems() {
        try {
            const response = await fetch('' +
                '/api/items/catalog', {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${jwtToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error('Ошибка загрузки товаров');

            items = await response.json();
            renderItems();
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
            showNotification('Ошибка загрузки товаров', 'error');
        }
    }

    function renderItems() {
        document.querySelectorAll('.shop-items').forEach(container => {
            container.innerHTML = '';
        });

        const itemsByCategory = {};
        items.forEach(item => {
            if (!itemsByCategory[item.category]) {
                itemsByCategory[item.category] = [];
            }
            itemsByCategory[item.category].push(item);
        });

        for (const [category, categoryItems] of Object.entries(itemsByCategory)) {
            let container;

            if (category.startsWith('pc-')) {
                container = document.querySelector('#pc-subcategories .shop-items');
            } else if (category.startsWith('hardware-')) {
                container = document.querySelector('#hardware-subcategories .shop-items');
            } else if (category === 'models-items') {
                container = document.querySelector('#models-items .shop-items');
            } else if (category === 'games-items') {
                container = document.querySelector('#games-items .shop-items');
            } else if (category === 'vtuber-equipment-items') {
                container = document.querySelector('#vtuber-equipment-items .shop-items');
            }

            if (container) {
                categoryItems.forEach(item => {
                    const itemElement = createItemElement(item);
                    container.appendChild(itemElement);
                });
            }
        }

        updateBuyButtonsHandlers();

        restoreActiveFilter();
    }

    function restoreActiveFilter() {
        const activeContainer = document.querySelector('.subcategories-container.active');
        if (activeContainer) {
            if (activeContainer.querySelector('.shop-subcategories')) {
                const activeSubcategory = activeContainer.querySelector('.shop-subcategory.active');
                if (activeSubcategory) {
                    filterItemsBySubcategory(activeContainer, activeSubcategory.getAttribute('data-subcategory'));
                }
            } else {
                const items = activeContainer.querySelectorAll('.shop-item');
                items.forEach(item => item.style.display = 'block');
            }
        }
    }

    function createItemElement(item) {
        const isPurchased = isItemPurchased(item);

        const div = document.createElement('div');
        div.className = 'shop-item';
        div.setAttribute('data-subcategory', item.category);
        div.innerHTML = `
            <div class="item-image">${getItemIcon(item.category)}</div>
            <div class="item-title">${item.title}</div>
            <div class="item-price">${item.price}</div>
            <button class="game-button small-button ${isPurchased ? 'purchased' : ''}" ${isPurchased ? 'disabled' : ''}>
                ${isPurchased ? 'Куплено' : 'Купить'}
            </button>
        `;
        return div;
    }

    function isItemPurchased(item) {
        const maxTierInCategory = purchasedItems
            .filter(purchasedItem => purchasedItem.category === item.category)
            .reduce((max, purchasedItem) => Math.max(max, purchasedItem.tier), 0);

        return maxTierInCategory >= item.tier;
    }

    function getItemIcon(category) {
        const icons = {
            'pc-cases': '🖲️',
            'pc-cpus': '⚡',
            'pc-gpus': '🎮',
            'pc-motherboards': '🔌',
            'pc-ram': '💾',
            'pc-storage': '💿',
            'pc-cooling': '❄️',
            'hardware-keyboards': '⌨️',
            'hardware-mice': '🖱️',
            'hardware-headphones': '🎧',
            'hardware-monitors': '🖥️',
            'hardware-mats': '🏁',
            'models-items': '🎭',
            'games-items': '🎲',
            'vtuber-equipment-items': '📷'
        };
        return icons[category] || '🛒';
    }

    function updateBuyButtonsHandlers() {
        document.querySelectorAll('.shop-item .game-button:not(.purchased)').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const itemElement = this.closest('.shop-item');
                const itemTitle = itemElement.querySelector('.item-title').textContent;
                const itemPrice = parseInt(itemElement.querySelector('.item-price').textContent);
                buyItem(itemTitle, itemPrice);
            });
        });
    }

    function loadUserBalance() {
        return fetch('/api/game/load', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('jwtToken');
                        window.location.href = '../login';
                        return;
                    }
                    if (response.status === 404) {
                        redirectToChannel();
                        return;
                    }
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(gameState => {
                if (!gameState.nickname) {
                    redirectToChannel();
                    return;
                }

                if (gameState.activeStream) {
                    window.location.href = 'stream';
                    return;
                }

                userBalance = gameState.balance;
                document.getElementById('balance-amount').textContent = userBalance.toLocaleString();
            })
            .catch(error => {
                console.error('Error loading balance:', error);
                showNotification('Ошибка загрузки баланса', 'error');
            });
    }

    function redirectToChannel() {
        localStorage.setItem('returnUrl', window.location.href);
        window.location.href = '../chanel';
    }

    function buyItem(itemTitle, itemPrice) {
        if (userBalance < itemPrice) {
            showNotification('Недостаточно средств для покупки!', 'error');
            return;
        }

        fetch(`/api/items/buy/${encodeURIComponent(itemTitle)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('jwtToken');
                        window.location.href = '../login';
                        return;
                    }
                    return response.text().then(text => {
                        try {
                            const errorData = JSON.parse(text);
                            throw new Error(errorData.message || text || 'Ошибка при покупке');
                        } catch (e) {
                            throw new Error(text || 'Ошибка при покупке');
                        }
                    });
                }
                return response.text();
            })
            .then(message => {
                loadUserBalance();
                loadPurchasedItems().then(() => {
                    renderItems();
                    showNotification('Покупка успешно завершена!', 'success');
                });
            })
            .catch(error => {
                console.error('Error buying item:', error);

                let errorMessage = 'Ошибка при покупке товара';

                if (error.message.includes('Cannot buy item with same or lower tier')) {
                    errorMessage = 'Ошибка: Нельзя купить предмет такого же или уровня чем у вас уже есть';
                } else if (error.message.includes('Too high-tier item for you')) {
                    errorMessage = 'Ошибка: нельзя купить предмет, пока в других подкатегориях не приобретены предметы текущего уровня.';
                } else if (error.message.includes('Not enough money')) {
                    errorMessage = 'Ошибка: Недостаточно денег для покупки';
                } else if (error.message.includes('Item not found')) {
                    errorMessage = 'Ошибка: Товар не найден';
                } else if (error.message.includes('Cannot buy the same item twice')) {
                    errorMessage = 'Ошибка: Нельзя купить тот же предмет дважды';
                } else if (error.message.includes('You already own a better item')) {
                    errorMessage = 'Ошибка: У вас уже есть лучший предмет в этой категории';
                } else if (error.message.includes('Cannot buy item with such high tier')) {
                    errorMessage = 'Ошибка: Нельзя купить предмет на 2+ уровня выше вашего';
                } else if (error.message.includes('Inventory is full')) {
                    errorMessage = 'Ошибка: Инвентарь переполнен';
                } else if (error.message.includes('Category limit exceeded')) {
                    errorMessage = 'Ошибка: Превышен лимит предметов в этой категории';
                } else if (error.message.includes('Prerequisite item required')) {
                    errorMessage = 'Ошибка: Сначала нужно купить предыдущий предмет в цепочке';
                } else if (error.message.includes('Subscription required')) {
                    errorMessage = 'Ошибка: Для покупки требуется подписка';
                } else if (error.message.includes('Daily purchase limit exceeded')) {
                    errorMessage = 'Ошибка: Превышен дневный лимит покупок';
                } else if (error.message.includes('Item not available')) {
                    errorMessage = 'Ошибка: Товар временно недоступен';
                } else if (error.message.includes('Level restriction')) {
                    errorMessage = 'Ошибка: Ограничение по уровню';
                } else if (error.message.includes('Already purchased')) {
                    errorMessage = 'Ошибка: Вы уже приобрели этот предмет';
                } else if (error.message.includes('Insufficient reputation')) {
                    errorMessage = 'Ошибка: Недостаточно репутации';
                } else if (error.message.includes('Quest completion required')) {
                    errorMessage = 'Ошибка: Требуется завершение квеста';
                } else if (error.message.includes('Guild membership required')) {
                    errorMessage = 'Ошибка: Требуется членство в гильдии';
                } else if (error.message.includes('Time limited offer expired')) {
                    errorMessage = 'Ошибка: Временное предложение истекло';
                } else if (error.message.includes('Geographical restriction')) {
                    errorMessage = 'Ошибка: Географическое ограничение';
                } else if (error.message.includes('Age verification required')) {
                    errorMessage = 'Ошибка: Требуется проверка возраста';
                } else {
                    errorMessage = error.message || 'Ошибка при покупке товара';
                }

                showNotification(errorMessage, 'error');
            });
    }

    function initNotifications() {
        let notificationsContainer = document.getElementById('notifications-container');
        if (!notificationsContainer) {
            notificationsContainer = document.createElement('div');
            notificationsContainer.id = 'notifications-container';
            notificationsContainer.className = 'notifications-container';
            document.body.appendChild(notificationsContainer);

            const style = document.createElement('style');
            style.textContent = `
                .notifications-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    max-width: 350px;
                }
                
                .notification {
                    padding: 15px;
                    border-radius: 8px;
                    color: white;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    animation: slideIn 0.3s ease-out;
                    transition: transform 0.3s ease, opacity 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .notification.success {
                    background: linear-gradient(135deg, #4CAF50, #45a049);
                }
                
                .notification.error {
                    background: linear-gradient(135deg, #f44336, #d32f2f);
                }
                
                .notification-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 10px;
                }
                
                .notification-message {
                    flex: 1;
                    font-size: 14px;
                    line-height: 1.4;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0.7;
                    transition: opacity 0.2s ease;
                }
                
                .notification-close:hover {
                    opacity: 1;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                
                .notification.hiding {
                    animation: slideOut 0.3s ease-in forwards;
                }
            `;
            document.head.appendChild(style);
        }

        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('notification-close')) {
                const notification = e.target.closest('.notification');
                if (notification) {
                    removeNotification(notification);
                }
            }
        });

        setInterval(processNotificationQueue, 100);
    }

    function showNotification(message, type) {
        notificationCounter++;
        const notificationId = `notification-${notificationCounter}`;

        notificationQueue.push({
            id: notificationId,
            message: message,
            type: type,
            timestamp: Date.now()
        });
    }

    function processNotificationQueue() {
        const now = Date.now();
        const notificationsContainer = document.getElementById('notifications-container');

        document.querySelectorAll('.notification').forEach(notification => {
            const createdTime = parseInt(notification.getAttribute('data-created'));
            if (now - createdTime > 5000) {
                removeNotification(notification);
            }
        });

        while (notificationQueue.length > 0) {
            const notificationData = notificationQueue.shift();
            createNotificationElement(notificationData);
        }
    }

    function createNotificationElement(notificationData) {
        const notificationsContainer = document.getElementById('notifications-container');

        const notification = document.createElement('div');
        notification.id = notificationData.id;
        notification.className = `notification ${notificationData.type}`;
        notification.setAttribute('data-created', Date.now());

        const content = document.createElement('div');
        content.className = 'notification-content';

        const messageElement = document.createElement('span');
        messageElement.className = 'notification-message';
        messageElement.textContent = notificationData.message;

        const closeButton = document.createElement('button');
        closeButton.className = 'notification-close';
        closeButton.textContent = '×';
        closeButton.setAttribute('aria-label', 'Закрыть уведомление');

        content.appendChild(messageElement);
        content.appendChild(closeButton);
        notification.appendChild(content);
        notificationsContainer.appendChild(notification);

        setTimeout(() => {
            const existingNotification = document.getElementById(notificationData.id);
            if (existingNotification) {
                removeNotification(existingNotification);
            }
        }, 5000);
    }

    function removeNotification(notification) {
        if (notification && notification.parentNode) {
            notification.classList.add('hiding');
            setTimeout(() => {
                if (notification && notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }

    const helpButton = document.getElementById('help-button');
    const helpModal = document.getElementById('help-modal');
    const helpModalClose = document.getElementById('help-modal-close');

    if (helpButton && helpModal && helpModalClose) {
        helpButton.addEventListener('click', function() {
            helpModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });

        helpModalClose.addEventListener('click', function() {
            helpModal.style.display = 'none';
            document.body.style.overflow = '';
        });

        helpModal.addEventListener('click', function(event) {
            if (event.target === helpModal) {
                helpModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && helpModal.style.display === 'block') {
                helpModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
});