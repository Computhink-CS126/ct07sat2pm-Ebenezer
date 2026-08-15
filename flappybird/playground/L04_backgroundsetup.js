let bird, floor;
let midflapimg, bg, base;
let flapUpImg, flapDownImg;
let pipeGroup;
let pipe;
let bottomPipe;
let score = 0;
let numberImages = [];
let scoreDigits;
let gameoverImg;
let gameoverLabel;
let startScreenLabel;
let startScreenImg;
let 
function preload() {
    midflapimg = loadImage('assets/redbird-midflap.png');
    bg = loadImage('assets/background-night.png');
    base = loadImage('assets/base.png');
    flapUpImg = loadImage('assets/yellowbird-upflap.png')
    flapDownImg = loadImage('assets/yellowbird-downflap.png')
    pipe = loadImage('assets/ pipe-green.png');
    for(let i = 0; i < 10; i++) {
        numberImages[i] = loadImage('assets/' + i + '.png');
    }
    gameoverImg = loadImage('assets/gameover.png');
    startScreenImg = loadImage('assets/message.png');
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
    scoreDigits = new Group()
    scoreDigits.collider = 'none'
    scoreDigits.layer = 1000;
    startScreenLabel = new Sprite(width/2, height/2, 50, 50, 'none');
    startScreenLabel.img = startScreenImg;
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
    draw(width/2, 20, score, 24,36);
    for (let pipe of pipeGroup) {
        let pipeRightEdge = pipe.x + pipe.w / 2;
        let birdLeftEdge = bird.x - bird.w/2;
        if (pipe.passed == false && pipeRightEdge < birdLeftEdge){
            pipe.passed = true;
            score++;
        }
    }
    bird.x += 3;
    camera.x = bird.x;
    floor.x = bird.x;
    if (frameCount % 90 === 0) {
        spawnPipePair();
    }
    for(let pipe of pipeGroup){
        if (pipe.x < - 50){
            pipe.remove();
        }
    }
    if (bird.collides(pipeGroup) || bird.collides(floor) || bird.y < - 30){
        noLoop;
    }
    if (bird.collides(pipeGroup) || bird.collides(floor)){
        gameover
    }
}
function drawScore(x, y, score, digitWidth, digitHeight) {
    scoreDigits.removeAll();
    let scoreStr = str(score);
    let totalWidth = scoreStr.length * digitWidth;
    let startX = x - totalWidth / 2;
    for (let i = 0 ; i< scoreStr.length;i++){
        let digit = int(scoreStr[i]);
        let xPos = startX + i * digitWidth;
        let digitSprite = new scoreDigits.Sprite(xPos, y, digitWidth,digitHeight);
        digitSprite.img = numberImages[digit];
    }
    moveGroup(scoreDigits, camera.x, 24);

}
function spawnPipePair(){
    let gap = 50;
    let midY = random(250, height - 250);
    bottomPipe = new Sprite(bird.x + 400, midY + gap / 2 + 200, 52 , 320, 'static');
    bottomPipe.img = pipe;
    pipeGroup.add(bottomPipe);
    pipeGroup.layer = 0;
    topPipe = new Sprite( bird.x + 400, midY = gap / 2 - 200, 52, 320, 'static');
    topPipe.img = pipe;
    topPipe.rotation = 180;
    topPipe.passed=false;
    pipeGroup.add(topPipe);

}
function moveGroup(group, targetX, spacing) {
    let totalWidth = (group.length -1) * spacing;
    let startX = (targetX - totalWidth/2);
    for (let i = 0; i< group.length; i++) {
        group[i].x = startX + i * spacing;
    }
}