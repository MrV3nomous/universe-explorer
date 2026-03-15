export class StarSystem {
    constructor(star, planets = []) {
        this.star = star;    
        this.planets = planets;
    }

    static generateRandomStarSystem(x, y, z = 0) {
        const starTypes = ['red', 'yellow', 'blue'];
        const star = {
            x,
            y,
            z,
            size: 5 + Math.random() * 3,
            type: starTypes[Math.floor(Math.random() * starTypes.length)],
            seed: Math.random() * Math.PI * 2
        };

        const planets = [];
        const planetCount = Math.floor(Math.random() * 7) + 1;
        for (let i = 0; i < planetCount; i++) {
            const orbitRadius = 50 + i * 50 + Math.random() * 50;
            const orbitAngle = Math.random() * Math.PI * 2;
            const planetSize = 3 + Math.random() * 2;
            const types = ['rock', 'gas', 'ice'];
            const type = types[Math.floor(Math.random() * types.length)];

            planets.push({
                orbitRadius,
                orbitAngle,
                orbitSpeed: 0.2 / orbitRadius,
                size: planetSize,
                type,
                z: z + Math.random() * 0.2
            });
        }

        return new StarSystem(star, planets);
    }

    update(deltaTime = 0.016) {
        for (const planet of this.planets) {
            planet.orbitAngle += planet.orbitSpeed * deltaTime * 60;
        }
    }
}
