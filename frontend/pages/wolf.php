<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Волк - Vtuber Simulator</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="../styles/theme.css">
    <link rel="stylesheet" href="../styles/game.css">
    <link rel="stylesheet" href="../styles/wolf.css">
    <link rel="icon" type="image/x-icon" href="../../vtuberwiki.ico">
</head>
<body>
<div class="phone-container">
    <div class="phone-screen">
        <div class="game-header">
            <h1>Волк</h1>
            <p class="game-subtitle">Трансграничный договор с волком</p>
        </div>

        <div class="wolf-container">
            <div class="wolf-character">
                <div class="wolf-image">
                    <img src="../img/Volk.png" alt="Волк">
                </div>

                <div class="wolf-requirements">
                    <h3>Проверка требований:</h3>
                    <div class="requirements-list" id="requirements-list">
                        <div class="requirement-item">
                            <span class="requirement-icon">❌</span>
                            <span class="requirement-text">Загрузка требований...</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="wolf-story">
                <h3>Встретиться с судьбой:</h3>
                <div class="action-buttons">
                    <button class="wolf-action" id="sign-contract" disabled>
                        Подписать договор
                    </button>
                </div>
            </div>

            <div class="wolf-story">
                <h3>История Волка:</h3>
                <p>Волк без лап и без стаи так и жил — бухал в одиночестве, волоча тушу по лесу на передниках. Когда он завыл, эхо вернуло ему жалкий звук, похожий скорее на икоту. Лес даже совы разбудить не смог — всем было..... Все равно.🐺</p>
            </div>

            <div class="back-button">
                <a href="../game" class="game-button">← Назад</a>
            </div>
        </div>
    </div>
</div>

<script src="../scripts/wolf.js"></script>
</body>
</html>