"use strict";
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
    const canvas = getObjectWithExpectedType(() => document.getElementById('canv'), HTMLCanvasElement);
    const ctx = getObjectWithExpectedType(() => canvas.getContext('2d'), CanvasRenderingContext2D);
    ctx.translate(0.5, 0.5);
    let debug = true;
    // Define game logic
    // =================
    const entities = [];
    function updateCollisions() {
        for (let i = 0; i < entities.length; i++) {
            const e1 = entities[i];
            for (let j = i + 1; j < entities.length; j++) {
                const e2 = entities[j];
                const b1 = e1.bounds();
                const b2 = e2.bounds();
                if (b1.x2 > b2.x1 && b1.x1 < b2.x2 && b1.y2 > b2.y1 && b1.y1 < b1.y2) {
                    console.warn('The collision code is incomplete and buggy');
                    // @ts-ignore
                    e1.dx = -e1.dx;
                }
            }
        }
    }
    function update(timestamp, delta) {
        entities.forEach(e => e.update(timestamp, delta));
        updateCollisions();
    }
    function draw() {
        clear();
        entities.forEach(e => e.draw());
    }
    function clear() {
        ctx.clearRect(0 - 1, 0 - 1, canvas.width + 1, canvas.height + 1);
    }
    // Start the game
    // ==============
    function drawArrow(fromX, fromY, toX, toY, headLength) {
        var dx = toX - fromX;
        var dy = toY - fromY;
        var angle = Math.atan2(dy, dx);
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
    }
    class Ball {
        constructor(x, y, dx, dy) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
        }
        update(_, delta) {
            this.x += this.dx * delta;
        }
        draw() {
            const { size } = Ball;
            const { x1, y1 } = this.bounds();
            ctx.strokeRect(x1, y1, size, size);
            if (debug) {
                // draw the ball coordinate
                // ctx.save()
                // ctx.fillStyle = 'red';
                // ctx.fillRect(this.x, this.y, 1, 1)
                // ctx.restore()
                // draw the location of the ball in the future
                // TODO how long in the future?
                const futureX = this.x - size / 2 + (this.dx * 1000);
                const futureY = this.y - size / 2 + (this.dy * 1000);
                ctx.save();
                ctx.strokeStyle = 'red';
                ctx.strokeRect(futureX, futureY, size, size);
                ctx.restore();
                // draw the vector arrow
                const toX = this.x + (this.dx * 1000);
                const toY = this.y + (this.dy * 1000);
                drawArrow(this.x, this.y, toX, toY, 5);
            }
        }
        bounds() {
            const { size } = Ball;
            return {
                x1: this.x - Math.floor(size / 2),
                y1: this.y - Math.floor(size / 2),
                x2: this.x - Math.floor(size / 2) + size,
                y2: this.y - Math.floor(size / 2) + size,
            };
        }
    }
    Ball.size = 50;
    class Wall {
        constructor(x1, y1, x2, y2, fx, fy) {
            if (x2 > x1 || y2 > y1) {
                // TODO
            }
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
            this.fx = fx;
            this.fy = fy;
        }
        update(_, delta) { }
        get width() { return this.x2 - this.x1; }
        get height() { return this.y2 - this.y1; }
        draw() {
            ctx.strokeRect(this.x1, this.y1, this.width, this.height);
            if (debug) {
                // draw direction the wall will push the ball if the ball collides with the wall
                const cx = this.x1 + Math.floor(this.width / 2);
                const cy = this.y1 + Math.floor(this.height / 2);
                const toX = cx + (10 * this.fx);
                const toY = cy + (10 * this.fy);
                drawArrow(cx, cy, toX, toY, 5);
            }
        }
        bounds() {
            return {
                x1: this.x1,
                y1: this.y1,
                x2: this.x2,
                y2: this.y2,
            };
        }
    }
    let start;
    let previous;
    function step(timestamp) {
        if (!start) {
            start = timestamp;
            previous = timestamp;
        }
        const delta = timestamp - previous;
        update(timestamp, delta);
        draw();
        previous = timestamp;
        window.requestAnimationFrame(step);
    }
    entities.push(new Ball(50, 100, 0.1, 0));
    entities.push(new Ball(351, 200, 0.1, 0));
    entities.push(new Wall(350, 0, 400, 300, -1, 0));
    // start the game
    window.requestAnimationFrame(step);
};
//# sourceMappingURL=main.js.map