import { C } from "../C";
import { LevelScene } from "./LevelScene";

export class ResetScene extends Phaser.Scene {
    create(data:{LevelName:string}) {
        this.scene.remove('level');
        let tl = this.add.timeline(
            {
                in:250,
                run:() =>{
                    this.scene.add('level', LevelScene, false);
                    this.scene.start('level', data);
                }
            }
        );
        tl.play();
    }
}