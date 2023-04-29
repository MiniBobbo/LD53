import { C } from "../../C";
import { FacingEnum } from "../../Entities/Entity";
import { MM } from "../../Entities/MM"
import { EntityMessages } from "../../enums/EntityMessages";
import { PowerTypes } from "../../enums/PowerTypes";
import { IHVI } from "../../IH/IH";
import { FSMModule } from "../FSMModule"

export class MMFallFSM extends FSMModule {
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
        this.mm.PlayAnimation('jumpdown',true);

        this.timer += dt;
        let input = this.mm.ih;
        this.mm.sprite.setAcceleration(0,0);
        this.mm.sprite.setDragX(C.DRAG);
        this.mm.sprite.setMaxVelocity(C.MOVE_SPEED,C.JUMP_STRENGTH);
        this.mm.sprite.setGravityY(C.GRAVITY * C.GRAVITY_MULT);

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


        this.mm.sprite.setAcceleration(C.MOVE_ACCEL * xdir + this.mm.ExternalAcceleration.x, C.MOVE_ACCEL * ydir + this.mm.ExternalAcceleration.y);
        if(this.mm.sprite.body.blocked.down) {
            this.mm.Land();
            this.fsm.changeModule('move');  
            return;
        }
        if(this.mm.sprite.body.blocked.left) {
            this.mm.PlayAnimation('wall');
            this.mm.Facing = FacingEnum.Right;
            if(input.IsJustPressed(IHVI.Jump))
                this.WallJump();
            
            return;
        }
        if(this.mm.sprite.body.blocked.right) {
            this.mm.PlayAnimation('wall');
            this.mm.Facing = FacingEnum.Left;
            if(input.IsJustPressed(IHVI.Jump))
                this.WallJump();

            return;
        }

        
    }

    WallJump() {
        this.mm.changeFSM('walljump');
    }
}



