let bird, floor;
let midflapimg, bg, base;
let flapUpImg, flapDownImg;
let pipeGroup;
let pipe;
let bottomPipe;
function preload() {
    midflapimg = loadImage('assets/redbird-midflap.png');
    bg = loadImage('assets/background-night.png');
    base = loadImage('assets/base.png');
    flapUpImg = loadImage('assets/yellowbird-upflap.png')
    flapDownImg = loadImage('assets/yellowbird-downflap.png')
    pipe = loadImage('assets/ pipe-green.png');
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
    bird.mass = 20;
    bird.drag = 0.02;
    bird.bounciness = 0.5;
    world.gravity.y = 10;
    floor = new Sprite();
    floor.x = 200;
    floor.y = height - 20;
    floor.width = 400; 
    floor.height = 125;
    floor.collider = 'static';
    floor.img = base;
    pipeGroup = new Group();
}
function draw(){
    image(bg,0,0,width,height);
    if (kb.presses('space') || mouse.presses()) {
        bird.vel.y = -5;
        bird.sleeping = false;
    }
    fill("blue");
    textSize(14)
    text('vel.y: ' + bird.vel.y.toFixed(2), 10, 20);
    text('isMoving: ' + bird.isMoving, 10, 40);
    text('sleeping: ' + bird.sleeping, 10, 60)
    if (bird.vel.y <-1) {
        bird.img = flapUpImg;
        bird.rotation = -10;
    }
    else if (bird.vel.y > 1) {
        bird.img = flapDownImg;
        bird.rotation = 30;
    }
    else {
        bird.img = midflapimg;
        bird.rotation = 0;
    }
    if (frameCount === 1) {
        spawnPipePair();
    }
}
function spawnPipePair(){
    let gap = 50;
    let midY = height/2;
    bottomPipe = new Sprite(400, midY + gap / 2 + 200, 52 , 320, 'static');
    bottomPipe.img = pipe;
    pipeGroup.add(bottomPipe)
}