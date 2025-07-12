/* global Vector2 RoundCollision ctx colliding images scale player corpses */

function Cog(x, y, counterClockwise) {
	this.position = new Vector2(x * 16, y * 16);
	this.collision = new RoundCollision(32, 16, 16);
	this.time = 0;
	this.rotation = counterClockwise ? 22.5 : 0;
	this.counterClockwise = counterClockwise;
	this.twin = null;
	this.hitting = false;
	this.speed = 5;

	this.corpses = 0;

	this.draw = function() {
		ctx.save();
		ctx.translate((this.position.x + 16) * scale, (this.position.y + 16) * scale);
		ctx.rotate(Math.floor(this.rotation / 22.5) * 22.5 / 360 * (Math.PI * 2) * (this.counterClockwise ? -1 : 1));
		ctx.drawImage(images.spritesheet1, (this.counterClockwise ? 32 : 0), 0, 32, 32, -32 * scale, -32 * scale, 64 * scale, 64 * scale);
		ctx.restore();
	};

	this.update = function() {
		this.hitting = false;
		this.corpses = 0;
		this.time += 1;
		if (this.time % this.speed == 0) {
			this.rotation += 22.5;
		}
		this.collision = new RoundCollision(34, 16, 16);
		if (player.onGround && colliding(this, player)) {
			this.hitting = true;
			if (player.position.y > this.position.y) {
				player.velocity.x -= (this.counterClockwise ? -1 : 1) * (1 / this.speed) * 12;
			} else {
				player.velocity.x += (this.counterClockwise ? -1 : 1) * (1 / this.speed) * 12;
			}
			if (Math.abs(this.position.x - player.position.x) > 10) {
				if (player.position.x > this.position.x) {
					player.velocity.y += (this.counterClockwise ? -1 : 1) * (1 / this.speed) * 10;
				} else {
					player.velocity.y -= (this.counterClockwise ? -1 : 1) * (1 / this.speed) * 10;
				}
			}
		}
		if (!this.hitting) {
			for (let i in corpses) {
				let corpse = corpses[i];
				if (colliding(this, corpse)) {
					corpse.velocity.y = -corpse.gravity;
					corpse.position.y += 0.05;
					corpse.position.x += 0.05;
					this.corpses += 1;
				}
			}
		}
		this.collision = new RoundCollision(32, 16, 16);
		if (this.twin) {
			this.speed = 5 + this.corpses * 2 + this.twin.corpses * 2;
			this.twin.speed = 5 + this.corpses * 2 + this.twin.corpses * 2;
			if (this.twin.hitting && this.hitting) {
				player.position.y += 2;
				player.kill(null, true);
			}
		}
	};
}