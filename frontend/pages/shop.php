<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Магазин - Vtuber Simulator</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="icon" type="image/x-icon" href="../../vtuberwiki.ico">
    <link rel="stylesheet" href="../styles/shop.css">
    <link rel="stylesheet" href="../styles/theme.css">
</head>
<body>
<div class="phone-container">
    <div class="phone-screen">
        <div class="balance-container">
            <span class="balance-label">Баланс:</span>
            <span class="balance-value" id="balance-amount">0</span>
        </div>

        <div class="help-button" id="help-button">?</div>

        <div class="help-modal" id="help-modal">
            <div class="help-modal-content">
                <div class="help-modal-header">
                    <h2>Помощь по магазину</h2>
                    <span class="help-modal-close" id="help-modal-close">&times;</span>
                </div>
                <div class="help-modal-body">
                    <p>В магазине каждая категория усиливает разные аспекты твоего стрима:</p>

                    <ul>
                        <li>💻 <b>ПК → зрители</b><br>
                            Корпуса, процессоры, видеокарты, мат.платы, ОЗУ, хранилище, охлаждение.<br>
                            <i>Даёт прирост зрителей во время трансляции.</i></li>

                        <li>🎧 <b>Аппаратура → подписчики</b><br>
                            Клавиатуры, мыши, наушники, мониторы, коврики.<br>
                            <i>Ускоряют рост подписчиков.</i></li>

                        <li>🎭 <b>Модели → донаты</b><br>
                            PNG, 2D и 3D модели.<br>
                            <i>Увеличивают доход от донатов.</i></li>

                        <li>🎮 <b>Игры → общий бонус</b><br>
                            Активная игра добавляет бонус ко всем метрикам: зрители, подписчики, донаты.</li>

                        <li>🎲 <b>Разное → частота событий</b><br>
                            Повышает шанс того, что на трансляции произойдёт событие.</li>
                    </ul>

                    <p><b>Важно:</b> Множители предметов складываются. Чем больше апгрейдов — тем больше аудитории на твоих стримах. Также помните, что аппаратуру и ПК нужно обновлять постепенно.</p>
                </div>
            </div>
        </div>

        <div id="notification" class="notification hidden">
            <div class="notification-content">
                <span id="notification-message"></span>
                <button id="notification-close" class="notification-close">×</button>
            </div>
        </div>

        <div class="game-header">
            <h1>Магазин</h1>
            <p class="game-subtitle">Оборудование и аксессуары для стримеров</p>
        </div>

        <div class="shop-categories">
            <button class="shop-category active" data-category="pc">ПК</button>
            <button class="shop-category" data-category="hardware">Аппаратура</button>
            <button class="shop-category" data-category="models">Модели</button>
            <button class="shop-category" data-category="games">Игры</button>
            <button class="shop-category" data-category="vtuber-equipment">Разное</button>
        </div>

        <div class="subcategories-container active" id="pc-subcategories">
            <div class="shop-subcategories">
                <button class="shop-subcategory active" data-subcategory="pc-cases">Корпусы</button>
                <button class="shop-subcategory" data-subcategory="pc-cpus">Процессоры</button>
                <button class="shop-subcategory" data-subcategory="pc-gpus">Видеокарты</button>
                <button class="shop-subcategory" data-subcategory="pc-motherboards">Материнские платы</button>
                <button class="shop-subcategory" data-subcategory="pc-ram">Оперативная память</button>
                <button class="shop-subcategory" data-subcategory="pc-storage">Диски</button>
                <button class="shop-subcategory" data-subcategory="pc-cooling">Охлаждение</button>
            </div>

            <div class="shop-items">
            </div>
        </div>

        <div class="subcategories-container" id="models-items">
            <div class="shop-items">
            </div>
        </div>

        <div class="subcategories-container" id="hardware-subcategories">
            <div class="shop-subcategories">
                <button class="shop-subcategory active" data-subcategory="hardware-keyboards">Клавиатуры</button>
                <button class="shop-subcategory" data-subcategory="hardware-mice">Мыши</button>
                <button class="shop-subcategory" data-subcategory="hardware-headphones">Наушники</button>
                <button class="shop-subcategory" data-subcategory="hardware-monitors">Мониторы</button>
                <button class="shop-subcategory" data-subcategory="hardware-mats">Коврики</button>
            </div>

            <div class="shop-items">
            </div>
        </div>

        <div class="subcategories-container" id="vtuber-equipment-items">
            <div class="shop-items">
            </div>
        </div>

        <div class="subcategories-container" id="games-items">
            <div class="shop-items">
            </div>
        </div>

        <div class="back-button">
            <a href="../game" class="game-button">← Назад в игру</a>
        </div>
    </div>
</div>

<script src="../scripts/shop.js"></script>
</body>
</html>