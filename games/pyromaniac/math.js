// https://stackoverflow.com/questions/63970781/js-how-to-lerp-rotation-in-radians
function rLerp (A, B, w){
	let CS = (1-w)*Math.cos(A) + w*Math.cos(B);
	let SN = (1-w)*Math.sin(A) + w*Math.sin(B);
	return Math.atan2(SN,CS);
}

const lerp = (x, y, a) => x * (1 - a) + y * a;

function circleRect(cx, cy, radius, rx, ry, rw, rh) {
	// temporary variables to set edges for testing
	let testX = cx;
	let testY = cy;

	// which edge is closest?
	if (cx < rx)         testX = rx;      // test left edge
	else if (cx > rx+rw) testX = rx+rw;   // right edge
	if (cy < ry)         testY = ry;      // top edge
	else if (cy > ry+rh) testY = ry+rh;   // bottom edge

	// get distance from closest edges
	const distX = cx-testX;
	const distY = cy-testY;
	const distance = Math.sqrt( (distX*distX) + (distY*distY) );

	// if the distance is less than the radius, collision!
	if (distance <= radius) {
		return true;
	}
	return false;
}

	
function rotatePoint(p, center, theta) {
	let nx = (p.x-center.x)*Math.cos(theta) - (p.y-center.y)*Math.sin(theta) + center.x;
	let ny = (p.y-center.y)*Math.cos(theta) + (p.x-center.x)*Math.sin(theta) + center.y;
	return new Vector2(nx, ny);
}

class Vector2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	
	add(v) {
		this.x += v.x;
		this.y += v.y;
		
		return this;
	}
	
	subtract(v) {
		this.x -= v.x;
		this.y -= v.y;
		
		return this;
	}
	
	subtracted(v) {
		return new Vector2(this.x - v.x, this.y - v.y);
	}
	
	subtractedValues(x, y) {
		return new Vector2(this.x - x, this.y - y);
	}
	
	multiplyScalar(s) {
		this.x *= s;
		this.y *= s;
		
		return this;
	}
	
	set(x, y) {
		this.x = x;
		this.y = y;
		
		return this;
	}
	
	addValues(x, y) {
		this.x += x;
		this.y += y;
		
		return this;
	}
	
	normalize() {
		const l = Math.sqrt(this.x ** 2 + this.y ** 2);
		this.x /= l;
		this.y /= l;
		
		return this;
	}
	
	lerpTo(v, a) {
		this.x = lerp(this.x, v.x, a);
		this.y = lerp(this.y, v.y, a);
		
		return this;
	}
	
	distanceTo(v) {
		return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2);
	}
	
	copy(v) {
		this.x = v.x;
		this.y = v.y;
		
		return this;
	}
	
	clone() {
		return new Vector2(this.x, this.y);
	}
	
	get length() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}
}
class CollisionObject {
	constructor(x, y, w, h) {
		this.position = new Vector2(x, y);
		this.size = new Vector2(w, h);
	}

	intersects(obj) {
		let aNX = this.position.x - this.size.x / 2;
		let aPX = this.position.x + this.size.x / 2;
		let aNY = this.position.y - this.size.y / 2;
		let aPY = this.position.y + this.size.y / 2;
		let bNX = obj.position.x - obj.size.x / 2;
		let bPX = obj.position.x + obj.size.x / 2;
		let bNY = obj.position.y - obj.size.y / 2;
		let bPY = obj.position.y + obj.size.y / 2;

		return (
			aPY >= bNY &&
			aNY <= bPY &&
			aPX >= bNX &&
			aNX <= bPX
		);
	}
	
	intersectsLine(line) {
		return lineRect(line.sx, line.sy, line.ex, line.ey, this.position.x, this.position.y, this.size.x, this.size.y);
	}
	
	intersectsLineValues(sx, sy, ex, ey) {
		return lineRect(sx, sy, ex, ey, this.position.x, this.position.y, this.size.x, this.size.y);
	}
}


// LINE/CIRCLE
function lineCircle(x1, y1, x2, y2, cx, cy, r) {

	// is either end INSIDE the circle?
	// if so, return true immediately
	const inside1 = pointCircle(x1,y1, cx,cy,r);
	const inside2 = pointCircle(x2,y2, cx,cy,r);
	if (inside1 || inside2) return true;

	// get length of the line
	const distX = x1 - x2;
	const distY = y1 - y2;
	const len = Math.sqrt( (distX*distX) + (distY*distY) );

	// get dot product of the line and circle
	const dot = ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / Math.pow(len,2);

	// find the closest point on the line
	const closestX = x1 + (dot * (x2-x1));
	const closestY = y1 + (dot * (y2-y1));

	// is this point actually on the line segment?
	// if so keep going, but if not, return false
	const onSegment = linePoint(x1,y1,x2,y2, closestX,closestY);
	if (!onSegment) return false;


	// get distance to closest point
	const distance = Math.sqrt((closestX - cx) ** 2 + (closestY - cy) ** 2);

	if (distance <= r) {
		return true;
	}
	return false;
}


// POINT/CIRCLE
function pointCircle(px, py, cx, cy, r) {

	// get distance between the point and circle's center
	// using the Pythagorean Theorem
	const distX = px - cx;
	const distY = py - cy;
	const distance = Math.sqrt( (distX*distX) + (distY*distY) );

	// if the distance is less than the circle's
	// radius the point is inside!
	if (distance <= r) {
		return true;
	}
	return false;
}


// LINE/POINT
function linePoint(x1, y1, x2, y2, px, py) {

	// get distance from the point to the two ends of the line
	const d1 = dist(px,py, x1,y1);
	const d2 = dist(px,py, x2,y2);

	// get the length of the line
	const lineLen = dist(x1,y1, x2,y2);

	// since floats are so minutely accurate, add
	// a little buffer zone that will give collision
	const buffer = 0.1;    // higher # = less accurate

	// if the two distances are equal to the line's
	// length, the point is on the line!
	// note we use the buffer here to give a range,
	// rather than one #
	if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
		return true;
	}
	return false;
}

function dist(a, b, c, d) {
	return Math.sqrt((a-c) ** 2 + (b-d) ** 2);
}

function lineRect(x1, y1, x2, y2, rx, ry, rw, rh) {
	if (lineLine(x1, y1, x2, y2,   rx - rw / 2, ry - rh / 2, rx + rw / 2, ry - rh / 2)) return true;
	if (lineLine(x1, y1, x2, y2,  rx - rw / 2, ry + rh / 2, rx + rw / 2, ry + rh / 2)) return true;
	if (lineLine(x1, y1, x2, y2,    rx - rw / 2, ry - rh / 2, rx - rw / 2, ry + rh / 2)) return true;
	if (lineLine(x1, y1, x2, y2, rx + rw / 2, ry - rh / 2, rx + rw / 2, ry + rh / 2)) return true;
	
	return false;
}

function lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
	// calculate the distance to intersection point
	const uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
	const uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

	// if uA and uB are between 0-1, lines are colliding
	return (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1);
}