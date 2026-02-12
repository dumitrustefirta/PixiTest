// import { Application, Graphics } from "pixi.js";
import { Application, Graphics } from "../node_modules/pixi.js/dist/pixi.mjs";

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

	// Shape generation function
	function createShape(x, y, randomStart = false) {
		const graphics = new Graphics();
		const shapeType = Math.floor(Math.random() * 7) + 1;
		const color = Math.random() * 0xffffff;

		graphics.fill(color);
		graphics.cursor = "pointer";

		switch (shapeType) {
		case 1: 
			graphics.poly([
			0, -20,
			20, 20,
			-20, 20
			]);
			break;
			
		case 2: 
			graphics.rect(-20, -20, 40, 40);
			break;
			
		case 3: 
			graphics.poly([
			0, -20,
			19, -6,
			12, 16,
			-12, 16,
			-19, -6
			]);
			break;
			
		case 4: 
			graphics.poly([
			0, -20,
			17, -10,
			17, 10,
			0, 20,
			-17, 10,
			-17, -10
			]);
			break;
			
		case 5: 
			graphics.circle(0, 0, 20);
			break;
			
		case 6: 
			graphics.ellipse(0, 0, 25, 15);
			break;
			
		case 7: 
			graphics.star(0, 0, 5, 20, 10);
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
    const totalArea = shapes.length * 40 * 40;
    
		document.getElementById("shapeCount").textContent = `Shapes: ${shapes.length}`;
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
