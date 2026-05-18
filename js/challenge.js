// SECTION 4: Challenge Engine
const challenges = [
    {
        round: "Round 1: Easy",
        topic: "How a Plant Grows",
        hint: "Start with a Title, then put the steps in order from planting to blooming, and finish with a Conclusion.",
        slides: [
            { id: 1, text: "Title: How a Plant Grows", correctIndex: 0 },
            { id: 2, text: "Step 1: Planting the Seed", correctIndex: 1 },
            { id: 3, text: "Step 2: Watering the Soil", correctIndex: 2 },
            { id: 4, text: "Step 3: Sprouting the First Leaves", correctIndex: 3 },
            { id: 5, text: "Step 4: Growing into a Flower", correctIndex: 4 },
            { id: 6, text: "Conclusion / Thank You", correctIndex: 5 }
        ]
    },
    {
        round: "Round 2: Medium",
        topic: "School Recycling Project",
        hint: "Introduce the problem, then explain the solution. Give instructions, and then end it properly.",
        slides: [
            { id: 1, text: "Title: School Recycling Project", correctIndex: 0 },
            { id: 2, text: "The Problem: Too much trash in the cafeteria", correctIndex: 1 },
            { id: 3, text: "The Solution: Three new colored bins", correctIndex: 2 },
            { id: 4, text: "Step 1: Put plastic in the blue bin", correctIndex: 3 },
            { id: 5, text: "Step 2: Put food in the green bin", correctIndex: 4 },
            { id: 6, text: "Thank You for Helping!", correctIndex: 5 }
        ]
    },
    {
        round: "Round 3: Hard",
        topic: "My New Invention",
        hint: "What is the problem? Introduce your invention, explain how it works, why it's good, and end with questions.",
        slides: [
            { id: 1, text: "Title: The Auto-Desk Cleaner", correctIndex: 0 },
            { id: 2, text: "The Problem: Messy student desks", correctIndex: 1 },
            { id: 3, text: "The Invention: A robot inside your desk", correctIndex: 2 },
            { id: 4, text: "How it Works: It sweeps automatically", correctIndex: 3 },
            { id: 5, text: "The Benefit: You never have to clean", correctIndex: 4 },
            { id: 6, text: "Any Questions?", correctIndex: 5 }
        ]
    }
];

let activeChallengeList = [];
let activeSlideIndex = 0;

function loadChallengeRound() {
    if (state.currentChallengeRound >= challenges.length) {
        nextScreen('s6-teamwork');
        return;
    }

    const challenge = challenges[state.currentChallengeRound];
    document.getElementById('ppt-round-title').innerText = challenge.round;
    document.getElementById('ppt-round-topic').innerText = `Topic: ${challenge.topic}`;
    
    // Shuffle slides
    activeChallengeList = [...challenge.slides].sort(() => Math.random() - 0.5);
    
    let isSorted = true;
    for(let i=0; i<activeChallengeList.length; i++) {
        if(activeChallengeList[i].correctIndex !== i) isSorted = false;
    }
    if(isSorted) activeChallengeList.push(activeChallengeList.shift());
    
    activeSlideIndex = 0; // Select first slide
    renderChallengeList();
}

function showHint() {
    sounds.pop();
    const hint = challenges[state.currentChallengeRound].hint;
    showToast("💡 " + hint, "normal");
}

function selectSlide(index) {
    activeSlideIndex = index;
    renderChallengeList();
    sounds.pop();
}

function renderChallengeList() {
    const container = document.getElementById('ppt-thumbnails');
    container.innerHTML = '';
    
    // Update main active slide view
    if (activeChallengeList.length > 0 && activeChallengeList[activeSlideIndex]) {
        document.getElementById('ppt-active-text').innerText = activeChallengeList[activeSlideIndex].text;
    }

    activeChallengeList.forEach((slide, index) => {
        const item = document.createElement('div');
        const isActive = index === activeSlideIndex;
        item.className = `flex group relative mb-3 cursor-pointer w-full justify-center transition-all ${isActive ? 'active-thumb' : ''}`;
        item.dataset.index = index;
        item.draggable = true;
        
        item.onclick = () => selectSlide(index);
        
        item.innerHTML = `
            <div class="w-6 md:w-8 text-[10px] md:text-xs ${isActive ? 'text-[#d74c2f]' : 'text-slate-500'} text-right pr-2 font-bold pt-2">${index + 1}</div>
            <div class="w-24 md:w-36 aspect-[16/9] bg-white border-2 ${isActive ? 'border-[#d74c2f] shadow-md' : 'border-slate-300'} rounded flex items-center justify-center p-2 text-[10px] md:text-xs font-bold text-slate-700 text-center cursor-grab hover:border-slate-400 transition-colors">
                ${slide.text}
            </div>
            <!-- Drop Indicators -->
            <div class="absolute -top-1.5 left-8 right-2 h-1 bg-[#d74c2f] hidden drop-indicator drop-top z-10 rounded"></div>
            <div class="absolute -bottom-1.5 left-8 right-2 h-1 bg-[#d74c2f] hidden drop-indicator drop-bottom z-10 rounded"></div>
        `;

        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragleave', handleDragLeave);
        item.addEventListener('dragend', handleDragEnd);

        container.appendChild(item);
    });
}

// HTML5 Drag handlers
let draggedIndex = null;

function handleDragStart(e) {
    draggedIndex = parseInt(this.dataset.index);
    e.dataTransfer.setData('text/plain', draggedIndex);
    
    // Select the slide being dragged
    activeSlideIndex = draggedIndex;
    
    // Update active text without re-rendering the whole DOM to preserve the drag operation
    if (activeChallengeList[activeSlideIndex]) {
        document.getElementById('ppt-active-text').innerText = activeChallengeList[activeSlideIndex].text;
    }
    
    // Update active thumb classes manually
    document.querySelectorAll('#ppt-thumbnails .group').forEach((item, idx) => {
        if(idx === draggedIndex) {
            item.classList.add('active-thumb');
            item.children[0].classList.remove('text-slate-500');
            item.children[0].classList.add('text-[#d74c2f]');
            item.children[1].classList.remove('border-slate-300');
            item.children[1].classList.add('border-[#d74c2f]', 'shadow-md');
        } else {
            item.classList.remove('active-thumb');
            item.children[0].classList.add('text-slate-500');
            item.children[0].classList.remove('text-[#d74c2f]');
            item.children[1].classList.add('border-slate-300');
            item.children[1].classList.remove('border-[#d74c2f]', 'shadow-md');
        }
    });

    setTimeout(() => this.classList.add('opacity-50'), 0);
    sounds.pop();
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const rect = this.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    
    this.querySelector('.drop-top').classList.add('hidden');
    this.querySelector('.drop-bottom').classList.add('hidden');
    
    if (relY < rect.height / 2) {
        this.dataset.dropPos = 'top';
        this.querySelector('.drop-top').classList.remove('hidden');
    } else {
        this.dataset.dropPos = 'bottom';
        this.querySelector('.drop-bottom').classList.remove('hidden');
    }
    
    return false;
}

function handleDragEnter(e) {
    e.preventDefault();
}

function handleDragLeave(e) {
    const dropTop = this.querySelector('.drop-top');
    const dropBottom = this.querySelector('.drop-bottom');
    if(dropTop) dropTop.classList.add('hidden');
    if(dropBottom) dropBottom.classList.add('hidden');
}

function handleDrop(e) {
    e.stopPropagation();
    this.querySelector('.drop-top').classList.add('hidden');
    this.querySelector('.drop-bottom').classList.add('hidden');
    
    const targetIndex = parseInt(this.dataset.index);
    const dropPos = this.dataset.dropPos;
    
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
        const item = activeChallengeList.splice(draggedIndex, 1)[0];
        
        let insertIndex = targetIndex;
        if (dropPos === 'bottom') {
            insertIndex = draggedIndex < targetIndex ? targetIndex : targetIndex + 1;
        } else {
            insertIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
        }
        
        activeChallengeList.splice(insertIndex, 0, item);
        activeSlideIndex = insertIndex; // Update active to the dropped position
        renderChallengeList();
        sounds.pop();
    }
    return false;
}

function handleDragEnd(e) {
    this.classList.remove('opacity-50');
    document.querySelectorAll('.drop-indicator').forEach(el => el.classList.add('hidden'));
    draggedIndex = null;
}

function checkChallengeOrder() {
    let isCorrect = true;
    activeChallengeList.forEach((slide, index) => {
        if (slide.correctIndex !== index) isCorrect = false;
    });

    if (isCorrect) {
        sounds.success();
        updateXP(200);
        triggerConfetti();
        
        // Highlight correct items visually
        document.querySelectorAll('#ppt-thumbnails .group > div:nth-child(2)').forEach((el, i) => {
            setTimeout(() => {
                el.classList.replace('border-slate-300', 'border-green-500');
                el.classList.replace('border-[#d74c2f]', 'border-green-500');
                el.classList.add('bg-green-50');
            }, i * 100);
        });

        setTimeout(() => {
            showFeedbackScreen();
        }, 1000);

    } else {
        sounds.error();
        state.challengeMistakes++;
        const container = document.getElementById('ppt-thumbnails');
        container.classList.remove('shake');
        void container.offsetWidth;
        container.classList.add('shake');
        showToast("Not quite! Remember to order from beginning to end.", "error");
    }
}
