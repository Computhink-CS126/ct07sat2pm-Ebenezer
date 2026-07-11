// let box;

// let ball;

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
  background(240);

  fill(0);
  textSize(16);
  text("Ball: (" + int(ball.x) + ", " + int(ball.y) + ")", 10,20)
  text("Mouse: (" + mouseX + ", " + mouseY + ")", 10, 40);
  if (ball.x < 0 + ball.diameter/2 || ball.x > width - ball.diameter / 2) {
    ball.vel.x *= -1 
  }
    if (ball.y < 0 + ball.diameter/2 || ball.y > height - ball.diameter / 2) {
    ball.vel.y *= -1 
  }
  box.x = mouseX;
  box.y = mouseY;

}