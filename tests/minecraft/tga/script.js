const targa = new Targa();

let loadData = [];
function oneLoaded(image, id) {
	loadData[id] = image;
	if (loadData[0] && loadData[1]) twoLoaded();
}

function twoLoaded() {
	const imageA = loadData[0];
	const imageB = loadData[1];

	const canvas = document.createElement("canvas");
	canvas.width = imageA.width;
	canvas.height = imageA.height;
	const ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.globalAlpha = 4.0 / 255.0;
	ctx.drawImage(imageA, 0, 0);
	ctx.globalAlpha = 1.0;
	ctx.drawImage(imageB, 0, 0);

	generateTGA(canvas, ctx);
}

function encodeRLE(data, pixelSize) {
	var pos, count, output, i;
	var pixels, prevPixels;

	output = [];
	pos = 0;
	prevPixels = new Uint8Array(pixelSize);

	while (pos < data.length) {
		count = 1;
		// Copy the current pixel to prevPixels
		for (i = 0; i < pixelSize; ++i) {
			prevPixels[i] = data[pos + i];
		}

		// Count how many times the current pixel repeats
		while (pos + count * pixelSize < data.length && count < 0x80) {
			var match = true;
			for (i = 0; i < pixelSize; ++i) {
				if (data[pos + count * pixelSize + i] !== prevPixels[i]) {
					match = false;
					break;
				}
			}
			if (!match) break;
			count++;
		}

		// If the pixel repeats more than once, use RLE encoding
		if (count > 1) {
			output.push(0x80 | (count - 1));
			for (i = 0; i < pixelSize; ++i) {
				output.push(prevPixels[i]);
			}
			pos += count * pixelSize;
		} else {
			// Handle raw pixels
			var rawStart = pos;
			count = 0;
			do {
				count++;
				pos += pixelSize;

				if (pos >= data.length || count === 0x7f) break;

				for (i = 0; i < pixelSize; ++i) {
					if (data[pos + i] !== data[rawStart + (count - 1) * pixelSize + i]) break;
				}
				if (i === pixelSize) break;
			} while (pos < data.length);

			output.push(count - 1);
			for (i = 0; i < count * pixelSize; ++i) {
				output.push(data[rawStart + i]);
			}
		}
	}

	return new Uint8Array(output);
}

function decodeRLE(data, offset, pixelSize, outputSize) {
	var pos, c, count, i;
	var pixels, output;

	output = new Uint8Array(outputSize);
	pixels = new Uint8Array(pixelSize);
	pos = 0;

	while (pos < outputSize) {
		c = data[offset++];
		count = (c & 0x7f) + 1;

		// RLE pixels.
		if (c & 0x80) {
			// Bind pixel tmp array
			for (i = 0; i < pixelSize; ++i) {
				pixels[i] = data[offset++];
			}

			// Copy pixel array
			for (i = 0; i < count; ++i) {
				output.set(pixels, pos);
				pos += pixelSize;
			}
		}

		// Raw pixels.
		else {
			count *= pixelSize;
			for (i = 0; i < count; ++i) {
				output[pos++] = data[offset++];
			}
		}
	}

	return output;
}

function generateTGA(canvas, ctx) {
	const buffer = new Uint8Array(18 + 4 * canvas.width * canvas.height);
	let i = 0;
	buffer[i++] = 0;
	buffer[i++] = 0;
	buffer[i++] = 2;
	buffer[i++] = 0;
	buffer[i++] = 0;
	buffer[i++] = 0;
	buffer[i++] = 0;
	buffer[i++] = 0;
	buffer[i++] = 0;
	buffer[i++] = 0;
	buffer[i++] = 0;
	buffer[i++] = 0;
	buffer[i++] = 64;
	buffer[i++] = 0;
	buffer[i++] = 32;
	buffer[i++] = 0;
	buffer[i++] = 32;
	buffer[i++] = 8;

	// buffer[i++] = 0;
	// buffer[i++] = 0;

	let imagedata = ctx.getImageData(0, 0, canvas.width, canvas.height);
	for (let y = canvas.height - 1; y >= 0; y--) {
		for (let x = 0; x < canvas.width; x++) {
			let j = (x + y * canvas.width) * 4;

			buffer[i++] = imagedata.data[j + 2];
			buffer[i++] = imagedata.data[j + 1];
			buffer[i++] = imagedata.data[j + 0];
			buffer[i++] = imagedata.data[j + 3];
		}
	}

	let blob = new Blob([buffer], { type: "image/targa" });

	let link = document.createElement("a");

	link.type = "download";
	link.href = URL.createObjectURL(blob);
	link.download = "Test.tga";
	link.click();
}

generate.onclick = function () {
	if (!base.files[0]) return;
	if (!collar.files[0]) return;

	const fileA = base.files[0];
	const fileB = collar.files[0];

	const readerA = new FileReader();
	readerA.onloadend = function () {
		const image = new Image();
		image.src = readerA.result;
		image.onload = function () {
			oneLoaded(image, 0);
		};
	};
	readerA.readAsDataURL(fileA);

	const readerB = new FileReader();
	readerB.onloadend = function () {
		const image = new Image();
		image.src = readerB.result;
		image.onload = function () {
			oneLoaded(image, 1);
		};
	};
	readerB.readAsDataURL(fileB);

	//   file.arrayBuffer().then((data) => {
	//     console.log(data);
	//     let array = new Uint8Array(data);
	//     targa.load(array);
	//     const canvas = targa.getCanvas();
	//     const ctx = canvas.getContext("2d");
	//     document.body.appendChild(canvas);

	//     // ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer
	//   });
};
