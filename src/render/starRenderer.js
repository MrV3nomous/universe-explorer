export class StarRenderer {
    constructor(ctx, camera) {
        this.ctx = ctx;
        this.camera = camera;
    }

    render(stars, deltaTime = 0.016) {
        for (const star of stars) {
            const screen = this.camera.worldToScreen(star.x, star.y);


            let color = 'white';
            if (star.type === 'blue') color = 'rgb(100,100,255)';
            if (star.type === 'red') color = 'rgb(255,100,100)';
            if (star.type === 'yellow') color = 'rgb(255,255,100)';

            const flicker = 0.8 + Math.sin(deltaTime * 5 + star.seed) * 0.2;
            this.ctx.fillStyle = this.adjustAlpha(color, flicker);

            const size = Math.max(3, star.size);

            this.ctx.beginPath();
            this.ctx.arc(screen.x, screen.y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    adjustAlpha(rgb, alpha) {
        const vals = rgb.match(/\d+/g);
        return `rgba(${vals[0]},${vals[1]},${vals[2]},${alpha})`;
    }
}
