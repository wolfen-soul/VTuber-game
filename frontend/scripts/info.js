document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('no-transitions');

    const savedTheme = localStorage.getItem('theme');
    const htmlElement = document.documentElement;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const defaultTheme = prefersDark ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', defaultTheme);
        localStorage.setItem('theme', defaultTheme);
    }

    setTimeout(() => {
        document.body.classList.remove('no-transitions');
    }, 0);

    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = '../login';
        return;
    }

    loadUserData(token);
});

async function loadUserData(token) {
    try {
        const response = await fetch('/api/game/load', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

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
            throw new Error('Ошибка загрузки данных');
        }

        const userData = await response.json();

        if (!userData.nickname) {
            redirectToChannel();
            return;
        }

        if (userData.activeStream) {
            window.location.href = 'stream';
            return;
        }

        console.log('Данные пользователя:', userData);
        updateUserInfo(userData);

    } catch (error) {
        console.error('Ошибка:', error);
        showError('Не удалось загрузить данные пользователя');
    }
}

function redirectToChannel() {
    localStorage.setItem('returnUrl', window.location.href);
    window.location.href = '../chanel';
}

function updateUserInfo(userData) {
    document.getElementById('channel-name').textContent = userData.nickname || 'Не указано';
    document.getElementById('total-subscribers').textContent = formatNumber(userData.subscribers || 0);
    document.getElementById('total-streams').textContent = formatNumber(userData.streamsAmount || 0);
    document.getElementById('average-online').textContent = formatNumber(userData.averageOnline || 0);
    document.getElementById('total-donations').textContent = formatNumber(userData.donationsAmount || 0);
    document.getElementById('balance').textContent = formatNumber(userData.balance || 0);
    document.getElementById('registration-date').textContent = userData.registrationDate || 'Не указано';

    document.getElementById('agency').textContent = userData.agency ? userData.agency.title : 'Нет';
    document.getElementById('collab').textContent = userData.collab ? userData.collab.title : 'Нет';
    document.getElementById('collab-streams-left').textContent = userData.collab ? (userData.collab.requiredStreams - userData.collaborationStreams) : 0;

    const collabMultiplier = userData.collab ? userData.collab.multiplier : 0;
    document.getElementById('collab-multiplier').textContent = `${collabMultiplier}x`;

    const subscriberBonus = userData.agency ? userData.agency.subscriberBonus : 0;
    const agencyIncome = userData.agency ? userData.agency.income : 0;
    document.getElementById('subscriber-bonus').textContent = formatNumber(subscriberBonus);
    document.getElementById('agency-income').textContent = formatNumber(agencyIncome);

    const highestTierItems = filterHighestTierItems(userData.ownedItems || []);

    updateEquipmentBonuses(highestTierItems, userData.agency);

    updateEquipmentList(highestTierItems);
}

function filterHighestTierItems(ownedItems) {
    if (!ownedItems || ownedItems.length === 0) return [];

    const itemsByCategory = {};
    ownedItems.forEach(item => {
        if (!item || !item.category) return;

        if (!itemsByCategory[item.category]) {
            itemsByCategory[item.category] = [];
        }

        itemsByCategory[item.category].push(item);
    });

    const highestTierItems = [];
    for (const category in itemsByCategory) {
        const itemsInCategory = itemsByCategory[category];

        const maxTier = Math.max(...itemsInCategory.map(item => item.tier || 1));

        itemsInCategory
            .filter(item => item.tier === maxTier)
            .forEach(item => highestTierItems.push(item));
    }

    return highestTierItems;
}

function formatNumber(num) {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString();
}

function updateEquipmentBonuses(ownedItems, agency) {
    const bonuses = {
        viewers: 0,
        donations: 0,
        subscribers: 0,
        common: 0,
        events: 0
    };

    ownedItems.forEach(item => {
        if (item && item.bonusCategory && bonuses.hasOwnProperty(item.bonusCategory)) {
            bonuses[item.bonusCategory] += item.bonus || 0;
        }
    });

    document.getElementById('viewers-bonus').textContent = `${bonuses.viewers.toFixed(2)}x`;
    document.getElementById('donations-bonus').textContent = `${bonuses.donations.toFixed(2)}x`;
    document.getElementById('subscribers-bonus').textContent = `${bonuses.subscribers.toFixed(2)}x`;
    document.getElementById('common-bonus').textContent = `${bonuses.common.toFixed(2)}x`;
    document.getElementById('events-bonus').textContent = `${bonuses.events.toFixed(2)}x`;

    const discount = agency ? (agency.discount || 0) * 100 : 0;
    document.getElementById('discount').textContent = `${discount.toFixed(0)}%`;
}

function updateEquipmentList(ownedItems) {
    const equipmentContainer = document.getElementById('equipment-container');
    if (!equipmentContainer) return;

    equipmentContainer.innerHTML = '';

    if (!ownedItems || ownedItems.length === 0) {
        equipmentContainer.innerHTML = '<p class="no-items">У вас пока нет оборудования</p>';
        return;
    }

    ownedItems.forEach(item => {
        if (!item) return;

        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';

        const icon = getIconForCategory(item.category);
        const bonusText = getBonusText(item.bonusCategory, item.bonus);

        itemCard.innerHTML = `
            <div class="item-icon">${icon}</div>
            <div class="item-name">${item.title || 'Без названия'}</div>
            <div class="item-details">${bonusText}</div>
            <div class="tier-badge tier-${item.tier || 1}">Tier ${item.tier || 1}</div>
        `;

        equipmentContainer.appendChild(itemCard);
    });
}

function getIconForCategory(category) {
    if (!category) return '📦';

    const icons = {
        'pc-cases': '💻',
        'pc-cpus': '🚀',
        'pc-gpus': '🎮',
        'pc-motherboards': '🔌',
        'pc-ram': '🧠',
        'pc-storage': '💾',
        'pc-cooling': '❄️',
        'models-items': '🎭',
        'hardware-keyboards': '⌨️',
        'hardware-mice': '🐁',
        'hardware-headphones': '🎧',
        'hardware-monitors': '🖥️',
        'hardware-mats': '🖱️',
        'games-items': '🎲',
        'vtuber-equipment-items': '🎥'
    };

    return icons[category] || '📦';
}

function getBonusText(bonusCategory, bonusValue) {
    if (!bonusCategory || bonusValue === undefined) return 'Без бонуса';

    const categories = {
        'viewers': 'зрителям',
        'donations': 'донатам',
        'subscribers': 'подписчикам',
        'common': 'общий бонус',
        'events': 'ивентам'
    };

    return `+${(bonusValue || 0).toFixed(2)} к ${categories[bonusCategory] || bonusCategory}`;
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 1000;
        max-width: 300px;
    `;

    document.body.appendChild(errorDiv);

    setTimeout(() => {
        if (document.body.contains(errorDiv)) {
            document.body.removeChild(errorDiv);
        }
    }, 5000);
}

document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.querySelector('.back-button a');
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = this.getAttribute('href');
        });
    }
});