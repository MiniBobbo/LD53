import { SceneMessages } from "../enums/SceneMessages";

export class LevelTimer {
    // scene:Phaser.Scene;
    // i:Phaser.GameObjects.Image;
    c:Phaser.GameObjects.Container;
    t:Phaser.GameObjects.BitmapText;
    currentTime:number = 0;
    complete:boolean = false;

    
    inside:Phaser.GameObjects.NineSlice;

    constructor(scene:Phaser.Scene) {
        this.t = scene.add.bitmapText(10,12, 'emu', '0').setScrollFactor(0,0);
        scene.events.on(SceneMessages.UpdateTime, this.UpdateTime, this);
        scene.events.on(SceneMessages.LevelComplete, ()=>{this.complete = true;}, this);

    }


    UpdateTime(newTime:number) {
        if(this.complete)
            return;
        this.currentTime += newTime;
        this.t.setText(Phaser.Math.RoundTo(this.currentTime/1000, 0) + "");
    }

}