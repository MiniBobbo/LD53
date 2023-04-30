export class WinScreen {
    c:Phaser.GameObjects.Container;
    scene:Phaser.Scene;

    constructor(scene:Phaser.Scene) {
        this.scene = scene;
        this.c = scene.add.container(0,0).setScrollFactor(0,0);
        scene.cameras.main.fadeOut(2000, 0,0,0,(can:any, progress:number) =>{ if(progress == 1) this.EndScene()}, this);
        let t = scene.add.text(100,100, 'Complete');
        let p = scene.add.image(200,120, 'pizza').setScale(.1,.1);
        scene.events.on('preupdate', ()=>{p.angle += 5}, this);
        scene.tweens.add({
            targets:p, 
            scaleX:1,
            scaleY:1,
            duration:1000
        });
        this.c.add(p);
    }

    EndScene() {
        this.scene.scene.start('menu');
    }

    
}