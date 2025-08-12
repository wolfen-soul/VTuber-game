// Состояние игры
let gameState = {
    name: 'Анонимный VTuber',
    avatar: 'avatar1',
    theme: 'games',
    views: 0,
    subscribers: 0,
    donations: 0,
    chatMessages: 'Добро пожаловать на стрим!\n',
    clickPower: 1,
    upgrades: {
        bot: false,
        costume: false,
        collab: false,
        autoclicker: false,
        offline: false,
        afkboost: false,
        discount: false
    }
};

// DOM элементы
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Инициализация UI
function initUI() {
    // Меню и темы
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const tab = button.dataset.tab;
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tab).classList.add('active');
        });
    });

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        themeToggle.textContent = newTheme === 'light' ? 'Темная тема' : 'Светлая тема';
        localStorage.setItem('theme', newTheme);
    });

    // Восстановление темы
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'light' ? 'Темная тема' : 'Светлая тема';
}

// Старт игры
async function startGame() {
    gameState.name = document.getElementById('vtuber-name').value || 'Анонимный VTuber';
    gameState.avatar = document.getElementById('vtuber-avatar').value;
    gameState.theme = document.getElementById('vtuber-theme').value;

    document.getElementById('customization-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';

    // Обновляем UI
    document.getElementById('vtuber-title').textContent = `Твой VTuber: ${gameState.name}`;
    document.getElementById('vtuber-image').src = `assets/${gameState.avatar}.png`;

    initUI();
    startGameLoop();
}

// Клик по стриму
function clickStream() {
    gameState.views += gameState.clickPower;
    addChatMessage('Новый зритель зашел на стрим!');
    updateUI();
}

// Покупка улучшения
function buyUpgrade(type) {
    const costs = {
        bot: 100,
        costume: 200,
        collab: 500,
        autoclicker: 300,
        offline: 150,
        afkboost: 250,
        discount: 400
    };

    if (gameState.views >= costs[type]) {
        gameState.views -= costs[type];
        gameState.upgrades[type] = true;

        // Применяем эффекты улучшений
        switch(type) {
            case 'bot':
                gameState.clickPower += 1;
                addChatMessage('Бот-помощник активирован!');
                break;
            case 'costume':
                gameState.clickPower += 2;
                addChatMessage('Новый костюм привлек больше зрителей!');
                break;
            case 'collab':
                gameState.clickPower += 5;
                addChatMessage('Коллаб с "Мифическим фениксом" - успех!');
                break;
            case 'autoclicker':
                addChatMessage('Автокликер активирован!');
                break;
        }

        updateUI();
    } else {
        alert('Недостаточно просмотров!');
    }
}

// Добавление сообщения в чат
function addChatMessage(message) {
    gameState.chatMessages += message + '\n';
    if (gameState.chatMessages.split('\n').length > 10) {
        gameState.chatMessages = gameState.chatMessages.split('\n').slice(-10).join('\n');
    }
    updateChat();
}

// Обновление чата
function updateChat() {
    document.getElementById('chat-messages').innerHTML = gameState.chatMessages.replace(/\n/g, '<br>');
    document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
}

// Обновление UI
function updateUI() {
    document.getElementById('views').textContent = Math.floor(gameState.views);
    document.getElementById('subscribers').textContent = gameState.subscribers;
    document.getElementById('donations').textContent = gameState.donations;
}

// Игровой цикл
function startGameLoop() {
    // Автокликер
    if (gameState.upgrades.autoclicker) {
        setInterval(() => {
            gameState.views += gameState.clickPower * 0.1;
            updateUI();
        }, 1000);
    }

    // Оффлайн доход
    if (gameState.upgrades.offline) {
        setInterval(() => {
            gameState.views += gameState.upgrades.afkboost ? 2 : 1;
            updateUI();
        }, 3000);
    }

    // Рандомные события
    setInterval(() => {
        if (Math.random() > 0.7) {
            const events = [
                'Зритель сделал донат!',
                'Новый подписчик!',
                'Стрим в рекомендациях!'
            ];
            const event = events[Math.floor(Math.random() * events.length)];
            addChatMessage(event);

            if (event.includes('донат')) gameState.donations += 1;
            if (event.includes('подписчик')) gameState.subscribers += 1;
            if (event.includes('рекомендациях')) gameState.views += 5;

            updateUI();
        }
    }, 5000);
}