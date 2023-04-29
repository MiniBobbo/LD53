import { C } from "../../C";
import { FacingEnum } from "../../Entities/Entity";
import { MM } from "../../Entities/MM"
import { PowerTypes } from "../../enums/PowerTypes";
import { IHVI } from "../../IH/IH";
import { FSMModule } from "../FSMModule"

export class MMGroundFSM extends FSMModule {
    mm:MM;
    LockedToGround:boolean = false;
    moduleStart(args: any): void {
        this.mm = this.parent as MM;
        this.mm.sprite.on('animationupdate', this.AnimationUpdate, this);
        // this.mm.scene.events.on('mergedInput', this.CheckInput, this);
        this.LockedToGround = true;
        this.mm.sprite.setGravityY(C.GRAVITY * C.GRAVITY_MULT);
        // this.mm.scene.CollideMap.remove(this.mm.sprite);
    }


    /**This is where we have any animation specific actions we want to take, like footsteps on certain frames. */
    AnimationUpdate(animation:Phaser.Animations.Animation, frame:Phaser.Animations.AnimationFrame, go:Phaser.GameObjects.GameObject, framekey:string) {

    }

    moduleEnd(args: any): void {
        // this.mm.scene.events.removeListener('mergedInput', this.CheckInput, this);
        this.mm.sprite.removeListener('animationupdate', this.AnimationUpdate, this);
        // this.mm.scene.CollideMap.add(this.mm.sprite);
    }

    // CheckInput(i:{ device:string, value:number, player:number, action:string, state:string }) {
    //     if(i.state = 'DOWN') {
    //         console.log(`Pressed`);
    //     }
    // }

    update(dt:number) {
        let input = this.mm.ih;
        // this.mm.sprite.setAcceleration(0,0);
        this.mm.sprite.setAcceleration(this.mm.ExternalAcceleration.x,this.mm.ExternalAcceleration.y);
        this.mm.sprite.setDragX(1000);
        this.mm.sprite.setMaxVelocity(C.MOVE_SPEED,600);
        // this.mm.sprite.setGravityY(C.GRAVITY);
        //Check below the center of the player to see what tile we are on.  
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


        if(Math.abs(this.mm.sprite.body.velocity.y) > 30) {
            this.fsm.changeModule('fall')
            return;
        }
        if(input.IsJustPressed(IHVI.Jump)) {
            this.parent.changeFSM('jump');
            this.mm.PlayAnimation('jump');
            return;
        }
        
        // if(input.IsJustPressed(IHVI.Fire)) {
        //     if(C.checkFlag(PowerTypes.Default))
        //         this.fsm.changeModule('attack');
        //     return;
        // }

        this.mm.sprite.setAcceleration(C.MOVE_ACCEL * xdir, C.MOVE_ACCEL * ydir);

        if(xdir != 0)
            this.mm.PlayAnimation('run'); 
        else
            this.mm.PlayAnimation('stand'); 

    }
}
