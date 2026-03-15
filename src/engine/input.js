export class Input {
    constructor(canvas, camera) {
        this.canvas = canvas;
        this.camera = camera;

        this.lastX = 0;
        this.lastY = 0;
        this.dragging = false;
        this.PAN_SPEED = 3;

        this.pinchStartDist = null;
        this.keysDown = {};

        this.initEvents();
    }

    initEvents() {
        // Drag
        this.canvas.addEventListener('mousedown', e => this.startDrag(e));
        this.canvas.addEventListener('touchstart', e => this.startDrag(e.touches[0]));

        this.canvas.addEventListener('mousemove', e => this.drag(e));
        this.canvas.addEventListener('touchmove', e => this.drag(e.touches[0]));

        this.canvas.addEventListener('mouseup', e => this.endDrag());
        this.canvas.addEventListener('mouseleave', e => this.endDrag());
        this.canvas.addEventListener('touchend', e => this.endDrag());
        this.canvas.addEventListener('touchcancel', e => this.endDrag());

        // Pinch-to-zoom
        this.canvas.addEventListener('touchmove', e => {
            if (e.touches.length === 2) {
                const dist = this.getPinchDistance(e.touches);
                if (this.pinchStartDist) {
                    const zoomFactor = dist / this.pinchStartDist;
                    this.camera.zoom *= zoomFactor;
                    this.camera.zoom = Math.max(this.camera.minZoom, Math.min(this.camera.zoom, this.camera.maxZoom));
                }
                this.pinchStartDist = dist;
                e.preventDefault();
            } else {
                this.pinchStartDist = null;
            }
        }, { passive: false });

        // Wheel zoom
        this.canvas.addEventListener('wheel', e => {
            e.preventDefault();
            const zoomFactor = 1.1;
            if (e.deltaY < 0) this.camera.zoom *= zoomFactor;
            else this.camera.zoom /= zoomFactor;

            this.camera.zoom = Math.max(this.camera.minZoom, Math.min(this.camera.zoom, this.camera.maxZoom));
        }, { passive: false });

        // Keyboard
        document.addEventListener('keydown', e => this.keysDown[e.key] = true);
        document.addEventListener('keyup', e => this.keysDown[e.key] = false);
    }

    isDown(key) {
        return !!this.keysDown[key];
    }

    startDrag(e) {
        this.dragging = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
    }

    drag(e) {
        if (!this.dragging || e.touches?.length === 2) return;
        const dx = (e.clientX - this.lastX) * this.PAN_SPEED / this.camera.zoom;
        const dy = (e.clientY - this.lastY) * this.PAN_SPEED / this.camera.zoom;
        this.camera.x -= dx;
        this.camera.y -= dy;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
    }

    endDrag() {
        this.dragging = false;
    }

    getPinchDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx*dx + dy*dy);
    }
}
