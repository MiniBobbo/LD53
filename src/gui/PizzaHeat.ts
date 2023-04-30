import { C } from "../C";
import { SceneMessages } from "../enums/SceneMessages";

export class PizzaHeat {
    scene:Phaser.Scene;
    // i:Phaser.GameObjects.Image;
    c:Phaser.GameObjects.Container;
    currentTime:number = C.PIZZA_HEAT_TIME;
    complete:boolean = false;
    t:Phaser.GameObjects.BitmapText;
    
    inside:Phaser.GameObjects.NineSlice;

    constructor(scene:Phaser.Scene) {
        this.scene = scene;
        let flame = scene.add.sprite(0,0,'atlas', 'icons_3').setOrigin(0,0);
        this.c = scene.add.container(0,0).setScrollFactor(0,0);
        this.c.add(flame);
        let outside = scene.add.nineslice(16,0,'atlas', 'outsidebar', 380, 12, 4,4).setOrigin(0,0);
        this.inside = scene.add.nineslice(19,3,'atlas', 'insidebar', 374, 6, 2,2).setOrigin(0,0).setTint(0xff0000);
        // this.t = scene.add.text(10,10, '0').setScrollFactor(0,0).setFontSize(12);
        scene.events.on(SceneMessages.LevelComplete, ()=>{this.complete = true;}, this);
        scene.events.on(SceneMessages.UpdateTime, this.UpdateTime, this);
        scene.events.on(SceneMessages.ReheatPizza, ()=>{this.currentTime = C.PIZZA_HEAT_TIME}, this);
        this.c.add(outside);
        this.c.add(this.inside);
        this.t = scene.add.bitmapText(190, 8, 'emu', '').setTint(0x0000ff);
        this.c.add(this.t);
        
    }


    UpdateTime(newTime:number) {
        if(this.complete)
            return;
        this.currentTime -= newTime;
        let percent = this.currentTime / C.PIZZA_HEAT_TIME;
        this.inside.width = 374 * percent;
        this.scene.events.emit(SceneMessages.SetTipMult, 2 * percent);
        this.t.setText(Phaser.Math.RoundTo(200 * percent, 0) + "%");
    }

}