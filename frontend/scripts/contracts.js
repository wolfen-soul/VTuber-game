document.addEventListener('DOMContentLoaded', function() {
    let gameState = null;
    let agencies = [];
    let collabs = [];

    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
        console.error('JWT token not found');
        window.location.href = '../login';
        return;
    }

    initHelpModal();

    async function loadData() {
        try {
            await loadGameState();
            await loadAgencies();
            await loadCollabs();
            initCategorySwitcher();
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            showError('Ошибка загрузки данных');
        }
    }

    function initHelpModal() {
        const helpButton = document.getElementById('help-button-contracts');
        const helpModal = document.getElementById('help-modal-contracts');
        const helpModalClose = document.getElementById('help-modal-close-contracts');

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
    }

    async function loadGameState() {
        try {
            const response = await fetch('/api/game/load', {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${jwtToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    redirectToChannel();
                    return;
                }
                throw new Error('Ошибка загрузки состояния игры');
            }

            gameState = await response.json();

            if (!gameState.nickname) {
                redirectToChannel();
                return;
            }

            if (gameState.activeStream) {
                window.location.href = 'stream';
                return;
            }

        } catch (error) {
            console.error('Ошибка загрузки состояния игры:', error);
            throw error;
        }
    }

    function redirectToChannel() {
        localStorage.setItem('returnUrl', window.location.href);
        window.location.href = '../chanel';
    }

    async function loadAgencies() {
        try {
            const response = await fetch('/api/agencies/catalog', {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${jwtToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error('Ошибка загрузки агентств');

            agencies = await response.json();
            renderAgencies();
        } catch (error) {
            console.error('Ошибка загрузки агентств:', error);
            document.getElementById('agencies-list').innerHTML =
                '<div class="error">Ошибка загрузки агентств</div>';
        }
    }

    async function loadCollabs() {
        try {
            const response = await fetch('/api/collabs/catalog', {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${jwtToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error('Ошибка загрузки коллабов');

            collabs = await response.json();
            renderCollabs();
        } catch (error) {
            console.error('Ошибка загрузки коллабов:', error);
            document.getElementById('collabs-list').innerHTML =
                '<div class="error">Ошибка загрузки коллабов</div>';
        }
    }

    function renderAgencies() {
        const container = document.getElementById('agencies-list');
        if (!agencies.length) {
            container.innerHTML = '<div class="empty">Нет доступных агентств</div>';
            return;
        }

        container.innerHTML = agencies.map(agency => `
            <div class="contract-item">
                ${getAgencyTags(agency)}
                <div class="contract-title">
                    <i class="agency-icon">🏢</i> ${agency.title}
                </div>
                <div class="contract-details">
                    <span><i class="fas fa-users"></i> Прирост: ${agency.subscriberBonus} подписчиков</span>
                    <span><i class="fas fa-money-bill-wave"></i> Зарплата: ${agency.income}/10 минут</span>
                    <span><i class="fas fa-tag"></i> Скидка в магазине: ${agency.discount*100}%</span>
                </div>
                <div class="contract-requirements">
                    <div class="requirements-title">
                        <i class="fas fa-tasks"></i> Требования:
                    </div>
                    ${agency.requirements.map(req => renderRequirement(req)).join('')}
                </div>
                ${renderAgencyButton(agency)}
            </div>
        `).join('');

        initAcceptButtons('agency');
        initRemoveAgencyButtons();
    }

    function renderCollabs() {
        const container = document.getElementById('collabs-list');
        if (!collabs.length) {
            container.innerHTML = '<div class="empty">Нет доступных коллабов</div>';
            return;
        }

        container.innerHTML = collabs.map(collab => `
            <div class="contract-item">
                ${getCollabTags(collab)}
                <div class="contract-title">
                    <i class="agency-icon">🤝</i> ${collab.title}
                </div>
                <div class="contract-details">
                    <span><i class="fas fa-chart-line"></i> Множитель: x${collab.multiplier}</span>
                    <span><i class="fas fa-stream"></i> Количество стримов: ${collab.requiredStreams}</span>
                </div>
                <div class="contract-requirements">
                    <div class="requirements-title">
                        <i class="fas fa-tasks"></i> Требования:
                    </div>
                    ${collab.requirements.map(req => renderRequirement(req)).join('')}
                </div>
                ${renderCollabButton(collab)}
            </div>
        `).join('');

        initAcceptButtons('collab');
        initRemoveCollabButtons();
    }

    function renderRequirement(req) {
        const percentage = req.value ? Math.min(100, (req.currentValue / req.value) * 100) : 100;
        let statusClass = 'requirement-failed';

        if (req.completed) {
            statusClass = 'requirement-completed';
        } else if (percentage >= 70) {
            statusClass = 'requirement-almost';
        }

        return `
            <div class="requirement ${statusClass}">
                <div class="requirement-icon">${getRequirementIcon(req.type)}</div>
                <div class="requirement-info">
                    <div class="requirement-text">${req.description || getDefaultRequirementText(req)}</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="requirement-status">${req.currentValue}/${req.value}</div>
                </div>
            </div>
        `;
    }

    function getRequirementIcon(type) {
        const icons = {
            'subscribers': '👥',
            'streams': '🎮',
            'average_online': '📈',
            'item': '🎭',
        };
        return icons[type] || '✅';
    }

    function getDefaultRequirementText(req) {
        const texts = {
            'subscribers': `${req.value} подписчиков`,
            'streams': `${req.value} стримов`,
            'average_online': `${req.value} среднего онлайна`,
            'item': `Предмет #${req.value}`,
        };
        return texts[req.type] || `${req.type}: ${req.value}`;
    }

    function renderAgencyButton(agency) {
        const hasAgency = gameState && gameState.agency;
        const isCurrentAgency = hasAgency && gameState.agency.title === agency.title;
        const allRequirementsMet = agency.requirements.every(req => req.completed);

        if (hasAgency) {
            if (isCurrentAgency) {
                return `
                    <button class="game-button delete-account-button remove-agency" 
                            data-title="${agency.title}">
                        Выйти из агентства
                    </button>
                `;
            }
            return '<button class="game-button small-button" disabled>У вас уже есть агенство</button>';
        }

        return `
            <button class="game-button small-button accept-contract" 
                    data-type="agency" 
                    data-title="${agency.title}"
                    ${!allRequirementsMet ? 'disabled' : ''}>
                ${allRequirementsMet ? 'Попроситься' : 'Требования не выполнены'}
            </button>
        `;
    }

    function renderCollabButton(collab) {
        const hasCollab = gameState && gameState.collab;
        const isCurrentCollab = hasCollab && gameState.collab.title === collab.title;
        const allRequirementsMet = collab.requirements.every(req => req.completed);

        if (hasCollab) {
            if (isCurrentCollab) {
                return `
                    <button class="game-button delete-account-button remove-collab" 
                            data-title="${collab.title}">
                        Отменить коллаб
                    </button>
                `;
            }
            return '<button class="game-button small-button" disabled>У вас уже есть коллаб</button>';
        }

        return `
            <button class="game-button small-button accept-contract" 
                    data-type="collab" 
                    data-title="${collab.title}"
                    ${!allRequirementsMet ? 'disabled' : ''}>
                ${allRequirementsMet ? 'Предложить' : 'Требования не выполнены'}
            </button>
        `;
    }

    function getAgencyTags(agency) {
        if (agency.title.includes('Hololive') || agency.title.includes('VShojo')) {
            return '<span class="contract-tag tag-exclusive">ЭКСКЛЮЗИВ</span>';
        }
        if (agency.title.includes('SCAM')) {
            return '<span class="contract-tag tag-new">НОВОЕ</span>';
        }
        if (agency.title.includes('Fru-Live')) {
            return '<span class="contract-tag tag-new">НОВОЕ</span>';
        }
        return '<span class="contract-tag tag-popular">ПОПУЛЯРНОЕ</span>';
    }

    function getCollabTags(collab) {
        if (collab.title.includes('Sameko Saba')) {
            return '<span class="contract-tag tag-exclusive">ЭКСКЛЮЗИВ</span>';
        }
        if (collab.title.includes('Ironmouse')) {
            return '<span class="contract-tag tag-popular">ПОПУЛЯРНОЕ</span>';
        }
        if (collab.title.includes('Nyanners')) {
            return '<span class="contract-tag tag-popular">ПОПУЛЯРНОЕ</span>';
        }
        return '<span class="contract-tag tag-new">НОВОЕ</span>';
    }

    function initAcceptButtons(type) {
        document.querySelectorAll('.accept-contract:not([disabled])').forEach(button => {
            button.removeEventListener('click', handleAcceptClick);
            button.addEventListener('click', handleAcceptClick);
        });

        function handleAcceptClick() {
            const title = this.getAttribute('data-title');
            if (!this.disabled) {
                acceptContract(type, title);
            }
        }
    }

    function initRemoveAgencyButtons() {
        document.querySelectorAll('.remove-agency').forEach(button => {
            button.removeEventListener('click', handleRemoveAgencyClick);
            button.addEventListener('click', handleRemoveAgencyClick);
        });

        function handleRemoveAgencyClick() {
            const title = this.getAttribute('data-title');
            if (!this.disabled) {
                removeAgency(title);
            }
        }
    }

    function initRemoveCollabButtons() {
        document.querySelectorAll('.remove-collab').forEach(button => {
            button.removeEventListener('click', handleRemoveCollabClick);
            button.addEventListener('click', handleRemoveCollabClick);
        });

        function handleRemoveCollabClick() {
            const title = this.getAttribute('data-title');
            if (!this.disabled) {
                removeCollab(title);
            }
        }
    }

    async function acceptContract(type, title) {
        const button = document.querySelector(`.accept-contract[data-title="${title}"]`);

        if (button) {
            button.disabled = true;
            button.textContent = 'Обработка...';
        }

        try {
            const endpoint = type === 'agency' ?
                `/api/agencies/accept/${encodeURIComponent(title)}` :
                `/api/collabs/accept/${encodeURIComponent(title)}`;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${jwtToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const errorText = await response.text();

                if (errorText.includes('banned') || errorText.includes('ban') || errorText.includes('until')) {
                    showBanNotification(errorText, type);
                    throw new Error(errorText);
                }

                throw new Error(errorText);
            }

            const message = await response.text();
            showContractMessage(title, message);

            await loadGameState();
            if (type === 'agency') {
                await loadAgencies();
            } else {
                await loadCollabs();
            }

        } catch (error) {
            console.error('Ошибка принятия контракта:', error);

            if (!error.message.includes('banned') && !error.message.includes('ban')) {
                showError(error.message);
            }

            if (button) {
                button.disabled = false;
                button.textContent = type === 'agency' ? 'Попроситься' : 'Предложить';
            }
        }
    }

    function showBanNotification(message, type) {
        const category = type === 'agency' ? 'агентств' : 'коллабов';

        const timeMatch = message.match(/until (.+)$/);
        const banTime = timeMatch ? timeMatch[1] : 'неизвестное время';

        const overlay = document.createElement('div');
        overlay.className = 'ban-notification-overlay';
        overlay.innerHTML = `
            <div class="ban-notification">
                <div class="ban-notification-icon">⏰</div>
                <div class="ban-notification-content">
                    <h2>Доступ ограничен</h2>
                    <p>Вы временно не можете заключать договоры ${category}.</p>
                    <div class="ban-details">
                        <div class="ban-time">
                            <i class="fas fa-clock"></i>
                            <span>Бан до: ${banTime} (МСК)</span>
                        </div>
                        <div class="ban-reason">
                            <i class="fas fa-info-circle"></i>
                            <span>Слишком частые изменения ${category}</span>
                        </div>
                    </div>
                </div>
                <button class="game-button ban-notification-close">Понятно</button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            overlay.classList.add('active');
            overlay.querySelector('.ban-notification').classList.add('active');
        }, 10);

        const closeButton = overlay.querySelector('.ban-notification-close');
        closeButton.addEventListener('click', () => closeBanNotification(overlay));

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeBanNotification(overlay);
            }
        });

        document.addEventListener('keydown', function handleEscape(e) {
            if (e.key === 'Escape') {
                closeBanNotification(overlay);
                document.removeEventListener('keydown', handleEscape);
            }
        });
    }

    function closeBanNotification(overlay) {
        overlay.classList.remove('active');
        overlay.querySelector('.ban-notification').classList.remove('active');

        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            document.body.style.overflow = '';
        }, 300);
    }

    function showConfirmationModal(type, title, callback) {
        const overlay = document.createElement('div');
        overlay.className = 'confirmation-overlay';
        overlay.innerHTML = `
        <div class="confirmation-modal">
            <div class="confirmation-header">
                <h2>Подтверждение</h2>
                <span class="confirmation-close">&times;</span>
            </div>
            <div class="confirmation-body">
                <div class="confirmation-icon">⚠️</div>
                <p>Вы уверены, что хотите ${type === 'agency' ? 'выйти из агентства' : 'отменить коллаб'}</p>
                <p class="confirmation-title">"${title}"?</p>
                <div class="confirmation-warning">
                    ${type === 'agency' ?
            'Вы потеряете все бонусы агентства!' :
            'Вы потеряете все бонусы от этого коллаба!'}
                </div>
            </div>
            <div class="confirmation-buttons">
                <button class="game-button confirmation-cancel">Отмена</button>
                <button class="game-button confirmation-confirm danger">Подтвердить</button>
            </div>
        </div>
    `;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            overlay.classList.add('active');
            overlay.querySelector('.confirmation-modal').classList.add('active');
        }, 10);

        const closeButton = overlay.querySelector('.confirmation-close');
        const cancelButton = overlay.querySelector('.confirmation-cancel');
        const confirmButton = overlay.querySelector('.confirmation-confirm');

        function closeModal() {
            overlay.classList.remove('active');
            overlay.querySelector('.confirmation-modal').classList.remove('active');

            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
                document.body.style.overflow = '';
            }, 300);
        }

        closeButton.addEventListener('click', closeModal);
        cancelButton.addEventListener('click', closeModal);

        confirmButton.addEventListener('click', () => {
            closeModal();
            callback();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });

        document.addEventListener('keydown', function handleEscape(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        });
    }

    async function removeAgency(title) {
        showConfirmationModal('agency', title, async () => {
            const button = document.querySelector(`.remove-agency[data-title="${title}"]`);

            if (button) {
                button.disabled = true;
                button.textContent = 'Обработка...';
            }

            try {
                const response = await fetch('/api/agencies/remove', {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${jwtToken}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();

                    if (errorText.includes('banned') || errorText.includes('ban') || errorText.includes('until')) {
                        showBanNotification(errorText, 'agency');
                        throw new Error(errorText);
                    }

                    throw new Error(errorText);
                }

                const message = await response.text();

                await loadGameState();
                await loadAgencies();

            } catch (error) {
                console.error('Ошибка выхода из агентства:', error);

                if (!error.message.includes('banned') && !error.message.includes('ban')) {
                    showError(error.message);
                }

                if (button) {
                    button.disabled = false;
                    button.textContent = 'Выйти из агентства';
                }
            }
        });
    }

    async function removeCollab(title) {
        showConfirmationModal('collab', title, async () => {
            const button = document.querySelector(`.remove-collab[data-title="${title}"]`);

            if (button) {
                button.disabled = true;
                button.textContent = 'Обработка...';
            }

            try {
                const response = await fetch('/api/collabs/remove', {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${jwtToken}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();

                    if (errorText.includes('banned') || errorText.includes('ban') || errorText.includes('until')) {
                        showBanNotification(errorText, 'collab');
                        throw new Error(errorText);
                    }

                    throw new Error(errorText);
                }

                const message = await response.text();

                await loadGameState();
                await loadCollabs();

            } catch (error) {
                console.error('Ошибка выхода из коллаба:', error);

                if (!error.message.includes('banned') && !error.message.includes('ban')) {
                    showError(error.message);
                }

                if (button) {
                    button.disabled = false;
                    button.textContent = 'Отменить коллаб';
                }
            }
        });
    }

    function initCategorySwitcher() {
        const categoryButtons = document.querySelectorAll('.contracts-category');
        const contractContainers = document.querySelectorAll('.contracts-container');

        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-category');

                categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                contractContainers.forEach(container => container.classList.remove('active'));
                document.getElementById(`${category}-contracts`).classList.add('active');
            });
        });
    }

    function showContractMessage(title, message) {
        const overlay = document.createElement('div');
        overlay.className = 'contract-message-overlay';
        overlay.innerHTML = `
            <div class="contract-message">
                <h2 class="contract-message-title">Договор Подписан</h2>
                <div class="contract-message-icon">📝</div>
                <div class="contract-message-content">
                    <p class="contract-message-details">${title}</p>
                    <p>Удачных стримов</p>
                </div>
                <button class="game-button contract-message-close">Закрыть окно</button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            overlay.classList.add('active');
            overlay.querySelector('.contract-message').classList.add('active');
        }, 10);

        const closeButton = overlay.querySelector('.contract-message-close');
        closeButton.addEventListener('click', () => closeContractMessage(overlay));

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeContractMessage(overlay);
            }
        });

        document.addEventListener('keydown', function handleEscape(e) {
            if (e.key === 'Escape') {
                closeContractMessage(overlay);
                document.removeEventListener('keydown', handleEscape);
            }
        });
    }

    function closeContractMessage(overlay) {
        overlay.classList.remove('active');
        overlay.querySelector('.contract-message').classList.remove('active');

        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            document.body.style.overflow = '';
        }, 300);
    }

    function showError(message) {
        alert(`Ошибка: ${message}`);
    }

    function initTheme() {
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
    }

    initTheme();
    loadData();
});