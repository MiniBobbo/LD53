import { FacingEnum } from "../Entities/Entity";
import { EntityInstance } from "../Map/LDtkReader";
import { EffectTypes } from "../enums/EffectTypes";
import { LevelScene } from "../scenes/LevelScene";
import { Cutscene, CutscenePart } from "./Cutscene"

export class GoblinNinjaCutscene extends Cutscene {


    constructor(name:string, gs:LevelScene, instance:EntityInstance) {
        super(name, gs, instance);
        this.parts.push(new Step1(this, 3000));
        this.parts.push(new Step2(this, 2000));
        
    }

    Start(): void {
        super.Start();
        // this.gs.ih.JustAccept = true;
        this.gs.mm.sprite.setVelocityX(0);
        this.gs.mm.sprite.setAccelerationX(0);

        this.gs.mm.fsm.changeModule('nothing');
        
    }
    End(): void {
        super.End();
        this.gs.mm.fsm.changeModule('move');
        // this.gs.ih.JustAccept = false;

        
    }
}

class Step1 extends CutscenePart {
    
    Start() {
        let gs:LevelScene = this.cs.gs;
        gs.mm.sprite.flipX = false;
        gs.mm.Facing = FacingEnum.Right;


    }

    Update(dt: number): void {
        super.Update(dt);
        let gs:LevelScene = this.cs.gs;
        gs.mm.sprite.setAccelerationX(0);
        gs.mm.sprite.setVelocityX(0);

        if(gs.mm.sprite.body.blocked.down) {
            gs.mm.Land();
            gs.mm.PlayAnimation('stand');
        }
    }

}
class Step2 extends CutscenePart {
    
    Start() {
        let gs:LevelScene = this.cs.gs;
        gs.mm.PlayAnimation('surprise');
        // gs.events.emit('effect', {x:160, y:684, right:true}, EffectTypes.Poof);
        // let e = new GoblinNinja(gs);
        // e.sprite.setPosition(160, 684);
        // gs.CurrentMapObjects.mapEntities.push(e);


    }


    End(): void {
        
    }
}