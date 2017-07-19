import { CanvasWidth, CanvasHeight } from "../../main/Main";
import {Row_UI, Block_UI} from "./DrumMachine_UI";
import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink} from "sodiumjs";
import {CellSequence} from "../../../lib/funcs/PrimitiveFuncs";

import * as R from "ramda";

class Block {
    public dispose:() => void;

    private _cActive:Cell<boolean>;

    constructor(displayTarget:Block_UI) {
        displayTarget.interactive = displayTarget.buttonMode = true;

        Transaction.run((): void => {

            const cActive = new CellLoop<boolean>();
            const sTouch = new StreamSink<PIXI.interaction.InteractionEvent>();

            const sUpdate = sTouch.snapshot(cActive, (evt, active) => !active);
            cActive.loop(sUpdate.hold(false));
            
            displayTarget.on('pointerdown', evt => sTouch.send(evt));

            this.dispose = cActive.listen(selected => displayTarget.redraw(selected));
            this._cActive = cActive;
        });
    }

    public get cActive():Cell<boolean> {
        return this._cActive;
    }
}

class Row extends PIXI.Container {
    public blocks:Array<Block>;

    constructor(public readonly sampleId:string) {
        super();
        const row = new Row_UI(0x0000ff, 0x2a2a2a);
        this.addChild(row);

        this.blocks = row.children.map((graphics, index) => new Block(graphics as Block_UI));
    }
}



export class Samplers extends PIXI.Container {
    private rows:Array<Row>;
    private readonly sounds = ["bass", "snare", "hihat", "cymbal"];

    constructor() {
        super();
        
        this.rows = this.makeRows();
        this.rows.forEach(row => this.addChild(row));
    }

    //iterate over the rows and get the sampleId if the column (measure index) is active
    public getSamples(cMeasure:Cell<number>):Cell<string[]> {
        return Cell.switchC(
            cMeasure.map(index =>
                CellSequence(this.rows.map(row => 
                    row.blocks[index].cActive.map(active => active ? row.sampleId : ""))
                )
            )
        )
        .map(sampleIds => sampleIds.filter(sample => sample !== ""));
    }

    makeRows():Array<Row> {
        let offset = 0;
        return this.sounds.map((sound, index) => {
            let row = new Row(sound);
            row.y = offset;
            offset += row.height + 10;
            return row;
        });
    }
}