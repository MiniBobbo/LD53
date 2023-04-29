import Phaser from "phaser";
import MergedInput, { Player } from "phaser3-merged-input";
import { C } from "../C";
import { LevelScene } from "./LevelScene";
import { IH } from "../IH/IH";

export class MainMenuScene extends Phaser.Scene {
    Title:Phaser.GameObjects.Text;
    StartButton:Phaser.GameObjects.Container;
    EraseButton:Phaser.GameObjects.Container;
    ih:IH;

    create() {
        if(C.gd == null) {
            C.gd = JSON.parse(localStorage.getItem(C.GAME_NAME));

        }
        this.ih = new IH(this);
        this.cameras.main.setBackgroundColor(0x444444);
        // this.cameras.main.setBackgroundColor(0xff00ff);

        this.Title = this.add.text(120,30, 'GAME TITLE').setFontSize(16).setWordWrapWidth(240).setOrigin(.5,0);

        this.StartButton = this.CreateButton('Start Game', this.StartGame).setPosition(30,50);
        this.EraseButton = this.CreateButton('Erase Saved Data', this.EraseSaves).setPosition(200,200);

        this.add.nineslice(20,20, 'box', null, 100,100,10,10,10,10).setOrigin(0,0);

    }

    StartGame(p:Phaser.Input.Pointer, localx:number, localy:number, event:Phaser.Types.Input.EventData) {
        console.log('Start Button pressed');
        this.input.removeAllListeners();
        this.cameras.main.fadeOut(1000, 0,0,0);
        this.scene.add('level', LevelScene, false);
        this.cameras.main.once('camerafadeoutcomplete', () =>{ 
            this.scene.start('level', {levelName:'levels'});
            // this.scene.start('level', 'test');
        })
    }

    EraseSaves(p:Phaser.Input.Pointer, localx:number, localy:number, event:Phaser.Types.Input.EventData) {
        console.log('Erase Saved Data Button Pressed');
        localStorage.setItem(C.GAME_NAME, JSON.stringify(C.gd));
    }

    update(time:number, dt:number) {
        this.ih.update();
    }

    CreateButton(text:string, callback:any):Phaser.GameObjects.Container {
        let c = this.add.container();
        let t = this.add.text(0,0,text).setInteractive();
        t.on('pointerdown', callback, this);
        c.add(t);
        return c;
    }
}