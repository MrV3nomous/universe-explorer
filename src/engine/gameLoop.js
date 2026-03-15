export class GameLoop {
    constructor(update, render) {
        this.update = update; 
        this.render = render;   
        this.lastTime = 0;
        this.running = false;

        this.loop = this.loop.bind(this);
    }

    start() {
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop);
    }

    stop() {
        this.running = false;
    }

    loop(currentTime) {
        if (!this.running) return;

    
        const deltaTime = (currentTime - this.lastTime) / 1000 || 0.016;
        this.lastTime = currentTime;

        
        if (typeof this.update === 'function') this.update(deltaTime);

        if (typeof this.render === 'function') this.render(deltaTime);

        requestAnimationFrame(this.loop);
    }
}
