export class PlanetRenderer {
    constructor(ctx, camera) {
        this.ctx = ctx;
        this.camera = camera;
    }

    render(universe, deltaTime = 0.016) {
        for (const sys of universe.getAllStarSystems()) {
            const star = sys.star;
            const starScreen = this.camera.worldToScreen(star.x, star.y);

            for (const planet of sys.planets) {
                // Update orbit angle
                planet.orbitAngle += planet.orbitSpeed * deltaTime;

                // Planet position relative to star
                const px = star.x + Math.cos(planet.orbitAngle) * planet.orbitRadius;
                const py = star.y + Math.sin(planet.orbitAngle) * planet.orbitRadius;

                // Convert to screen coordinates
                const screen = this.camera.worldToScreen(px, py);

                // Draw orbit line
                this.ctx.strokeStyle = 'rgba(255,255,255,0.05)';
                this.ctx.beginPath();
                this.ctx.arc(starScreen.x, starScreen.y, planet.orbitRadius * this.camera.zoom, 0, Math.PI * 2);
                this.ctx.stroke();

                // Planet color
                let color = 'gray';
                if (planet.type === 'gas') color = 'orange';
                if (planet.type === 'ice') color = 'lightblue';

                // Planet size relative to star
                const size = Math.max(1, star.size * 0.3);

                this.ctx.fillStyle = color;
                this.ctx.beginPath();
                this.ctx.arc(screen.x, screen.y, size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }
}
