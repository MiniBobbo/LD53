import { GameData } from "./GameData";

export class C {
    static GAME_NAME = 'ParkourPizza';
    static gd:GameData;

    static LevelName = 'Getting Started';

    static LDTK_NAME = 'startsmall';

    //Game Default Values
    static GRAVITY:number = 400;
    static WALL_DOWNSPEED:number = 150;
    static DRAG:number = 1000;
    static JUMP_STRENGTH:number = 150;
    static Wall_JUMP_STRENGTH_X:number = 120;
    static JUMP_TIME:number = 150;
    static WALL_JUMP_TIME:number = 150;
    static WALL_JUMP_TIME_MIN:number = 100;
    static GRAVITY_MULT = 2;
    static MOVE_SPEED:number = 120;
    static MOVE_ACCEL:number = 800;

    static PIZZA_HEAT_TIME:number = 120000;

    //Default Player Values

    static SaveGame() {
        localStorage.setItem(C.GAME_NAME, JSON.stringify(C.gd));  
    }

}