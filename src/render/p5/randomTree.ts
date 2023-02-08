import * as p5 from 'p5';
import { applyToPoint, compose, Matrix, rotate, scale, translate } from 'transformation-matrix';

//https://natureofcode.com/book/chapter-8-fractals/

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
let branches: Branch[] = [];
const baseStroke = 10;

const configs = {
    angle: Math.PI / 7, 
    length: HEIGHT / 4,
    scale: 0.65,
    levels: 10,
    numOfTrees: 4
}

const calcRandomSign = (p5: p5) => {
    return p5.random(-1, 1) >= 0 ? 1 : -1;
}

const randomColor = (p5: p5) => {
    const randomColorVal = () => Math.floor(p5.random(0, 255))
    return p5.color(randomColorVal(), randomColorVal(), randomColorVal());
}

const calcAngleOffset = (p5: p5) => {

  const noiseSeed = p5.frameCount * 0.01;
  const sign = calcRandomSign(p5); 
  return p5.noise(noiseSeed) * sign;
}

type Branch = {
    direction: { x: number, y: number } //end relative to starting point
    startPoint: { x: number, y: number }
    level: number
}

const branch = (p5: p5, parent: Branch, matrix: Matrix, branches: Branch[]): Branch[] => {

    const { scale: scaleMultiplier, levels, angle } = configs;
    const level = parent.level + 1;

    if (level > levels) {
        return branches;
    }

    const parentPos = parent.startPoint;
    const direction = applyToPoint(matrix, parent.direction);
    const position = { x: parentPos.x + parent.direction.x, y: parentPos.y + parent.direction.y };
    const newBranch = { direction: { x: direction.x, y: direction.y }, startPoint: position, level: level };

    branches.push(newBranch);

    for (let i = 0; i < p5.random(0, 4); i++) {
        let branchAngle = calcRandomSign(p5) * angle * calcAngleOffset(p5);
        branch(p5, newBranch, compose(rotate(branchAngle + calcAngleOffset(p5)), scale(scaleMultiplier)), branches);
    }

    return branches;
}

const sketch = function (p5: p5) {

    let generator;
    let level = 0;
    let treeIndex = 1;

    const setupTree = () => {
        const trunk = { direction: { x: 0, y: 0 }, startPoint: { x: 0, y: 0 }, level: 0 };
        let rootMatrix = compose(
            rotate(Math.PI),
            translate(0, configs.length),
        );
        branches = branch(p5, trunk, rootMatrix, []);
        generator = drawBranches(p5, [...branches], 0)    
    }

    const newTree = () => {
        treeIndex = treeIndex >= configs.numOfTrees ? 1 : treeIndex + 1;
        level = 0;
        p5.stroke(randomColor(p5));
        setupTree();
        p5.loop();
    }

    p5.setup = () => {

        p5.createCanvas(WIDTH, HEIGHT - 10);
        p5.strokeWeight(baseStroke);
        p5.frameRate(12);
        setupTree();

    };

    p5.draw = () => {


        if (level === 0 && treeIndex === 1) {
            p5.stroke(0)
            p5.fill(21)
            p5.rect(0,0,WIDTH, HEIGHT);
            p5.stroke(randomColor(p5));
        }

        p5.translate(treeIndex * WIDTH / (configs.numOfTrees + 1), HEIGHT - 50);
        const {value, done} = generator.next();
        level = generator.value;

        if (done) {
            p5.noLoop();
            setTimeout(newTree, 1000);
        }
    };
}

export const render = function () {
    let p5Instance = new p5(sketch, document.getElementById('p5-container'));
}

function* drawBranches(p5: p5, branches: Branch[], level: number) {

    if (branches.length === 0) {
        return;
    }

    //bruteforce
    for (let i = branches.length - 1; i >= 0; i--) {
        if (branches[i].level === level) {
            let branch = branches[i];
            p5.strokeWeight(baseStroke / (branch.level * 1.25))
            p5.line(branch.startPoint.x, branch.startPoint.y, branch.startPoint.x + branch.direction.x, branch.startPoint.y + branch.direction.y);            
            branches.splice(i, 1);
        }
    }

    yield level;
    yield* drawBranches(p5, branches, level +1);

}
