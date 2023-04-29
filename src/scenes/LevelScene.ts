import { Scene } from "phaser";
import { BaseAttack } from "../attacks/BaseAttack";
import { EnemyAttack } from "../attacks/EnemyAttacks";
import { AI } from "../attacks/playerattacks/AI";
import { C } from "../C";
import { EffectManager } from "../effects/EffectManager";
import { Entity, FacingEnum } from "../Entities/Entity";
import { MM } from "../Entities/MM";
import { AttackMessages } from "../enums/AttackMessages";
import { EffectTypes } from "../enums/EffectTypes";
import { EntityMessages } from "../enums/EntityMessages";
import { SceneMessages } from "../enums/SceneMessages";
import { LevelTimer } from "../gui/LevelTimer";
import { Tips } from "../gui/Tips";
import { SetupMapHelper } from "../Helpers/SetupMapHelper";
import { IH, IHVI } from "../IH/IH";
import { LDtkMapPack, LdtkReader, Level } from "../Map/LDtkReader";
import { MapObjects } from "../Map/MapObjects";
import { WinScreen } from "../gui/WinScreen";

export class LevelScene extends Phaser.Scene {
    player!:Entity;
    ih:IH;
    mm:MM;
    reader:LdtkReader;
    cam:Phaser.GameObjects.Image;
    CollideMap:Phaser.Physics.Arcade.Group;
    CollidePlayer:Phaser.Physics.Arcade.Group;
    CollideEnemy:Phaser.Physics.Arcade.Group;
    Blocks:Phaser.Physics.Arcade.Group;
    Powerups:Phaser.Physics.Arcade.Group;
    Enemies:Phaser.Physics.Arcade.Group;
    Players:Phaser.Physics.Arcade.Group;
    IntMaps:Phaser.Physics.Arcade.Group;
    CurrentMapObjects:MapObjects;
    NextMapObjects:MapObjects;
    MapObjects:Array<MapObjects>;

    Paused:boolean = false;

    BG:Phaser.GameObjects.TileSprite;

    GuiLayer:Phaser.GameObjects.Layer;
    Foreground:Phaser.GameObjects.Layer;
    Midground:Phaser.GameObjects.Layer;
    Background:Phaser.GameObjects.Layer;
    customEvents:string[] = [];
    currentMap:string;
    currentMapPack:LDtkMapPack;
    private nextMapPack:LDtkMapPack;
    LevelTransition:boolean = false;
    BA:BaseAttack;
    EA:EnemyAttack;
    EM:EffectManager;

    debug:Phaser.GameObjects.Text;

    //Game Specific Stuff
    TotalCustomers:number = 0;
    LevelComplete:boolean = false;
    LevelTimer:number = 0;
    LevelName:string;


    create(data:{LevelName:string}) {
        this.LevelName = this.LevelName;
        this.CollideMap = this.physics.add.group();
        this.CollidePlayer = this.physics.add.group();
        this.CollideEnemy = this.physics.add.group();
        this.Blocks = this.physics.add.group();
        this.Enemies = this.physics.add.group();
        this.Players = this.physics.add.group();
        this.IntMaps = this.physics.add.group();
        this.Powerups = this.physics.add.group();
        this.MapObjects = [];
        //Add layers
        this.GuiLayer = this.add.layer().setDepth(5);
        this.Foreground = this.add.layer().setDepth(4);
        this.Midground = this.add.layer().setDepth(3);
        this.Background = this.add.layer().setDepth(2);

        this.reader = new LdtkReader(this,this.cache.json.get('start'));

        this.cam = this.add.image(0,0,'atlas').setVisible(false);

        this.lights.enable();
        this.lights.setAmbientColor(0xffffff);

        this.ih = new IH(this);

        this.debug = this.add.text(0,0,"").setFontSize(10).setDepth(1000).setScrollFactor(0,0);
        let m:LDtkMapPack;
        if(data.LevelName == null || data.LevelName == '')
            m = this.reader.CreateMap('Level_0', 'tiles');
        else
        m = this.reader.CreateMap(data.LevelName, 'tiles');

        this.currentMap = m.level.identifier;
        m.collideLayer.setCollision([1, 2, 3, 4, 5, 6]);
        this.currentMapPack = m;

        this.currentMapPack.displayLayers.forEach(element => {
            if(element.name == 'Fg')
                this.Foreground.add(element);
            if(element.name == 'Decor')
                this.Background.add(element);
            if(element.name == 'Mg')
                this.Midground.add(element);
            

        });

        m.displayLayers.forEach(element => {
            element.setPipeline('Light2D');
        });

        this.mm = new MM(this, this.ih)
        this.BA = new BaseAttack(this);
        this.EA = new EnemyAttack(this);
        this.EM = new EffectManager(this);

        // C.setFlag(PowerTypes.LIGHT, true);

        let startpos = this.currentMapPack.entityLayers.entityInstances.find(e=>e.__identifier == 'PlayerStart');
        if(startpos === undefined)
            this.mm.sprite.setPosition(100,100);
        else
            this.mm.sprite.setPosition(startpos.px[0] + m.level.worldX+10, startpos.px[1] + m.level.worldY);

        this.CollideMap.add(this.mm.sprite);

        this.physics.world.setBounds(m.worldX,m.worldY,m.width, m.height);

        let by = m.height;
        if(m.height == 140)
            by = 135;
        this.cameras.main.setBounds(m.worldX,m.worldY,m.width, by);
        this.cameras.main.startFollow(this.mm.sprite);

        SetupMapHelper.CreateEntities(this, this.currentMapPack, this.CurrentMapObjects);


        //@ts-ignore
        this.physics.add.overlap(this.CollideEnemy, this.Enemies, (a:Phaser.Physics.Arcade.Sprite, e:Phaser.Physics.Arcade.Sprite)=>{
            e.emit(EntityMessages.HIT_BY_ATTACK, a.getData('ai') as AI);
        });

        //@ts-ignore
        this.physics.add.overlap(this.CollidePlayer, this.Players, (a:Phaser.Physics.Arcade.Sprite, e:Phaser.Physics.Arcade.Sprite)=>{
            e.emit(EntityMessages.HIT_BY_ATTACK, a.getData('ai') as AI);
        });
        //@ts-ignore
        this.physics.add.overlap(this.Enemies, this.Players, (a:Phaser.Physics.Arcade.Sprite, e:Phaser.Physics.Arcade.Sprite)=>{
            a.emit(EntityMessages.OVERLAP_PLAYER);
        });
        //@ts-ignore
        this.physics.add.overlap(this.Powerups, this.Players, (powerup:Phaser.Physics.Arcade.Sprite, player:Phaser.Physics.Arcade.Sprite)=>{
            powerup.emit(EntityMessages.OVERLAP_PLAYER);
        });

        this.physics.add.collider(this.Players, this.Blocks);
        //@ts-ignore
        this.physics.add.overlap(this.CollideEnemy, this.Blocks, (a:Phaser.Physics.Arcade.Sprite, e:Phaser.Physics.Arcade.Sprite)=>{
            e.emit(EntityMessages.HIT_BLOCK);
            a.emit(AttackMessages.COLLIDE_WALL, a.getData('ai') as AI);
        });

        //Add gui stuff
        this.GuiLayer.add(new LevelTimer(this).t);
        this.GuiLayer.add(new Tips(this).t);

        this.CreateEvents();
        //Debug stuff
        this.events.on('destroy', ()=>{this.RemoveEvents();});       
        

    }
    
    CreateEnemy() {

    }


    update(time:number, dt:number) {
        this.ih.update();
        if(this.Paused) {
            if(this.ih.IsJustPressed(IHVI.Fire))
                this.TryToContinue();
                return;
        }

        this.LevelTimer += dt;
        this.events.emit(SceneMessages.UpdateTime, this.LevelTimer/1000);

        if(this.ih.IsJustPressed(IHVI.Pause)) {
            if(this.physics.world.isPaused)
                this.physics.resume();
            else
                this.physics.pause();

            return;
        }

        if(this.ih.IsJustPressed(IHVI.Test)) {
            // this.events.emit('effect', {x:this.mm.sprite.body.x, y:this.mm.sprite.body.y, right:this.mm.Facing == FacingEnum.Right}, EffectTypes.Poof);

        }


        this.physics.collide(this.CollideMap, this.currentMapPack.collideLayer);
        // let bounds = this.cameras.main.getBounds();

        //End the level if we delivered all the pizzas.


    }
    DeliveredPizza() {
        this.TotalCustomers--;
        if(!this.LevelComplete && this.TotalCustomers <= 0) {
            this.LevelCompleted();
        }
        
    }

    LevelCompleted(){
        this.LevelComplete = true;
        this.events.emit(SceneMessages.LevelComplete);
        console.log('Level Complete!');

        if(C.gd.Levels != null) {
            let ld = C.gd.Levels.find(e=>e.LevelName == this.LevelName);
            if(ld === undefined) {
                console.log('Unable to load level data from C.gd.  Check this.');
            } else {
    
            }
    
        }

        let ws = new WinScreen(this);
        this.GuiLayer.add(ws.c);

        
    }

    TryToContinue() {
        throw new Error("Method not implemented.");
    }


    CreateEvents() {
        this.events.on('debug', (m:string)=>{this.debug.text = m;});
        this.customEvents.push('debug');
        this.events.on('effect', (origin:{x:number, y:number, right:boolean}, type:EffectTypes)=> {this.EM.LaunchEffect(origin, type);});
        this.customEvents.push('effect');
        this.events.on(EntityMessages.PLAYER_DEAD, this.PlayerDead, this);
        this.events.on(SceneMessages.DeliverPizza, this.DeliveredPizza, this);

    }

    HitCheckpoint() {
        if(this.mm.hp != this.mm.maxhp) {
            //Play a sound or something.
            this.mm.hp = this.mm.maxhp;
            this.mm.sprite.emit(EntityMessages.CHANGE_HP, this.mm.hp, this.mm.maxhp);
        }

    }
    

    RemoveEvents() {
        this.customEvents.forEach(element => {
            this.events.removeListener(element);
        });
    }

    PlayerDead() {
        this.cameras.main.fadeOut(2000, 0,0,0,(cam:any, progress)=>{
            if(progress==1){

            }
        
        },this);

        this.time.addEvent({
            delay:2100,
            callbackScope:this,
            callback:()=>{this.cameras.main.fadeIn(1000);}

        });
    }

    Shutdown() {

    }

}