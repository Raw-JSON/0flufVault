// app.js

const gallery = document.getElementById('gallery');
const overlay = document.getElementById('fullscreen-overlay');
const mainCanvas = document.getElementById('mainCanvas');
const ctx = mainCanvas.getContext('2d');
let currentStyleName = "wallpaper"; // For filename

// --- CONFIGURATION ---
// Pattern types: 'circles', 'lines', 'noise-only', 'mesh'
const styles = [
    // Originals
    { name: "Cyber Sunset", type: "circles", colors: ["#ff007f", "#7000ff", "#00f2ff"] },
    { name: "Deep Moss", type: "noise-only", colors: ["#1a2e1a", "#3d5a3d", "#0a0f0a"] },
    { name: "Peach Fuzz", type: "circles", colors: ["#ffbe94", "#f6d5f7", "#fdfcfb"] },
    
    // New Additions
    { name: "Obsidian", type: "lines", colors: ["#000000", "#1c1c1c", "#333333"] },
    { name: "Vaporwave", type: "mesh", colors: ["#ff71ce", "#01cdfe", "#05ffa1"] },
    { name: "Crimson Tide", type: "noise-only", colors: ["#450a0a", "#7f1d1d", "#000000"] },
    { name: "Nordic Mist", type: "circles", colors: ["#d1d5db", "#9ca3af", "#4b5563"] },
    { name: "Golden Hour", type: "lines", colors: ["#f59e0b", "#ef4444", "#78350f"] },
    { name: "Ethereal Blue", type: "mesh", colors: ["#60a5fa", "#2563eb", "#1e3a8a"] },
    { name: "Royal Velvet", type: "circles", colors: ["#240046", "#3c096c", "#5a189a"] },
    { name: "Slate & Ash", type: "lines", colors: ["#334155", "#475569", "#0f172a"] },
    { name: "Mint Tea", type: "noise-only", colors: ["#d1fae5", "#6ee7b7", "#064e3b"] },
    { name: "Neon Night", type: "mesh", colors: ["#111827", "#8b5cf6", "#ec4899"] },
    { name: "Sahara", type: "lines", colors: ["#d97706", "#92400e", "#78350f"] }
];

// --- GENERATION LOGIC ---

function generateWallpaper(style, targetCanvas, width = 1440, height = 2560) {
    targetCanvas.width = width;
    targetCanvas.height = height;
    const rc = targetCanvas.getContext('2d');

    // 1. Base Gradient
    const grad = rc.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, style.colors[0]);
    grad.addColorStop(0.5, style.colors[1]);
    grad.addColorStop(1, style.colors[2]);
    rc.fillStyle = grad;
    rc.fillRect(0, 0, width, height);

    // 2. Pattern Generation
    rc.globalAlpha = 0.1;
    rc.strokeStyle = 'white';
    
    if (style.type === 'circles') {
        for(let i=0; i<5; i++) {
            rc.beginPath();
            rc.arc(Math.random()*width, Math.random()*height, Math.random()*600 + 100, 0, Math.PI*2);
            rc.fillStyle = 'rgba(255,255,255,0.05)';
            rc.fill();
        }
    } 
    else if (style.type === 'lines') {
        rc.lineWidth = 2;
        for(let i=0; i<20; i++) {
            rc.beginPath();
            rc.moveTo(0, Math.random()*height);
            rc.lineTo(width, Math.random()*height);
            rc.stroke();
        }
    }
    else if (style.type === 'mesh') {
        rc.lineWidth = 1;
        rc.globalAlpha = 0.15;
        for(let i=0; i<15; i++) {
            rc.beginPath();
            let x = Math.random() * width;
            let y = Math.random() * height;
            rc.moveTo(x, y);
            rc.lineTo(x + Math.random()*400 - 200, y + Math.random()*400 - 200);
            rc.stroke();
        }
    }

    // 3. Global Noise (Grain)
    generateNoise(rc, width, height);
}

function generateNoise(ctx, w, h) {
    ctx.globalAlpha = 0.05;
    const iData = ctx.getImageData(0,0,w,h);
    // Direct pixel manipulation for performance
    const buffer = new Uint32Array(iData.data.buffer);
    const len = buffer.length;
    
    for (let i = 0; i < len; i++) {
        if (Math.random() < 0.5) {
            // Add slight white noise
            // 0xFFFFFFFF is white in ABGR (Little Endian)
            // We use bitwise OR to keep alpha maxed, but here we just want random pixels
            // A simpler approach for canvas overlay:
        }
    }
    // Canvas API fallback for simplicity/compatibility over raw buffer manipulation
    for(let i=0; i<3000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
        ctx.fillRect(Math.random()*w, Math.random()*h, 2, 2);
    }
    ctx.globalAlpha = 1.0;
}

// --- INTERACTION LOGIC ---

function openFullscreen(style) {
    currentStyleName = style.name.replace(/\s+/g, '_').toLowerCase();
    // Generate High Res for Preview/Download
    generateWallpaper(style, mainCanvas, 1440, 2560);
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeFullscreen() {
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function downloadWallpaper() {
    // Convert canvas to data URL
    const imageURI = mainCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    
    // Create temporary link
    const link = document.createElement('a');
    link.download = `0fluf_${currentStyleName}_${Date.now()}.png`;
    link.href = imageURI;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// --- INIT ---

function initGallery() {
    styles.forEach(style => {
        const card = document.createElement('div');
        card.className = "wallpaper-card bg-neutral-900 rounded-2xl border border-white/5 group";
        
        // Thumbnail Canvas
        const thumbCanvas = document.createElement('canvas');
        thumbCanvas.className = "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110";
        // Generate low-res thumbnail
        generateWallpaper(style, thumbCanvas, 360, 640);
        
        // Label
        const label = document.createElement('div');
        label.className = "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent pt-10";
        label.innerHTML = `
            <p class="text-xs font-bold uppercase tracking-widest text-white/90">${style.name}</p>
            <p class="text-[10px] text-gray-400 uppercase tracking-wide">${style.type}</p>
        `;
        
        card.appendChild(thumbCanvas);
        card.appendChild(label);
        card.onclick = () => openFullscreen(style);
        gallery.appendChild(card);
    });
}

// Run
document.addEventListener('DOMContentLoaded', initGallery);

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeFullscreen();
});
