// ============ VZ ARG // CASE 81 ============
// ============ SCRIPT ============

// Текущий язык
let currentLang = 'ru';

// Данные для входа
const accessLevels = [
    {
        id: 'main',
        login: 'VZ',
        password: '01082024',
        level: 'MAIN_ARCHIVE',
        response: {
            ru: 'ДОСТУП РАЗРЕШЁН. ДОБРО ПОЖАЛОВАТЬ В АРХИВ.',
            en: 'ACCESS GRANTED. WELCOME TO THE ARCHIVE.',
            fr: 'ACCÈS AUTORISÉ. BIENVENUE DANS LES ARCHIVES.'
        },
        redirect: 'main.html'
    },
    {
        id: 'sibirskaya',
        login: 'sibirskaya',
        password: '81',
        level: 'SIBIRSKAYA_81',
        response: {
            ru: 'ДОСТУП К МАТЕРИАЛАМ УЛИЦЫ СИБИРСКАЯ РАЗРЕШЁН.',
            en: 'ACCESS TO SIBIRSKAYA STREET FILES GRANTED.',
            fr: 'ACCÈS AUX DOSSIERS DE LA RUE SIBIRSKAÏA AUTORISÉ.'
        },
        redirect: 'main.html?access=sibirskaya'
    },
    {
        id: 'gvr',
        login: 'GVR',
        password: '1813',
        level: 'GVR_CONFIDENTIAL',
        response: {
            ru: 'ДОСТУП К ФАЙЛАМ GVR РАЗРЕШЁН.',
            en: 'ACCESS TO GVR FILES GRANTED.',
            fr: 'ACCÈS AUX DOSSIERS GVR AUTORISÉ.'
        },
        redirect: 'main.html?access=gvr'
    },
    {
        id: 'andrey',
        login: 'Andrey',
        password: '18062024',
        level: 'ANDREY_RESTRICTED',
        response: {
            ru: 'ОГРАНИЧЕННЫЙ ДОСТУП РАЗРЕШЁН. НЕ РАСПРОСТРАНЯЙТЕ ИНФОРМАЦИЮ.',
            en: 'RESTRICTED ACCESS GRANTED. DO NOT SHARE.',
            fr: 'ACCÈS RESTREINT AUTORISÉ. NE PARTAGEZ PAS.'
        },
        redirect: 'main.html?access=andrey'
    },
    {
        id: 'shaman',
        login: 'ShamanKapysta',
        password: '020760',
        level: 'SHAMAN_KAPYSTA',
        response: {
            ru: 'ШАМАН КАПУСТА ПРИВЕТСТВУЕТ ТЕБЯ. ТЫ НАШЁЛ ТО, ЧТО НЕ ДОЛЖЕН БЫЛ.',
            en: 'SHAMAN CABBAGE GREETS YOU. YOU FOUND WHAT YOU SHOULD NOT.',
            fr: 'LE CHAMAN CHOU TE SALUE. TU AS TROUVÉ CE QUE TU NE DEVAIS PAS.'
        },
        redirect: 'main.html?access=shaman'
    },
    {
        id: 'aidkostya',
        login: 'AidKostya',
        password: '012812',
        level: 'AID_KOSTYA_PRIVATE',
        response: {
            ru: 'ПРИВЕТ. МЫ ВСЕГДА ЗДЕСЬ. — А. и К.',
            en: 'HELLO. WE ARE ALWAYS HERE. — A. and K.',
            fr: 'BONJOUR. NOUS SOMMES TOUJOURS LÀ. — A. et K.'
        },
        redirect: 'main.html?access=aidkostya'
    },
    {
        id: 'admin',
        login: 'Admin',
        password: '12345',
        level: 'ADMIN_FAKE',
        response: {
            ru: 'ТЫ СЕРЬЁЗНО? ПАРОЛЬ "12345"? БЛЯТЬ.',
            en: 'REALLY? PASSWORD "12345"? FUCK YOU.',
            fr: 'SÉRIEUSEMENT ? MOT DE PASSE "12345" ? VA CHIER.'
        },
        redirect: null
    }
];

// Тупые пароли и реакции
const stupidPasswords = [
    {
        login: ['', 'admin', 'root', 'user'],
        password: ['123456', '12345678910', 'qwerty', 'password', '67', '1', '0', '111', '222', '333'],
        response: {
            ru: 'БЛЯТЬ ТЫ ИДИОТ. СЕРЬЁЗНО?',
            en: 'FUCK YOU IDIOT. SERIOUSLY?',
            fr: 'PUTAIN T\'ES CON. SÉRIEUSEMENT ?'
        }
    }
];

// ============ ЛОГИКА ВХОДА ============
document.addEventListener('DOMContentLoaded', function() {
    // Проверка, на какой странице мы находимся
    const bodyClass = document.body.className;
    
    if (bodyClass.includes('login-body')) {
        initLogin();
    } else if (bodyClass.includes('main-body')) {
        initMain();
    } else if (bodyClass.includes('terminal-body')) {
        initTerminal();
    }
    
    // Инициализация звука (без звука, просто плеер)
    if (document.getElementById('audioPlayer')) {
        const audio = document.getElementById('audioPlayer');
        audio.volume = 0;
        audio.loop = true;
        // Звук не запускаем без взаимодействия
    }
});

// ============ ИНИЦИАЛИЗАЦИЯ ЛОГИНА ============
function initLogin() {
    const loginInput = document.getElementById('loginInput');
    const passwordInput = document.getElementById('passwordInput');
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');
    const modal = document.getElementById('responseModal');
    const modalText = document.getElementById('modalText');
    const modalClose = document.getElementById('modalClose');
    
    // Переключатель языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentLang = this.dataset.lang;
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateLoginLanguage(currentLang);
        });
    });
    
    // Обработка входа
    function handleLogin() {
        const login = loginInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!login || !password) {
            showError(currentLang === 'ru' ? 'ВВЕДИТЕ ЛОГИН И ПАРОЛЬ' : 
                      currentLang === 'en' ? 'ENTER LOGIN AND PASSWORD' : 
                      'ENTREZ IDENTIFIANT ET MOT DE PASSE');
            return;
        }
        
        // Проверка на тупые пароли
        for (let sp of stupidPasswords) {
            if (sp.login.includes(login.toLowerCase()) && sp.password.includes(password)) {
                showModal(sp.response[currentLang] || sp.response.ru);
                glitchScreen();
                return;
            }
        }
        
        // Проверка на правильные пароли
        let found = false;
        for (let level of accessLevels) {
            if (level.login.toLowerCase() === login.toLowerCase() && 
                level.password === password) {
                found = true;
                
                // Сохраняем сессию
                sessionStorage.setItem('vz_access_level', level.level);
                sessionStorage.setItem('vz_access_id', level.id);
                sessionStorage.setItem('vz_login', login);
                
                showModal(level.response[currentLang] || level.response.ru);
                glitchScreen();
                
                if (level.redirect) {
                    setTimeout(() => {
                        window.location.href = level.redirect;
                    }, 2000);
                }
                break;
            }
        }
        
        if (!found) {
            showError(currentLang === 'ru' ? 'НЕВЕРНЫЙ ЛОГИН ИЛИ ПАРОЛЬ' : 
                      currentLang === 'en' ? 'INVALID LOGIN OR PASSWORD' : 
                      'IDENTIFIANT OU MOT DE PASSE INCORRECT');
            shakeScreen();
        }
    }
    
    loginBtn.addEventListener('click', handleLogin);
    
    // Enter
    passwordInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
    loginInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            passwordInput.focus();
        }
    });
    
    // Закрытие модалки
    modalClose.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    // Клик вне модалки
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    function showError(msg) {
        loginError.textContent = msg;
        loginError.style.display = 'block';
        setTimeout(() => {
            loginError.style.display = 'none';
        }, 3000);
    }
    
    function showModal(msg) {
        modalText.textContent = msg;
        modal.classList.add('active');
    }
    
    function glitchScreen() {
        document.body.style.animation = 'glitchScreen 0.5s';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    }
    
    function shakeScreen() {
        document.body.style.animation = 'shakeScreen 0.3s';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 300);
    }
    
    // Добавление keyframes динамически
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glitchScreen {
            0%, 100% { filter: none; }
            20% { filter: hue-rotate(90deg) blur(2px); }
            40% { filter: invert(100%); }
            60% { filter: hue-rotate(-90deg) blur(1px); }
            80% { filter: none; }
        }
        @keyframes shakeScreen {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-3px); }
        }
    `;
    document.head.appendChild(style);
}

// ============ ОБНОВЛЕНИЕ ЯЗЫКА ЛОГИНА ============
function updateLoginLanguage(lang) {
    document.querySelectorAll('[data-ru]').forEach(el => {
        const text = el.dataset[lang] || el.dataset.ru;
        el.textContent = text;
    });
}

// ============ ИНИЦИАЛИЗАЦИЯ ГЛАВНОЙ ============
function initMain() {
    // Получение данных сессии
    const accessLevel = sessionStorage.getItem('vz_access_level') || 'GUEST';
    const accessId = sessionStorage.getItem('vz_access_id') || 'none';
    const login = sessionStorage.getItem('vz_login') || 'UNKNOWN';
    
    // Обновление информации
    const userInfo = document.getElementById('userInfo');
    const accessLevelEl = document.getElementById('accessLevel');
    const sessionInfo = document.getElementById('sessionInfo');
    
    if (userInfo) userInfo.textContent = 'USER: ' + login;
    if (accessLevelEl) accessLevelEl.textContent = 'ACCESS LEVEL: ' + accessLevel;
    if (sessionInfo) sessionInfo.textContent = 'SESSION: ' + accessLevel;
    
    // Таймер с момента взрыва
    initTimer();
    
    // Выход
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.clear();
            window.location.href = 'index.html';
        });
    }
    
    // Навигация
    document.querySelectorAll('.nav-card').forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            loadContent(page, accessId);
        });
    });
    
    // Парсинг URL параметров
    const urlParams = new URLSearchParams(window.location.search);
    const urlAccess = urlParams.get('access');
    if (urlAccess) {
        // Можно показать специальный контент
    }
}

// ============ ТАЙМЕР ============
function initTimer() {
    const timerDisplay = document.getElementById('timerDisplay');
    if (!timerDisplay) return;
    
    const explosionDate = new Date('2024-08-01T12:00:00');
    
    function updateTimer() {
        const now = new Date();
        const diff = now - explosionDate;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        const ms = Math.floor(diff % 1000);
        
        timerDisplay.textContent = 
            String(days).padStart(2, '0') + ':' +
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0') + ':' +
            String(ms).padStart(3, '0');
    }
    
    updateTimer();
    setInterval(updateTimer, 1);
}

// ============ ЗАГРУЗКА КОНТЕНТА ============
function loadContent(page, accessId) {
    const contentArea = document.getElementById('contentArea');
    if (!contentArea) return;
    
    let content = '';
    
    switch(page) {
        case 'dossiers':
            content = `
                <h2 class="content-title">ДОСЬЕ</h2>
                <div class="file-card">
                    <div class="file-header">ФАЙЛ: AIDOS_DMITRIY.doc</div>
                    <div class="file-body">
                        <p><strong>ИМЯ:</strong> Дмитрий (Аид)</p>
                        <p><strong>ДАТА РОЖДЕНИЯ:</strong> 25.05.1999</p>
                        <p><strong>СТАТУС:</strong> ПОГИБ ПРИ ВЗРЫВЕ 01.08.2024</p>
                        <p><strong>РОЛЬ:</strong> СОЗДАТЕЛЬ VZ</p>
                        <p><strong>ПОСЛЕДНЕЕ СООБЩЕНИЕ:</strong> "Костя, блять, я же говорил не трогать газ"</p>
                    </div>
                </div>
                <div class="file-card">
                    <div class="file-header">ФАЙЛ: KOSTYA_KONSTANTIN.doc</div>
                    <div class="file-body">
                        <p><strong>ИМЯ:</strong> Константин (Костя)</p>
                        <p><strong>ДАТА РОЖДЕНИЯ:</strong> 04.12.2002</p>
                        <p><strong>СТАТУС:</strong> ПОГИБ ПРИ ВЗРЫВЕ 01.08.2024</p>
                        <p><strong>РОЛЬ:</strong> СОУЧРЕДИТЕЛЬ VZ</p>
                        <p><strong>ПОСЛЕДНЕЕ СООБЩЕНИЕ:</strong> "Аид, блять, это ты газ не выключил"</p>
                    </div>
                </div>
                ${accessId === 'gvr' || accessId === 'shaman' || accessId === 'aidkostya' ? `
                <div class="file-card restricted">
                    <div class="file-header">ФАЙЛ: VITALY_SCHNEIDER.doc [СЕКРЕТНО]</div>
                    <div class="file-body">
                        <p><strong>ИМЯ:</strong> Виталий Андреевич Шнайдер</p>
                        <p><strong>ДАТА РОЖДЕНИЯ:</strong> 18.03</p>
                        <p><strong>СТАТУС:</strong> ВЫЖИЛ. ПТСР.</p>
                        <p><strong>РОЛЬ:</strong> ОСНОВАТЕЛЬ GVR</p>
                        <p><strong>ПСИХБОЛЬНИЦА:</strong> ГАУЗ СО "ПБ №7"</p>
                        <p><strong>ПРЕПАРАТЫ:</strong> ГИДРОКСИЗИН, КВЕТИАПИН, ЛАМОТРИДЖИН</p>
                    </div>
                </div>
                ` : ''}
            `;
            break;
        
        case 'chronology':
            content = `
                <h2 class="content-title">ХРОНОЛОГИЯ</h2>
                <div class="timeline">
                    <div class="timeline-item">
                        <div class="timeline-date">18.06.2024</div>
                        <div class="timeline-text">Создание канала VZ</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-date">30.07.2024</div>
                        <div class="timeline-text">Поездка Аида и Кости в Нижний Тагил для встречи с Виталием</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-date">01.08.2024 // 12:00</div>
                        <div class="timeline-text">Взрыв газовоздушной смеси в доме №81 на ул. Сибирская</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-date">01.08.2024</div>
                        <div class="timeline-text">Гибель 11 человек, включая Аида и Костю</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-date">07.08.2024</div>
                        <div class="timeline-text">Сотрудники газовой службы отправлены под домашний арест</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-date">01.10.2024</div>
                        <div class="timeline-text">Снос дома №81</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-date">02.07.2026</div>
                        <div class="timeline-text">Виталий выписан из психбольницы</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-date">30.08.2026</div>
                        <div class="timeline-text">Статья о смерти Аида и Кости опубликована</div>
                    </div>
                </div>
            `;
            break;
        
        case 'evidence':
            content = `
                <h2 class="content-title">УЛИКИ</h2>
                <div class="evidence-grid">
                    <div class="evidence-card">
                        <div class="evidence-icon">📹</div>
                        <div class="evidence-label">ВИДЕО ВЗРЫВА</div>
                        <a href="https://regnum.ru/video/player/YJP1063G2" target="_blank" class="evidence-link">REGnum</a>
                    </div>
                    <div class="evidence-card">
                        <div class="evidence-icon">📄</div>
                        <div class="evidence-label">ПОСТАНОВЛЕНИЕ СУДА</div>
                        <div class="evidence-text">07.08.2024 // ДОМАШНИЙ АРЕСТ</div>
                    </div>
                    <div class="evidence-card">
                        <div class="evidence-icon">🏚</div>
                        <div class="evidence-label">ДОМ №81</div>
                        <div class="evidence-text">СНЕСЁН 01.10.2024</div>
                    </div>
                    ${accessId === 'sibirskaya' || accessId === 'gvr' || accessId === 'shaman' || accessId === 'aidkostya' ? `
                    <div class="evidence-card secret">
                        <div class="evidence-icon">🔒</div>
                        <div class="evidence-label">СЕКРЕТНАЯ ЗАПИСЬ</div>
                        <div class="evidence-text">"Он знает больше, чем говорит"</div>
                    </div>
                    ` : ''}
                </div>
            `;
            break;
        
        case 'audio':
            content = `
                <h2 class="content-title">АУДИОЗАПИСИ</h2>
                <div class="audio-list">
                    <div class="audio-item">
                        <div class="audio-name">audio_001.mp3</div>
                        <div class="audio-desc">Перехват 01.08.2024</div>
                        <div class="audio-status">ВОСПРОИЗВЕДЕНИЕ НЕВОЗМОЖНО</div>
                    </div>
                    <div class="audio-item">
                        <div class="audio-name">audio_002.mp3</div>
                        <div class="audio-desc">Морзе-сигнал</div>
                        <div class="audio-morse">- . -. . - .-. .- -. .-. .- .-.. -. .-. .-</div>
                    </div>
                    <div class="audio-item">
                        <div class="audio-name">audio_003.mp3</div>
                        <div class="audio-desc">Шум пожара</div>
                        <div class="audio-status">ВОСПРОИЗВЕДЕНИЕ НЕВОЗМОЖНО</div>
                    </div>
                </div>
            `;
            break;
        
        case 'restricted':
            content = `
                <h2 class="content-title">ОГРАНИЧЕННЫЙ ДОСТУП</h2>
                <div class="restricted-box">
                    <div class="restricted-icon">🔒</div>
                    <div class="restricted-text">ДАННЫЙ РАЗДЕЛ ТРЕБУЕТ ДОПОЛНИТЕЛЬНОГО ПАРОЛЯ</div>
                    <input type="password" class="restricted-input" id="restrictedPassword" placeholder="ВВЕДИТЕ ПАРОЛЬ">
                    <button class="restricted-btn" id="restrictedBtn">ПРОВЕРИТЬ</button>
                </div>
            `;
            break;
        
        case 'terminal':
            window.location.href = 'terminal.html';
            return;
        
        default:
            content = '<p>РАЗДЕЛ НЕ НАЙДЕН</p>';
    }
    
    contentArea.innerHTML = content;
    contentArea.classList.add('active');
    
        // Обработка секретного пароля
    if (page === 'restricted') {
        const restrictedBtn = document.getElementById('restrictedBtn');
        const restrictedPassword = document.getElementById('restrictedPassword');
        
        if (restrictedBtn && restrictedPassword) {
            restrictedBtn.addEventListener('click', function() {
                const pwd = restrictedPassword.value.trim();
                if (pwd === '020760' || pwd === '012812' || pwd === '1813') {
                    restrictedPassword.value = '';
                    restrictedPassword.placeholder = 'ДОСТУП РАЗРЕШЁН';
                    loadSecretFiles(accessId);
                } else {
                    restrictedPassword.value = '';
                    restrictedPassword.placeholder = 'НЕВЕРНЫЙ ПАРОЛЬ. БЛЯТЬ.';
                }
            });
            restrictedPassword.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    const pwd = restrictedPassword.value.trim();
                    if (pwd === '020760' || pwd === '012812' || pwd === '1813') {
                        restrictedPassword.value = '';
                        restrictedPassword.placeholder = 'ДОСТУП РАЗРЕШЁН';
                        loadSecretFiles(accessId);
                    } else {
                        restrictedPassword.value = '';
                        restrictedPassword.placeholder = 'НЕВЕРНЫЙ ПАРОЛЬ. БЛЯТЬ.';
                    }
                }
            });
        }
    }
}

// ============ СЕКРЕТНЫЕ ФАЙЛЫ ============
function loadSecretFiles(accessId) {
    const contentArea = document.getElementById('contentArea');
    if (!contentArea) return;
    
    let content = `
        <h2 class="content-title" style="color: #ff0000;">СЕКРЕТНЫЕ ФАЙЛЫ</h2>
        <div class="secret-warning">ВНИМАНИЕ! ДАЛЬНЕЙШЕЕ ЧТЕНИЕ МОЖЕТ ИЗМЕНИТЬ ВАШЕ ВОСПРИЯТИЕ РЕАЛЬНОСТИ.</div>
    `;
    
    if (accessId === 'gvr' || accessId === 'shaman' || accessId === 'aidkostya') {
        content += `
            <div class="file-card secret">
                <div class="file-header">ФАЙЛ: INTERCEPTED_MESSAGE.txt</div>
                <div class="file-body">
                    <p class="glitch-text">"Они не умерли. Они просто перестали быть теми, кем были."</p>
                    <p class="glitch-text">"Виталий видел их после взрыва."</p>
                    <p class="glitch-text">"GVR — это не просто команда. Это прикрытие."</p>
                </div>
            </div>
            <div class="file-card secret">
                <div class="file-header">ФАЙЛ: FINAL_MESSAGE.txt</div>
                <div class="file-body">
                    <p>"Если ты это читаешь, значит ты уже слишком глубоко."</p>
                    <p>"Возмездие продолжается."</p>
                    <p>"— Аид и Костя"</p>
                </div>
            </div>
        `;
    }
    
    if (accessId === 'aidkostya') {
        content += `
            <div class="file-card secret-ultimate">
                <div class="file-header">ФАЙЛ: THE_TRUTH.txt</div>
                <div class="file-body">
                    <p>МЫ ЖИВЫ.</p>
                    <p>МЫ ВСЕГДА БЫЛИ ЖИВЫ.</p>
                    <p>ВЗРЫВ — ЭТО ПРИКРЫТИЕ.</p>
                    <p>ВИТАЛИЙ ЗНАЕТ.</p>
                    <p>ТЕПЕРЬ ЗНАЕШЬ И ТЫ.</p>
                    <p>НЕ РАССКАЗЫВАЙ НИКОМУ.</p>
                    <p>— А. и К.</p>
                </div>
            </div>
        `;
    }
    
    contentArea.innerHTML = content;
}

// ============ ИНИЦИАЛИЗАЦИЯ ТЕРМИНАЛА ============
function initTerminal() {
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalInput = document.getElementById('terminalInput');
    const terminalClose = document.getElementById('terminalClose');
    
    if (terminalClose) {
        terminalClose.addEventListener('click', function() {
            window.location.href = 'main.html';
        });
    }
    
    const commands = {
        help: {
            response: [
                'ДОСТУПНЫЕ КОМАНДЫ:',
                'help - показать этот список',
                'ls - список файлов',
                'open [файл] - открыть файл',
                'whois [имя] - досье на человека',
                'status - статус системы',
                'clear - очистить экран',
                'exit - выйти',
                'vz - информация о VZ',
                'gvr - информация о GVR',
                'aidos - информация об Аиде',
                'kostya - информация о Косте',
                'vitaly - информация о Виталии',
                '81 - дело №81',
                'sibirskaya - ул. Сибирская',
                'morse - прослушать морзе',
                'date - текущая дата',
                'whoami - кто ты'
            ],
            type: 'system'
        },
        ls: {
            response: [
                'files/:',
                '  aids.txt',
                '  kostya.txt',
                '  case81.txt',
                '  vitaly.txt',
                '  gvr.txt',
                '  morse.txt',
                '  truth.txt [ЗАШИФРОВАНО]'
            ],
            type: 'system'
        },
        'open aids.txt': {
            response: ['ФАЙЛ: aids.txt', 'ИМЯ: Дмитрий (Аид)', 'СТАТУС: ПОГИБ', 'ДАТА: 25.05.1999 - 01.08.2024', 'ПОСЛЕДНЕЕ СООБЩЕНИЕ: "Костя, блять..."'],
            type: 'success'
        },
        'open kostya.txt': {
            response: ['ФАЙЛ: kostya.txt', 'ИМЯ: Константин (Костя)', 'СТАТУС: ПОГИБ', 'ДАТА: 04.12.2002 - 01.08.2024', 'ПОСЛЕДНЕЕ СООБЩЕНИЕ: "Аид, блять..."'],
            type: 'success'
        },
        'open case81.txt': {
            response: ['ДЕЛО №81', 'АДРЕС: Нижний Тагил, ул. Сибирская, 81', 'СОБЫТИЕ: Взрыв газовоздушной смеси', 'ДАТА: 01.08.2024', 'ПОГИБШИЕ: 11 человек', 'ПОДОЗРЕВАЕМЫЕ: неизвестные в форме газовой службы'],
            type: 'success'
        },
        'open vitaly.txt': {
            response: ['ФАЙЛ: vitaly.txt', 'ИМЯ: Виталий Андреевич Шнайдер', 'СТАТУС: ВЫЖИЛ', 'ДИАГНОЗ: ПТСР', 'ПСИХБОЛЬНИЦА: ГАУЗ СО "ПБ №7"', 'ПРЕПАРАТЫ: гидроксизин, кветиапин, ламотриджин', 'ВЫПИСАН: 02.07.2026'],
            type: 'success'
        },
        'open gvr.txt': {
            response: ['GVR - Global Victory Resistance', 'ОСНОВАТЕЛЬ: Виталий Шнайдер', 'ДЕЯТЕЛЬНОСТЬ: помощь командам, рейды, информация, спонсирование', 'СТАТУС: АКТИВНА'],
            type: 'success'
        },
        'open morse.txt': {
            response: ['МОРЗЕ-СИГНАЛ:', '... --- ...', 'ПЕРЕВОД: SOS', 'ДОПОЛНИТЕЛЬНЫЙ СИГНАЛ:', '-...- . ...--', 'ПЕРЕВОД: VZ'],
            type: 'success'
        },
        'open truth.txt': {
            response: ['ФАЙЛ ЗАШИФРОВАН.', 'НУЖЕН ДОПОЛНИТЕЛЬНЫЙ ПАРОЛЬ.', 'ПОДСКАЗКА: дата, когда всё началось.'],
            type: 'error'
        },
        status: {
            response: ['СИСТЕМА: АКТИВНА', 'ПОДКЛЮЧЕНИЕ: СТАБИЛЬНОЕ', 'АРХИВ: ДОСТУПЕН', 'ПОЛЬЗОВАТЕЛЬ: ' + (sessionStorage.getItem('vz_login') || 'НЕИЗВЕСТНЫЙ'), 'УРОВЕНЬ ДОСТУПА: ' + (sessionStorage.getItem('vz_access_level') || 'НЕОПРЕДЕЛЁН')],
            type: 'system'
        },
        clear: {
            clear: true
        },
        exit: {
            response: ['ВЫХОД НЕВОЗМОЖЕН.', 'ВЫ УЖЕ ЗДЕСЬ.'],
            type: 'error'
        },
        vz: {
            response: ['Возмездие Аида и Кости.', 'Создано: 18.06.2024.', 'Основатели: Дмитрий (Аид) и Константин (Костя).', 'Статус: активен.'],
            type: 'system'
        },
        gvr: {
            response: ['Global Victory Resistance.', 'Основатель: Виталий Шнайдер.', 'Роль в VZ: спонсор.', 'Подробности: open gvr.txt'],
            type: 'system'
        },
        aidos: {
            response: ['Аид (Дмитрий).', '25.05.1999 - 01.08.2024.', 'Погиб при взрыве дома №81.', 'Или нет?'],
            type: 'success'
        },
        kostya: {
            response: ['Костя (Константин).', '04.12.2002 - 01.08.2024.', 'Погиб при взрыве дома №81.', 'Или нет?'],
            type: 'success'
        },
        vitaly: {
            response: ['Виталий Шнайдер.', 'Выжил.', 'ПТСР.', 'Он знает больше, чем говорит.'],
            type: 'success'
        },
        '81': {
            response: ['ДЕЛО №81.', 'Сибирская 81.', 'Взрыв 01.08.2024.', '11 погибших.', '6 детей.', 'Дом снесён 01.10.2024.'],
            type: 'system'
        },
        sibirskaya: {
            response: ['ул. Сибирская, 81.', 'Нижний Тагил.', 'Там всё произошло.'],
            type: 'system'
        },
        morse: {
            response: ['... --- ...  -...- . ...--', 'SOS VZ'],
            type: 'success'
        },
        date: {
            response: ['ТЕКУЩАЯ ДАТА: ' + new Date().toLocaleString('ru-RU')],
            type: 'system'
        },
        whoami: {
            response: ['ТЫ — ТОТ, КТО ДОЛЖЕН БЫЛ ЭТО НАЙТИ.'],
            type: 'success'
        }
    };
    
    terminalInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const input = terminalInput.value.trim().toLowerCase();
            terminalInput.value = '';
            
            // Вывод введённой команды
            const promptLine = document.createElement('div');
            promptLine.className = 'terminal-line';
            promptLine.textContent = 'user@vz:~$ ' + input;
            terminalOutput.appendChild(promptLine);
            
            // Обработка
            if (input === 'clear') {
                terminalOutput.innerHTML = '';
                scrollToBottom();
                return;
            }
            
            let response = commands[input];
            if (!response) {
                response = {
                    response: ['КОМАНДА НЕ НАЙДЕНА.', 'ВВЕДИТЕ help ДЛЯ СПИСКА КОМАНД.'],
                    type: 'error'
                };
            }
            
            if (response.response) {
                response.response.forEach(line => {
                    const lineEl = document.createElement('div');
                    lineEl.className = 'terminal-line ' + (response.type || '');
                    lineEl.textContent = line;
                    terminalOutput.appendChild(lineEl);
                });
            }
            
            scrollToBottom();
        }
    });
    
    function scrollToBottom() {
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
    
    // Фокус на ввод
    terminalInput.focus();
    terminalOutput.addEventListener('click', function() {
        terminalInput.focus();
    });
    
    // Морзе
    setInterval(() => {
        const morseIndicator = document.querySelector('.morse-indicator');
        if (morseIndicator) {
            morseIndicator.textContent = '... --- ...';
            setTimeout(() => {
                morseIndicator.textContent = '-...- . ...--';
            }, 500);
        }
    }, 2000);
}

// ============ УДАЛЕНИЕ СЕССИИ ПРИ ВЫХОДЕ ============
window.addEventListener('beforeunload', function() {
    // Сессия сохраняется
});
