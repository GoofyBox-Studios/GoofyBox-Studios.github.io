/* global Input Vector2 CollisionObject rLerp */

function $(query) {
	return document.querySelector(query);
}

function Sprite(src) {
	const i = new Image();
	i.src = src;
	imagesToLoad++;
	i.onload = function () {
		imagesLoaded++;
	}
	return i;
}


var imagesToLoad = 0;
var imagesLoaded = 0;

const reg = Sprite("https://cdn.glitch.global/cfe14639-265a-43cf-81e0-5d469823940c/reg.png?v=1696353078769");
const land = Sprite("https://cdn.glitch.global/cfe14639-265a-43cf-81e0-5d469823940c/land.png?v=1696353080430");
const rock1 = Sprite("https://cdn.glitch.global/d6d4f322-9d2d-449c-85f6-5b7e31676fb1/Rock 1.png?v=1691090580028");
const rock2 = Sprite("https://cdn.glitch.global/d6d4f322-9d2d-449c-85f6-5b7e31676fb1/Rock 2.png?v=1691090649937");
const rock3 = Sprite("https://cdn.glitch.global/d6d4f322-9d2d-449c-85f6-5b7e31676fb1/Rock 3.png?v=1691090721170");
const rock4 = Sprite("https://cdn.glitch.global/d6d4f322-9d2d-449c-85f6-5b7e31676fb1/Rock 4.png?v=1691090787920");
const rock5 = Sprite("https://cdn.glitch.global/d6d4f322-9d2d-449c-85f6-5b7e31676fb1/Rock 5.png?v=1691090859606");
const rock6 = Sprite("https://cdn.glitch.global/d6d4f322-9d2d-449c-85f6-5b7e31676fb1/Rock 6.png?v=1691090860664");
const cannon = Sprite("https://cdn.glitch.global/cfe14639-265a-43cf-81e0-5d469823940c/cannon.png?v=1696353115382");
const background = Sprite("https://cdn.glitch.global/cfe14639-265a-43cf-81e0-5d469823940c/background.png?v=1696353118387");
const bullet = Sprite("https://cdn.glitch.global/cfe14639-265a-43cf-81e0-5d469823940c/bullet.png?v=1696353116845");

Input.add_action("left", ["KeyA", Input.AXIS_GAMEPAD_LEFT_STICK_LEFT]);
Input.add_action("right", ["KeyD", Input.AXIS_GAMEPAD_LEFT_STICK_RIGHT]);
Input.add_action("jump", ["Space", "KeyW", Input.BUTTON_GAMEPAD_NINTENDO_B]);

const offCanvas = new OffscreenCanvas(320, 240);
const octx = offCanvas.getContext("2d");
octx.imageSmoothingEnabled = false;

const canvas = $("#canvas");
canvas.width = 640;
canvas.height = 480;
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

class Line {
	constructor(sx, sy, ex, ey, type, data) {
		this.sx = sx;
		this.sy = sy;
		this.ex = ex;
		this.ey = ey;
	}
	
	draw(offset) {
		if (offset) {
			ctx.moveTo(this.sx + offset.x, this.sy + offset.y);
			ctx.lineTo(this.ex + offset.x, this.ey + offset.y);
		} else {
			ctx.moveTo(this.sx, this.sy);
			ctx.lineTo(this.ex, this.ey);
		}
	}
}

const position = new Vector2(128, 98);
const velocity = new Vector2(0, 0);

const gravity = 0.5;
const fallGravity = 0.7;
const jumpForce = 5;
const acceleration = 1;
const decceleration = 0.4;
const maxSpeed = 4;

var squashT = 0;
var stretchT = 0;
var flipH = false;

var moveT = 0;

var coyoteTime = 0;
var jumpBuffer = 0;

const maxCoyoteTime = 8;
const maxJumpBuffer = 8;

var snappedTo = null;

// const geometry = [
// ];

const playerCollision = new CollisionObject(0, 0, 14, 14);

function isColliding() {
	playerCollision.position.copy(position);
	for (let rock of rocks) {
		for (let line of rock.collisions) {
			if (playerCollision.intersectsLineValues(line.sx + rock.offset.x, line.sy + rock.offset.y, line.ex + rock.offset.x, line.ey + rock.offset.y)) {
			// if (playerCollision.intersectsLine(line)) {
				return rock;
			}
		}
	}
}

function update() {
	squashT--;
	stretchT--;
	coyoteTime--;
	jumpBuffer--;
	
	// snappedTo = null;
	
	let moving = false;
	let bothlr = false;
	
	const lastFlipH = flipH;
	
	if (Input.is_action_pressed("left")) {
		velocity.x -= acceleration;
		flipH = true;
		moving = true;
		bothlr = true;
	}
	
	if (Input.is_action_pressed("right")) {
		velocity.x += acceleration;
		flipH = false;
		moving = true;
	} else {
		bothlr = false;
	}
	
	if (bothlr) {
		flipH = lastFlipH;
	}
	
	if (moving) {
		if (Math.abs(velocity.x) > maxSpeed) {
			velocity.x = Math.sign(velocity.x) * maxSpeed;
		}
	}
	if (!moving || bothlr) {
		if (velocity.x > 0.1) {
			velocity.x -= decceleration;
		} else if (velocity.x < -0.1) {
			velocity.x += decceleration;
		} else {
			velocity.x = 0;
		}
	}
	
	// snappedTo = null;
	
	position.x += velocity.x;
	if (isColliding()) {
		position.y -= 5;
		if (!isColliding()) {
			while (!isColliding()) {
				position.y += 0.1;
			}
			position.y -= 0.1;
			stretchT = 0;
		} else {
			position.y += 5;
			while (isColliding()) {
				position.x -= Math.sign(velocity.x) * 0.1 || 0.1;
			}
			if (Math.abs(velocity.x) > 2) {
				stretchT = 5;
			}
			velocity.x = 0;
		}
	}
	
	velocity.y += velocity.y > 0 ? fallGravity : gravity;
	position.y += velocity.y;
	
	if (Input.is_action_just_pressed("jump")) {
		jumpBuffer = maxJumpBuffer;
	}
	
	const collision = isColliding();
	if (collision) {
		// if (!snappedTo) {
		//   position.subtract(collision.offset);
		// }
		snappedTo = collision;
		while (isColliding()) {
			position.y -= Math.sign(velocity.y) * 0.1 || 0.1;
		}
		if (velocity.y > gravity * 5) {
			squashT = 10;
		}
		collision.push(0, (velocity.y - gravity) / collision.mass);
		velocity.y = 0;
		coyoteTime = maxCoyoteTime;
		squashT = Math.max(squashT, Math.abs(velocity.x));
	} else {
		snappedTo = null;
	}
	
	if (coyoteTime > 0 && jumpBuffer > 0) {
		// position.add(snappedTo.offset);
		snappedTo = null;
		coyoteTime = 0;
		jumpBuffer = 0;
		velocity.y = -jumpForce;
		stretchT = 10;
	}
	
	if (snappedTo) {
		// position.add(snappedTo.offsetOffset);
	}
}

const mousePos = new Vector2(0, 0);
var mouseIn = false;
const mouseCollision = new CollisionObject(0, 0, 10, 10);
var playerGrabbed = false;
var playerPositionOffset = new Vector2(0, 0);

canvas.onmousemove = function (e) {
	mouseIn = true;
	const rect = canvas.getBoundingClientRect();
	mousePos.set(
		(e.clientX - rect.x) / rect.width * canvas.width / 2,
		(e.clientY - rect.y) / rect.height * canvas.height / 2
	);
}

canvas.onmousedown = function (e) {
	playerCollision.position.copy(position);
	mouseCollision.position.set(mousePos.x - 32, mousePos.y - 32);
	if (mouseCollision.intersects(playerCollision)) {
		playerGrabbed = true;
		playerPositionOffset = position.subtractedValues(mousePos.x - 32, mousePos.y - 32);
	}
}

canvas.onmouseup = function (e) {
	playerGrabbed = false;
}

canvas.onmouseout = function (e) {
	mouseIn = false;
	playerGrabbed = false;
}

function drawRock(rock, x, y, r) {
	ctx.translate(x + rock.width / 2, y + rock.height / 2);
	ctx.rotate(r);
	ctx.drawImage(rock, -rock.width / 2, -rock.height / 2);
	ctx.rotate(-r);
	ctx.translate(-x - rock.width / 2, -y - rock.height / 2);
}

var r = 0;

var cannon1angle = 0;
var cannon2angle = Math.PI;
var cannon1charge = 0;
var cannon2charge = 0;
var cannon1delay = 50;
var cannon2delay = 0;

const bulletCollision = new CollisionObject(0, 0, 16, 16);

const bullets = [];

class Bullet {
	constructor(x, y, r) {
		this.position = new Vector2(x, y);
		this.rotation = r;
		
		this.speed = 3 + Math.random();
		
		this.t = 0;
	}
	
	isColliding() {
		bulletCollision.position.copy(this.position);
		for (let rock of rocks) {
			for (let line of rock.collisions) {
				if (bulletCollision.intersectsLine(line)) {
					return true;
				}
			}
		}
	}
	
	update() {
		this.t++;
		if (this.t > 180 || this.isColliding()) {
			bullets.splice(bullets.indexOf(this), 1);
		}
		this.position.addValues(Math.cos(this.rotation) * this.speed, Math.sin(this.rotation) * this.speed);
	}
	
	draw() {
		const frame = Math.floor(this.t / 2) % 8;
		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(this.rotation);
		ctx.drawImage(bullet, (frame % 3) * 32, Math.floor(frame / 3) * 32, 32, 32, -16, -16, 32, 32);
		ctx.rotate(-this.rotation);
		ctx.translate(-this.position.x, -this.position.y);
	}
}

class Rock {
	constructor(img, x, y, collisions = [], mass = 1) {
		this.img = img;
		this.position = new Vector2(x, y);
		this.offset = new Vector2(0, 0);
		this.lastOffset = new Vector2(0, 0);
		this.offsetOffset = new Vector2(0, 0);
		this.willOffset = new Vector2(0, 0);
		this.rotation = 0;
		this.mass = mass;
		this.collisions = collisions;
		
		this.resetOffset = true;
	}
	
	push(x, y) {
		// console.log(x, y)
		this.offset.addValues(x, y);
	}
	
	update() {
		// this.offsetOffset = this.offset.subtracted(this.lastOffset);
		if (this.resetOffset) {
			this.offset.x *= 0.9;
			this.offset.y *= 0.9;
			// if (this.offset.length < 0.5) {
			//   this.offset.set(0, 0);
			// }
		}
		// this.offset.add(this.willOffset);
		// this.willOffset.set(0, 0);
		// this.lastOffset.copy(this.offset);
	}
	
	draw() {
		ctx.translate(this.position.x + this.offset.x + this.img.width / 2, this.position.y + this.offset.y + this.img.height / 2);
		ctx.rotate(this.rotation);
		ctx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2);
		ctx.rotate(-this.rotation);
		ctx.translate(-this.position.x - this.offset.x - this.img.width / 2, -this.position.y - this.offset.y - this.img.height / 2);
	}
}

const rocks = [
	new Rock(land, 48, 111, [
		new Line(50, 112, 205, 112),
		new Line(207, 114, 207, 161),
		new Line(201, 167, 207, 161),
		new Line(201, 167, 181, 175),
		new Line(74, 175, 181, 175),
		new Line(74, 175, 54, 167),
		new Line(48, 161, 54, 167),
		new Line(48, 161, 48, 114),
		new Line(50, 112, 48, 114),
	], 7),
	new Rock(rock5, -25, 88, [
		new Line(-9, 106, 4, 106),
		new Line(4, 108, 4, 106),
		new Line(4, 108, 17, 108),
		new Line(17, 114, 17, 108),
		new Line(17, 114, 21, 114),
		new Line(21, 123, 21, 114),
		new Line(21, 123, 19, 123),
		new Line(19, 132, 19, 123),
		new Line(19, 132, 3, 132),
		new Line(3, 129, 3, 132),
		new Line(3, 129, -3, 129),
		new Line(-3, 117, -3, 129),
		new Line(-3, 117, -9, 117),
		new Line(-9, 106, -9, 117),
	]),
	new Rock(rock1, 9, 3),
	new Rock(rock2, 57, -18),
	new Rock(rock3, 107, -17),
	new Rock(rock4, 161, -6),
	new Rock(rock6, 217, 88, [
		new Line(232, 112, 244, 112),
		new Line(244, 106, 244, 112),
		new Line(244, 106, 264, 106),
		new Line(264, 132, 264, 106),
		new Line(264, 132, 241, 132),
		new Line(241, 128, 241, 132),
		new Line(241, 128, 232, 128),
		new Line(232, 112, 232, 128),
	]),
];

function drawCannon(x, y, id, r) {
	ctx.translate(x + cannon.width / 4, y + cannon.height / 4);
	ctx.rotate(r);
	ctx.drawImage(cannon, 70 * (id % 2), 70 * Math.floor(id / 2), 70, 70, -cannon.width / 4, -cannon.height / 4, 70, 70);
	ctx.rotate(-r);
	ctx.translate(-x - cannon.width / 4, -y - cannon.height / 4);
}
// rocks[0].resetOffset = true;

function drawClouds() {
	ctx.fillStyle = "#301f36";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function addBullet(cx, cy, dist, cr) {
	const bx = cx + Math.cos(cr) * dist;
	const by = cy + Math.sin(cr) * dist;
	bullets.push(new Bullet(bx, by, cr));
}

function animate() {
	requestAnimationFrame(animate);
	
	r += 0.01;
	
	update();
	for (let bullet of bullets) {
		bullet.update();
	}
	for (let rock of rocks) {
		rock.update();
	}
	
	if (cannon1delay <= 0) {
		cannon1charge += 0.1;
		if (cannon1charge >= 4) {
			cannon1charge = 3;
			cannon1delay = 60;
			addBullet(15, 52, 20, cannon1angle);
		}
	} else {
		cannon1delay--;
		cannon1charge = 0;
	}
	
	if (cannon2delay <= 0) {
		cannon2charge += 0.1;
		if (cannon2charge >= 4) {
			cannon2charge = 3;
			cannon2delay = 60;
			addBullet(241, 52, 20, cannon2angle);
		}
	} else {
		cannon2delay--;
		cannon2charge = 0;
	}
	
	if (playerGrabbed) {
		velocity.set(0, 0);
		position.set(mousePos.x - 32, mousePos.y - 32);
		position.add(playerPositionOffset);
	}
	
	// if (snappedTo == rocks[0]) {
	//   let o = position.x - rocks[0].position.x;
	//   o -= land.width / 2;
	//   rocks[0].rotation = o / 4000;
	// } else {
	//   rocks[0].rotation += (-rocks[0].rotation) * 0.1;
	// }
	
	
	
	// ctx.drawImage(full, 0, 0);
	
	drawClouds();
	
	ctx.scale(2, 2);
	ctx.translate(32, 32);
	
	
	ctx.strokeStyle = "green";
	ctx.lineWidth = 3;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.beginPath();
	for (let rock of rocks) {
		for (let line of rock.collisions) {
			// line.draw(rock.offset);
		}
	}
	ctx.stroke();
	
	rocks[2].offset.set(Math.cos(r * 0.2), Math.sin(r * 2) * 5 - 30);
	rocks[2].rotation = Math.cos(r) * 0.07;
	rocks[3].offset.set(0, Math.sin(r * 1.7 + Math.PI / 2) * 6 - 30);
	rocks[3].rotation = Math.cos(r * 1.7 + Math.PI / 2) * 0.07;
	rocks[4].offset.set(0, Math.sin(r * 2.4 + Math.PI / 2 * 3) * 9 - 30);
	rocks[4].rotation = Math.cos(r * 2.4) * 0.1;
	rocks[5].offset.set(0, Math.sin(r * 0.9 + 9.0712) * 12 - 30);
	rocks[5].rotation = Math.cos(r * 0.3 + 7.0712) * 0.15;
	
	ctx.drawImage(background, 0, rocks[0].offset.y);
	
	for (let bullet of bullets) {
		bullet.draw();
	}
	
	const stretch = 1 + (Math.max(stretchT, 0) / 20);
	const squash = 1 + (Math.max(squashT, 0) / 20);
	const szex = 16 / stretch * squash;
	const szey = 16 / squash * stretch;
	const x = position.x;// + (snappedTo ? snappedTo.offset.x : 0);
	const y = position.y;// + (snappedTo ? snappedTo.offset.y : 0);
	ctx.translate(x, y);
	if (flipH) {
		ctx.scale(-1, 1);
	}
	ctx.drawImage(reg, -8 * squash / stretch, -8 * stretch / squash / squash, szex, szey);
	ctx.resetTransform();
	ctx.scale(2, 2);
	ctx.translate(32, 32);
	
	const dy = position.y - (17 + 35);
	const dx = position.x - (-20 + 35);
	cannon1angle = rLerp(cannon1angle, Math.atan2(dy, dx), 0.1);
	drawCannon(-20, 17, Math.floor(cannon1charge), cannon1angle);
	const dy2 = position.y - (17 + 35);
	const dx2 = position.x - (206 + 35);
	cannon2angle = rLerp(cannon2angle, Math.atan2(dy2, dx2), 0.1);
	drawCannon(206, 17, Math.floor(cannon2charge), cannon2angle);
	
	
	for (let rock of rocks) {
		rock.draw();
	}
	ctx.resetTransform();
	
	
	if (mouseIn) {
		ctx.drawImage(reg, mousePos.x * 2, mousePos.y * 2, 12, 14);
	}
}

function wait() {
	if (imagesToLoad == imagesLoaded) {
		animate();
	} else {
		requestAnimationFrame(wait);
	}
}

wait();