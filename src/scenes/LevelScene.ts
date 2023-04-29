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
import { SetupMapHelper } from "../Helpers/SetupMapHelper";
import { IH, IHVI } from "../IH/IH";
import { LDtkMapPack, LdtkReader, Level } from "../Map/LDtkReader";
import { MapObjects } from "../Map/MapObjects";

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

    checkpointEmitter:Phaser.GameObjects.Particles.ParticleEmitter;

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



    create(levelData:{levelName:string}) {
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

        this.BG = this.add.tileSprite(0,0, 240,240,'bgs').setScrollFactor(0,0).setOrigin(0,0);
        this.Background.add(this.BG);


        this.reader = new LdtkReader(this,this.cache.json.get('start'));

        this.cam = this.add.image(0,0,'atlas').setVisible(false);

        this.lights.enable();
        this.lights.setAmbientColor(0xffffff);

        this.ih = new IH(this);

        this.debug = this.add.text(0,0,"").setFontSize(10).setDepth(1000).setScrollFactor(0,0);

        let m = this.reader.CreateMap(C.gd.CurrentLevel, 'faketiles');
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

        if(this.mm.sprite.x < this.currentMapPack.worldX) {
            this.TransitionMap('w');
        } else if (this.mm.sprite.x > this.currentMapPack.worldX + this.currentMapPack.width) {
            this.TransitionMap('e');
        } else if (this.mm.sprite.y > this.currentMapPack.worldY + this.currentMapPack.height) {
            this.TransitionMap('s');
        } else if (this.mm.sprite.y < this.currentMapPack.worldY) {
            this.TransitionMap('n');
        }

        this.physics.collide(this.CollideMap, this.currentMapPack.collideLayer);
        let bounds = this.cameras.main.getBounds();

        this.BG.tilePositionX = this.cameras.main.scrollX * .2;

    }
    TryToContinue() {
        throw new Error("Method not implemented.");
    }

    /**
     * Tries to transition the map to a new location.  This should be called when the player moves off the screen in a direction
     * 
     * @param direction The direction that the player moved off the screen.  n, e, s, or w.
     * @returns True if a map exists.  Otherwise false and it should be handled.  Kill the player or something...
     */
    TransitionMap(direction:string):boolean {
        if(this.LevelTransition)
            return false;
        this.LevelTransition = true;
        let clevel = this.reader.ldtk.levels.find(l=>l.identifier == this.currentMap);
        let nextleveluid = clevel.__neighbours.find(n=>n.dir == direction).levelIid;
        let nlevel = this.reader.ldtk.levels.find(l=>l.iid == nextleveluid);
        this.physics.pause();
        this.CreateNextMap(nlevel);
        this.cameras.main.stopFollow();
        let cam = this.cameras.main;
        cam.removeBounds();
        let sx = cam.scrollX;
        let sy = cam.scrollY;
        let px = this.mm.sprite.x;
        let py = this.mm.sprite.y;
        switch (direction) {
            case 'e':
                sx += cam.width;
                px += 5;
                break;
            case 'w':
                sx -= cam.width;
                px -= 5;
                break;
            case 'n':
                sy -= cam.height;
                py -= 5;
                break;
            case 's':
                sy += cam.height;
                py += 5;
                break;
        
            default:
                break;
        }

        this.tweens.add(
            {
                targets:cam,
                scrollX:sx,
                scrollY:sy,
                duration:C.SCREEN_TRANSITION_TIME,
                onComplete:this.EndScreenTransition,
                callbackScope:this,
            }
        );
        this.tweens.add(
            {
                targets:this.mm.sprite,
                x:px,
                y:py,
                duration:C.SCREEN_TRANSITION_TIME
            }
        );



        return false;
    }


    CreateNextMap(nLevel:Level) {
        this.nextMapPack = this.reader.CreateMap(nLevel.identifier, 'faketiles');
        // if(this.currentMapCollider != null)
        //     this.currentMapCollider.destroy();
        this.physics.world.setBounds(this.nextMapPack.worldX, this.nextMapPack.worldY, this.nextMapPack.width, this.nextMapPack.height);
        this.nextMapPack.collideLayer.setCollision([1,2,3,4,5]);
        this.currentMap = nLevel.identifier;
        C.gd.CurrentLevel = nLevel.identifier;
        this.nextMapPack.displayLayers.forEach(element => {
            element.setPipeline('Light2D');
        });
        this.nextMapPack.displayLayers.forEach(element => {
            if(element.name == 'Fg')5
                this.Foreground.add(element);
            if(element.name == 'Decor')
                this.Background.add(element);
            if(element.name == 'Mg')
                this.Midground.add(element);
            

        });

        this.NextMapObjects = new MapObjects();
        SetupMapHelper.CreateEntities(this, this.nextMapPack, this.NextMapObjects);
        // this.IntMaps.add(this.nextMapPack.collideLayer);
        let level = this.reader.ldtk.levels.find((l: any) => l.identifier === nLevel.identifier);
        }

    EndScreenTransition() {
        this.IntMaps.remove(this.currentMapPack.collideLayer);
        this.currentMapPack.Destroy();
        this.currentMapPack = this.nextMapPack;

        this.CurrentMapObjects.Destroy();
        this.CurrentMapObjects = this.NextMapObjects;
        this.LevelTransition = false;
        this.cameras.main.setBounds(this.currentMapPack.worldX, this.currentMapPack.worldY, this.currentMapPack.width, this.currentMapPack.height);
        this.cameras.main.startFollow(this.mm.sprite);

        this.currentMapPack.collideLayer.layer.data.length;
        this.physics.resume();
    }

    CreateEvents() {
        this.events.on('debug', (m:string)=>{this.debug.text = m;});
        this.customEvents.push('debug');
        this.events.on('effect', (origin:{x:number, y:number, right:boolean}, type:EffectTypes)=> {this.EM.LaunchEffect(origin, type);});
        this.customEvents.push('effect');
        this.events.on(EntityMessages.PLAYER_DEAD, this.PlayerDead, this);
        this.customEvents.push(EntityMessages.PLAYER_DEAD);
        this.customEvents.push(EntityMessages.GET_POWERUP);
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