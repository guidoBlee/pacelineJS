import * as defaults from "../settings.js"
import * as funcs from "./functions.js"


export class Rider {
constructor(x0=[-0.0, 0.0], dt) {
    this.mass = 70;  // kg
    this.cda = 250e-3;  // m2
    this.rr = 10;  // watts
    this.x0_game = [x0[0], x0[1]]
    this.x = x0;  // x, v
    console.log('intialised ' + this.x)
    this.pwr = this.neutral_watts();
    this.t = 0;  // classes own time tracker
    this.dt = dt;
    this.pwrHist = [];
    this.gap = -1;
    this.y = 0;
    this.sprite = new Image()
    this.sprite.src = "../assets/player.png";
    this.sprite.alt = 'alt';
             }


restart() {
    this.pwrHist = []
    this.x = [this.x0_game[0],this.x0_game[1]]
    this.t = 0
    this.pwr = 0
}
acceleration(state){
    let pos_terms = this.pwr / (state[1] + defaults.GROUP_SPEED)
    let neg_terms = this.drag(); // + this.rr / GROUP_SPEED
    return [state[1], (pos_terms - neg_terms) / this.mass]
}

set_gap(last_rider){
    this.gap = -(last_rider + this.x[0])-defaults.MIN_DRAFT_DISTANCE;
    console.log(this.gap)
}
drag(){
    let rho = 1.225;
    let apparent_cda = 0;
    if (this.gap < 0){
        apparent_cda = this.cda;
    }
    else{
        apparent_cda = this.cda - Math.min(0.15, 0.15 / (this.gap+1.5));
    }

    return 0.5 * rho * (this.x[1] + defaults.GROUP_SPEED) ** 2 * apparent_cda;
}
neutral_drag() {
    let rho = 1.225;
    let apparent_cda = 0 
    if (this.gap < 0){
        apparent_cda = this.cda;
    } else{
        apparent_cda = this.cda - Math.min(0.15, 0.15 / (this.gap+1.5));
    }
    return 0.5 * rho * defaults.GROUP_SPEED ** 2 * this.cda
}
neutral_watts(){
    return this.neutral_drag() * defaults.GROUP_SPEED
}
drag_watts(){
    return this.drag() * (defaults.GROUP_SPEED - this.x[1])
}


get_normp(){
    if (this.pwrHist.length > 0) {
        return 0;
    }
    norm_p = 0
    for (const p of this.pwrHist){
        norm_p += Math.max(0,this.pwrHist[i]) ** 4
    }
    norm_p = norm_p/this.pwrHist.length
    return norm_p ** 0.25
        
}
set_y(npcs_list){
    let npc_dx = new Array();
    for (let i = 0; i < npcs_list.length; i++){
        npc_dx[i] = npcs_list[i].x[0] + this.x[0]
    }
    let wheel_rear = -0.2 + defaults.MIN_DRAFT_DISTANCE +  Math.max(...npc_dx);
    console.log(wheel_rear)
    let wheel_front = 0.15 -defaults.MIN_DRAFT_DISTANCE + Math.min(...npc_dx);
    this.y = 25 + -0.5*(1- funcs.sigmoid(25*wheel_front) -funcs.sigmoid(-25*wheel_rear))/defaults.M2PX + defaults.width/2;
}

advance_pos(){
    let k1 = this.acceleration(this.x)
    let k2 = this.acceleration(funcs.addA(this.x, funcs.multiA(funcs.multiA(k1,0.5), this.dt)));
    let k3 = this.acceleration(funcs.addA(this.x, funcs.multiA(funcs.multiA(k2,0.5), this.dt)));
    let k4 = this.acceleration(funcs.addA(this.x, funcs.multiA(k3, this.dt)));
    let k = 0
    k = funcs.addA(funcs.addA(funcs.addA(k1, funcs.multiA(k2, 2)),funcs.multiA(k3,2)),k4);

    let i = Math.round(this.t / this.dt);
    // this.traj[i, :] = this.x
    // this.thist[i] = this.t
    this.x = funcs.addA(this.x,funcs.multiA(k, this.dt / 6));

    this.t += this.dt;
    this.pwrHist.push(this.pwr);

}
}
