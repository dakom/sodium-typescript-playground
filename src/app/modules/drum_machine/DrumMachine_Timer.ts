
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

    constructor() {
        super();

        //visual setup
        const row = new Row_UI(0xff0000, 0xcccccc);
        row.x = (CanvasWidth - row.width) / 2;
        this.addChild(row);

        //timer setup
        const sys = new MillisecondsTimerSystem();
        const period = 200;

        const time = sys.time;
        const oAlarm = new CellLoop<number>();
        const sAlarm = sys.at(oAlarm);

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
        const blocks = row.children
            .forEach((graphics, index) => 
                new Block(graphics as Block_UI, cMeasure.map(num => num === index)));
    }

    public get cMeasure():Cell<number> {
        return this._cMeasure;
    }
}