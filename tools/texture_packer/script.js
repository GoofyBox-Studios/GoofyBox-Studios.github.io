function pickArea(areas, image) {
	let validAreas = areas.filter(area => (area.width >= image.width && area.height >= image.height)).map(a => {
		return [a, Math.max(image.width / a.width, image.height / a.height)];
	});
	if (validAreas.length == 0) return null;

	return validAreas.reduce((m, c) => (c[1] > m[1] ?? -1000) ? c : m)[0];
}

function expand(x) {
	return x + x * 0.25;
}

async function packTextures(outputName) {
	const files = document.getElementById("imageInput").files;
	if (files.length === 0) {
		alert("No files!");
		return;
	}

	outputName = prompt("Enter file name (no extensions)\nE.g. image");

	const images = await Promise.all(Array.from(files).map(file => {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve({ img: img, file: file, width: img.width, height: img.height, x: -1, y: -1 });
			img.onerror = reject;
			img.src = URL.createObjectURL(file);
		});
	}));
	
	images.sort((a, b) => b.height * b.width - a.height * a.width);

	const canvas = document.getElementById("outputCanvas");
	const ctx = canvas.getContext("2d");

	let totalWidth = Math.pow(2, Math.ceil(Math.log2(images[0].width)));
	let totalHeight = Math.pow(2, Math.ceil(Math.log2(images[0].height)));
	let right = 0;
	let bottom = 0;

	let endAreas = [];
	let areas = [
		{ x: 0, y: 0, width: totalWidth, height: totalHeight },
	];
	for (let image of images) {
		console.log(JSON.parse(JSON.stringify(areas)));
		console.log("Placing ", image.width + "x" + image.height, " - ", image.file);
		let area = pickArea(areas, image);
		let tries = 0;

		while (area == null) {
			console.log(`Increasing ${totalWidth <= totalHeight ? 'X' : 'Y'}... ` + totalWidth + "x" + totalHeight);

			if (totalWidth <= totalHeight) {
				let newWidth = expand(totalWidth);
				for (let area of areas) {
					if (area.height > 0 && area.x + area.width == totalWidth) {
						area.width = newWidth - area.x;
					}
				}
				totalWidth = newWidth;
			} else {
				let newHeight = expand(totalHeight);
				for (let area of areas) {
					if (area.width > 0 && area.y + area.height == totalHeight) {
						area.height = newHeight - area.y;
					}
				}
				totalHeight = newHeight;
			}

			area = pickArea(areas, image);
			if (tries++ > 32) {
				console.error("Cannot pack!");
				return null;
			}
		}

		endAreas.push({ x: area.x, y: area.y, width: image.width, height: image.height });
		areas.splice(areas.indexOf(area), 1);
		console.log("placed image ", area.x, "x", area.y);
		image.x = area.x;
		image.y = area.y;
		right = Math.max(right, image.x + image.width - 1);
		bottom = Math.max(bottom, image.y + image.height - 1);
		if (area.width - image.width > 0) {
			areas.push({ x: area.x + image.width, y: area.y, width: area.width - image.width, height: area.height });
			areas.push({ x: area.x, y: area.y + image.height, width: image.width, height: area.height - image.height });
		}
		else {
			areas.push({ x: area.x + image.width, y: area.y, width: area.width - image.width, height: image.height });
			areas.push({ x: area.x, y: area.y + image.height, width: area.width, height: area.height - image.height });
		}
	}

	totalWidth = right + 1;
	totalHeight = bottom + 1;

	canvas.width = totalWidth;
	canvas.height = totalHeight;

	const spriteData = {
		"frames": {},
		"meta": {},
	};

	// endAreas.forEach((area) => {
	// 	ctx.fillStyle = "rgb(" + Math.floor(Math.random() * 128 + 128) + ", " + Math.floor(Math.random() * 128 + 128) + ", " + Math.floor(Math.random() * 128 + 128) + ")";
	// 	ctx.fillRect(area.x, area.y, area.width, area.height);
	// });

	images.forEach((img, index) => {
		ctx.drawImage(img.img, img.x, img.y);

		spriteData.frames[img.file.name] = {
			"frame": { "x": img.x, "y": img.y, "w": img.width, "h": img.height },
			"rotated": false,
			"trimmed": false,
			"sourceSize": { "w": img.width, "h": img.height },
			"spriteSourceSize": { "x": 0, "y": 0, "w": img.width, "h": img.height }
		};
	});

	spriteData.meta = {
		"app": "https://goofybox-studios.github.io/tools/texture_packer",
		"image": outputName,
		"size": { "w": totalWidth, "h": totalHeight }
	};

	const downloadLink = document.getElementById("downloadA");
	downloadLink.href = canvas.toDataURL("image/png");
	downloadLink.download = outputName + ".png";
	downloadLink.textContent = "Download " + outputName + ".png";
	downloadLink.style.display = "block";

	const jsonDataUrl = "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(spriteData, null, "\t"));
	const jsonLink = document.getElementById("downloadB");
	jsonLink.href = jsonDataUrl;
	jsonLink.download = outputName + ".txt";
	jsonLink.textContent = "Download " + outputName + ".txt";
	jsonLink.style.display = "block";
}