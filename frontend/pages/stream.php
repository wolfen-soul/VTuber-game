<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Стрим - Vtuber Simulator</title>
    <link rel="stylesheet" href="../styles/game.css">
    <link rel="stylesheet" href="../styles/theme.css">
    <link rel="icon" type="image/x-icon" href="../../vtuberwiki.ico">
</head>
<body>
<div class="main-container">
    <div class="phone-container">
        <div class="phone-screen">
            <div class="game-header">
                <h1 id="streamTitle">Название стрима</h1>
                <div class="game-subtitle" id="streamCategory">Категория</div>
            </div>

            <div class="info-container">
                <div class="info-item">
                    <div class="info-label">Счет</div>
                    <div class="info-value" id="score">0</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Время</div>
                    <div class="info-value" id="time">00:00</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Зрители</div>
                    <div class="info-value" id="viewers">0</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Донаты</div>
                    <div class="info-value" id="donations">0 ₽</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Точность</div>
                    <div class="info-value" id="accuracy">0%</div>
                </div>
            </div>

            <div class="game-content">
                <div class="grid-container">
                    <div class="grid" id="grid"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="chat-sidebar">
        <div class="chat-header">Чат трансляции</div>
        <div class="chat-messages" id="chatMessages">
        </div>
    </div>
</div>

<script src="../scripts/stream.js"></script>
</body>
</html>