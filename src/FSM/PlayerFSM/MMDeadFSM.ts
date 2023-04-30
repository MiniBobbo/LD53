import { C } from "../../C";
import { MM } from "../../Entities/MM";
import { SceneMessages } from "../../enums/SceneMessages";
import { FSMModule } from "../FSMModule";

export class MMDeadFSM extends FSMModule {
    mm:MM;
    timer:number = 0;
    grabTime:number = 500;
    jumpStrength:number = 600;
    goingUp:boolean;

    moduleStart(args: any): void {
        this.mm = this.parent as MM;
        this.mm.sprite.setVelocity(0,0).setGravity(0,0);
        this.mm.PlayAnimation('dead');
        this.mm.sprite.body.enable = false;

        let timeline = this.mm.scene.add.timeline([
            {
                at:1000,
                run: () => {this.mm.scene.events.emit(SceneMessages.RespawnPlayer);}
            }
        ]);

        timeline.play();

    }

    moduleEnd(args: any): void {
        this.mm.sprite.setVelocity(0,0).setGravity(0,C.GRAVITY);
        this.mm.sprite.body.enable = true;
        this.mm.IsDead = false;

        
    }
    update(dt:number) {

    }
}
