const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

document.body.appendChild(canvas);

canvas.style.position = 'fixed'; // Use fixed to ensure it occupies the viewport
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100vw'; // Use viewport width
canvas.style.height = '100vh'; // Use viewport height
canvas.style.zIndex = '-1'; // Lower z-index to behind face
canvas.style.pointerEvents = 'none'; // Allow clicking elements beneath the canvas

let particlesArray = [];
const avatarContainer = document.querySelector('.avatar-container');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
    resizeCanvas();
    init(); // Re-initialize particles on resize to prevent clustering
});

resizeCanvas();

class Particle {
    constructor() {
        // Center determined dynamically in update
        this.baseX = canvas.width / 2;
        this.baseY = canvas.height / 2;
        
        // Varying orbital parameters to simulate planetary motion - ranges increased for wider area
        this.orbitRadiusX = Math.random() * 250 + 100; // Elliptical X radius range expanded
        this.orbitRadiusY = Math.random() * 180 + 80;  // Elliptical Y radius range expanded
        this.angle = Math.random() * Math.PI * 2;   // Start at random angle
        this.speed = Math.random() * 0.005 + 0.001;   // Random orbital speed
        this.particleSize = Math.random() * 2 + 1;   // Random particle visual radius
        this.color = '#00e676'; // Match accent green
        
        // Initial position setup
        this.update();
    }

    update() {
        if (avatarContainer) {
            const rect = avatarContainer.getBoundingClientRect();
            // Calculate center dynamically based on element position (supports scrolling and layout changes)
            this.baseX = rect.left + rect.width / 2;
            this.baseY = rect.top + rect.height / 2;
        } else {
            this.baseX = canvas.width / 2;
            this.baseY = canvas.height / 2;
        }
        
        // Increment angle by speed for orbit
        this.angle += this.speed;
        
        // Apply elliptical mechanics around central point
        this.x = this.baseX + Math.cos(this.angle) * this.orbitRadiusX;
        this.y = this.baseY + Math.sin(this.angle) * this.orbitRadiusY;
    }

    draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // Explicitly draw circle shape using arc
        ctx.arc(this.x, this.y, this.particleSize, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawLines() {
    if (!ctx) return;
    const maxDistance = 150; // Increased to connect over expanded wider area
    for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                const opacity = 1 - (distance / maxDistance);
                ctx.strokeStyle = `rgba(0, 230, 118, ${opacity * 0.5})`; // Line color matches particles with dynamic opacity
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
}

function init() {
    particlesArray = [];
    const particleCount = 20; // Slightly increased particle count for wider expansion
    for (let i = 0; i < particleCount; i++) {
        particlesArray.push(new Particle());
    }
}

function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    drawLines(); // Draw connecting lines
    requestAnimationFrame(animate);
}

init();
animate();