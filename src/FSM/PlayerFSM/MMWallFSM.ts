import { C } from "../../C";
import { FacingEnum } from "../../Entities/Entity";
import { MM } from "../../Entities/MM";
import { EntityMessages } from "../../enums/EntityMessages";
import { IHVI } from "../../IH/IH";
import { FSM, IFSM } from "../FSM";
import { FSMModule } from "../FSMModule";

export class MMWallFSM extends FSMModule {
    mm:MM;
    constructor(parent:IFSM,fsm:FSM) {
        super(parent,fsm);
        this.mm = this.parent as MM;
    }

    moduleStart(args: any): void {
        this.mm.sprite.setGravityY(C.GRAVITY);
        this.mm.sprite.setMaxVelocity(C.MOVE_SPEED,C.WALL_DOWNSPEED);
        
    }

    moduleEnd(args: any): void {
        this.mm.sprite.setGravityY(C.GRAVITY);
        this.mm.sprite.setMaxVelocity(C.MOVE_SPEED,C.JUMP_STRENGTH);
        
    }

    update(dt: number): void {
        
        let input = this.mm.ih;
        this.mm.sprite.setAcceleration(0,0);
        this.mm.sprite.setDragX(C.DRAG);
        let xdir = 0;
        let ydir = 0;
        if(input.IsPressed(IHVI.Left)) {
            xdir -=1;
        }
        if(input.IsPressed(IHVI.Right)) {
            xdir +=1;
        }

        //This facing looks reversed from normal because when we are pressed against the wall we actually want to face away from it
        //so the attacking, dashing, jumping, etc goes in the correct direction.
        if(xdir > 0)
            this.mm.Facing = FacingEnum.Right;
        if(xdir < 0)
            this.mm.Facing = FacingEnum.Left;


        this.mm.sprite.setAcceleration(C.MOVE_ACCEL * xdir + this.mm.ExternalAcceleration.x, C.MOVE_ACCEL * ydir + this.mm.ExternalAcceleration.y);
        if(this.mm.sprite.body.blocked.down) {
            this.fsm.changeModule('move');  
            return;
        } else if(!(this.mm.sprite.body.blocked.left || this.mm.sprite.body.blocked.right)) {
            this.fsm.changeModule('fall');
        }
        

    }
}