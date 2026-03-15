export class AsteroidRenderer {
    constructor(ctx, camera, particleRenderer) {
        this.ctx = ctx;
        this.camera = camera;
        this.particles = particleRenderer;
    }

    render(asteroids, deltaTime = 0.016) {
        for (const a of asteroids) {
            a.angle += a.spinSpeed * deltaTime;

            const parallax = Math.max(0.5, 1 / (1 + a.z * 2));
            const screenX = (a.x - this.camera.x) * this.camera.zoom * parallax + this.camera.width / 2;
            const screenY = (a.y - this.camera.y) * this.camera.zoom * parallax + this.camera.height / 2;

            this.ctx.save();
            this.ctx.translate(screenX, screenY);
            this.ctx.rotate(a.angle);
            this.ctx.beginPath();
            for (let i = 0; i < a.sides; i++) {
                const theta = (i / a.sides) * Math.PI * 2;
                const rx = Math.cos(theta) * a.size * this.camera.zoom;
                const ry = Math.sin(theta) * a.size * this.camera.zoom;
                if (i === 0) this.ctx.moveTo(rx, ry);
                else this.ctx.lineTo(rx, ry);
            }
            this.ctx.closePath();
            this.ctx.fillStyle = a.color;
            this.ctx.fill();
            this.ctx.restore();

            if (a.collided) {
                this.particles.spawnExplosion(a.x, a.y, 'gray', 35, 70);
                a.collided = false;
            }
        }
    }
}
