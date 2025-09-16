<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Договора - Vtuber Simulator</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="icon" type="image/x-icon" href="../../vtuberwiki.ico">
    <link rel="stylesheet" href="../styles/theme.css">
    <link rel="stylesheet" href="../styles/contracts.css">
</head>
<body>
<div class="phone-container">
    <div class="help-button" id="help-button-contracts">?</div>
    <div class="phone-screen">
        <div class="help-modal" id="help-modal-contracts">
            <div class="help-modal-content">
                <div class="help-modal-header">
                    <h2>Помощь по договорам</h2>
                    <span class="help-modal-close" id="help-modal-close-contracts">&times;</span>
                </div>
                <div class="help-modal-body">
                    <p>В этом разделе вы можете заключать договоры с агентствами и на коллаборации:</p>

                    <ul>
                        <li><b>Агенства</b> предоставляют постоянные бонусы: прирост подписчиков, зарплату и скидку в магазине.</li>
                        <li><b>Коллабы</b> — это временные проекты, которые дают множитель к статистике на время проведения.</li>
                    </ul>

                    <p><b>Как принять договор:</b></p>
                    <ol>
                        <li>Выберите вкладку с агенством или коллабом.</li>
                        <li>Убедитесь, что выполнены все требования (зелёные полоски).</li>
                        <li>Нажмите кнопку "Попроситься" или "Предложить".</li>
                    </ol>

                    <p><b>Важно:</b> одновременно можно быть только в одном агенстве и одном коллабе. Чтобы принять новое предложение, нужно сначала отказаться от текущего.</p>

                    <p><b>Требования:</b></p>
                    <ul>
                        <li>👥 - количество подписчиков</li>
                        <li>🎮 - количество проведённых стримов</li>
                        <li>📈 - среднее количество зрителей</li>
                        <li>🎭 - наличие определённого типа модели</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="game-header">
            <h1>Договора</h1>
            <p class="game-subtitle">Доступные предложения</p>
        </div>

        <div class="contracts-categories">
            <button class="contracts-category active" data-category="agencies">Агенства</button>
            <button class="contracts-category" data-category="collabs">Коллабы</button>
        </div>

        <div class="contracts-container active" id="agencies-contracts">
            <div class="contracts-list" id="agencies-list">
                <div class="loading">Загрузка агентств...</div>
            </div>
        </div>

        <div class="contracts-container" id="collabs-contracts">
            <div class="contracts-list" id="collabs-list">
                <div class="loading">Загрузка коллабов...</div>
            </div>
        </div>

        <div class="back-button">
            <a href="../game" class="game-button">← Назад в игру</a>
        </div>
    </div>
</div>

<script src="../scripts/contracts.js"></script>
</body>
</html>