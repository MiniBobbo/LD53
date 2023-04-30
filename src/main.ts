import * as Phaser from "phaser";
import { Preload } from "./scenes/Preload";
import { C } from "./C";
import { GameData } from "./GameData";
import { MainMenuScene } from "./scenes/MainMenuScene";
import MergedInput from "phaser3-merged-input";
import { LevelScene } from "./scenes/LevelScene";
import { ResetScene } from "./scenes/ResetScene";


class Main extends Phaser.Game {
  constructor() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL,
      width: 400,
      height: 240,
      // width: 480,
      // height: 270,
      zoom:3,
      physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
      },
      render: {
        pixelArt:true,
      },
      input:{
        gamepad:true
      }
    };
    super(config);
    C.gd = new GameData();

    // this.scene.add("boot", Boot, false);
    this.scene.add("preload", Preload, false);
    this.scene.add("menu", MainMenuScene, false);
    this.scene.add('level', LevelScene, false);
    this.scene.add('reset', ResetScene, false);

    // this.scene.add("level", LevelScene, false);
    this.scene.start("preload");
    // C.setFlag('5', true);
    }

}

window.onload = () => {
  const GameApp: Phaser.Game = new Main();
};