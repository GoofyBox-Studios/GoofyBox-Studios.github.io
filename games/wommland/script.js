Input.add_action("moveLeft", ["ArrowLeft", Input.AXIS_GAMEPAD_LEFT_STICK_LEFT]);
Input.add_action("moveRight", ["ArrowRight", Input.AXIS_GAMEPAD_LEFT_STICK_RIGHT]);
Input.add_action("jump", ["KeyZ", Input.BUTTON_GAMEPAD_NINTENDO_B]);
Input.add_action("fly", ["KeyF", Input.BUTTON_GAMEPAD_NINTENDO_X]);

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
		if (e2 > -dy) { err -= dy; x0 += sx; }
		if (e2 <  dx) { err += dx; y0 += sy; }
	}
}

const canvas = document.getElementById("canvas");
canvas.width  = 128 * 16;
canvas.height = 96 * 16;
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const styles = {
	background: [
		ctx.createLinearGradient(0, 0, 0, 96 * 2),
	]
};

styles.background[0].addColorStop(0.0,   "#118435");
styles.background[0].addColorStop(0.3,   "#114343");
styles.background[0].addColorStop(0.499, "#0b222b");
styles.background[0].addColorStop(0.501, "#333333");
styles.background[0].addColorStop(1.0,   "black");

const tilesSprite = new Sprite("/assets/wommland/Tiles.png");

let shake = 0;
let camera = new Vector2(0, 0);

const cellData = [
	{ // 0 - air
		solid: false,
	},
	{ // 1 - dirt
		solid: true,
		border: true,
		inFront: true,
		borderConnects: [1, 6],
	},
	{ // 2 - tall grass
		solid: false,
		border: false,
		inFront: true,
	},
	{ // 3 - tree leaves top
		solid: false,
		border: true,
		inFront: false,
		uv: [32, 8],
		borderConnects: [3, 4],
	},
	{ // 4 - tree leaves
		solid: false,
		border: true,
		inFront: false,
		uv: [32, 0],
		borderConnects: [3, 4],
	},
	{ // 5 - tree trunk
		solid: false,
		border: false,
		inFront: false,
		uv: [32, 16],
	},
	{ // 6 - stone
		solid: true,
		inFront: true,
		border: true,
		borderConnects: [6, 1],
		uv: [32, 32],
	},
	{ // 7 - plank walkway
		solid: true,
		inFront: false,
		uv: [8, 32],
	},
];

for (let data of cellData) {
	data.borderConnects = data.borderConnects ?? [];
	data.borderConnects.push(undefined);
}

const map = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 3, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 3, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1,     1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1,     1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,     1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,     1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1,     1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1,     1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,     1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,     1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,     1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1,     1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,     1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,     1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 7, 7, 7, 7, 7, 7,     1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,     1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,     1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1,     1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,     1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	
	
	[6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6,     6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
	[6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6,     6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 6, 6, 0, 0, 0, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6],
	[6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6,     6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 6, 6],
	[6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6,     6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 6, 6],
	[6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6,     6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 0, 0, 6],
	[6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6,     6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
	[6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
	[6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
	[6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
	[6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6],
	[6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6,     6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 6, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6],
	[6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
];

const player = new Player(new Vector2(12, 69));

function hash(x, y) {
	var combined = x * 9.93 + y * 7.154 + (y * x + 1.5) * 12.5;
	var hashValue = Math.abs(Math.sin(combined * (x + 1123498.126)));
	return hashValue;
}

function drawTile(cellX, cellY, inFront) {
	const cell = map[cellY][cellX];
	if (!!cellData[cell]?.inFront != inFront) return;

	const screenX = cellX * 8;
	const screenY = cellY * 8;


	if (cell == 1) {
		const hasGrass = !(cellData[map[cellY - 1]?.[cellX + 0]]?.solid ?? true);
		const hasBand = (cellY % 5) % 3 == 0;

		const uvX = hasGrass ? 1 : 0;
		const uvY = hasBand ? 2 : 1;

		ctx.drawImage(tilesSprite, uvX * 8, uvY * 8, 8, 8, screenX, screenY, 8, 8);

		if (!hasBand && !hasGrass && hash(cellX, cellY) < 0.2) {
			const type = Math.floor(hash(cellX + 50, cellY + 25) * 4);
			ctx.drawImage(tilesSprite, 16 + Math.floor(type / 2) * 8, 8 + (type % 2) * 8, 8, 8, screenX, screenY, 8, 8);
		}
	} else if (cell == 2) {
		ctx.fillStyle = "black";
		ctx.fillRect(screenX, screenY + 8, 8, 1);
		ctx.drawImage(tilesSprite, 16 + Math.round(hash(cellX, cellY)) * 8, 0, 8, 8, screenX, screenY, 8, 8);
	}
	
	if (cellData[cell].uv) {
		ctx.drawImage(tilesSprite, cellData[cell].uv[0], cellData[cell].uv[1], 8, 8, screenX, screenY, 8, 8);
	}
	
	if (cell == 6) {
		if (hash(cellX, cellY) < 0.2) {
			const type = Math.floor(hash(cellX + 50, cellY + 25) * 2);
			ctx.drawImage(tilesSprite, 24, 8 + (type % 2) * 8, 8, 8, screenX, screenY, 8, 8);
		}
	}

	if (cellData[cell].border) {
		const cellU = cellData[cell].borderConnects?.includes(map[cellY - 1]?.[cellX + 0]);
		const cellD = cellData[cell].borderConnects?.includes(map[cellY + 1]?.[cellX + 0]);
		const cellL = cellData[cell].borderConnects?.includes(map[cellY + 0]?.[cellX - 1]);
		const cellR = cellData[cell].borderConnects?.includes(map[cellY + 0]?.[cellX + 1]);

		const cellUL = cellData[cell].borderConnects?.includes(map[cellY - 1]?.[cellX - 1]);
		const cellUR = cellData[cell].borderConnects?.includes(map[cellY - 1]?.[cellX + 1]);
		const cellDL = cellData[cell].borderConnects?.includes(map[cellY + 1]?.[cellX - 1]);
		const cellDR = cellData[cell].borderConnects?.includes(map[cellY + 1]?.[cellX + 1]);

		ctx.fillStyle = "black";
		if (!cellU)  ctx.fillRect(screenX,     screenY,     8, 1);
		if (!cellD)  ctx.fillRect(screenX,     screenY + 7, 8, 1);
		if (!cellL)  ctx.fillRect(screenX,     screenY,     1, 8);
		if (!cellR)  ctx.fillRect(screenX + 7, screenY,     1, 8);
		if (!cellUL) ctx.fillRect(screenX,     screenY,     1, 1);
		if (!cellUR) ctx.fillRect(screenX + 7, screenY,     1, 1);
		if (!cellDL) ctx.fillRect(screenX,     screenY + 7, 1, 1);
		if (!cellDR) ctx.fillRect(screenX + 7, screenY + 7, 1, 1);
	}
}

function animate() {
	requestAnimationFrame(animate);
	
	player.update();
	
	camera.x += (-Math.floor(player.position.x / 128) * 128 - camera.x) * 0.2;
	camera.y += (-Math.floor(player.position.y /  96) *  96 - camera.y) * 0.2;
	
	// Draw //
	ctx.resetTransform();
	
	ctx.scale(16, 16);
	
	ctx.translate(Math.round(camera.x), Math.round(camera.y));
	
	ctx.fillStyle = styles.background[0];
	ctx.fillRect(-Math.round(camera.x), 0, 128, 96 * 2);
	
	for (let cellY = 0; cellY < map.length; cellY++) {
		for (let cellX = 0; cellX < map[cellY].length; cellX++) {
			drawTile(cellX, cellY, false);
		}
	}

	player.draw(ctx);
	
	for (let cellY = 0; cellY < map.length; cellY++) {
		for (let cellX = 0; cellX < map[cellY].length; cellX++) {
			drawTile(cellX, cellY, true);
		}
	}
	
	player.bubble.draw(ctx);
	
	shake *= -0.5;
	const dir = Math.random() * Math.PI * 2.0;
	canvas.style.left = "calc(50vw + " + Math.cos(dir) * shake + "px)";
	canvas.style.top  = "calc(50vh + " + Math.sin(dir) * shake + "px)";
}

animate();