class Signaler {
  constructor() {
    this._signals = {};
  }
  
  emit(signalName) {
    if (!this._signals[signalName]) this._signals[signalName] = [];
    
    for (let callback of this._signals[signalName]) {
      callback();
    }
  }
  
  connect(signalName, callback) {
    if (!this._signals[signalName]) this._signals[signalName] = [];
    
    this._signals[signalName].push(callback);
  }
}

const global = new (class extends Signaler {
  ready() {
    this.emit("ready");
  }
});


const sidebar = {};
sidebar.icons = {
  "Home": {
    img: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/home.png?v=1715739057693",
    link: "https://goofybox.glitch.me/"
  },
  "Music": {
    img: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/music.png?v=1715739057901",
    link: "https://goofybox.glitch.me/songs/"
  },
  "SFX": {
    img: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/IconSFX.png?v=1715663541947",
    link: "",
    disabled: true
  },
  "Gallery": {
    img: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/gallery.png?v=1715739056893",
    link: "",
    disabled: true
  },
  "Games": {
    img: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/game.png?v=1715739057138",
    link: "https://goofybox.glitch.me/games/",
  },
  "Bar": {
    isBar: true
  },
  "Iris": {
    img: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/IrisIcon.png?v=1723441407529",
    link: "https://goofybox.glitch.me/games/iris/"
  },
  "Shape of Balance": {
    img: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/ShapeOfBalance%20Icon.png?v=1724522903167",
    link: "https://goofybox.glitch.me/games/shape_of_balance",
  },
  "Archives": {
    img: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/IconArchives.png?v=1715661688897",
    link: "https://goofybox.glitch.me/archives/"
  },
  "Song Editor": {
    img: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/musicEditor.png?v=1715739058150",
    link: "https://goofybox.glitch.me/songs/editor/"
  },
  "Quotes": {
    img: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/Cookie.png?v=1714190930928",
    link: "https://quote-board.glitch.me/",
    disabled: true
  },
  // "": {
  //   img: "",
  //   link: ""
  // },
};

sidebar.element = document.createElement("div");
sidebar.element.classList.add("sidebar");
document.body.appendChild(sidebar.element);

sidebar.button = document.createElement("button");
sidebar.button.classList.add("sidebarButton");
sidebar.element.appendChild(sidebar.button);
sidebar.button.onclick = function () {
  sidebar.element.classList.toggle("open");
}

for (let iconName in sidebar.icons) {
  if (sidebar.icons[iconName].isBar) {
    const element = document.createElement("hr");
    
    sidebar.element.appendChild(element);
    
    continue;
  }
  
  if (sidebar.icons[iconName].disabled) continue;
  
  const element = document.createElement("div");
  element.classList.add("sidebarIcon");
  
  const img = document.createElement("img");
  img.src = sidebar.icons[iconName].img;
  img.draggable = false;
  img.alt = "Icon for " + iconName;
  element.appendChild(img);
  
  const text = document.createElement("span");
  text.innerText = iconName;
  element.appendChild(text);
  
  sidebar.element.appendChild(element);
  
  if (!sidebar.icons[iconName].disabled) {
    element.onclick = function (event) {
      window.open(sidebar.icons[iconName].link, (event.ctrlKey || event.metaKey) ? "_blank" : "_self");
    }
    element.onmouseup = function (event) {
      if (event.button == 1) window.open(sidebar.icons[iconName].link, "_blank");
    }
  }
}


for (let node of document.querySelectorAll(".siteLink")) {
  if (!node.dataset.link) continue;
  
  node.onclick = () => location.href = node.dataset.link;
}
// musicArchive.onclick = function () {
//   location.href = "https://goofybox.glitch.me/archives/songs";
// }
// gamesArchive.onclick = function () {
//   location.href = "https://goofybox.glitch.me/archives/games";
// }

if (typeof itch != "undefined") {
  itch.onclick = () => window.open('https://goofybox-studios.itch.io/');
}


function lerp(a, b, t) {
  return (b - a) * t + a;
}

{ // Background
  const background = document.createElement("canvas");
  const ctx = background.getContext("2d");
  background.id = "background";
  document.body.appendChild(background);
  
  class Particle {
    constructor() {
      this.x = Math.random() * background.width;
      this.y = background.height + 80;
      this.rotation = Math.PI * 2.0 * Math.random();
      this.width = 5;
      this.height = 5;
      this.scale = 6.0 + Math.random() * 4.0;
      this.colour = "white";
      
      this.vx = 0.0;
      this.vy = -1.0 * (Math.random() * 0.5 + 0.75);
      this.rotationVelocity = (Math.random() * 2.0 - 1.0) * 0.01;
    }
    
    update() {
      this.vx += (Math.random() * 2.0 - 1.0) * 0.05;
      this.vx *= 0.9;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationVelocity;
      
      if (this.y <= -50) {
        this.kill();
        return true;
      }
    }
    
    kill() {
      particles.splice(particles.indexOf(this), 1);
    }
    
    draw(ctx) {
      let width = this.width * this.scale;
      let height = this.width * this.scale;
      
      let x0 = Math.cos(this.rotation + Math.PI * 0.0) * width,
          y0 = Math.sin(this.rotation + Math.PI * 0.0) * height;
      let x1 = Math.cos(this.rotation + Math.PI * 0.5) * width,
          y1 = Math.sin(this.rotation + Math.PI * 0.5) * height;
      let x2 = Math.cos(this.rotation + Math.PI * 1.0) * width,
          y2 = Math.sin(this.rotation + Math.PI * 1.0) * height;
      let x3 = Math.cos(this.rotation + Math.PI * 1.5) * width,
          y3 = Math.sin(this.rotation + Math.PI * 1.5) * height;
      
      ctx.beginPath();
      
      ctx.moveTo(this.x + x0, this.y + y0);
      ctx.lineTo(this.x + x1, this.y + y1);
      ctx.lineTo(this.x + x2, this.y + y2);
      ctx.lineTo(this.x + x3, this.y + y3);
      ctx.lineTo(this.x + x0, this.y + y0);
      
      ctx.fillStyle = this.colour;
      ctx.strokeStyle = this.colour;
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.fill();
      ctx.stroke();
    }
  }
  
  const particles = [];
  
  let particleTimer = 0.0;
  
  function animate() {
    requestAnimationFrame(animate);
    
    rect = document.documentElement.getBoundingClientRect();
    
    background.width = rect.width;
    background.height = rect.height;
    ctx.clearRect(0, 0, background.width, background.height);
    
    // ctx.fillRect(0, 0, 100, 100);
    
    particleTimer -= 1.0;
    if (particleTimer <= 0.0) {
      particles.push(new Particle());
      particleTimer = 60000.0 / background.width;
    }
    
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      
      const killed = particle.update();
      
      if (killed) {
        i--;
        continue;
      }
      
      particle.draw(ctx);
    }
  }
  
  global.connect("ready", function () {
    let rect = document.documentElement.getBoundingClientRect();

    background.width = rect.width;
    background.height = rect.height;
    
  
    let initialParticleCount = background.height / (60000.0 / background.width);
    for (let i = 0; i < initialParticleCount; i++) {
      const particle = new Particle();

      particle.y = Math.random() * background.height;

      particles.push(particle);
    }
    
    animate();
  });
  
  // Stickers
  {
    const stickerNodes = document.querySelectorAll(".sticker");

    const stickers = [];

    const mouse = { x: 0, y: 0 };

    function parsePixel(styleValue) {
      return +styleValue.replace("px", "");
    }

    function resetStickerPosition(sticker) {
      let forceOverride = false;

      if (!sticker.initialized) {
        sticker.onRight = Math.random() < 0.5;
        sticker.initialized = true;

        forceOverride = true;
      }

      if (sticker.grabbed) return;

      const onScreen =
          (parsePixel(sticker.node.style.left) <= window.innerWidth - 40) &&
          (parsePixel(sticker.node.style.left) >= -40) &&
          (parsePixel(sticker.node.style.top) >= -40) &&
          (parsePixel(sticker.node.style.top) <= document.body.scrollHeight - 40);

      if (onScreen && !forceOverride) return;

      const gutterSize = 200;

      if (sticker.onRight) {
        sticker.node.style.left = (window.innerWidth - 80 - Math.random() * (gutterSize - 80)) + "px";
      } else {
        sticker.node.style.left = (Math.random() * (gutterSize - 80)) + "px";
      }

      sticker.node.style.top = (Math.random() * (document.body.scrollHeight - 320) + 160) + "px";
    }

    function initStickers() {
      for (let stickerNode of stickerNodes) {
        const sticker = {
          node: stickerNode,

          touched: false,

          grabbed: false,
          grabOffsetX: 0,
          grabOffsetY: 0,
        };
        stickers.push(sticker);

        resetStickerPosition(sticker);

        sticker.node.onmousedown = function (e) {
          e.preventDefault();

          sticker.grabbed = true;
          sticker.touched = true;
          sticker.grabOffsetX = parsePixel(sticker.node.style.left) - e.pageX;
          sticker.grabOffsetY = parsePixel(sticker.node.style.top) - e.pageY;
          sticker.node.classList.add("held");
          document.body.removeChild(sticker.node);
          document.body.appendChild(sticker.node);
        }
      }

      animate();
    }

    document.body.addEventListener("mousemove", function (e) {
      // console.log(e);
      mouse.x = e.pageX;
      mouse.y = e.pageY;
    });

    document.body.addEventListener("mouseup", function (e) {
      for (let sticker of stickers) {
        if (!sticker.grabbed) continue;

        sticker.grabbed = false;
        sticker.node.classList.remove("held");
      }
    });

    window.addEventListener("resize", function (e) {
      for (let sticker of stickers) {
            if (sticker.touched) continue;

        resetStickerPosition(sticker);
      }
    });

    function animate() {
      requestAnimationFrame(animate);

      for (let sticker of stickers) {
          resetStickerPosition(sticker);

        if (!sticker.grabbed) continue;

        sticker.node.style.left = (mouse.x + sticker.grabOffsetX) + "px";
        sticker.node.style.top = (mouse.y + sticker.grabOffsetY) + "px";
      }
    }
    
    global.connect("initStickers", function () {
      initStickers();
    });
  }
}