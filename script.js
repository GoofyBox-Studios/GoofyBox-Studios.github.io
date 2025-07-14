let thingsToUpdate = [];

for (let canvas of document.querySelectorAll(".aboutIcon")) {
	canvas.width = 29;
	canvas.height = 29;
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	const sprite = new Sprite(canvas.dataset.sprite);

	thingsToUpdate.push({
		sprite,
		ctx,
		offset: Math.random() * 1234,
		offsetScale: Math.random() * 0.4 + 0.8,
	});
}

let timeFrames = 0;
function animate() {
	requestAnimationFrame(animate);

	timeFrames += 1.0 / 60.0;

	for (let thing of thingsToUpdate) {
		const spriteFrame = Math.floor(timeFrames * 6 * thing.offsetScale + thing.offset);
		thing.ctx.drawImage(thing.sprite, (spriteFrame % 2) * 29, (Math.floor(spriteFrame / 2) % 6) * 29, 29, 29, 0, 0, 29, 29);
	}
}

animate();
global.ready();
