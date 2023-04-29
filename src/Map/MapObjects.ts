import { Entity } from "../Entities/Entity";

export class MapObjects {
    mapID:number = 1;
    mapEntities:Array<Entity>;
    mapGameObjects:Array<Phaser.GameObjects.GameObject>;
    mapLights:Array<Phaser.GameObjects.Light>;

    constructor() {
        this.mapEntities = [];
        this.mapGameObjects = [];
        this.mapLights = [];
    }

    Destroy() {
        this.mapEntities.forEach(element => {
            element.dispose();
        });
        this.mapGameObjects.forEach(element => {
            element.destroy();
        });
        this.mapLights.forEach(element => {
            // element.();
        });
    }
}