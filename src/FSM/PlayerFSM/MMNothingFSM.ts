import { C } from "../../C";
import { MM } from "../../Entities/MM";
import { FSMModule } from "../FSMModule";

export class MMNothingFSM extends FSMModule {
    mm:MM;
    timer:number = 0;
    grabTime:number = 500;
    jumpStrength:number = 600;
    goingUp:boolean;

    moduleStart(args: any): void {
        this.mm = this.parent as MM;
    }

    update(dt:number) {

    }
}
