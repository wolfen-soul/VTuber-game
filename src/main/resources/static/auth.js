// Обработка входа
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8080/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        console.log("Получен ответ:", response.status);
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(response.status, errorData);
        }

        const data = await response.json();
        const token = data.token;
        if (!token) {
            alert("Token not found");
            return;
        }
        localStorage.setItem('jwtToken', token);
        alert(localStorage.getItem('jwtToken'));
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 1000);
    } catch (error) {
        alert(error.message);
    }
});

// Обработка регистрации
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error');
        }

        alert('Success! Now you can sign in.');
        window.location.href = 'login.html';
    } catch (error) {
        alert(error.message);
    }
});