<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Создание канала - VTuber Simulator</title>
    <link rel="stylesheet" href="styles/chanel.css">
    <link rel="icon" type="image/x-icon" href="../vtuberwiki.ico">
    <script src="scripts/chanel.js"></script>
</head>
<body>
<div class="channel-container fade-in">
    <div class="logo">
        <h1>VTuber<span>Simulator</span></h1>
    </div>

    <div id="errorMessage" class="error-message" style="display: none;"></div>
    <div id="successMessage" class="success-message" style="display: none;"></div>

    <div class="form-group">
        <label for="channelName">Название канала</label>
        <input
                type="text"
                id="channelName"
                class="input-field"
                placeholder="Введите название канала"
                maxlength="20"
                required
        >
        <div class="error-message" id="nameError" style="display: none;">
            Название должно содержать от 3 до 20 символов
        </div>
    </div>

    <button class="create-btn" id="createBtn">
        Создать канал
    </button>

    <div class="rules">
        <h3>Правила выбора названия:</h3>
        <ul>
            <li>От 3 до 20 символов</li>
            <li>Можно использовать буквы, цифры и пробелы</li>
            <li>Название должно быть уникальным</li>
            <li>Избегайте оскорбительных выражений</li>
        </ul>
    </div>
</div>
</body>
</html>