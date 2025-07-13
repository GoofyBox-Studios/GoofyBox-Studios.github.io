const backgroundImages = [
	"/assets/iris/Palette0.png",
	"/assets/iris/Palette1.png",
	"/assets/iris/Palette2.png",
	"/assets/iris/Palette3.png",
	"/assets/iris/Palette4.png",
	"/assets/iris/Palette5.png",
	"/assets/iris/Palette6.png",
	"/assets/iris/Palette7.png",
	"/assets/iris/Palette8.png",
	"/assets/iris/Palette9.png",
	"/assets/iris/Palette10.png"
];

document.querySelector(".header").style.backgroundImage = "url(\"" + backgroundImages[Math.floor(Math.random() * backgroundImages.length)] + "\")";

global.ready();

setTimeout(function () {
  global.emit("initStickers");
}, 500);