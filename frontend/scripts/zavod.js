document.addEventListener('DOMContentLoaded', function() {
    const clickButton = document.getElementById('clickButton');
    const clickCounter = document.getElementById('clickCounter');
    const banTimer = document.getElementById('banTimer');
    const timerValue = document.getElementById('timerValue');
    const progressFill = document.getElementById('progressFill');
    const clicksToBan = document.getElementById('clicksToBan');
    const totalClicks = document.getElementById('totalClicks');
    const earnedMoneyElement = document.getElementById('earnedMoney');

    const elements = [
        { id: 'clickButton', name: 'Кнопка клика' },
        { id: 'clickCounter', name: 'Счётчик кликов' },
        { id: 'banTimer', name: 'Таймер бана' },
        { id: 'timerValue', name: 'Значение таймера' },
        { id: 'progressFill', name: 'Полоса прогресса' },
        { id: 'clicksToBan', name: 'Клики до бана' },
        { id: 'totalClicks', name: 'Общие клики' },
        { id: 'earnedMoney', name: 'Заработанные деньги' }
    ];

    for (const el of elements) {
        if (!document.getElementById(el.id)) {
            console.error(`Элемент с ID ${el.id} (${el.name}) не найден`);
        }
    }

    const MAX_CLICKS = 1000;
    const BAN_DURATION = 10 * 60 * 1000;

    let currentStats = {
        current_clicks: 0,
        total_clicks: 0,
        completed_sessions: 0,
        earned_money: 0,
        ban_end_time: null,
        ban_start_time: null
    };

    let timerInterval = null;
    let isProcessing = false;
    let factorySessionActive = false;

    const jwtToken = localStorage.getItem('jwtToken') || null;
    if (!jwtToken) {
        console.error('jwtToken не определён');
        alert('Ошибка авторизации. Пожалуйста, войдите в систему через login');
        window.location.href = '../login';
        return;
    }

    initializeFactory();

    if (clickButton) {
        clickButton.addEventListener('click', handleClick);
    } else {
        console.error('Кнопка клика не найдена, обработчик не установлен');
    }

    async function initializeFactory() {
        try {
            console.log('Инициализация фабрики...');

            const gameStateResponse = await fetch('/api/game/load', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            if (gameStateResponse.ok) {
                const gameState = await gameStateResponse.json();

                if (gameState.activeStream) {
                    window.location.href = 'stream';
                    return;
                }
            }

            const sessionData = await startFactorySession();
            console.log('Сессия получена:', sessionData);

            factorySessionActive = true;
            currentStats.current_clicks = sessionData.clicks || 0;
            currentStats.earned_money = sessionData.income || 0;
            currentStats.total_clicks = sessionData.total_clicks || currentStats.current_clicks;
            updateUI();
        } catch (error) {
            if (error.isBanned) {
                console.log('Пользователь забанен, отображаем UI бана');
                currentStats.ban_end_time = new Date(error.banEndTime).getTime();
                startBanUI();
            } else {
                console.error('Ошибка инициализации фабрики:', error);
                alert('Не удалось загрузить фабрику. Попробуйте обновить страницу.');
            }
        }
    }

    async function startFactorySession() {
        try {
            const response = await fetch('/api/game/factory/start', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            if (!response.ok) {
                const errorData = await response.text();
                if (errorData.includes('banned')) {
                    const banEndTimeMatch = errorData.match(/until (.+)$/);
                    if (banEndTimeMatch) {
                        throw { isBanned: true, banEndTime: banEndTimeMatch[1] };
                    }
                }
                throw new Error(errorData);
            }

            return await response.json();
        } catch (error) {
            console.error('Ошибка запуска/загрузки фабрики:', error);
            throw error;
        }
    }

    async function registerFactoryClick() {
        if (!factorySessionActive) {
            console.log('Сессия фабрики не активна');
            return false;
        }

        try {
            const response = await fetch('/api/game/factory/click', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка регистрации клика');
            }

            const sessionUpdate = await response.json();
            console.log('Клик зарегистрирован:', sessionUpdate);

            currentStats.current_clicks = sessionUpdate.clicks;
            currentStats.earned_money = sessionUpdate.income;

            return true;
        } catch (error) {
            console.error('Ошибка регистрации клика:', error);
            return false;
        }
    }

    async function finishFactorySession() {
        if (!factorySessionActive) return;

        try {
            const response = await fetch('/api/game/factory/finish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка завершения сессии фабрики');
            }

            console.log('Сессия фабрики завершена');
            factorySessionActive = false;
        } catch (error) {
            console.error('Ошибка завершения сессии фабрики:', error);
        }
    }

    async function saveFactorySession() {
        if (!factorySessionActive) return;

        try {
            const response = await fetch('/api/game/factory/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    clicks: currentStats.current_clicks,
                    total_clicks: currentStats.total_clicks,
                    income: currentStats.earned_money
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка сохранения сессии фабрики');
            }

            console.log('Сессия фабрики сохранена');
        } catch (error) {
            console.error('Ошибка сохранения сессии фабрики:', error);
        }
    }

    async function handleClick() {
        if (isBanned() || isProcessing || !factorySessionActive) {
            console.log('Клик заблокирован');
            return;
        }

        isProcessing = true;

        const clickSuccess = await registerFactoryClick();
        if (!clickSuccess) {
            console.error('Не удалось зарегистрировать клик');
            isProcessing = false;
            return;
        }

        currentStats.total_clicks++;
        updateUI();

        if (clickButton) {
            clickButton.classList.add('click-animation');
            setTimeout(() => {
                clickButton.classList.remove('click-animation');
            }, 200);
        }

        if (currentStats.current_clicks >= MAX_CLICKS) {
            await startBan();
        }

        isProcessing = false;
    }

    function updateUI() {
        if (clickCounter) {
            clickCounter.textContent = currentStats.current_clicks.toLocaleString();
        }
        if (totalClicks) {
            totalClicks.textContent = currentStats.total_clicks.toLocaleString();
        }
        if (clicksToBan) {
            const remainingClicks = MAX_CLICKS - currentStats.current_clicks;
            clicksToBan.textContent = remainingClicks > 0 ? remainingClicks.toLocaleString() : '0';
        }
        if (earnedMoneyElement) {
            earnedMoneyElement.textContent = currentStats.earned_money.toLocaleString();
        }

        if (progressFill) {
            const progressPercent = (currentStats.current_clicks / MAX_CLICKS) * 100;
            progressFill.style.width = Math.min(progressPercent, 100) + '%';
        }
    }

    function isBanned() {
        if (!currentStats.ban_end_time) return false;
        return Date.now() < currentStats.ban_end_time;
    }

    function getRemainingBanTime() {
        if (!currentStats.ban_end_time) return 0;
        return Math.max(0, currentStats.ban_end_time - Date.now());
    }

    async function startBan() {
        await finishFactorySession();

        currentStats.ban_end_time = Date.now() + BAN_DURATION;
        currentStats.ban_start_time = Date.now();
        currentStats.completed_sessions++;
        currentStats.current_clicks = 0;
        currentStats.earned_money = 0;

        startBanUI();
    }

    function startBanUI() {
        if (clickButton) clickButton.disabled = true;
        if (banTimer) {
            banTimer.style.display = 'block';
            banTimer.classList.add('ban-pulse');
        }
        startTimer();
    }

    function startTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
        }

        timerInterval = setInterval(updateTimer, 1000);
        updateTimer();
    }

    function updateTimer() {
        const remainingTime = getRemainingBanTime();

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            endBan();
            return;
        }

        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);

        if (timerValue) {
            timerValue.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    async function endBan() {
        currentStats.ban_end_time = null;
        currentStats.ban_start_time = null;
        currentStats.current_clicks = 0;
        currentStats.earned_money = 0;

        try {
            const sessionData = await startFactorySession();
            factorySessionActive = true;
            currentStats.current_clicks = sessionData.clicks || 0;
            currentStats.earned_money = sessionData.income || 0;
            currentStats.total_clicks = sessionData.total_clicks || currentStats.current_clicks;
            updateUI();
        } catch (error) {
            console.error('Ошибка запуска сессии после бана:', error);
        }

        if (clickButton) clickButton.disabled = false;
        if (banTimer) {
            banTimer.style.display = 'none';
            banTimer.classList.remove('ban-pulse');
        }
    }

    window.addEventListener('beforeunload', () => {
        if (factorySessionActive && !isBanned()) {
            console.log('Сохранение сессии перед выходом...');
            fetch('/api/game/factory/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    clicks: currentStats.current_clicks,
                    total_clicks: currentStats.total_clicks,
                    income: currentStats.earned_money
                }),
                keepalive: true
            }).then(response => {
                if (response.ok) {
                    console.log('Сессия успешно сохранена перед выходом');
                } else {
                    console.error('Ошибка сохранения сессии при выходе:', response.status);
                }
            }).catch(error => {
                console.error('Ошибка отправки запроса на сохранение:', error);
            });
        }
    });
});