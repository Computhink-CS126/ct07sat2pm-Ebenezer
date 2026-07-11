let box;

let ball;

function setup() {
  // Set up the canvas
  new Canvas(400,600);
  background(250); //background color
  ball = new Sprite();
  fill("skyblue");
  circle(25,25,50);
  fill("cyan");
  rect(50,50, 30, 50);
   // write your codes here
  ball = new Sprite();
  ball.x = 360;
  ball.y = 30;
  ball.diameter = 40;
  ball.color = 'red'
  box = new Sprite();
  box.x = 100
  box.y = 100
  box.w = 50
  box.h = 75
  box.color = 'purple';
}

function draw() {
  
}