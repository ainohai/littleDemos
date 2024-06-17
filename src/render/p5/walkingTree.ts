import * as p5 from 'p5';
import { applyToPoint, compose, Matrix, rotate, scale, translate } from 'transformation-matrix';


const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
let branches: Branch[] = [];
const baseStroke = 2;

const configs = {
    angle: Math.PI / 7, 
    length: () => Math.random() * HEIGHT / 10,
    scale: 0.95,
    levels: 20,
    numOfTrees: 3,
    maxBranching: 2,
    numOfClusters: 5,
    treeRepeats: 1
}

const calcRandomSign = (p5: p5) => {
    return p5.random(-1, 1) >= 0 ? 1 : -1;
}

const randomColor = (p5: p5) => {
    const randomColorVal = () => Math.floor(p5.random(0, 155))
    return p5.color(randomColorVal(), randomColorVal(), randomColorVal(), 50);
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

    for (let i = 0; i < p5.random(0, configs.maxBranching); i++) {
        let branchAngle = calcRandomSign(p5) * angle * calcAngleOffset(p5);
        branch(p5, newBranch, compose(rotate(branchAngle + calcAngleOffset(p5)), scale(scaleMultiplier * (p5.random(90, 105)/100) )), branches);
    }

    return branches;
}

const sketch = function (p5: p5) {

    let generator;
    let level = 0;
    let treeIndex = 0;
    let treeRepeatIndex = 0;
    let startpoint = WIDTH;

    const setupTree = (createNew = true) => {
        const trunk = { direction: { x: 0, y: 0 }, startPoint: { x: 0, y: 0 }, level: 0 };
        let rootMatrix = compose(
            rotate(Math.PI),
            translate(0, configs.length()),
        );
        if (createNew) {
            branches = branch(p5, trunk, rootMatrix, []);
        }
        generator = drawBranches(p5, [...branches], 0, () => baseStroke / (treeRepeatIndex +1))    
    }


    p5.setup = () => {

        p5.createCanvas(WIDTH, HEIGHT - 10);
        p5.strokeWeight(baseStroke);
        p5.frameRate(12);
        setupTree();

    };

    p5.draw = () => {

        if (p5.frameCount === 1) {
            p5.stroke(0)
            p5.fill(21)
            p5.rect(0,0,WIDTH, HEIGHT);
            p5.stroke(randomColor(p5));
            treeIndex = 1;
            
        }

        p5.translate(startpoint, HEIGHT + 50);
        const {value, done} = generator.next();
        level = value;

        if ( treeIndex % (configs.numOfTrees) === 0 && done) {
            startpoint = startpoint - 150;
            console.log("New startpoint")
        }
 
        if (done) {
            p5.noLoop();            
            const shouldRedraw = treeRepeatIndex < (configs.treeRepeats -1)
            treeRepeatIndex = shouldRedraw ? treeRepeatIndex + 1 : 0;
            treeIndex = shouldRedraw ? treeIndex : treeIndex + 1;

            if (treeIndex <= (configs.numOfTrees * configs.numOfClusters)) {

                const newTree = () => {
                    level = 0;
                    if (!shouldRedraw) {
                        
                        startpoint = startpoint + p5.random(-20, 20)
                    }
                    p5.stroke(randomColor(p5));

                    setupTree(!shouldRedraw);
                    p5.loop();
                }

                setTimeout(newTree, 1000);
    
            }
        }
    };
}

export const render = function () {
    let p5Instance = new p5(sketch, document.getElementById('p5-container'));
}

function* drawBranches(p5: p5, branches: Branch[], level: number, strokeWeightCb: () => number) {

    if (branches.length === 0) {
        return;
    }

    //bruteforce
    for (let i = branches.length - 1; i >= 0; i--) {
        if (branches[i].level === level) {
            let branch = branches[i];
            p5.strokeWeight(strokeWeightCb())
            p5.line(branch.startPoint.x, branch.startPoint.y, branch.startPoint.x + branch.direction.x, branch.startPoint.y + branch.direction.y);            
            branches.splice(i, 1);
        }
    }

    yield level;
    yield* drawBranches(p5, branches, level +1, strokeWeightCb);

}
