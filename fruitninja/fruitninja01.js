let backdrop;
let bS;
let fruitGroup;
let fruitTypes = [];
let fruitHalves;
function preload() {
    backdrop = loadImage('assets/dojobackground.png');
    let peach = {
        whole: loadImage('assets/peachwhole.png'),
        half1: loadImage('assets/peachhalf.png'),
        half2: loadImage('assets/peachhalf.png'),
    };
    let watermelon = {
        whole: loadImage('assets/watermelonwhole.png'),
        half1: loadImage('assets/watermelonhalf.png'),
        half2: loadImage('assets/watermelonhalf.png'),
    };
    fruitTypes = [peach,watermelon];
}

function setup(){
    new Canvas(800,600);
    world.gravity.y = 10;
    fruitGroup = new Group()
    fruitHalves = new Group();
}

function draw(){
    clear();
    image(backdrop,0,0,width,height);
    if (frameCount % 120 === 0){
        spawnFruit();
    }
    if (mouse.pressing()){
        trail = new Sprite(mouse.x, mouse.y, 7);
        trail.collider = 'none';
        trail.color = 'red';
        trail.life = 10;
        sliceFruit();
    }
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
function sliceFruit(){
    for (let fruit of fruitGroup){
        continue;
    }
    let d = dist(mouse.x, mouse.y, fruit.x, fruit.y);
    if (d< ((fruit.d/2) +5)) {
        fruit.sliced = true;
        const fx = fruit.x;
        const fy = fruit.y;
        fruit.remove();
        splitFruit(fx, fy, fruit.type)
        break;
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
    right.img = fruitData 
}