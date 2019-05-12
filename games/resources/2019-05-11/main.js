"use strict";
const canvUnsafe = document.getElementById("canv");
if (!canvUnsafe)
    throw new Error("Unexpected null or undefined value");
if (!(canvUnsafe instanceof HTMLCanvasElement))
    throw new Error("Unexpected type");
const canv = canvUnsafe;
const ctxUnsafe = canv.getContext("2d");
if (!ctxUnsafe)
    throw new Error("Unexpected null or undefined value");
const ctx = ctxUnsafe;
class Block {
    constructor(x, y, initFrame, count) {
        this.x = x;
        this.y = y;
        this.count = count;
        this.x = x;
        this.y = y;
        this.count = Block.BLOCK;
        this.wait = count * Block.BLOCK;
        this.frame =
            this.count + (-(this.count * initFrame) % (this.count + this.wait));
    }
    update() {
        this.frame = (this.frame + 1) % (this.count + this.wait);
    }
    draw() {
        if (this.frame > this.count) {
            drawRect2(this.x, this.y, 0);
        }
        else {
            drawRect2(this.x, this.y, Block.OFFSET * Math.abs(Math.sin((Math.PI * this.frame) / this.count)));
        }
    }
}
Block.OFFSET = 5;
Block.BLOCK = 30;
const SIZE = 40;
const blocks = [];
function init() {
    const l1o = 3;
    const l3o = 6;
    // H
    createRect(l1o + 0, 0, 2, 60 / 30);
    createRect(l1o + 0, 1, 1, 60 / 30);
    createRect(l1o + 0, 2, 2, 60 / 30);
    createRect(l1o + 1, 1, 0, 60 / 30);
    createRect(l1o + 2, 1, 1, 60 / 30);
    createRect(l1o + 2, 0, 2, 60 / 30);
    createRect(l1o + 2, 2, 2, 60 / 30);
    // A
    createRect(l1o + 4, 2, 0, 120 / 30);
    createRect(l1o + 4, 1, 1, 120 / 30);
    createRect(l1o + 5, 0, 2, 120 / 30);
    createRect(l1o + 6, 1, 3, 120 / 30);
    createRect(l1o + 6, 2, 4, 120 / 30);
    // P
    createRect(l1o + 8, 2, 0, 120 / 30);
    createRect(l1o + 8, 1, 1, 120 / 30);
    createRect(l1o + 8, 0, 2, 120 / 30);
    createRect(l1o + 9, 0, 3, 120 / 30);
    createRect(l1o + 9, 1, 4, 120 / 30);
    // P
    createRect(l1o + 3 + 8, 2, 0, 120 / 30);
    createRect(l1o + 3 + 8, 1, 1, 120 / 30);
    createRect(l1o + 3 + 8, 0, 2, 120 / 30);
    createRect(l1o + 3 + 9, 0, 3, 120 / 30);
    createRect(l1o + 3 + 9, 1, 4, 120 / 30);
    // Y
    createRect(l1o + 15, 2, 0, 60 / 30);
    createRect(l1o + 15, 1, 1, 60 / 30);
    createRect(l1o + 14, 0, 2, 60 / 30);
    createRect(l1o + 16, 0, 2, 60 / 30);
    // MOTHERS
    createRect(0, 6, 0, 120 / 30);
    createRect(0, 5, 1, 120 / 30);
    createRect(0, 4, 2, 120 / 30);
    createRect(1, 5, 3, 120 / 30);
    createRect(1, 6, 4, 120 / 30);
    createRect(2, 4, 2, 120 / 30);
    createRect(2, 5, 1, 120 / 30);
    createRect(2, 6, 0, 120 / 30);
    createRect(4, 6, 0, 210 / 30);
    createRect(4, 5, 1, 210 / 30);
    createRect(4, 4, 2, 210 / 30);
    createRect(5, 4, 3, 210 / 30);
    createRect(6, 4, 4, 210 / 30);
    createRect(6, 5, 5, 210 / 30);
    createRect(6, 6, 6, 210 / 30);
    createRect(5, 6, 7, 210 / 30);
    createRect(9, 6, 0, 90 / 30);
    createRect(9, 5, 1, 90 / 30);
    createRect(9, 4, 2, 90 / 30);
    createRect(8, 4, 3, 90 / 30);
    createRect(10, 4, 3, 90 / 30);
    createRect(12, 4, 2, 60 / 30);
    createRect(12, 5, 1, 60 / 30);
    createRect(12, 6, 2, 60 / 30);
    createRect(13, 5, 0, 60 / 30);
    createRect(14, 5, 1, 60 / 30);
    createRect(14, 4, 2, 60 / 30);
    createRect(14, 6, 2, 60 / 30);
    createRect(16, 4, 1, 2);
    createRect(16, 5, 0, 2);
    createRect(16, 6, 1, 2);
    createRect(17, 4, 2, 2);
    createRect(17, 5, 1, 2);
    createRect(17, 6, 2, 2);
    createRect(19, 4, 2, 6);
    createRect(19, 5, 1, 6);
    createRect(19, 6, 0, 6);
    createRect(20, 4, 3, 6);
    createRect(20, 5, 4, 6);
    createRect(20, 6, 6, 6);
    createRect(19, 5, 5, 6);
    createRect(22, 4, 4, 5);
    createRect(22, 5, 3, 5);
    createRect(22, 6, 0, 5);
    createRect(23, 4, 5, 5);
    createRect(23, 5, 2, 5);
    createRect(23, 6, 1, 5);
    // DAY!
    createRect(l3o + 0, 8, 2, 5);
    createRect(l3o + 0, 9, 1, 5);
    createRect(l3o + 0, 10, 0, 5);
    createRect(l3o + 1, 8, 3, 5);
    createRect(l3o + 2, 9, 4, 5);
    createRect(l3o + 1, 10, 5, 5);
    createRect(l3o + 4, 2 + 8, 0, 120 / 30);
    createRect(l3o + 4, 1 + 8, 1, 120 / 30);
    createRect(l3o + 5, 0 + 8, 2, 120 / 30);
    createRect(l3o + 6, 1 + 8, 3, 120 / 30);
    createRect(l3o + 6, 2 + 8, 4, 120 / 30);
    createRect(l3o + 15 - 6, 2 + 8, 0, 60 / 30);
    createRect(l3o + 15 - 6, 1 + 8, 1, 60 / 30);
    createRect(l3o + 14 - 6, 0 + 8, 2, 60 / 30);
    createRect(l3o + 16 - 6, 0 + 8, 2, 60 / 30);
    loop();
}
function loop() {
    update();
    draw();
    window.requestAnimationFrame(loop);
}
function update() {
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].update();
    }
}
function draw() {
    ctx.clearRect(0, 0, canv.width, canv.width);
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].draw();
    }
}
function createRect(x, y, initFrame, count) {
    blocks.push(new Block(x, y, initFrame, count));
}
function drawRect(x, y) {
    ctx.beginPath();
    ctx.rect(x * SIZE + 0.5, y * SIZE + 0.5, SIZE, SIZE);
    ctx.stroke();
}
function drawRect2(x, y, offset) {
    ctx.beginPath();
    ctx.rect(x * SIZE + 0.5 + offset / 2, y * SIZE + 0.5 + offset / 2, SIZE - offset, SIZE - offset);
    ctx.stroke();
}
init();
//# sourceMappingURL=main.js.map