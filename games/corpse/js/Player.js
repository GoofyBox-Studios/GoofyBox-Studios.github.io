const playerSprite = new Sprite("/assets/corpse/MarkusYoung.png");
var playerSprites = {
	stand: { uv: [0, 0, 16, 19], flags: [0] },
	dead: { uv: [48, 19, 16, 19], flags: [0] },
	jump: { uv: [0, 19, 16, 19], flags: [0] },
	fall: { uv: [16, 19, 16, 19], flags: [0] },
	walk0: { uv: [16, 0, 16, 19], flags: [0] },
	walk1: { uv: [32, 0, 16, 19], flags: [0] },
	walk2: { uv: [48, 0, 16, 19], flags: [0] },
};

class Player {
	constructor() {
		this.gravity = 0.27;
		this.slide = 0.85;
		this.jumpHeight = 4.5;
		this.speed = 0.45;
		this.maxCoyoteTime = 4;
		this.maxFrameBuffer = 6;
		this.fallMult = 0.8;
		this.maxRespawn = 60;
		this.maxBurnTime = 110;

		this.flipX = false;
		this.flipY = false;

		this.spawn = new Vector2(0, 32);
		this.position = new Vector2(this.spawn.x, this.spawn.y);
		this.velocity = new Vector2(0, 0);

		this.onGround = false;
		this.falling = false;
		this.coyoteTime = 0;
		this.frameBuffer = 0;
		this.respawn = 0;
		this.respawning = false;

		this.deaths = 0;
		this.animation = "stand";
		this.walkAnimationTime = 0;
		this.walkingSpeed = 1.5;

		this.burnTime = 0;
		this.burning = false;

		this.deathPosition = new Vector2(0, 0);

		this.collision = new Collision(6, 14, 5, 3.5);
	}

	burn() {
		for (let e in emitters) {
			let emitter = emitters[e];
			if (colliding(this, new Obj(emitter.position.x, emitter.position.y, 16, 16))) {
				return true;
			}
		}
	}

	collidingWithEntity() {
		for (let corpse of corpses) {
			if (colliding(this, corpse)) return corpse;
		}

		for (let entity of entities) {
			if (colliding(this, entity)) return entity;
		}

		return null;
	}

	colliding(flag) {
		if (this.position.x + this.collision.offsetX < 0) {
			return true;
		}
		if (this.position.x + this.collision.offsetX + this.collision.width > 256) {
			return true;
		}
		let corpse = false;
		if (flag == undefined) {
			flag = 0;
			corpse = true;
		}
		let stX = 0;
		let stY = 0;
		let endX = width - 1;
		let endY = height - 1;
		// if (corpse) {
		// 	for (let corpse of corpses) {
		// 		if (colliding(this, corpse)) {
		// 			return true;
		// 		}
		// 	}
		// }
		// if (true) {
		// 	for (let e in entities) {
		// 		let entity = entities[e];
		// 		if (colliding(this, entity)) {
		// 			entity.nextCollider = this;
		// 			entity.collider = this;
		// 			return true;
		// 		}
		// 	}
		// }
		for (let y = stY; y <= endY; y++) {
			for (let x = stX; x <= endX; x++) {
				let tile = ground.tiles[y][x].id;
				if (tile > 0) {
					const collision = blockSprites[tile].collision || [0, 0, 16, 16];

					let bX = x * 16 + collision[0];
					let bY = y * 16 + collision[1];
					let bW = collision[2];
					let bH = collision[3];
					if (blockSprites[tile].flags.includes(flag) && colliding(this, new Obj(bX, bY, bW, bH))) {
						return [true, x, y];
					}
				}
			}
		}
	}

	kill(destroyCorpse = false, cogging = false, keepVelocity = false) {
		clippingSize = 170;
		this.deathPosition = new Vector2(this.position.x, this.position.y);
		if (!destroyCorpse) {
			let c = new Corpse(this.position.x + 0, this.position.y + 0);
			c.cogging = cogging;
			if (keepVelocity) c.velocity = this.velocity.clone();
			corpses.push(c);
		}

		particles.push(new DeathParticle(this.position.x + 4, this.position.y));

		this.position.y = 200e20;
		this.deaths++;
		this.burning = false;
		this.burnTime = 0;
		keys = {};
		soundBank.death.play();

		if (this.deaths < maxDeaths) {
			this.respawning = true;
			this.respawn = 0;
		}
	}

	update() {
		this.frameBuffer -= 1;
		this.coyoteTime -= 1;
		this.onGround = false;

		if (Input.is_action_just_pressed("jump")) {
			this.frameBuffer = this.maxFrameBuffer;
		}

		this.falling = this.velocity.y > 0;
		if (this.falling) {
			this.velocity.y += this.gravity * this.fallMult;
		} else {
			this.velocity.y += this.gravity;
		}

		this.position.y += this.velocity.y;
		if (this.colliding() || this.collidingWithEntity()) {
			const entityCollision = this.collidingWithEntity();
			if (entityCollision) {
				if (this.velocity.y > 0) {
					let groundY = Utils.roundTo(entityCollision.position.y + entityCollision.collision.offsetY, 0.1);
					this.position.y = groundY - 18;
				} else if (this.velocity.y <= 0) {
					let ceilingY = Utils.roundTo(entityCollision.position.y + entityCollision.collision.offsetY + entityCollision.collision.height, 0.1);
					this.position.y = ceilingY - 3;
				}

				entityCollision.nextCollider = this;
				entityCollision.collider = this;
			}

			while (this.colliding()) {
				this.position.y -= (Math.sign(this.velocity.y) || 1) * 0.01;
			}
			this.onGround = this.velocity.y >= 0;
			if (this.onGround) {
				this.coyoteTime = this.maxCoyoteTime;
			}
			this.velocity.y = 0;
		}

		if (this.coyoteTime > 0 && (this.frameBuffer > 0 || Input.is_action_pressed("jump"))) {
			this.velocity.y = -this.jumpHeight;
			// this.onGround = false;
			this.frameBuffer = 0;
			this.coyoteTime = 0;
			soundBank.jump.play();
			particles.push(new Particle(3, this.position.x, this.position.y + 2));
		}

		if (Input.is_action_pressed("left")) {
			this.velocity.x -= this.speed;
			this.flipX = true;
		}

		if (Input.is_action_pressed("right")) {
			this.velocity.x += this.speed;
			this.flipX = false;
		}

		if (Math.abs(this.velocity.x) > this.walkingSpeed) {
			this.walkAnimationTime += 0.3;
		} else {
			this.walkAnimationTime = 0.0;
		}

		this.velocity.x *= this.slide;

		this.position.x += this.velocity.x;
		if (this.colliding() || this.collidingWithEntity()) {
			const entityCollision = this.collidingWithEntity();
			if (entityCollision) {
				if (this.velocity.x > 0) {
					let leftX = Utils.roundTo(entityCollision.position.x + entityCollision.collision.offsetX, 0.1);
					this.position.x = leftX - this.collision.width - this.collision.offsetX - 1;
				} else {
					let rightX = Utils.roundTo(entityCollision.position.x + entityCollision.collision.offsetX + entityCollision.collision.width, 0.1);
					this.position.x = rightX - this.collision.offsetX + 1;
				}

				// entityCollision.nextCollider = this;
				// entityCollision.collider = this;
			}

			while (this.colliding()) {
				this.position.x -= (Math.sign(this.velocity.x) || 1) * 0.01;
			}
			this.velocity.x = 0;
		}

		if (this.respawning) {
			this.respawn++;
			if (this.respawn >= this.maxRespawn) {
				this.respawning = false;
				this.position.x = this.spawn.x;
				this.position.y = this.spawn.y;
				this.velocity = new Vector2(0, 0);
			}
		}

		if (this.colliding(1)) {
			this.kill(false, false, true);
		}

		let t = this.colliding(2);
		if (t && t[0]) {
			// door
			particles.push(new Particle(2, t[1] * 16 - 1, t[2] * 16 + 9));
			if (Input.is_action_just_pressed("enter")) {
				currentLevel++;
				loadLevel(currentLevel);
				this.deaths = 0;
				this.position.x = this.spawn.x;
				this.position.y = this.spawn.y;
				this.burning = false;
				this.burnTime = 0;
				while (!this.colliding()) {
					this.position.y += 1;
				}
				this.position.y -= 1;
				this.spawn.copy(this.position);
			}
		}

		let save = this.colliding(4);
		if (save && save[0]) {
			// save
			this.spawn.x = save[1] * 16;
			this.spawn.y = save[2] * 16;
		}

		if (this.burn() && !this.burning) {
			this.burning = true;
			this.burnTime = 0;
		}

		if (this.burning) {
			this.burnTime++;
			particles.push(new Particle(1, this.position.x + Math.random() * 12 - 6, this.position.y + Math.random() * 12 - 4, true, 0.07, new Vector2((Math.random() - 0.5) / 2, -0.6), 0.99 + Math.random() * 0.01));
			particles.push(new Particle(1, this.position.x + Math.random() * 12 - 6, this.position.y + Math.random() * 12 - 4, true, 0.07, new Vector2((Math.random() - 0.5) / 2, -0.6), 0.99 + Math.random() * 0.01));
			if (this.burnTime >= this.maxBurnTime) {
				// player is burnt
				this.kill();
			}
		}

		if (this.deaths >= maxDeaths) {
			clippingSize -= 2.5;
			if (clippingSize <= -60) {
				clippingSize = 1000;
				loadLevel(currentLevel);
				this.deaths = 0;
				this.position.x = this.spawn.x;
				this.position.y = this.spawn.y;
			}
		}
	}

	draw() {
		if (this.coyoteTime <= 0) {
			if (this.velocity.y > 0) {
				this.animation = "fall";
			} else {
				this.animation = "jump";
			}
		} else if (Math.abs(this.velocity.x) > this.walkingSpeed) {
			this.animation = "walk" + Math.floor(this.walkAnimationTime % 3);
		} else {
			this.animation = "stand";
		}

		let sc = (this.flipX && -1) || 1;
		let oX = (this.flipX && -16) || 0;
		let uv = playerSprites[this.animation].uv;
		let x = this.position.x * sc + oX + 8;
		let y = this.position.y + 8.5;

		if (this.flipX) ctx.scale(-1, 1);
		ctx.translate(x, y);

		ctx.drawImage(playerSprite, uv[0], uv[1], uv[2], uv[3], uv[2] / -2, uv[3] / -2, uv[2], uv[3]);

		ctx.translate(-x, -y);
		if (this.flipX) ctx.scale(-1, 1);
	}
}

class Corpse {
	constructor(x, y, p = new Player(x, y)) {
		this.gravity = p.gravity;
		this.slide = p.slide;
		this.fallMult = 1.3;

		this.flipX = false;
		this.flipY = false;

		this.position = new Vector2(x, y - 2);
		this.velocity = new Vector2(0, p.velocity.y);

		this.onGround = false;
		this.falling = false;
		this.landed = false;

		this.cogging = false;

		this.collision = new Collision(16, 9, 0, 10);

		if (this.colliding()) {
			const startX = this.position.x;
			const startY = this.position.y;
			main: for (let dist = 1; dist <= 16; dist++) {
				for (let theta = 0; theta <= Math.PI * 2.0; theta += Math.PI * 0.25) {
					const offsetX = Math.cos(theta) * dist;
					const offsetY = Math.sin(theta) * dist;

					this.position.x = startX + offsetX;
					this.position.y = startY + offsetY;

					if (!this.colliding()) break main;
				}
			}
		}

		this.ignore = [];
		for (let corpse of corpses) {
			if (colliding(this, corpse)) this.ignore.push(corpse);
		}
	}

	colliding(flag = 0) {
		let stX = 0;
		let stY = 0;
		let endX = width - 1;
		let endY = height - 1;

		for (let y = stY; y <= endY; y++) {
			for (let x = stX; x <= endX; x++) {
				let tile = ground.tiles[y][x].id;
				if (tile > 0) {
					const collision = blockSprites[tile].collision || [0, 0, 16, 16];

					let bX = x * 16 + collision[0];
					let bY = y * 16 + collision[1];
					let bW = collision[2];
					let bH = collision[3];
					if (blockSprites[tile].flags.includes(flag) && colliding(this, new Obj(bX, bY, bW, bH))) {
						return [true, x, y];
					}
				}
			}
		}
	}

	collidingWithEntity() {
		for (let corpse of corpses) {
			if (corpse == this) continue;
			if (this.ignore.includes(corpse)) continue;

			if (colliding(this, corpse)) return corpse;
		}

		for (let entity of entities) {
			if (colliding(this, entity)) return entity;
		}

		return null;
	}

	draw() {
		// ctx.fillStyle = "#e8beac";
		let sc = (this.flipX && -1) || 1;
		let oX = (this.flipX && -16) || 0;
		let uv = playerSprites.dead.uv;

		if (this.flipX) ctx.scale(-1, 1);
		ctx.drawImage(playerSprite, uv[0], uv[1], uv[2], uv[3], Math.floor(this.position.x) * sc + oX, Math.floor(this.position.y + 1), uv[2], uv[3]);
		if (this.flipX) ctx.scale(-1, 1);
	}

	update() {
		this.onGround = false;

		this.velocity.x *= this.slide;

		if (!this.landed) {
			this.velocity.y += this.gravity;

			this.falling = this.velocity.y > 0;
			if (this.falling) {
				this.velocity.y -= this.gravity;
				this.velocity.y += this.gravity * this.fallMult;
			}
		}

		this.position.y += this.velocity.y;
		if (!this.landed && (this.colliding() || this.collidingWithEntity())) {
			const entityCollision = this.collidingWithEntity();
			if (entityCollision) {
				if (this.velocity.y > 0) {
					let groundY = Utils.roundTo(entityCollision.position.y + entityCollision.collision.offsetY, 0.1);
					this.position.y = groundY - 18;
				} else if (this.velocity.y <= 0) {
					let ceilingY = Utils.roundTo(entityCollision.position.y + entityCollision.collision.offsetY + entityCollision.collision.height, 0.1);
					this.position.y = ceilingY - 3;
				}

				// entityCollision.nextCollider = this;
				// entityCollision.collider = this;
			}

			while (this.colliding()) {
				this.position.y -= (Math.sign(this.velocity.y) || 1) * 0.01;
			}
			this.onGround = this.velocity.y >= 0;
			this.velocity.y = 0;
			this.position.y = Math.round(this.position.y);
			this.landed = true;
		}

		// this.position.y += this.velocity.y;
		// if (this.colliding()) {
		// 	while (this.colliding()) {
		// 		this.position.y -= Math.sign(this.velocity.y) || 1;
		// 	}
		// 	this.onGround = (this.velocity.y >= 0);
		// 	this.velocity.y = 0;
		// this.position.y = Math.round(this.position.y);
		// this.landed = true;
		// }

		// this.position.x += this.velocity.x;
		if (!this.landed && this.colliding()) {
			//  || this.collidingWithEntity()
			// const entityCollision = this.collidingWithEntity();
			// if (entityCollision) {
			//   if (this.velocity.x > 0) {
			//     let leftX = Utils.roundTo(entityCollision.position.x + entityCollision.collision.offsetX, 0.1);
			//     this.position.x = leftX - this.collision.width - this.collision.offsetX - 1;
			//   } else {
			//     let rightX = Utils.roundTo(entityCollision.position.x + entityCollision.collision.offsetX + entityCollision.collision.width, 0.1);
			//     this.position.x = rightX - this.collision.offsetX + 1;
			//   }

			// entityCollision.nextCollider = this;
			// entityCollision.collider = this;
			// }

			while (this.colliding()) {
				this.position.x -= (Math.sign(this.velocity.x) || 1) * 0.01;
			}
			this.velocity.x = 0;
		}
	}
}
