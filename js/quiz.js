// SECTION 7: Anti-Spam Drag & Drop Quiz
const quizData = [
    { q: "What should usually come first in a presentation?", opts: ["Title Slide", "Thank You", "Random Fact", "The Middle"], ans: "Title Slide" },
    { q: "Why is the ORDER of slides so important?", opts: ["It helps the audience understand the story", "It makes the computer run faster", "It changes the background color", "It doesn't matter"], ans: "It helps the audience understand the story" },
    { q: "What is the 'Hamburger Rule' for presentations?", opts: ["Beginning, Middle, End", "Middle, End, Beginning", "End, Middle, Beginning", "Eat while presenting"], ans: "Beginning, Middle, End" },
    { q: "Which of these belongs in the 'Middle' of your presentation?", opts: ["The main details and steps", "The Title", "The 'Any Questions?' slide", "The Thank You slide"], ans: "The main details and steps" },
    { q: "If your slides are messy and out of order, how will the audience feel?", opts: ["Confused", "Excited", "Happy", "Smart"], ans: "Confused" },
    { q: "What is a good slide to put at the very END?", opts: ["Conclusion or Thank You", "Title", "Introduction", "The Problem"], ans: "Conclusion or Thank You" },
    { q: "In the 'Dog Wash' story, what had to happen BEFORE the bath?", opts: ["The dog got muddy", "The dog dried off", "The dog went to sleep", "The presentation ended"], ans: "The dog got muddy" },
    { q: "Why do we introduce the 'Problem' before the 'Solution'?", opts: ["So the audience knows what we are fixing", "Because P comes before S", "To confuse them", "It's a random rule"], ans: "So the audience knows what we are fixing" },
    { q: "If you are teaching how a plant grows, what order is best?", opts: ["Chronological (Time order)", "Alphabetical", "Random", "Reverse"], ans: "Chronological (Time order)" },
    { q: "Which part of the presentation is like the 'Top Bun'?", opts: ["The Title & Intro", "The Conclusion", "The Meat & Veggies", "The Questions"], ans: "The Title & Intro" }
];

let correctCount = 0;
let dropzoneSetup = false;

function loadQuiz() {
    if (state.quizIndex >= quizData.length) {
        finishLesson();
        return;
    }

    if (!dropzoneSetup) {
        setupQuizDropzone();
        dropzoneSetup = true;
    }
    
    const qData = quizData[state.quizIndex];
    document.getElementById('quiz-question').innerText = `Question ${state.quizIndex + 1}/${quizData.length}`;
    document.getElementById('quiz-progress-text').innerText = `${correctCount}/${quizData.length} Correct`;
    document.getElementById('quiz-question-text').innerText = qData.q;
    
    // Reset dropzone
    const dropzone = document.getElementById('quiz-dropzone');
    dropzone.innerHTML = `<span id="quiz-dropzone-text">Drop Answer Here</span>`;
    dropzone.className = "w-full max-w-xl mx-auto min-h-[100px] border-4 border-dashed border-slate-300 bg-slate-50 rounded-2xl flex flex-col items-center justify-center p-4 mb-8 transition-colors text-slate-400 font-bold text-xl uppercase tracking-widest relative z-10";
    
    // Shuffle options
    const shuffledOpts = [...qData.opts].sort(() => Math.random() - 0.5);
    
    const optsContainer = document.getElementById('quiz-options');
    optsContainer.innerHTML = '';
    
    shuffledOpts.forEach((opt, i) => {
        const div = document.createElement('div');
        div.className = "quiz-opt bg-white border-4 border-slate-200 text-slate-700 font-bold text-lg md:text-xl p-4 rounded-xl shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-400 hover:shadow-md transition-all text-center flex items-center justify-center";
        div.innerText = opt;
        div.draggable = true;
        div.id = `quiz-opt-${i}`;
        div.dataset.value = opt;
        
        div.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.dataset.value);
            e.dataTransfer.setData('sourceId', e.target.id);
            setTimeout(() => e.target.classList.add('opacity-50'), 0);
            sounds.pop();
        });
        div.addEventListener('dragend', (e) => {
            e.target.classList.remove('opacity-50');
        });
        optsContainer.appendChild(div);
    });

    // 3 Second Reading Delay Lockout
    applyLockout(3000, "Please read the question...");
}

function applyLockout(ms, msg) {
    const overlay = document.getElementById('quiz-lockout-overlay');
    const bar = document.getElementById('quiz-timer-bar');
    overlay.querySelector('.text-slate-600').innerText = msg;
    
    overlay.classList.remove('hidden');
    bar.style.transition = 'none';
    bar.style.width = '0%';
    
    // Force reflow
    void bar.offsetWidth;
    
    bar.style.transition = `width ${ms}ms linear`;
    bar.style.width = '100%';
    
    setTimeout(() => {
        overlay.classList.add('hidden');
    }, ms);
}

function setupQuizDropzone() {
    const dropzone = document.getElementById('quiz-dropzone');
    if(!dropzone) return;

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.replace('bg-slate-50', 'bg-blue-50');
        dropzone.classList.replace('border-slate-300', 'border-blue-400');
    });

    dropzone.addEventListener('dragleave', (e) => {
        dropzone.classList.replace('bg-blue-50', 'bg-slate-50');
        dropzone.classList.replace('border-blue-400', 'border-slate-300');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        
        dropzone.classList.replace('bg-blue-50', 'bg-slate-50');
        dropzone.classList.replace('border-blue-400', 'border-slate-300');
        
        const answer = e.dataTransfer.getData('text/plain');
        const sourceId = e.dataTransfer.getData('sourceId');
        if(!answer) return;
        
        const qData = quizData[state.quizIndex];
        
        if (answer === qData.ans) {
            // Correct
            sounds.success();
            correctCount++;
            updateXP(50);
            
            dropzone.innerHTML = `<div class="bg-green-100 border-4 border-green-500 text-green-900 font-bold text-xl p-4 rounded-xl w-full text-center animate-pop shadow-md">${answer}</div>`;
            dropzone.classList.replace('border-dashed', 'border-solid');
            dropzone.classList.replace('border-slate-300', 'border-transparent');
            dropzone.classList.replace('bg-slate-50', 'bg-transparent');
            
            document.getElementById('quiz-options').innerHTML = ''; // Clear options
            
            setTimeout(() => {
                state.quizIndex++;
                loadQuiz();
            }, 1500);
            
        } else {
            // Wrong
            sounds.error();
            state.quizMistakes++;
            dropzone.classList.remove('shake');
            void dropzone.offsetWidth;
            dropzone.classList.add('shake');
            
            const srcEl = document.getElementById(sourceId);
            if(srcEl) {
                srcEl.classList.replace('border-slate-200', 'border-red-500');
                srcEl.classList.replace('text-slate-700', 'text-red-700');
                srcEl.classList.replace('bg-white', 'bg-red-50');
            }
            
            showToast("Not quite! Try again.", "error");
            
            // Penalty lockout to stop spam guessing
            applyLockout(2000, "Penalty! Think carefully...");
        }
    });
}

function finishLesson() {
    sounds.success();
    setProgress(100);
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('final-celebration').classList.remove('hidden');
    document.getElementById('final-xp').innerText = state.xp;
    
    // Generate individualized feedback based on metrics
    const totalMistakes = state.guidedMistakes + state.challengeMistakes + state.quizMistakes;
    let feedbackText = "";
    
    if (totalMistakes === 0) {
        feedbackText = "🏆 <strong>Flawless execution!</strong> You didn't make a single mistake. You are a master of slide organization and your future presentations will be legendary!";
    } else if (totalMistakes <= 3) {
        feedbackText = "🌟 <strong>Great job!</strong> You had a couple of small slip-ups, but you quickly recovered. You clearly understand the Hamburger Rule!";
    } else if (state.quizMistakes > state.challengeMistakes) {
        feedbackText = "🧠 <strong>Concept Check!</strong> You are great at organizing slides practically, but you rushed the Final Exam. Next time, take a deep breath and read the concepts carefully!";
    } else if (state.challengeMistakes > state.quizMistakes) {
        feedbackText = "🧩 <strong>Practical Practice!</strong> You know the concepts well, but you struggled a bit putting the stories in the right order. Remember to always think chronologically!";
    } else {
        feedbackText = "📚 <strong>Keep Learning!</strong> This was a tough one, but you stuck with it. Remember the golden rule: every presentation is a story with a Beginning, Middle, and End. Keep practicing!";
    }
    
    const feedbackEl = document.getElementById('final-feedback-text');
    if (feedbackEl) {
        feedbackEl.innerHTML = feedbackText;
    }
    
    triggerConfetti();
    
    // Continuous confetti for ending
    setInterval(triggerConfetti, 3000);
}
