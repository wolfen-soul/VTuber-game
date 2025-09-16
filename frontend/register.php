<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Регистрация - Vtuber Simulator</title>
    <link rel="stylesheet" href="styles/auth.css">
    <link rel="icon" type="image/x-icon" href="../vtuberwiki.ico">
</head>
<body>
<div class="auth-container fade-in">
    <div class="logo">
        <h1>Vtuber<span>Simulator</span></h1>
    </div>

    <div class="account-limit">
        Осталось аккаунтов: <strong id="remainingAccounts">3</strong> из 3
    </div>

    <form id="registerForm">
        <h2>Создание аккаунта</h2>

        <input type="hidden" id="deviceFingerprint" name="deviceFingerprint">

        <div class="form-group">
            <input type="text" id="newUsername" placeholder="Username" required
                   pattern="[a-zA-Z0-9_]{3,20}" title="Только буквы, цифры и подчеркивания">
        </div>

        <div class="form-group">
            <input type="password" id="newPassword" placeholder="Password" required minlength="6">
        </div>

        <div class="form-group">
            <input type="password" id="confirmPassword" placeholder="Confirm Password" required minlength="6">
            <div id="passwordError" class="error-message" style="display: none;">Пароли не совпадают</div>
        </div>

        <button type="submit" class="auth-button">Регистрация</button>

        <div class="auth-links">
            <p>Уже есть аккаунт? <a href="../login.html">Войти</a></p>
            <p><a href="../home">Вернуться на главную</a></p>
        </div>
    </form>
</div>
<script src="scripts/auth.js"></script>
</body>
</html>