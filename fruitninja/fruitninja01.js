let backdrop;
let bS;
let fruitGroup;
let fruitTypes = [];
let fruitHalves;
let bombarray = []
let bombGroup;
let exploded = false;
let explosionX, explosionY;
let explosionTimer
let score = 0;
let missedFruits = 0;
let gameState = 'start';
function preload() {
    backdrop = loadImage('assets/dojobackground.png');
    let peach = {
        whole: loadImage('assets/peachwhole.png'),
        half1: loadImage('assets/peachhalf.png'),
        half2: loadImage('assets/peachhalf2.png'),
    };
    let watermelon = {
        whole: loadImage('assets/watermelonwhole.png'),
        half1: loadImage('assets/watermelonhalf.png'),
        half2: loadImage('assets/watermelonhalf.png'),
    };
    function bomb(){
        whole: "loadImage('assets/redbird-upflap.png')"
    }
    fruitTypes = [peach,watermelon];
    bombarray = [bomb];
}

function setup(){
    new Canvas(800,600);
    world.gravity.y = 10;
    fruitGroup = new Group()
    fruitHalves = new Group();
    bombGroup = new Group();
}

function draw(){
    clear();
    image(backdrop,0,0,width,height);
    if (gameState === 'start'){
        fill(0, 180);
        rect()
    }
    if (frameCount % 120 === 0){
        spawnFruit();
    }
    if (frameCount %300 == 0){
        spawnBomb();
    }
    
    if (mouse.pressing()){
        trail = new Sprite(mouse.x, mouse.y, 7);
        trail.collider = 'none';
        trail.color = 'red';
        trail.life = 10;
        sliceFruit();
        sliceBomb();
    }
    if (exploded){
        drawExplosion(explosionX,explosionY);
        explosionTimer++
        if (explosionTimer>30){
            fruitGroup.removeAll();
            fruitHalves.removeAll();
            bombGroup.removeAll();
            noStroke();
            fill (0,0,0,180);
            rect(0,0,width,height);

            fill("red");
            textSize(70);
            textAlign(CENTER, CENTER);
            text("YOU HIT BOMB",width/2, height/2);
            text("CRY ABOUT IT", width/2, height/2+70);
            noLoop();
        }
        stroke(158, 69, 69);
        fill(255);
        textSize(24);
        textAlign(LEFT,TOP);
        text('Score: ' + score, 10, 10)
    }
    for (let fruit of fruitGroup){
        if (fruit.y > height + 50){
            fruit.remove();
            missedFruits += 1;
        }
    }
    text('Missed: ' + missedFruits, 200, 10);
}

function spawnFruit(){
    let fruitData = random(fruitTypes);
    let randomX = random(300,500);
    let fruit = new fruitGroup.Sprite(randomX, height+20, 40);
    fruit.type = fruitData;
    fruit.vel.y = random(-10, -14);
    fruit.vel.x = random(-2,2);
    fruit.img = fruitData.whole
    fruit.friction = 0;
}
function spawnBomb(){
    let bombData = random(bombarray);
    let randomX = random(300,500);
    let bomb = new Sprite(randomX, height+20,80);
    bomb.image = bombData.whole;
    bomb.type = bombData;
    bomb.vel.y = random(-10, -14);
    bomb.vel.x = random(-2, 2);
    bomb.friction = 0;
}
function sliceFruit(){
    for (let fruit of fruitGroup){
        if (fruit.slice) {continue;
        }
    let d = dist(mouse.x, mouse.y, fruit.x, fruit.y);
    if (d< ((fruit.d/2) +5)) {
        fruit.sliced = true;
        const fx = fruit.x;
        const fy = fruit.y;
        fruit.remove();
        splitFruit(fx, fy, fruit.type);
        score += 1
        break;
    }
    }
}
function sliceBomb(){
    for (let bombs of fruitGroup){
        if (bombs.sliced){
            continue;
        }
        let bombD = dist(mouse.x, mouse.y, bombs.x, bombs.y);
        if (bombD < (bombs.d/x+5)){
            bombs.sliced = true;
            explosionX = bombs.x;
            explosionY = bombs.y;
            bombs.remove();
            explosionTimer = 0;
            exploded = true;
            break;
        }
    }
}
function splitFruit(x, y, fruitData){
    let left = new fruitHalves.Sprite(x - 10, y, 40, 40);
    left.img = fruitData.half1;
    left.vel.x = -3;
    left.vel.y = random(-5,-2);
    left.rotationSpeed = -5;
    left.life = 30;

    let right = new fruitHalves.Sprite(x + 10, y, 40, 40);
    right.img = fruitData.half2;
    right.vel.x = 3;
    right.vel.y = random(-5, -2);
    right.rotationSpeed = 5;
    right.life = 30;
}
function drawExplosion(x, y){
    noStroke();
    fill(255, 0, 0);
    circle(x,y,explosionTimer*12);
    fill(250,150,0);
    circle(x,y,explosionTimer*8);
    fill(255,255,0);
    circle(x,y,explosionTimer*4);
}