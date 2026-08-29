let backdrop;
let bS;
let fruitGroup;
let fruitTypes = [];
function preload() {
    backdrop = loadImage('assets/dojobackground.png');
    let peach = {
        whole: loadImage('assets/peachwhole.png')
    };
    let watermelon = {
        whole: loadImage('assets/watermelonwhole.png')
    };
    fruitTypes = [peach,watermelon];
}

function setup(){
    new Canvas(800,600);
    world.gravity.y = 10;
    fruitGroup = new Group()
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