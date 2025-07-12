// global.ready();

const customMouse = document.getElementById("customMouse");

const hoverDetecting = [
  document.querySelector(".embed button"),
  ...document.querySelectorAll(".sticker"),
  document.querySelector(".sidebarButton"),
  ...document.querySelectorAll(".sidebarIcon"),
];

document.body.addEventListener("mousemove", function (event) {
  customMouse.style.left = event.clientX + "px";
  customMouse.style.top = event.clientY + "px";
  customMouse.style.display = "block";
});

document.addEventListener("mouseleave", function (event) {
  customMouse.style.display = "none";
});

function setCustomCursor(index) {
  for (let i = 0; i < 3; i++) customMouse.children[i].style.display = "none";
  
  customMouse.children[index].style.display = "block";
}

function animate() {
  requestAnimationFrame(animate);
  
  let customCursor = 0;
  
  for (let element of hoverDetecting) {
    if (element.matches(':hover')) customCursor = customCursor || 1;
    if (element.matches(':active')) customCursor = 2;
  }
  
  setCustomCursor(customCursor);
}

animate();


setTimeout(function () {
  global.emit("initStickers");
}, 500);