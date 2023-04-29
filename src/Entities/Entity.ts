import { AI } from "../attacks/playerattacks/AI";
import { C } from "../C";
import { AttackTypes } from "../enums/AttackTypes";
import { DamageTypes } from "../enums/DamageTypes";
import { EntityMessages } from "../enums/EntityMessages";
import { FSM } from "../FSM/FSM";
import { IH } from "../IH/IH";
import { LevelScene } from "../scenes/LevelScene";

export class Entity {
    sprite:Phaser.Physics.Arcade.Sprite;
    scene:LevelScene;
    lastAnim!:string;
    fsm:FSM;
    hp:number = 2;
    maxhp:number = 2;
    gs:LevelScene;
    flashing:boolean = false;
    flashingRemaining:number = 0;
    ExternalAcceleration:Phaser.Math.Vector2;
    ExternalAccelerationApplied:boolean;
    Facing:FacingEnum= FacingEnum.Right;

    LandTween:Phaser.Tweens.Tween;


    constructor(scene:LevelScene) {
        this.scene = this.gs = scene;
        this.ExternalAcceleration = new Phaser.Math.Vector2(0,0);
        this.sprite = scene.physics.add.sprite(0,0, 'atlas')
        this.sprite.setSize(12,12);
        this.scene = scene;
        this.sprite.name = '';
        this.sprite.setData(this);
        this.sprite.setDepth(50);
        scene.Midground.add(this.sprite);
        this.fsm = new FSM(this);

        this.sprite.setPipeline('Light2D');
        

        this.sprite.on(EntityMessages.TAKE_DAMAGE, this.Damage, this);
        this.sprite.on('stun', this.Stun, this);
        this.sprite.on('dead', this.Dead, this);
        this.sprite.on(EntityMessages.HIT_BY_ATTACK, this.HitByAttack, this);
        this.sprite.on(EntityMessages.ACCELERATE, this.AddExternalAcceleration, this);

        // this.scene.events.on('update',this.Update, this)
        this.scene.events.on('travel',() => {this.fsm.clearModule();}, this);
        this.scene.events.on('preupdate', this.Update, this);

        this.scene.physics.world.on('pause', this.Pause, this);
        this.scene.physics.world.on('resume', this.Resume, this);

        this.LandTween = this.scene.tweens.add({
            targets:[this.sprite],
            persist:true,
            scaleX:1, 
            scaleY:1,
            paused:true,
            duration:100
        })
    }

    public static _initialize() {
        // this.CreateAnims();
    }
    Resume() {
        this.fsm.paused = false;
        if(this.sprite.anims != undefined)
            this.sprite.anims.resume();
    }
    Pause() {
        this.fsm.paused = true;
        if(this.sprite.anims != undefined)
        this.sprite.anims.pause();
    }

    dispose() {
        this.sprite.removeListener(EntityMessages.ACCELERATE, this.AddExternalAcceleration, this);
        this.scene.events.removeListener('preupdate',this.Update, this);
        this.scene.events.removeListener('travel',() => {this.fsm.clearModule();}, this);
        this.sprite.destroy();
    }

    Update(time:number, dt:number) {
        if(!this.scene.LevelTransition)
            this.fsm.update(time, dt);
        if(!this.ExternalAccelerationApplied) {
            this.ExternalAcceleration.set(0,0);
        }
        this.ExternalAccelerationApplied = false;

        if(this.flashing) {
            if(this.sprite.alpha == 1)
                this.sprite.alpha = 0;
            else
                this.sprite.alpha = 1;
            this.flashingRemaining -= dt;
            if(this.flashingRemaining <= 0) {
                this.flashing = false;
                this.sprite.alpha = 1;
            }
        }
    }

    changeFSM(nextFSM:string) {
        this.fsm.changeModule(nextFSM);
    }

    Stun(args:{stunTime:number, returnFSM:string, stunDir?:{x:number, y:number}}) {
        this.fsm.changeModule('stun', args);
    }

    HitByAttack(a:AI) {
        a.dead();
        this.sprite.emit(EntityMessages.TAKE_DAMAGE, {damage:a.damage, type:a.type});
    }

    PlayAnimation(anim:string, ignoreIfPlaying:boolean = true) {
        let combinedAnim = `${this.sprite.name}_${anim}`;
        if(ignoreIfPlaying && combinedAnim == this.lastAnim)
            return;
        this.sprite.anims.play(combinedAnim, ignoreIfPlaying);
        this.sprite.setOffset(this.sprite.width/2 - this.sprite.body.width/2, this.sprite.height/2- this.sprite.body.height/2);
        this.lastAnim = combinedAnim;
    }

    Damage(damage:number, type:AttackTypes): void {
        if(this.flashing)
            return;
        this.Flash(C.LONG_FLASH);
        this.hp -= damage;
        this.hp = Phaser.Math.Clamp(this.hp, 0, this.maxhp);
        this.sprite.emit(EntityMessages.CHANGE_HP, this.hp, this.maxhp);
        if(this.hp == 0) {
            this.sprite.emit('dead');
        }
    }

    Dead() {
        this.sprite.body.enable = false;
        this.sprite.setVisible(false);
        this.fsm.changeModule('nothing');
    }

    Flash(length:number = 1000) {
        this.flashing = true;
        this.flashingRemaining = length;
    }

    AddExternalAcceleration(x:number = 0, y:number = 0) {
        this.ExternalAcceleration.x += x;
        this.ExternalAcceleration.y += y;
        this.ExternalAccelerationApplied = true;
    }

    /**Stretch and/or squash this sprite.  The x and y parameters are what to set the tween to and
     * duration is how long it should take to set them back to one.
     */
    Land() {
        // this.sprite.scaleX = 1.3;
        // this.sprite.scaleY = .5;
        // this.LandTween.restart();
    }

    SetFacing(facing:FacingEnum) {
        this.Facing = facing;
        this.sprite.flipX = this.Facing == FacingEnum.Left;
    }

    /**Each Entity has a static reference that creates all the animations for the entity.  It should be called automatically. */
    static CreateAnims(scene:Phaser.Scene) {
        
    }
}

export enum FacingEnum {
    Right = 1,
    Left = 2, 
    None = 3
}