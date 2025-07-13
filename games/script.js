/* global games gamesElement archivedGamesElement */

for (let game of games) {
	if (game.disabled) continue;
	if (game.isArchived && typeof archivedGamesElement == "undefined") continue;

	const element = document.createElement("div");
	element.classList.add("game");

	const title = document.createElement("div");
	title.classList.add("gameTitle");
	title.innerText = game.name;
	element.appendChild(title);

	const description = document.createElement("div");
	description.innerText = game.description;
	element.appendChild(description);

	element.onclick = function () {
		window.open(game.link, "_blank");
	};

	const parentElement = game.isArchived ? archivedGamesElement : gamesElement;
	parentElement.appendChild(element);
}

global.ready();