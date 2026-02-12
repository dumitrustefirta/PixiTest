import { Application, Graphics } from "pixi.js";

(async () => {
  const appWidth = 400;
  const appHeight = 600;
  let gravity = 1;
  let shapeFrequency = 1;

  const app = new Application();
  await app.init({ width: appWidth, height: appHeight, backgroundColor: 0x333333 });
  document.body.appendChild(app.canvas);

  const shapes = [];

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Shape generation 
  function createShape(x, y, randomStart = false) {
    const graphics = new Graphics();
    const shapeType = Math.floor(Math.random() * 5) + 1; // Generates 1-5
    const color = Math.random() * 0xffffff;

    graphics.fill(color);
    graphics.cursor = "pointer";

    switch (shapeType) {
      case 1: // Triangle
        graphics.poly([
          0, 0,
          40, 0,
          20, 40
        ]);
        break;
      case 2: // Square
        graphics.rect(0, 0, 40, 40);
        break;
      case 3: // Circle
        graphics.circle(0, 0, 20);
        break;
      case 4: // Star
        graphics.star(0, 0, 5, 20, 10);
        break;
      case 5: // Pentagon
        const sides = 5;
        const radius = 20;
        const pentagonPoints = [];
        for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
          pentagonPoints.push(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius
          );
        }
        graphics.poly(pentagonPoints);
        break;
    }

    graphics.fill();

    if (randomStart) {
      x = random(0, appWidth);
      y = -50;
    }

    graphics.x = x;
    graphics.y = y;
    graphics.interactive = true;
    graphics.buttonMode = true;

    // delete shape onClick
    graphics.on("pointerdown", () => {
      app.stage.removeChild(graphics);
      const index = shapes.indexOf(graphics);
      if (index > -1) shapes.splice(index, 1);
    });

    shapes.push(graphics);
    app.stage.addChild(graphics);
  }

  // UI data actualization
  function updateInfo() {
    document.getElementById("shapeCount").textContent = `Shapes: ${shapes.length}`;
    const totalArea = shapes.length * 40 * 40;
    document.getElementById("areaCount").textContent = `Area: ${totalArea} px²`;
    document.getElementById("gravValue").textContent = `Gravity: ${gravity}`;
    document.getElementById("freqValue").textContent = `${shapeFrequency}`;
  }

  // Running Ticker Callbacks
  app.ticker.add(() => {
    shapes.forEach(shape => {
      shape.y += gravity;
    });

    // remove shapes that are outside
    for (let i = shapes.length - 1; i >= 0; i--) {
      if (shapes[i].y > appHeight + 50) {
        app.stage.removeChild(shapes[i]);
        shapes.splice(i, 1);
      }
    }

    updateInfo();
  });

  // automatic shape generation 
  setInterval(() => {
    for (let i = 0; i < shapeFrequency; i++) {
      createShape(0, 0, true);
    }
  }, 1000);

  // onClick -> new canvas
  app.canvas.addEventListener("pointerdown", (e) => {
    const rect = app.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createShape(x, y, false);
  });

  // functions for controll buttons
  document.getElementById("plusFreq").onclick = () => shapeFrequency++;
  document.getElementById("minusFreq").onclick = () => { if (shapeFrequency > 1) shapeFrequency--; };
  document.getElementById("plusGrav").onclick = () => gravity++;
  document.getElementById("minusGrav").onclick = () => { if (gravity > 1) gravity--; };
})();
