import { forEachLeadingCommentRange } from "typescript";
import { C } from "../C";
import { Cutscene } from "../Cutscenes/Cutscene";
import { EnemyTypes } from "../enums/EnemyTypes";
import { MapObjects } from "../Map/MapObjects";
import { LevelScene } from "../scenes/LevelScene";
import { EntityInstance, LDtkMapPack } from "../Map/LDtkReader";
import { Entity } from "../Entities/Entity";
import { Powerup } from "../Entities/Powerup";
import { Customer } from "../Entities/Customer";
import { Truck } from "../Entities/Truck";

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

        this.CreateBackGround(gs, maps, mo);
        // this.CreatePhysics(gs,maps);

        //Create the background

        return mo;
    }
    static CreateBackGround(gs: LevelScene, maps: LDtkMapPack, mo: MapObjects) {
        let bgtype = maps.level.fieldInstances[4].__value;
        switch (bgtype) {
            case 'Trees':
                let tbg1 = gs.add.tileSprite(0,0, 400,240, 'atlas', 'Bg_Trees_1').setScrollFactor(0,0).setOrigin(0,0);
                let tbg2 = gs.add.tileSprite(0,0, 400,240, 'atlas', 'Bg_Trees_0').setScrollFactor(0,0).setOrigin(0,0);
                gs.Background.add(tbg1);
                gs.Background.add(tbg2);
                gs.events.on('preupdate', () =>{
                    tbg1.tilePositionX = gs.cameras.main.scrollX /3;
                    tbg2.tilePositionX = gs.cameras.main.scrollX /2;
            }, this);

            break;
        }


    }

    static CreateEntities(gs: LevelScene, maps: LDtkMapPack, mo:MapObjects) {
        maps.entityLayers.entityInstances.forEach(element => {
            let worldposition = {x:element.px[0] + maps.worldX, y:element.px[1] + maps.worldY};
            switch (element.__identifier) {
                case 'Customer':
                    let cust = new Customer(gs);
                    cust.sprite.setPosition(worldposition.x, worldposition.y);
                    gs.TotalCustomers++;
                    // mo.mapEntities.push(cust);
                break;
                case 'PlayerStart':
                    let truck = new Truck(gs);
                    truck.sprite.setPosition(worldposition.x, worldposition.y+8);
                    gs.RespawnPoint.set(worldposition.x + 10, worldposition.y+10);
                    gs.Midground.add(truck.sprite);
                    // mo.mapEntities.push(cust);
                break;
                case 'Text':
                        let message = element.fieldInstances[0];
                        let t = gs.add.bitmapText(worldposition.x, worldposition.y, 'pixel', message.__value as string)
                        .setMaxWidth(element.width).setDepth(150).setCenterAlign();
                break;
                case 'Tree':
                        let tree = gs.add.image(worldposition.x, worldposition.y + 13, 'atlas', 'tree')
                        .setOrigin(0,0);
                        gs.Midground.add(tree);
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