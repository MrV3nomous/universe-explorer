export class DebrisRenderer {
    constructor(ctx, camera) {
        this.ctx = ctx;
        this.camera = camera;
    }

    render(debrisList, deltaTime = 0.016) {
        for (const d of debrisList) {
            const parallax = Math.max(0.5, 1 / (1 + d.z * 2));
            const screenX = (d.x - this.camera.x) * this.camera.zoom * parallax + this.camera.width / 2;
            const screenY = (d.y - this.camera.y) * this.camera.zoom * parallax + this.camera.height / 2;

            this.ctx.fillStyle = d.color || 'lightgray';
            this.ctx.beginPath();
            this.ctx.arc(screenX, screenY, (d.size || 2) * this.camera.zoom, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
}
