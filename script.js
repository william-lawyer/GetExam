// Глобальные переменные
const video = document.getElementById("video");
const videoContainer = document.getElementById("video-container");
const authContainer = document.getElementById("auth-container");
const app = document.getElementById("app");
const storiesPreview = document.getElementById("storiesPreview");
const storiesContainer = document.getElementById("storiesContainer");
const articlesCards = document.getElementById("articlesCards");

const loginScreen = document.getElementById('auth-login-screen');
const registerScreen = document.getElementById('auth-register-screen');
const codeScreen = document.getElementById('auth-code-screen');

const inputs = {
    loginUsername: document.getElementById('login-username'),
    loginPassword: document.getElementById('login-password'),
    regName: document.getElementById('reg-name'),
    regUsername: document.getElementById('reg-username'),
    regEmail: document.getElementById('reg-email'),
    regPassword: document.getElementById('reg-password'),
    regCode: document.getElementById('reg-code')
};

const errors = {
    loginUsername: document.getElementById('login-username-error'),
    loginPassword: document.getElementById('login-password-error'),
    regName: document.getElementById('reg-name-error'),
    regUsername: document.getElementById('reg-username-error'),
    regEmail: document.getElementById('reg-email-error'),
    regPassword: document.getElementById('reg-password-error'),
    regCode: document.getElementById('reg-code-error')
};

const usernameRegex = /^[a-zA-Z]+$/;
const passwordRegex = /^[a-zA-Z0-9]+$/;
const nameRegex = /^[а-яА-Яa-zA-Z]+$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const spaceRegex = /\s/;
const specialCharRegexForUsername = /[^a-zA-Z]/;
const specialCharRegexForPassword = /[^a-zA-Z0-9]/;
const specialCharRegexForName = /[^а-яА-Яa-zA-Z]/;
const cyrillicRegex = /[а-яА-Я]/;

let regData = {};
let currentStoryIndex = 0;
let timeout;
let isPaused = false;
let authStarted = false; // Флаг для предотвращения повторного вызова checkFirstLaunch
let videoTimeout; // Переменная для хранения таймера

const stories = [
    { type: 'image', url: 'story1.jpg', preview: 'story1.jpg', duration: 5000, text: 'Welcome to our app!', viewed: false },
    { type: 'image', url: 'story1.jpg', preview: 'story1.jpg', duration: 10000, text: 'Watch this cool video', viewed: false },
    { type: 'image', url: 'story1.jpg', preview: 'story1.jpg', duration: 7000, text: 'Special offer just for you!', viewed: false },
    { type: 'image', url: 'story1.jpg', preview: 'story1.jpg', duration: 5000, text: 'Story 4', viewed: false },
    { type: 'image', url: 'story1.jpg', preview: 'story1.jpg', duration: 5000, text: 'Story 5', viewed: false },
    { type: 'image', url: 'story1.jpg', preview: 'story1.jpg', duration: 5000, text: 'Story 6', viewed: false },
    { type: 'image', url: 'story1.jpg', preview: 'story1.jpg', duration: 5000, text: 'Story 7', viewed: false },
    { type: 'image', url: 'story1.jpg', preview: 'story1.jpg', duration: 5000, text: 'Story 8', viewed: false }
];

const articlesData = {
    "11": [
        { title: "ОБЩЕСТВОЗНАНИЕ", subtitle: "Подборка затрагивает основные темы для ЕГЭ удобна для самоподготовки к экзаменам и контрольным" },
        { title: "МАТЕМАТИКА", subtitle: "Подборка затрагивает основные темы для ЕГЭ удобна для самоподготовки к экзаменам и контрольным" },
        { title: "ФИЗИКА", subtitle: "Подборка затрагивает основные темы для ЕГЭ удобна для самоподготовки к экзаменам и контрольным" }
    ],
    "10": [
        { title: "ХИМИЯ", subtitle: "Подборка затрагивает основные темы для ЕГЭ удобна для самоподготовки к экзаменам и контрольным" },
        { title: "БИОЛОГИЯ", subtitle: "Подборка затрагивает основные темы для ЕГЭ удобна для самоподготовки к экзаменам и контрольным" },
        { title: "ЛИТЕРАТУРА", subtitle: "Подборка затрагивает основные темы для ЕГЭ удобна для самоподготовки к экзаменам и контрольным" }
    ],
    "9": [
        { title: "ГЕОГРАФИЯ", subtitle: "Подборка затрагивает основные темы для ЕГЭ удобна для самоподготовки к экзаменам и контрольным" },
        { title: "РУССКИЙ ЯЗЫК", subtitle: "Подборка затрагивает основные темы для ЕГЭ удобна для самоподготовки к экзаменам и контрольным" },
        { title: "ИНФОРМАТИКА", subtitle: "Подборка затрагивает основные темы для ЕГЭ удобна для самоподготовки к экзаменам и контрольным" }
    ],
    "exam": [
        { title: "ЕГЭ ПО МАТЕМАТИКЕ", subtitle: "Подборка затрагивает основные темы для ЕГЭ удобна для самоподготовки к экзаменам и контрольным" },
        { title: "ОГЭ ПО РУССКОМУ", subtitle: "Подборка затрагивает основные темы для ЕГЭ удобна для самоподготовки к экзаменам и контрольным" },
        { title: "ЕГЭ ПО ФИЗИКЕ", subtitle: "Подборка затрагивает основные темы для ЕГЭ удобна для самоподготовки к экзаменам и контрольным" }
    ]
};

// Проверка первого запуска и управление видимостью
function checkFirstLaunch() {
    if (authStarted) return; // Если авторизация уже началась, не выполняем

    console.log("Checking first launch...");
    const loggedIn = localStorage.getItem('loggedIn');
    
    videoContainer.style.display = 'none'; // Скрываем видео
    
    if (loggedIn === 'true') {
        console.log("User logged in, starting app");
        startApp();
    } else {
        console.log("Showing login screen after video");
        authContainer.style.display = 'flex';
        showScreen(loginScreen);
        authStarted = true; // Устанавливаем флаг, что авторизация началась
        clearTimeout(videoTimeout); // Очищаем таймер
    }
}

// Запуск основного приложения
function startApp() {
    console.log("Starting app...");
    videoContainer.style.display = 'none';
    authContainer.style.display = 'none';
    app.style.display = 'flex';
    initializeStoriesPreview();
    initializeArticles();
    authStarted = true; // Устанавливаем флаг, чтобы предотвратить checkFirstLaunch
    clearTimeout(videoTimeout); // Очищаем таймер
}

// Видео события
document.addEventListener("DOMContentLoaded", function() {
    video.addEventListener('loadedmetadata', function() {
        console.log("Video metadata loaded");
        video.play().then(() => {
            console.log("Video started playing");
        }).catch(error => {
            console.error("Error playing video:", error);
            checkFirstLaunch();
        });
    });

    video.addEventListener('ended', function() {
        console.log("Video ended");
        checkFirstLaunch();
    });

    document.body.addEventListener('click', function attemptPlay() {
        video.play().then(() => {
            console.log("Video started playing after click");
            document.body.removeEventListener('click', attemptPlay);
        }).catch(error => {
            console.error("Error playing video on click:", error);
            checkFirstLaunch();
        });
    }, { once: true });

    videoTimeout = setTimeout(() => {
        if (video.readyState < 4) {
            console.warn("Video not loaded in time, skipping to auth or app");
            checkFirstLaunch();
        }
    }, 5000);

    setupInputListeners(); // Установка слушателей после загрузки DOM
});

// Управление экранами авторизации
function showScreen(screen) {
    console.log("Showing screen:", screen ? screen.id : 'null');
    if (!screen) {
        console.error("Screen element is null");
        return;
    }
    loginScreen.classList.remove('active');
    registerScreen.classList.remove('active');
    codeScreen.classList.remove('active');
    screen.classList.add('active');
    authStarted = true; // Устанавливаем флаг при любом переключении экрана
}

window.showRegister = function() {
    console.log("Switching to register screen");
    showScreen(registerScreen);
};

window.goBack = function(previous) {
    console.log("Going back to:", previous);
    if (previous === 'login') {
        showScreen(loginScreen);
    } else if (previous === 'register') {
        showScreen(registerScreen);
    }
};

// Валидация полей
function validateUsername(input, errorElement) {
    const value = input.value.trim();
    if (!value) return true;

    if (spaceRegex.test(value)) {
        errorElement.textContent = 'Без пробелов';
        return false;
    }
    if (cyrillicRegex.test(value)) {
        errorElement.textContent = 'Только латинские буквы';
        return false;
    }
    if (specialCharRegexForUsername.test(value)) {
        errorElement.textContent = 'Без специальных символов';
        return false;
    }
    if (!usernameRegex.test(value)) {
        errorElement.textContent = 'Только латинские буквы';
        return false;
    }

    errorElement.textContent = '';
    return true;
}

function validatePassword(input, errorElement) {
    const value = input.value.trim();
    if (!value) return true;

    if (spaceRegex.test(value)) {
        errorElement.textContent = 'Без пробелов';
        return false;
    }
    if (specialCharRegexForPassword.test(value)) {
        errorElement.textContent = 'Без специальных символов';
        return false;
    }
    if (!passwordRegex.test(value)) {
        errorElement.textContent = 'Только буквы и цифры';
        return false;
    }

    errorElement.textContent = '';
    return true;
}

function validateName(input, errorElement) {
    const value = input.value.trim();
    if (!value) return true;

    if (spaceRegex.test(value)) {
        errorElement.textContent = 'Без пробелов';
        return false;
    }
    if (specialCharRegexForName.test(value)) {
        errorElement.textContent = 'Без специальных символов';
        return false;
    }
    if (!nameRegex.test(value)) {
        errorElement.textContent = 'Только буквы';
        return false;
    }

    errorElement.textContent = '';
    return true;
}

function validateEmail(input, errorElement) {
    const value = input.value.trim();
    if (!value) return true;

    if (!emailRegex.test(value)) {
        errorElement.textContent = 'Некорректный email';
        return false;
    }

    errorElement.textContent = '';
    return true;
}

function validateCode(input, errorElement) {
    const value = input.value.trim();
    if (!value) {
        errorElement.textContent = 'Введите код';
        return false;
    }
    errorElement.textContent = '';
    return true;
}

// Установка слушателей ввода
function setupInputListeners() {
    inputs.loginUsername.addEventListener('input', () => validateUsername(inputs.loginUsername, errors.loginUsername));
    inputs.loginPassword.addEventListener('input', () => validatePassword(inputs.loginPassword, errors.loginPassword));
    inputs.regName.addEventListener('input', () => validateName(inputs.regName, errors.regName));
    inputs.regUsername.addEventListener('input', () => validateUsername(inputs.regUsername, errors.regUsername));
    inputs.regEmail.addEventListener('input', () => validateEmail(inputs.regEmail, errors.regEmail));
    inputs.regPassword.addEventListener('input', () => validatePassword(inputs.regPassword, errors.regPassword));
    inputs.regCode.addEventListener('input', () => validateCode(inputs.regCode, errors.regCode));
}

// Отправка кода подтверждения
async function sendVerificationCode(email) {
    try {
        const response = await fetch('https://getexamserver.onrender.com/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            showScreen(codeScreen);
            inputs.regCode.value = '';
            errors.regCode.textContent = '';
        } else {
            errors.regEmail.textContent = 'Ошибка при отправке кода';
            showScreen(registerScreen);
        }
    } catch (error) {
        errors.regEmail.textContent = 'Ошибка сети';
        showScreen(registerScreen);
        console.error(error);
    }
}

// Проверка кода подтверждения
window.verifyCode = async function() {
    const code = inputs.regCode.value.trim();
    const email = regData.email;

    if (!validateCode(inputs.regCode, errors.regCode)) return;

    try {
        const response = await fetch('https://getexamserver.onrender.com/verify-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code })
        });

        if (response.ok) {
            console.log("Code verified, user registered");
            localStorage.setItem('name', regData.name);
            localStorage.setItem('username', regData.username);
            localStorage.setItem('email', regData.email);
            localStorage.setItem('password', regData.password);
            localStorage.setItem('loggedIn', 'true');
            startApp();
        } else {
            console.error("Invalid verification code");
            errors.regCode.textContent = 'Неверный код';
        }
    } catch (error) {
        console.error("Network error verifying code:", error);
        errors.regCode.textContent = 'Ошибка сети';
    }
};

// Обработка входа
window.handleLogin = function() {
    const username = inputs.loginUsername.value.trim();
    const password = inputs.loginPassword.value.trim();

    if (!username) errors.loginUsername.textContent = 'Это обязательное поле';
    if (!password) errors.loginPassword.textContent = 'Это обязательное поле';

    const usernameValid = validateUsername(inputs.loginUsername, errors.loginUsername);
    const passwordValid = validatePassword(inputs.loginPassword, errors.loginPassword);

    if (!username || !password || !usernameValid || !passwordValid) return;

    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (username === storedUsername && password === storedPassword) {
        console.log("Login successful");
        localStorage.setItem('loggedIn', 'true');
        startApp();
    } else {
        console.error("Login failed: incorrect credentials");
        errors.loginPassword.textContent = 'Неверный логин или пароль';
    }
};

// Обработка регистрации
window.handleRegister = async function() {
    const name = inputs.regName.value.trim();
    const username = inputs.regUsername.value.trim();
    const email = inputs.regEmail.value.trim();
    const password = inputs.regPassword.value.trim();

    if (!name) errors.regName.textContent = 'Это обязательное поле';
    if (!username) errors.regUsername.textContent = 'Это обязательное поле';
    if (!email) errors.regEmail.textContent = 'Это обязательное поле';
    if (!password) errors.regPassword.textContent = 'Это обязательное поле';

    const nameValid = validateName(inputs.regName, errors.regName);
    const usernameValid = validateUsername(inputs.regUsername, errors.regUsername);
    const emailValid = validateEmail(inputs.regEmail, errors.regEmail);
    const passwordValid = validatePassword(inputs.regPassword, errors.regPassword);

    if (!name || !username || !email || !password || !nameValid || !usernameValid || !emailValid || !passwordValid) return;

    console.log("Registration data valid, sending verification code");
    regData = { name, username, email, password };
    await sendVerificationCode(email);
};

// Инициализация сторис
function initializeStoriesPreview() {
    if (!storiesPreview) {
        console.error("storiesPreview not found!");
        return;
    }
    storiesPreview.innerHTML = '';
    stories.forEach((story, index) => {
        const previewImg = document.createElement('img');
        previewImg.src = story.preview;
        previewImg.classList.add('story-preview');
        if (!story.viewed) {
            previewImg.classList.add('unviewed');
        }
        previewImg.addEventListener('click', () => {
            console.log("Clicked story index:", index);
            currentStoryIndex = index;
            openStories();
        });
        storiesPreview.appendChild(previewImg);
    });
}

function openStories() {
    console.log("Opening stories...");
    storiesContainer.style.display = 'flex';
    storiesContainer.style.opacity = '0';
    setTimeout(() => { storiesContainer.style.opacity = '1'; }, 10);
    createStories();
    showStory(currentStoryIndex);
}

function createStories() {
    storiesContainer.innerHTML = `
        <div class="progress-bar" id="progressBar"></div>
        <div class="controls">
            <button class="control-area" id="prevStory"></button>
            <button class="control-area" id="nextStory"></button>
        </div>
        <button class="close-btn" id="closeStories">×</button>
    `;
    const progressBar = document.getElementById("progressBar");

    stories.forEach((story) => {
        const element = story.type === 'image' 
            ? document.createElement('img') 
            : document.createElement('video');

        element.src = story.url;
        element.classList.add('story');
        if (story.type === 'video') {
            element.muted = true;
            element.loop = false;
        }
        storiesContainer.appendChild(element);

        const textElement = document.createElement('div');
        textElement.classList.add('story-content');
        textElement.textContent = story.text;
        element.after(textElement);

        const segment = document.createElement('div');
        segment.classList.add('progress-segment');
        const fill = document.createElement('div');
        fill.classList.add('progress-fill');
        segment.appendChild(fill);
        progressBar.appendChild(segment);
    });

    bindStoryControls();
}

function showStory(index) {
    const allStories = document.querySelectorAll('.story');
    const allFills = document.querySelectorAll('.progress-fill');
    const allTexts = document.querySelectorAll('.story-content');

    allStories.forEach(story => story.classList.remove('active'));
    allFills.forEach(fill => {
        fill.classList.remove('active');
        fill.style.width = '0';
        fill.style.transition = 'none';
    });
    allTexts.forEach(text => text.style.display = 'none');

    if (index >= 0 && index < stories.length) {
        const currentStory = allStories[index];
        const currentText = allTexts[index];
        const currentFill = allFills[index];
        currentStory.classList.add('active');
        currentText.style.display = 'block';
        currentFill.classList.add('active');

        if (currentStory.tagName === 'VIDEO') {
            currentStory.play();
        }

        const duration = stories[index].duration;
        currentFill.style.transition = 'none';
        currentFill.style.width = '0';
        requestAnimationFrame(() => {
            currentFill.style.transition = `width ${duration}ms linear`;
            if (!isPaused) {
                currentFill.style.width = '100%';
                clearTimeout(timeout);
                timeout = setTimeout(() => nextStory(), duration);
            }
        });

        stories[index].viewed = true;
        updatePreview();
    }
}

function updatePreview() {
    const previews = document.querySelectorAll('.story-preview');
    previews.forEach((preview, index) => {
        if (stories[index].viewed) {
            preview.classList.remove('unviewed');
        }
    });
}

function nextStory() {
    currentStoryIndex++;
    if (currentStoryIndex >= stories.length) {
        closeStories();
        return;
    }
    showStory(currentStoryIndex);
}

function prevStory() {
    currentStoryIndex--;
    if (currentStoryIndex < 0) {
        currentStoryIndex = 0;
    }
    showStory(currentStoryIndex);
}

function closeStories() {
    clearTimeout(timeout);
    storiesContainer.style.display = 'none';
}

function bindStoryControls() {
    const nextBtn = document.getElementById('nextStory');
    const prevBtn = document.getElementById('prevStory');
    const closeBtn = document.getElementById('closeStories');
    const container = document.querySelector('.stories-container');

    nextBtn.addEventListener('click', () => {
        clearTimeout(timeout);
        nextStory();
    });

    prevBtn.addEventListener('click', () => {
        clearTimeout(timeout);
        prevStory();
    });

    closeBtn.addEventListener('click', () => {
        closeStories();
    });

    container.addEventListener('mousedown', pauseStory);
    container.addEventListener('touchstart', pauseStory);
    container.addEventListener('mouseup', resumeStory);
    container.addEventListener('touchend', resumeStory);

    container.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
            clearTimeout(timeout);
            nextStory();
        }
    });
}

function pauseStory(e) {
    if (e.target.tagName !== 'BUTTON') {
        isPaused = true;
        clearTimeout(timeout);
        const currentFill = document.querySelector('.progress-fill.active');
        if (currentFill) {
            currentFill.style.transition = 'none';
            const currentWidth = window.getComputedStyle(currentFill).width;
            currentFill.style.width = currentWidth;
        }
    }
}

function resumeStory(e) {
    if (e.target.tagName !== 'BUTTON') {
        isPaused = false;
        const currentFill = document.querySelector('.progress-fill.active');
        if (currentFill) {
            const remainingTime = stories[currentStoryIndex].duration * 
                (1 - parseFloat(currentFill.style.width) / parseFloat(window.getComputedStyle(currentFill.parentElement).width));
            currentFill.style.transition = `width ${remainingTime}ms linear`;
            currentFill.style.width = '100%';
            timeout = setTimeout(() => nextStory(), remainingTime);
        }
    }
}

// Поиск
const mainSearch = document.getElementById('mainSearch');
const searchScreen = document.getElementById('searchScreen');
const cancelSearch = document.getElementById('cancelSearch');
const searchInput = document.getElementById('searchInput');

mainSearch.addEventListener('click', () => {
    searchScreen.classList.remove('close');
    searchScreen.classList.add('open');
    searchScreen.style.display = 'flex';
    searchInput.focus();
});

cancelSearch.addEventListener('click', () => {
    searchScreen.classList.remove('open');
    searchScreen.classList.add('close');
    searchInput.value = '';
    searchScreen.addEventListener('animationend', function handler() {
        if (searchScreen.classList.contains('close')) {
            searchScreen.style.display = 'none';
        }
        searchScreen.removeEventListener('animationend', handler);
    });
});

// Инициализация статей
function initializeArticles() {
    const classButtons = document.querySelectorAll('.class-btn');
    updateArticlesCards('11');

    classButtons.forEach(button => {
        button.addEventListener('click', () => {
            classButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const classId = button.getAttribute('data-class');
            updateArticlesCards(classId);
        });
    });
}

function updateArticlesCards(classId) {
    articlesCards.innerHTML = '';
    const articles = articlesData[classId] || [];

    articles.forEach(article => {
        const card = document.createElement('div');
        card.classList.add('article-card');

        const title = document.createElement('div');
        title.classList.add('article-card-title');
        title.textContent = article.title;

        const subtitle = document.createElement('div');
        subtitle.classList.add('article-card-subtitle');
        subtitle.textContent = article.subtitle;

        card.appendChild(title);
        card.appendChild(subtitle);
        articlesCards.appendChild(card);
    });
} 
