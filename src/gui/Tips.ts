import { SceneMessages } from "../enums/SceneMessages";

export class Tips {
    // scene:Phaser.Scene;
    t:Phaser.GameObjects.BitmapText;
    currentTip:number = 0;


    constructor(scene:Phaser.Scene) {
        this.t = scene.add.bitmapText(10,10, 'pixel', 'Tips earned: $0').setScrollFactor(0,0);
        scene.events.on(SceneMessages.AddTip, this.AddTip, this)
        
    }


    AddTip(addTip:number) {
        this.currentTip += addTip;
        this.t.setText("Tips earned: $" + Phaser.Math.RoundTo(this.currentTip, 0) );
    }

}