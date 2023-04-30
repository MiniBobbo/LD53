import Phaser from "phaser";
import MergedInput, { Player } from "phaser3-merged-input";
import { C } from "../C";
import { LevelScene } from "./LevelScene";
import { IH, IHVI } from "../IH/IH";
import { LevelIcons } from "../MenuStuff/LevelIcons";
import { SceneMessages } from "../enums/SceneMessages";
import { GameData } from "../GameData";
import { LdtkReader } from "../Map/LDtkReader";
import { LevelData } from "../Models/LevelData";

export class MainMenuScene extends Phaser.Scene {
    Title:Phaser.GameObjects.Text;
    EraseButton:Phaser.GameObjects.Container;
    ih:IH;
    Icon:Phaser.GameObjects.Image;

    Levels:LevelIcons[];
    LevelSelected:LevelIcons;
    LevelSelectedIndex:number = 0;
    FirstTime = true;
    Selecting:boolean = false;

    create() {
        if(this.FirstTime)
            this.Init();
        this.scene.remove('level');
        let ts = this.add.tileSprite(0,0,400,240,'atlas', 'skybg_0').setOrigin(0,0);
        let road = this.add.tileSprite(0,200,400,40,'atlas', 'Road').setOrigin(0,0);
        let truck = this.add.sprite(85, 170, 'atlas', '').play('truck_drive');
        this.events.on('update', ()=>{ts.tilePositionX -= 1;  road.tilePositionX += 5;}, this);
        // this.add.image(0,0,'atlas', 'MainBG').setOrigin(0,0);
        this.add.image(0,0, 'atlas', 'pizzalogo').setOrigin(0,0);


        // this.add.nineslice(20,20, 'box', null, 100,100,10,10,10,10).setOrigin(0,0);
        this.Icon = this.add.image(-20,-20, 'atlas', 'icons_2');

        this.Levels = [];

        this.ih = new IH(this);
        this.cameras.main.setBackgroundColor(0x444444);
        // this.cameras.main.setBackgroundColor(0xff00ff);

        // this.StartButton = this.CreateButton('Start Game', this.StartGame).setPosition(30,50);
        this.EraseButton = this.CreateButton('Clear\nSaved Data', this.EraseSaves).setPosition(5,220);


        this.CreateLevels();
        

        //Select the first icon
        this.SelectLevel(0);
        this.Selecting = false;


    }
    CreateLevels() {
        this.Levels.forEach(l=>l.Destroy());
        let gd = C.gd;
        let count = 0;
        let hright
        gd.Levels.forEach(element => {
            let li = new LevelIcons(this);
            li.SetData(element.LevelName, element.LevelID, element.Complete, element.Tip);
            li.SetPosition(240, 5 + 30*count);
            this.Levels.push(li);
            count++;
        });
    }

    Init() {
        C.gd = JSON.parse(localStorage.getItem(C.GAME_NAME));
        let gd = C.gd;
        if(C.gd == null)
            this.CreateGameData();
        this.FirstTime = false;
        this.events.on(SceneMessages.LevelSelected, this.StartGame, this);

    }

    SelectLevel(index:number) {
        if(index >= this.Levels.length) {
            index = 0;
        } else if (index < 0) {
            index = this.Levels.length -1;
        }
        this.LevelSelectedIndex = index;

        this.LevelSelected = this.Levels.at(index) as LevelIcons;
        this.Icon.setPosition(this.LevelSelected.IconLocation.x,this.LevelSelected.IconLocation.y );

    }


    StartGame() {
        this.Selecting = true;
        this.cameras.main.fadeOut(1000, 0,0,0);
        this.scene.add('level', LevelScene, false);
        this.cameras.main.once('camerafadeoutcomplete', () =>{ 
            C.LevelName = this.LevelSelected.LevelID;
            this.scene.start('level', {LevelName:this.LevelSelected.LevelID});
            // this.scene.start('level', {LevelName:'Level_0'});
            // this.scene.start('level', 'test');
        })
    }

    EraseSaves(p:Phaser.Input.Pointer, localx:number, localy:number, event:Phaser.Types.Input.EventData) {
        this.CreateGameData();
        this.CreateLevels();
        // localStorage.setItem(C.GAME_NAME, JSON.stringify(C.gd));
    }

    update(time:number, dt:number) {
        this.ih.update();

        if(this.ih.IsJustPressed(IHVI.Down))    
            this.SelectLevel(this.LevelSelectedIndex + 1);
        if(this.ih.IsJustPressed(IHVI.Up))    
            this.SelectLevel(this.LevelSelectedIndex - 1);
        if(this.ih.IsJustPressed(IHVI.Jump) && !this.Selecting) {
            this.StartGame();
        }

    }

    CreateButton(text:string, callback:any):Phaser.GameObjects.Container {
        let c = this.add.container();
        let t = this.add.bitmapText(0,0,'pixel', text).setInteractive().setCenterAlign().setTint(0xff0000);
        t.on('pointerdown', callback, this);
        c.add(t);
        return c;
    }

    CreateGameData() {
        let gd = new GameData();

        let reader = new LdtkReader(this,this.cache.json.get(C.LDTK_NAME));
        reader.ldtk.levels.forEach(element => {
            let ld = new LevelData();
            ld.LevelID = element.identifier;
            ld.LevelName = element.fieldInstances[3].__value;
            if(ld.LevelName == null)
                ld.LevelName = ld.LevelID;
            ld.Complete = false;
            ld.Tip = 0;
            gd.Levels.push(ld);
        }); 

        localStorage.setItem(C.GAME_NAME, JSON.stringify(gd));
        C.gd = gd;




    }
}