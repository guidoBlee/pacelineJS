var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


document.addEventListener("keydown", keyDownHandler, false);


import {Rider} from './classes/player.js';
import {NPC} from './classes/NPC.js';
import * as defaults from "./settings.js"
import { Road } from './classes/road.js';
import * as funcs from "./classes/functions.js"



var player = new Rider([-0.0, 0.0],1/defaults.FRAME_RATE, 0);
var npcs_list  = Array();
var markings = new Road();

for (let i = 0; i < defaults.GROUP_SIZE;i++){
  var npc = new NPC(i*1.8+2,0);
  npcs_list.push(npc)
}
player.set_y(npcs_list);

let pwrPressTime;

function keyDownHandler(e) {
  pwrPressTime = new Date().getTime();
  if (e.key === "Right" || e.key === "ArrowRight" || e.key === "Left" || e.key === "ArrowLeft") {
    player.pwr = Math.min(player.pwr + 25,1200);
  } else if (e.key === "Up" || e.key === "ArrowUp") {
    player.pwr = player.neutral_watts();
  } else if (e.key === "ArrowDown"){
    player.pwr = -800;
  }
    else if (e.key === "r"){
      player.x = [0,0];
      console.log('R KEY')
      player.pwr = player.neutral_watts();
      clearInterval(renderer)
      renderer = setInterval(main,Math.round(1000/defaults.FRAME_RATE))

    }
  }

function main(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // TEXT WRITING

  // power figure
  funcs.writeText(ctx,
    "Power :",
    10,
    defaults.height - 10 - funcs.pwrToFontsize(player.pwr),
    16)
  funcs.writeText(ctx, 
    Math.max(0,Math.round(player.pwr))  +"W", 
    10,
    defaults.height-10,
    funcs.pwrToFontsize(player.pwr),
    player.pwr
    )


  // GRAPHICS DRAWING
  ctx.drawImage(player.sprite, player.y,-player.x[0]/defaults.M2PX)
  markings.draw(ctx)
  for (let i = 0; i < defaults.GROUP_SIZE;i++){
    ctx.drawImage(npcs_list[i].sprite, 25 + defaults.width/2,npcs_list[i].x[0]/defaults.M2PX)
  }

  // GAME SIMULATION
  player.advance_pos();
  player.set_y(npcs_list)
  player.set_gap(npcs_list[npcs_list.length-1].x[0])
  if (new Date().getTime() - pwrPressTime > 250){
    player.pwr = Math.max(0,player.pwr-4)
  }
  if (player.x[0] < - defaults.height*defaults.M2PX){
    clearInterval(renderer)
    console.log("DROPPED")
  }
}

let renderer;


renderer = setInterval(main,Math.round(1000/defaults.FRAME_RATE))
