
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
interface Tower extends Pos {
  shootCooldownMs: number,
  nextShootTime: number,
  damage: number,
}
interface Projectile {
  origin: Pos,
  target: Pos,
  removalTime: number,
}


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
  const projectiles: Projectile[] = []

  function createEnemy(enemy: Enemy) {
    enemies.push(enemy);
    return enemy;
  }

  function createTower(tower: Tower) {
    towers.push(tower);
    return tower;
  }

  function createProjectile(projectile: Projectile) {
    projectiles.push(projectile)
    return projectile
  }

  let start: number;
  function step(timestamp: number) {
    if (!start) start = timestamp;

    update(timestamp)
    draw()
    window.requestAnimationFrame(step)
  }

  function findClosestEnemy(origin: Pos) {
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

  function update(timestamp: number) {
    // towers shoot projectiles at enemies
    for (const tower of towers) {
      if (tower.nextShootTime < timestamp) {
        tower.nextShootTime = timestamp + tower.shootCooldownMs
        const target = findClosestEnemy(tower)
        if (target) {
          createProjectile({
            origin: tower,
            target,
            removalTime: timestamp + 200,
          })
          target.health -= tower.damage
        }
      }
    }

    // check if enemies are alive
    const filteredEnemies = enemies.filter((enemy) => enemy.health > 0)
    enemies.length = filteredEnemies.length
    for (let i=0; i<filteredEnemies.length; i++) {
      enemies[i] = filteredEnemies[i];
    }

    // remove old projectiles
    const filteredProjectiles = projectiles.filter((p) => p.removalTime > timestamp)
    projectiles.length = filteredProjectiles.length
    for (let i=0; i<filteredProjectiles.length; i++) {
      projectiles[i] = filteredProjectiles[i];
    }
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
    for (const p of projectiles) {
      ctx.beginPath()
      ctx.moveTo(p.origin.x, p.origin.y)
      ctx.lineTo(p.target.x, p.target.y)
      ctx.stroke()
    }
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
  createEnemy({
    x: 200,
    y: 200,
    initialHealth: 100,
    health: 200,
  })

  // Create towers
  createTower({
    x: 50,
    y: 50,
    shootCooldownMs: 1000,
    nextShootTime: 0,
    damage: 5,
  })
  createTower({
    x: 250,
    y: 200,
    shootCooldownMs: 1000,
    nextShootTime: 0,
    damage: 5,
  })

  // Start the game
  window.requestAnimationFrame(step)
}
