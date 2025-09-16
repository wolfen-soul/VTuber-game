<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Начать стрим - Vtuber Simulator</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="../styles/theme.css">
    <link rel="stylesheet" href="../styles/game.css">
    <link rel="stylesheet" href="../styles/start_stream.css">
    <link rel="icon" type="image/x-icon" href="../../vtuberwiki.ico">
</head>
<body>
<div class="phone-container">
    <div class="phone-screen">
        <div class="game-header">
            <h1>Начать стрим</h1>
            <p class="game-subtitle">Подготовка к трансляции</p>
        </div>

        <div class="stream-controls">
            <div class="stream-option">
                <label>Название стрима:</label>
                <input type="text" class="stream-title" placeholder="Введите название стрима">
            </div>

            <div class="stream-option">
                <label>Сложность стрима:</label>
                <div class="difficulty-options">
                    <div class="difficulty-option very-easy" data-difficulty="very-easy">
                        <div class="difficulty-number">1</div>
                        <div class="difficulty-label">Очень легкая</div>
                    </div>
                    <div class="difficulty-option easy" data-difficulty="easy">
                        <div class="difficulty-number">2</div>
                        <div class="difficulty-label">Легкая</div>
                    </div>
                    <div class="difficulty-option medium selected" data-difficulty="medium">
                        <div class="difficulty-number">3</div>
                        <div class="difficulty-label">Средняя</div>
                    </div>
                    <div class="difficulty-option hard" data-difficulty="hard">
                        <div class="difficulty-number">4</div>
                        <div class="difficulty-label">Сложная</div>
                    </div>
                    <div class="difficulty-option very-hard" data-difficulty="very-hard">
                        <div class="difficulty-number">5</div>
                        <div class="difficulty-label">Эксперт</div>
                    </div>
                </div>
            </div>

            <button class="game-button big-button start-stream-btn">Запустить стрим</button>
        </div>

        <div class="game-content">
            <div class="stream-status" style="display: none;">
                <div class="status-message">Обратный отсчет к началу трансляции</div>
                <div class="stream-timer">00:05</div>
            </div>
        </div>

        <div class="back-button">
            <a href="../game" class="game-button">← Назад</a>
        </div>
    </div>
</div>

<script src="../scripts/start_stream.js"></script>
</body>
</html>