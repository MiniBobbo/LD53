export class WinScreen {
    c:Phaser.GameObjects.Container;
    scene:Phaser.Scene;

    constructor(scene:Phaser.Scene) {
        this.scene = scene;
        this.c = scene.add.container(0,0).setScrollFactor(0,0);
        scene.cameras.main.fadeOut(2000, 0,0,0,(can:any, progress:number) =>{ this.EndScene()}, this);
        let t = scene.add.text(100,100, 'Complete');
    }

    EndScene() {
        this.scene.scene.start('menu');
    }
}