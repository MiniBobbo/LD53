import { EntityMessages } from "../enums/EntityMessages";
import { SceneMessages } from "../enums/SceneMessages";
import { LevelScene } from "../scenes/LevelScene";
import { Entity } from "./Entity";

export class Truck extends Entity {
    private delivered:boolean = false;
    private tipAmount:number = 100;

    constructor(scene:LevelScene) {
        super(scene);
        this.sprite.setSize(20, 20);
        this.sprite.setName('truck_small');
        this.PlayAnimation('idle');
        
        this.scene.CollideMap.add(this.sprite);
        this.scene.Enemies.add(this.sprite);
        this.scene.Midground.add(this.sprite);

        this.sprite.on(SceneMessages.RespawnPlayer, this.Respawn, this);
        this.PlayAnimation('idle');
        

        // this.Facing = FacingEnum.Left;

        this.sprite.setData(this);

    }
    Respawn(RespawnPlayer: SceneMessages, Respawn: any, arg2: this) {
        this.PlayAnimation('open');
        let timeline = this.scene.add.timeline([
            {
                at:1000,
                run: () => {this.PlayAnimation('idle');}
            }
        ]);

        timeline

        this.scene.time.addEvent({
            delay:1000,
            callbackScope:this,
            callback:() => {this.PlayAnimation('idle')}
        });

    }



    static CreateAnims(scene:Phaser.Scene) {
        scene.anims.create({ key: 'truck_small_idle', frameRate: 30, frames: scene.anims.generateFrameNames('atlas', { prefix: 'truck_small_idle_', end: 2}), repeat: -1});
        scene.anims.create({ key: 'truck_small_open', frameRate: 30, frames: scene.anims.generateFrameNames('atlas', { prefix: 'truck_small_open_', end: 0}), repeat: 0});
    }

}