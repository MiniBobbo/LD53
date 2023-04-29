/**
 * Input Helper (abbreviated IH) is a tool designed to simplify inputs for Phaser into a single
 * controller.  It allows for multiple keys on the keyboard or controllers to be mapped to 
 * virtual buttons where logic can be assigned in the game objects. 
 */
export class IH {
    private static VI:Array<string>;
    private VIDown:Map<string, boolean>;
    private VILastDown:Map<string, boolean>;

    private static KeyToVIMaster:Map<string, string>;
    private static GamepadButtonToVIMaster:Map<number, string>;
    private KeyToVI:Map<Phaser.Input.Keyboard.Key, string>;
    private GamepadButtonToVI:Map<number, string>;
    private Keys:Array<Phaser.Input.Keyboard.Key>;
    private pad:Phaser.Input.Gamepad.Gamepad;

    private static MouseClickVI:string;

    PadCount:number = 0;

    //This flag is for reference and doesn't affect behavior.
    private holdInput:boolean = false;

    JustAccept:boolean = false;

    private s:Phaser.Scene;

    constructor(scene:Phaser.Scene) {
        this.s = scene;
        this.VIDown = new Map<string, boolean>();
        this.VILastDown = new Map<string, boolean>();
        this.KeyToVI = new Map<Phaser.Input.Keyboard.Key,string>();
        this.GamepadButtonToVI = new Map<number,string>();
        this.Keys = [];

        IH.VI.forEach(element => {
            this.VIDown.set(element, false);
            this.VILastDown.set(element, false);
        }, this);

        let masterKeys = IH.KeyToVIMaster.keys();
        for(let k of Array.from(IH.KeyToVIMaster.keys())) {
            let thisKey = this.s.input.keyboard.addKey(k);
            this.Keys.push(thisKey);
            //@ts-ignore
            this.KeyToVI.set(thisKey, IH.KeyToVIMaster.get(k));
        }

        if(scene.input.gamepad != undefined) {
            scene.input.gamepad.once('connected', (pad:Phaser.Input.Gamepad.Gamepad) => {
                this.pad = pad;
                this.PadCount++;
                this.MapGamepadButtons();
            });
    
        }

    }
    MapGamepadButtons() {
        for(let k of Array.from(IH.GamepadButtonToVIMaster.keys())) {
            this.GamepadButtonToVI.set(k, IH.GamepadButtonToVIMaster.get(k));
        }
    }

    private MouseClicked() {
        if(this.VIDown.has(IH.MouseClickVI))
            this.VIDown.set(IH.MouseClickVI, true);
    }

    static MapMouseToVirtualInput(virtualInput:string) {
        this.MouseClickVI = virtualInput;
    }

    RunJustAccept() {

    }

    update() {
        if(this.JustAccept) {
            this.RunJustAccept();
            return;
        }
        this.VIDown.forEach( function(v,k,m) {
            //@ts-ignore
            this.VILastDown.set(k, v);
            //@ts-ignore
            this.VIDown.set(k, false);
        }, this); 

        //Check mouse VI
        if(IH.MouseClickVI != null) {
            if(this.s.input.activePointer.isDown)
                this.VIDown.set(IH.MouseClickVI, true);
        }

        for(let k of this.Keys) {
            if(k.isDown) {
                let pressed = this.KeyToVI.get(k);
                this.VIDown.set(pressed!, true);
            }
        }

        if(this.s.input.gamepad != undefined && this.s.input.gamepad.total > 0) {
            this.s.input.gamepad.pad1.buttons.forEach(b => {
                if(b.pressed) {
                    let pressed = this.GamepadButtonToVI.get(b.index);
                    this.VIDown.set(pressed!, true);
                }
                    
            });
        }
    }

    static AddVirtualInput(ID:string) {
        if(this.VI == null) {
            this.VI = [];
        }
        //TODO: Check if the VI already exists.
        this.VI.push(ID.toLowerCase());
    }

    static AssignKeyToVirtualInput(key:string, inputID:string) {
        if(this.KeyToVIMaster == null) 
            this.KeyToVIMaster = new Map<string, string>();
        this.KeyToVIMaster.set(key, inputID);
    }

    static AssignPadButtonToVirtualInput(button:GamepadButtons, VI:string) {
        if(this.GamepadButtonToVIMaster == null) 
            this.GamepadButtonToVIMaster = new Map<GamepadButtons, string>();
        this.GamepadButtonToVIMaster.set(button, VI);
    }

    Debug():string {
        let s = '';
        IH.VI.forEach(e => {
            s += `${e} : Down-${this.VIDown.get(e)}  LastDown-${this.VILastDown.get(e)} \n`;
        });

        s+= '\n\nMASTER\n';

        IH.KeyToVIMaster.forEach(function(v, k, m) {
            s += `${k} assigned to ${v}\n`;
        });

        return s;
    } 

    IsPressed(virtualInput:string) {
        if(this.VIDown.has(virtualInput))
            return this.VIDown.get(virtualInput);
        else
        return false;
    }
    
    IsJustPressed(virtualInput:string) {
        if(this.VIDown.has(virtualInput)) {
            if(this.VIDown.get(virtualInput) && !this.VILastDown.get(virtualInput))
                return true;
            else
                return false;
        }
        else
        return false;
    }

    IsJustReleased(virtualInput:string) {
        if(this.VIDown.has(virtualInput)) {
            if(!this.VIDown.get(virtualInput) && this.VILastDown.get(virtualInput))
                return true;
            else
                return false;
        }
        else
        return false;

    }

}

export enum GamepadButtons {
    A = 0,
    X = 2,
    Y = 3,
    B = 1,
    Left = 14,
    Right = 15,
    Down = 13,
    Up = 12, 
    LeftAxis = 10,
    RightAxis = 11,
    LeftTrigger = 4,
    LeftBumper = 6,
    RightTrigger = 5,
    RightBumper = 7,
    Plus = 9,
    Minus = 8,

}

export enum IHVI {
    Up = 'up',
    Down = 'down',
    Left = 'left',
    Right = 'right',
    Test = 'test',
    Fire = 'fire',
    Jump = 'jump',
    Pause = 'pause',
    Map = 'map'
}