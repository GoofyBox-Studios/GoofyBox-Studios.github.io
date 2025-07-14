Input.add_action("start", ["KeyZ", "KeyX", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]);
Input.add_action("jump", ["KeyZ", "KeyX", Input.BUTTON_GAMEPAD_NINTENDO_B]);
Input.add_action("left", ["ArrowLeft", Input.AXIS_GAMEPAD_LEFT_STICK_LEFT]);
Input.add_action("right", ["ArrowRight", Input.AXIS_GAMEPAD_LEFT_STICK_RIGHT]);
Input.add_action("enter", ["ArrowUp", "ArrowDown", Input.AXIS_GAMEPAD_LEFT_STICK_UP, Input.AXIS_GAMEPAD_LEFT_STICK_DOWN]);

const DEBUG_SHOW_COLLISION = false;

var currentLevel = 0;

var mode = -1;

// var keyMap = {
//   jump: " ",
//   up: "ArrowUp",
//   left: "ArrowLeft",
//   right: "ArrowRight"
// }

function loadLevel(l) {
	currentLevel = l;
	level = levels[currentLevel].tiles;
	ground = new Level(level, 16, 15);

	emitters = [];
	entities = [];
	for (let i = 0; i < levels[currentLevel].crumbles.length; i++) {
		let c = levels[currentLevel].crumbles[i];
		entities.push(new CrumblePlatform(c.x, c.y, c.w));
	}
	for (let i = 0; i < levels[currentLevel].flames.length; i++) {
		let c = levels[currentLevel].flames[i];
		emitters.push(
			new Emitter(
				c.x * 16,
				c.y * 16,
				function () {
					return [1, c.x * 16, c.y * 16, true, 0.07, new Vector2((Math.random() - 0.5) / 2, -0.6), 0.99 + Math.random() * 0.01];
				},
				6
			)
		);
	}
	corpses = [];
	particles = [];
	if (currentLevel == 3) {
		entities.push(new Plant(7 * 16, 10 * 16));
		// } else if (currentLevel == 4) {
		//   let c1 = new Cog(7, 10);
		//   let c2 = new Cog(10, 7, true);
		//   c1.twin = c2;
		//   c2.twin = c1;
		//   entities.push(c1, c2);
	}
	if (currentLevel > 0) {
		particles.push(new Particle(1, fireX1, fireY1 + 1, true, 0, new Vector2(Math.random() - 0.5, -0.8), 0, true));
		particles.push(new Particle(1, fireX2, fireY2 + 1, true, 0, new Vector2(Math.random() - 0.5, -0.8), 0, true));
	}
	maxDeaths = levels[currentLevel].maxDeaths || 99;
}

var clippingSize = 1000;

function audioEnd(e) {
	this.parent.parent.playing.splice(this.parent.parent.playing.indexOf(this.parent.id), 1);
	this.currentTime = 0;
}

function SoundEffect(src) {
	return {
		list: [],
		src: src,
		playing: [],
		play: function () {
			if (playSounds) {
				let id = 0;
				for (let i = 0; i < 10; i++) {
					if (!this.playing.includes(i)) {
						id = i;
						break;
					}
				}
				this.playing.push(id);
				this.list[id].currentTime = 0;
				this.list[id].play();
				this.list[id].audio.removeEventListener("ended", audioEnd);
				this.list[id].audio.addEventListener("ended", audioEnd);
			}
		},
	};
}

function playRandomSound() {
	let id = Math.floor(Math.random() * arguments.length);
	soundBank[arguments[id]].play();
}

var soundBank = {
	jump: new SoundEffect("https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/Jump.wav?v=1715455973005"),
	// door_open: new SoundEffect("unused/Door Open.mp3"),
	// door_close: new SoundEffect("unused/Door Close.mp3"),
	// step1: new SoundEffect("unused/Step 1.wav"),
	// step2: new SoundEffect("unused/Step 2.wav"),
	// step3: new SoundEffect("unused/Step 3.wav"),
	// step4: new SoundEffect("unused/Step 4.wav"),
	// crumbling: new SoundEffect("unused/Crumble Long.wav"),
	crumbled: new SoundEffect("https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/Crumble.wav?v=1715455971912"),
	death: new SoundEffect("https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/Death.wav?v=1715455972552"),
	// scroll: new SoundEffect("unused/Scroll Open.mp3"),
};

var titleMusic = new Audio();
titleMusic.src = "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/Title.m4a?v=1715457009876";
titleMusic.loop = true;
titleMusic.crossOrigin = "";
titleMusic.volume = 0;

var music = new Audio();
music.src = "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/Levels.m4a?v=1715457007638";
music.loop = true;
music.crossOrigin = "";
music.volume = 0;

var canvasScale = 4;
var canvas = document.getElementById("canvas");
canvas.width = 256 * canvasScale;
canvas.height = 240 * canvasScale;
var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

Input.Action("start").onPress(() => {
	if (mode == -1) {
		titleMusic.play();
		mode = 1;
	}
});

canvas.addEventListener("click", function () {
	if (mode == -1) {
		titleMusic.play();
		mode = 1;
	}
});

// window.addEventListener("resize", function (e) {
//   canvas.width =  Math.floor(window.innerHeight / 240 * 255);
//   canvas.height = window.innerHeight;
//   ctx.imageSmoothingEnabled = false;
//   scale = window.innerHeight / 240;
// });

var images = {
	spritesheet1: document.getElementById("blocks"),
	player: document.getElementById("player"),
	background: document.getElementById("background"),
	ui: document.getElementById("ui"),
	title: document.getElementById("title"),
	title2: document.getElementById("title2"),
};

const tileSprites = [new Sprite("https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/tilesBrown.png?v=1715480737063"), new Sprite("https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/tilesGreen.png?v=1715480737317"), new Sprite("https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/tilesGrey.png?v=1715480737547")];

var canMove = true;
var fade = 0;
var fading = false;
var creditsTime = -1;

var startDelay = 15;

var keys = {};
var playSounds = true;

var width = 16,
	height = 15;
var level = levels[currentLevel].tiles;
var maxDeaths = levels[currentLevel].maxDeaths;
var entities = [];

const VARYING = "varying";
// FLAGS
// 0: solid
// 1: spike
// 2: exit
// 3: fire
// 4: save point
var blockSprites = [
	// {uv: []}, // air
	// {uv: [80, 0, 16, 16], flags: [0]}, // 1 block
	// {uv: [96, 0, 16, 16], flags: [0]}, // 2 block top
	// {uv: [80, 16, 16, 16], flags: [0]}, // 3 fancy block
	// {uv: [64, 0, 16, 16], flags: [0]}, // 4 crumbled block
	// {uv: [64, 16, 16, 16], flags: [0]}, // 5 background block
	// {uv: [96, 16, 16, 16], flags: []}, // 6 plant
	// {uv: [80, 32, 16, 16], flags: []}, // 7 flower
	// {uv: [48, 64, 16, 16], flags: [4]}, // 8 door top
	// {uv: [48, 80, 16, 16], flags: []}, // 9 door bottom
	// {uv: [32, 64, 16, 16], collision: [3, 10, 10, 6], flags: [1]}, // 10 spike
	// {uv: [64, 64, 16, 16], collision: [-4, -4, 16 + 8, 32 + 8], flags: [2]}, // 11 exit door top
	// {uv: [64, 80, 16, 16], flags: []}, // 12 exit door bottom
	// {uv: [96, 112, 32, 16], collision: [1, 3, 30, 13], flags: [0, 3]}, // 13 earn
	// {uv: [112, 32, 32, 32], collision: [0, 0, 32, 32], flags: [0]}, // 14
	// {uv: [144, 48, 16, 16], flags: [0]}, // 15
	// {uv: [1000, 1000, 0, 0], collision: [], flags: []}, // 16
	// {uv: [1000, 1000, 0, 0], collision: [], flags: []}, // 17
	// {uv: [1000, 1000, 0, 0], collision: [], flags: []}, // 18
	// {uv: [1000, 1000, 0, 0], collision: [], flags: []}, // 19
	// {uv: [16, 32, 16, 16], collision: [3, 10, 10, 6], flags: [1]}, // 20 spike
	// {uv: [32, 32, 16, 16], collision: [3, 10, 10, 6], flags: [1]}, // 21 spike
	// {uv: [48, 32, 16, 16], collision: [3, 10, 10, 6], flags: [1]}, // 22 spike
	// {uv: [16, 48, 16, 16], collision: [3, 10, 10, 6], flags: [1]}, // 23 spike
	// {uv: [32, 48, 16, 16], collision: [3, 10, 10, 6], flags: [1]}, // 24 spike
	// {uv: [48, 48, 16, 16], collision: [3, 10, 10, 6], flags: [1]}, // 25 spike
	// {uv: [16, 64, 16, 16], collision: [3, 10, 10, 6], flags: [1]}, // 26 spike
	// {uv: [32, 64, 16, 16], collision: [3, 10, 10, 6], flags: [1]}, // 27 spike
	// {uv: [32, 64, 16, 16], collision: [3, 10, 10, 6], flags: [1]}, // 28 spike
	// {uv: [32, 64, 16, 16], collision: [3, 10, 10, 6], flags: [1]}, // 29 spike
	// {uv: [32, 64, 16, 16], collision: [3, 10, 10, 6], flags: [1]}, // 30 spike
	{ uv: new UV() }, // 0    Air
	{ uv: VARYING, flags: [0] }, // 1    Block
	{ uv: new UV(112, 0, 16, 16), collision: [-4, -4, 16 + 8, 32 + 8], flags: [2] }, // 2 exit door top
	{ uv: new UV(112, 16, 16, 16), flags: [] }, // 3 exit door bottom
	{ uv: new UV(112, 48, 16, 16), collision: [3, 14, 10, 2], flags: [1] }, // 4 spike
];

var particleSprites = [
	{ uv: [0, 80, 16, 16], flags: [0] }, // death particle
	{ uv: [16, 80, 16, 16], flags: [0] }, // death particle
	{ uv: [32, 80, 16, 16], flags: [0] }, // death particle
	{ uv: [48, 80, 16, 16], flags: [0] }, // death particle
	{ uv: [0, 96, 16, 16], flags: [0] }, // death particle
	{ uv: [16, 96, 16, 16], flags: [0] }, // death particle
	{ uv: [32, 96, 16, 16], flags: [0] }, // death particle
	{ uv: [48, 96, 16, 16], flags: [0] }, // death particle
	{ uv: [0, 112, 16, 16], flags: [0] }, // death particle
	{ uv: [16, 112, 16, 16], flags: [0] }, // death particle
	{ uv: [32, 112, 16, 16], flags: [0] }, // death particle
	{ uv: [48, 112, 16, 16], flags: [0] }, // death particle
	{ uv: [0, 128, 16, 16], flags: [0] }, // death particle
	{ uv: [16, 128, 16, 16], flags: [0] }, // death particle
	{ uv: [32, 128, 16, 16], flags: [0] }, // death particle
	{ uv: [48, 128, 16, 16], flags: [0] }, // death particle

	{ uv: [144, 0, 16, 16], flags: [0] }, // fire 1
	{ uv: [144, 16, 16, 16], flags: [0] }, // fire 2
	{ uv: [144, 32, 16, 16], flags: [0] }, // fire 3
	{ uv: [144, 48, 16, 16], flags: [0] }, // fire 4

	{ uv: [48, 0, 16, 16], flags: [] }, // door glow

	{ uv: [32, 16, 16, 16], flags: [] }, // jump 1
	{ uv: [48, 16, 16, 16], flags: [] }, // jump 2
	{ uv: [64, 16, 16, 16], flags: [] }, // jump 3
	{ uv: [32, 32, 16, 16], flags: [] }, // jump 4
	{ uv: [48, 32, 16, 16], flags: [] }, // jump 5
	{ uv: [64, 32, 16, 16], flags: [] }, // jump 6
	{ uv: [32, 48, 16, 16], flags: [] }, // jump 7
	{ uv: [48, 48, 16, 16], flags: [] }, // jump 8
	{ uv: [64, 48, 16, 16], flags: [] }, // jump 9
	{ uv: [32, 64, 16, 16], flags: [] }, // jump 10
];

var uiSprites = [
	{ uv: [64, 8, 16, 16] }, // 0
	{ uv: [80, 8, 16, 16] }, // 1
	{ uv: [96, 8, 16, 16] }, // 2
	{ uv: [112, 8, 16, 16] }, // 3
	{ uv: [128, 8, 16, 16] }, // 4
	{ uv: [144, 8, 16, 16] }, // 5
	{ uv: [160, 8, 16, 16] }, // 6
	{ uv: [112, 32, 16, 16] }, // X
	{ uv: [128, 32, 16, 16] }, // /
];

function colliding(a, b) {
	if (a == b) return false;

	if (a.collision.round) {
		if (b.collision.round) {
			return collidingRounds(a, b);
		} else {
			return collidingWithRound(b, a);
		}
	} else if (b.collision.round) {
		return collidingWithRound(a, b);
	}
	let aL = a.position.x + a.collision.offsetX;
	let aR = a.position.x + a.collision.width + a.collision.offsetX;
	let aU = a.position.y + a.collision.offsetY;
	let aD = a.position.y + a.collision.height + a.collision.offsetY;
	let bL = b.position.x + b.collision.offsetX;
	let bR = b.position.x + b.collision.width + b.collision.offsetX;
	let bU = b.position.y + b.collision.offsetY;
	let bD = b.position.y + b.collision.height + b.collision.offsetY;

	return aU <= bD && aD >= bU && aL <= bR && aR >= bL;
}

function collidingRound(a, b) {
	let distX = Math.abs(b.position.x - a.position.x);
	let distY = Math.abs(b.position.y - a.position.y);
	let dist = Math.sqrt(distX ** 2 + distY ** 2);
	return dist < a.collision.radius + b.collision.radius;
}

function collidingWithRound(a, b) {
	let distX = Math.abs(b.position.x + b.collision.offsetX - (a.position.x + a.collision.offsetX + a.collision.width / 2));
	let distY = Math.abs(b.position.y + b.collision.offsetY - (a.position.y + a.collision.offsetY + a.collision.height / 2));

	if (distX > a.collision.width / 2 + b.collision.radius) {
		return false;
	}
	if (distY > a.collision.height / 2 + b.collision.radius) {
		return false;
	}

	if (distX <= a.collision.width / 2) {
		return true;
	}
	if (distY <= b.collision.height / 2) {
		return true;
	}

	let dx = distX - a.collision.width / 2;
	let dy = distY - a.collision.height / 2;
	return dx * dx + dy * dy <= b.collision.radius * b.collision.radius;
}

function Sound(src) {
	this.audio = new Audio();
	this.audio.src = src;
	this.audio.preload = "auto";
	this.play = function () {
		this.audio.play();
	};
}

function Obj(x, y, w, h) {
	this.position = new Vector2(x, y);
	this.collision = new Collision(w, h);
}

// function Collision(w, h, offX = 0, offY = 0) {
//   this.width = w;
//   this.height = h;
//   this.offsetX = offX || 0;
//   this.offsetY = offY || 0;
// }

for (let s in soundBank) {
	let sound = soundBank[s];
	for (let i = 0; i < 10; i++) {
		let snd = new Sound(sound.src);
		snd.parent = sound;
		snd.audio.parent = snd;
		snd.id = i;
		snd.audio.volume = 0.8; // 0.2
		sound.list.push(snd);
	}
}

for (let i = 0; i < levels[currentLevel].crumbles.length; i++) {
	let c = levels[currentLevel].crumbles[i];
	entities.push(new CrumblePlatform(c.x, c.y, c.w));
}

var player = new Player();

var ground = new Level(level, width, height);

var corpses = [];
var particles = [];
var emitters = [];

var d = 0;

var fireX1 = 72;
var fireY1 = 111;
var fireX2 = 168;
var fireY2 = 111;

function draw3Slice(img, uvx, uvy, uvw, uvh, x, y, w, h, st) {
	ctx.drawImage(img, uvx, uvy, uvw / 3, uvh, x, y, w / 3, h);
	ctx.drawImage(img, uvx + uvw / 3, uvy, uvw / 3, uvh, x + w / 3, y, (w / 3) * st, h);
	ctx.drawImage(img, uvx + (uvw / 3) * 2, uvy, uvw / 3, uvh, x + (w / 3) * (st + 1), y, w / 3, h);
}

var lastNext = false;

function drawCollisionFor(entity, colour) {
	if (entity.collision && DEBUG_SHOW_COLLISION) {
		ctx.strokeStyle = colour ?? "red";
		ctx.lineWidth = 0.5;
		ctx.beginPath();
		ctx.rect(entity.position.x + entity.collision.offsetX, entity.position.y + entity.collision.offsetY, entity.collision.width, entity.collision.height);
		ctx.stroke();
	}
}

ctx.save();
function _mainLoop() {
	try {
		ctx.restore();
		ctx.save();
		ctx.resetTransform();
		ctx.scale(canvasScale, canvasScale);

		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		if (mode == 1) {
			// if (clippingSize >= 0) {
			ctx.beginPath();
			const radius = ((canvas.width * Math.PI) / 2 / canvasScale / 2) * (clippingSize / 100);
			ctx.arc(player.deathPosition.x, player.deathPosition.y, Math.max(radius, 0.1), 0, 2 * Math.PI);
			ctx.clip();
			// } else {
			// ctx.rect(0, 0, 0, 0);
			// ctx.clip();
			// }

			// if (keys["l"]) {
			//   grounsd.tiles = JSON.parse(prompt("Enter level data:"));
			//   keys["l"] = undefined;
			// }
			ctx.drawImage(images.background, 0, 0, 256, 256);

			d += 1;
			if (d % 6 == 0 && currentLevel > 0) {
				let r = Math.random();
				particles.push(new Particle(1, fireX1, fireY1, true, 0.07, new Vector2((Math.random() - 0.5) / 2, -0.6), 0.99 + r * 0.01, false));
				r = Math.random();
				particles.push(new Particle(1, fireX2, fireY2, true, 0.07, new Vector2((Math.random() - 0.5) / 2, -0.6), 0.99 + r * 0.01, false));
			}

			player.update();
			for (let e in entities) {
				let entity = entities[e];
				entity.update();
			}
			for (let c in corpses) {
				let corpse = corpses[c];
				corpse.update();
			}
			for (let e in emitters) {
				let emitter = emitters[e];
				emitter.update();
			}
			for (let p in particles) {
				let particle = particles[p];
				particle.update();
			}

			if (player.position.x > 96 && currentLevel == 4) {
				keys = {};
				canMove = false;
				fading = true;
			}

			for (let e in entities) {
				let entity = entities[e];

				if (entity.drawBack) {
					entity.drawBack();
				}
			}

			ground.draw();

			for (let entity of entities) {
				entity.draw();

				drawCollisionFor(entity, "blue");
			}

			for (let c in corpses) {
				let corpse = corpses[c];
				corpse.draw();

				drawCollisionFor(corpse, "red");
			}

			player.draw();
			drawCollisionFor(player, "green");

			for (let p in particles) {
				let particle = particles[p];
				particle.draw();
			}

			ctx.drawImage(images.ui, 0, 80, 16, 16, 2, 1, 24, 24);
			let t = "x" + (maxDeaths - player.deaths);
			let x = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, x: 7, "/": 8 };
			for (let i in t) {
				let l = t.substr(i, 1);
				let j = x[l] || 7;
				let uv = uiSprites[j].uv;
				ctx.drawImage(images.ui, uv[0], uv[1], 16, 16, 24 + i * 12, 6, 16, 16);
			}

			if (fading) {
				fade += 1;
				ctx.globalAlpha = Math.max((fade - 75) / 100, 0);
				ctx.fillStyle = "black";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.globalAlpha = 1;
				if (fade > 225) {
					music.volume = Math.max(1 - (fade - 225) / 5, 0);
					ctx.font = 32 / 6 + "px Pixel";
					ctx.fillStyle = "white";
					ctx.textBaseline = "top";
					ctx.textAlign = "center";
					ctx.fillText("Job never made it out.", canvas.width / 2, 200 - creditsTime / 3);
					if (fade > 300) {
						music.pause();
						creditsTime += 1;
					}
				}
				if (creditsTime > -1) {
					ctx.font = 128 / 6 + "px Pixel";
					ctx.fillStyle = "white";
					ctx.textBaseline = "top";
					ctx.textAlign = "center";
					ctx.fillText("Corpse", canvas.width / 2, 280 - creditsTime / 3);

					ctx.font = 32 / 6 + "px Pixel";
					ctx.fillText("Made by:", canvas.width / 2, 320 - creditsTime / 3);
					ctx.fillText("Haizlbliek\t\t\tHead of Programming and Chief Debugger", canvas.width / 2, 340 - creditsTime / 3);
					ctx.fillText("TheLordZephyrus\t\t\tArt Constructer and Game Designer", canvas.width / 2, 350 - creditsTime / 3);
					ctx.fillText("Judah\t\t\tMusic and Gameplay Consultant", canvas.width / 2, 330 - creditsTime / 3);

					ctx.fillText("Special Thanks to:", canvas.width / 2, 380 - creditsTime / 3);
					ctx.fillText("All our exccelent play-testers", canvas.width / 2, 390 - creditsTime / 3);

					ctx.font = 64 / 6 + "px Pixel";
					ctx.fillText("Thanks for playing!", canvas.width / 2, 500 - creditsTime / 3);
				}
			}
		} else if (mode == 0) {
			startDelay--;

			ctx.drawImage(images.title, 0, 0, 256, 240, 0, 0, 256, 240);
			let slices = 3; // 5.2
			draw3Slice(images.ui, 32, 32, 80, 48, 128 - ((80 / 3) * (slices + 2)) / 2, 16, 80, 48, slices);

			ctx.font = 128 / 6 + "px Pixel";
			ctx.fillStyle = "black";
			ctx.textBaseline = "top";
			ctx.textAlign = "center";
			ctx.fillText("Corpse", 128, 28);

			d += 1;
			if (d % 6 == 0) {
				let r = Math.random();
				particles.push(new Particle(1, fireX1, fireY1 - 8, true, 0.07, new Vector2((Math.random() - 0.5) / 2, -0.6), 0.99 + r * 0.01, false));
				r = Math.random();
				particles.push(new Particle(1, fireX2, fireY2 - 8, true, 0.07, new Vector2((Math.random() - 0.5) / 2, -0.6), 0.99 + r * 0.01, false));
			}

			for (let p in particles) {
				let particle = particles[p];
				particle.update();
			}
			for (let p in particles) {
				let particle = particles[p];
				particle.draw();
			}

			ctx.drawImage(images.ui, 32, 80, 80, 48, 88, 192, 80, 48);
			if (Input.is_action_just_pressed("start") && startDelay <= 0) {
				mode = 2;
			}
		} else if (mode == 2) {
			ctx.drawImage(images.title2, 0, 0, 256, 240, 0, 0, 256, 240);

			let slices = 5.2;
			draw3Slice(images.ui, 32, 32, 80, 48, 128 - ((80 / 3) * (slices + 2)) / 2, 16, 80, 48, slices);

			d += 1;
			if (d % 6 == 0) {
				let r = Math.random();
				particles.push(new Particle(1, fireX1, fireY1 - 8, true, 0.07, new Vector2((Math.random() - 0.5) / 2, -0.6), 0.99 + r * 0.01, false));
				r = Math.random();
				particles.push(new Particle(1, fireX2, fireY2 - 8, true, 0.07, new Vector2((Math.random() - 0.5) / 2, -0.6), 0.99 + r * 0.01, false));
			}

			for (let p in particles) {
				let particle = particles[p];
				particle.update();
			}
			for (let p in particles) {
				let particle = particles[p];
				particle.draw();
			}

			ctx.font = 48 / 6 + "px Pixel";
			ctx.fillStyle = "black";
			ctx.textBaseline = "top";
			ctx.textAlign = "center";
			ctx.fillText("Job stole the Crystal of Undeath,", 128, 28);
			ctx.fillText("the sealed in enterance forced Job", 128, 36);
			ctx.fillText("to make his way through the back.", 128, 44);
			ctx.fillText("v", canvas.width / 2, 52);

			if (Input.is_action_just_pressed("start")) {
				loadLevel(currentLevel);
				mode = 1;
				titleMusic.pause();
				music.play();
			}
		} else if (mode == -1) {
			ctx.font = 48 / 6 + "px Pixel";
			ctx.fillStyle = "white";
			ctx.textBaseline = "top";
			ctx.textAlign = "center";
			ctx.fillText("press any key", 128, 120);
		}
	} catch (e) {
		alert(e);
		return;
	}

	// lastNext = keys["ArrowDown"];

	requestAnimationFrame(_mainLoop);
}

// particles.push(new Particle(1, fireX1, fireY1 - 8, false, 0, new Vector2(0, 0), 1, false));
// particles.push(new Particle(1, fireX2, fireY2 - 8, false, 0, new Vector2(0, 0), 1, false));
_mainLoop();
