import { Camera } from './src/engine/camera.js';
import { Input } from './src/engine/input.js';
import { GameLoop } from './src/engine/gameLoop.js';
import { Universe } from './src/world/universe.js';
import { StarRenderer } from './src/render/starRenderer.js';
import { PlanetRenderer } from './src/render/planetRenderer.js';
import { NebulaRenderer } from './src/render/nebulaRenderer.js';
import { AsteroidRenderer } from './src/render/asteroidRenderer.js';
import { MeteorRenderer } from './src/render/meteorRenderer.js';
import { CometRenderer } from './src/render/cometRenderer.js';
import { DebrisRenderer } from './src/render/debrisRenderer.js';
import { ParticleRenderer } from './src/render/particleRenderer.js';


const canvas = document.getElementById('universeCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');


const camera = new Camera(canvas.width, canvas.height);
const input = new Input(canvas, camera);

const particleRenderer = new ParticleRenderer(ctx, camera);

const universe = new Universe(particleRenderer);

// Renderers
const starRenderer = new StarRenderer(ctx, camera);
const planetRenderer = new PlanetRenderer(ctx, camera);
const nebulaRenderer = new NebulaRenderer(ctx, camera);
const asteroidRenderer = new AsteroidRenderer(ctx, camera);
const meteorRenderer = new MeteorRenderer(ctx, camera);
const cometRenderer = new CometRenderer(ctx, camera);
const debrisRenderer = new DebrisRenderer(ctx, camera);

// Generate initial sectors
universe.regenerateNear(camera.x, camera.y);

// Game loop
function update(deltaTime) {
    camera.update(input, deltaTime);

    // Only regenerate sectors if camera moved
    universe.regenerateNear(camera.x, camera.y);

    // Update universe (moving objects + collisions)
    universe.update(deltaTime);

    // Update particles (explosions, dust, trails)
    particleRenderer.update(deltaTime);
}

function render(deltaTime) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Background & static
    nebulaRenderer.render(universe.getAllNebulas(), deltaTime);
    starRenderer.render(universe.getAllStarSystems().map(s => s.star), deltaTime);
    planetRenderer.render(universe, deltaTime);

    // Dynamic objects
    asteroidRenderer.render(universe.getAllAsteroids(), deltaTime);
    debrisRenderer.render(universe.getAllDebris(), deltaTime);
    meteorRenderer.render(universe.getAllMeteors(), deltaTime);
    cometRenderer.render(universe.getAllComets(), deltaTime);

    // Particles on top
    particleRenderer.render(deltaTime);
}

// Start loop
const loop = new GameLoop(update, render);
loop.start();

// Handle resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    camera.resize(canvas.width, canvas.height);
});
