const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,fruit,ground;
var fruit_con;
var fruit_con_2;

var bg_img;
var food;
var rabbit;

var button, blower;
var bunny;
var blink, eat, sad;
var mute_btn;

var fr, rope2;

var bk_song;
var cut_sound;
var sad_sound;
var eating_sound;
var air;

function preload(){
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('./rabbit/Rabbit-01.png');

  bk_song = loadSound('backgroundmusic.mp3');
  sad_sound = loadSound("sad.wav")
  cut_sound = loadSound('rope_cut.mp3');
  eating_sound = loadSound('eating_sound.mp3');
  air = loadSound('air.wav');

  blink = loadAnimation("./rabbit/blink/blink_1.png", "./rabbit/blink/blink_2.png", 
  "./rabbit/blink/blink_3.png");
  eat = loadAnimation("./rabbit/eat/eat_0.png" , "./rabbit/eat/eat_1.png", 
  "./rabbit/eat/eat_2.png", "./rabbit/eat/eat_3.png", "./rabbit/eat/eat_4.png");
  sad = loadAnimation("./rabbit/sad/sad_1.png", "./rabbit/sad/sad_2.png", "./rabbit/sad/sad_3.png");
  
  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping = false;
  eat.looping = false;
}

function setup() {
  createCanvas(500,700);
  
  frameRate(80);
  
  sad.frameDelay = 20;
  
  bk_song.play();
  bk_song.setVolume(0.5);
  
  engine = Engine.create();
  world = engine.world;
  
  button = createImg('cut_btn.png');
  button.position(220, 30);
  button.size(50, 50);
  button.mouseClicked(drop);
  
  blower = createImg('balloon.png');
  blower.position(10, 250);
  blower.size(150, 100);
  blower.mouseClicked(airblow);
  
  mute_btn = createImg('mute.png');
  mute_btn.position(400, 45);//450, 20
  mute_btn.size(50, 50);
  mute_btn.mouseClicked(mute);
  
  rope = new Rope(7, {x: 245,y: 30});
  ground = new Ground(200, 690, 600, 20);
  
  blink.frameDelay = 20;
  eat.frameDelay = 20;
  
  bunny = createSprite(230, 620, 100, 100);
  bunny.scale = 0.2;
  
  bunny.addAnimation('blinking', blink);
  bunny.addAnimation('eating', eat);
  bunny.addAnimation('crying', sad);
  bunny.changeAnimation('blinking', blink);
  
  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fruit);
  
  fruit_con = new Link(rope,fruit);
  
  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
}

function draw() 
{
  background(51);
  image(bg_img,0,0,490,690);

  push();
  imageMode(CENTER);
  if(fruit != null){
    image(food, fruit.position.x, fruit.position.y, 70, 70);
  }
  pop();

  rope.show();
  Engine.update(engine);
  ground.show();

  drawSprites();

  if(collide(fruit, bunny) == true)
  {
    bunny.changeAnimation('eating', eat);
    eating_sound.play();
  }


  if(fruit!=null && fruit.position.y>=650)
  {
    bunny.changeAnimation('crying', sad);
    fruit = null;
    sad_sound.play();
   }
   
}

function drop()
{
  rope.break();
  fruit_con.detach();
  fruit_con = null;
  cut_sound.play();
}


function collide(body,sprite)
{
  if(body != null)
        {
         var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
          if(d<=80)
            {
              World.remove(engine.world,fruit);
               fruit = null;
               return true; 
            }
            else{
              return false;
            }
         }
}

function airblow(){
  if(fruit != null){
    Matter.Body.applyForce(fruit, 
      {x: 0, y: 0}, 
      {x: 0.01, y: 0});
    air.play();
  }
  
}

function mute(){
  if(bk_song.isPlaying()){
    bk_song.stop();
  }else{
    bk_song.play();
  }
}
