import * as dat from 'dat.gui';
import * as p5 from 'p5';

//https://natureofcode.com/book/chapter-8-fractals/

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const configs = {
    angle: Math.PI / 3,
    lenMultiplier: 200,
    levelMultiplier: 1,
    levels: 5
}


const setupConfig = () => {

    let gui = new dat.GUI();
    gui.add(configs, "angle", 0, Math.PI * 2, 0.01);
    gui.add(configs, "lenMultiplier", 0, 1000, 1);
    gui.add(configs, "levelMultiplier", 0, 10, 0.001);
    gui.add(configs, "levels", 5, 10, 1);

    gui.close(); // start the sketch with the GUI closed 
}

const branch = (p5: p5, level: number) => {
    
    const {lenMultiplier, angle, levelMultiplier, levels} = configs;

    if (level > levels) {
        return;
    }
    level += 1;
    const len = lenMultiplier / (level * levelMultiplier);

    // Draw the branch itself.
    p5.line(0, 0, 0, len);
    // Translate to the end.
    p5.translate(0, len);
  
    p5.push();
    // Rotate to the right and branch again.
    p5.rotate(angle);
    branch(p5, level);
    p5.pop();
  
    p5.push();
    // Rotate to the left and branch again.
    p5.rotate(-angle);
    branch(p5, level);
    p5.pop();
  }

const sketch = function (p5: p5) {

    p5.setup = () => {

        p5.createCanvas(WIDTH, HEIGHT - 10);
        p5.strokeWeight(1);
        p5.stroke(220, 5, 5);

        setupConfig();
        
    };

    p5.draw = () => {

        p5.background(33)
        p5.translate(WIDTH / 2, HEIGHT);
        p5.rotate(p5.PI)

        branch(p5, 0);

        configs.angle += 0.01;
    };
}

export const render = function () {
    let p5Instance = new p5(sketch, document.getElementById('p5-container'));
}