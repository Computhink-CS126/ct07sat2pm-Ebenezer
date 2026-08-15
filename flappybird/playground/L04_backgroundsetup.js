let bird, floor;
let pipeGroup;
let score = 0;
let numberImages = [];
let scoreDigits;
let gameoverImg;
let gameoverLabel;

let midflaping, bg, base;
let flapUpImg,flapDownImg;
let pipe;
let toppipe,bottomPipe;
let startScreenLabel;
let startScreenImg;
let startGame = false;
let flapSound, pointSound, failSound;
function preload(){
gameoverImg = loadImage('assets/gameover.png');
midflaping = loadImage('assets/redbird-midflap.png');
bg = loadImage('assets/background-night.png');
base = loadImage('assets/base.png');
flapUpImg = loadImage('assets/yellowbird-upflap.png');
flapDownImg = loadImage('assets/yellowbird-downflap.png')
pipe = loadImage('assets/pipe-green.png');
for (let i = 0; i < 10; i++){
numberImages[i] = loadImage('assets/' + i +'.png');
}
startScreenImg = loadImage('assets/message.png');
flapSound = createAudio('assets/sfx_wing.mp3');
pointSound = createAudio('assets/sfx_point.mp3');
failSound = createAudio('assets/sfx_die.mp3');
}

function setup(){
createCanvas(400,600);
background(225);
bird = new Sprite();
bird.x = 200;
bird.y = 300;
bird.width = 20;
bird.height = 20;
bird.img = midflaping;
bird.collider = 'static';
bird.visible = false;
bird.mass = 2;
bird.drag = 0.02;
bird.bounciness = 0.5;
world.gravity.y = 10;
pipeGroup = new Group();
scoreDigits = new Group();
scoreDigits.collider = 'none';
scoreDigits.layer = 1000;



floor = new Sprite();
floor.x = 200;
floor.y = height - 20;
floor.width = 400;
floor.height = 125;
floor.collider = 'static';
floor.img = base;
startScreenLabel = new Sprite(width/2, height/2, 50, 50, 'none');
startScreenLabel.img = startScreenImg;

}

function draw(){
image(bg,0,0,width , height);

if (kb.presses('space') || mouse.presses()){
startGame = true;
bird.visible = true;
bird.collider = 'dynamic';
startScreenLabel.visible = false;
}

if(startGame){
if (kb.presses('space') || mouse.presses())
bird.vel.y = -5;
bird.sleeping = false;
flapSound

if (bird.vel.y < -1){
bird.img = flapUpImg;
bird.rotation = -30;
}
else if (bird.vel.y > 1) {
bird.img = flapDownImg;
bird.rotation = 30;
}
else {
bird.img = midflaping;
bird.rotation = 0;
}

fill("blue");
textSize(14);
text('vel.y: ' + bird.vel.y.toFixed(2), 10, 20);
text('isMoving: ' + bird.isMoving, 10, 40);
text('sleeping: ' + bird.sleeping , 10, 60);

if (frameCount === 1){
spawnPipePair();
}
bird.x += 3;
camera.x = bird.x;
floor.x = bird.x;


drawScore(width/2, 20, score, 24, 36);

if (frameCount % 90 === 0){
spawnPipePair();
}

for (let pipe of pipeGroup) {
if (pipe.x < -50){
pipe.remove();
}

let pipeRightEdge = pipe.x + pipe.w / 2;
let birdLeftEdge = bird.x - bird.w / 2;

if (pipe.passed == false && pipeRightEdge < birdLeftEdge){
pipe.passed = true;
score++;
}
}



if (bird.collides(pipeGroup) || bird.collides(floor)){
gameoverLabel = new Sprite(width/2, height/2, 192, 42);
gameoverLabel.img = gameoverImg;
gameoverLabel.layer = 100;
gameoverLabel.x = camera.x;

noLoop();
}

}}
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
    bottomPipe = new Sprite(bird.x + 400, midY + (gap / 2) + 200, 52 , 320, 'static');
    bottomPipe.img = pipe;
    pipeGroup.add(bottomPipe);
    pipeGroup.layer = 0;
    topPipe = new Sprite( bird.x + 400, midY + (gap / 2 )- 200, 52, 320, 'static');
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
