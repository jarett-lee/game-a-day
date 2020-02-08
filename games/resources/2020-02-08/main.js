"use strict";
console.log('reload', Math.random());
class Enemy {
    constructor(prototype, coordinate) {
        this.coordinate = coordinate;
        this.prototype = prototype;
        this.health = prototype.health;
    }
    get x() { return this.coordinate.x; }
    set x(val) { this.coordinate.x = val; }
    get y() { return this.coordinate.y; }
    set y(val) { this.coordinate.y = val; }
    get initialHealth() { return this.prototype.health; }
}
window.onload = function () {
    // Get html elements
    // =================
    function getObjectWithExpectedType(fn, expectedTypeConstructor) {
        const unsafeObject = fn();
        if (unsafeObject === null)
            throw new Error('Found null instead of object with expected type');
        if (!(unsafeObject instanceof expectedTypeConstructor))
            throw new Error('Found object with unexpected type');
        return unsafeObject;
    }
    const canvas = getObjectWithExpectedType(() => document.getElementById('canvas'), HTMLCanvasElement);
    const ctx = getObjectWithExpectedType(() => canvas.getContext('2d'), CanvasRenderingContext2D);
    ctx.translate(0.5, 0.5);
    // Define game logic
    // =================
    // enemy combat
    //    health
    // enemy movement
    //    coordinate
    //    destination
    //    get next destination
    // create path
    const path = [
        { x: 0, y: 0 },
        { x: 500, y: 400 },
    ];
    const enemies = [];
    const towers = [];
    const projectiles = [];
    function createEnemy(enemy) {
        enemies.push(enemy);
        return enemy;
    }
    function createTower(tower) {
        towers.push(tower);
        return tower;
    }
    function createProjectile(projectile) {
        projectiles.push(projectile);
        return projectile;
    }
    let start;
    function step(timestamp) {
        if (!start)
            start = timestamp;
        update(timestamp);
        draw();
        window.requestAnimationFrame(step);
    }
    function findClosestEnemy(origin) {
        return enemies.length > 0 ? enemies.map(enemy => ({
            distance: Math.abs(enemy.x - origin.x) + Math.abs(enemy.y - origin.y),
            enemy: enemy,
        })).reduce((prev, cur) => {
            if (cur.distance < prev.distance) {
                return cur;
            }
            return prev;
        }).enemy : undefined;
    }
    function update(timestamp) {
        // towers shoot projectiles at enemies
        for (const tower of towers) {
            if (tower.nextShootTime < timestamp) {
                tower.nextShootTime = timestamp + tower.shootCooldownMs;
                const target = findClosestEnemy(tower);
                if (target) {
                    createProjectile({
                        origin: tower,
                        target,
                        removalTime: timestamp + 200,
                    });
                    target.health -= tower.damage;
                }
            }
        }
        // TODO create enemies at start of path
        // TODO move enemies
        // check if enemies are alive
        const filteredEnemies = enemies.filter((enemy) => enemy.health > 0);
        enemies.length = filteredEnemies.length;
        for (let i = 0; i < filteredEnemies.length; i++) {
            enemies[i] = filteredEnemies[i];
        }
        // TODO remove enemies at end of path
        // remove old projectiles
        const filteredProjectiles = projectiles.filter((p) => p.removalTime > timestamp);
        projectiles.length = filteredProjectiles.length;
        for (let i = 0; i < filteredProjectiles.length; i++) {
            projectiles[i] = filteredProjectiles[i];
        }
    }
    function draw() {
        clear();
        // draw path
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
        // draw towers
        for (const tower of towers) {
            const size = 20;
            const x = tower.x - size / 2;
            const y = tower.y - size / 2;
            ctx.fillRect(x, y, size, size);
            ctx.strokeRect(x, y, size, size);
        }
        // draw enemy
        for (const enemy of enemies) {
            const size = 10;
            const x = enemy.x - size / 2;
            const y = enemy.y - size / 2;
            // draw enemy body
            ctx.save();
            ctx.fillRect(x, y, size, size);
            ctx.strokeRect(x, y, size, size);
            ctx.restore();
            // draw enemy health bar
            if (enemy.health != enemy.initialHealth) {
                const healthYOffset = size / 2 + 2;
                const healthHeight = 3;
                const healthFill = size * enemy.health / enemy.initialHealth;
                ctx.save();
                ctx.fillStyle = 'red';
                ctx.fillRect(x, y - healthYOffset, healthFill, healthHeight);
                ctx.strokeStyle = 'black';
                ctx.strokeRect(x, y - healthYOffset, size, healthHeight);
                ctx.restore();
            }
        }
        // draw projectiles
        for (const p of projectiles) {
            ctx.beginPath();
            ctx.moveTo(p.origin.x, p.origin.y);
            ctx.lineTo(p.target.x, p.target.y);
            ctx.stroke();
        }
    }
    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    // Start the game
    // ==============
    // create enemies
    const enemyPrototype = {
        health: 100,
    };
    createEnemy(new Enemy(enemyPrototype, { x: 30, y: 30 }));
    createEnemy(new Enemy(enemyPrototype, { x: 200, y: 200 }));
    // create towers
    createTower({
        x: 50,
        y: 50,
        shootCooldownMs: 1000,
        nextShootTime: 0,
        damage: 5,
    });
    createTower({
        x: 250,
        y: 200,
        shootCooldownMs: 1000,
        nextShootTime: 0,
        damage: 5,
    });
    // start the game
    window.requestAnimationFrame(step);
};
//# sourceMappingURL=main.js.map