// ============ VZ ARG // CASE 81 ============
// ============ SCRIPT (FULL VERSION) ============

let currentLang = 'ru';

// Уровни доступа
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
        redirect: 'vz-archive.html'
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
        redirect: 'sibirskaya.html'
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
        redirect: 'gvr.html'
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
        redirect: 'andrey.html'
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
        redirect: 'shaman.html'
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
        redirect: 'aidkostya.html'
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
        redirect: 'admin.html'
    }
];

// Тупые пароли
const stupidPasswords = [
    {
        login: ['', 'admin', 'root', 'user', 'guest'],
        password: ['123456', '12345678910', 'qwerty', 'password', '67', '1', '0', '111', '222', '333', 'abc', 'test', 'login'],
        response: {
            ru: 'БЛЯТЬ ТЫ ИДИОТ. СЕРЬЁЗНО?',
            en: 'FUCK YOU IDIOT. SERIOUSLY?',
            fr: 'PUTAIN T\'ES CON. SÉRIEUSEMENT ?'
        }
    }
];

document.addEventListener('DOMContentLoaded', function() {
    const bodyClass = document.body.className;
    
    if (bodyClass.includes('login-body')) {
        initLogin();
    } else if (bodyClass.includes('main-body')) {
        initArchive();
    }
});

function initLogin() {
    const loginInput = document.getElementById('loginInput');
    const passwordInput = document.getElementById('passwordInput');
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');
    const modal = document.getElementById('responseModal');
    const modalText = document.getElementById('modalText');
    const modalClose = document.getElementById('modalClose');
    
    // Переключатель языка
    document.querySelectorAll('.lang-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            currentLang = this.dataset.lang;
            document.querySelectorAll('.lang-btn').forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    function handleLogin() {
        const login = loginInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!login || !password) {
            showError('ВВЕДИТЕ ЛОГИН И ПАРОЛЬ');
            return;
        }
        
        // Проверка на тупые пароли
        for (let sp of stupidPasswords) {
            if (sp.login.includes(login.toLowerCase()) && sp.password.includes(password)) {
                showModal(sp.response[currentLang] || sp.response.ru);
                return;
            }
        }
        
        // Проверка на правильные пароли
        let found = false;
        for (let level of accessLevels) {
            if (level.login.toLowerCase() === login.toLowerCase() && level.password === password) {
                found = true;
                sessionStorage.setItem('vz_access_level', level.level);
                sessionStorage.setItem('vz_access_id', level.id);
                sessionStorage.setItem('vz_login', login);
                
                showModal(level.response[currentLang] || level.response.ru);
                
                if (level.redirect) {
                    setTimeout(function() {
                        window.location.href = level.redirect;
                    }, 2000);
                }
                break;
            }
        }
        
        if (!found) {
            showError('НЕВЕРНЫЙ ЛОГИН ИЛИ ПАРОЛЬ');
        }
    }
    
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') handleLogin();
        });
    }
    
    if (loginInput) {
        loginInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') passwordInput.focus();
        });
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.classList.remove('active');
        });
    }
    
    function showError(msg) {
        loginError.textContent = msg;
        loginError.style.display = 'block';
        setTimeout(function() {
            loginError.style.display = 'none';
        }, 3000);
    }
    
    function showModal(msg) {
        modalText.textContent = msg;
        modal.classList.add('active');
    }
}

function initArchive() {
    // Таймер
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
    document.querySelectorAll('.nav-card').forEach(function(card) {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            loadContent(page);
        });
    });
}

function initTimer() {
    const timerDisplay = document.getElementById('timerDisplay');
    if (!timerDisplay) return;
    
    const explosionDate = new Date('2024-08-01T12:00:00');
    
    function updateTimer() {
        const now = new Date();
        const diff = now - explosionDate;
        
        if (diff < 0) {
            timerDisplay.textContent = '00:00:00:00';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        timerDisplay.textContent = 
            String(days).padStart(2, '0') + ':' +
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

function loadContent(page) {
    const contentArea = document.getElementById('contentArea');
    if (!contentArea) return;
    
    let content = '';
    
    if (page === 'dossiers') {
        content = `
            <div class="content-title">ДОСЬЕ</div>
            <div class="file-card">
                <div class="file-header">ФАЙЛ: AIDOS_DMITRIY.doc</div>
                <div class="file-body">
                    <p><strong>ИМЯ:</strong> Дмитрий (Аид)</p>
                    <p><strong>ДАТА РОЖДЕНИЯ:</strong> 25.05.1999</p>
                    <p><strong>СТАТУС:</strong> ПОГИБ ПРИ ВЗРЫВЕ 01.08.2024</p>
                    <p><strong>РОЛЬ:</strong> СОЗДАТЕЛЬ VZ</p>
                    <p><strong>ПОСЛЕДНЕЕ СООБЩЕНИЕ:</strong> «Костя, блять, я же говорил не трогать газ»</p>
                </div>
            </div>
            <div class="file-card">
                <div class="file-header">ФАЙЛ: KOSTYA_KONSTANTIN.doc</div>
                <div class="file-body">
                    <p><strong>ИМЯ:</strong> Константин (Костя)</p>
                    <p><strong>ДАТА РОЖДЕНИЯ:</strong> 04.12.2002</p>
                    <p><strong>СТАТУС:</strong> ПОГИБ ПРИ ВЗРЫВЕ 01.08.2024</p>
                    <p><strong>РОЛЬ:</strong> СОУЧРЕДИТЕЛЬ VZ</p>
                    <p><strong>ПОСЛЕДНЕЕ СООБЩЕНИЕ:</strong> «Аид, блять, это ты газ не выключил»</p>
                </div>
            </div>
        `;
    } else if (page === 'chronology') {
        content = `
            <div class="content-title">ХРОНОЛОГИЯ</div>
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
    } else if (page === 'evidence') {
        content = `
            <div class="content-title">УЛИКИ</div>
            <div class="file-card">
                <div class="file-header">ВИДЕО ВЗРЫВА</div>
                <div class="file-body">
                    <a href="https://regnum.ru/video/player/YJP1063G2" target="_blank" style="color: var(--accent-bright);">REGnum</a>
                </div>
            </div>
            <div class="file-card">
                <div class="file-header">ПОСТАНОВЛЕНИЕ СУДА</div>
                <div class="file-body">07.08.2024 // ДОМАШНИЙ АРЕСТ</div>
            </div>
            <div class="file-card">
                <div class="file-header">ДОМ №81</div>
                <div class="file-body">СНЕСЁН 01.10.2024</div>
            </div>
        `;
    } else if (page === 'terminal') {
        window.location.href = 'terminal.html';
        return;
    } else if (page === 'audio') {
        content = `
            <div class="content-title">АУДИОЗАПИСИ</div>
            <div class="file-card">
                <div class="file-header">audio_001.mp3</div>
                <div class="file-body">Перехват 01.08.2024 // ВОСПРОИЗВЕДЕНИЕ НЕВОЗМОЖНО</div>
            </div>
            <div class="file-card">
                <div class="file-header">audio_002.mp3</div>
                <div class="file-body">Морзе-сигнал // ... --- ...</div>
            </div>
            <div class="file-card">
                <div class="file-header">audio_003.mp3</div>
                <div class="file-body">Шум пожара // ВОСПРОИЗВЕДЕНИЕ НЕВОЗМОЖНО</div>
            </div>
        `;
    } else if (page === 'restricted') {
        content = `
            <div class="content-title">ОГРАНИЧЕННЫЙ ДОСТУП</div>
            <div class="file-card">
                <div class="file-body" style="text-align: center;">
                    <p>ДАННЫЙ РАЗДЕЛ ТРЕБУЕТ ДОПОЛНИТЕЛЬНОГО ПАРОЛЯ</p>
                    <input type="password" id="restrictedPassword" placeholder="ВВЕДИТЕ ПАРОЛЬ" style="background: #050505; border: 1px solid #1a1a1a; color: #e0e0e0; padding: 10px; font-family: inherit; font-size: 0.8rem; letter-spacing: 2px; outline: none; width: 100%; margin-top: 15px; text-align: center;">
                    <button onclick="checkRestricted()" style="background: #050505; border: 1px solid #8b0000; color: #e0e0e0; padding: 10px 20px; font-family: inherit; font-size: 0.7rem; letter-spacing: 2px; cursor: pointer; margin-top: 10px;">ПРОВЕРИТЬ</button>
                </div>
            </div>
        `;
    } else {
        content = '<p>РАЗДЕЛ НЕ НАЙДЕН</p>';
    }
    
    contentArea.innerHTML = content;
    contentArea.classList.add('active');
}

function checkRestricted() {
    const input = document.getElementById('restrictedPassword');
    const pwd = input.value.trim();
    
    if (pwd === '020760') {
        window.location.href = 'shaman.html';
    } else if (pwd === '012812') {
        window.location.href = 'aidkostya.html';
    } else if (pwd === '1813') {
        window.location.href = 'gvr.html';
    } else if (pwd === '18062024') {
        window.location.href = 'andrey.html';
    } else {
        input.value = '';
        input.placeholder = 'НЕВЕРНЫЙ ПАРОЛЬ. БЛЯТЬ.';
    }
            }
