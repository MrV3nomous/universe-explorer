export class Camera {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.zoom = 0.35;
        this.minZoom = 0.01;
        this.maxZoom = 100;
        this.width = width;
        this.height = height;

        this.vx = 0;
        this.vy = 0;
        this.damping = 0.85;

        this.targetX = null;
        this.targetY = null;
        this.targetZoom = null;

        this.manualZooming = false;
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
    }

    update(input, deltaTime) {
        // --- Movement ---
        if (input.isDown('ArrowUp') || input.isDown('w')) this.vy -= 200 * deltaTime;
        if (input.isDown('ArrowDown') || input.isDown('s')) this.vy += 200 * deltaTime;
        if (input.isDown('ArrowLeft') || input.isDown('a')) this.vx -= 200 * deltaTime;
        if (input.isDown('ArrowRight') || input.isDown('d')) this.vx += 200 * deltaTime;

        // Apply inertia
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.vx *= this.damping;
        this.vy *= this.damping;

        // --- Manual zoom ---
        if (input.zoomDelta) {
            const factor = 1 + input.zoomDelta * 0.002;
            this.zoom *= factor;

            this.zoom = Math.max(this.minZoom, Math.min(this.zoom, this.maxZoom));

            this.manualZooming = true;
            this.targetZoom = null;

            input.zoomDelta = 0;
        } else {
            this.manualZooming = false;
        }

        if (this.targetX !== null && this.targetY !== null) {
            this.x += (this.targetX - this.x) * 0.05;
            this.y += (this.targetY - this.y) * 0.05;

            if (Math.abs(this.x - this.targetX) < 1 && Math.abs(this.y - this.targetY) < 1) {
                this.targetX = this.targetY = null;
            }
        }

        
        if (this.targetZoom !== null && !this.manualZooming) {
            this.zoom += (this.targetZoom - this.zoom) * 0.05;

            if (Math.abs(this.zoom - this.targetZoom) < 0.001) {
                this.targetZoom = null;
            }
        }

        
        this.zoom = Math.max(this.minZoom, Math.min(this.zoom, this.maxZoom));
    }

    flyTo(x, y, zoom) {
        this.targetX = x;
        this.targetY = y;
        this.targetZoom = zoom;
        this.manualZooming = false; 
    }

    worldToScreen(wx, wy) {
        return {
            x: (wx - this.x) * this.zoom + this.width / 2,
            y: (wy - this.y) * this.zoom + this.height / 2
        };
    }

    screenToWorld(sx, sy) {
        return {
            x: (sx - this.width / 2) / this.zoom + this.x,
            y: (sy - this.height / 2) / this.zoom + this.y
        };
    }
}
