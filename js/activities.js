// SECTION 1
function handleMood(mood, msg) {
    initAudio();
    sounds.bloop();
    
    if (mood === 'Confused') {
        startBreathingExercise(mood, msg);
    } else if (mood === 'Tired' || mood === 'Bored') {
        startBubblePop(mood, msg);
    } else {
        showMascotModal(mood, msg);
    }
}

function showMascotModal(mood, msg) {
    document.getElementById('mood-title').innerText = `You chose ${mood}!`;
    document.getElementById('mood-msg').innerText = msg;
    document.getElementById('mood-modal').classList.remove('hidden');
    updateXP(50);
}

// Breathing Exercise
function startBreathingExercise(mood, msg) {
    const modal = document.getElementById('breathing-modal');
    const circle = document.getElementById('breathe-circle');
    const text = document.getElementById('breathe-text');
    modal.classList.remove('hidden');
    
    let cycles = 0;
    const maxCycles = 2; // 2 full breaths
    
    function breatheCycle() {
        if (cycles >= maxCycles) {
            text.innerText = "Great job!";
            circle.style.transform = "scale(1)";
            setTimeout(() => {
                modal.classList.add('hidden');
                showMascotModal(mood, msg);
            }, 1000);
            return;
        }
        
        text.innerText = "Breathe In...";
        circle.style.transform = "scale(1.5)";
        
        setTimeout(() => {
            text.innerText = "Hold...";
            setTimeout(() => {
                text.innerText = "Breathe Out...";
                circle.style.transform = "scale(0.5)";
                setTimeout(() => {
                    cycles++;
                    breatheCycle();
                }, 3000);
            }, 1000);
        }, 3000);
    }
    
    // reset visual
    circle.style.transform = "scale(0.5)";
    setTimeout(breatheCycle, 1000);
}

// Bubble Pop
let poppedCount = 0;
function startBubblePop(mood, msg) {
    const modal = document.getElementById('bubble-modal');
    const container = document.getElementById('bubble-container');
    modal.classList.remove('hidden');
    container.innerHTML = '';
    container.style.pointerEvents = 'auto';
    poppedCount = 0;
    
    const colors = ['bg-pink-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400'];
    
    for(let i=0; i<5; i++) {
        const bubble = document.createElement('div');
        const color = colors[i % colors.length];
        bubble.className = `absolute w-20 h-20 rounded-full shadow-lg cursor-pointer animate-float transition-all duration-200 flex items-center justify-center text-white text-3xl font-bold ${color}`;
        // Add pseudo-reflection for 3D effect
        bubble.innerHTML = `<div class="absolute top-2 right-4 w-4 h-4 bg-white rounded-full opacity-50"></div>`;
        
        // Random position
        bubble.style.left = Math.random() * 70 + 10 + '%';
        bubble.style.top = Math.random() * 70 + 10 + '%';
        // Random float delay
        bubble.style.animationDelay = Math.random() * 2 + 's';
        
        bubble.onclick = function() {
            sounds.pop();
            this.style.transform = 'scale(1.5)';
            this.style.opacity = '0';
            this.style.pointerEvents = 'none';
            poppedCount++;
            
            if (poppedCount >= 5) {
                setTimeout(() => {
                    modal.classList.add('hidden');
                    container.style.pointerEvents = 'none';
                    showMascotModal(mood, msg);
                }, 600);
            }
        };
        
        container.appendChild(bubble);
    }
}


// SECTION 2
let hookFixed = false;
function fixHookAnimation() {
    if(hookFixed) return;
    sounds.success();
    
    // Hide confused reactions, show happy reactions
    document.getElementById('svg-reactions-confused').classList.add('hidden');
    document.getElementById('svg-reactions-happy').classList.remove('hidden');
    document.getElementById('svg-reactions-happy').classList.add('animate-pop');

    // Simulate sorting the slides quickly with a visual flicker
    const contentGroup = document.getElementById('svg-slide-content');
    contentGroup.classList.add('opacity-50');
    
    setTimeout(() => {
        // Change text/visuals to the Correct Order: Muddy -> Bath -> Clean
        contentGroup.innerHTML = `
            <rect width="100%" height="100%" fill="#bfdbfe"/>
            <text x="246" y="121" font-family="Nunito" font-size="80" text-anchor="middle" dominant-baseline="middle">🐶✨</text>
            <text x="246" y="190" font-family="Nunito" font-size="24" font-weight="800" text-anchor="middle">Clean Dog!</text>
        `;
        contentGroup.classList.remove('opacity-50');
        
        // Trigger confetti
        if(typeof triggerConfetti === 'function') triggerConfetti();
    }, 500);

    document.getElementById('hook-desc').innerHTML = "Ah, much better! Muddy -> Bath -> Clean makes sense!";
    document.getElementById('hook-desc').classList.replace('text-slate-300', 'text-green-400');

    document.getElementById('btn-fix-hook').classList.add('hidden');
    document.getElementById('btn-hook-next').classList.remove('hidden');
    
    updateXP(100);
    hookFixed = true;
}

// SECTION 5: Intermediary Feedback Screen
function showFeedbackScreen() {
    // Hide challenge, show feedback
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('s5-feedback').classList.add('active');
    window.scrollTo(0,0);

    const tips = [
        "Tip: The Title Slide is almost always slide #1!",
        "Tip: Explain the Problem before giving your Solution.",
        "Tip: A 'Thank You' or 'Conclusion' makes a great final slide."
    ];

    document.getElementById('feedback-tip').innerText = tips[state.currentChallengeRound];
}

function advanceGame() {
    sounds.bloop();
    state.currentChallengeRound++;
    
    if (state.currentChallengeRound < challenges.length) {
        // Load next round and go back to S4
        loadChallengeRound();
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('s4-challenge').classList.add('active');
        
        // Update progress bar
        setProgress(20 + (state.currentChallengeRound * 20)); // Approximate steps
    } else {
        // Done with all rounds, go to teamwork
        nextScreen('s6-teamwork');
    }
}

// SECTION 6
function selectTeamwork(choice, element) {
    sounds.bloop();
    // Reset styles
    const cards = element.parentElement.querySelectorAll('.bg-white');
    const btns = element.parentElement.querySelectorAll('.btn-game');
    cards.forEach(c => {
        c.classList.remove('ring-8', 'ring-red-400', 'ring-green-400', 'border-transparent');
        c.classList.add('border-slate-200');
    });
    btns.forEach(b => {
        b.className = "btn-game bg-slate-200 text-slate-700 mt-6 w-full py-3";
        b.innerText = b.innerText.replace("Selected ", "");
    });

    const btn = element.querySelector('.btn-game');
    
    if (choice === 'A') {
        sounds.error();
        element.classList.replace('border-slate-200', 'border-transparent');
        element.classList.add('ring-8', 'ring-red-400');
        btn.classList.replace('bg-slate-200', 'bg-red-500');
        btn.classList.replace('text-slate-700', 'text-white');
        btn.innerText = "Selected A";
        showToast("Look closely... does a presentation start with the solution?", "error");
    } else {
        sounds.success();
        element.classList.replace('border-slate-200', 'border-transparent');
        element.classList.add('ring-8', 'ring-green-400');
        btn.classList.replace('bg-slate-200', 'bg-green-500');
        btn.classList.replace('text-slate-700', 'text-white');
        btn.innerText = "Selected B";
        
        const result = document.getElementById('teamwork-result');
        result.classList.remove('hidden');
        
        if(!result.dataset.awarded) {
            updateXP(150);
            result.dataset.awarded = "true";
        }
    }
}
