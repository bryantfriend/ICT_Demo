// CONFETTI ENGINE
function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#a855f7'];

    for(let i=0; i<100; i++) {
        pieces.push({
            x: canvas.width / 2, // explode from center
            y: canvas.height / 2,
            w: Math.random() * 10 + 5,
            h: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            vy: (Math.random() * 15) - 7.5 - 5, // shoot up
            vx: (Math.random() * 20) - 10,
            r: Math.random() * 360,
            vr: Math.random() * 10 - 5,
            gravity: 0.3
        });
    }

    let animationId;
    function renderConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;
        pieces.forEach(p => {
            p.vy += p.gravity;
            p.y += p.vy;
            p.x += p.vx;
            p.r += p.vr;
            if(p.y < canvas.height) active = true;
            
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.r * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
            ctx.restore();
        });

        if(active) {
            animationId = requestAnimationFrame(renderConfetti);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    renderConfetti();
}

window.addEventListener('resize', () => {
    const canvas = document.getElementById('confetti-canvas');
    if(canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
