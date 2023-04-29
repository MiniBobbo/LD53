import { throws } from "assert";
import { C } from "../C";
import { AttackMessages } from "../enums/AttackMessages";
import { AttackTypes } from "../enums/AttackTypes";
import { DamageTypes } from "../enums/DamageTypes";
import { EffectTypes } from "../enums/EffectTypes";
import { EntityMessages } from "../enums/EntityMessages";
import { LevelScene } from "../scenes/LevelScene";
import { AI } from "./playerattacks/AI";

export class BaseAttack {
    scene:LevelScene;
    sprite:Phaser.Physics.Arcade.Sprite;
    active:boolean;
    AttackGroup:AI[];

    constructor(scene:LevelScene) {
        this.scene = scene;
        this.AttackGroup = [];
    }
    
    LaunchAttack(origin:{x:number, y:number, right:boolean}, type:AttackTypes) {
        let a = this.AttackGroup.find(e=>!e.alive);  
        if(a == undefined) {
            a = new AI(this.scene);
            this.AttackGroup.push(a);
            this.scene.CollideEnemy.add(a.s);
            this.scene.Midground.add(a.s);
            a.s.setData('ai', a).setPipeline('Light2D');
        }
        a.s.angle = 0;
        a.s.setAngularVelocity(0);
        a.damage = 2;
        a.lifetime = 5000;
        a.FirstFrame = true;
        this.scene.CollideMap.add(a.s);
        a.s.setGravityY(C.GRAVITY);
        switch (type) {
            case AttackTypes.Default:
                a.alive = true;
                a.damage = 1;
                a.lifetime = 10000;
                a.s.setCircle(4)
                .setFrame('axe_0')
                .setOffset(.5,.5)
                .enableBody(true, origin.x, origin.y, true,true)
                .on(AttackMessages.COLLIDE_WALL, this.CollideWallDefault, this);
                // .setPosition(origin.x, origin.y)

                if(!origin.right) {
                    a.s.body.velocity.x *= -1;
                }
                break;
        }
        
        
    }
    CollideWallDefault(a:AI) {
        //TODO: Add the default graphics options here.
        // this.scene.events.emit('effect', {x:a.s.body.x, y:a.s.body.y, right:true}, EffectTypes.Default);
        a.dead();
    }
}

/**This is the interface that determines what data will be passed to the entities when they are hit by an attack.
 * Change this.
 */
export interface IAttackData {
    damage:number,
    type:DamageTypes
}