import { D } from "../../enums/D";
import { EntityMessages } from "../../enums/EntityMessages";
import { SceneMessages } from "../../enums/SceneMessages";
import { LevelScene } from "../../scenes/LevelScene";
import { Enemy } from "../Enemy";

export class Spikes extends Enemy {
    constructor(scene:LevelScene, direction:D) {
        super(scene);
        if(direction == D.U || direction == D.D)
            this.sprite.setSize(8,5);
        else
            this.sprite.setSize(5,8);

            this.sprite.name = 'spike';
            this.sprite.setFrame('spikes_0');
            this.sprite.setOffset(3,5);
            if(direction == D.L) {
                this.sprite.angle = 270;
                this.sprite.setOffset(5,0);
            }
            else if(direction == D.R) {
                this.sprite.angle = 90;
                this.sprite.setOffset(0,0);
            } else if(direction == D.D) {
                this.sprite.angle = 180;
                this.sprite.setOffset(2,0);
            }   
    
    
    
            
            // this.sprite.setGravityY(C.GRAVITY);
            // this.sprite.setDepth(5);
            // this.PlayAnimation('wave');
            this.scene.CollidePlayer.add(this.sprite);
            this.sprite.on(EntityMessages.OVERLAP_PLAYER, () => {
                // SM.PlaySFX(SFX.Slice);
                this.gs.events.emit(SceneMessages.PlayerHitSpikes);
            });
            this.gs.CollideMap.add(this.sprite);
            // this.gs.realLayer.add(this.sprite);
    

    }
}