let backdrop;
let bS;
let fruitGroup;
let fruitTypes = [];
function preload() {
    backdrop = loadImage('assets/dojobackground.png');
    let peach = {
        whole: loadImage(assets/peachwhole.png)
    };
    let watermelon = {
        whole: loadImage('assets/watermelonwhole.png')
    };
    fruitTypes = [peach,watermelon];
}

function setup(){
    newCanvas(800,600);
    world.gravity.y = 10;
}

function draw(){
    clear();
    Image(backdrop,0,0,width,height);
    if (frameCount % 120 === 0)
}