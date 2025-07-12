function Plant(x, y) {
	this.position = new Vector2(x, y);
	this.collision = new Collision(0, 0, 3200, 3200);

	this.animations = {
		idle: [
			[80, 0],
			[112, 64]
		],
		mouth: [
			[80, 32],
		],
		chomp: [
			[112, 32],
			[80, 64],
		],
		chew: [
			[80, 96],
			[112, 96],
			[80, 96],
			[112, 96],
			[80, 96],
			[112, 96],
			[80, 96],
			[112, 96],
			[80, 96],
			[112, 96],
			[80, 96],
			[112, 96],
			[80, 96],
			[112, 96],
		],
		swallow: [
			[64, 128],
			[96, 128],
			[128, 128],
		]
	};
	this.speeds = {
		idle: 0.05,
		mouth: 1,
		chomp: 0.1,
		chew: 0.11,
		swallow: 0.3,
	};
	this.frame = 0;
	this.animation = "idle";

	this.animationDone = function() {

	};

	this.draw = function() {
		let uv = this.animations[this.animation][Math.floor(this.frame)];
		ctx.drawImage(images.player, uv[0], uv[1], 32, 32, this.position.x, this.position.y, 32, 32);
  };
  
	this.update = function() {
		this.frame += this.speeds[this.animation];
		if (this.frame >= this.animations[this.animation].length) {
			this.frame -= this.animations[this.animation].length;
			this.animationDone();
		}
		this.collision = new Collision(64, 40, -16, -8);
		if (colliding(player, this) && (this.animation == "idle" || this.animation == "mouth")) {
			this.animation = "mouth";
			this.frame = 0;
			player.velocity.x += (this.position.x - player.position.x) / 50;
		} else if (this.animation == "mouth") {
			this.animation = "idle";
		}
		this.collision = new Collision(32, 48, 0, -16);
		if (colliding(player, this) && this.animation == "mouth") {
			player.kill(true);
			this.frame = 0;
			this.animation = "chomp";
			this.animationDone = function() {
				this.frame = 0;
				this.animation = "chew";
				this.animationDone = function() {
					this.frame = 0;
					this.animation = "swallow";
					this.animationDone = function() {
						this.frame = 0;
						this.animation = "idle";
						this.animationDone = function() {};
					};
				};
			};
		}
		this.collision = new Collision(0, 0, 3200, 3200);
	};
}