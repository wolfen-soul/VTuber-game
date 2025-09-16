    document.addEventListener('DOMContentLoaded', function() {
    const channelNameInput = document.getElementById('channelName');
    const nameError = document.getElementById('nameError');
    const createBtn = document.getElementById('createBtn');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    const token = localStorage.getItem('jwtToken');
    if (!token) {
    window.location.href = 'login';
    return;
}

    checkExistingGameState();

    channelNameInput.addEventListener('input', function() {
    validateChannelName();
});

    channelNameInput.addEventListener('blur', function() {
    validateChannelName();
});

    function validateChannelName() {
    const name = channelNameInput.value.trim();
    const isValid = name.length >= 3 && name.length <= 20;

    if (name.length > 0 && !isValid) {
    channelNameInput.classList.add('error');
    nameError.style.display = 'block';
    createBtn.disabled = true;
} else {
    channelNameInput.classList.remove('error');
    nameError.style.display = 'none';
    createBtn.disabled = !isValid;
}

    return isValid;
}

    createBtn.addEventListener('click', async function() {
    if (validateChannelName()) {
    const channelName = channelNameInput.value.trim();
    await createChannel(channelName);
}
});

    async function checkExistingGameState() {
    try {
    const response = await fetch('/api/game/load', {
    method: 'GET',
    headers: {
    'Authorization': `Bearer ${token}`
}
});

    if (response.ok) {
    window.location.href = 'game';
}
} catch (error) {
    console.log('GameState не найден, можно создавать новый');
}
}

    async function createChannel(nickname) {
    try {
    createBtn.disabled = true;
    createBtn.textContent = 'Создание...';

    const response = await fetch(`/api/game/init?nickname=${encodeURIComponent(nickname)}`, {
    method: 'POST',
    headers: {
    'Authorization': `Bearer ${token}`
}
});

    if (response.ok) {
    showSuccess('Канал успешно создан!');
    setTimeout(() => {
    window.location.href = 'game';
}, 2000);
} else {
    const errorText = await response.text();
    showError(errorText || 'Ошибка при создании канала');
}
} catch (error) {
    console.error('Ошибка:', error);
    showError('Сетевая ошибка при создании канала');
} finally {
    createBtn.disabled = false;
    createBtn.textContent = 'Создать канал';
}
}

    function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';

    setTimeout(() => {
    errorMessage.style.display = 'none';
}, 5000);
}

    function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
}

    channelNameInput.addEventListener('keypress', function(e) {
    const char = String.fromCharCode(e.keyCode || e.which);
    if (!/^[a-zA-Zа-яА-Я0-9\s]$/.test(char)) {
    e.preventDefault();
}
});

    channelNameInput.focus();
});

