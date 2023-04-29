import { EffectTypes } from "../enums/EffectTypes";
import { LevelScene } from "../scenes/LevelScene";

export class EffectManager {
    scene:LevelScene;
    active:boolean;
    EffectGroup:Phaser.GameObjects.Sprite[];

    constructor(scene:LevelScene) {
        this.scene = scene;
        this.EffectGroup = [];
    }
    
    LaunchEffect(origin:{x:number, y:number, right:boolean}, type:EffectTypes) {
        let a = this.EffectGroup.find(e=>!e.anims.isPlaying);  
        if(a == undefined) {
            a = this.scene.add.sprite(0,0,'atlas', 0);
            this.EffectGroup.push(a);
            this.scene.Midground.add(a);
            a.setData('ai', a).setPipeline('Light2D');
        }

        a.setAngle(0).setFlip(false, false).setScale(1,1).setDepth(10).setVisible(true);
        a.once('animationcomplete', ()=>{a.setVisible(false)});

        switch (type) {
            // case EffectTypes.Poof:
            //     a.setPosition(origin.x + 6, origin.y + 6)
            //     .setScale(2,2)
            //     .setFlipX(!origin.right)
            //     .setDepth(100)
            //     .anims.play('poof')
            //     ;
            //     break;
        
            default:
                break;
        }

    }
}