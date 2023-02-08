import * as p5 from 'p5';

//https://generativeartistry.com/tutorials/circle-packing/

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const MIN_RADIUS = 2;
const MAX_RADIUS = 100;
const TOTAL_CIRCLES = 6000;
const CREATE_CIRCLE_ATTEMPTS = 1000;

type CircleType = {
  x: number,
  y: number,
  radius: number
}

const circles: CircleType[] = [];

const findMaxRadius = (newCircle: CircleType) => {
  for (let radiusSize = MIN_RADIUS; radiusSize < MAX_RADIUS; radiusSize++) {
    newCircle.radius = radiusSize;
    if (doesCircleHaveACollision(newCircle)) {
      newCircle.radius--;
      break;
    }
  }
  return newCircle;

}

const createCircle = () => {

  for (let tries = 0; tries < CREATE_CIRCLE_ATTEMPTS; tries++) {
    let newCircle = {
      x: Math.floor(Math.random() * HEIGHT),
      y: Math.floor(Math.random() * HEIGHT),
      radius: MIN_RADIUS
    }

    if (!doesCircleHaveACollision(newCircle)) {
      return findMaxRadius(newCircle);
    }
  }
  return null;
}

const createCircles = () => {

  for (var i = 0; i < TOTAL_CIRCLES; i++) {

    let newCircle = createCircle();
    if (!newCircle) {
      return;
    }
    circles.push(newCircle);
  }
}

function doesCircleHaveACollision(circle: CircleType) {
  for (var i = 0; i < circles.length; i++) {
    var otherCircle = circles[i];
    var a = circle.radius + otherCircle.radius;
    var x = circle.x - otherCircle.x;
    var y = circle.y - otherCircle.y;

    if (a >= Math.sqrt((x * x) + (y * y))) {
      return true;
    }
  }

  if (circle.x + circle.radius >= HEIGHT ||
    circle.x - circle.radius <= 0) {
    return true;
  }

  if (circle.y + circle.radius >= HEIGHT ||
    circle.y - circle.radius <= 0) {
    return true;
  }

  return false;
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


