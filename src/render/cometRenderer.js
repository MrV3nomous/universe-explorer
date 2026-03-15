export class CometRenderer {
    constructor(ctx, camera, particleRenderer) {
        this.ctx = ctx;
        this.camera = camera;
        this.particles = particleRenderer;
    }

    render(comets, deltaTime = 0.016) {
        for (const c of comets) {
            const parallax = Math.max(0.5, 1 / (1 + c.z * 2));
            const screenX = (c.x - this.camera.x) * this.camera.zoom * parallax + this.camera.width / 2;
            const screenY = (c.y - this.camera.y) * this.camera.zoom * parallax + this.camera.height / 2;

            if (!c.trail) c.trail = [];
            c.trail.push({ x: c.x, y: c.y });
            if (c.trail.length > 60) c.trail.shift();

            for (let i = 0; i < c.trail.length; i++) {
                const pos = c.trail[i];
                const trailX = (pos.x - this.camera.x) * this.camera.zoom * parallax + this.camera.width / 2;
                const trailY = (pos.y - this.camera.y) * this.camera.zoom * parallax + this.camera.height / 2;
                const alpha = (i / c.trail.length) * 0.5;
                const radius = Math.max(0.3, c.size * 0.3);

                this.ctx.fillStyle = `rgba(180,220,255,${alpha})`;
                this.ctx.beginPath();
                this.ctx.arc(trailX, trailY, radius, 0, Math.PI * 2);
                this.ctx.fill();
            }

            const headSize = Math.max(1, c.size);
            this.ctx.fillStyle = c.color;
            this.ctx.beginPath();
            this.ctx.arc(screenX, screenY, headSize, 0, Math.PI * 2);
            this.ctx.fill();

            if (c.collided) {
                this.particles.spawnExplosion(c.x, c.y, 'lightblue', 50, 100);
                c.collided = false;
            }
        }
    }
}
