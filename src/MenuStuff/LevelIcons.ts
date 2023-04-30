import { SceneMessages } from "../enums/SceneMessages";

export class LevelIcons {
    scene:Phaser.Scene;
    LevelName:string;
    LevelID:string;
    Tip:number = 0;
    Complete:boolean = false;

    //Graphics stuff
    c:Phaser.GameObjects.Container;
    t:Phaser.GameObjects.BitmapText;
    tip:Phaser.GameObjects.BitmapText;
    IconLocation:Phaser.Math.Vector2;
    o:Phaser.GameObjects.NineSlice;

    private width:number = 140;
    private height:number = 26;


    constructor(scene:Phaser.Scene) {
        this.scene = scene;
        this.c = scene.add.container(0,0).setSize(40,40);
        this.t = scene.add.bitmapText(5,3,'pixel','test').setMaxWidth(88);
        this.tip = scene.add.bitmapText(94,5,'pixel','$0').setScale(1.5);
        this.o = scene.add.nineslice(0,0,'atlas', 'outsidebar', this.width, this.height, 4,4, 4,5).setOrigin(0,0);
        this.c.add(this.o);
        this.c.add(this.t);
        this.c.add(this.tip);

        this.IconLocation = new Phaser.Math.Vector2();

        this.scene.events.on(SceneMessages.EnableButttons, this.EnableButtonClick, this);
        this.scene.events.on(SceneMessages.DisableButttons, this.DisableButtonClick, this);
    }
    DisableButtonClick() {
        this.c.removeListener('pointerdown', this.Clicked, this);
    }
    EnableButtonClick() {
        this.c.on('pointerdown', this.Clicked, this);
    }

    SetPosition(x:number, y:number) {
        this.c.setPosition(x,y);
        this.IconLocation.set(x - 14, y + 10);
    }
    

    Clicked() {
        this.scene.events.emit(SceneMessages.LevelSelected, this.LevelName);
    }

    SetData(name:string, ID:string, complete:boolean, tip:number) {
        this.LevelName = name;
        this.Complete = complete;
        this.LevelID = ID;
        this.Tip = tip;
        this.t.setText(`${this.LevelName}`);
        this.tip.setText(`$${this.Tip}`);
        if(this.Complete)
            this.t.setTint(0x00ffff);
        if(complete)
            this.t.setTint(0xffff00);
    }

    Destroy() {
        this.t.destroy();
        this.o.destroy();
        this.c.destroy();
        this.DisableButtonClick();
        this.scene.events.removeListener(SceneMessages.EnableButttons, this.EnableButtonClick, this);
        this.scene.events.removeListener(SceneMessages.DisableButttons, this.DisableButtonClick, this);

    }
}