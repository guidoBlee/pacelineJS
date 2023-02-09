var PIXEL_RATIO = window.devicePixelRatio;

function createHiDPICanvas(w, h, ratio) {
  if (!ratio) { ratio = PIXEL_RATIO; }
  var can = document.createElement("canvas");
  can.width = w * ratio;
  can.height = h * ratio;
  can.style.width = w + "px";
  can.style.height = h + "px";
  can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
  return can;
}

//Create canvas with the device resolution.
// var canvas = createHiDPICanvas(defaults.width, defaults.height);
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.setTransform(1, 0, 0, 1, 0, 0);

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


import { Rider } from './classes/player.js';
import { NPC } from './classes/NPC.js';
import * as defaults from "./settings.js"
import { Road } from './classes/road.js';
import * as funcs from "./classes/functions.js"
import { ImageClass } from './classes/image.js';



var player = new Rider([-0.0, 0.0], 1 / defaults.FRAME_RATE, 0);
var npcs_list = Array();
var markings = new Road();
//var title = new ImageClass("../static/assets/title.png");
var nametext = new ImageClass("../static/assets/nameText.png");

for (let i = 0; i < defaults.GROUP_SIZE; i++) {
  var npc = new NPC(i * 1.8 + 2, 0);
  npcs_list.push(npc)
}
player.set_y(npcs_list);

let pwrPressTime;
let gameTime = defaults.GAME_TIME;
let gameStart = false;
let successTime = 0;
let timestep;
let keyunpressed = true
let conditions = false
let playtimeComplete = false
let multiplier = 1;

function keyDownHandler(e) {
  keyunpressed = false
  if (!gameStart && ! playtimeComplete) {
    gameStart = true
    clearInterval(gameStarter)
    renderer = setInterval(main, Math.round(1000 / defaults.FRAME_RATE))
    pwrPressTime = new Date().getTime();

  }
  else {
    pwrPressTime = new Date().getTime();
    if (! playtimeComplete && (e.key === "Right" || e.key === "ArrowRight" || e.key === "Left" || e.key === "ArrowLeft")) {
      player.pwr = Math.min(player.pwr + 25, 1200);
    } else if (! playtimeComplete &&(e.key === "Up" || e.key === "ArrowUp")) {
      player.pwr = player.neutral_watts();
    } else if (! playtimeComplete && e.key === "ArrowDown") {
      player.pwr = -800;
    }
    else if (e.key === "r") {
      console.log('R KEY')
      successTime = 0;
      player.restart()
      playtimeComplete = false
      gameTime = defaults.GAME_TIME;
      clearInterval(renderer)
      renderer = setInterval(main, Math.round(1000 / defaults.FRAME_RATE))
    }
  }
}

function keyUpHandler(e){
  keyunpressed = true;
}
function main() {
  if (! playtimeComplete){
    timestep = 1000 / defaults.FRAME_RATE;
  } else{
    multiplier = Math.min(multiplier*1.001,20)
    console.log(multiplier)
    timestep = multiplier * 1000 / defaults.FRAME_RATE;
    player.selfcomplete = true
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // TEXT WRITING
  let lineheight = defaults.height - 104

  // power figure
  funcs.writeText(ctx,
    "Power :",
    10,
    defaults.height - 10 - funcs.pwrToFontsize(player.pwr),
    16)
  funcs.writeText(ctx,
    Math.max(0, Math.round(player.pwr)) + "W",
    10,
    defaults.height - 10,
    funcs.pwrToFontsize(player.pwr),
    player.pwr
  )
  // np figure

  lineheight = funcs.writeText(ctx,
    Math.round(player.get_normp()) + " W",
    10,
    lineheight,
    defaults.SMALL_FONT
  )
  lineheight = funcs.writeText(ctx,
    'NP :',
    10,
    lineheight,
    defaults.SMALL_FONT
  )
  // drag figure
  lineheight = funcs.writeText(ctx,
    Math.round(player.drag_watts()) + " W",
    10,
    lineheight,
    defaults.SMALL_FONT
  )
  lineheight = funcs.writeText(ctx,
    'Aero Drag :',
    10,
    lineheight,
    defaults.SMALL_FONT
  )
  // game time
  lineheight = funcs.writeText(ctx,
    Math.round(gameTime * 10) / 10 + " s",
    10,
    lineheight,
    defaults.SMALL_FONT
  )
  lineheight = funcs.writeText(ctx,
    'Time remaining :',
    10,
    lineheight,
    defaults.SMALL_FONT
  )
  // conditions text
  if (conditions && ! playtimeComplete){
    lineheight = funcs.writeText(ctx,
      'Hold it! ' + String(Math.round((3- successTime) * 10)/10) + 's',
      10,
      lineheight,
      defaults.SMALL_FONT
    ) }
    else if (conditions) {
      lineheight = funcs.writeText(ctx,
        'Nice one',
        10,
        lineheight,
        defaults.SMALL_FONT
      )
    }
  
  // GRAPHICS DRAWING
  ctx.drawImage(player.sprite, player.y, -player.x[0] / defaults.M2PX)
  markings.draw(ctx)
  for (let i = 0; i < defaults.GROUP_SIZE; i++) {
    ctx.drawImage(npcs_list[i].sprite, 25 + defaults.width / 2, npcs_list[i].x[0] / defaults.M2PX)
  }

  // GAME SIMULATION
  player.advance_pos(timestep / 1000);
  player.set_y(npcs_list)
  player.set_gap(npcs_list[npcs_list.length - 1].x[0])
  if (new Date().getTime() - pwrPressTime > 250 && keyunpressed) {
    player.pwr = Math.max(0, player.pwr - 4)
  }
  if (player.x[0] < - defaults.height * defaults.M2PX) {
    clearInterval(renderer)
    console.log("DROPPED")
  }


  // end of game checking

  // check for correct position for success
  conditions = (0.05 < player.gap && player.gap < 0.3 && Math.abs(player.x[1]) < 0.5);
  if (conditions && successTime >= 3 && ! playtimeComplete){
    playtimeComplete = true

  }
  else if (conditions){
    successTime += timestep/1000;
  } else{
    successTime = 0;
  }

  gameTime -= timestep / 1000;
  if (gameTime < 0){
    gameTime == 0
    clearInterval(renderer)
    endScreen()
    console.log('Complete!')
  }
}


// function that runs on startup
function starter() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
//  ctx.drawImage(title.sprite, 12, 35);
  ctx.drawImage(nametext.sprite, 50, defaults.height - 24)
  ctx.drawImage(player.sprite, player.y, -player.x[0] / defaults.M2PX)
//  setTimeout( function() {
//    funcs.writeText(ctx,
//      Math.round(player.get_normp()) + 'W',
//      5,
//      2 * fontsize + lineheight,
//      fontsize,
//      )
//  }, 1000);

  markings.draw(ctx)
  for (let i = 0; i < defaults.GROUP_SIZE; i++) {
    ctx.drawImage(npcs_list[i].sprite, 25 + defaults.width / 2, npcs_list[i].x[0] / defaults.M2PX)
  }
}
function endScreen(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let fontsize = 28 +  2 * Math.sin(new Date()/10)
  // end message plot
  let lineheight = 100
  funcs.writeText(ctx,
    'GAME OVER',
    5,
    lineheight,
    fontsize,
    )

    setTimeout( function() { 
      funcs.writeText(ctx,
        'YOU NORMALISED :',
        5,
        fontsize + lineheight,
        fontsize,
        )
    }, 500);
    setTimeout( function() { 
      funcs.writeText(ctx,
        Math.round(player.get_normp()) + 'W',
        5,
        2 * fontsize + lineheight,
        fontsize,
        )
    }, 1000);
    setTimeout( function() { 
      funcs.writeText(ctx,
        "Press R to play again",
        5,
        8 * fontsize + lineheight,
        fontsize,
        )
    }, 2000);

    

}

let renderer;
let gameStarter;
let gameEnder;
gameStarter = setInterval(starter, Math.round(1000 / defaults.FRAME_RATE))




