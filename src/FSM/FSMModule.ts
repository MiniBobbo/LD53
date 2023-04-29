import { FSM, IFSM } from "./FSM";

export class FSMModule {
    parent:IFSM;
    fsm:FSM;
    constructor(parent:IFSM, fsmParent:FSM) {
        this.parent = parent;
        this.fsm = fsmParent;
    }

    moduleStart(args:any) {

    }

    moduleEnd(args:any) {

    }

    update(dt:number) {
        
    }





}