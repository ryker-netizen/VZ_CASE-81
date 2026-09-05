// ============ VZ ARG // AUDIO ============

const AudioSystem = {
    context: null,
    audioElement: null,
    isPlaying: false,
    volume: 0.3,
    
    init() {
        this.audioElement = document.getElementById('audioPlayer');
        if (!this.audioElement) return;
        
        // Создание фонового эмбиента через Web Audio API
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch(e) {
            console.log('Web Audio API не поддерживается');
        }
    },
    
    playGlitch() {
        if (!this.context) return;
        
        const bufferSize = this.context.sampleRate * 1;
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
        gain.gain.value = 0.1;
        source.connect(gain);
        gain.connect(this.context.destination);
        source.start();
    },
    
    playMorse() {
        if (!this.context) return;
        
        // ... --- ... (SOS)
        const dot = 0.1;
        const dash = 0.3;
        const gap = 0.1;
        const letterGap = 0.3;
        
        const sequence = [
            {type: 'dot', duration: dot},
            {type: 'gap', duration: gap},
            {type: 'dot', duration: dot},
            {type: 'gap', duration: gap},
            {type: 'dot', duration: dot},
            {type: 'letterGap', duration: letterGap},
            {type: 'dash', duration: dash},
            {type: 'gap', duration: gap},
            {type: 'dash', duration: dash},
            {type: 'gap', duration: gap},
            {type: 'dash', duration: dash},
            {type: 'letterGap', duration: letterGap},
            {type: 'dot', duration: dot},
            {type: 'gap', duration: gap},
            {type: 'dot', duration: dot},
            {type: 'gap', duration: gap},
            {type: 'dot', duration: dot}
        ];
        
        let time = this.context.currentTime;
        
        sequence.forEach(item => {
            if (item.type !== 'gap' && item.type !== 'letterGap') {
                const osc = this.context.createOscillator();
                const gain = this.context.createGain();
                osc.frequency.value = 800;
                gain.gain.value = 0.15;
                osc.connect(gain);
                gain.connect(this.context.destination);
                osc.start(time);
                osc.stop(time + item.duration);
            }
            time += item.duration;
        });
    },
    
    playFire() {
        if (!this.context) return;
        
        const bufferSize = this.context.sampleRate * 2;
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
        filter.frequency.value = 400;
        source.connect(filter);
        filter.connect(this.context.destination);
        source.start();
    },
    
    startAmbient() {
        this.playGlitch();
    }
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    AudioSystem.init();
    
    // Запуск звука при первом взаимодействии
    document.addEventListener('click', function() {
        if (!AudioSystem.context) return;
        if (AudioSystem.context.state === 'suspended') {
            AudioSystem.context.resume();
        }
        AudioSystem.playGlitch();
        AudioSystem.playMorse();
    }, { once: true });
    
    // Периодический глитч
    setInterval(() => {
        if (AudioSystem.context && AudioSystem.context.state === 'running') {
            AudioSystem.playGlitch();
        }
    }, 10000);
    
    // Морзе каждые 30 секунд
    setInterval(() => {
        if (AudioSystem.context && AudioSystem.context.state === 'running') {
            AudioSystem.playMorse();
        }
    }, 30000);
});
