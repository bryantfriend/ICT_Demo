// Game State & Audio Setup
const state = {
    xp: 0,
    progress: 0,
    currentChallengeRound: 0,
    quizIndex: 0,
    guidedMistakes: 0,
    challengeMistakes: 0,
    quizMistakes: 0
};

let audioCtx;
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playTone(freq, type, duration, vol=0.1) {
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch(e) { console.log("Audio skipped"); }
}

const sounds = {
    bloop: () => playTone(600, 'sine', 0.1),
    pop: () => playTone(800, 'sine', 0.05),
    success: () => {
        playTone(400, 'square', 0.1);
        setTimeout(() => playTone(600, 'square', 0.15), 100);
        setTimeout(() => playTone(800, 'square', 0.3), 250);
    },
    error: () => {
        playTone(200, 'sawtooth', 0.2, 0.2);
        setTimeout(() => playTone(150, 'sawtooth', 0.3, 0.2), 150);
    }
};

// Core UI Utilities
function updateXP(amount) {
    state.xp += amount;
    const el = document.getElementById('xp-counter');
    el.innerText = state.xp;
    el.parentElement.classList.remove('animate-pop');
    void el.parentElement.offsetWidth; // trigger reflow
    el.parentElement.classList.add('animate-pop');
    sounds.pop();
}

function setProgress(percent) {
    document.getElementById('progress-bar').style.width = percent + '%';
}

function showToast(msg, type = 'normal') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : 'bg-slate-800'}`;
    toast.innerText = msg;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px) scale(0.9)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

const screenSequence = ['s1-mood', 's2-hook', 's2b-lesson', 's2c-frameworks', 's3-guided', 's4-challenge', 's6-teamwork', 's7-reflection'];

function nextScreen(screenId) {
    sounds.bloop();
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    window.scrollTo(0, 0);
    
    // Calculate progress excluding s5-feedback as it's intermediary
    let idx = screenSequence.indexOf(screenId);
    if(idx !== -1) {
        setProgress(Math.round((idx / (screenSequence.length - 1)) * 100));
    }

    // Init screen logic
    if(screenId === 's3-guided') initGuided();
    if(screenId === 's4-challenge') loadChallengeRound();
    if(screenId === 's7-reflection') loadQuiz();
}
