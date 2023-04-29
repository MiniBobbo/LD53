import { FSMModule } from "./FSMModule";

export interface IFSM {
    changeFSM:(nextFSM:string)=>void;
    fsm:FSM;
}

export class FSM {
    parent:IFSM;
    paused:boolean = false;
    modules:Map<string, FSMModule>;
    currentModule!:FSMModule|undefined;
    currentModuleName!:string;
    constructor(parent:IFSM) {
        this.parent = parent;
        this.modules = new Map<string, FSMModule>();
        this.addModule('nothing', new FSMModule(parent, this));

    }

    addModule(moduleName:string, module:FSMModule) {
        this.modules.set(moduleName, module);
    }

    changeModule(newModule:string, args?:any) {
        if(newModule!=this.currentModuleName && this.modules.has(newModule)) {
            // console.log(`Changed to ${newModule}`);
            this.currentModuleName = newModule;
            if(this.currentModule != null)
                this.currentModule.moduleEnd(args);
            this.currentModule = this.modules.get(newModule);
            this.currentModule!.moduleStart(args);
        }
    }

    clearModule() {
    this.currentModule = undefined;        
    }

    update(time:number, dt:number) {
        if(this.paused)
            return;
        if(this.currentModule != null) {
            // dt /= 1000;
            this.currentModule.update(dt);
        }
    }
}