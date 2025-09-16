class GameManager {
    constructor() {
        this.gameState = null;
        this.updateInterval = null;
        this.init();
    }

    init() {
        if (!this.checkAuthentication()) return;
        this.setupTheme();
        this.setupEventListeners();
        this.setupDeleteAccountListeners();
        this.loadGameData();
        this.startAutoUpdate();
        this.setupAnimations();
    }

    checkAuthentication() {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            window.location.href = 'login';
            return false;
        }
        return true;
    }

    async loadGameData() {
        try {
            this.showLoading();

            const token = localStorage.getItem('jwtToken');
            const response = await fetch('/api/game/load', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                this.gameState = await response.json();

                if (!this.gameState || !this.gameState.nickname) {
                    this.redirectToChannel();
                    return;
                }

                if (this.gameState.activeStream) {
                    window.location.href = 'pages/stream';
                    return;
                }

                this.updateUI();
            } else if (response.status === 401) {
                this.handleUnauthorized();
            } else if (response.status === 404) {
                this.redirectToChannel();
            } else {
                console.error('Ошибка загрузки данных:', response.status);
                this.showError('Ошибка загрузки данных');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            this.showError('Сетевая ошибка');
        } finally {
            this.hideLoading();
        }
    }

    redirectToChannel() {
        localStorage.setItem('returnUrl', window.location.href);
        window.location.href = 'chanel';
    }

    updateUI() {
        if (!this.gameState) return;

        const nicknameElement = document.getElementById('user-nickname');
        if (nicknameElement) {
            nicknameElement.textContent = this.gameState.nickname || 'Пользователь';
        }

        const subscribersElement = document.getElementById('subscribers-count');
        if (subscribersElement) {
            subscribersElement.textContent = this.gameState.subscribers.toLocaleString();
        }

        const streamsElement = document.getElementById('streams-count');
        if (streamsElement) {
            streamsElement.textContent = this.gameState.streamsAmount.toLocaleString();
        }

        const balanceElement = document.getElementById('balance-amount');
        if (balanceElement) {
            balanceElement.textContent = this.gameState.balance.toLocaleString();
        }

        document.title = `${this.gameState.nickname} - Vtuber Simulator`;
    }

    setupEventListeners() {
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLogoutModal();
            });
        }

        const themeToggleButton = document.getElementById('themeToggleButton');
        if (themeToggleButton) {
            themeToggleButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }

        const gameButtons = document.querySelectorAll('.game-button');
        gameButtons.forEach(button => {
            if (button.id !== 'themeToggleButton' && button.id !== 'logoutButton' && button.id !== 'deleteAccountButton') {
                button.addEventListener('click', function(e) {
                    if (this.getAttribute('href') === '#') {
                        e.preventDefault();
                    }
                });
            }
        });

        window.addEventListener('beforeunload', () => {
            this.destroy();
        });

        const logoutCancel = document.getElementById('logoutCancel');
        if (logoutCancel) {
            logoutCancel.addEventListener('click', () => {
                this.hideLogoutModal();
            });
        }

        const logoutConfirm = document.getElementById('logoutConfirm');
        if (logoutConfirm) {
            logoutConfirm.addEventListener('click', () => {
                this.performLogout();
            });
        }

        const logoutModal = document.getElementById('logoutModal');
        if (logoutModal) {
            logoutModal.addEventListener('click', (e) => {
                if (e.target === e.currentTarget) {
                    this.hideLogoutModal();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const deleteModal = document.getElementById('deleteAccountModal');
                const logoutModal = document.getElementById('logoutModal');

                if (deleteModal && deleteModal.classList.contains('active')) {
                    this.hideDeleteAccountModal();
                }

                if (logoutModal && logoutModal.classList.contains('active')) {
                    this.hideLogoutModal();
                }
            }
        });
    }

    setupDeleteAccountListeners() {
        const deleteAccountButton = document.getElementById('deleteAccountButton');
        if (deleteAccountButton) {
            deleteAccountButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.showDeleteAccountModal();
            });
        }

        const confirmInput = document.getElementById('confirmDelete');
        if (confirmInput) {
            confirmInput.addEventListener('input', (e) => {
                this.validateDeleteConfirmation(e.target.value);
            });

            confirmInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const confirmButton = document.getElementById('deleteConfirm');
                    if (!confirmButton.disabled) {
                        this.performAccountDeletion();
                    }
                }
            });
        }

        const deleteCancel = document.getElementById('deleteCancel');
        if (deleteCancel) {
            deleteCancel.addEventListener('click', () => {
                this.hideDeleteAccountModal();
            });
        }

        const deleteConfirm = document.getElementById('deleteConfirm');
        if (deleteConfirm) {
            deleteConfirm.addEventListener('click', () => {
                this.performAccountDeletion();
            });
        }

        const deleteModal = document.getElementById('deleteAccountModal');
        if (deleteModal) {
            deleteModal.addEventListener('click', (e) => {
                if (e.target === e.currentTarget) {
                    this.hideDeleteAccountModal();
                }
            });
        }
    }

    showDeleteAccountModal() {
        const modal = document.getElementById('deleteAccountModal');
        if (modal) {
            const confirmInput = document.getElementById('confirmDelete');
            if (confirmInput) {
                confirmInput.value = '';
                confirmInput.classList.remove('error', 'shake');
            }

            const confirmButton = document.getElementById('deleteConfirm');
            if (confirmButton) {
                confirmButton.disabled = true;
            }

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            setTimeout(() => {
                if (confirmInput) confirmInput.focus();
            }, 100);
        }
    }

    hideDeleteAccountModal() {
        const modal = document.getElementById('deleteAccountModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    validateDeleteConfirmation(inputText) {
        const confirmButton = document.getElementById('deleteConfirm');
        const confirmInput = document.getElementById('confirmDelete');

        if (inputText.toUpperCase() === 'УДАЛИТЬ') {
            confirmButton.disabled = false;
            confirmInput.classList.remove('error', 'shake');
        } else {
            confirmButton.disabled = true;
            if (inputText.length > 0) {
                confirmInput.classList.add('error');
                confirmInput.classList.add('shake');
                setTimeout(() => {
                    confirmInput.classList.remove('shake');
                }, 300);
            } else {
                confirmInput.classList.remove('error');
            }
        }
    }

    async performAccountDeletion() {
        try {
            this.showLoading();

            const token = localStorage.getItem('jwtToken');
            const response = await fetch('/api/game/account', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                this.showSuccess('Аккаунт успешно удален');

                setTimeout(() => {
                    localStorage.removeItem('jwtToken');
                    localStorage.removeItem('username');
                    localStorage.removeItem('theme');
                    window.location.href = 'login';
                }, 2000);

            } else if (response.status === 401) {
                this.handleUnauthorized();
            } else {
                const errorData = await response.json().catch(() => ({}));
                this.showError(errorData.message || 'Ошибка при удалении аккаунта');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            this.showError('Сетевая ошибка при удалении аккаунта');
        } finally {
            this.hideLoading();
            this.hideDeleteAccountModal();
        }
    }

    showLogoutModal() {
        const modal = document.getElementById('logoutModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideLogoutModal() {
        const modal = document.getElementById('logoutModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    performLogout() {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        localStorage.removeItem('theme');
        window.location.href = 'login';
    }

    setupTheme() {
        const htmlElement = document.documentElement;
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme) {
            htmlElement.setAttribute('data-theme', savedTheme);
            this.updateThemeButtonText(savedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const defaultTheme = prefersDark ? 'dark' : 'light';
            htmlElement.setAttribute('data-theme', defaultTheme);
            localStorage.setItem('theme', defaultTheme);
            this.updateThemeButtonText(defaultTheme);
        }

        window.addEventListener('storage', (e) => {
            if (e.key === 'theme') {
                htmlElement.setAttribute('data-theme', e.newValue);
                this.updateThemeButtonText(e.newValue);
            }
        });
    }

    toggleTheme() {
        const htmlElement = document.documentElement;
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeButtonText(newTheme);

        window.dispatchEvent(new StorageEvent('storage', {
            key: 'theme',
            newValue: newTheme,
            oldValue: currentTheme
        }));

        document.body.classList.add('no-transitions');
        setTimeout(() => {
            document.body.classList.remove('no-transitions');
        }, 100);
    }

    updateThemeButtonText(theme) {
        const themeButton = document.getElementById('themeToggleButton');
        if (themeButton) {
            themeButton.textContent = theme === 'dark' ? 'светлая тема' : 'тёмная тема';
        }
    }

    startAutoUpdate() {
        this.updateInterval = setInterval(() => {
            this.loadGameData();
        }, 30000);
    }

    handleUnauthorized() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        this.showError('Сессия истекла. Перенаправление на страницу входа...');

        setTimeout(() => {
            window.location.href = 'login';
        }, 2000);
    }

    showLoading() {
        let overlay = document.getElementById('loading-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                           background: rgba(0,0,0,0.7); display: flex; justify-content: center; 
                           align-items: center; z-index: 9999;">
                    <div style="color: white; font-size: 18px;">Загрузка данных...</div>
                </div>
            `;
            document.body.appendChild(overlay);
        }
        overlay.style.display = 'flex';
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            if (document.body.contains(errorDiv)) {
                document.body.removeChild(errorDiv);
            }
        }, 3000);
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        successDiv.textContent = message;
        document.body.appendChild(successDiv);

        setTimeout(() => {
            if (document.body.contains(successDiv)) {
                document.body.removeChild(successDiv);
            }
        }, 3000);
    }

    setupAnimations() {
        const phoneContainer = document.querySelector('.phone-container');
        if (phoneContainer) {
            phoneContainer.style.opacity = '0';
            phoneContainer.style.transform = 'translateY(20px)';
            phoneContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            setTimeout(() => {
                phoneContainer.style.opacity = '1';
                phoneContainer.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.gameManager = new GameManager();
});

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    if (window.gameManager) {
        window.gameManager.showError('Произошла ошибка приложения');
    }
});

window.addEventListener('online', () => {
    if (window.gameManager) {
        window.gameManager.loadGameData();
    }
});

window.addEventListener('offline', () => {
    if (window.gameManager) {
        window.gameManager.showError('Отсутствует интернет-соединение');
    }
});