import { Vector2 } from '@daign/math';
import * as dat from 'dat.gui';
import * as p5 from 'p5';
import { applyToPoint, compose, Matrix, rotate, scale, translate } from 'transformation-matrix';

//https://natureofcode.com/book/chapter-8-fractals/

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const branches: Branch[] = [];
const baseStroke = 10;

const configs = {
    angle: Math.PI / 7,
    length: HEIGHT / 4,
    scale: 0.65,
    levels: 10,
}

type Branch = {
    direction: { x: number, y: number } //end relative to starting point
    startPoint: { x: number, y: number }
    level: number
}

const branch = (p5: p5, parent: Branch, matrix: Matrix) => {

    const { scale: scaleMultiplier, levels, angle } = configs;
    const level = parent.level + 1;

    if (level > levels) {
        return;
    }

    const direction = applyToPoint(matrix, parent.direction);
    const position = { x: parent.startPoint.x + parent.direction.x, y: parent.startPoint.y + parent.direction.y };
    const newBranch = { direction: { x: direction.x, y: direction.y }, startPoint: position, level: level };

    branches.push(newBranch);

    branch(p5, newBranch, compose(rotate(angle), scale(scaleMultiplier)));
    branch(p5, newBranch, compose(rotate(-angle), scale(scaleMultiplier)));
}

const sketch = function (p5: p5) {

    let generator;
    let levelGenerator;


    p5.setup = () => {

        p5.createCanvas(WIDTH, HEIGHT - 10);
        p5.strokeWeight(baseStroke);

        const trunk = { direction: { x: 0, y: 0 }, startPoint: { x: 0, y: 0 }, level: 0 };
        let rootMatrix = compose(
            translate(0, configs.length),
        );

        branch(p5, trunk, rootMatrix);
        p5.stroke(220, 5, 5);
        generator = drawBranches(p5, [...branches])
        p5.stroke(5, 225, 5);
        levelGenerator = drawBranchesByLevel(p5, [[...branches]])

    };

    p5.draw = () => {

        p5.translate(WIDTH / 3, HEIGHT - 50);
        p5.rotate(p5.PI)

        p5.stroke(220, 5, 5);
        generator.next().value;

        if (p5.frameCount % 100 === 0) {
        p5.translate(-WIDTH / 3, 0);
        p5.stroke(5, 225, 5);
        levelGenerator.next().value;
        }

    };
}

export const render = function () {
    let p5Instance = new p5(sketch, document.getElementById('p5-container'));
}

function* drawBranches(p5: p5, branches: Branch[]) {

    if (branches.length === 0) {
        return;
    }

    let branch = branches.shift();

    p5.strokeWeight(baseStroke / (branch.level * 1.25))
    p5.line(branch.startPoint.x, branch.startPoint.y, branch.startPoint.x + branch.direction.x, branch.startPoint.y + branch.direction.y);

    let rightSide = branches.splice(0, branches.length / 2);
    let leftSide = branches;

    yield* drawBranches(p5, rightSide);
    yield yield* drawBranches(p5, leftSide);

}

function* drawBranchesByLevel(p5: p5, branchesList: Branch[][]) {

    const newBranchList = []

    if (branchesList.filter(branches => branches.length !== 0).length === 0) {
        return;
    }

    for (let branches of branchesList) {

        if (branches.length === 0) {
            continue;
        }

        let branch = branches.shift();

        p5.strokeWeight(baseStroke / (branch.level * 1.25))


        p5.line(branch.startPoint.x, branch.startPoint.y, branch.startPoint.x + branch.direction.x, branch.startPoint.y + branch.direction.y);

        let rightSide = branches.splice(0, branches.length / 2);
        let leftSide = branches;

        newBranchList.push(rightSide);
        newBranchList.push(leftSide);

    }

    yield newBranchList;
    yield* drawBranchesByLevel(p5, newBranchList);

}