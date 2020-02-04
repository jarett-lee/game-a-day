
// Define interfaces
// =================
interface Pos {
  x: number,
  y: number,
}
interface Enemy extends Pos {
  initialHealth: number,
  health: number,
}
interface Tower extends Pos {}


window.onload = function() {
  // Get html elements
  // =================

  // Get the canvas and verify it exists
  const canvUnsafe = document.getElementById('canv')
  if (!canvUnsafe) throw new Error('Unexpected null or undefined value')
  if (!(canvUnsafe instanceof HTMLCanvasElement)) throw new Error('Unexpected type')
  const canv : HTMLCanvasElement = canvUnsafe

  // Get the canvas 2d context and verify it exists
  const ctxUnsafe = canv.getContext('2d')
  if (!ctxUnsafe) throw new Error('Unexpected null or undefined value')
  if (!(ctxUnsafe instanceof CanvasRenderingContext2D)) throw new Error('Unexpected type')
  const ctx = ctxUnsafe
  ctx.translate(0.5, 0.5)

  // Define game logic
  // =================

  const enemies: Enemy[] = []
  const towers: Tower[] = []

  function createEnemy(enemy: Enemy) {
    enemies.push(enemy);
    return enemy;
  }

  function createTower(tower: Tower) {
    towers.push(tower);
    return tower;
  }

  let start: number;
  function step(timestamp: number) {
    if (!start) start = timestamp;

    update()
    draw()
    window.requestAnimationFrame(step)
  }

  function update() {
    // towers shoot (instant) projectiles at enemies
    // check if enemies are alive
  }

  function draw() {
    clear()

    // draw towers
    for (const tower of towers) {
      const size = 20
      const x = tower.x - size/2
      const y = tower.y - size/2
      ctx.fillRect(x, y, size, size)
      ctx.strokeRect(x, y, size, size)
    }

    // draw enemy
    for (const enemy of enemies) {
      const size = 10
      const x = enemy.x - size/2
      const y = enemy.y - size/2

      // draw enemy body
      ctx.save()
      ctx.fillRect(x, y, size, size)
      ctx.strokeRect(x, y, size, size)
      ctx.restore()

      // draw enemy health bar
      if (enemy.health != enemy.initialHealth) {
        const healthYOffset = size/2 + 2
        const healthHeight = 3
        const healthFill = size * enemy.health / enemy.initialHealth
        ctx.save()
        ctx.fillStyle = 'red'
        ctx.fillRect(x, y-healthYOffset, healthFill, healthHeight)
        ctx.strokeStyle = 'black'
        ctx.strokeRect(x, y-healthYOffset, size, healthHeight)
        ctx.restore()
      }
    }

    // draw projectiles
  }

  function clear() {
    ctx.clearRect(0, 0, canv.width, canv.height)
  }

  // Start the game
  // ==============

  // Create enemies
  createEnemy({
    x: 30,
    y: 30,
    initialHealth: 100,
    health: 50,
  })

  // Create towers
  createTower({
    x: 50,
    y: 50,
  })

  // Start the game
  window.requestAnimationFrame(step)
}
