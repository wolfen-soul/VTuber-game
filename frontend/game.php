<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Vtuber Simulator</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="styles/theme.css">
    <link rel="stylesheet" href="styles/game.css">
    <link rel="icon" type="image/x-icon" href="../vtuberwiki.ico">
</head>
<body>
<div class="phone-container">
    <div class="phone-screen">
        <div class="game-header">
            <h1>Vtuber Simulator</h1>
            <h2><p class="game-subtitle">Добро пожаловать, <span id="user-nickname"></span>!</p></h2>
        </div>

        <div class="info-container">
            <div class="info-item">
                <span class="info-label">Подписчики:</span>
                <span class="info-value" id="subscribers-count">0</span>
            </div>
            <div class="info-item">
                <span class="info-label">Стримы:</span>
                <span class="info-value" id="streams-count">0</span>
            </div>
            <div class="info-item">
                <span class="info-label">Баланс:</span>
                <span class="info-value" id="balance-amount">0</span>
            </div>
        </div>

        <div class="game-controls">
            <a href="pages/start_stream.php" class="game-button big-button">Начать стрим</a>
            <div class="button-row">
                <a href="pages/contracts.php" class="game-button">Сотрудничество</a>
                <a href="pages/info.php" class="game-button">Информация</a>
            </div>
            <div class="button-row">
                <a href="pages/shop.php" class="game-button">Магазин</a>
                <a href="pages/wolf.php" class="game-button">Волк</a>
            </div>
            <div class="button-row">
                <a href="pages/zavod.php" class="game-button">На завод!</a>
            </div>
            <div class="button-row">
                <a href="#" class="game-button theme-button" id="themeToggleButton">сменить тему</a>
            </div>
            <a href="../home" class="game-button">На главную</a>
            <a href="#" class="game-button logout-button" id="logoutButton">Выйти из аккаунта</a>
            <div class="button-row">
                <a href="#" class="game-button delete-account-button" id="deleteAccountButton">Удалить аккаунт</a>
            </div>

            <div class="modal-overlay" id="deleteAccountModal">
                <div class="modal-container">
                    <div class="modal-header">
                        <h3>Удаление аккаунта</h3>
                    </div>
                    <div class="modal-content">
                        <p>Вы уверены, что хотите удалить аккаунт? Это действие невозможно отменить!</p>
                        <p>Все ваши данные будут безвозвратно удалены.</p>
                        <div class="confirmation-input">
                            <label for="confirmDelete">Введите "УДАЛИТЬ" для подтверждения:</label>
                            <input type="text" id="confirmDelete" class="confirm-input" placeholder="УДАЛИТЬ">
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="modal-button cancel-button" id="deleteCancel">Отмена</button>
                        <button class="modal-button delete-confirm-button" id="deleteConfirm" disabled>Удалить</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="scripts/game.js"></script>
<div class="modal-overlay" id="logoutModal">
    <div class="modal-container">
        <div class="modal-header">
            <h3>Подтверждение выхода</h3>
        </div>
        <div class="modal-content">
            <p>Вы уверены, что хотите выйти из аккаунта?</p>
        </div>
        <div class="modal-actions">
            <button class="modal-button cancel-button" id="logoutCancel">Отмена</button>
            <button class="modal-button confirm-button" id="logoutConfirm">Выйти</button>
        </div>
    </div>
</div>
</body>
</html>