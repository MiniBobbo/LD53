import { SceneMessages } from "../enums/SceneMessages";

export class LevelTimer {
    // scene:Phaser.Scene;
    // i:Phaser.GameObjects.Image;
    t:Phaser.GameObjects.Text;
    currentTime:number = 0;

    constructor(scene:Phaser.Scene) {
        this.t = scene.add.text(10,10, '0').setScrollFactor(0,0).setFontSize(12);
        scene.events.on(SceneMessages.UpdateTime, this.UpdateTime, this)
        
    }


    UpdateTime(newTime:number) {
        this.currentTime = newTime;
        this.t.setText(Phaser.Math.RoundTo(this.currentTime, 0) + "");
    }

}