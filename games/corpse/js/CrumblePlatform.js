const fallingPlatformSprites = [new Sprite("https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/fallingPlatformBrown.png?v=1715480822340"), new Sprite("https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/fallingPlatformGreen.png?v=1715480822575"), new Sprite("https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/fallingPlatformGrey.png?v=1715480822848")];

class CrumblePlatform {
	constructor(x, y, blockWidth) {
		this.position = new Vector2(x * 16, y * 16);
		this.collision = new Collision(blockWidth * 16, 16, 0, 0);
		this.blockWidth = blockWidth;

		this.maxDelay = 60;

		this.collider = null;
		this.nextCollider = null;

		this.delay = -1;
		this.shake = 0;
		this.falling = false;

		this.velY = 1;
	}

	draw() {
		// for (let x = 0; x < this.blockWidth; x++) {
		ctx.drawImage(fallingPlatformSprites[0], 0, this.delay >= 10 ? 16 : 0, 32, 16, this.position.x + this.shake, this.position.y, 32, 16);
		// }
	}

	update() {
		if (this.collider) {
			if (this.collider.onGround && this.delay == -1) {
				this.delay = 0;
				soundBank.crumbled.play();
			}
		}
		if (this.delay >= 0) {
			this.delay++;
			this.shake = Math.round(Math.sin(this.delay / 1.5) * 1.5);
			if (this.delay >= this.maxDelay * (2 / 3)) {
				this.shake = 0;
			}
		}
		if (this.delay > this.maxDelay) {
			this.collision = new Collision(0, 0);
			this.falling = true;
		}
		if (this.falling) {
			this.velY += 0.3;
			this.position.y += this.velY;
			if (this.position.y >= 240) {
				entities.splice(entities.indexOf(this), 1);
			}
		}
		this.collider = this.nextCollider;
		this.nextCollider = null;
	}
}
