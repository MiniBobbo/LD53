import { forEachLeadingCommentRange } from "typescript";
import { C } from "../C";
import { Cutscene } from "../Cutscenes/Cutscene";
import { GoblinNinjaCutscene } from "../Cutscenes/GoblinNinjaCutscene";
import { EnemyTypes } from "../enums/EnemyTypes";
import { MapObjects } from "../Map/MapObjects";
import { LevelScene } from "../scenes/LevelScene";
import { EntityInstance, LDtkMapPack } from "../Map/LDtkReader";
import { Entity } from "../Entities/Entity";
import { Powerup } from "../Entities/Powerup";

export class SetupMapHelper {
    static CurrentCollider:Phaser.Physics.Arcade.Collider;


    static SetupMap(gs:LevelScene, maps:LDtkMapPack):MapObjects {
        var mo = new MapObjects();

        // maps.displayLayers.find((l:Phaser.Tilemaps.TilemapLayer) => {
        //     if(l.name == 'Bg')
        //         l.setDepth(0);
        //     if(l.name == 'Mg')
        //         l.setDepth(100);
        //     if(l.name == 'Fg')
        //         l.setDepth(200);
        // });

        maps.collideLayer.setCollision([1,3]);

        gs.lights.enable();

        this.CreateEntities(gs, maps, mo);
        // this.CreatePhysics(gs,maps);

        return mo;
    }
    static CreateEntities(gs: LevelScene, maps: LDtkMapPack, mo:MapObjects) {
        maps.entityLayers.entityInstances.forEach(element => {
            let worldposition = {x:element.px[0] + maps.worldX, y:element.px[1] + maps.worldY};
            switch (element.__identifier) {

                case 'Text':
                        let message = element.fieldInstances[0];
                        let t = gs.add.bitmapText(worldposition.x, worldposition.y, '8px', message.__value as string)
                        .setMaxWidth(element.width).setDepth(150).setCenterAlign();
                        mo.mapGameObjects.push(t);
                break;
                case 'Enemy':
                    let type = element.fieldInstances[0].__value as EnemyTypes;
                    switch (type) {
                        case EnemyTypes.Default:
                            let e = new Entity(gs);
                            e.sprite.setPosition(worldposition.x, worldposition.y);
                            mo.mapEntities.push(e);
                            break;
                        default:
                            break;
                    }
                break;
                default:
                    break;
            }
        });

    }

}