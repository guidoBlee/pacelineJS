export class Rider {
constructor() {
    document.write("tsxt");
}};
    /*
    this.mass = 70;  // kg
    this.cda = 250e-3;  // m2
    this.rr = 10;  // watts
    this.x0_game = [x0[0], x0[1]]
    this.x = x0;  // x, v
    this.pwr = pwr;
    this.t = 0;  // classes own time tracker
    this.dt = problem_t_dt[1];
    this.T = problem_t_dt[0];
    this.pwrHist = [];
    this.gap = 1000.0;
    this.y = y_pos;
    this.sprite = new Image()
    this.sprite.src = "../assets/player.png";
    
             }
            }

is_complete(){
    if (Math.round(this.t * 1000 + Number.EPSILON)/1000 == this.T) {
        return True
    }
}

restart() {
    this.pwrHist = []
    this.x = [this.x0_game[0],this.x0_game[1]]
    this.t = 0
    this.pwr = 0
}
acceleration(state){
    pos_terms = this.pwr / (state[1] + GROUP_SPEED)
    neg_terms = this.drag(); // + this.rr / GROUP_SPEED
    return [state[1], (pos_terms - neg_terms) / this.mass]
}

set_gap(last_rider){
    this.gap = -last_rider + this.x[0]
}
drag(){
    rho = 1.225;
    if (this.gap > -MIN_DRAFT_DISTANCE){
        apparent_cda = this.cda;
    }
    else{
        apparent_cda = this.cda - min(0.15, 0.15 / (-this.gap+0.2));
    }
    return 0.5 * rho * (this.x[1] + GROUP_SPEED) ** 2 * apparent_cda;
}
neutral_drag() {
    rho = 1.225;
    if (this.gap > -MIN_DRAFT_DISTANCE){
        apparent_cda = this.cda;
    } else{
        apparent_cda = this.cda - Math.min(0.1, 0.1 / (-this.gap+1));
    }
    return 0.5 * rho * GROUP_SPEED ** 2 * this.cda
}
neutral_drag_watts(){
    return this.neutral_drag() * GROUP_SPEED
}
drag_watts(){
    return this.drag() * (GROUP_SPEED + this.x[1])
}
total_neutral_watts(){
    return this.neutral_drag_watts();// + this.rr;
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
    npc_dx = new Array();
    for (let i = 0; i < npcs_list.length; i++){
        npc_dx[i] = this.x[0] - npc.x[i]
    }
    wheel_rear = max(...npc_dx);
    wheel_front = min(...npc_dx);
    this.y = 0.5*(1 - sigmoid(6-wheel_front*5) -sigmoid(6+wheel_rear*5))/M2PX + defaults.width;//2;
}

advance_pos(){
    k1 = this.acceleration(this.x)
    k2 = this.acceleration(addA(this.x, multiA(this.dt, multiA(k1,0.5))));
    k3 = this.acceleration(addA(this.x, multiA(this.dt, multiA(k2,0.5))));
    k4 = this.acceleration(addA(this.x, multiA(this.dt, k3)));
    k = addA(addA(addA(k1, multiA(k2, 2),multiA(k3,2),k4)));
    i = Math.round(this.t / this.dt);
    // this.traj[i, :] = this.x
    // this.thist[i] = this.t
    this.x = addA(this.x,multiA(k, this.dt / 6));
    this.t += this.dt;
    this.pwrHist.push(this.pwr);
    this.is_complete()
}
}
*/