const token = localStorage.getItem('jwtToken');
if (!token) {
    window.location.href = '../login';
}

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

    const WOLF_REQUIREMENTS = {
        subscribers: 100000,
        balance: 500000,
        registrationTime: 180
    };

    let requirementsMet = {
        subscribers: false,
        balance: false,
        registrationTime: false
    };

    const signButton = document.getElementById('sign-contract');
    const requirementsList = document.getElementById('requirements-list');

    loadWolfRequirements();

    if (signButton) {
        signButton.addEventListener('click', handleSignContract);
    }

    async function loadWolfRequirements() {
        try {
            const response = await fetch('/api/game/load', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const userData = await response.json();

                if (!userData.nickname) {
                    redirectToChannel();
                    return;
                }

                if (userData.activeStream) {
                    window.location.href = 'stream';
                    return;
                }

                const wolfResponse = await fetch('/api/wolf/requirements', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (wolfResponse.ok) {
                    const data = await wolfResponse.json();
                    updateUI(data);
                } else if (wolfResponse.status === 401) {
                    showError('Сессия истекла');
                    redirectToLogin();
                } else {
                    showError('Не удалось загрузить требования');
                }
            } else if (response.status === 404) {
                redirectToChannel();
            } else {
                throw new Error('Ошибка загрузки данных');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showError('Ошибка соединения');
        }
    }

    function redirectToChannel() {
        localStorage.setItem('returnUrl', window.location.href);
        window.location.href = '../chanel';
    }

    function updateUI(data) {
        requirementsMet.subscribers = data.subscribers >= WOLF_REQUIREMENTS.subscribers;
        requirementsMet.balance = data.balance >= WOLF_REQUIREMENTS.balance;
        requirementsMet.registrationTime = data.minutesSinceRegistration >= WOLF_REQUIREMENTS.registrationTime;

        updateRequirementsList(data.minutesSinceRegistration, data.subscribers, data.balance);
        updateButtonState();
    }

    function updateRequirementsList(minutes, subscribers, balance) {
        requirementsList.innerHTML = '';

        const requirements = [
            {
                name: 'Подписчики',
                current: subscribers,
                required: WOLF_REQUIREMENTS.subscribers,
                met: requirementsMet.subscribers
            },
            {
                name: 'Баланс',
                current: balance,
                required: WOLF_REQUIREMENTS.balance,
                met: requirementsMet.balance
            },
            {
                name: 'Время с регистрации',
                current: minutes,
                required: WOLF_REQUIREMENTS.registrationTime,
                met: requirementsMet.registrationTime,
                isTime: true
            }
        ];

        requirements.forEach(req => {
            const requirementItem = document.createElement('div');
            requirementItem.className = 'requirement-item';

            const formattedCurrent = req.isTime ? formatTime(req.current) : req.current.toLocaleString();
            const formattedRequired = req.isTime ? formatTime(req.required) : req.required.toLocaleString();
            const missing = req.required - req.current;

            requirementItem.innerHTML = `
                <span class="requirement-icon">${req.met ? '✅' : '❌'}</span>
                <span class="requirement-text">
                    ${req.name}: ${formattedCurrent}/${formattedRequired}
                    ${!req.met ? `<span class="requirement-missing">(не хватает ${req.isTime ? formatTime(missing) : missing.toLocaleString()})</span>` : ''}
                </span>
            `;

            requirementsList.appendChild(requirementItem);
        });
    }

    function formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}ч ${mins}м` : `${mins}м`;
    }

    function updateButtonState() {
        const allMet = requirementsMet.subscribers && requirementsMet.balance && requirementsMet.registrationTime;
        signButton.disabled = !allMet;

        if (!signButton.disabled) {
            signButton.style.opacity = '1';
            signButton.style.cursor = 'pointer';
        } else {
            signButton.style.opacity = '0.6';
            signButton.style.cursor = 'not-allowed';
        }
    }

    async function handleSignContract() {
        if (!requirementsMet.subscribers || !requirementsMet.balance || !requirementsMet.registrationTime) {
            showError('Не все требования выполнены!');
            return;
        }

        try {
            const response = await fetch('/api/wolf/signContract', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();
                showWolfContractMessage(result.flag);
            } else {
                const errorText = await response.text();
                showError(errorText || 'Ошибка при подписании');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showError('Ошибка при принятии контракта');
        }
    }

    function showWolfContractMessage(flag) {
        const overlay = document.createElement('div');
        overlay.className = 'wolf-contract-overlay';

        const messageContainer = document.createElement('div');
        messageContainer.className = 'wolf-contract-message';

        messageContainer.innerHTML = `
            <h2 class="wolf-contract-title">Договор Подписан</h2>
            <div class="wolf-contract-content">
                <p>Отныне твоя душа теперь принадлежит Волку. 🐺</p>
                <p class="flag-text">Flag5 = '${flag}'</p>
            </div>
            <button class="wolf-action wolf-contract-close">
                Принять свою судьбу
            </button>
        `;

        overlay.appendChild(messageContainer);
        document.body.appendChild(overlay);

        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            overlay.classList.add('active');
            messageContainer.classList.add('active');
        }, 10);

        const closeButton = messageContainer.querySelector('.wolf-contract-close');
        closeButton.addEventListener('click', closeWolfMessage);

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeWolfMessage();
        });

        document.addEventListener('keydown', handleEscapeKey);
    }

    function closeWolfMessage() {
        const overlay = document.querySelector('.wolf-contract-overlay');
        const message = document.querySelector('.wolf-contract-message');

        if (overlay && message) {
            overlay.classList.remove('active');
            message.classList.remove('active');

            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = '';
                document.removeEventListener('keydown', handleEscapeKey);
            }, 300);
        }
    }

    function handleEscapeKey(e) {
        if (e.key === 'Escape') closeWolfMessage();
    }

    function showError(message) {
        const oldErrors = document.querySelectorAll('.error-message');
        oldErrors.forEach(error => error.remove());

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <span class="error-icon">⚠️</span>
            <span class="error-text">${message}</span>
        `;

        document.body.appendChild(errorDiv);

        setTimeout(() => errorDiv.remove(), 5000);
    }

    function redirectToLogin() {
        setTimeout(() => {
            window.location.href = '../login';
        }, 2000);
    }

    const styles = `
        .error-message {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 15px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            z-index: 10001;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        }
        
        .error-icon {
            margin-right: 10px;
            font-size: 1.2rem;
        }
        
        .wolf-contract-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            padding: 20px;
        }
        
        .wolf-contract-overlay.active {
            opacity: 1;
        }
        
        .wolf-contract-message {
            background-color: var(--content-bg);
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            max-width: 400px;
            width: 100%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            transform: translateY(50px) scale(0.9);
            opacity: 0;
            transition: all 0.3s ease;
            border: 2px solid var(--accent-color);
        }
        
        .wolf-contract-message.active {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        
        .wolf-contract-title {
            color: var(--accent-color);
            font-size: 1.6rem;
            margin-bottom: 20px;
            font-weight: bold;
        }
        
        .wolf-contract-content {
            margin-bottom: 25px;
            line-height: 1.5;
        }
        
        .wolf-contract-content p {
            margin-bottom: 15px;
            color: var(--text-dark);
            font-size: 1rem;
        }
        
        .flag-text {
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            background-color: var(--section-bg);
            padding: 12px;
            border-radius: 6px;
            border: 1px solid var(--text-gray);
            margin-top: 20px;
            line-height: 1.4;
            word-break: break-all;
            text-align: left;
            display: block;
            width: 100%;
            box-sizing: border-box;
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
        
        @media (max-width: 480px) {
            .wolf-contract-message {
                padding: 20px;
                margin: 10px;
            }
            
            .error-message {
                right: 10px;
                left: 10px;
                max-width: none;
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    setInterval(loadWolfRequirements, 30000);
});