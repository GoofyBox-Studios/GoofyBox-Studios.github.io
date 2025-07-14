Input.add_action("moveLeft", ["ArrowLeft", Input.AXIS_GAMEPAD_LEFT_STICK_LEFT]);
Input.add_action("moveRight", ["ArrowRight", Input.AXIS_GAMEPAD_LEFT_STICK_RIGHT]);
Input.add_action("jump", ["KeyZ", Input.BUTTON_GAMEPAD_NINTENDO_B]);
Input.add_action("erase", ["Space"]);
Input.preventKey("Space");

function line(x0, y0, x1, y1, callback) {
	const dx = Math.abs(x1 - x0);
	const dy = Math.abs(y1 - y0);
	const sx = Math.sign(x1 - x0);
	const sy = Math.sign(y1 - y0);
	let err = dx - dy;

	while (true) {
		callback(x0, y0);

		if (x0 === x1 && y0 === y1) break;

		const e2 = 2 * err;
		if (e2 > -dy) {
			err -= dy;
			x0 += sx;
		}
		if (e2 < dx) {
			err += dx;
			y0 += sy;
		}
	}
}

class Vector2 {
	constructor(x, y) {
		if (typeof x == "object") {
			this.x = x.x ?? 0;
			this.y = x.y ?? 0;
		} else {
			this.x = x ?? 0;
			this.y = y ?? 0;
		}
	}

	distanceTo(vector) {
		return Math.sqrt((this.x - vector.x) ** 2 + (this.y - vector.y) ** 2);
	}

	// Standard
	add(vector) {
		this.x += vector.x;
		this.y += vector.y;

		return this;
	}

	subtract(vector) {
		this.x -= vector.x;
		this.y -= vector.y;

		return this;
	}

	multiply(vector) {
		this.x *= vector.x;
		this.y *= vector.y;

		return this;
	}

	divide(vector) {
		this.x /= vector.x;
		this.y /= vector.y;

		return this;
	}

	// Scalar
	addScalar(scalar) {
		this.x += scalar;
		this.y += scalar;

		return this;
	}

	subtractScalar(scalar) {
		this.x -= scalar;
		this.y -= scalar;

		return this;
	}

	multiplyScalar(scalar) {
		this.x *= scalar;
		this.y *= scalar;

		return this;
	}

	divideScalar(scalar) {
		this.x /= scalar;
		this.y /= scalar;

		return this;
	}

	// New Vector
	added(vector) {
		return new Vector2(this.x + vector.x, this.y + vector.y);
	}

	subtracted(vector) {
		return new Vector2(this.x - vector.x, this.y - vector.y);
	}

	multiplied(vector) {
		return new Vector2(this.x * vector.x, this.y * vector.y);
	}

	divided(vector) {
		return new Vector2(this.x / vector.x, this.y / vector.y);
	}

	length() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	setLength(newLength) {
		const currentLength = this.length();

		if (currentLength == 0) return this;

		this.x = (this.x / currentLength) * newLength;
		this.y = (this.y / currentLength) * newLength;

		return this;
	}

	clone() {
		return new Vector2(this.x, this.y);
	}

	copy(vector) {
		this.x = vector.x;
		this.y = vector.y;

		return this;
	}
}

class Colour {
	constructor(r = 0, g = 0, b = 0, a = 1) {
		this._r = Math.max(Math.min(r, 1), 0);
		this._g = Math.max(Math.min(g, 1), 0);
		this._b = Math.max(Math.min(b, 1), 0);
		this._a = Math.max(Math.min(a, 1), 0);
	}

	get r() {
		return this._r;
	}

	get g() {
		return this._g;
	}

	get b() {
		return this._b;
	}

	get a() {
		return this._a;
	}

	set r(value) {
		this._r = Math.max(Math.min(value, 1), 0);
	}

	set g(value) {
		this._g = Math.max(Math.min(value, 1), 0);
	}

	set b(value) {
		this._b = Math.max(Math.min(value, 1), 0);
	}

	set a(value) {
		this._a = Math.max(Math.min(value, 1), 0);
	}

	get hex() {
		return (
			"#" +
			Math.floor(this.r * 255)
				.toString(16)
				.padStart(2, "0") +
			Math.floor(this.g * 255)
				.toString(16)
				.padStart(2, "0") +
			Math.floor(this.b * 255)
				.toString(16)
				.padStart(2, "0")
		);
	}
}

Colour.fromHSV = function (h, s, v) {
	var r, g, b, i, f, p, q, t;

	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);

	switch (i % 6) {
		case 0:
			(r = v), (g = t), (b = p);
			break;
		case 1:
			(r = q), (g = v), (b = p);
			break;
		case 2:
			(r = p), (g = v), (b = t);
			break;
		case 3:
			(r = p), (g = q), (b = v);
			break;
		case 4:
			(r = t), (g = p), (b = v);
			break;
		case 5:
			(r = v), (g = p), (b = q);
			break;
	}

	return new Colour(r, g, b);
};

class CollisionShape {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	update(x, y, w = this.w, h = this.h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	collidesWithTile(x, y, w, h) {
		const minX = Math.floor((this.x - this.w / 2) / platformer.TILE_SIZE);
		const minY = Math.floor((this.y - this.h / 2) / platformer.TILE_SIZE);
		const aMaxX = Math.ceil((this.x + this.w / 2) / platformer.TILE_SIZE);
		const aMaxY = Math.ceil((this.y + this.h / 2) / platformer.TILE_SIZE);

		const bMinX = x * 8;
		const bMinY = y * 8;
		const bMaxX = x * 8 + w * 8;
		const bMaxY = y * 8 + h * 8;

		// return (); // TODO
	}

	isColliding() {
		for (let x = 0; x < platformer.map[0].length; x++) {
			for (let y = 0; y < platformer.map.length + 1; y++) {
				const cell = platformer.map[y]?.[x] ?? [1, 0];
				const data = platformer.tiles[cell[0]];
				if (!data) continue;

				if (data.connecter) {
					if (data.solid) return this.collidesWithTile(x, y, 1, 1);
				} else {
					if (data.subTiles) {
						const subTile = data.subTiles[cell[1]];

						return this.collidesWithTile(x, y, subTile?.collision?.width ?? 1, subTile?.collision?.height ?? 1);
					} else {
						if (data.solid) return this.collidesWithTile(x, y, 1, 1);
					}
				}
			}
		}

		return false;
	}
}

class PlatformerPlayer {
	constructor(position) {
		this.position = new Vector2(position);
		this.velocity = new Vector2(0, 0);
		this.flipH = false;
		this.idleTime = 0;
		this.walkTime = 0;
		this.anim = "idle";
		this.frame = 0;
		this.isOnFloor = false;
		this.canQuickStopJump = false;
		this.coyoteTime = 0;
		this.jumpBuffer = 0;
		this.turnAroundTime = 0;
		this.jumpIndex = 0;

		this.collision = new CollisionShape(this.position.x, this.position.y + 2, 7.5, 16);

		this.MOVE_SPEED = 1.8;
		this.SLIDE = 0.5;
		this.GRAVITY = 0.2;
		this.FALL_GRAVITY = 0.25;
		this.JUMP_FORCE = 3.9;
	}

	isColliding() {
		this.collision.update(this.position.x, this.position.y + 2);

		return this.collision.isColliding();
	}

	update() {
		this.coyoteTime--;
		this.jumpBuffer--;
		this.turnAroundTime--;

		let move = 0;
		if (Input.is_action_pressed("moveRight")) move++;
		if (Input.is_action_pressed("moveLeft")) move--;

		if (move == -1) {
			this.velocity.x -= this.MOVE_SPEED;
			this.flipH = true;
			if (this.velocity.x > 0.5) this.turnAroundTime = 5;
		} else if (move == 1) {
			this.velocity.x += this.MOVE_SPEED;
			this.flipH = false;
			if (this.velocity.x < 0.5) this.turnAroundTime = 5;
		}

		if (move != 0 && this.isOnFloor) {
			this.walkTime += 0.2;
			this.idleTime = 0.0;
		} else {
			this.walkTime = 0.0;
			this.idleTime += 0.1;
		}

		this.velocity.x *= this.SLIDE;

		if (this.velocity.y > 0) {
			this.velocity.y += this.FALL_GRAVITY;
		} else {
			this.velocity.y += this.GRAVITY;

			if (this.canQuickStopJump && !Input.is_action_pressed("jump")) {
				this.canQuickStopJump = false;
				this.velocity.y *= 0.5;
			}
		}

		if (Input.is_action_just_pressed("jump")) this.jumpBuffer = 10;

		this.isOnFloor = false;
		this.position.y += this.velocity.y;
		if (this.isColliding()) {
			this.position.y = Math.round(this.position.y);
			while (this.isColliding()) {
				this.position.y -= Math.sign(this.velocity.y || 1);
			}

			this.isOnFloor = this.velocity.y > 0;

			if (Math.abs(this.velocity.y) > 1) platformer.shake = Math.max(platformer.shake, Math.abs(this.velocity.y) / 2);

			this.velocity.y = 0;

			if (this.isOnFloor) this.coyoteTime = 5;
		}

		this.position.x += this.velocity.x;
		if (this.isColliding()) {
			this.position.x = Math.round(this.position.x);
			while (this.isColliding()) {
				this.position.x -= Math.sign(this.velocity.x || 1);
			}

			this.velocity.x = 0;
		}

		if (this.coyoteTime > 0 && (this.jumpBuffer > 0 || Input.is_action_pressed("jump"))) {
			this.velocity.y = -this.JUMP_FORCE;
			this.canQuickStopJump = true;
			this.coyoteTime = 0;
			this.jumpBuffer = 0;
			this.jumpIndex = 1 - this.jumpIndex;
		}

		if (this.isOnFloor) {
			this.anim = "idle";
			if (move != 0) this.anim = "walk";

			if (this.turnAroundTime > 0) this.anim = "turnAround";
		} else {
			if (Math.abs(this.velocity.y) < 1.0) {
				this.anim = "air" + this.jumpIndex;
			} else {
				if (this.velocity.y < 0) {
					this.anim = "jump" + this.jumpIndex;
				} else {
					this.anim = "fall" + this.jumpIndex;
				}
			}
		}

		if (this.anim == "walk") this.frame = Math.floor(this.walkTime % 4) + 6;
		else if (this.anim == "idle") this.frame = Math.floor(this.idleTime % 6);
		else if (this.anim == "jump0") this.frame = 10;
		else if (this.anim == "air0") this.frame = 11;
		else if (this.anim == "fall0") this.frame = 12;
		else if (this.anim == "jump1") this.frame = 13;
		else if (this.anim == "air1") this.frame = 14;
		else if (this.anim == "fall1") this.frame = 15;
		else if (this.anim == "turnAround") this.frame = 16;
	}

	draw(ctx) {
		ctx.translate(this.position.x, this.position.y);
		if (this.flipH) ctx.scale(-1, 1);
		ctx.drawImage(platformer.sprites.player, (this.frame % 4) * 20, Math.floor(this.frame / 4) * 20, 20, 20, -10, -10, 20, 20);
		if (this.flipH) ctx.scale(-1, 1);
		ctx.translate(-this.position.x, -this.position.y);
	}
}

const platformer = new (class {
	constructor() {
		this.TILE_SIZE = 8;

		this.element = document.getElementById("platformer");
		this.sprites = {
			player: new Sprite("/assets/platformer/Goofyplayer.png"),
		};
		this.paused = true;
		this.tileUv = {
			// 0 U 1
			// L - R
			// 2 D 3

			//  UDLR0123
			0b00000000: [56, 0],

			// Up
			0b10001000: [48, 16],
			0b10000000: [48, 16],
			0b10000100: [48, 16],
			0b10001100: [48, 16],
			0b10000010: [48, 16],
			0b10001010: [48, 16],
			0b10000110: [48, 16],
			0b10001110: [48, 16],
			0b10000001: [48, 16],
			0b10001001: [48, 16],
			0b10000101: [48, 16],
			0b10001101: [48, 16],
			0b10000011: [48, 16],
			0b10001011: [48, 16],
			0b10000111: [48, 16],
			0b10001111: [48, 16],

			// Down
			0b01001000: [48, 0],
			0b01000000: [48, 0],
			0b01000100: [48, 0],
			0b01001100: [48, 0],
			0b01000010: [48, 0],
			0b01001010: [48, 0],
			0b01000110: [48, 0],
			0b01001110: [48, 0],
			0b01000001: [48, 0],
			0b01001001: [48, 0],
			0b01000101: [48, 0],
			0b01001101: [48, 0],
			0b01000011: [48, 0],
			0b01001011: [48, 0],
			0b01000111: [48, 0],
			0b01001111: [48, 0],

			// Left
			0b00100000: [16, 24],
			0b00101000: [16, 24],
			0b00100100: [16, 24],
			0b00101100: [16, 24],
			0b00100010: [16, 24],
			0b00101010: [16, 24],
			0b00100110: [16, 24],
			0b00101110: [16, 24],
			0b00100001: [16, 24],
			0b00101001: [16, 24],
			0b00100101: [16, 24],
			0b00101101: [16, 24],
			0b00100011: [16, 24],
			0b00101011: [16, 24],
			0b00100111: [16, 24],
			0b00101111: [16, 24],

			// Right
			0b00010000: [0, 24],
			0b00011000: [0, 24],
			0b00010100: [0, 24],
			0b00011100: [0, 24],
			0b00010010: [0, 24],
			0b00011010: [0, 24],
			0b00010110: [0, 24],
			0b00011110: [0, 24],
			0b00010001: [0, 24],
			0b00011001: [0, 24],
			0b00010101: [0, 24],
			0b00011101: [0, 24],
			0b00010011: [0, 24],
			0b00011011: [0, 24],
			0b00010111: [0, 24],
			0b00011111: [0, 24],

			// Up & Down
			0b11001000: [48, 8],
			0b11000000: [48, 8],
			0b11000100: [48, 8],
			0b11001100: [48, 8],
			0b11000010: [48, 8],
			0b11001010: [48, 8],
			0b11000110: [48, 8],
			0b11001110: [48, 8],
			0b11000001: [48, 8],
			0b11001001: [48, 8],
			0b11000101: [48, 8],
			0b11001101: [48, 8],
			0b11000011: [48, 8],
			0b11001011: [48, 8],
			0b11000111: [48, 8],
			0b11001111: [48, 8],

			// Left & Right
			0b00110000: [8, 24],
			0b00111000: [8, 24],
			0b00110100: [8, 24],
			0b00111100: [8, 24],
			0b00110010: [8, 24],
			0b00111010: [8, 24],
			0b00110110: [8, 24],
			0b00111110: [8, 24],
			0b00110001: [8, 24],
			0b00111001: [8, 24],
			0b00110101: [8, 24],
			0b00111101: [8, 24],
			0b00110011: [8, 24],
			0b00111011: [8, 24],
			0b00110111: [8, 24],
			0b00111111: [8, 24],

			// Up & Left
			0b10100000: [32, 32],
			0b10101000: [16, 16],
			0b10100100: [32, 32],
			0b10101100: [16, 16],
			0b10100010: [32, 32],
			0b10101010: [16, 16],
			0b10100110: [32, 32],
			0b10101110: [16, 16],
			0b10100001: [32, 32],
			0b10101001: [16, 16],
			0b10100101: [32, 32],
			0b10101101: [16, 16],
			0b10100011: [32, 32],
			0b10101011: [16, 16],
			0b10100111: [32, 32],
			0b10101111: [16, 16],

			// Down & Left
			0b01100000: [24, 8],
			0b01101000: [24, 8],
			0b01100100: [24, 8],
			0b01101100: [24, 8],
			0b01100010: [16, 0],
			0b01101010: [16, 0],
			0b01100110: [16, 0],
			0b01101110: [16, 0],
			0b01100001: [24, 8],
			0b01101001: [24, 8],
			0b01100101: [24, 8],
			0b01101101: [24, 8],
			0b01100011: [16, 0],
			0b01101011: [16, 0],
			0b01100111: [16, 0],
			0b01101111: [16, 0],

			// Up & Right
			0b10010000: [24, 32],
			0b10011000: [24, 32],
			0b10010100: [0, 16],
			0b10011100: [0, 16],
			0b10010010: [24, 32],
			0b10011010: [24, 32],
			0b10010110: [0, 16],
			0b10011110: [0, 16],
			0b10010001: [24, 32],
			0b10011001: [24, 32],
			0b10010101: [0, 16],
			0b10011101: [0, 16],
			0b10010011: [24, 32],
			0b10011011: [24, 32],
			0b10010111: [0, 16],
			0b10011111: [0, 16],

			// Down & Right
			0b01010000: [24, 24],
			0b01011000: [24, 24],
			0b01010100: [24, 24],
			0b01011100: [24, 24],
			0b01010010: [24, 24],
			0b01011010: [24, 24],
			0b01010110: [24, 24],
			0b01011110: [24, 24],
			0b01010001: [0, 0],
			0b01011001: [0, 0],
			0b01010101: [0, 0],
			0b01011101: [0, 0],
			0b01010011: [0, 0],
			0b01011011: [0, 0],
			0b01010111: [0, 0],
			0b01011111: [0, 0],

			// Down & Left & Right
			0b01110000: [40, 0],
			0b01111000: [40, 0],
			0b01110100: [40, 0],
			0b01111100: [40, 0],
			0b01110010: [32, 0],
			0b01111010: [32, 0],
			0b01110110: [32, 0],
			0b01111110: [32, 0],
			0b01110001: [24, 0],
			0b01111001: [24, 0],
			0b01110101: [24, 0],
			0b01111101: [24, 0],
			0b01110011: [8, 0],
			0b01111011: [8, 0],
			0b01110111: [8, 0],
			0b01111111: [8, 0],

			// Up & Down & Right
			0b11010000: [40, 8],
			0b11011000: [40, 8],
			0b11010100: [40, 24],
			0b11011100: [40, 24],
			0b11010010: [40, 8],
			0b11011010: [40, 8],
			0b11010110: [40, 24],
			0b11011110: [40, 24],
			0b11010001: [40, 16],
			0b11011001: [40, 16],
			0b11010101: [0, 8],
			0b11011101: [0, 8],
			0b11010011: [40, 16],
			0b11011011: [40, 16],
			0b11010111: [0, 8],
			0b11011111: [0, 8],

			// Up & Down & Left
			0b11100000: [56, 8],
			0b11101000: [56, 24],
			0b11100100: [56, 8],
			0b11101100: [56, 24],
			0b11100010: [56, 16],
			0b11101010: [16, 8],
			0b11100110: [56, 16],
			0b11101110: [16, 8],
			0b11100001: [56, 8],
			0b11101001: [56, 24],
			0b11100101: [56, 8],
			0b11101101: [56, 24],
			0b11100011: [56, 16],
			0b11101011: [16, 8],
			0b11100111: [56, 16],
			0b11101111: [16, 8],

			// Up & Left & Right
			0b10110000: [56, 32],
			0b10111000: [48, 32],
			0b10110100: [40, 32],
			0b10111100: [8, 16],
			0b10110010: [56, 32],
			0b10111010: [48, 32],
			0b10110110: [40, 32],
			0b10111110: [8, 16],
			0b10110001: [56, 32],
			0b10111001: [48, 32],
			0b10110101: [40, 32],
			0b10111101: [8, 16],
			0b10110011: [56, 32],
			0b10111011: [48, 32],
			0b10110111: [40, 32],
			0b10111111: [8, 16],

			// Up & Down & Left & Right
			0b11110000: [16, 48],
			0b11111000: [32, 48],
			0b11110100: [24, 48],
			0b11111100: [0, 48],
			0b11110010: [32, 40],
			0b11111010: [48, 40],
			0b11110110: [16, 32],
			0b11111110: [8, 40],
			0b11110001: [24, 40],
			0b11111001: [16, 40],
			0b11110101: [40, 40],
			0b11111101: [0, 40],
			0b11110011: [8, 48],
			0b11111011: [8, 32],
			0b11110111: [0, 32],
			0b11111111: [8, 8],
		};
		this.tiles = [
			{
				// 0
				solid: false,
			},
			{
				// 1
				solid: true,
				connector: true,
				connects: [1, 2],
				sprite: new Sprite("/assets/platformer/platformerTile0.png"),
			},
			{
				// 2
				solid: true,
				connector: true,
				connects: [1, 2],
				sprite: new Sprite("/assets/platformer/platformerTile1.png"),
			},
			{
				// 3
				solid: true,
				connector: false,
				subTiles: [
					{
						uv: [0, 0, 2, 2],
						solid: true,
					},
					{
						uv: [2, 0, 2, 2],
						solid: true,
					},
					{
						uv: [4, 0, 2, 2],
						solid: true,
					},
					{
						uv: [0, 2, 2, 4],
						solid: false,
					},
					{
						uv: [2, 2, 2, 4],
						solid: false,
					},
					{
						uv: [4, 2, 2, 4],
						solid: false,
					},
				],
				sprite: new Sprite("/assets/platformer/redTiles.png"),
			},
		];
		this.map = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		];
	}

	printText(text) {
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = "white";
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		this.ctx.font = '40px "Press Start 2P"';
		this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
	}

	init() {
		if (!this.element) return;

		this.canvas = document.createElement("canvas");
		this.canvas.width = 400;
		this.canvas.height = 250;
		// this.ctx = new WebGL2D(this.canvas.getContext("webgl"));
		this.ctx = this.canvas.getContext("2d");
		this.ctx.imageSmoothingEnabled = false;

		this.element.appendChild(this.canvas);

		this.printText("Loading...");

		this.canvas.onclick = function () {
			platformer.paused = false;
		};

		// Input.lockPointerOnClick(this.canvas);
		// Input.onpointerlockchange = function (event) {
		//   platformer.paused = !event.locked;
		// }

		this.entities = [new PlatformerPlayer(new Vector2(64, 16))];

		this.shake = 0;

		for (let y = 0; y < this.map.length; y++) {
			const row = this.map[y];

			for (let x = 0; x < row.length; x++) {
				const cell = row[x];
				const state = 0b00000000;

				this.map[y][x] = [cell, state];
			}
		}
		platformer.parseMap();
		this.update();
	}

	parseMap() {
		for (let y = 0; y < this.map.length; y++) {
			const row = this.map[y];

			for (let x = 0; x < row.length; x++) {
				const cell = row[x][0];

				if (!platformer.tiles[cell].connecter) continue;

				const connects = platformer.tiles[cell].connects ?? [];
				let state = 0b00000000;

				if (connects.includes(this.map[y - 1]?.[x + 0]?.[0] ?? cell)) state += 0b10000000;
				if (connects.includes(this.map[y + 1]?.[x + 0]?.[0] ?? cell)) state += 0b01000000;
				if (connects.includes(this.map[y + 0]?.[x - 1]?.[0] ?? cell)) state += 0b00100000;
				if (connects.includes(this.map[y + 0]?.[x + 1]?.[0] ?? cell)) state += 0b00010000;

				if (connects.includes(this.map[y - 1]?.[x - 1]?.[0] ?? cell)) state += 0b00001000;
				if (connects.includes(this.map[y - 1]?.[x + 1]?.[0] ?? cell)) state += 0b00000100;
				if (connects.includes(this.map[y + 1]?.[x - 1]?.[0] ?? cell)) state += 0b00000010;
				if (connects.includes(this.map[y + 1]?.[x + 1]?.[0] ?? cell)) state += 0b00000001;

				this.map[y][x][1] = state;
			}
		}
	}

	setCell(x, y, value) {
		if (platformer.map[y]?.[x] == undefined) return;

		platformer.map[y][x] = value;
	}

	update() {
		requestAnimationFrame(() => platformer.update());

		if (this.paused) {
			this.ctx.resetTransform();
			this.printText("Paused");
			return;
		}

		// Update
		for (let entity of this.entities) entity.update();

		// Draw
		this.ctx.resetTransform();
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.scale(800 / 256, 500 / 160);

		for (let mapY = 0; mapY < this.map.length; mapY++) {
			const row = this.map[mapY];
			for (let mapX = 0; mapX < row.length; mapX++) {
				const cell = row[mapX][0];
				const state = row[mapX][1];

				const data = this.tiles[cell];
				let uvX,
					uvY,
					uvW = 8,
					uvH = 8;
				if (data.connecter) {
					[uvX, uvY] = this.tileUv[state] ?? [56, 0];
					uvX /= 8;
					uvY /= 8;
				} else if (data.subTiles) {
					const subTile = data.subTiles[state];

					uvX = subTile.uv[0];
					uvY = subTile.uv[1];
					uvW = subTile.uv[2];
					uvH = subTile.uv[3];
				}

				if (data.solid && data.sprite) {
					this.ctx.drawImage(data.sprite, uvX * 8, uvY * 8, uvW * 8, uvH * 8, mapX * platformer.TILE_SIZE, mapY * platformer.TILE_SIZE, platformer.TILE_SIZE * uvW, platformer.TILE_SIZE * uvH);
				}
				// if (cell == 1) {
				//   // this.ctx.fillStyle = "#ff" + state.toString(16).padStart(2, "0") + "00";
				//   // this.ctx.fillRect(mapX * platformer.TILE_SIZE, mapY * platformer.TILE_SIZE, platformer.TILE_SIZE, platformer.TILE_SIZE);
				// } else if (cell == 2) {
				//   this.ctx.fillStyle = "blue";
				//   this.ctx.fillRect(mapX * platformer.TILE_SIZE, mapY * platformer.TILE_SIZE, platformer.TILE_SIZE, platformer.TILE_SIZE);
				// }
			}
		}

		for (let entity of this.entities) entity.draw(this.ctx);

		this.shake *= -0.9;
		const dir = Math.random() * Math.PI * 2.0;
		// this.element.style.transform = "translate(" + (Math.cos(dir) * this.shake) + "px, " + (Math.sin(dir) * this.shake) + "px)";
		// this.element.style.left = Math.cos(dir) * this.shake + "px";
		// this.element.style.top  = Math.sin(dir) * this.shake + "px";

		let { x: mouseX, y: mouseY } = Input.get_mouse_position();
		const rect = this.canvas.getBoundingClientRect();
		mouseX = ((mouseX - rect.x) / rect.width) * this.canvas.width;
		mouseY = ((mouseY - rect.y) / rect.height) * this.canvas.height;

		const cellX = Math.floor((mouseX / this.canvas.width) * this.map[0].length);
		const cellY = Math.floor((mouseY / this.canvas.height) * this.map.length);
		if (this.map[cellY]?.[cellX]) {
			const buttonLeft = Input.is_mouse_button_pressed(Input.BUTTON_MOUSE_LEFT);
			const buttonRight = Input.is_mouse_button_pressed(Input.BUTTON_MOUSE_RIGHT);
			const buttonErase = Input.is_action_pressed("erase");

			const isDrawing = buttonErase ? buttonRight : buttonLeft;
			const isErasing = buttonErase ? buttonLeft : buttonRight;

			if (isDrawing) {
				line(cellX, cellY, platformer.previousCellX, platformer.previousCellY, function (x, y) {
					platformer.setCell(x, y, [3, 0]);
				});

				this.parseMap();
			}

			if (isErasing) {
				line(cellX, cellY, platformer.previousCellX, platformer.previousCellY, function (x, y) {
					platformer.setCell(x, y, [0, 0]);
				});

				this.parseMap();
			}
		}
		platformer.previousCellX = cellX;
		platformer.previousCellY = cellY;

		// this.ctx.update();
	}
})();

platformer.init();
