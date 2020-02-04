"use strict";
window.onload = function () {
    // Get html elements
    // =================
    // Get the canvas and verify it exists
    const canvUnsafe = document.getElementById('canv');
    if (!canvUnsafe)
        throw new Error('Unexpected null or undefined value');
    if (!(canvUnsafe instanceof HTMLCanvasElement))
        throw new Error('Unexpected type');
    const canv = canvUnsafe;
    // Get the canvas 2d context and verify it exists
    const ctxUnsafe = canv.getContext('2d');
    if (!ctxUnsafe)
        throw new Error('Unexpected null or undefined value');
    if (!(ctxUnsafe instanceof CanvasRenderingContext2D))
        throw new Error('Unexpected type');
    const ctx = ctxUnsafe;
    // Define game logic
    // =================
    const enemies = [];
    const towers = [];
    function createEnemy(enemy) {
        enemies.push(enemy);
        return enemy;
    }
    function createTower(tower) {
        towers.push(tower);
        return tower;
    }
    let start;
    function step(timestamp) {
        if (!start)
            start = timestamp;
        update();
        draw();
        window.requestAnimationFrame(step);
    }
    function update() {
        // towers shoot (instant) projectiles at enemies
        // check if enemies are alive
    }
    function draw() {
        clear();
        // draw towers
        for (const tower of towers) {
            const size = 20;
            const x = tower.x - size / 2;
            const y = tower.y - size / 2;
            ctx.fillRect(x, y, size, size);
        }
        // draw enemy
        for (const enemy of enemies) {
            const size = 10;
            const x = enemy.x - size / 2;
            const y = enemy.y - size / 2;
            // draw enemy body
            ctx.fillRect(x, y, size, size);
        }
        // draw projectiles
    }
    function clear() {
        ctx.clearRect(0, 0, canv.width, canv.height);
    }
    // Start the game
    // ==============
    // Create enemies
    createEnemy({
        x: 10,
        y: 10,
    });
    // Create towers
    createTower({
        x: 40,
        y: 40,
    });
    // Start the game
    window.requestAnimationFrame(step);
};
//# sourceMappingURL=main.js.map