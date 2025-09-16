<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>На завод! - Vtuber Simulator</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="../styles/theme.css">
    <link rel="stylesheet" href="../styles/game.css">
    <link rel="stylesheet" href="../styles/zavod.css">
    <link rel="icon" type="image/x-icon" href="../../vtuberwiki.ico">
</head>
<body>
<div class="phone-container">
    <div class="phone-screen">
        <div class="game-header">
            <h1>На завод!</h1>
            <p class="game-subtitle">Кликай и зарабатывай очки на оборудование</p>
        </div>

        <div class="zavod-container">
            <div class="click-counter" id="clickCounter">0</div>

            <button class="click-button" id="clickButton">
                КЛИКАЙ!
            </button>

            <div class="progress-bar">
                <div class="progress-fill" id="progressFill" style="width: 0%"></div>
            </div>

            <div class="stats-info">
                <div class="zavod-stat-item">
                    <span>Клики:</span>
                    <span id="clicksCombined">
            <span id="totalClicks">0</span>/<span id="clicksToBan">1000</span>
        </span>
                </div>
                <div class="zavod-stat-item">
                    <span>Заработано:</span>
                    <span id="earnedMoney">0</span>
                </div>
            </div>

            <div class="ban-timer" id="banTimer">
                <div class="timer-text">Остынь:</div>
                <div class="timer-value" id="timerValue">10:00</div>
                <p>Отдыхай! Смена уже закрыта!</p>
            </div>
        </div>

        <div class="button-row">
            <a href="../game" class="game-button back-button">Назад</a>
        </div>
    </div>
</div>
<script>
    const JWT_TOKEN = localStorage.getItem('jwtToken');

    if (!JWT_TOKEN) {
        window.location.href = '../login';
    }
</script>
<script src="../scripts/game.js"></script>
<script src="../scripts/zavod.js"></script>
</body>
</html>