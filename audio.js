// ============ VZ ARG // AUDIO SYSTEM ============
// ============ FULL VERSION ============

const AudioSystem = {
    context: null,
    masterGain: null,
    ambientNode: null,
    morseNode: null,
    fireNode: null,
    isRunning: false,
    
    init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.gain.value = 0.15;
            this.masterGain.connect(this.context.destination);
        } catch(e) {
            console.log('Web Audio API не поддерживается');
        }
    },
    
    resume() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    },
    
    playGlitch(duration = 0.1) {
        if (!this.context || !this.masterGain) return;
        
        const bufferSize = this.context.sampleRate * duration;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            if (Math.random() < 0.01) {
                data[i] = Math.random() * 2 - 1;
            } else {
                data[i] = 0;
            }
        }
        
        const source = this.context.createBufferSource();
        source.buffer = buffer;
        const gain = this.context.createGain();
        gain.gain.value = 0.3;
        source.connect(gain);
        gain.connect(this.masterGain);
        source.start();
    },
    
    playMorse(message = 'sos') {
        if (!this.context || !this.masterGain) return;
        
        const dot = 0.08;
        const dash = 0.24;
        const gap = 0.08;
        const letterGap = 0.24;
        const wordGap = 0.4;
        
        let sequence = [];
        
        if (message === 'sos') {
            // ... --- ...
            sequence = [
                'dot', 'gap', 'dot', 'gap', 'dot', 'letterGap',
                'dash', 'gap', 'dash', 'gap', 'dash', 'letterGap',
                'dot', 'gap', 'dot', 'gap', 'dot'
            ];
        } else if (message === 'vz') {
            // ...- --..
            sequence = [
                'dot', 'gap', 'dot', 'gap', 'dot', 'gap', 'dash', 'letterGap',
                'dash', 'gap', 'dash', 'gap', 'dot', 'gap', 'dot'
            ];
        }
        
        let time = this.context.currentTime;
        
        sequence.forEach(item => {
            if (item === 'dot') {
                this.createTone(time, dot, 800);
                time += dot;
            } else if (item === 'dash') {
                this.createTone(time, dash, 800);
                time += dash;
            } else if (item === 'gap') {
                time += gap;
            } else if (item === 'letterGap') {
                time += letterGap;
            } else if (item === 'wordGap') {
                time += wordGap;
            }
        });
    },
    
    createTone(startTime, duration, frequency) {
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.type = 'sine';
        osc.frequency.value = frequency;
        gain.gain.value = 0.4;
        gain.gain.setValueAtTime(0.4, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + duration);
    },
    
    playFire() {
        if (!this.context || !this.masterGain) return;
        
        const bufferSize = this.context.sampleRate * 3;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        
        let last = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            last = (last + 0.02 * white) / 1.02;
            data[i] = last * 3;
        }
        
        const source = this.context.createBufferSource();
        source.buffer = buffer;
        const filter = this.context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 300;
        const gain = this.context.createGain();
        gain.gain.value = 0.2;
        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        source.start();
    },
    
    playSiren() {
        if (!this.context || !this.masterGain) return;
        
        const duration = 3;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.type = 'sine';
        const startTime = this.context.currentTime;
        
        osc.frequency.setValueAtTime(400, startTime);
        osc.frequency.linearRampToValueAtTime(800, startTime + duration / 2);
        osc.frequency.linearRampToValueAtTime(400, startTime + duration);
        
        gain.gain.setValueAtTime(0.01, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.5);
        gain.gain.linearRampToValueAtTime(0.01, startTime + duration);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + duration);
    },
    
    startAmbient() {
        if (!this.context || !this.masterGain || this.isRunning) return;
        
        this.isRunning = true;
        
        // Создание фонового эмбиента (низкий гул)
        const bufferSize = this.context.sampleRate * 4;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.sin(i * 0.0001) * 0.5 + (Math.random() * 0.1 - 0.05);
        }
        
        const source = this.context.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        const filter = this.context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200;
        const gain = this.context.createGain();
        gain.gain.value = 0.4;
        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        source.start();
        this.ambientNode = source;
        
        // Периодический глитч
        setInterval(() => {
            if (Math.random() < 0.3) {
                this.playGlitch(0.05 + Math.random() * 0.15);
            }
        }, 5000);
        
        // Редкое морзе (раз в 45-60 секунд)
        setInterval(() => {
            this.playMorse('sos');
            setTimeout(() => {
                this.playMorse('vz');
            }, 2000);
        }, 45000 + Math.random() * 15000);
        
        // Периодический звук пожара
        setInterval(() => {
            if (Math.random() < 0.2) {
                this.playFire();
            }
        }, 20000);
        
        // Периодическая сирена
        setInterval(() => {
            if (Math.random() < 0.1) {
                this.playSiren();
            }
        }, 60000);
    },
    
    startMedicalAmbient() {
        if (!this.context || !this.masterGain || this.isRunning) return;
        
        this.isRunning = true;
        
        // Сердцебиение
        setInterval(() => {
            this.createHeartbeat();
        }, 1200);
        
        // Редкий монитор
        setInterval(() => {
            if (Math.random() < 0.3) {
                this.createTone(this.context.currentTime, 0.5, 1000);
            }
        }, 8000);
    },
    
    createHeartbeat() {
        if (!this.context || !this.masterGain) return;
        
        const now = this.context.currentTime;
        
        // Первый удар
        const osc1 = this.context.createOscillator();
        const gain1 = this.context.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(60, now);
        gain1.gain.setValueAtTime(0.4, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc1.connect(gain1);
        gain1.connect(this.masterGain);
        osc1.start(now);
        osc1.stop(now + 0.15);
        
        // Второй удар
        const osc2 = this.context.createOscillator();
        const gain2 = this.context.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(55, now + 0.25);
        gain2.gain.setValueAtTime(0.3, now + 0.25);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc2.connect(gain2);
        gain2.connect(this.masterGain);
        osc2.start(now + 0.25);
        osc2.stop(now + 0.35);
    },
    
    startChaoticAmbient() {
        if (!this.context || !this.masterGain || this.isRunning) return;
        
        this.isRunning = true;
        
        // Хаотичные звуки
        setInterval(() => {
            const freq = 200 + Math.random() * 800;
            const dur = 0.1 + Math.random() * 0.3;
            this.createTone(this.context.currentTime, dur, freq);
        }, 2000);
        
        // Смешные звуки
        setInterval(() => {
            if (Math.random() < 0.3) {
                const osc = this.context.createOscillator();
                const gain = this.context.createGain();
                osc.type = 'square';
                osc.frequency.value = 300 + Math.random() * 500;
                gain.gain.value = 0.1;
                osc.connect(gain);
                gain.connect(this.masterGain);
                osc.start();
                osc.stop(this.context.currentTime + 0.2);
            }
        }, 5000);
    },
    
    stopAll() {
        this.isRunning = false;
        if (this.ambientNode) {
            try {
                this.ambientNode.stop();
            } catch(e) {}
        }
        if (this.context) {
            this.context.close();
        }
    }
};

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    AudioSystem.init();
    
    // Запуск при первом взаимодействии
    document.addEventListener('click', function startAudio() {
        AudioSystem.resume();
        AudioSystem.startAmbient();
        document.removeEventListener('click', startAudio);
    }, { once: true });
    
    // Определяем страницу
    const bodyClass = document.body.className;
    
    if (bodyClass.includes('gvr-body') || bodyClass.includes('med-body')) {
        AudioSystem.startMedicalAmbient();
    } else if (bodyClass.includes('shaman-body') || bodyClass.includes('chaotic-body')) {
        AudioSystem.startChaoticAmbient();
    } else {
        AudioSystem.startAmbient();
    }
});

// Обработчик видимости страницы
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        if (AudioSystem.context) {
            AudioSystem.context.suspend();
        }
    } else {
        if (AudioSystem.context) {
            AudioSystem.context.resume();
        }
    }
});
