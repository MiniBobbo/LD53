import { EntityMessages } from "../enums/EntityMessages";
import { PowerTypes } from "../enums/PowerTypes";
import { LevelScene } from "../scenes/LevelScene";
import { Entity } from "./Entity";

export class Powerup extends Entity {
    power:PowerTypes;
    constructor(scene:LevelScene, p:PowerTypes) {
        super(scene);
        this.power = p;
        this.sprite.setSize(12,12);

        this.sprite.on(EntityMessages.OVERLAP_PLAYER, this.OverlapPlayer, this);
        // this.scene.Enemies.add(this.sprite);
        this.scene.Powerups.add(this.sprite);
        this.scene.Midground.add(this.sprite);
        switch (p) {
            case PowerTypes.Default:
                this.sprite.setFrame('upgrade_axe_0');
                this.sprite.setGravityY(0)
                .setOffset(0,0);
                break;
            default:
                break;
        }
        
    }

    OverlapPlayer() {
        this.scene.events.emit(EntityMessages.GET_POWERUP, this.power);
        this.Dead();
    }
}