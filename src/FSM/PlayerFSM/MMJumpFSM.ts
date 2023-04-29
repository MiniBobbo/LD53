import { C } from "../../C";
import { FacingEnum } from "../../Entities/Entity";
import { MM } from "../../Entities/MM"
import { EntityMessages } from "../../enums/EntityMessages";
import { PowerTypes } from "../../enums/PowerTypes";
import { IHVI } from "../../IH/IH";
import { FSMModule } from "../FSMModule"

export class MMJumpFSM extends FSMModule {
    mm:MM;
    timer:number = 0;
    jumpTime:number = C.JUMP_TIME;
    goingUp:boolean;

    moduleStart(args: any): void {
        this.mm = this.parent as MM;
        this.timer = 0;
        this.goingUp = true;
    }

    update(dt:number) {
        let input = this.mm.ih;
        this.mm.sprite.setAcceleration(0,0);
        this.mm.sprite.setDragX(1000);
        this.mm.sprite.setMaxVelocity(C.MOVE_SPEED,C.JUMP_STRENGTH);
        this.mm.sprite.setGravityY(0);


        let speed = 1000;
        let xdir = 0;
        let ydir = 0;
        if(input.IsPressed(IHVI.Left)) {
            xdir -=1;
        }
        if(input.IsPressed(IHVI.Right)) {
            xdir +=1;
        }

        if(!this.mm.attacking) {
            if(xdir > 0)
                this.mm.Facing = FacingEnum.Right;
            if(xdir < 0)
                this.mm.Facing = FacingEnum.Left;
        }

        if(input.IsPressed(IHVI.Jump) && !this.mm.sprite.body.blocked.up && this.timer < this.jumpTime) {
            this.timer += dt;
            this.mm.sprite.setVelocityY(-C.JUMP_STRENGTH);
        } else {
            this.fsm.changeModule('fall');
            return;
        }

        this.mm.sprite.setAcceleration(speed * xdir, speed * ydir);

    }
}