import { AI } from "../attacks/playerattacks/AI";
import { C } from "../C";
import { AttackTypes } from "../enums/AttackTypes";
import { EntityMessages } from "../enums/EntityMessages";
import { MMFallFSM } from "../FSM/PlayerFSM/MMFallFSM";
import { MMGroundFSM } from "../FSM/PlayerFSM/MMGroundFSM";
import { MMJumpFSM } from "../FSM/PlayerFSM/MMJumpFSM";
import { MMNothingFSM } from "../FSM/PlayerFSM/MMNothingFSM";
import { MMWallJumpFSM } from "../FSM/PlayerFSM/MMWallJumpFSM";
import { IH } from "../IH/IH";
import { LevelScene } from "../scenes/LevelScene";
import { Entity, FacingEnum } from "./Entity";

export class MM extends Entity {
    attacking:boolean;
    Stomping:boolean = false;
    ih:IH;

    Light:Phaser.GameObjects.Light;
    LightTween:Phaser.Tweens.Tween;


    
    private attackCooldown:number = 0;
    constructor(scene:LevelScene, ih:IH) {
        super(scene);
        this.sprite.setSize(20,34);
        // this.hp = this.maxhp = 10;
        this.ih = ih;
        this.sprite.setName('player');
        this.PlayAnimation('stand');
        // this.sprite.setGravityY(100);
        this.fsm.addModule('nothing', new MMNothingFSM(this, this.fsm));
        this.fsm.addModule('move', new MMGroundFSM(this, this.fsm));
        this.fsm.addModule('jump', new MMJumpFSM(this, this.fsm));
        this.fsm.addModule('walljump', new MMWallJumpFSM(this, this.fsm));
        this.fsm.addModule('fall', new MMFallFSM(this, this.fsm));
        this.fsm.changeModule('fall');

        this.Facing = FacingEnum.Right;

        this.Light = this.scene.lights.addLight(this.sprite.body.x, this.sprite.body.y, 100, 0xffff55, 0);
        this.Light.intensity
        this.scene.Players.add(this.sprite);

        this.sprite.on(EntityMessages.TRY_ATTACK, this.TryAttack, this);
        this.sprite.setDepth(100);
        // this.scene.events.on('update', this.update, this);

        // if(C.checkFlag('light')) {
        //     this.TurnOnLight();
        // }
    }



    HitByAttack(a:AI): void {
        a.dead();
        this.sprite.emit(EntityMessages.TAKE_DAMAGE, a.damage);
    }

    Damage(damage: number, type:AttackTypes): void {
        if(this.flashing)
            return;
        this.fsm.changeModule('knockback');    
        this.scene.cameras.main.shake(100,.02);    
        super.Damage(damage, type);
        if(this.hp <=0) {
            // this.gs.physics.pause();
            this.gs.events.emit(EntityMessages.PLAYER_DEAD);
        }
    }

    changeFSM(nextFSM:string) {
        // console.log(`Changing to ${nextFSM}`);
        this.fsm.changeModule(nextFSM);
    }


    TryAttack() {
        let o = {x:this.sprite.x, y:this.sprite.y, right:this.Facing == FacingEnum.Right};
        if(this.Facing == FacingEnum.Left)
            o.x -= this.sprite.width/2;
        else
            o.x += this.sprite.width/2;
        
        this.scene.BA.LaunchAttack(o, AttackTypes.Default);

    }

    Update(time:number, dt:number) {
        super.Update(time, dt);
        this.sprite.flipX = this.Facing == FacingEnum.Left;
        if(this.sprite.body != null)
        this.Light.setPosition(this.sprite.body.x, this.sprite.body.y);
        // this.scene.events.emit('debug', `FSM: ${this.fsm.currentModuleName}`);
    }

    GetStandingTile():Phaser.Tilemaps.Tile[] {
        let bc = this.sprite.getBottomCenter();
        let belowtile = this.scene.currentMapPack.GetTileAt(bc.x, bc.y + 3);
        let currentTile = this.scene.currentMapPack.GetTileAt(bc.x, bc.y - 3);

        return [belowtile, currentTile];
    }
    static CreateAnims(scene:Phaser.Scene) {
        scene.anims.create({ key: 'player_stand', frameRate: 60, frames: scene.anims.generateFrameNames('atlas', { prefix: 'player_stand_', end: 0}), repeat: 0});
        scene.anims.create({ key: 'player_run', frameRate: 60, frames: scene.anims.generateFrameNames('atlas', { prefix: 'player_run_', end: 0}), repeat: 0});
        scene.anims.create({ key: 'player_jump', frameRate: 60, frames: scene.anims.generateFrameNames('atlas', { prefix: 'player_jumpup_', end: 0}), repeat: 0});
        scene.anims.create({ key: 'player_jumpdown', frameRate: 60, frames: scene.anims.generateFrameNames('atlas', { prefix: 'player_jumpdown_', end: 0}), repeat: 0});
        scene.anims.create({ key: 'player_wall', frameRate: 60, frames: scene.anims.generateFrameNames('atlas', { prefix: 'player_wall_', end: 0}), repeat: 0});
        scene.anims.create({ key: 'player_walljump', frameRate: 60, frames: scene.anims.generateFrameNames('atlas', { prefix: 'player_walljump_', end: 0}), repeat: 0});
    }

}