import * as p5 from 'p5';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const MIN_RADIUS = 50;
const CIRCLES_IN_COL = 6

const CIRC_RADIUS = Math.floor(WIDTH / (2* CIRCLES_IN_COL));
const RADIUS = CIRC_RADIUS < MIN_RADIUS ? MIN_RADIUS : CIRC_RADIUS;

const COLS = Math.floor(WIDTH / (2* RADIUS));



const ROWS = Math.floor(HEIGHT/ (2* RADIUS));

type CircleType = {
    x: number,
    y: number,
    radius: number
}

const circles: CircleType[] = [];

const createCircle = (col: number, row: number) => {

    let newCircle = {
        x: col * RADIUS * 2 + RADIUS,
        y: row * RADIUS * 2 + RADIUS,
        radius: RADIUS
    }

    if (newCircle.x + RADIUS > WIDTH || newCircle.y + RADIUS > HEIGHT) {
        throw "Too many circles";
    }
    return newCircle;
}

const createCircles = () => {

    for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS; row++) {

            let newCircle = createCircle(col, row);
            if (!newCircle) {
                continue;
            }
            circles.push(newCircle);
        }
    }
}

const sketch = function (p5: p5) {

    p5.setup = () => {

        p5.createCanvas(WIDTH, HEIGHT);
        p5.strokeWeight(1);

        createCircles();

    };

    p5.draw = () => {

        for (let circle of circles) {
            p5.circle(circle.x, circle.y, circle.radius * 2);
        }

    };
}

export const render = function () {
    let p5Instance = new p5(sketch, document.getElementById('p5-container'));
}