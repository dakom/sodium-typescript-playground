
import { CanvasWidth, CanvasHeight } from "../../main/Main";
import {Row_UI, Block_UI} from "./DrumMachine_UI";
import { MillisecondsTimerSystem, Cell, Transaction, CellLoop, CellSink, Stream, StreamSink} from "sodiumjs";
import * as R from "ramda";

export class Timer extends PIXI.Container {
    public dispose:() => void;

    private _cMeasure:Cell<number>;
    private _row:Row_UI;
    
    constructor() {
        super();

        //visual setup
        this._row = new Row_UI(0xff0000, 0xcccccc);
        this.addChild(this._row);   
    }

    public start(cSpeed:Cell<number>) {
        //just tinkered till it felt okay
        const getSpeed = (speedFactor:number) => R.clamp(20,1000,Math.exp(speedFactor * -5) * 1000);

        //timer setup
        const sys = new MillisecondsTimerSystem();
        const time = sys.time;
        const oAlarm = new CellLoop<number>();
        const sAlarm = sys.at(oAlarm);

        const nextAlarm = sAlarm.snapshot3(oAlarm, cSpeed, (ms,alarmTime, speedFactor) => alarmTime + getSpeed(speedFactor));
        
        
        //set the first alarm. time.sample() is Date.now()
        oAlarm.loop(nextAlarm.hold(time.sample() + getSpeed(cSpeed.sample())));

        //create a cell to represet the measure, which is updated by the alarm
        const cMeasure = new CellLoop<number>();
        
        cMeasure.loop(
            nextAlarm.snapshot(cMeasure, (rawTime,measureTime) => (measureTime < 15) ? measureTime + 1 : 0)
            .hold(0));
        
        this._cMeasure = cMeasure;

        //visual updates when measure changes
        this.dispose = this._cMeasure.listen(measure => {
            this._row.children
                .forEach((block, index) => (block as Block_UI).redraw(measure === index));
        })
    }

    public get cMeasure():Cell<number> {
        return this._cMeasure;
    }

}