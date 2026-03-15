export class MeteorRenderer {
    constructor(ctx, camera, particleRenderer) {
        this.ctx = ctx;
        this.camera = camera;
        this.particles = particleRenderer;
    }

    render(meteors, deltaTime = 0.016) {
        for (const m of meteors) {
            const parallax = Math.max(0.5, 1 / (1 + m.z * 2));
            const screenX = (m.x - this.camera.x) * this.camera.zoom * parallax + this.camera.width / 2;
            const screenY = (m.y - this.camera.y) * this.camera.zoom * parallax + this.camera.height / 2;

            if (!m.trail) m.trail = [];
            m.trail.push({ x: m.x, y: m.y });
            if (m.trail.length > 60) m.trail.shift();

            for (let i = 0; i < m.trail.length; i++) {
                const pos = m.trail[i];
                const trailX = (pos.x - this.camera.x) * this.camera.zoom * parallax + this.camera.width / 2;
                const trailY = (pos.y - this.camera.y) * this.camera.zoom * parallax + this.camera.height / 2;
                const alpha = (i / m.trail.length) * 0.6;
                const radius = Math.max(0.3, m.size * 0.3);

                this.ctx.fillStyle = `rgba(255,200,100,${alpha})`;
                this.ctx.beginPath();
                this.ctx.arc(trailX, trailY, radius, 0, Math.PI * 2);
                this.ctx.fill();
            }

            const headSize = Math.max(1, m.size);
            this.ctx.fillStyle = m.color;
            this.ctx.beginPath();
            this.ctx.arc(screenX, screenY, headSize, 0, Math.PI * 2);
            this.ctx.fill();

            if (m.collided) {
                this.particles.spawnExplosion(m.x, m.y, 'orange', 40, 80);
                m.collided = false;
            }
        }
    }
}
