export class NebulaRenderer {
    constructor(ctx, camera) {
        this.ctx = ctx;
        this.camera = camera;
        this.time = 0;
    }

    render(nebulas, deltaTime) {
        if (!deltaTime) deltaTime = 0.016;
        this.time += deltaTime;

        nebulas.forEach(neb => {
            const screen = this.camera.worldToScreen(neb.x, neb.y, neb.z);
            const alpha = Math.min(1, Math.max(0, neb.alpha + 0.05 * Math.sin(this.time + neb.z * 10)));

            this.ctx.fillStyle = `rgba(${neb.r},${neb.g},${neb.b},${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(screen.x, screen.y, neb.size * this.camera.zoom, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
}
