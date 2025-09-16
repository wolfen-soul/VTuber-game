<!DOCTYPE html>
<html lang="ru" data-theme="light">
<head>
    <meta charset="UTF-8">
    <title>Информация - Vtuber Simulator</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="../styles/theme.css">
    <link rel="stylesheet" href="../styles/game.css">
    <link rel="stylesheet" href="../styles/info.css">
    <link rel="icon" type="image/x-icon" href="../../vtuberwiki.ico">
</head>
<body>
<div class="tablet-container">
    <div class="tablet-screen">
        <div class="content-wrapper">
            <div class="main-content">
                <div class="game-header">
                    <h1>Информация</h1>
                    <p class="game-subtitle">Статистика пользователя <span id="channel-name">(channel name)</span></p>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Основная статистика</h3>
                        <div class="stat-row">
                            <span class="stat-label">Общие подписчики:</span>
                            <span class="stat-value" id="total-subscribers">0</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Всего стримов:</span>
                            <span class="stat-value" id="total-streams">0</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Средний онлайн:</span>
                            <span class="stat-value" id="average-online">0</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Всего донатов:</span>
                            <span class="stat-value" id="total-donations">0</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Баланс:</span>
                            <span class="stat-value" id="balance">0</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Дата регистрации:</span>
                            <span class="stat-value" id="registration-date">-</span>
                        </div>
                    </div>

                    <div class="stat-card">
                        <h3>Договоры</h3>
                        <div class="stat-row">
                            <span class="stat-label">Агенство:</span>
                            <span class="stat-value" id="agency">Нет</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Коллаборация:</span>
                            <span class="stat-value" id="collab">Нет</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Осталось стримов:</span>
                            <span class="stat-value" id="collab-streams-left">0</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Множитель коллаба:</span>
                            <span class="stat-value" id="collab-multiplier">1.0x</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Бонус подписчиков:</span>
                            <span class="stat-value" id="subscriber-bonus">0</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Доход от агентства:</span>
                            <span class="stat-value" id="agency-income">0</span>
                        </div>
                    </div>

                    <div class="stat-card">
                        <h3>Бонусы от оборудования</h3>
                        <div class="stat-row">
                            <span class="stat-label">Бонус зрителей:</span>
                            <span class="stat-value" id="viewers-bonus">0</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Бонус донатов:</span>
                            <span class="stat-value" id="donations-bonus">0</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Бонус подписчиков:</span>
                            <span class="stat-value" id="subscribers-bonus">0</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Общий бонус:</span>
                            <span class="stat-value" id="common-bonus">0</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Бонус частоты ивентов:</span>
                            <span class="stat-value" id="events-bonus">0</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Скидка на покупки:</span>
                            <span class="stat-value" id="discount">0%</span>
                        </div>
                    </div>
                </div>

                <h3 class="category-header">Оборудование</h3>
                <div id="equipment-container" class="item-grid">
                </div>
            </div>

            <div class="footer-content">
                <div class="back-button">
                    <a href="../game" class="game-button">← Назад</a>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="../scripts/info.js"></script>
</body>
</html>