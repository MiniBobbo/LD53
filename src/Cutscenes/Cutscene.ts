import { Enemy } from "../Entities/Enemy";
import { EntityInstance } from "../Map/LDtkReader";
import { EnemyTypes } from "../enums/EnemyTypes";
import { EntityMessages } from "../enums/EntityMessages";
import { LevelScene } from "../scenes/LevelScene";

export class Cutscene extends Enemy{
    parts:CutscenePart[];
    activePart:CutscenePart;
    Name:string;

    constructor(name:string, gs:LevelScene, instance:EntityInstance) {
        super(gs);
        this.Name = name;
        this.scene = gs;
        this.parts = [];

        this.sprite.setSize(instance.width,instance.height-2);
        this.sprite.width = instance.width;
        this.sprite.height = instance.height-2;
        this.sprite.setName('Cutscene');
        this.sprite.setGravityY(0);
        // this.sprite.setOrigin(0,0);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setVisible(false);

    }

    OverlapPlayer() {
        this.sprite.destroy();
        console.log(`Overlapped Cutscene: ${this.Name}`);
        this.Start();
    }


    Start() {
        this.Step();

    }

    End() {
    }

    Update(time:number, dt:number) {
        if(this.activePart != null)
            this.activePart.Update(dt);
    }

    Step() {
        if(this.parts.length > 0) {
            if(this.activePart != null) 
                this.activePart.End();
            this.activePart = this.parts.shift();
            this.activePart.Start();
        } else {
            this.activePart = null;
            this.End();
        }
    }
}

export class CutscenePart {
    cs:any;
    time:number = 1000;
    elapsed:number = 0;
    constructor(cs:Cutscene, time:number) {
        this.cs = cs;
        this.time = time;
    }
    
    Start() {

    }

    End() {

    }

    Update(dt:number) {
        this.elapsed += dt;
        if(this.elapsed >= this.time) {
            this.cs.Step();
        }
    }
}