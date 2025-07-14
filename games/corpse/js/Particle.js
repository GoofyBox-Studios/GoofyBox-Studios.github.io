const skullSwirlImage = new Sprite("/assets/corpse/Skull Swirl.png");

class Particle {
	constructor(type, x, y, dieAtEnd = true, speed = 0.3, vel, damp, darken = false) {
		this.position = new Vector2(x, y);
		this.speed = speed;
		this.alpha = 0.7;

		this.darken = darken;

		this.dieAtEnd = dieAtEnd;
		this.lifetime = 99999999;

		this.type = type;
		this.vel = vel;
		this.damp = damp;

		switch (this.type) {
			case 0:
				this.start = 0;
				this.end = 15;
				this.alpha = 0.9;
				break;
			case 1:
				this.lifetime = 9999999;
				this.start = 16;
				this.end = 19;
				this.alpha = 0.8;
				this.flipX = Math.random() < 0.5;
				this.flipY = Math.random() < 0.5;
				break;
			case 2:
				this.start = 20;
				this.end = 20;
				this.dieAtEnd = false;
				this.alpha = 0.15;
				this.lifetime = 20;
				break;
			case 3:
				this.start = 21;
				this.end = 30;
				this.dieAtEnd = true;
				this.alpha = 0.7;
				this.speed = 0.5;
				break;
		}

		this.frame = this.start;
	}

	update() {
		this.frame += this.speed;
		this.lifetime -= 1;
		if (this.frame > this.end) {
			if (this.dieAtEnd) {
				particles.splice(particles.indexOf(this), 1);
			} else {
				this.frame = this.start;
			}
		}
		if (this.lifetime <= 0) {
			particles.splice(particles.indexOf(this), 1);
		}
		if (this.vel) {
			this.position.x += this.vel.x;
			this.position.y += this.vel.y;

			this.vel.x *= this.damp;
			this.vel.y *= this.damp;
		}
	}

	draw() {
		ctx.save();

		let uv = particleSprites[Math.round(this.frame)].uv;

		if (this.type == 1) ctx.globalCompositeOperation = "lighten";
		if (this.darken) ctx.filter = "brightness(50%)";

		ctx.globalAlpha = this.alpha;

		ctx.scale(this.flipX ? -1 : 1, this.flipY ? -1 : 1);
		ctx.drawImage(images.player, uv[0], uv[1], uv[2], uv[3], Math.round(this.position.x + (this.flipX ? 16 : 0)) * (this.flipX ? -1 : 1), Math.round(this.position.y + (this.flipY ? 16 : 0)) * (this.flipY ? -1 : 1) + (this.flipY ? 0 : 0), uv[2], uv[3]);

		ctx.restore();
	}
}

class NewParticle {
	constructor(x, y, options = {}) {
		this.position = new Vector2(x, y);
		this.velocity = options.velocity ?? new Vector2(0, 0);
		this.velocityDamp = options.velocityDamp ?? 1.0;
		this.sprite = options.sprite;
		this.frameCount = options.frameCount;
		this.framesPerSecond = options.framesPerSecond ?? 1;
		this.width = options.width ?? 16;
		this.height = options.height ?? 16;
		this.alpha = options.alpha ?? 1.0;

		this.frame = -this.framesPerSecond / 60;
		// this.lifetime = 0;
	}

	update() {
		this.frame += this.framesPerSecond / 60;
		// if (this.frame > this.frameCount) {
		// if (this.dieAtEnd) {
		// particles.splice(particles.indexOf(this), 1);
		// } else {
		// this.frame = this.start;
		// }
		// }

		// if (this.lifetime <= 0) {
		// 	particles.splice(particles.indexOf(this), 1);
		// }

		this.position.add(this.velocity);

		this.velocity.x *= this.velocityDamp;
		this.velocity.y *= this.velocityDamp;
	}

	draw() {
		ctx.save();

		const frame = Math.floor(this.frame);
		const uv = new UV((frame % Math.floor(this.sprite.width / this.width)) * this.width, Math.floor(frame / Math.floor(this.sprite.width / this.width)) * this.height, this.width, this.height);

		// if (this.type == 1) ctx.globalCompositeOperation = "lighten";
		// if (this.darken) ctx.filter = "brightness(50%)";

		// ctx.globalAlpha = this.alpha;

		// ctx.scale(this.flipX ? -1 : 1, this.flipY ? -1 : 1);
		ctx.translate(this.position.x, this.position.y);
		ctx.drawImage(skullSwirlImage, uv.x, uv.y, uv.width, uv.height, -uv.width / 2, -uv.height / 2, uv.width, uv.height);

		ctx.restore();
	}
}

class DeathParticle extends NewParticle {
	constructor(x, y) {
		super(x, y, {
			velocity: new Vector2(0, -1),
			velocityDamp: 0.9,
			sprite: skullSwirlImage,
			frameCount: 15,
			framesPerSecond: 18,
			width: 32,
			height: 32,
			alpha: 0.9,
		});
	}
}

class Emitter {
	constructor(x, y, settings, rate) {
		this.position = new Vector2(x, y);
		this.settings = settings;
		this.rate = rate;
		this.frame = 0;
		this.added = false;
	}

	update() {
		this.frame++;
		if (this.frame % this.rate == 0) {
			let p = new Particle(...this.settings());
			p.emitter = this;
			particles.push(p);
		}
		if (!this.added) {
			let set = this.settings();
			let p = new Particle(set[0], set[1], set[2] + 0, false, 0, new Vector2(0, 0), 0);
			particles.push(p);
			this.added = true;
		}
	}
}
