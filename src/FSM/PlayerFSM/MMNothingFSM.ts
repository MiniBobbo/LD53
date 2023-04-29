import { C } from "../../C";
import { MM } from "../../Entities/MM";
import { FSMModule } from "../FSMModule";

export class MMNothingFSM extends FSMModule {
    mm:MM;
    timer:number = 0;
    grabTime:number = 500;
    jumpStrength:number = 600;
    goingUp:boolean;

    moduleStart(args: any): void {
        this.mm = this.parent as MM;
        if(args != null && args as boolean)
            this.timer = 0;
        else this.timer = this.grabTime+100;
    }

    update(dt:number) {
        // this.mm.PlayAnimation('jumpdown',true);

        this.timer += dt;
        let input = this.mm.ih;
        this.mm.sprite.setAcceleration(0,0);
        this.mm.sprite.setDragX(C.DRAG);
        this.mm.sprite.setMaxVelocity(C.MOVE_SPEED,C.JUMP_STRENGTH);
        this.mm.sprite.setGravityY(C.GRAVITY * C.GRAVITY_MULT);

        let speed = 1000;
        let xdir = 0;
        let ydir = 0;


        if(this.mm.sprite.body.blocked.down) {
            this.mm.Land();
            // this.fsm.changeModule('move');  
            return;
        }

    }
}
