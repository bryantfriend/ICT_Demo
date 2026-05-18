// SECTION 3: Fill-in-the-Blank Practice
let guidedCompleted = false;

function initGuided() {
    // Setup Draggables
    const optWrong = document.getElementById('guided-opt-wrong');
    const optCorrect = document.getElementById('guided-opt-correct');
    const dropzone = document.getElementById('guided-dropzone');
    
    [optWrong, optCorrect].forEach(opt => {
        opt.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);
            setTimeout(() => e.target.classList.add('opacity-50'), 0);
            sounds.pop();
        });
        opt.addEventListener('dragend', (e) => {
            e.target.classList.remove('opacity-50');
        });
    });

    // Setup Dropzone
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.replace('bg-blue-50', 'bg-blue-100');
        dropzone.classList.replace('border-blue-300', 'border-blue-500');
    });

    dropzone.addEventListener('dragleave', (e) => {
        dropzone.classList.replace('bg-blue-100', 'bg-blue-50');
        dropzone.classList.replace('border-blue-500', 'border-blue-300');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        if(guidedCompleted) return;
        
        dropzone.classList.replace('bg-blue-100', 'bg-blue-50');
        dropzone.classList.replace('border-blue-500', 'border-blue-300');
        
        const draggedId = e.dataTransfer.getData('text/plain');
        
        if (draggedId === 'guided-opt-correct') {
            sounds.success();
            guidedCompleted = true;
            
            // Visual update
            dropzone.innerHTML = `<div class="bg-green-100 border-2 border-green-500 text-green-900 px-6 py-2 rounded-xl animate-pop w-full shadow-sm text-center">2. The Details & Story (Meat)</div>`;
            dropzone.classList.replace('border-dashed', 'border-solid');
            dropzone.classList.replace('border-blue-300', 'border-transparent');
            dropzone.classList.replace('bg-blue-50', 'bg-transparent');
            
            // Hide options
            document.getElementById('guided-options').classList.add('hidden');
            
            // Show Feedback & Next Button
            const feedback = document.getElementById('guided-feedback');
            feedback.innerHTML = "Perfect! The meat of the story goes in the middle! ✔️";
            feedback.className = "mt-6 p-4 rounded-2xl bg-green-100 border-2 border-green-400 text-green-800 font-bold text-center text-lg animate-pop w-full max-w-md";
            feedback.classList.remove('hidden');
            
            document.getElementById('btn-start-game').classList.remove('hidden');
            updateXP(100);
            
        } else if (draggedId === 'guided-opt-wrong') {
            sounds.error();
            state.guidedMistakes++;
            // Shake dropzone
            dropzone.classList.remove('shake');
            void dropzone.offsetWidth;
            dropzone.classList.add('shake');
            showToast("Oops! A presentation shouldn't have two Title slides.", "error");
        }
    });
}
