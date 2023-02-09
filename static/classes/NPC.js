export class NPC{
    constructor(position, speed){
        this.x = [position, speed]
        this.sprite = new Image()
        this.sprite.src = "../static/assets/NPC.png";
        this.sprite.alt = 'alt';
    
    }


}
