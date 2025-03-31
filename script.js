// Глобальные переменные
const video = document.getElementById("video");
const videoContainer = document.getElementById("video-container");
const authContainer = document.getElementById("auth-container");
const app = document.getElementById("app");
const storiesPreview = document.getElementById("storiesPreview");
const storiesContainer = document.getElementById("storiesContainer");
const articlesCards = document.getElementById("articlesCards");
const navFooter = document.getElementById("navFooter");

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
let authStarted = false;
let videoTimeout;

const stories = [
    { type: 'image', url: './history/history1.png', preview: './history/history1_prew.png', duration: 5000, text: 'Welcome to our app!', viewed: false },
    { type: 'image', url: './history/history2.png', preview: './history/history2_prew.png', duration: 5000, text: 'Watch this cool video', viewed: false },
    { type: 'image', url: './history/history1.png', preview: './history/history1_prew.png', duration: 5000, text: 'Special offer just for you!', viewed: false },
    { type: 'image', url: './history/history2.png', preview: './history/history2_prew.png', duration: 5000, text: 'Story 4', viewed: false },
    { type: 'image', url: './history/history1.png', preview: './history/history1_prew.png', duration: 5000, text: 'Story 5', viewed: false },
    { type: 'image', url: './history/history2.png', preview: './history/history2_prew.png', duration: 5000, text: 'Story 6', viewed: false },
    { type: 'image', url: './history/history1.png', preview: './history/history1_prew.png', duration: 5000, text: 'Story 7', viewed: false },
    { type: 'image', url: './history/history2.png', preview: './history/history2_prew.png', duration: 5000, text: 'Story 8', viewed: false }
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

const examSubjects = {
    oge: {
        "Русский язык": { tasks: 9, difficulty: "Средняя" },
        "Математика": { tasks: 20, difficulty: "Средняя" },
        "Физика": { tasks: 25, difficulty: "Высокая" },
        "Химия": { tasks: 23, difficulty: "Высокая" },
        "Биология": { tasks: 30, difficulty: "Средняя" },
        "Обществознание": { tasks: 24, difficulty: "Средняя" },
        "История": { tasks: 21, difficulty: "Средняя" },
        "География": { tasks: 30, difficulty: "Средняя" },
        "Информатика": { tasks: 15, difficulty: "Средняя" },
        "Английский язык": { tasks: 30, difficulty: "Средняя" }
    },
    ege: {
        "Русский язык": { tasks: 27, difficulty: "Средняя" },
        "Математика (база)": { tasks: 21, difficulty: "Низкая" },
        "Математика (профиль)": { tasks: 18, difficulty: "Высокая" },
        "Физика": { tasks: 30, difficulty: "Высокая" },
        "Химия": { tasks: 34, difficulty: "Высокая" },
        "Биология": { tasks: 28, difficulty: "Средняя" },
        "Обществознание": { tasks: 25, difficulty: "Средняя" },
        "История": { tasks: 19, difficulty: "Средняя" },
        "География": { tasks: 31, difficulty: "Средняя" },
        "Информатика": { tasks: 27, difficulty: "Высокая" },
        "Английский язык": { tasks: 38, difficulty: "Средняя" }
    }
};

document.addEventListener("DOMContentLoaded", function() {
    localStorage.clear();
    console.log("LocalStorage cleared on page load");
    navFooter.style.display = 'none'; // Скрываем футер при загрузке страницы
    video.addEventListener('loadedmetadata', function() {
        console.log("Video metadata loaded");
        video.play().then(() => {
            console.log("Video started playing");
        }).catch(error => {
            console.error("Error playing video:", error);
            checkFirstLaunch();
        });
    });
    initializeExamSubjects(); // Инициализация предметов при загрузке
});

function checkFirstLaunch() {
    if (authStarted) return;
    console.log("Checking first launch...");
    const loggedIn = localStorage.getItem('loggedIn');
    videoContainer.style.display = 'none';
    if (loggedIn === 'true') {
        console.log("User logged in, starting app");
        startApp();
    } else {
        console.log("Showing login screen after video");
        authContainer.style.display = 'flex';
        navFooter.style.display = 'none'; // Скрываем футер при входе
        showScreen(loginScreen);
        authStarted = true;
        clearTimeout(videoTimeout);
    }
}

function startApp() {
    console.log("Starting app...");
    videoContainer.style.display = 'none';
    authContainer.style.display = 'none';
    app.style.display = 'flex';
    navFooter.style.display = 'flex'; // Показываем футер после входа
    initializeStoriesPreview();
    initializeArticles();
    initializeExamSubjects(); // Инициализация предметов при старте приложения
    authStarted = true;
    clearTimeout(videoTimeout);
}

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

    setupInputListeners();
});

window.switchPage = function(pageId) {
    const pages = document.querySelectorAll('.learning-module');
    const navButtons = document.querySelectorAll('.nav-btn');
    pages.forEach(page => page.style.display = 'none');
    navButtons.forEach(btn => btn.classList.remove('active'));
    document.getElementById(pageId).style.display = 'block';
    document.querySelector(`.nav-btn[onclick="switchPage('${pageId}')"]`).classList.add('active');
    if (pageId === 'practice-page') initializeExamSubjects(); // Повторная инициализация при переключении
};

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
    authStarted = true;
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

function validateUsername(input, errorElement) {
    const value = input.value.trim();
    if (!value) return true;
    if (spaceRegex.test(value)) { errorElement.textContent = 'Без пробелов'; return false; }
    if (cyrillicRegex.test(value)) { errorElement.textContent = 'Только латинские буквы'; return false; }
    if (specialCharRegexForUsername.test(value)) { errorElement.textContent = 'Без специальных символов'; return false; }
    if (!usernameRegex.test(value)) { errorElement.textContent = 'Только латинские буквы'; return false; }
    errorElement.textContent = '';
    return true;
}

function validatePassword(input, errorElement) {
    const value = input.value.trim();
    if (!value) return true;
    if (spaceRegex.test(value)) { errorElement.textContent = 'Без пробелов'; return false; }
    if (specialCharRegexForPassword.test(value)) { errorElement.textContent = 'Без специальных символов'; return false; }
    if (!passwordRegex.test(value)) { errorElement.textContent = 'Только буквы и цифры'; return false; }
    errorElement.textContent = '';
    return true;
}

function validateName(input, errorElement) {
    const value = input.value.trim();
    if (!value) return true;
    if (spaceRegex.test(value)) { errorElement.textContent = 'Без пробелов'; return false; }
    if (specialCharRegexForName.test(value)) { errorElement.textContent = 'Без специальных символов'; return false; }
    if (!nameRegex.test(value)) { errorElement.textContent = 'Только буквы'; return false; }
    errorElement.textContent = '';
    return true;
}

function validateEmail(input, errorElement) {
    const value = input.value.trim();
    if (!value) return true;
    if (!emailRegex.test(value)) { errorElement.textContent = 'Некорректный email'; return false; }
    errorElement.textContent = '';
    return true;
}

function validateCode(input, errorElement) {
    const value = input.value.trim();
    if (!value) { errorElement.textContent = 'Введите код'; return false; }
    errorElement.textContent = '';
    return true;
}

function setupInputListeners() {
    inputs.loginUsername.addEventListener('input', () => validateUsername(inputs.loginUsername, errors.loginUsername));
    inputs.loginPassword.addEventListener('input', () => validatePassword(inputs.loginPassword, errors.loginPassword));
    inputs.regName.addEventListener('input', () => validateName(inputs.regName, errors.regName));
    inputs.regUsername.addEventListener('input', () => validateUsername(inputs.regUsername, errors.regUsername));
    inputs.regEmail.addEventListener('input', () => validateEmail(inputs.regEmail, errors.regEmail));
    inputs.regPassword.addEventListener('input', () => validatePassword(inputs.regPassword, errors.regPassword));
    inputs.regCode.addEventListener('input', () => validateCode(inputs.regCode, errors.regCode));
}

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

window.handleLogin = function() {
    const username = inputs.loginUsername.value.trim();
    const password = inputs.loginPassword.value.trim();
    if (!username) errors.loginUsername.textContent = 'Это обязательное поле';
    if (!password) errors.loginPassword.textContent = 'Это обязательное поле';
    const usernameValid = validateUsername(inputs.loginUsername, errors.loginUsername);
    const passwordValid = validatePassword(inputs.loginPassword, errors.loginPassword);
    if (!username || !password || !usernameValid || !passwordValid) return;
    if (username === 'admin' && password === 'admin') {
        console.log("Admin login detected, starting app");
        localStorage.setItem('loggedIn', 'true');
        startApp();
        return;
    }
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
    const closeBtn = document.getElementById('closeStories');
    if (closeBtn) {
        closeBtn.style.bottom = '20px';
        closeBtn.style.right = '10px';
    }
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

// Логика для страницы пробных вариантов
// ... (весь код до initializeExamSubjects остаётся без изменений) ...

function initializeExamSubjects() {
    const examSubjectsDiv = document.getElementById('examSubjects');
    const practiceTitle = document.querySelector('.practice-title');
    if (practiceTitle) {
        practiceTitle.textContent = 'Задания'; // Переименовываем вкладку
    }
    examSubjectsDiv.innerHTML = '';
    filterExam('all');
}

function createSubjectCard(examType, subject, tasks, difficulty) {
    const card = document.createElement('div');
    card.classList.add('article-card');
    card.onclick = () => showTaskModal(examType, subject, tasks); // Убеждаемся, что onclick работает

    const title = document.createElement('div');
    title.classList.add('article-card-title');
    title.textContent = subject;

    const subtitle = document.createElement('div');
    subtitle.classList.add('article-card-subtitle');

    const tasksSpan = document.createElement('span');
    tasksSpan.textContent = `Заданий: ${tasks}`;

    const difficultySpan = document.createElement('span');
    difficultySpan.textContent = difficulty;
    difficultySpan.style.marginLeft = '10px';

    switch (difficulty) {
        case 'Высокая':
            difficultySpan.style.color = '#ff0000'; // Красный
            break;
        case 'Средняя':
            difficultySpan.style.color = '#ff8000'; // Оранжевый
            break;
        case 'Низкая':
            difficultySpan.style.color = '#00ff00'; // Зелёный
            break;
        default:
            difficultySpan.style.color = '#ccc';
    }

    subtitle.appendChild(tasksSpan);
    subtitle.appendChild(difficultySpan);

    card.appendChild(title);
    card.appendChild(subtitle);
    return card;
}

window.filterExam = function(examType) {
    const examSubjectsDiv = document.getElementById('examSubjects');
    examSubjectsDiv.innerHTML = '';
    const buttons = document.querySelectorAll('.exam-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    if (examType === 'oge') {
        document.querySelector('.exam-btn[data-exam="oge"]').classList.add('active');
        const ogeTitle = document.createElement('div');
        ogeTitle.classList.add('exam-section-title');
        ogeTitle.textContent = 'ОГЭ';
        examSubjectsDiv.appendChild(ogeTitle);
        for (const [subject, data] of Object.entries(examSubjects.oge)) {
            const card = createSubjectCard('oge', subject, data.tasks, data.difficulty);
            examSubjectsDiv.appendChild(card);
        }
    } else if (examType === 'ege') {
        document.querySelector('.exam-btn[data-exam="ege"]').classList.add('active');
        const egeTitle = document.createElement('div');
        egeTitle.classList.add('exam-section-title');
        egeTitle.textContent = 'ЕГЭ';
        examSubjectsDiv.appendChild(egeTitle);
        for (const [subject, data] of Object.entries(examSubjects.ege)) {
            const card = createSubjectCard('ege', subject, data.tasks, data.difficulty);
            examSubjectsDiv.appendChild(card);
        }
    } else {
        // По умолчанию показываем оба раздела
        const ogeTitle = document.createElement('div');
        ogeTitle.classList.add('exam-section-title');
        ogeTitle.textContent = 'ОГЭ';
        examSubjectsDiv.appendChild(ogeTitle);
        for (const [subject, data] of Object.entries(examSubjects.oge)) {
            const card = createSubjectCard('oge', subject, data.tasks, data.difficulty);
            examSubjectsDiv.appendChild(card);
        }

        const egeTitle = document.createElement('div');
        egeTitle.classList.add('exam-section-title');
        egeTitle.textContent = 'ЕГЭ';
        examSubjectsDiv.appendChild(egeTitle);
        for (const [subject, data] of Object.entries(examSubjects.ege)) {
            const card = createSubjectCard('ege', subject, data.tasks, data.difficulty);
            examSubjectsDiv.appendChild(card);
        }
    }
};

// ... (весь код до showTaskModal остаётся без изменений) ...

let tasksData = {}; // Глобальная переменная для хранения данных из JSON

// Загрузка JSON-файла при старте приложения
document.addEventListener("DOMContentLoaded", function() {
    fetch('tasks.json')
        .then(response => response.json())
        .then(data => {
            tasksData = data;
            console.log("Tasks data loaded:", tasksData);
        })
        .catch(error => console.error("Error loading tasks.json:", error));
    // ... (остальной код DOMContentLoaded остаётся без изменений) ...
});

function showTaskModal(examType, subject, taskCount) {
    const modal = document.getElementById('taskModal');
    const title = document.getElementById('taskModalTitle');
    const buttonsDiv = document.getElementById('taskModalButtons');
    const practicePage = document.getElementById('practice-page');

    title.textContent = `${subject} (${examType.toUpperCase()})`;
    buttonsDiv.innerHTML = '';

    // Контейнер для layout
    const layoutDiv = document.createElement('div');
    layoutDiv.classList.add('task-modal-layout');

    // Номера слева
    const numbersDiv = document.createElement('div');
    numbersDiv.classList.add('task-numbers');
    for (let i = 1; i <= taskCount; i++) {
        const btn = document.createElement('button');
        btn.classList.add('task-btn');
        btn.textContent = i;
        btn.onclick = () => showTaskInfo(examType, subject, i);
        numbersDiv.appendChild(btn);
    }
    layoutDiv.appendChild(numbersDiv);

    // Кнопка "Сгенерировать вариант" посередине
    const generateBtnContainer = document.createElement('div');
    generateBtnContainer.classList.add('generate-btn-container');
    const generateBtn = document.createElement('button');
    generateBtn.classList.add('generate-variant-btn');
    generateBtn.textContent = 'Сгенерировать вариант';
    generateBtn.onclick = () => showVariantTheory(examType, subject, taskCount);
    generateBtnContainer.appendChild(generateBtn);
    layoutDiv.appendChild(generateBtnContainer);

    buttonsDiv.appendChild(layoutDiv);

    practicePage.style.filter = 'blur(5px)';
    modal.style.display = 'flex';
    modal.style.opacity = '0';
    setTimeout(() => { modal.style.opacity = '1'; }, 5);

    modal.onclick = function(event) {
        if (event.target === modal) {
            closeTaskModal();
        }
    };
}

window.closeTaskModal = function() {
    const modal = document.getElementById('taskModal');
    const practicePage = document.getElementById('practice-page');
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        practicePage.style.filter = 'none';
        modal.onclick = null;
    }, 150);
};

function showTaskInfo(examType, subject, taskNumber) {
    const taskInfoScreen = document.createElement('div');
    taskInfoScreen.classList.add('task-info-screen');
    taskInfoScreen.innerHTML = `
        <button class="back-task-info-btn">Назад</button>
        <div class="task-info-content">
            <h2 class="task-info-title">Задание ${taskNumber}</h2>
            <div class="task-info-meta">
                ${getAverageTime(examType, subject, taskNumber)}, 
                <span class="difficulty-text">${examSubjects[examType][subject].difficulty}</span>, 
                ${subject}, 
                ${examType.toUpperCase()}
            </div>
            <div class="task-info-theory">
                <h3>Теория</h3>
                <p>${getTheory(examType, subject, taskNumber)}</p>
            </div>
        </div>
        <button class="start-task-btn">Начать</button>
    `;

    document.body.appendChild(taskInfoScreen);

    const difficultyText = taskInfoScreen.querySelector('.difficulty-text');
    switch (examSubjects[examType][subject].difficulty) {
        case 'Высокая':
            difficultyText.style.color = '#ff0000';
            break;
        case 'Средняя':
            difficultyText.style.color = '#ff8000';
            break;
        case 'Низкая':
            difficultyText.style.color = '#00ff00';
            break;
    }

    taskInfoScreen.style.opacity = '0';
    setTimeout(() => { taskInfoScreen.style.opacity = '1'; }, 5);

    taskInfoScreen.querySelector('.back-task-info-btn').onclick = () => {
        taskInfoScreen.style.opacity = '0';
        setTimeout(() => { document.body.removeChild(taskInfoScreen); }, 150);
    };

    taskInfoScreen.querySelector('.start-task-btn').onclick = () => {
        const tasks = tasksData[examType]?.[subject]?.[taskNumber.toString()] || [];
        if (tasks.length > 0) {
            const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
            showTaskExecution(examType, subject, taskNumber, randomTask);
        } else {
            console.log(`Нет заданий для ${examType}, ${subject}, номер ${taskNumber}`);
        }
    };
}

function getAverageTime(examType, subject, taskNumber) {
    return '5 минут';
}

function getTheory(examType, subject, taskNumber) {
    return `Это пример теории для задания ${taskNumber} по предмету ${subject} (${examType.toUpperCase()}). Здесь должна быть информация, необходимая для выполнения задания.`;
}

function showTaskExecution(examType, subject, taskNumber, task) {
    const taskExecutionScreen = document.createElement('div');
    taskExecutionScreen.classList.add('task-execution-screen');
    taskExecutionScreen.innerHTML = `
        <button class="back-task-execution-btn">Назад</button>
        <div class="task-execution-content">
            <h2 class="task-execution-title">Задание ${taskNumber}</h2>
            <p class="task-execution-text">${task.text}</p>
            <input type="text" class="task-answer-input" placeholder="Введите ответ">
            <button class="check-answer-btn">Проверить</button>
        </div>
    `;

    document.body.appendChild(taskExecutionScreen);

    taskExecutionScreen.style.opacity = '0';
    setTimeout(() => { taskExecutionScreen.style.opacity = '1'; }, 5);

    taskExecutionScreen.querySelector('.back-task-execution-btn').onclick = () => {
        taskExecutionScreen.style.opacity = '0';
        setTimeout(() => { document.body.removeChild(taskExecutionScreen); }, 150);
    };

    taskExecutionScreen.querySelector('.check-answer-btn').onclick = () => {
        const userAnswer = taskExecutionScreen.querySelector('.task-answer-input').value.trim().toLowerCase();
        const correctAnswer = task.answer.toLowerCase();
        showResultModal(userAnswer === correctAnswer, task.answer, examType, subject, taskNumber);
    };
}

function showResultModal(isCorrect, correctAnswer, examType, subject, taskNumber) {
    const resultModal = document.createElement('div');
    resultModal.classList.add('result-modal');
    resultModal.innerHTML = `
        <div class="result-modal-content">
            <h3 class="result-modal-title">${isCorrect ? 'Правильно!' : 'Неправильно'}</h3>
            ${!isCorrect ? `<p class="result-modal-correct">Правильный ответ: ${correctAnswer}</p>` : ''}
            <div class="result-modal-buttons">
                <button class="result-modal-btn back-to-tasks">К заданиям</button>
                <button class="result-modal-btn repeat-task">Повторить</button>
            </div>
        </div>
    `;

    document.body.appendChild(resultModal);
    const taskExecutionScreen = document.querySelector('.task-execution-screen');
    if (taskExecutionScreen) taskExecutionScreen.style.filter = 'blur(5px)';

    resultModal.style.opacity = '0';
    setTimeout(() => { resultModal.style.opacity = '1'; }, 5);

    resultModal.querySelector('.back-to-tasks').onclick = () => {
        resultModal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(resultModal);
            if (taskExecutionScreen) {
                taskExecutionScreen.style.filter = 'none';
                document.body.removeChild(taskExecutionScreen);
            }
            showTaskModal(examType, subject, examSubjects[examType][subject].tasks);
        }, 150);
    };

    resultModal.querySelector('.repeat-task').onclick = () => {
        resultModal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(resultModal);
            if (taskExecutionScreen) taskExecutionScreen.style.filter = 'none';
            const tasks = tasksData[examType][subject][taskNumber.toString()];
            const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
            showTaskExecution(examType, subject, taskNumber, randomTask);
        }, 150);
    };
}

let currentVariant = [];
let userAnswers = {};

function generateExamVariant(examType, subject, taskCount) {
    currentVariant = [];
    userAnswers = {};

    for (let i = 1; i <= taskCount; i++) {
        const tasks = tasksData[examType]?.[subject]?.[i.toString()] || [];
        if (tasks.length > 0) {
            const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
            currentVariant.push({ number: i, task: randomTask });
            userAnswers[i] = '';
        }
    }

    if (currentVariant.length > 0) {
        showVariantExecution(examType, subject, 1);
    } else {
        console.log(`Нет заданий для ${examType}, ${subject}`);
    }
}

function showVariantExecution(examType, subject, taskNumber) {
    const task = currentVariant.find(t => t.number === taskNumber)?.task;
    if (!task) return;

    const variantScreen = document.createElement('div');
    variantScreen.classList.add('task-execution-screen');
    variantScreen.innerHTML = `
        <button class="back-task-execution-btn">Назад</button>
        <div class="task-execution-content">
            <h2 class="task-execution-title">Задание ${taskNumber} из ${currentVariant.length}</h2>
            <div class="task-layout">
                <div class="task-navigation">
                    ${currentVariant.map(t => `
                        <button class="task-nav-btn ${t.number === taskNumber ? 'active' : ''}" data-number="${t.number}">
                            ${t.number}
                        </button>
                    `).join('')}
                </div>
                <div class="task-content">
                    <p class="task-execution-text">${task.text}</p>
                    <input type="text" class="task-answer-input" placeholder="Введите ответ" value="${userAnswers[taskNumber] || ''}">
                    <button class="save-answer-btn">Сохранить ответ</button>
                    ${taskNumber === currentVariant.length ? '<button class="finish-exam-btn">Завершить экзамен</button>' : ''}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(variantScreen);

    variantScreen.style.opacity = '0';
    setTimeout(() => { variantScreen.style.opacity = '1'; }, 5);

    variantScreen.querySelector('.back-task-execution-btn').onclick = () => {
        variantScreen.style.opacity = '0';
        setTimeout(() => { document.body.removeChild(variantScreen); }, 150);
    };

    variantScreen.querySelectorAll('.task-nav-btn').forEach(btn => {
        btn.onclick = () => {
            saveAnswer(taskNumber, variantScreen);
            const newNumber = parseInt(btn.getAttribute('data-number'));
            variantScreen.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(variantScreen);
                showVariantExecution(examType, subject, newNumber);
            }, 150);
        };
    });

    variantScreen.querySelector('.save-answer-btn').onclick = () => {
        saveAnswer(taskNumber, variantScreen);
        alert('Ответ сохранён!');
    };

    if (taskNumber === currentVariant.length) {
        variantScreen.querySelector('.finish-exam-btn').onclick = () => {
            saveAnswer(taskNumber, variantScreen);
            checkExamResults(examType, subject);
        };
    }
}

function saveAnswer(taskNumber, screen) {
    const input = screen.querySelector('.task-answer-input');
    userAnswers[taskNumber] = input.value.trim();
}

function checkExamResults(examType, subject) {
    const resultModal = document.createElement('div');
    resultModal.classList.add('result-modal');
    let correctCount = 0;
    let resultsHTML = '';

    currentVariant.forEach(({ number, task }) => {
        const userAnswer = userAnswers[number].toLowerCase();
        const correctAnswer = task.answer.toLowerCase();
        const isCorrect = userAnswer === correctAnswer;
        if (isCorrect) correctCount++;
        resultsHTML += `
            <div class="result-item">
                <p>Задание ${number}: ${isCorrect ? 'Правильно' : 'Неправильно'}</p>
                ${!isCorrect ? `<p>Ваш ответ: ${userAnswers[number] || 'Нет ответа'}</p><p>Правильный ответ: ${correctAnswer}</p>` : ''}
            </div>
        `;
    });

    resultModal.innerHTML = `
        <div class="result-modal-content">
            <h3 class="result-modal-title">Результат: ${correctCount} из ${currentVariant.length}</h3>
            <div class="result-details">${resultsHTML}</div>
            <div class="result-modal-buttons">
                <button class="result-modal-btn back-to-tasks">К заданиям</button>
                <button class="result-modal-btn repeat-exam">Повторить</button>
            </div>
        </div>
    `;

    document.body.appendChild(resultModal);
    const variantScreen = document.querySelector('.task-execution-screen');
    if (variantScreen) variantScreen.style.filter = 'blur(5px)';

    resultModal.style.opacity = '0';
    setTimeout(() => { resultModal.style.opacity = '1'; }, 5);

    resultModal.querySelector('.back-to-tasks').onclick = () => {
        resultModal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(resultModal);
            if (variantScreen) {
                variantScreen.style.filter = 'none';
                document.body.removeChild(variantScreen);
            }
            showTaskModal(examType, subject, examSubjects[examType][subject].tasks);
        }, 150);
    };

    resultModal.querySelector('.repeat-exam').onclick = () => {
        resultModal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(resultModal);
            if (variantScreen) variantScreen.style.filter = 'none';
            generateExamVariant(examType, subject, examSubjects[examType][subject].tasks);
        }, 150);
    };
}

function showVariantTheory(examType, subject, taskCount) {
    const theoryScreen = document.createElement('div');
    theoryScreen.classList.add('task-info-screen');
    theoryScreen.innerHTML = `
        <button class="back-task-info-btn">Назад</button>
        <div class="task-info-content">
            <h2 class="task-info-title">${subject} (${examType.toUpperCase()})</h2>
            <div class="task-info-theory">
                <h3>Теория</h3>
                <p>Здесь представлена общая теория для подготовки к экзамену по ${subject} (${examType.toUpperCase()}). 
                Изучите основные концепции и правила, чтобы успешно выполнить задания.</p>
            </div>
            <button class="start-variant-btn">Начать экзамен</button>
        </div>
    `;

    document.body.appendChild(theoryScreen);

    theoryScreen.style.opacity = '0';
    setTimeout(() => { theoryScreen.style.opacity = '1'; }, 5);

    theoryScreen.querySelector('.back-task-info-btn').onclick = () => {
        theoryScreen.style.opacity = '0';
        setTimeout(() => { document.body.removeChild(theoryScreen); }, 150);
    };

    theoryScreen.querySelector('.start-variant-btn').onclick = () => {
        theoryScreen.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(theoryScreen);
            generateExamVariant(examType, subject, taskCount);
        }, 150);
    };
}
