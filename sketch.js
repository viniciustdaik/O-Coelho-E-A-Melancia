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
var fruit_con2, fruit_con3;
var conlevel2, con2level2;
var fruitlevel2, ropelevel2, rope2level2;

var bubble, bubbleimg;
var starimg;
var buttonlevel2, button2level2;

var bg_img;
var food;
var rabbit;

var button, button2, button3, blower;
var bunny;
var blink, eat, sad;
var mute_btn;

var fr, rope2, rope3;

var bk_song;
var cut_sound;
var sad_sound;
var eating_sound;
var air;

var level = 1;
var isGameover = false;

function preload(){
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('./rabbit/Rabbit-01.png');
  bubble_img = loadImage("bubble.png");
  star_img = loadImage('star.png');

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
  createCanvas(windowWidth, windowHeight);//500, 700
  
  frameRate(80);
  
  sad.frameDelay = 20;
  blink.frameDelay = 20;
  eat.frameDelay = 20;

  var fruit_options = {
    restitution: 0.8
  }

  bk_song.play();
  bk_song.setVolume(0.5);
  
  engine = Engine.create();
  world = engine.world;
  
  button = createImg('cut_btn.png');
  button.position(windowWidth / 2 - 30, 20);//220, 30
  button.size(50, 50);
  button.mouseClicked(drop);

  button2 = createImg('cut_btn.png');
  button2.position(windowWidth / 2 + 180, 35);
  button2.size(60, 60);
  button2.mouseClicked(drop2);
  
  buttonlevel2 = createImg('cut_btn.png');
  buttonlevel2.position(windowWidth / 2 - 300, 320);//200, 320
  buttonlevel2.size(0, 0);//50, 50
  buttonlevel2.mouseClicked(remove_rope);
  
  button2level2 = createImg('cut_btn.png');
  button2level2.position(windowWidth / 2 - 470, 420);//30, 420
  button2level2.size(0, 0);//50, 50
  button2level2.mouseClicked(remove_rope2);
  
  blower = createImg('balloon.png');
  blower.position(windowWidth / 2 - 300, 250);//10, 250
  blower.size(150, 100);
  blower.mouseClicked(airblow);
  
  mute_btn = createImg('mute.png');
  mute_btn.position(windowWidth - 80, 35);//450, 20
  mute_btn.size(50, 50);
  mute_btn.mouseClicked(mute);
  
  rope = new Rope(7, {x: windowWidth / 2 - 5, y: 30});//(og version)7(number of ropes), 245, 30
  //(my version)7, windowWidth / 2 - 5, 30
  rope2 = new Rope(8, {x: windowWidth / 2 - 5 + 5 + 50 + 70 + 50 + 50, y: 40});
  ground = new Ground(windowWidth / 2, windowHeight - 10, windowWidth, 20);//200, 690, 600, 20

  ropelevel2 = new RopeLevel2Game(4, {x: windowWidth / 2 - 270, y: 330});//230, 330
  rope2level2 = new RopeLevel2Game(4, {x: windowWidth / 2 - 450, y: 450});//50, 450
  
  higherground = new Ground(windowWidth / 2 - 200, 170, 100, 10);//300, 170
  
  bunny = createSprite(windowWidth / 2 - 20, windowHeight - 80, 100, 100);//230, 620, 100, 100
  bunny.scale = 0.2;
  
  bunny.addAnimation('blinking', blink);
  bunny.addAnimation('eating', eat);
  bunny.addAnimation('eating2', eat);
  bunny.addAnimation('crying', sad);
  bunny.changeAnimation('blinking', blink);
  
  fruit = Bodies.circle(windowWidth / 2 + 50, windowHeight / 2 - 50, 20);//300, 300, 20
  fruitlevel2 = Bodies.circle(windowWidth / 2 - 400, 400, 15, fruit_options);//100, 400, 15, fruit_opions
  
  bubble = createSprite(windowWidth / 2 - 210, 460, 20, 20);//290, 460
  bubble.addImage(bubble_img);
  bubble.scale = 0.1;
  bubble.visible = false;
  
  Matter.Composite.add(rope.body, fruit);
  
  fruit_con = new Link(rope, fruit);
  fruit_con2 = new Link(rope2, fruit);
  
  conlevel2 = new LinkLevel2(ropelevel2, fruitlevel2);
  con2level2 = new LinkLevel2(rope2level2, fruitlevel2);
  
  World.add(world, fruitlevel2);
  
  rectMode(CENTER);
  ellipseMode(RADIUS);

  textSize(50)
}

function draw(){
  background(51);
  if(mute_btn.x != windowWidth - 80 || mute_btn.y != 35){
    mute_btn.position(windowWidth - 80, 35);
  }
  if(collidelevel2(fruitlevel2, bubble, 40) == true && level == 2){
    engine.world.gravity.y = -1;
    bubble.position.x = fruitlevel2.position.x;
    bubble.position.y = fruitlevel2.position.y;
  }
  if(collidelevel2(fruitlevel2, bunny, 90) == true && level == 2)//80
  {
    remove_rope();
    //remove_rope2();
    bubble.visible = false;
    eating_sound.play();
    bunny.changeAnimation('eating2', eat);
    //World.remove(engine.world, fruitlevel2);
    fruitlevel2 = null;
    
  }
  blower.position(bunny.position.x - 300, 250);//10, 250
  button.position(rope.x - 10, 20);
  button2.position(rope2.x - 10, 35);
  //bunny.x = windowWidth / 2 - 20;
  //rope.x = bunny.x;
  if(fruit != null){
    fruit.x = rope.x;
  }
  
  image(bg_img, 0, 0, windowWidth, windowHeight);//490, 690
  
  push();
  imageMode(CENTER);
  if(fruit != null){
    image(food, fruit.position.x, fruit.position.y, 70, 70);
  }
  if(fruitlevel2 != null && level == 2){
    image(food, fruitlevel2.position.x, fruitlevel2.position.y, 70, 70);
  }
  pop();
  if(level == 2){
    ropelevel2.show();
    rope2level2.show();
    higherground.showStroke();
  }
    
  rope.show();
  rope2.show();
  Engine.update(engine);
  ground.show();

  drawSprites();

  if(collide(fruit, bunny) == true)
  {
    bunny.changeAnimation('eating', eat);
    eating_sound.play();
  }
  if(fruit == null && level == 1){
    setTimeout(() => {
      if(level == 1){
        levelwork();
      }
    }, 1500);
  }

  if(fruitlevel2 == null && level == 2){
    setTimeout(() => {
      if(level == 2){
        levelwork();
      }
    }, 1500);
  }
  
  if(fruit != null && fruit.position.y >= windowHeight - 50)//650
  { 
    isGameover = true;
    bunny.changeAnimation('crying', sad);
    fruit = null;
    sad_sound.play();
   }

   if(fruitlevel2 != null && fruitlevel2.position.y >= windowHeight - 50 && level == 2)//650
  { 
    isGameover = true;
    bunny.changeAnimation('crying', sad);
    fruitlevel2 = null;
    sad_sound.play();
   }
   
}

function drop(){
  if(fruit_con != null){
    rope.break();
    fruit_con.detach();
    fruit_con = null;
    cut_sound.play();
  }
}

function drop2(){
  if(fruit_con2 != null){
    rope2.break();
    fruit_con2.detach();
    fruit_con2 = null;
    cut_sound.play();
  }
}

function drop3(){
  if(fruit_con3 != null){
    rope3.break();
    fruit_con3.detach();
    fruit_con3 = null;
    cut_sound.play();
  }
}

function remove_rope(){
  if(conlevel2 != null){
    ropelevel2.break();
    conlevel2.detach();
    conlevel2 = null;
    cut_sound.play();
  }
}

function remove_rope2(){
  if(con2level2 != null){
    rope2level2.break();
    con2level2.detach();
    con2level2 = null;
    cut_sound.play();
  }
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

function collidelevel2(body,sprite,x)
{
  if(body!=null)
        {
         var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
          if(d<=x)
            {
              
               return true; 
            }
            else{
              return false;
            }
         }
}

function airblow(){
  if(fruit != null && rope.cut == false){
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

function levelwork(){
  if(isGameover == true){
    swal({
      title: `Fim De Jogo!`, 
      text: "A Melancia Caiu No Chão.", 
      //imageUrl:
        //"https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
      imageSize: "150x150", 
      confirmButtonText: "Tentar Novamente"
    },
      function(isConfirm) {
        if (isConfirm) {
          location.reload();
        }
      }
    );
  }
  if(isGameover == false && level == 1){
    swal({
      title: `Parabéns!`, 
      text: "O Coelho Comeu A Melancia!", 
      //imageUrl:
        //"https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
      imageSize: "150x150", 
      confirmButtonText: "Próximo Level"
    },
      function(isConfirm) {
        if (isConfirm) {
          level = 2;
          level2();
          bunny.changeAnimation('blinking', blink);
        }
      }
    );
  }
  if(isGameover == false && level == 2){
    swal({
      title: `Parabéns!`, 
      text: "O Coelho Comeu A Melancia! Você Completou O Jogo!", 
      //imageUrl:
        //"https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
      imageSize: "150x150", 
      confirmButtonText: "Jogar Novamente Desde O 1"
    },
      function(isConfirm) {
        if (isConfirm) {
          location.reload();
        }
      }
    );
  }
  
}

function level2(){
  //sad.frameDelay = 20;
  //blink.frameDelay = 20;
  //eat.frameDelay = 20;
  bunny.x = windowWidth / 2 - 230;
  bunny.y = 100;
  //button.position(windowWidth + windowWidth, windowHeight - windowHeight - windowHeight);
  button.size(0, 0);
  button2.size(0, 0);
  blower.size(0, 0);
  buttonlevel2.size(50, 50);
  button2level2.size(50, 50);
  //button2.position(windowWidth + windowWidth, windowHeight - windowHeight - windowHeight);
  //blower.position(windowWidth + windowWidth, windowHeight - windowHeight - windowHeight);
  bubble.visible = true;
}
