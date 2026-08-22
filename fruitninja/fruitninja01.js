let backdrop;
let bS;

function preload() {
    backdrop = loadImage('assets/dojobackground.png');
}

function setup(){
    newCanvas(800,600);
    world.gravity.y = 10;
}

function draw()