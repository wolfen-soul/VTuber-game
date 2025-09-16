document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('jwtToken');

    if (token) {
        window.location.href = 'chanel';
    }

    initPasswordValidation();
    createNotificationContainer();
    updateRegistrationLimit();
});

function createNotificationContainer() {
    if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
}

function showNotification(type, title, message, duration = 5000) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icon = type === 'success' ? '✓' : '✗';

    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
            <div class="notification-progress">
                <div class="notification-progress-bar"></div>
            </div>
        </div>
        <button class="notification-close" onclick="closeNotification(this.parentElement)">×</button>
    `;

    container.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    if (duration > 0) {
        setTimeout(() => {
            closeNotification(notification);
        }, duration);
    }

    return notification;
}

function closeNotification(notification) {
    notification.classList.remove('show');
    notification.classList.add('hide');

    setTimeout(() => {
        if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
        }
    }, 300);
}

function initPasswordValidation() {
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const passwordError = document.getElementById('passwordError');

    if (confirmPasswordInput && newPasswordInput && passwordError) {
        confirmPasswordInput.addEventListener('input', function() {
            validatePasswords();
        });

        newPasswordInput.addEventListener('input', function() {
            if (confirmPasswordInput.value.length > 0) {
                validatePasswords();
            }
        });
    }
}

function validatePasswords() {
    const password = document.getElementById('newPassword')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    if (!password || !confirmPassword || !passwordError || !confirmPasswordInput) {
        return;
    }

    if (confirmPassword.length > 0) {
        if (password !== confirmPassword) {
            confirmPasswordInput.classList.add('password-mismatch');
            confirmPasswordInput.classList.remove('password-match');
            passwordError.style.display = 'block';
        } else {
            confirmPasswordInput.classList.add('password-match');
            confirmPasswordInput.classList.remove('password-mismatch');
            passwordError.style.display = 'none';
        }
    } else {
        confirmPasswordInput.classList.remove('password-mismatch', 'password-match');
        passwordError.style.display = 'none';
    }
}

async function updateRegistrationLimit() {
    try {
        const response = await fetch('/api/auth/registration-limit', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            const limitElement = document.getElementById('remainingAccounts');
            if (limitElement) {
                limitElement.textContent = data.remainingRegistrations;
            }
            return data.remainingRegistrations;
        } else {
            console.error('Failed to fetch registration limit');
            return 3;
        }
    } catch (error) {
        console.error('Error fetching registration limit:', error);
        return 3;
    }
}

async function generateDeviceFingerprint() {
    try {
        const components = [];

        components.push(navigator.userAgent);
        components.push(navigator.language);
        components.push(screen.width + 'x' + screen.height);
        components.push(new Date().getTimezoneOffset());
        components.push(navigator.hardwareConcurrency || 'unknown');

        if (navigator.gpu) {
            try {
                const adapter = await navigator.gpu.requestAdapter();
                if (adapter) {
                    components.push(adapter.info.vendor || 'unknown');
                    components.push(adapter.info.architecture || 'unknown');
                }
            } catch (e) {
                components.push('gpu-unknown');
            }
        }

        const data = components.join('|');
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        return hashHex;
    } catch (error) {
        console.error('Error generating device fingerprint:', error);
        return Math.random().toString(36).substring(2) +
            Date.now().toString(36) +
            Math.random().toString(36).substring(2);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('jwtToken');

    if (token) {
        window.location.href = 'chanel';
    }

    initPasswordValidation();
    createNotificationContainer();

    const fingerprint = await generateDeviceFingerprint();
    const fingerprintField = document.getElementById('deviceFingerprint');
    if (fingerprintField) {
        fingerprintField.value = fingerprint;
    }

    updateRegistrationLimit();
});

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const button = e.target.querySelector('button[type="submit"]');
    const originalText = button.textContent;

    try {
        button.disabled = true;
        button.textContent = 'Вход...';

        const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const responseText = await response.text();

        if (!response.ok) {
            let errorData;
            try {
                errorData = JSON.parse(responseText);
            } catch {
                throw new Error(responseText || 'Произошла неизвестная ошибка');
            }

            let errorMessage = errorData.error || errorData.message || responseText;

            const errorTranslations = {
                'User with that username does not exist': 'Пользователь с таким именем не существует',
                'Invalid password': 'Неверный пароль',
                'Bad credentials': 'Неверный пароль',
                'User is disabled': 'Пользователь заблокирован',
                'User account is locked': 'Учетная запись заблокирована'
            };

            errorMessage = errorTranslations[errorMessage] || errorMessage;
            throw new Error(errorMessage);
        }

        const data = JSON.parse(responseText);
        const token = data.token;
        if (!token) {
            throw new Error("Токен не получен");
        }

        localStorage.setItem('jwtToken', token);

        showNotification('success', 'Успешный вход!', 'Приятной игры!', 1000);

        setTimeout(() => {
            window.location.href = 'chanel';
        }, 1000);

    } catch (error) {
        showNotification('error', 'Ошибка входа', error.message, 5000);
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
});

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const passwordError = document.getElementById('passwordError');
    const button = e.target.querySelector('button[type="submit"]');
    const originalText = button.textContent;

    if (password !== confirmPassword) {
        passwordError.style.display = 'block';
        document.getElementById('confirmPassword').classList.add('password-mismatch');
        showNotification('error', 'Ошибка', 'Пароли не совпадают', 3000);
        return;
    }

    try {
        button.disabled = true;
        button.textContent = 'Регистрация...';

        const remaining = await updateRegistrationLimit();
        if (remaining <= 0) {
            showNotification('error', 'Лимит исчерпан', 'Вы превысили лимит регистраций. Максимум 3 аккаунта на пользователя.', 5000);
            return;
        }

        const registerResponse = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!registerResponse.ok) {
            const errorData = await registerResponse.text();
            let errorMessage = 'Произошла неизвестная ошибка';
            try {
                const errorObj = JSON.parse(errorData);
                if (errorObj.error === 'User with that username already exists') {
                    errorMessage = `Пользователь с именем "${username}" уже существует.`;
                } else {
                    errorMessage = errorObj.message || errorData;
                }
            } catch (e) {
                errorMessage = errorData;
            }
            throw new Error(errorMessage);
        }

        const loginResponse = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!loginResponse.ok) {
            const errorData = await loginResponse.text();
            throw new Error('Регистрация успешна, но не удалось войти: ' + errorData);
        }

        const data = await loginResponse.json();
        const token = data.token;

        if (!token) {
            throw new Error("Token not found after registration");
        }

        localStorage.setItem('jwtToken', token);

        showNotification('success', 'Успешная регистрация!', 'Приятной игры!', 1000);

        setTimeout(() => {
            window.location.href = 'chanel';
        }, 1000);

    } catch (error) {
        showNotification('error', 'Ошибка регистрации', error.message, 5000);
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
});