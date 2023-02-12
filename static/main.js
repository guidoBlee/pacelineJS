var PIXEL_RATIO = window.devicePixelRatio;

//Create canvas with the device resolution.
// var canvas = createHiDPICanvas(defaults.width, defaults.height);
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var name_input = new CanvasInput({
  canvas: document.getElementById('myCanvas'),
  maxlength : 10,
  x: defaults.width/2 - 75,
  y: defaults.height - 245,
  width: 150
});
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("touchmove", touchMoveHandler, false);
// I just picked 20 at random here.
// In this instance maxWidth = 56 * 20 = 1,120 and maxHeight = 40 * 20 = 800
// native width and height (does not change)
const nHeight = defaults.height;
const nWidth = defaults.width;

const maxMultiplier = 20;
const maxWidth = nWidth * maxMultiplier;
const maxHeight = nHeight * maxMultiplier;

// % of browser window to be taken up by the canvas
// this can just be set to 1 if you want max height or width
const windowPercentage = 1.0;

// the canvas' displayed width/height
// this is what changes when the window is resized 
// initialized to the native resolution
let cHeight = nHeight;
let cWidth = nWidth;

window.addEventListener('load', () => {
  // initialize native height/width
  ctx.canvas.width = cWidth;
  ctx.canvas.height = cHeight;
  resize();
})

window.addEventListener('resize', () => {
  resize();
})


function resize() {
  cWidth = window.innerWidth;
  cHeight = window.innerHeight;

  // ratio of the native game size width to height
  const nativeRatio = nWidth / nHeight;
  const browserWindowRatio = cWidth / cHeight;

  // browser window is too wide
  if (browserWindowRatio > nativeRatio) {

    cHeight = Math.floor(cHeight * windowPercentage); // optional
    if (cHeight > maxWidth) cHeight = maxHeight; // optional

    cWidth = Math.floor(cHeight * nativeRatio);
  } else {
    // browser window is too high

    cWidth = Math.floor(cWidth * windowPercentage); // optional
    if (cWidth > maxWidth) cWidth = maxWidth; // optional

    cHeight = Math.floor(cWidth / nativeRatio);
  }

  // set the canvas style width and height to the new width and height
  ctx.canvas.style.width = `${cWidth}px`;
  ctx.canvas.style.height = `${cHeight}px`;
}

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
let multiplier = 3;
let lastTouch = [0,0,0]


function touchMoveHandler(e){
  if (!gameStart && ! playtimeComplete) {
    gameStart = true
    clearInterval(gameStarter)
    renderer = setInterval(main, Math.round(1000 / defaults.FRAME_RATE))
    pwrPressTime = new Date().getTime();
  }
  // calculates speed of finger and makes power from it
  let speed = 0;
  if (lastTouch[0] == 0){
    lastTouch = [e.touches[0]['clientX'],e.touches[0]['clientY'],e.timeStamp]
    speed = 0;
  }
  else {
    let x_sq = (e.touches[0]['clientX']- lastTouch[0])**2
    let y_sq = (e.touches[0]['clientY']- lastTouch[1])**2
    speed = (x_sq + y_sq)**0.5 / (e.timeStamp - lastTouch[2])
    lastTouch = [e.touches[0]['clientX'],e.touches[0]['clientY'],e.timeStamp]
  }
  
  console.log(speed)
  player.pwr = Math.min(player.pwr + 3*speed, 1200);
}
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
    else if (e.key ==="Enter"){ //&&  gameTime==0){
      let usr_name = name_input.value()
      if (conditions){
        var lb_data = $.ajax({
          method: 'POST',
          url: '/atl',
          data: JSON.stringify({'usr_name': usr_name,
                                 'np': Math.round(player.get_normp())}),
          contentType: 'application/json',
          success: function(res){return res;}
        })
        console.log(lb_data)
      }
    }
  }
}

function keyUpHandler(e){
  keyunpressed = true;
}


var scores = await fetch('/frl')
  .then(res=>res.json())
  .then(score=>{return score;})

function leaderboard(scoreboard){
  let lineheight = 24;
  let y_pos = lineheight * 0 + 150;
  funcs.writeText(ctx,
    'LEADERBOARD',
    5,
    y_pos,
    lineheight,
    )
  for (let i = 0; i < scoreboard.length; i++){
    y_pos = y_pos + lineheight;
    funcs.writeText(ctx,
      i+1 + ' ' + scoreboard[i][0] + ' ' +scoreboard[i][1] + ' W',
      5,
      y_pos,
      lineheight,
      )
  }
}


function main() {
  if (! playtimeComplete){
    timestep = 1000 / defaults.FRAME_RATE;
  } else{
    multiplier = Math.min(35,multiplier * 1.02)
    console.log(multiplier)
    timestep = multiplier * 1000 / defaults.FRAME_RATE;
    player.selfcomplete = true
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // TEXT WRITING
  let lineheight = window.innerHeight - 104

  // power figure

  lineheight = funcs.writeText(ctx,
    Math.max(0, Math.round(player.pwr)) + "W",
    10,
    defaults.height - funcs.pwrToFontsize(player.pwr),
    funcs.pwrToFontsize(player.pwr),
    player.pwr
  )
    lineheight = funcs.writeText(ctx,
    "Power :",
    10,
    lineheight,
    16)
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
    ctx.drawImage(npcs_list[i].sprite, 45 + defaults.width / 2, npcs_list[i].x[0] / defaults.M2PX)
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
    multiplier = 1.2
  }
  else if (conditions){
    successTime += timestep/1000;
  } else{
    successTime = 0;
  }

  gameTime -= timestep / 1000;
  if (gameTime < 0){
    gameTime = 0
    clearInterval(renderer)
    endScreen()
    console.log('Complete!')
  }
}


// function that runs on startup
function starter() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  leaderboard(scores)
//  ctx.drawImage(title.sprite, 12, 35);
  ctx.drawImage(nametext.sprite, 50, defaults.height - 24)
  ctx.drawImage(player.sprite, player.y, -player.x[0] / defaults.M2PX)
  markings.draw(ctx)
  for (let i = 0; i < defaults.GROUP_SIZE; i++) {
    ctx.drawImage(npcs_list[i].sprite, 45 + defaults.width / 2, npcs_list[i].x[0] / defaults.M2PX)
  }
}

function endScreen(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let fontsize = 28


  // end message plot
  let lineheight = 250
  funcs.writeText(ctx,
    'GAME OVER',
    5,
    lineheight - fontsize,
    fontsize,
    )

    if (conditions){
      funcs.writeText(ctx,
        'NICE WORK',
        5,
        lineheight,
        fontsize,
        )
          name_input.renderCanvas()
          name_input.focus()
    } else {
      funcs.writeText(ctx,
        'TRY HARDER',
        5,
        lineheight,
        fontsize,
        )
    }
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
        6 * fontsize + lineheight,
        fontsize,
        )
    }, 2000);
    setTimeout( function() { 
      funcs.writeText(ctx,
        "Enter name",
        5,
        7 * fontsize + lineheight,
        fontsize,
        )
    }, 2000);
    setTimeout( function() { 
      funcs.writeText(ctx,
        " for leaderboard:",
        defaults.width/6,
        8 * fontsize + lineheight,
        fontsize,
        )
    }, 2000);

    

}

let renderer;
let gameStarter;
let gameEnder;
gameStarter = setInterval(starter, Math.round(1000 / defaults.FRAME_RATE))


