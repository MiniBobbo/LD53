import { AttackMessages } from "../enums/AttackMessages";
import { AttackTypes } from "../enums/AttackTypes";
import { EntityMessages } from "../enums/EntityMessages";
import { LevelScene } from "../scenes/LevelScene";
import { AI } from "./playerattacks/AI";
export class EnemyAttack {

scene:LevelScene;
sprite:Phaser.Physics.Arcade.Sprite;
active:boolean;
AttackGroup:AI[];

constructor(scene:LevelScene) {
    this.scene = scene;
    this.AttackGroup = [];
}

LaunchAttack(origin:{x:number, y:number, right:boolean}, type:AttackTypes):AI {
    let a = this.AttackGroup.find(e=>!e.alive);  
    if(a == undefined) {
        a = new AI(this.scene);
        this.AttackGroup.push(a);
        this.scene.CollidePlayer.add(a.s);
        a.s.setData('ai', a);
        this.scene.Midground.add(a.s);
    }
    a.damage = 1;
    a.lifetime = 5000;
    this.scene.CollideMap.add(a.s);
    a.s.setAngularVelocity(0);

    switch (type) {
    }
    
    return a;
    
}
CollideWallDefault(a:AI) {
    if(!a.alive)
        return;
        a.dead();
}
}
