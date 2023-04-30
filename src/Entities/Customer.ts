import { C } from "../C";
import { EntityMessages } from "../enums/EntityMessages";
import { SceneMessages } from "../enums/SceneMessages";
import { LevelScene } from "../scenes/LevelScene";
import { Entity } from "./Entity";

export class Customer extends Entity {
    private delivered:boolean = false;
    private tipAmount:number = 100;

    constructor(scene:LevelScene) {
        super(scene);
        this.sprite.setSize(20, 20);
        this.sprite.setName('customer');
        this.PlayAnimation('stand');
        
        this.scene.CollideMap.add(this.sprite);
        this.scene.Enemies.add(this.sprite);
        this.scene.Midground.add(this.sprite);
        this.sprite.setGravityY(C.GRAVITY);

        

        // this.Facing = FacingEnum.Left;

        this.sprite.setData(this);

        this.sprite.on(EntityMessages.OVERLAP_PLAYER, this.OverlapPlayer, this);
    }


    OverlapPlayer() {
        if(this.delivered)
            return;

        this.delivered = true;
        this.sprite.alpha = .5;
        this.scene.events.emit(SceneMessages.AddTip, this.tipAmount * this.scene.PizzaHeatTipMultiplier);
        this.scene.events.emit(SceneMessages.DeliverPizza);

    }

    static CreateAnims(scene:Phaser.Scene) {
        scene.anims.create({ key: 'customer_stand', frameRate: 60, frames: scene.anims.generateFrameNames('atlas', { prefix: 'customer_stand_', end: 0}), repeat: 0});
    }

}