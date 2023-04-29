import { SceneMessages } from "../enums/SceneMessages";

export class LevelIcons {
    scene:Phaser.Scene;
    LevelName:string;
    Tip:number = 0;
    Complete:boolean = false;

    //Graphics stuff
    c:Phaser.GameObjects.Container;
    t:Phaser.GameObjects.Text;
    IconLocation:Phaser.Math.Vector2;


    constructor(scene:Phaser.Scene) {
        this.scene = scene;
        this.c = scene.add.container(0,0).setSize(40,40);
        this.t = scene.add.text(0,0,'test');
        this.c.add(this.t);

        this.IconLocation = new Phaser.Math.Vector2();

        this.scene.events.on(SceneMessages.EnableButttons, this.EnableButtonClick, this);
        this.scene.events.on(SceneMessages.DisableButttons, this.DisableButtonClick, this);
    }
    DisableButtonClick(DisableButttons: SceneMessages, DisableButtonClick: any, arg2: this) {
        this.c.removeListener('pointerdown', this.Clicked, this);
    }
    EnableButtonClick(EnableButttons: SceneMessages, EnableButtonClick: any, arg2: this) {
        this.c.on('pointerdown', this.Clicked, this);
    }

    SetPosition(x:number, y:number) {
        this.c.setPosition(x,y);
        this.IconLocation.set(x - 14, y + 6);
    }
    

    Clicked() {
        this.scene.events.emit(SceneMessages.LevelSelected, this.LevelName);
    }

    SetData(name:string, complete:boolean, tip:number) {
        this.LevelName = name;
        this.Complete = complete;
        this.Tip = tip;
        this.t.setText(`${this.LevelName}\n$${this.Tip}`);
        if(complete)
            this.t.setTint(0xff00ff);
    }
}