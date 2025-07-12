/* global Utils */

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
  
  get isVector() { return true; }
  get isVector2() { return true; }

// Setting
	set(x, y) {
		this.x = x ?? 0;
		this.y = y ?? 0;

		return this;
	}

	setX(x) {
		this.x = x;

		return this;
	}

	setY(y) {
		this.y = y;

		return this;
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

// Scalars
	multiplyScalar(scalar) {
		this.x *= scalar;
		this.y *= scalar;

		return this;
	}

	divideScalar(scalar) {
		if (scalar == 0) {
			this.x = 0;
			this.y = 0;

			return this;
		}

		this.x /= scalar;
		this.y /= scalar;

		return this;
	}

// Scaled
	subtractScaledVector(vector, scale) {
		this.x -= vector.x * scale;
		this.y -= vector.y * scale;

		return this;
	}

// New Vector
	added(vector) {
		return new Vector2(
			this.x + vector.x,
			this.y + vector.y,
		);
	}

	subtracted(vector) {
		return new Vector2(
			this.x - vector.x,
			this.y - vector.y,
		);
	}

// New Vector Values
	addedValues(x, y) {
		return new Vector2(
			this.x + x,
			this.y + y,
		);
	}

	subtractedValues(x, y) {
		return new Vector2(
			this.x - x,
			this.y - y,
		);
	}

// New Vector Scalar
	multipliedScalar(scalar) {
		return new Vector2(
			this.x * scalar,
			this.y * scalar,
		);
	}

	dividedScalar(scalar) {
		if (scalar == 0) return new Vector2(0, 0);

		return new Vector2(
			this.x / scalar,
			this.y / scalar,
		);
	}

// New Vector Scaled
	addScaledVector(vector, scale) {
		this.x += vector.x * scale;
		this.y += vector.y * scale;

		return this;
	}

// Math
	normalize() {
		return this.setLength(1);
	}

	normalized() {
		const length = this.length();

		if (length == 0) return new Vector2(0, 0);

		return new Vector2(
			this.x / length,
			this.y / length,
		);
	}

	distanceTo(vector) {
		return Math.sqrt((this.x - vector.x) ** 2 + (this.y - vector.y) ** 2);
	}

	length() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	dot(vector) {
		return this.x * vector.x + this.y * vector.y;
	}

	lerp(to, weight) {
		this.x = Utils.lerp(this.x, to.x, weight);
		this.y = Utils.lerp(this.y, to.y, weight);

		return this;
	}

	lerpVectors(a, b, weight) {
		this.x = Utils.lerp(a.x, b.x, weight);
		this.y = Utils.lerp(a.y, b.y, weight);

		return this;
	}

	copy(vector) {
		this.x = vector.x;
		this.y = vector.y;

		return this;
	}

	setLength(toLength) {
		const length = this.length();

		if (length == 0) return;

		this.x = this.x / length * toLength;
		this.y = this.y / length * toLength;

		return this;
	}

	clampLength(min, max) {
		const length = this.length();

		if (length < min) this.setLength(min);
		if (length > max) this.setLength(max);

		return this;
	}

	clone() {
		return new Vector2(this.x, this.y);
	}


// Math
	floor() {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);

		return this;
	}

	ceil() {
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);

		return this;
	}

	round() {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);

		return this;
	}

// Math (New Vector)
	floored() {
		return new Vector2(
			Math.floor(this.x),
			Math.floor(this.y),
		);
	}

	ceiled() {
		return new Vector2(
			Math.ceil(this.x),
			Math.ceil(this.y),
		);
	}

	rounded() {
		return new Vector2(
			Math.round(this.x),
			Math.round(this.y),
		);
	}
}

Vector2.UP    = new Vector2( 0, -1);
Vector2.DOWN  = new Vector2( 0,  1);
Vector2.RIGHT = new Vector2( 1,  0);
Vector2.LEFT  = new Vector2(-1,  0);

Vector2.from = function (vector) {
	return new Vector2(vector?.x, vector?.y);
};