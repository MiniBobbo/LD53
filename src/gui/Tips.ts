import { SceneMessages } from "../enums/SceneMessages";

export class Tips {
    // scene:Phaser.Scene;
    t:Phaser.GameObjects.Text;
    currentTip:number = 0;


    constructor(scene:Phaser.Scene) {
        this.t = scene.add.text(10,20, '$0').setFontSize(12).setScrollFactor(0,0);
        scene.events.on(SceneMessages.AddTip, this.AddTip, this)
        
    }


    AddTip(addTip:number) {
        this.currentTip += addTip;
        this.t.setText("$" + Phaser.Math.RoundTo(this.currentTip, 0) );
    }

}