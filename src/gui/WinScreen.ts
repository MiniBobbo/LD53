import { C } from "../C";
import { LevelScene } from "../scenes/LevelScene";

export class WinScreen {
    c:Phaser.GameObjects.Container;
    scene:LevelScene;
    Record:boolean = false;
    Tips:number;


    constructor(scene:LevelScene, tips:number, newRecord:boolean = false) {
        this.scene = scene;
        this.Tips = tips;
        this.Record = newRecord;
        
        this.c = scene.add.container(0,0).setScrollFactor(0,0);
        // scene.cameras.main.fadeOut(2000, 0,0,0,(can:any, progress:number) =>{ if(progress == 1) this.EndScene()}, this);
        let t = scene.add.bitmapText(70,70, 'pixel', 'Level Complete').setScale(3);
        t.postFX.addGlow(0);
        let tip = scene.add.bitmapText(180,110, 'pixel', `$${tips}`).setScale(2);
        tip.postFX.addGlow(0);
        let back = scene.add.bitmapText(100,150, 'pixel', `Press Left to retry level`).setMaxWidth(100).setCenterAlign();
        back.postFX.addGlow(0);
        let menu = scene.add.bitmapText(165,200, 'pixel', `Press jump for the menu`).setMaxWidth(100).setCenterAlign();
        menu.postFX.addGlow(0);


        scene.Midground.postFX.addBlur(2, 1,1,1,0xffffff,6);
        
        if(this.Record)
            t.setText('**NEW RECORD**').setTint(0xffff00);
        let p = scene.add.image(200,120, 'pizza').setScale(.1,.1);
        
        scene.events.on('preupdate', ()=>{p.angle += 5}, this);
        scene.tweens.add({
            targets:p, 
            scaleX:1,
            scaleY:1,
            duration:500
        });
        this.c.add(p);
        this.c.add(t);
        this.c.add(tip);
        this.c.add(back);
        this.c.add(menu);
    }

    EndScene() {
        this.scene.scene.start('reset', {LevelName:C.LevelName});
    }

    
}