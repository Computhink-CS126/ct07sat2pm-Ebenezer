let bird, floor;
let midflapimg, bg, base;
function preload() {
    midflapimg = loadImage('assets/redbird-midflap.png');
    bg = loadImage('assets/background-night.png');
    base = loadImage('assets/base.png');
}
function setup(){
    createCanvas(400,600);
    // background(225);
    bird = new Sprite()
    bird.x = 200;
    bird.y = 300;
    bird.width = 20;
    bird.height = 20;
    bird.img = midflapimg;
    bird.collidar = 'dynamic';
    bird.mass = 2;
    bird.drag = 0.02;
    bird.bounciness = 0.05;
    world.gravity.y = 10;
    floor = new Sprite();
    floor.x = 200;
    floor.y = height - 20;
    floor.width = 400;
    floor.height = 125;
    floor.collidar = "static";
    floor.img = base;
}
function draw(){
    Image(bg,0,0,width,height)
    if (KeyboardEvent.presses('space')) {
        bird.vel.y = -15;
        
    }
}