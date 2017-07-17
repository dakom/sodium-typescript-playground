import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink, Tuple2, lambda2, lambda3 } from "sodiumjs";
import { BaseContainer } from "../../../lib/display/BaseContainer";
import { Menu, CreateMenuItem } from "../../../lib/menu/Menu";
import { Main, CanvasWidth, CanvasHeight } from "../../main/Main";
import {Samplers} from "./DrumMachine_Samplers";
import {Timer} from "./DrumMachine_Timer";

export class DrumMachine extends BaseContainer {
    private unlisteners: Array<() => void>;

    constructor() {
        super();

        this.unlisteners = new Array<() => void>();

        
        const samplers = new Samplers();
        samplers.y = (CanvasHeight - samplers.height)/2;
        this.addChild(samplers);

        const timer = new Timer();
        timer.y = samplers.y + samplers.height + 30;
        this.addChild(timer);

        Transaction.run((): void => {
            
        });
    }

   
    dispose() {
        this.unlisteners.forEach(unlistener => unlistener());
   
    }
}