<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Вход - Vtuber Simulator</title>
    <link rel="stylesheet" href="styles/auth.css">
    <link rel="icon" type="image/x-icon" href="../vtuberwiki.ico">
</head>
<body>
<div class="auth-container fade-in">
    <div class="logo">
        <h1>Vtuber<span>Simulator</span></h1>
    </div>
    <form id="loginForm">
        <h2>Вход в аккаунт</h2>

        <div class="form-group">
            <input type="text" id="username" placeholder="Username" required
                   pattern="[a-zA-Z0-9_]{3,20}" title="Только буквы, цифры и подчеркивания (3-20 символов)">
        </div>

        <div class="form-group">
            <input type="password" id="password" placeholder="Password" required minlength="6">
        </div>

        <button type="submit" class="auth-button">Войти</button>

        <div class="auth-links">
            <p>Нет аккаунта? <a href="register.php">Зарегистрироваться</a></p>
            <p><a href="../home">Вернуться на главную</a></p>
        </div>
    </form>
</div>
<script src="scripts/auth.js"></script>
</body>
</html>