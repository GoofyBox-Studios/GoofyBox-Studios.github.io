const backgroundImages = [
	"https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/Palette0.png?v=1723432200540",
	"https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/Palette1.png?v=1723432195935",
	"https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/Palette2.png?v=1723432196703",
	"https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/Palette3.png?v=1723432197621",
	"https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/Palette4.png?v=1723432198520",
	"https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/Palette5.png?v=1723432201342",
	"https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/Palette6.png?v=1723432194969",
	"https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/Palette7.png?v=1723432191553",
	"https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/Palette8.png?v=1723432192865",
	"https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/Palette9.png?v=1723432193828",
	"https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/Palette10.png?v=1723432199624"
];

document.querySelector(".header").style.backgroundImage = "url(\"" + backgroundImages[Math.floor(Math.random() * backgroundImages.length)] + "\")";

global.ready();

setTimeout(function () {
  global.emit("initStickers");
}, 500);