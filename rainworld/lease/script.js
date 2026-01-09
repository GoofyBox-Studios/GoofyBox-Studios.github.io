const acronymResults = document.getElementById("acronymResults");
const paletteResults = document.getElementById("paletteResults");
const acronymInput = document.getElementById("acronym");
const popupElement = document.getElementById("popup");
const suggestAcronyms = document.getElementById("suggest-acronyms");
const showUnused = document.getElementById("show-unused");

const gviz_url = `https://docs.google.com/spreadsheets/d/14wt42_ZalI5di8zpUFx3WvPWldC_L7SwIbgb_TxOpUk/gviz/tq?tqx=out:json`
const csv_url = `https://docs.google.com/spreadsheets/d/14wt42_ZalI5di8zpUFx3WvPWldC_L7SwIbgb_TxOpUk/export?format=csv`
const acronyms_url = `${gviz_url}&gid=634960091`;
const connections_url = `${gviz_url}&gid=0`;
const mod_connections_url = `${gviz_url}&gid=758721855`;
const palettes_url = `${csv_url}&gid=1310131772`;

const states = ["Released (1.9)", "Released (1.5)", "Unreleased (>95%)", "In-Progress (>50%)", "In-Progress", "Projected", "On Hiatus"];

let loaded = false;
const acronymData = {
	SU: ["SU", "Outskirts", "", "Videocult", 0],
	HI: ["HI", "Industrial Complex", "", "Videocult", 0],
	GW: ["GW", "Garbage Wastes", "", "Videocult", 0],
	DS: ["DS", "Drainage System", "", "Videocult", 0],
	SH: ["SH", "Shaded Citadel", "Memory Crypts", "Videocult", 0],
	SL: ["SL", "Shoreline", "Looks to the Moon", "Videocult", 0],
	CC: ["CC", "Chimney Canopy", "", "Videocult", 0],
	UW: ["UW", "The Exterior", "The Leg, The Wall, The Underhang", "Videocult", 0],
	SS: ["SS", "Five Pebbles", "Five Pebbles (Memory Conflux), Five Pebbles (Unfortunate Development), Five Pebbles (Recursive Transform Arrays), Five Pebbles (General Systems Bus)", "Videocult", 0],
	SI: ["SI", "Sky Islands", "Communications Array", "Videocult", 0],
	LF: ["LF", "Farm Arrays", "", "Videocult", 0],
	SB: ["SB", "Subterranean", "Filtration System, Depths", "Videocult", 0],
	VS: ["VS", "Pipeyard", "Sump Tunnel", "MSC Team", 0],
	OE: ["OE", "Outer Expanse", "Journey's End, Facility Roots (Western Intake), Sunken Pier", "MSC Team", 0],
	LC: ["LC", "Metropolis", "The Floor, Atop the Tallest Tower, 12th Council Pillar, the House of Braids", "MSC Team", 0],
	LM: ["LM", "Waterfront Facility", "The Precipice", "MSC Team", 0],
	DM: ["DM", "Looks to the Moon", "Struts, Looks to the Moon (Vents), Looks to the Moon (Abstract Convergence Manifold), Looks to the Moon (Neural Terminus), Looks to the Moon (Memory Conflux), Luna", "MSC Team", 0],
	MS: ["MS", "Submerged Superstructure", "Submerged Superstructure (Vents), Submerged Superstructure (The Heart), Bitter Aerie, Auxiliary Transmission Array", "MSC Team", 0],
	RM: ["RM", "The Rot", "Five Pebbles (Primary Cortex), Five Pebbles (Recursive Transform Array), Five Pebbles (Linear Systems Rail), The Rot (Depths), The Rot (Cystic Conduit)", "MSC Team", 0],
	UG: ["UG", "Undergrowth", "", "MSC Team", 0],
	CL: ["CL", "Silent Construct", "Frosted Cathedral, The Husk, Five Pebbles", "MSC Team", 0],
	HR: ["HR", "Rubicon", "", "MSC Team", 0],
	WARF: ["WARF", "Aether Ridge", "", "The Watcher", 0],
	WRFA: ["WRFA", "Coral Caves", "", "The Watcher", 0],
	WSKA: ["WSKA", "Torrential Railways", "", "The Watcher", 0],
	WSKB: ["WSKB", "Sunbaked Alley", "", "The Watcher", 0],
	WARG: ["WARG", "The Surface", "", "The Watcher", 0],
	WBLA: ["WBLA", "Badlands", "", "The Watcher", 0],
	WRFB: ["WRFB", "Turbulent Pump", "", "The Watcher", 0],
	WRRA: ["WRRA", "Rusted Wrecks", "", "The Watcher", 0],
	WSKD: ["WSKD", "Shrouded Stacks", "", "The Watcher", 0],
	WTDA: ["WTDA", "Torrid Desert", "", "The Watcher", 0],
	WARD: ["WARD", "Cold Storage", "", "The Watcher", 0],
	WARE: ["WARE", "Heat Ducts", "", "The Watcher", 0],
	WTDB: ["WTDB", "Desolate Tract", "", "The Watcher", 0],
	WVWA: ["WVWA", "Verdant Waterways", "", "The Watcher", 0],
	WSKC: ["WSKC", "Stormy Coast", "", "The Watcher", 0],
	WARB: ["WARB", "Salination", "", "The Watcher", 0],
	WARC: ["WARC", "Fetid Glen", "", "The Watcher", 0],
	WPTA: ["WPTA", "Signal Spires", "", "The Watcher", 0],
	WSSR: ["WSSR", "Unfortunate Evolution", "", "The Watcher", 0],
	WARA: ["WARA", "Shattered Terrace", "", "The Watcher", 0],
	WAUA: ["WAUA", "Ancient Urban", "", "The Watcher", 0],
	WORA: ["WORA", "Outer Rim", "", "The Watcher", 0],
	WRSA: ["WRSA", "Daemon", "", "The Watcher", 0],
	WDSR: ["WDSR", "Decaying Tunnels", "", "The Watcher", 0],
	WGWR: ["WGWR", "Infested Wastes", "", "The Watcher", 0],
	WHIR: ["WHIR", "Corrupted Factories", "", "The Watcher", 0],
	WSUR: ["WSUR", "Crumbing Fringes", "", "The Watcher", 0],
	WPGA: ["WPGA", "Pillar Grove", "", "The Watcher", 0],
	WMPA: ["WMPA", "Migration Path", "", "The Watcher", 0],
	WVWB: ["WVWB", "Fractured Gateways", "", "The Watcher", 0],
};
const connectionData = {};

const paletteData = {};

const names = new Set(["SU", "HI", "GW", "DS", "SH", "SL", "CC", "UW", "SS", "SI", "LF", "SB", "VS", "OE", "LC", "LM", "DM", "MS", "RM", "UG", "CL", "HR"]);

function getTableData(str) {
	const jsonData = JSON.parse(str.substring(47, str.length - 2));

	return jsonData;
}

function getRows(tableData) {
	return tableData.table.rows.map((row) => row.c.map((cell) => cell?.v ?? ""));
}

function getTableRows(str) {
	return getRows(getTableData(str));
}

function *getUnusedGroups(used, start = 0) {
	let i = start;

	while (true) {
		yield { index: i, used: used.has(i) };

		i++;
	}
}

fetch(acronyms_url)
	.then((response) => response.text())
	.then((text) => {
		const rows = getTableRows(text);

		for (let entry of rows) {
			const key = entry[0].trim();
			if (!key) continue;

			entry[4] = states.indexOf(entry[4]);
			if (!(key in acronymData)) {
				acronymData[key] = entry;
			}
			names.add(key);
		}

		fetch(connections_url)
			.then((response) => response.text())
			.then((text) => {
				const rows = getTableRows(text);
				
				let region = null;
				for (let entry of rows) {
					if (entry[0]) region = Object.values(acronymData).filter((i) => i[1] == entry[0].replace("\n", " "))[0];
					
					if (!entry[1] || !entry[2]) continue;
					
					if (region == null) console.log(entry);
					if (!connectionData[region[0]]) connectionData[region[0]] = [];
					
					entry[3] = entry[3].trim().replace("\n", " ");

					if (!entry[3])
						continue;

					let toRegion = Object.values(acronymData).filter((i) => i[1] == entry[3])[0];
					if (!toRegion) {
						// console.warn("Cannot find region: '" + entry[3] + "'");
						continue;
					}
					if (!connectionData[toRegion[0]]) connectionData[toRegion[0]] = [];
		
					connectionData[region[0]].push({to: entry[3], room: entry[1], type: entry[2], author: entry[4]});
					connectionData[toRegion[0]].push({to: entry[0], room: null, type: entry[2], author: entry[4]});
				}
				
				fetch(palettes_url)
					.then((response) => response.text())
					.then((csv) => {
						const rows = csv.split("\n");
						const used = new Set();
						for (let i = 0; i <= 35; i++) used.add(i);
						
						for (let row of rows) {
							let [number, mod] = row.split(",");
							
							if (!number) continue;

							number = number.replace("\"", "");
							if ((/^-?[0-9]+$/).test(number)) {
								used.add(+number);
							} else {
								let [a, b] = number.split("-").map(x => +x);
								for (let i = a; i <= b; i++) {
									used.add(i);
								}
							}
						}
						
						paletteData.used = used;
						paletteData.available = [];
						paletteData.generator = getUnusedGroups(paletteData.used, 590);

						loaded = true;
						updateAcronyms();
						updatePalettes();

						setInterval(nextPalette, 50);
					});
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	})
	.catch((error) => {
		console.error("Error fetching data:", error);
	});

function generateAcronyms(name, maxLen = 4) {
	if (!name || !name.trim()) return [];
	maxLen = Math.max(2, Math.floor(maxLen) || 4);
	const stopWords = new Set(["the", "of", "in", "and", "a", "an", "to"]);

	const raw = name.trim().split(/\s+/).map(w => w.replace(/[^A-Za-z0-9]/g, "")).filter(Boolean);
	const lower = raw.map(w => w.toLowerCase());
	const words = raw.map(w => w.toUpperCase());

	const results = new Set();

	function push(a) {
		if (!a) return;
		const s = a.toUpperCase();
		if (s.length >= 2 && s.length <= maxLen) results.add(s);
	}

	const initials = words.map(w => w[0]);
	const filteredInitials = words.filter((_, i) => !stopWords.has(lower[i])).map(w => w[0]);

	push(filteredInitials.join(""));
	push(initials.join(""));

	for (let i = 0; i < initials.length; i++) {
		for (let j = 0; j < initials.length; j++) {
			if (i === j) continue;
			push(initials[i] + initials[j]);
		}
	}

	function consonants(w) { return [...w].filter(c => !"AEIOU".includes(c)).join(""); }

	for (const w of words) {
		for (let len = 2; len <= Math.min(maxLen, w.length); len++) push(w.slice(0, len));
		for (let i = 0; i < w.length - 1; i++) push(w[i] + w[i + 1]);
		const cons = consonants(w);
		if (cons) for (let len = 2; len <= Math.min(maxLen, cons.length); len++) push(cons.slice(0, len));
	}

	const prefixes = words.map(w => {
		const opts = [];
		const max = Math.min(3, w.length);
		for (let i = 1; i <= max; i++) opts.push(w.slice(0, i));
		return opts;
	});

	function cartesian(arrs) {
		return arrs.reduce((acc, arr) => {
			const out = [];
			for (const a of acc) for (const b of arr) out.push(a + b);
			return out;
		}, [""]);
	}

	const combos = cartesian(prefixes).map(s => s).filter(s => s.length >= 2 && s.length <= maxLen);
	for (const c of combos) push(c);

	for (let i = 0; i < words.length; i++) {
		for (let j = 0; j < words.length; j++) {
			if (i === j) continue;
			for (let li = 1; li <= Math.min(3, words[i].length); li++) {
				for (let lj = 1; lj <= Math.min(3, words[j].length); lj++) {
					const a = words[i].slice(0, li) + words[j].slice(0, lj);
					push(a);
				}
			}
		}
	}

	for (let i = 0; i < words.length; i++) {
		const others = words.slice(0, i).concat(words.slice(i + 1));
		const joined = words[i] + others.join("");
		const cons = consonants(joined);
		for (let len = 2; len <= Math.min(maxLen, cons.length); len++) push(cons.slice(0, len));
	}

	return Array.from(results);
}

function openPopup(item) {
	popupElement.classList.remove("hidden");

	const header = popupElement.querySelector(".header");
	header.className = "header";
	header.classList.add("state-" + item[4]);
	
	const bubble = header.querySelector(".bubble");
	bubble.innerText = states[item[4]] ?? "Unknown";

	const headerText = header.querySelector("h1");
	headerText.innerText = item[0] + " - " + item[1];

	const authorsElement = popupElement.querySelector("#author");
	authorsElement.replaceChildren();
	
	const authors = item[3].split(", ");
	for (let author of authors) {
		if (!author) continue;

		const li = document.createElement("li");
		li.innerText = author;
		authorsElement.appendChild(li);
	}
	
	const subregionsElement = popupElement.querySelector("#subregions");
	subregionsElement.replaceChildren();
	
	const subregions = new Set([item[1], ...item[2].split(", ")]);
	for (let subregion of subregions) {
		if (!subregion) continue;

		const li = document.createElement("li");
		li.innerText = subregion;
		subregionsElement.appendChild(li);
	}

	const connectionsElement = popupElement.querySelector("#connections");
	connectionsElement.replaceChildren();
	
	const connections = connectionData[item[0]] ?? [];
	for (let connection of connections) {
		if (!connection) continue;

		const li = document.createElement("li");
		li.innerText = `${(connection.type && !connection.to) == "Unused" ? "Unused" : connection.to} (${connection.room ?? "Unknown"}) - ${connection.author}`;
		connectionsElement.appendChild(li);
	}
}

function closePopup() {
	popupElement.classList.add("hidden");
}

function updateAcronyms() {
	if (!loaded) return;

	acronymResults.replaceChildren();

	const frag = document.createDocumentFragment();
	
	if (suggestAcronyms.checked) {
		const input = acronymInput.value.trim();

		const maxLength = 4;
		const suggestions = !input ? [] : generateAcronyms(input, maxLength).filter(acr => acr.length >= 2 && acr.length <= maxLength).sort((a, b) => names.has(a) - names.has(b));

		if (suggestions.length === 0) {
			const p = document.createElement("p");
			p.innerText = "No available suggestions.";
			p.style.display = "block";
			p.style.alignSelf = "center";
			p.style.textAlign = "center";
			acronymResults.appendChild(p);
			return;
		}
	
		for (let acr of suggestions) {
			const available = !names.has(acr);

			const div = document.createElement("div");
			div.classList.add(available ? "state-available" : "state-claimed");
	
			const span = document.createElement("span");
			span.innerText = acr;
			div.appendChild(span);
	
			const desc = document.createElement("span");
			desc.innerText = available ? "Available" : "Claimed";
			div.appendChild(desc);
	
			frag.appendChild(div);
		}
	} else if (showUnused.checked) {
		const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		const suggestions = [];
		for (let x of chars) {
			for (let y of chars) {
				suggestions.push(x + y);
			}
		}

		for (let acr of suggestions) {
			const available = !names.has(acr);

			const div = document.createElement("div");
			if (!available) div.addEventListener("click", () => {
				openPopup(acronymData[acr]);
			});
			div.classList.add(available ? "state-available" : "state-claimed");
	
			const span = document.createElement("span");
			span.innerText = acr;
			div.appendChild(span);
	
			const desc = document.createElement("span");
			desc.innerText = available ? "Available" : "Claimed";
			div.appendChild(desc);
	
			frag.appendChild(div);
		}
	} else {
		const acronymSearchRegex = new RegExp(acronymInput.value.toUpperCase().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
		const nameSearchRegex = new RegExp(acronymInput.value.split("").join(".*?"), "i");

		let added = false;
		for (let acronym of names) {
			const item = acronymData[acronym];

			if (!acronymSearchRegex.test(acronym) && !nameSearchRegex.test(item[1])) continue;
			added = true;

			const div = document.createElement("div");
			div.addEventListener("click", () => {
				openPopup(item);
			});
			div.classList.add("state-" + item[4]);
	
			const span = document.createElement("span");
			span.innerText = acronym;
			div.appendChild(span);
	
			const desc = document.createElement("span");
			desc.innerText = item[1];
			div.appendChild(desc);
	
			frag.appendChild(div);
		}

		if (!added) {
			const p = document.createElement("p");
			p.innerText = "No acronyms claimed";
			p.style.display = "block";
			p.style.alignSelf = "center";
			p.style.textAlign = "center";
			frag.appendChild(p);
			return;
		}
	}

	acronymResults.appendChild(frag);
}

function createPalette(item) {
	const div = document.createElement("div");
	div.classList.add("state-" + (item.used ? "-1" : "0"));

	const span = document.createElement("span");
	span.innerText = item.index;
	div.appendChild(span);

	return div;
}

function updatePalettes() {
	if (!loaded) return;

	paletteResults.replaceChildren();

	const p = document.createElement("div");
	p.innerText = "Palette numbers start at 590 since everything before is claimed";
	p.classList.add("notice");
	paletteResults.appendChild(p);
}

function nextPalette() {
	if (Math.abs(paletteResults.scrollHeight - paletteResults.scrollTop - paletteResults.clientHeight) >= 400)
		return;

	const newVal = paletteData.generator.next().value;
	paletteData.available.push(newVal);
	paletteResults.appendChild(createPalette(newVal));
}

acronymInput.addEventListener("input", updateAcronyms);
suggestAcronyms.addEventListener("input", updateAcronyms);
showUnused.addEventListener("input", updateAcronyms);
document.body.addEventListener("keydown", (event) => {
	if (event.code == "Escape") {
		closePopup();
	}
});