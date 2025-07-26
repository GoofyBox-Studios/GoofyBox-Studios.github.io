const results = document.getElementById("results");
const acronymInput = document.getElementById("acronym");
const popupElement = document.getElementById("popup");
const suggestAcronyms = document.getElementById("suggest-acronyms");

const spreadsheetId = "14wt42_ZalI5di8zpUFx3WvPWldC_L7SwIbgb_TxOpUk";
const ACRONYMS_GID = "634960091";
const CONNECTIONS_GID = "0";
const MOD_CONNECTIONS_GID = "758721855";
const acronyms_url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&gid=${ACRONYMS_GID}`;
const connections_url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&gid=${CONNECTIONS_GID}`;
const mod_connections_url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&gid=${MOD_CONNECTIONS_GID}`;

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
};
const connectionData = {};

const names = new Set(["SU", "HI", "GW", "DS", "SH", "SL", "CC", "UW", "SS", "SI", "LF", "SB", "VS", "OE", "LC", "LM", "DM", "MS", "RM", "UG", "CL", "HR"]);

fetch(acronyms_url)
	.then((response) => response.text())
	.then((text) => {
		const prefixLength = 47;
		const suffixLength = 2;
		const jsonData = JSON.parse(text.substring(prefixLength, text.length - suffixLength));
		const rows = jsonData.table.rows.map((row) => row.c.map((cell) => cell?.v ?? ""));

		for (let entry of rows) {
			const key = entry[0].trim();
			if (!key) continue;

			entry[4] = states.indexOf(entry[4]);
			acronymData[key] = entry;
			names.add(key);
		}

		fetch(connections_url)
			.then((response) => response.text())
			.then((text) => {
				const prefixLength = 47;
				const suffixLength = 2;
				const jsonData = JSON.parse(text.substring(prefixLength, text.length - suffixLength));
				const rows = jsonData.table.rows.map((row) => row.c.map((cell) => cell?.v ?? ""));
				
				let region = null;
				for (let entry of rows) {
					if (entry[0]) region = Object.values(acronymData).filter((i) => i[1] == entry[0].replace("\n", " "))[0];
					
					if (!entry[1] || !entry[2]) continue;
					
					if (!connectionData[region[0]]) connectionData[region[0]] = [];
					
					entry[3] = entry[3].trim();
					let toRegion = Object.values(acronymData).filter((i) => i[1] == entry[3].replace("\n", " "))[0];
					if (!toRegion) {
						console.warn("Cannot find region: '" + entry[3] + "'");
						continue;
					}
					if (!connectionData[toRegion[0]]) connectionData[toRegion[0]] = [];
		
					connectionData[region[0]].push({to: entry[3], room: entry[1], type: entry[2], author: entry[4]});
					connectionData[toRegion[0]].push({to: entry[0], room: null, type: entry[2], author: entry[4]});
				}

				loaded = true;
				update();
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	})
	.catch((error) => {
		console.error("Error fetching data:", error);
	});

function generateAcronyms(name) {
	const stopWords = new Set(["the", "of", "in", "and", "a", "an", "to"]);
	const words = name.trim().split(/\s+/);
	const filteredWords = words.filter(w => !stopWords.has(w.toLowerCase()));

	function upper(word) {
		return word.toUpperCase();
	}

	function consonants(word) {
		return [...upper(word)].filter(c => !"AEIOU".includes(c)).join("");
	}

	function vowels(word) {
		return [...upper(word)].filter(c => "AEIOU".includes(c)).join("");
	}

	const allConsonants = words.map(consonants);
	const initials = words.map(w => upper(w[0]));
	const filteredInitials = filteredWords.map(w => upper(w[0]));

	const acronyms = [];
	const seen = new Set();

	function add(acronym) {
		if (acronym.length > 1 && !seen.has(acronym)) {
			acronyms.push(acronym);
			seen.add(acronym);
		}
	}

	add(filteredInitials.join(""));
	add(initials.join(""));

	for (let i = 0; i < initials.length; i++) {
		for (let j = 0; j < initials.length; j++) {
			if (i !== j) {
				add(initials[i] + initials[j]);
			}
		}
	}

	for (const word of words) {
		const up = upper(word);
		for (let i = 0; i < up.length - 1; i++) {
			add(up[i] + up[i + 1]);
		}
		const cons = consonants(word);
		for (let i = 0; i < cons.length - 1; i++) {
			add(cons[i] + cons[i + 1]);
		}
		const vow = vowels(word);
		if (vow.length > 0 && cons.length > 0) {
			add(cons[0] + vow[0]);
			add(vow[0] + cons[0]);
		}
	}

	function cartesianProduct(arrays) {
		return arrays.reduce((a, b) => {
			const result = [];
			for (const x of a) {
				for (const y of b) {
					result.push(x + y);
				}
			}
			return result;
		});
	}

	const consonantCombos = cartesianProduct(allConsonants.map(s => [...s].slice(0, 2)));
	for (const combo of consonantCombos) {
		add(combo.slice(0, 3));
	}

	const joined = allConsonants.join("");
	for (let i = 2; i <= Math.min(joined.length, 4); i++) {
		add(joined.slice(0, i));
	}

	return acronyms;
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

function update() {
	if (!loaded) return;

	results.replaceChildren();

	const frag = document.createDocumentFragment();
	
	if (suggestAcronyms.checked) {
		const input = acronymInput.value.trim();

		const suggestions = input ? generateAcronyms(input).filter(acr => acr.length >= 2 && acr.length <= 4).sort((a, b) => names.has(a) - names.has(b)) : [];

		if (suggestions.length === 0) {
			const p = document.createElement("p");
			p.innerText = "No available suggestions.";
			p.style.display = "block";
			p.style.alignSelf = "center";
			p.style.textAlign = "center";
			results.appendChild(p);
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
	} else {
		const searchRegex = new RegExp(acronymInput.value.toUpperCase().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));

		let added = false;
		for (let acronym of names) {
			if (!searchRegex.test(acronym)) continue;
			added = true;
	
			const item = acronymData[acronym];
	
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
			results.appendChild(p);
			return;
		}
	}

	results.appendChild(frag);
}

acronymInput.addEventListener("input", update);
suggestAcronyms.addEventListener("input", update);
document.body.addEventListener("keydown", (event) => {
	if (event.code == "Escape") {
		closePopup();
	}
});