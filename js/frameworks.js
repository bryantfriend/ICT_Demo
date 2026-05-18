// SECTION 2.5: Frameworks Strategy Dashboard
const frameworkData = [
    {
        id: "chrono",
        name: "Chronological",
        goal: "Used for stories, timelines, history, and life cycles.",
        flow: ["Past", "Present", "Future"],
        slides: ["🌱 Seed", "🌿 Sprout", "🌻 Flower"],
        feeling: "This feels like a story.",
        themeColor: "emerald",
        icon: "⏱️"
    },
    {
        id: "sequential",
        name: "Step-by-Step",
        goal: "Used for giving instructions and explaining processes.",
        flow: ["Materials", "Step 1", "Result"],
        slides: ["🥚 Ingredients", "🥣 Mix", "🎂 Cake"],
        feeling: "I can follow these instructions.",
        themeColor: "blue",
        icon: "⚙️"
    },
    {
        id: "problem",
        name: "Problem & Solution",
        goal: "Used for persuasion and pitching ideas.",
        flow: ["Problem", "Solution", "Benefit"],
        slides: ["🗑️ Trash", "♻️ Recycling", "✨ Clean School"],
        feeling: "This idea sounds useful.",
        themeColor: "orange",
        icon: "💡"
    },
    {
        id: "general",
        name: "General to Specific",
        goal: "Used for introducing large concepts before zooming into details.",
        flow: ["Big Picture", "Category", "Detail"],
        slides: ["🌌 Universe", "🌍 Earth", "🏫 School"],
        feeling: "Now I understand the context.",
        themeColor: "purple",
        icon: "🔭"
    },
    {
        id: "compare",
        name: "Compare & Contrast",
        goal: "Used for comparing ideas or choices to make a decision.",
        flow: ["Topic A", "vs", "Topic B"],
        slides: ["🐶 Dogs", "⚖️ Vs", "🐱 Cats"],
        feeling: "Now I can compare the options.",
        themeColor: "rose",
        icon: "⚖️"
    },
    {
        id: "climactic",
        name: "Climactic Build-Up",
        goal: "Used for suspense and exciting reveals.",
        flow: ["Small", "Bigger", "BIGGEST"],
        slides: ["🥉 Bronze", "🥈 Silver", "🥇 Gold"],
        feeling: "That ending felt exciting!",
        themeColor: "amber",
        icon: "📈"
    }
];

let frameworksViewed = new Set();

function initFrameworks() {
    renderFrameworkMenu();
    selectFramework(0); // Select first by default
}

function renderFrameworkMenu() {
    const menu = document.getElementById('fw-menu');
    menu.innerHTML = '';
    
    frameworkData.forEach((fw, index) => {
        const btn = document.createElement('button');
        btn.id = `fw-btn-${index}`;
        btn.className = `w-full text-left p-4 rounded-xl font-bold flex items-center gap-3 transition-all border-2 border-transparent hover:bg-slate-100 ${index === 0 ? 'bg-white shadow-md border-slate-200 text-slate-800' : 'text-slate-500'}`;
        btn.onclick = () => selectFramework(index);
        
        btn.innerHTML = `
            <div class="text-2xl">${fw.icon}</div>
            <div class="flex-1">${fw.name}</div>
            <div id="fw-check-${index}" class="text-green-500 ${frameworksViewed.has(index) ? '' : 'hidden'}">✔️</div>
        `;
        menu.appendChild(btn);
    });
}

function selectFramework(index) {
    sounds.pop();
    const fw = frameworkData[index];
    frameworksViewed.add(index);
    
    // Update Menu Visuals
    frameworkData.forEach((_, i) => {
        const btn = document.getElementById(`fw-btn-${i}`);
        if(i === index) {
            btn.className = `w-full text-left p-4 rounded-xl font-bold flex items-center gap-3 transition-all border-2 bg-white shadow-md border-${fw.themeColor}-300 text-${fw.themeColor}-700`;
        } else {
            btn.className = `w-full text-left p-4 rounded-xl font-bold flex items-center gap-3 transition-all border-2 border-transparent hover:bg-slate-100 text-slate-500`;
        }
        
        const check = document.getElementById(`fw-check-${i}`);
        if(frameworksViewed.has(i)) check.classList.remove('hidden');
    });

    // Update Dashboard Visuals
    const dashboard = document.getElementById('fw-dashboard');
    dashboard.className = `flex-1 bg-${fw.themeColor}-50 border-4 border-${fw.themeColor}-200 rounded-3xl p-8 flex flex-col transition-colors duration-300 relative overflow-hidden min-h-[400px]`;
    
    // Header
    document.getElementById('fw-title').innerText = fw.name;
    document.getElementById('fw-title').className = `text-4xl font-black text-${fw.themeColor}-800 mb-2`;
    document.getElementById('fw-goal').innerText = fw.goal;
    document.getElementById('fw-goal').className = `text-lg font-bold text-${fw.themeColor}-600/80 mb-8`;
    
    // Flow Diagram
    const flowContainer = document.getElementById('fw-flow');
    flowContainer.innerHTML = `
        <div class="text-sm font-black text-${fw.themeColor}-400 uppercase tracking-widest mb-4">Visual Flow</div>
        <div class="flex items-center justify-center gap-2 md:gap-4 w-full bg-white/50 p-6 rounded-2xl border-2 border-${fw.themeColor}-100">
            <div class="bg-white px-4 py-3 rounded-xl font-bold text-${fw.themeColor}-700 shadow border-2 border-${fw.themeColor}-200 flex-1 text-center animate-fade-in" style="animation-delay: 0s">${fw.flow[0]}</div>
            <div class="text-${fw.themeColor}-400 font-bold text-2xl animate-pulse">➔</div>
            <div class="bg-white px-4 py-3 rounded-xl font-bold text-${fw.themeColor}-700 shadow border-2 border-${fw.themeColor}-200 flex-1 text-center animate-fade-in" style="animation-delay: 0.1s">${fw.flow[1]}</div>
            <div class="text-${fw.themeColor}-400 font-bold text-2xl animate-pulse">➔</div>
            <div class="bg-white px-4 py-3 rounded-xl font-bold text-${fw.themeColor}-700 shadow border-2 border-${fw.themeColor}-200 flex-1 text-center animate-fade-in" style="animation-delay: 0.2s">${fw.flow[2]}</div>
        </div>
    `;

    // Mini Slideshow
    const slidesContainer = document.getElementById('fw-slides');
    slidesContainer.innerHTML = `
        <div class="text-sm font-black text-${fw.themeColor}-400 uppercase tracking-widest mt-8 mb-4">Example Slides</div>
        <div class="flex items-center justify-center gap-4">
            <div class="flex-1 aspect-[16/9] bg-white rounded-lg shadow-md border-2 border-slate-200 flex items-center justify-center font-bold text-sm md:text-base text-slate-700 animate-slide-up hover:scale-105 transition-transform cursor-default" style="animation-delay: 0.1s">${fw.slides[0]}</div>
            <div class="flex-1 aspect-[16/9] bg-white rounded-lg shadow-md border-2 border-slate-200 flex items-center justify-center font-bold text-sm md:text-base text-slate-700 animate-slide-up hover:scale-105 transition-transform cursor-default" style="animation-delay: 0.2s">${fw.slides[1]}</div>
            <div class="flex-1 aspect-[16/9] bg-white rounded-lg shadow-md border-2 border-slate-200 flex items-center justify-center font-bold text-sm md:text-base text-slate-700 animate-slide-up hover:scale-105 transition-transform cursor-default" style="animation-delay: 0.3s">${fw.slides[2]}</div>
        </div>
    `;

    // Audience Feeling
    document.getElementById('fw-feeling').innerText = `💭 "${fw.feeling}"`;
    document.getElementById('fw-feeling').className = `absolute bottom-0 right-8 bg-white px-6 py-4 rounded-t-2xl shadow-[0_-4px_10px_rgba(0,0,0,0.05)] font-bold text-${fw.themeColor}-700 border-2 border-${fw.themeColor}-200 border-b-0 animate-pop`;

    // Check completion
    if (frameworksViewed.size === frameworkData.length) {
        document.getElementById('fw-btn-next').classList.remove('hidden');
        document.getElementById('fw-btn-next').classList.add('animate-pop');
    }
}
