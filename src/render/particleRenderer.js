export class ParticleRenderer {
    constructor(ctx, camera) {
        this.ctx = ctx;
        this.camera = camera;

        this.particles = [];
        this.maxParticles = 700;


        this.ambientDust = [];
        this.initAmbientDust(150);
    }

    // Spawn a particle
    spawnParticle(x, y, color, size, vx, vy, lifetime = 1.0) {
        // Reuse particle if possible
        const deadIndex = this.particles.findIndex(p => p.age >= p.lifetime);
        if (deadIndex >= 0) {
            const p = this.particles[deadIndex];
            Object.assign(p, { x, y, color, size, vx, vy, lifetime, age: 0 });
        } else if (this.particles.length < this.maxParticles) {
            this.particles.push({ x, y, color, size, vx, vy, lifetime, age: 0 });
        }
    }

    // Explosion effect
    spawnExplosion(x, y, color, count = 20, speed = 60) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speedFactor = 3 + Math.random() * speed;
            const vx = Math.cos(angle) * speedFactor;
            const vy = Math.sin(angle) * speedFactor;
            const size = 5 + Math.random() * 2;
            const lifetime = 0.5 + Math.random() * 2;

            this.spawnParticle(x, y, color, size, vx, vy, lifetime);
        }
    }

    // Ambient drifting cosmic dust
    initAmbientDust(count = 100) {
        for (let i = 0; i < count; i++) {
            this.ambientDust.push({
                x: Math.random() * 10000 - 5000,
                y: Math.random() * 10000 - 5000,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                size: 0.3 + Math.random() * 0.8,
                lifetime: 1000,
                age: 0,
                color: 'white'
            });
        }
    }

    // Spawn trail for moving objects
    spawnTrail(obj, color, length = 15) {
        if (!obj.trail) obj.trail = [];
        obj.trail.push({ x: obj.x, y: obj.y });
        if (obj.trail.length > length) obj.trail.shift();
    }

    // Update particles and ambient dust
    update(deltaTime) {
        for (const d of this.ambientDust) {
            d.x += d.vx * deltaTime;
            d.y += d.vy * deltaTime;
        }

        // Update active particles
        for (const p of this.particles) {
            p.x += p.vx * deltaTime;
            p.y += p.vy * deltaTime;
            p.vx *= 0.92;
            p.vy *= 0.92;
            p.age += deltaTime;
        }
    }

    // Render all particles
    render(deltaTime) {
        const { ctx, camera } = this;

        for (const d of this.ambientDust) {
            const sx = (d.x - camera.x) * camera.zoom + camera.width / 2;
            const sy = (d.y - camera.y) * camera.zoom + camera.height / 2;
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.beginPath();
            ctx.arc(sx, sy, d.size * camera.zoom, 0, Math.PI*2);
            ctx.fill();
        }

        for (const p of this.particles) {
            if (p.age >= p.lifetime) continue;

            const sx = (p.x - camera.x) * camera.zoom + camera.width / 2;
            const sy = (p.y - camera.y) * camera.zoom + camera.height / 2;
            const alpha = Math.max(0, 1 - p.age / p.lifetime);
            const radius = Math.max(0.5, p.size * camera.zoom);

            ctx.fillStyle = `rgba(${this.hexToRgb(p.color)},${alpha})`;
            ctx.beginPath();
            ctx.arc(sx, sy, radius, 0, Math.PI*2);
            ctx.fill();
        }
    }

    hexToRgb(color) {
        if (color.startsWith('#')) {
            const bigint = parseInt(color.slice(1),16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return `${r},${g},${b}`;
        }
        const match = color.match(/\d+/g);
        return match ? match.join(',') : '255,255,255';
    }
}
