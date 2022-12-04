

class GameObject {
	constructor(x, y) {
		this.x = x;
		this.y = y;
    this.dead = false;
		this.type = '';
		this.width = 0;
		this.height = 0;
		this.img = undefined;
  } 
  draw(ctx) {
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	}
}

class Player extends GameObject {
  constructor(x,y) {
    super(x,y);
    (this.width = 99), (this.height = 75);
		this.type = 'Player';
		this.speed = { x: 0, y: 0 };
  }
}
class EnemyShip extends GameObject {
	constructor(x, y) {
		super(x, y);
		(this.width = 98), (this.height = 50);
		this.type = 'Enemy';
		let id = setInterval(() => {
			if (this.y < canvas.height - this.height) {
				this.y += 5;
			} else {
				console.log('Stopped at', this.y);
				clearInterval(id);
			}
		}, 300);
	}
}


let onKeyDown = function (e) {
	console.log(e.keyCode);
	switch (e.keyCode) {
		case 37:
		case 39:
		case 38:
		case 40: // Arrow keys
		case 32:
			e.preventDefault();
			break; // Space
		default:
			break; // do not block other keys
	}
};

window.addEventListener('keyup', (evt) => {
	if (evt.key === 'ArrowUp') {
		eventEmitter.emit(Messages.KEY_EVENT_UP);
	} else if (evt.key === 'ArrowDown') {
		eventEmitter.emit(Messages.KEY_EVENT_DOWN);
	} else if (evt.key === 'ArrowLeft') {
		eventEmitter.emit(Messages.KEY_EVENT_LEFT);
	} else if (evt.key === 'ArrowRight') {
		eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
	}
});

class EventEmitter {
  constructor() {
    this.listeners = {};
  }
//when a message is received, let the listener to handle its payload
  on(message, listener) {
    if (!this.listeners[message]) {
      this.listeners[message] = [];
    }
    this.listeners[message].push(listener);
  }
//when a message is sent, send it to a listener with some payload
  emit(message, payload = null) {
    if (this.listeners[message]) {
      this.listeners[message].forEach(l => l(message, payload))
    }
  }
}
const Messages = {
  KEY_EVENT_UP: 'KEY_EVENT_UP',
	KEY_EVENT_DOWN: 'KEY_EVENT_DOWN',
	KEY_EVENT_LEFT: 'KEY_EVENT_LEFT',
	KEY_EVENT_RIGHT: 'KEY_EVENT_RIGHT',
};

let gameObjects = [];
let canvas;
let ctx;
let playerImg;
let enemyShipImg;
//invoke eventEmitter
let eventEmitter = new EventEmitter();

function createPlayer() {
  player = new Player(canvas.width/2-45,canvas.height-canvas.height/4);
  player.img = playerImg;
  gameObjects.push(player);
};
function createEnemies() {
	const ENEMY_TOTAL = 5;
	const ENEMY_WIDTH = ENEMY_TOTAL * 98;
	const START_X = (canvas.width - ENEMY_WIDTH) / 2;
	const STOP_X = START_X + ENEMY_WIDTH;

	for (let x = START_X; x < STOP_X; x += 98) {
		for (let y = 0; y < 50 * 5; y += 50) {
			const enemy = new Enemy(x, y);
			enemy.img = enemyImg;
			gameObjects.push(enemy);
		}
	}
}

function loadAsset(path) {
  return new Promise((resolve) =>{ 
    const img = new Image();
    img.src = path;
    img.onload = () => {
      resolve(img);
    };
});
}
function draw(ctx) {
  gameObjects.forEach((go) => 
    go.draw(ctx)
  );
}

function initGame() {
	gameObjects = [];
	createEnemies();
	createPlayer();

	eventEmitter.on(Messages.KEY_EVENT_UP, () => {
		player.y -= 5;
	});

	eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
		player.y += 5;
	});

	eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
		player.x -= 5;
	});

	eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
		player.x += 5;
	});
}


window.onload = async () => {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  playerImg = await loadAsset('assets/player.png');
  enemyShipImg = await loadAsset('assets/enemyShip.png');

  initGame();
	let gameLoopId = setInterval(() => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		drawGameObjects(ctx);
	}, 100);
};




