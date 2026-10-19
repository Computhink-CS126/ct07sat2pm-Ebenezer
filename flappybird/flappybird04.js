let bird, bg, birdImg;
function preload(){
    birdImg = loadImage("filename.png");
    bg = loadImage("filename.png");
}
// function setup(){
//     new Canvas(400,600);
//     bird = new Sprite(200,300,30,30,"static");
//     bird.img = birdImg;
// }
// function draw(){
//     Image(bg,0,0,width,height);
// }
function setup(){
    new Canvas(400,600);
    world.gravity.y = 10;
    ss = new Sprite(200,300,40,40);
}
function draw(){
    background(220);
    if(MouseEvent.presses()){
        ss.velocity.y = -5
    }
}

// to delare an Array
// let arrname = ["smt","smt2","smt3"]

window coordinate system 
top left 0,0
move right x inc move down y inc

functon preload why
ensure sound and image are loaded
preload wil run bnefore setup ad draw
preload runs auto before setup n draw are execitesd