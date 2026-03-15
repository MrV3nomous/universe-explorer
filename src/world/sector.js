import { StarSystem } from './starSystem.js';

export class Sector {
    constructor(sectorX, sectorY, sectorZ = 0, size = 2000) {
        this.sectorX = sectorX;
        this.sectorY = sectorY;
        this.sectorZ = sectorZ;
        this.size = size;
        this.starSystems = [];
        this.nebulas = [];
        this.generated = false;
    }

    generate() {
        if (this.generated) return;
        this.generated = true;

        const starCount = Math.floor(Math.random() * 3 + 1);
        for (let i = 0; i < starCount; i++) {
            const offsetX = this.sectorX + i * 1000 + (Math.random() - 0.5) * 500;
            const offsetY = this.sectorY + i * 1000 + (Math.random() - 0.5) * 500;
            const offsetZ = this.sectorZ + i * 0.5 + Math.random() * 0.5;

            const system = StarSystem.generateRandomStarSystem(offsetX, offsetY, offsetZ);
            this.starSystems.push(system);
        }

        const nebCount = Math.floor(Math.random() * 3);
        for (let i = 0; i < nebCount; i++) {
            this.nebulas.push({
                x: this.sectorX + Math.random() * this.size - this.size / 2,
                y: this.sectorY + Math.random() * this.size - this.size / 2,
                z: Math.random() * 2,
                size: Math.random() * 200 + 50,
                r: 100 + Math.random() * 155,
                g: 50 + Math.random() * 150,
                b: 150 + Math.random() * 100,
                alpha: 0.05 + Math.random() * 0.1
            });
        }
    }

    getAllStarSystems() {
        return this.starSystems;
    }

    getAllNebulas() {
        return this.nebulas;
    }

    
    addDebugStar(x, y) {
        const star = {
            x,
            y,
            z: 0,
            size: 5,
            type: 'yellow',
            seed: Math.random()
        };
        const planet = {
            orbitRadius: 80,
            orbitAngle: 0,
            orbitSpeed: 0.5,
            size: 5,
            type: 'gas',
            z: 0
        };
        this.starSystems.push(new StarSystem(star, [planet]));
    }
}
