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
    bird.collider = 'dynamic';
    bird.mass = 2;
    bird.drag = 0.02;
    bird.bounciness = 0.5;
    world.gravity.y = ;
    floor = new Sprite();
    floor.x = 200;
    floor.y = height - 20;
    floor.width = 400; 
    floor.height = 125;
    floor.collider = 'static';
    floor.img = base;
}
function draw(){
    image(bg,0,0,width,height);
    if (kb.presses('space')) {
        bird.vel.y = -15;
        bird.sleeping = false;
    }
}