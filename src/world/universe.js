import { Sector } from './sector.js';

export class Universe {
    constructor(particleRenderer) {
        this.sectors = new Map(); 
        this.particleRenderer = particleRenderer;
        this.lastCameraSectorX = null;
        this.lastCameraSectorY = null;
    }

    regenerateNear(cameraX, cameraY) {
        const sectorSize = 2000;
        const currentSectorX = Math.floor(cameraX / sectorSize);
        const currentSectorY = Math.floor(cameraY / sectorSize);

     
        if (currentSectorX === this.lastCameraSectorX && currentSectorY === this.lastCameraSectorY) return;
        this.lastCameraSectorX = currentSectorX;
        this.lastCameraSectorY = currentSectorY;

        const range = 3;
        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {
                const sx = (currentSectorX + dx) * sectorSize;
                const sy = (currentSectorY + dy) * sectorSize;
                const key = `${sx}_${sy}`;

                if (this.sectors.has(key)) continue;

                const sector = new Sector(sx, sy);
                sector.generate();

                if (sector.getAllStarSystems().length === 0) {
                    sector.addDebugStar(sx + sectorSize / 2, sy + sectorSize / 2);
                }

                // Nebulas
                for (let i = 0; i < Math.floor(Math.random() * 2); i++) {
                    sector.nebulas.push({
                        x: sx + Math.random() * sectorSize,
                        y: sy + Math.random() * sectorSize,
                        z: Math.random() * 2,
                        size: 300 + Math.random() * 400,
                        r: 100 + Math.random() * 155,
                        g: 50 + Math.random() * 150,
                        b: 150 + Math.random() * 100,
                        alpha: 0.02 + Math.random() * 0.08
                    });
                }

                // Asteroids
                sector.asteroids = [];
                for (let i = 0; i < Math.floor(Math.random() * 5) + 3; i++) {
                    sector.asteroids.push({
                        x: sx + Math.random() * sectorSize,
                        y: sy + Math.random() * sectorSize,
                        z: Math.random() * 2,
                        size: 1 + Math.random() * 3,
                        sides: 5 + Math.floor(Math.random() * 4),
                        angle: Math.random() * Math.PI * 2,
                        spinSpeed: (Math.random() - 0.5),
                        color: 'gray',
                        vx: (Math.random() - 0.5) * 50,
                        vy: (Math.random() - 0.5) * 50,
                        trail: []
                    });
                }

                // Debris
                sector.debris = [];
                for (let i = 0; i < Math.floor(Math.random() * 8) + 5; i++) {
                    sector.debris.push({
                        x: sx + Math.random() * sectorSize,
                        y: sy + Math.random() * sectorSize,
                        z: Math.random() * 2,
                        size: 2 + Math.random() * 3,
                        color: 'lightgray',
                        vx: (Math.random() - 0.5) * 20,
                        vy: (Math.random() - 0.5) * 20,
                        trail: []
                    });
                }

                // Meteors 
                sector.meteors = [];
                if (Math.random() < 0.3) {
                    for (let i = 0; i < 1 + Math.floor(Math.random() * 2); i++) {
                        sector.meteors.push({
                            x: sx + Math.random() * sectorSize,
                            y: sy + Math.random() * sectorSize,
                            z: Math.random() * 2,
                            size: 1 + Math.random(),
                            color: 'orange',
                            vx: (Math.random() - 0.5) * 200,
                            vy: (Math.random() - 0.5) * 200,
                            trail: []
                        });
                    }
                }

                // Comets 
                sector.comets = [];
                if (Math.random() < 0.2) {
                    sector.comets.push({
                        x: sx + Math.random() * sectorSize,
                        y: sy + Math.random() * sectorSize,
                        z: Math.random() * 2,
                        size: 1 + Math.random(),
                        color: 'lightblue',
                        vx: (Math.random() - 0.5) * 150,
                        vy: (Math.random() - 0.5) * 150,
                        trail: []
                    });
                }

                this.sectors.set(key, sector);
            }
        }
    }

    // Aggregators
    getAllStarSystems() { return Array.from(this.sectors.values()).flatMap(s => s.getAllStarSystems()); }
    getAllNebulas() { return Array.from(this.sectors.values()).flatMap(s => s.getAllNebulas()); }
    getAllAsteroids() { return Array.from(this.sectors.values()).flatMap(s => s.asteroids || []); }
    getAllDebris() { return Array.from(this.sectors.values()).flatMap(s => s.debris || []); }
    getAllMeteors() { return Array.from(this.sectors.values()).flatMap(s => s.meteors || []); }
    getAllComets() { return Array.from(this.sectors.values()).flatMap(s => s.comets || []); }

    getClosestStar(x, y) {
        const stars = this.getAllStarSystems().map(s => s.star).filter(s => s);
        if (!stars.length) return null;
        let closest = stars[0];
        let minDist = (closest.x - x) ** 2 + (closest.y - y) ** 2;
        for (const s of stars) {
            if (!s) continue;
            const dist = (s.x - x) ** 2 + (s.y - y) ** 2;
            if (dist < minDist) { minDist = dist; closest = s; }
        }
        return closest;
    }

    update(deltaTime) {
        for (const sector of this.sectors.values()) {
            // Update asteroids & debris 
            for (const a of sector.asteroids || []) {
                a.x += a.vx * deltaTime;
                a.y += a.vy * deltaTime;
                if (!a.trail) a.trail = [];
                a.trail.push({ x: a.x, y: a.y });
                if (a.trail.length > 10) a.trail.shift();
            }
            for (const d of sector.debris || []) {
                d.x += d.vx * deltaTime;
                d.y += d.vy * deltaTime;
                if (!d.trail) d.trail = [];
                d.trail.push({ x: d.x, y: d.y });
                if (d.trail.length > 10) d.trail.shift();
            }

            // Update meteors & comets
            const collidables = [...(sector.meteors || []), ...(sector.comets || [])];
            for (const obj of collidables) {
                obj.x += obj.vx * deltaTime;
                obj.y += obj.vy * deltaTime;
                if (!obj.trail) obj.trail = [];
                obj.trail.push({ x: obj.x, y: obj.y });
                const maxTrail = obj.color === 'lightblue' ? 20 : 15;
                if (obj.trail.length > maxTrail) obj.trail.shift();
            }

            // Collision detection
            for (let i = 0; i < collidables.length; i++) {
                const a = collidables[i];
                for (let j = i + 1; j < collidables.length; j++) {
                    const b = collidables[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    const minDist = (a.size || 2) + (b.size || 2);
                    if (dist < minDist && this.particleRenderer) {
                        this.particleRenderer.spawnExplosion(
                            (a.x + b.x)/2,
                            (a.y + b.y)/2,
                            'orange',
                            15,
                            50
                        );
                        // Simple bounce
                        const tmpVx = a.vx, tmpVy = a.vy;
                        a.vx = b.vx; a.vy = b.vy;
                        b.vx = tmpVx; b.vy = tmpVy;
                        const overlap = minDist - dist + 0.5;
                        const angle = Math.atan2(dy, dx);
                        a.x += Math.cos(angle)*(overlap/2);
                        a.y += Math.sin(angle)*(overlap/2);
                        b.x -= Math.cos(angle)*(overlap/2);
                        b.y -= Math.sin(angle)*(overlap/2);
                    }
                }
            }

            // Update star systems
            for (const s of sector.getAllStarSystems()) s.update(deltaTime);
        }
    }
}
