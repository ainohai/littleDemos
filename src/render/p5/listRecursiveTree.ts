import { Vector2 } from '@daign/math';
import * as dat from 'dat.gui';
import * as p5 from 'p5';
import { applyToPoint, compose, Matrix, rotate, scale, translate } from 'transformation-matrix';

//https://natureofcode.com/book/chapter-8-fractals/

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const branches: Branch[] = [];

const configs = {
    angle: Math.PI / 3,
    length: HEIGHT / 3.5,
    scale: 0.75,
    levels: 15
}

type Branch = {
    direction: {x: number, y: number} //end relative to starting point
    startPoint: {x: number, y: number}
    level: number 
}

const branch = (p5: p5, parent: Branch, matrix: Matrix) => {
    
    const {scale: scaleMultiplier, levels, angle} = configs;
    const level = parent.level + 1;

    if (level > levels) {
        return;
    }
      
    const direction = applyToPoint(matrix, parent.direction);
    const position = {x: parent.startPoint.x + parent.direction.x, y: parent.startPoint.y + parent.direction.y};
    const newBranch = {direction: {x: direction.x, y: direction.y}, startPoint: position, level: level };
      
    branches.push(newBranch);

    branch(p5, newBranch, compose(rotate(angle), scale(scaleMultiplier)));
    branch(p5, newBranch, compose(rotate(-angle), scale(scaleMultiplier)));
  }

const sketch = function (p5: p5) {

    let index = 0;

    p5.setup = () => {

        p5.createCanvas(WIDTH, HEIGHT - 10);
        p5.strokeWeight(1);
        p5.stroke(220, 5, 5);
        
        const trunk = { direction: {x: 0, y: 0}, startPoint: {x:0, y:0}, level: 0};
        let rootMatrix = compose(
            translate(0, configs.length),
        );
    
        branch(p5, trunk, rootMatrix);
        
    };

    p5.draw = () => {

        p5.translate(WIDTH / 2, HEIGHT - 50);
        p5.rotate(p5.PI)

        for (let i = 0; i<= branches.length && i<= index; i++) {
            p5.line(branches[i].startPoint.x, branches[i].startPoint.y, branches[i].startPoint.x + branches[i].direction.x, branches[i].startPoint.y + branches[i].direction.y)
        }
        index = index + 50;

    };
}

export const render = function () {
    let p5Instance = new p5(sketch, document.getElementById('p5-container'));
}