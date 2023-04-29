import { AttackMessages } from "../../enums/AttackMessages";
import { AttackTypes } from "../../enums/AttackTypes";
import { DamageTypes } from "../../enums/DamageTypes";
import { LevelScene } from "../../scenes/LevelScene";

export class AI {
    s:Phaser.Physics.Arcade.Sprite;
    lifetime:number = 5000;
    ls:LevelScene;
    alive:boolean = false;
    d:DamageTypes = DamageTypes.NORMAL;
    damage:number = 2;
    type:AttackTypes = AttackTypes.Default;
    FirstFrame:boolean = true;
    lastAnim!:string;

    constructor(scene:LevelScene) {
        this.ls = scene;
        this.ls.events.on('preupdate', this.update, this);    
        this.s = scene.physics.add.sprite(-100,-100, 'atlas');
        
    }

    update(time:number, dt:number) {
        this.lifetime -= dt;
        if(this.lifetime <= 0 && !this.FirstFrame)
            this.dead();
        this.FirstFrame = false;
        if(this.s.active && (this.s.body.blocked.right || this.s.body.blocked.left || this.s.body.blocked.down || this.s.body.blocked.up))
            this.s.emit(AttackMessages.COLLIDE_WALL, this);
        if(!Phaser.Geom.Rectangle.Overlaps(this.ls.physics.world.bounds, this.s.getBounds()))
            this.dead();
    }

    dead() {
        this.s.disableBody(true,true);
        this.s.body.blocked.none = true;
        this.alive = false;
    }
    
    PlayAnimation(anim:string, ignoreIfPlaying:boolean = true) {
        let combinedAnim = `${this.s.name}_${anim}`;
        if(ignoreIfPlaying && combinedAnim == this.lastAnim)
            return;
        this.s.anims.play(combinedAnim, ignoreIfPlaying);
        this.s.setOffset(this.s.width/2 - this.s.body.width/2, this.s.height/2- this.s.body.height/2);
        this.lastAnim = combinedAnim;
    }

    
}