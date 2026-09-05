// ============ VZ ARG // AUDIO SYSTEM v2 ============
// ============ FULL VERSION ============

const AudioSystem = {
    context: null,
    masterGain: null,
    isRunning: false,
    currentMode: 'default',
    
    init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.gain.value = 0.12;
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
    
    setMode(mode) {
        this.currentMode = mode;
        this.stopAllLoops();
        
        if (mode === 'archive') {
            this.startArchiveAmbient();
        } else if (mode === 'sibirskaya') {
            this.startSibirskayaAmbient();
        } else if (mode === 'gvr') {
            this.startGVRAmbient();
        } else if (mode === 'andrey') {
            this.startAndreyAmbient();
        } else if (mode === 'shaman') {
            this.startShamanAmbient();
        } else if (mode === 'aidkostya') {
            this.startAidKostyaAmbient();
        }
    },
    
    stopAllLoops() {
        // Очистка интервалов
        if (this.intervals) {
            this.intervals.forEach(clearInterval);
        }
        this.intervals = [];
    },
    
    createTone(startTime, duration, frequency, type = 'sine', volume = 0.3) {
        if (!this.context || !this.masterGain) return;
        
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.type = type;
        osc.frequency.value = frequency;
        gain.gain.setValueAtTime(volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + duration);
    },
    
    createNoise(duration, volume = 0.1, filterFreq = 1000) {
        if (!this.context || !this.masterGain) return;
        
        const bufferSize = this.context.sampleRate * duration;
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
        filter.frequency.value = filterFreq;
        const gain = this.context.createGain();
        gain.gain.value = volume;
        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        source.start();
    },
    
    playGlitch(duration = 0.1) {
        this.createNoise(duration, 0.15, 5000);
    },
    
    playMorse(message = 'sos') {
        if (!this.context || !this.masterGain) return;
        
        const dot = 0.08;
        const dash = 0.24;
        const gap = 0.08;
        const letterGap = 0.24;
        
        let sequence = [];
        
        if (message === 'sos') {
            sequence = ['dot', 'gap', 'dot', 'gap', 'dot', 'letterGap', 'dash', 'gap', 'dash', 'gap', 'dash', 'letterGap', 'dot', 'gap', 'dot', 'gap', 'dot'];
        } else if (message === 'vz') {
            sequence = ['dot', 'gap', 'dot', 'gap', 'dot', 'gap', 'dash', 'letterGap', 'dash', 'gap', 'dash', 'gap', 'dot', 'gap', 'dot'];
        }
        
        let time = this.context.currentTime;
        
        sequence.forEach(item => {
            if (item === 'dot') {
                this.createTone(time, dot, 800, 'sine', 0.2);
                time += dot;
            } else if (item === 'dash') {
                this.createTone(time, dash, 800, 'sine', 0.2);
                time += dash;
            } else if (item === 'gap') {
                time += gap;
            } else if (item === 'letterGap') {
                time += letterGap;
            }
        });
    },
    
    playFire() {
        this.createNoise(3, 0.2, 300);
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
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.5);
        gain.gain.linearRampToValueAtTime(0.01, startTime + duration);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + duration);
    },
    
    playTick() {
        if (!this.context || !this.masterGain) return;
        
        const now = this.context.currentTime;
        this.createTone(now, 0.03, 1000, 'square', 0.05);
    },
    
    playHeartbeat() {
        if (!this.context || !this.masterGain) return;
        
        const now = this.context.currentTime;
        
        const osc1 = this.context.createOscillator();
        const gain1 = this.context.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(60, now);
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc1.connect(gain1);
        gain1.connect(this.masterGain);
        osc1.start(now);
        osc1.stop(now + 0.15);
        
        const osc2 = this.context.createOscillator();
        const gain2 = this.context.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(55, now + 0.25);
        gain2.gain.setValueAtTime(0.2, now + 0.25);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc2.connect(gain2);
        gain2.connect(this.masterGain);
        osc2.start(now + 0.25);
        osc2.stop(now + 0.35);
    },
    
    playWhisper() {
        this.createNoise(1, 0.08, 2000);
    },
    
    playLaugh() {
        if (!this.context || !this.masterGain) return;
        
        for (let i = 0; i < 5; i++) {
            const startTime = this.context.currentTime + i * 0.15;
            this.createTone(startTime, 0.1, 400 + Math.random() * 300, 'square', 0.08);
        }
    },
    
    startArchiveAmbient() {
        if (!this.context || !this.masterGain) return;
        this.intervals = [];
        
        // Низкий гул
        const bufferSize = this.context.sampleRate * 4;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.sin(i * 0.0001) * 0.4 + (Math.random() * 0.08 - 0.04);
        }
        const source = this.context.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        const filter = this.context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 150;
        const gain = this.context.createGain();
        gain.gain.value = 0.5;
        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        source.start();
        
        // Тиканье часов (для таймера)
        this.intervals.push(setInterval(() => {
            this.playTick();
        }, 1000));
        
        // Редкий глитч
        this.intervals.push(setInterval(() => {
            if (Math.random() < 0.3) this.playGlitch(0.05 + Math.random() * 0.1);
        }, 8000));
        
        // Редкое морзе
        this.intervals.push(setInterval(() => {
            this.playMorse('sos');
            setTimeout(() => this.playMorse('vz'), 2000);
        }, 50000 + Math.random() * 10000));
    },
    
    startSibirskayaAmbient() {
        if (!this.context || !this.masterGain) return;
        this.intervals = [];
        
        // Ветер
        const bufferSize = this.context.sampleRate * 3;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        let last = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            last = (last + 0.01 * white) / 1.01;
            data[i] = last * 2;
        }
        const source = this.context.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        const filter = this.context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        const gain = this.context.createGain();
        gain.gain.value = 0.3;
        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        source.start();
        
        // Редкий звук сирены
        this.intervals.push(setInterval(() => {
            if (Math.random() < 0.15) this.playSiren();
        }, 30000));
        
        // Редкий звук огня
        this.intervals.push(setInterval(() => {
            if (Math.random() < 0.2) this.playFire();
        }, 25000));
    },
    
    startGVRAmbient() {
        if (!this.context || !this.masterGain) return;
        this.intervals = [];
        
        // Сердцебиение
        this.intervals.push(setInterval(() => {
            this.playHeartbeat();
        }, 1200));
        
        // Редкий монитор
        this.intervals.push(setInterval(() => {
            if (Math.random() < 0.3) this.createTone(this.context.currentTime, 0.5, 800 + Math.random() * 400, 'sine', 0.05);
        }, 8000));
        
        // Редкий шёпот
        this.intervals.push(setInterval(() => {
            if (Math.random() < 0.2) this.playWhisper();
        }, 15000));
    },
    
    startAndreyAmbient() {
        if (!this.context || !this.masterGain) return;
        this.intervals = [];
        
        // Тихий гул
        const bufferSize = this.context.sampleRate * 3;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.sin(i * 0.00005) * 0.3 + (Math.random() * 0.05 - 0.025);
        }
        const source = this.context.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        const filter = this.context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 100;
        const gain = this.context.createGain();
        gain.gain.value = 0.4;
        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        source.start();
        
        // Редкий шёпот
        this.intervals.push(setInterval(() => {
            if (Math.random() < 0.3) this.playWhisper();
        }, 12000));
        
        // Редкий стук
        this.intervals.push(setInterval(() => {
            if (Math.random() < 0.25) this.createTone(this.context.currentTime, 0.05, 200, 'square', 0.1);
        }, 7000));
    },
    
    startShamanAmbient() {
        if (!this.context || !this.masterGain) return;
        this.intervals = [];
        
        // Хаотичные смешные звуки
        this.intervals.push(setInterval(() => {
            const freq = 300 + Math.random() * 600;
            this.createTone(this.context.currentTime, 0.2, freq, 'square', 0.06);
        }, 3000));
        
        // Редкий смех
        this.intervals.push(setInterval(() => {
            if (Math.random() < 0.3) this.playLaugh();
        }, 10000));
        
        // Казу-подобный звук
        this.intervals.push(setInterval(() => {
            if (Math.random() < 0.2) {
                const osc = this.context.createOscillator();
                const gain = this.context.createGain();
                osc.type = 'sawtooth';
                osc.frequency.value = 200 + Math.random() * 400;
                gain.gain.value = 0.04;
                osc.connect(gain);
                gain.connect(this.masterGain);
                osc.start();
                osc.stop(this.context.currentTime + 0.5);
            }
        }, 6000));
    },
    
    startAidKostyaAmbient() {
        if (!this.context || !this.masterGain) return;
        this.intervals = [];
        
        // Кровавый низкий гул
        const bufferSize = this.context.sampleRate * 3;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.sin(i * 0.00008) * 0.3 + Math.sin(i * 0.00012) * 0.2;
        }
        const source = this.context.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        const filter = this.context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 120;
        const gain = this.context.createGain();
        gain.gain.value = 0.5;
        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        source.start();
        
        // Редкое дыхание
        this.intervals.push(setInterval(() => {
            if (Math.random() < 0.3) this.createNoise(1.5, 0.08, 500);
        }, 10000));
        
        // Редкий шёпот
        this.intervals.push(setInterval(() => {
            if (Math.random() < 0.25) this.playWhisper();
        }, 8000));
    }
};

// Определение страницы и запуск
document.addEventListener('DOMContentLoaded', function() {
    AudioSystem.init();
    
    const bodyClass = document.body.className;
    
    let mode = 'default';
    
    if (bodyClass.includes('archive-body') || bodyClass.includes('main-body')) {
        mode = 'archive';
    } else if (bodyClass.includes('sibirskaya-body')) {
        mode = 'sibirskaya';
    } else if (bodyClass.includes('gvr-body')) {
        mode = 'gvr';
    } else if (bodyClass.includes('andrey-body')) {
        mode = 'andrey';
    } else if (bodyClass.includes('shaman-body')) {
        mode = 'shaman';
    } else if (bodyClass.includes('aidkostya-body')) {
        mode = 'aidkostya';
    }
    
    AudioSystem.setMode(mode);
    
    document.addEventListener('click', function() {
        AudioSystem.resume();
    }, { once: true });
    
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            if (AudioSystem.context) AudioSystem.context.suspend();
        } else {
            if (AudioSystem.context) AudioSystem.context.resume();
        }
    });
});
