document.addEventListener('DOMContentLoaded', function() {
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

    window.addEventListener('storage', function(e) {
        if (e.key === 'theme') {
            htmlElement.setAttribute('data-theme', e.newValue);
        }
    });

    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = '../login';
        return;
    }

    checkChannelAndActiveStream(token);
});

async function checkChannelAndActiveStream(token) {
    try {
        const response = await fetch('/api/game/load', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const gameState = await response.json();

            if (!gameState.nickname) {
                redirectToChannel();
                return;
            }

            if (gameState.activeStream) {
                window.location.href = 'stream';
                return;
            }

            initializeStreamPage();

        } else if (response.status === 404) {
            redirectToChannel();
        }
    } catch (error) {
        console.error('Ошибка проверки канала:', error);
    }
}

function initializeStreamPage() {
    const token = localStorage.getItem('jwtToken');
    checkChannelExists(token);

    const difficultyOptions = document.querySelectorAll('.difficulty-option');
    let selectedDifficulty = 'medium';
    let isDifficultyLocked = false;

    const difficultyLevels = {
        'very-easy': 1,
        'easy': 2,
        'medium': 3,
        'hard': 4,
        'very-hard': 5
    };

    const difficultyIntervals = {
        'very-easy': 900,
        'easy': 800,
        'medium': 600,
        'hard': 450,
        'very-hard': 380
    };

    difficultyOptions.forEach(option => {
        option.addEventListener('click', function() {
            if (isDifficultyLocked) {
                return;
            }

            difficultyOptions.forEach(opt => opt.classList.remove('selected'));

            this.classList.add('selected');

            selectedDifficulty = this.getAttribute('data-difficulty');

            localStorage.setItem('lastSelectedDifficulty', selectedDifficulty);
        });
    });

    const lastDifficulty = localStorage.getItem('lastSelectedDifficulty');
    if (lastDifficulty) {
        const optionToSelect = document.querySelector(`.difficulty-option[data-difficulty="${lastDifficulty}"]`);
        if (optionToSelect) {
            difficultyOptions.forEach(opt => opt.classList.remove('selected'));
            optionToSelect.classList.add('selected');
            selectedDifficulty = lastDifficulty;
        }
    }

    const startStreamBtn = document.querySelector('.start-stream-btn');
    const statusMessage = document.querySelector('.status-message');
    const streamTimer = document.querySelector('.stream-timer');

    startStreamBtn.addEventListener('click', async function() {
        const streamTitle = document.querySelector('.stream-title').value;
        if (!streamTitle || streamTitle.trim() === '') {
            alert('Пожалуйста, введите название стрима');
            return;
        }

        const token = localStorage.getItem('jwtToken');
        const level = difficultyLevels[selectedDifficulty];

        try {
            const response = await fetch(`/api/game/stream/start?level=${level}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                proceedWithStreamStart(selectedDifficulty, streamTitle, startStreamBtn, statusMessage, streamTimer, difficultyLevels, difficultyIntervals);
            } else {
                const errorText = await response.text();

                if (errorText.includes('banned') || errorText.includes('ban')) {
                    const banMatch = errorText.match(/until\s+(.+)$/);
                    const banEndTime = banMatch ? banMatch[1] : 'неизвестное время';
                    showBanNotification(banEndTime);
                } else if (errorText.includes('Cannot start stream') || errorText.includes('required items') || errorText.includes('tier')) {
                    showItemsErrorNotification();
                } else {
                    alert('Ошибка при запуске стрима: ' + errorText);
                }
            }
        } catch (error) {
            console.error('Ошибка при проверке стрима:', error);
            alert('Произошла ошибка при запуске стрима');
        }
    });

    const lastStreamTitle = localStorage.getItem('lastStreamTitle');
    if (lastStreamTitle) {
        document.querySelector('.stream-title').value = lastStreamTitle;
    }

    document.querySelector('.stream-title').addEventListener('input', function() {
        localStorage.setItem('lastStreamTitle', this.value);
    });
}

function proceedWithStreamStart(selectedDifficulty, streamTitle, startStreamBtn, statusMessage, streamTimer, difficultyLevels, difficultyIntervals) {
    const difficultyOptions = document.querySelectorAll('.difficulty-option');
    difficultyOptions.forEach(option => {
        option.style.opacity = '0.6';
        option.style.cursor = 'not-allowed';
        option.classList.add('disabled');
    });

    localStorage.setItem('streamTitle', streamTitle);
    localStorage.setItem('streamDifficulty', selectedDifficulty);
    localStorage.setItem('streamDifficultyLevel', difficultyLevels[selectedDifficulty]);
    localStorage.setItem('streamDifficultyInterval', difficultyIntervals[selectedDifficulty]);

    startStreamBtn.disabled = true;
    startStreamBtn.textContent = 'Запуск...';

    let countdown = 5;
    statusMessage.textContent = 'Начинаем через:';

    document.querySelector('.stream-status').style.display = 'block';

    const countdownInterval = setInterval(function() {
        const formattedTime = '00:' + (countdown < 10 ? '0' + countdown : countdown);
        streamTimer.textContent = formattedTime;

        countdown--;

        if (countdown < 0) {
            clearInterval(countdownInterval);
            statusMessage.textContent = 'Стрим начинается!';
            streamTimer.textContent = '00:00';

            setTimeout(function() {
                window.location.href = 'stream';
            }, 1000);
        }
    }, 1000);
}

function showBanNotification(banEndTime) {
    const overlay = document.createElement('div');
    overlay.className = 'ban-notification-overlay';

    const notification = document.createElement('div');
    notification.className = 'ban-notification';
    notification.innerHTML = `
        <div class="ban-notification-icon">
            <i class="fas fa-ban"></i>
        </div>
        <div class="ban-notification-content">
            <h2>Доступ ограничен</h2>
            <p>Вы временно не можете запускать стримы.</p>
            
            <div class="ban-details">
                <div class="ban-time">
                    <i class="fas fa-clock"></i>
                    <span>Ограничение до: ${banEndTime} (МСК)</span>
                </div>
                <div class="ban-reason">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Причина: Вам необходим отдых</span>
                </div>
            </div>
            
            <div class="ban-suggestion">
                <i class="fas fa-lightbulb"></i>
                <span>Пока вы не можете стримить, вы можете работать на фабрике или улучшать свой канал</span>
            </div>
            
            <button class="ban-notification-close">
                <i class="fas fa-times"></i> Понятно
            </button>
        </div>
    `;

    overlay.appendChild(notification);

    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.classList.add('active');
        notification.classList.add('active');
    }, 10);

    const closeButton = notification.querySelector('.ban-notification-close');
    closeButton.addEventListener('click', function() {
        overlay.classList.remove('active');
        notification.classList.remove('active');
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    });

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            notification.classList.remove('active');
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
    });
}

function showItemsErrorNotification() {
    const overlay = document.createElement('div');
    overlay.className = 'ban-notification-overlay';

    const notification = document.createElement('div');
    notification.className = 'ban-notification';
    notification.innerHTML = `
        <div class="ban-notification-icon">
            <i class="fas fa-shopping-cart"></i>
        </div>
        <div class="ban-notification-content">
            <h2>Недостаточно оборудования</h2>
            <p>Для начала стрима необходимо приобрести базовое оборудование.</p>
            
            <div class="ban-details">
                <div class="ban-time">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>Требуется: оборудование 1-го уровня во всех категориях</span>
                </div>
                <div class="ban-reason">
                    <i class="fas fa-info-circle"></i>
                    <span>Исключение: оборудование "Разное" (не обязательно)</span>
                </div>
            </div>
            
            <div class="ban-suggestion">
                <i class="fas fa-lightbulb"></i>
                <span>Посетите магазин, чтобы приобрести необходимое оборудование</span>
            </div>
            
            <button class="ban-notification-close">
                <i class="fas fa-times"></i> Понятно
            </button>
            <button class="ban-notification-shop" style="background: linear-gradient(135deg, #27ae60, #2ecc71);
    font-size: 1rem;
    padding: 12px 25px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 15px;
    color: white;
    font-weight: bold;">
                <i class="fas fa-store"></i> Перейти в магазин
            </button>
        </div>
    `;

    overlay.appendChild(notification);

    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.classList.add('active');
        notification.classList.add('active');
    }, 10);

    const closeButton = notification.querySelector('.ban-notification-close');
    closeButton.addEventListener('click', function() {
        overlay.classList.remove('active');
        notification.classList.remove('active');
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    });

    const shopButton = notification.querySelector('.ban-notification-shop');
    shopButton.addEventListener('click', function() {
        window.location.href = 'shop';
    });

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            notification.classList.remove('active');
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
    });
}

async function checkChannelExists(token) {
    try {
        const response = await fetch('/api/game/load', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const gameState = await response.json();
            if (!gameState.nickname) {
                redirectToChannel();
            }
        } else if (response.status === 404) {
            redirectToChannel();
        }
    } catch (error) {
        console.error('Ошибка проверки канала:', error);
    }
}

function redirectToChannel() {
    localStorage.setItem('returnUrl', window.location.href);
    window.location.href = '../chanel';
}