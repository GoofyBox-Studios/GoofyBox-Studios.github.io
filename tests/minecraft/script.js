function scanIncompatibilities() {
	let fails = new Set();

	for (let mod of enabledMods) mod.element.classList.remove("failed");

	for (let i = 0; i < enabledMods.length; i++) {
		const mod = enabledMods[i];

		for (let j = 0; j < enabledMods.length; j++) {
			const otherMod = enabledMods[j];

			if (mod.incompatibilities.includes(otherMod.mod_id) || otherMod.incompatibilities.includes(mod.mod_id)) {
				fails.add(mod);
				fails.add(otherMod);
			}
		}
	}

	messageElement.innerHTML = "&nbsp;";
	if (fails.size == 0) return;

	let message = "Compatibility issue" + (fails.size > 2 ? "s" : "") + " found between<br>";
	let i = 0;
	for (let mod of fails) {
		mod.element.classList.add("failed");
		message += "<em>" + mod.mod_name + "</em>" + (fails.size > 2 && i != fails.size - 1 ? "," : "") + " " + (i == fails.size - 2 ? "and " : "");
		i++;
	}

	messageElement.innerHTML = message;
}

const enabledMods = [];

for (let mod of MODS) {
	const modElement = document.createElement("div");
	modElement.classList.add("mod");
	modElement.onclick = function () {
		messageElement.innerHTML = "&nbsp;";
		modElement.classList.toggle("selected");

		if (modElement.classList.contains("selected")) {
			enabledMods.push(mod);

			scanIncompatibilities();
		} else {
			enabledMods.splice(enabledMods.indexOf(mod), 1);

			mod.element.classList.remove("failed");

			scanIncompatibilities();
		}
	};

	const modIcon = new Image();
	modIcon.src = mod.mod_icon;
	modIcon.classList.add("mod-icon");
	modElement.appendChild(modIcon);

	const modName = document.createElement("p");
	modName.classList.add("mod-name");
	modName.innerText = mod.mod_name;
	modElement.appendChild(modName);

	const modDescription = document.createElement("p");
	modDescription.classList.add("mod-description");
	modDescription.innerText = mod.mod_description;
	modElement.appendChild(modDescription);

	modContainerElement.appendChild(modElement);

	mod.element = modElement;
}

function applyMod(mod, zip) {
	// zip.file(mod.mod_id + ".json", mod.mod_description);

	for (let key in mod) {
		if (mod[key].__type__ == "folder") {
			applyMod(mod[key], zip.folder(key));
		} else if (key != "__type__") {
			if (mod[key].includes("data:image/png;base64,")) {
				zip.file(key, mod[key].replace("data:image/png;base64,", ""), { base64: true });
			} else {
				zip.file(key, mod[key]);
			}
		}
	}
}

function loadAddon(file) {
	console.log("Loading addon...");
}

fileInput.onchange = function () {
	if (!fileInput.files[0]) return;

	const type = fileInput.files[0].type;

	if (type == "application/zip") {
		loadAddon(fileInput.files[0]);
	} else if (type == "image/png") {
		const reader = new FileReader();

		reader.onloadend = function () {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			const img = new Image();
			img.src = reader.result;
			img.onload = function () {
				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0);

				const data = ctx.getImageData(0, 0, img.width, img.height);
				for (let x = 0; x < img.width; x++) {
					for (let y = 0; y < img.height; y++) {
						let i = (x + y * img.width) * 4;

						if (data.data[i + 3] > 0) data.data[i + 3] = 4;
					}
				}
				ctx.putImageData(data, 0, 0);

				console.log(canvas);
			};
			console.log(reader.result);
		};

		reader.readAsDataURL(fileInput.files[0]);
	}
};

downloadElement.onclick = function () {
	const zip = new JSZip();

	for (let mod of enabledMods) applyMod(mod.mod, zip);

	zip.file(
		"manifest.json",
		JSON.stringify(
			{
				format_version: 2,
				header: {
					description: "...",
					name: "GoofyBox Pack",
					uuid: crypto.randomUUID(),
					version: [0, 0, 1],
					min_engine_version: [1, 20, 0],
				},
				modules: [
					{
						description: "...",
						type: "resources",
						uuid: crypto.randomUUID(),
						version: [0, 0, 1],
					},
				],
				metadata: {
					authors: ["GoofyBox Studios"],
					license: "MIT",
					url: "https://goofybox.glitch.me/minecraft",
					generated_with: {
						goofybox_minecraft: ["1.0.0"],
					},
				},
			},
			null,
			4
		)
	);

	zip.file(
		"enabledMods.json",
		JSON.stringify(
			{
				mods: enabledMods.map((a) => a.mod_id),
			},
			null,
			4
		)
	);

	zip.generateAsync({ type: "blob" }).then(function (content) {
		saveAs(content, "mod.zip");
	});
};
