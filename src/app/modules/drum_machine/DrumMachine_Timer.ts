
import { CanvasWidth, CanvasHeight } from "../../main/Main";
import {Row_UI, Block_UI} from "./DrumMachine_UI";

import { MillisecondsTimerSystem, Cell, Transaction, CellLoop, CellSink, Stream, StreamSink} from "sodiumjs";

class Block {
    public dispose:() => void;

    constructor(displayTarget:Block_UI, cActive:Cell<boolean>) {
        Transaction.run((): void => {
            this.dispose = cActive.listen(selected => displayTarget.redraw(selected));
        });
    }

}

export class Timer extends PIXI.Container {
    private _cMeasure:Cell<number>;

    private _row:Row_UI;

    constructor() {
        super();

        //visual setup
        this._row = new Row_UI(0xff0000, 0xcccccc);
        this.addChild(this._row);

        
    }

    public start(cSpeed:Cell<number>) {
        //timer setup
        const sys = new MillisecondsTimerSystem();
        const period = 200;

        const time = sys.time;
        const oAlarm = new CellLoop<number>();
        const sAlarm = sys.at(oAlarm);

        //TODO - map period based on cSpeed
        const nextAlarm = sAlarm.map(t => t + period);
        oAlarm.loop(nextAlarm.hold(time.sample() + period)); //time.sample() == Date.now()

        const cMeasure = new CellLoop<number>();
        
        cMeasure.loop(
            nextAlarm.snapshot(cMeasure, (rawTime,measureTime) => {
                return (measureTime < 15) ? measureTime + 1 : 0;
            })
            .hold(0));
        
        this._cMeasure = cMeasure;

        
        //get blocks as frp logic
        const blocks = this._row.children
            .forEach((graphics, index) => 
                new Block(graphics as Block_UI, cMeasure.map(num => num === index)));
    }

    public get cMeasure():Cell<number> {
        return this._cMeasure;
    }
}