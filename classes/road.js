import * as defaults from "../settings.js"

export class Road {
    constructor() {
        this.height = 850
        this.y = 0
        this.x = Math.round(defaults.width * 0.8)
        this.speed = defaults.GROUP_SPEED
        this.sprite = new Image()
        this.sprite.src = "../assets/ROAD.png";
        this.sprite.alt = 'alt';
                 }
    draw(context,x) {
        this.y = (this.y + (defaults.GROUP_SPEED/defaults.FRAME_RATE)/defaults.M2PX) % 100 
         context.drawImage(this.sprite, this.x, (this.y-50))
    }
                }