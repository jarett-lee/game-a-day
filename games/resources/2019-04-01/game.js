
const height = 20
const width = 20
const squareSize = parseInt(600/20)
const screenOffset = 5
let levelIndex
let loadedLevel
let guy

const images = {}
const sprites = {}
let history = []

var canv, ctx, activePiece, field, requestID, gameOver

// 0 open
// 1 wall
// 2 block
// 8 spawn
// 9 exit

const OPEN = 0
const WALL = 1
const BLOCK = 2
const SPIKE = 3
const GUY = 8
const EXIT = 9

const levels = [
	{
		height: 20,
		width: 25,
		stage: [
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 8, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 2, 2, 0, 0, 0, 9, 0, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		],
	},
	{
		height: 20,
		width: 25,
		stage: [
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 2, 0, 2, 0, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 2, 0, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 0, 8, 0, 2, 0, 0, 1, 0, 2, 0, 0, 2, 0, 9, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 2, 0, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 2, 0, 2, 0, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		],
	},
	{
		height: 20,
		width: 25,
		stage: [
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 2, 0, 0, 0, 0, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 0, 8, 0, 0, 0, 2, 0, 2, 0, 2, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 0, 9, 0, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		],
	},
	{
		height: 20,
		width: 25,
		stage: [
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 0, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 3, 3, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 0, 0, 1, 3, 2, 0, 1, 3, 0, 0, 0, 3, 3, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 0, 8, 0, 2, 0, 1, 0, 2, 2, 0, 0, 3, 3, 9, 0, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 0, 0, 0, 2, 0, 1, 1, 3, 0, 0, 0, 3, 3, 0, 0, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 3, 3, 0, 0, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		],
	},
]

window.onload=function() {
	canv = document.getElementById("canv")
	ctx = canv.getContext("2d")
	document.addEventListener("keydown", keyPush)

	loadImages(init)
}

class Sprite {
	constructor(img, width, height, positions) {
		if (!positions) {
			positions = [[0, 0]]
		}
		Object.assign(this, {
			img,
			width,
			height,
			positions,
		})
	}

	draw(x, y, position) {
		if (!position) {
			position = 0
		}
		const pos = this.positions[position]
		ctx.drawImage(
			this.img,
			pos[0],
			pos[1],
			this.width,
			this.height,
			x,
			y,
			this.width,
			this.height,
		)
	}
}

function loadImages(callback) {
	const sources = {
		'brick': './resources/2019-04-01/brick.png',
		'block': './resources/2019-04-01/block.png',
		'exit': './resources/2019-04-01/exit.png',
		'guy': './resources/2019-04-01/guy.png',
		'spike': './resources/2019-04-01/spike.png',
	}
	let remainingItems = Object.keys(sources).length

	for (let key of Object.keys(sources)) {
		const img = new Image()
		img.src = sources[key]
		images[key] = img
		img.onload = function() {
			remainingItems -= 1
			if (remainingItems == 0) {
				callback()
			}
		}
	}
}

class Guy {
	constructor(x, y) {
		Object.assign(this, {
			x,
			y,
			phasing: false,
			facingRight: true,
		})
	}

	pose() {
		if (this.facingRight) {
			if (this.phasing) {
				return 3
			} else {
				return 1
			}
		} else {
			if (this.phasing) {
				return 2
			} else {
				return 0
			}
		}
	}
}

function init() {
	sprites['brick'] = new Sprite(images['brick'], 30, 30)
	sprites['block'] = new Sprite(images['block'], 30, 30)
	sprites['exit'] = new Sprite(images['exit'], 30, 30)
	sprites['guy'] = new Sprite(images['guy'], 30, 30, [
		[0, 0],
		[30, 0],
		[60, 0],
		[90, 0],
		[120, 0],
	])
	sprites['spike'] = new Sprite(images['spike'], 30, 30)

	levelIndex = 0
	loadLevel()
}

function drawStage() {
	const { stage, scroll } = loadedLevel

	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			let i = coorToIndex({x: scroll + x, y})
			switch (stage[i]) {
				case OPEN:
					break;
				case WALL:
					sprites['brick'].draw(x * squareSize, y * squareSize)
					break;
				case BLOCK:
					sprites['block'].draw(x * squareSize, y * squareSize)
					break;
				case SPIKE:
					sprites['spike'].draw(x * squareSize, y * squareSize)
					break;
				case GUY:
					if (guy.x - scroll == x && guy.y == y) {
						break;
					}
					sprites['guy'].draw(x * squareSize, y * squareSize, 4)
					break;
				case EXIT:
					sprites['exit'].draw(x * squareSize, y * squareSize)
					break;
				default:
					// throw new Error('Invalid stage index')
			}
		}
	}


	const {x, y} = guy
	sprites['guy'].draw((x - scroll) * squareSize, y * squareSize, guy.pose())
}

function indexToCoor(i) {
	const { width, height } = loadedLevel

	let x = i % width
	let y = Math.floor(i / width)
	return {x, y}
}

function coorToIndex(obj) {
	return obj.y * loadedLevel.width + obj.x
}

function draw() {
	ctx.clearRect(0, 0, canv.width, canv.height)
	drawStage()
}

function inBounds(c) {
	const { x, y } = c

	return x >= 0 &&
		x < loadedLevel.width &&
		y >= 0 &&
		y < loadedLevel.height
}

function loadLevel() {
	if (levelIndex >= levels.length) {
		// gameOver = true
		levelIndex = 0
	}

	loadedLevel = JSON.parse(JSON.stringify(levels[levelIndex]))

	const { stage } = loadedLevel
	for (let i = 0; i < stage.length; i++) {
		if (stage[i] == GUY) {
			const {x, y} = indexToCoor(i)
			guy = new Guy(x, y)
		}
	}

	loadedLevel.scroll = Math.min(loadedLevel.width-width, Math.max(0, guy.x - screenOffset))

	history = []
	updateUndo()

	draw()
}

function nextLevel() {
	levelIndex += 1
	loadLevel()
}

function moveGuy(dx, dy, firstAttempt) {
	if (guy.phasing) {
		return
	}

	const { stage } = loadedLevel
	const { x, y } = guy
	let i = coorToIndex(guy)
	const nx = x + dx
	const ny = y + dy
	const nc = {
		x: nx,
		y: ny,
	}
	const di = coorToIndex(nc)
	const ndi = coorToIndex({x: x + 2*dx, y: y + 2*dy})

	if (inBounds(nc)) {
		if (stage[di] == EXIT) {
			nextLevel()
			return
		}

		if (stage[di] == OPEN) {
			guy.x = nx
			guy.y = ny
			stage[i] = OPEN
			stage[di] = GUY
		} else if ((stage[ndi] == OPEN || stage[ndi] == SPIKE) && stage[di] == BLOCK) {
			guy.x = nx
			guy.y = ny
			stage[i] = OPEN
			stage[di] = GUY
			stage[ndi] = BLOCK
		}
	}

	scrollScreen()

	if (dx < 0) {
		guy.facingRight = false
	} else if (dx > 0) {
		guy.facingRight = true
	}
}

function scrollScreen() {
	if (width - (guy.x - loadedLevel.scroll) < screenOffset) {
		loadedLevel.scroll = Math.min(loadedLevel.width-width, loadedLevel.scroll+1)
	} else if (guy.x - loadedLevel.scroll < screenOffset) {
		loadedLevel.scroll = Math.max(0, loadedLevel.scroll-1)
	}
}

function updateUndo() {
	const currentState = JSON.stringify({
		loadedLevel,
		guyData: {
			x: guy.x,
			y: guy.y,
			facingRight: guy.facingRight,
		},
	})
	if (history.length == 0) {
		history.push(currentState)
	}

	const previousState = history[history.length-1]
	if (currentState == previousState) {
		return
	}

	history.push(currentState)
}

function undo() {
	let previousState
	if (history.length == 1) {
		previousState = history[0]
	} else {
		previousState = history.pop()
	}

	let state = JSON.parse(previousState)
	loadedLevel = state.loadedLevel
	let guyData = state.guyData
	if (!guy.phasing) {
		guy.x = guyData.x
		guy.y = guyData.y
		guy.facingRight = guyData.facingRight
	}
}

function printStage() {
	const { stage, width } = loadedLevel
	let str = '\n'
	for (var i = 0; i < stage.length; i++) {
		str += stage[i] + ' '
		if ((i+1) % width == 0) {
			str += '\n'
		}
	}
}

function togglePhase() {
	const { stage } = loadedLevel
	const { x, y } = guy
	let i = coorToIndex(guy)

	if (!(stage[i] == OPEN || stage[i] == GUY)) {
		return
	}

	guy.phasing = !guy.phasing;

	if (guy.phasing) {
		stage[i] = OPEN
	} else {
		stage[i] = GUY
	}
}

function keyPush(e) {
	if ('1' <= e.key &&  e.key <= '9') {
		levelIndex = parseInt(e.key)-1
		loadLevel()
		return
	}
	switch(e.key) {
		case 'ArrowLeft':
			updateUndo()
			moveGuy(-1, 0, true)
			break;
		case 'ArrowUp':
			updateUndo()
			moveGuy(0, -1, true)
			break;
		case 'ArrowRight':
			updateUndo()
			moveGuy(1, 0, true)
			break;
		case 'ArrowDown':
			updateUndo()
			moveGuy(0, 1, true)
			break;
		case ' ':
			togglePhase()
			break;
		case 'Backspace':
			undo()
			break;
		case 'r':
			loadLevel()
			break;
	}

	draw()
}
