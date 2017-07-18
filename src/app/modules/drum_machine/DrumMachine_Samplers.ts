import { CanvasWidth, CanvasHeight } from "../../main/Main";
import {Row_UI, Block_UI} from "./DrumMachine_UI";
import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink} from "sodiumjs";

class Block {
    public dispose:() => void;
    constructor(displayTarget:Block_UI) {
        displayTarget.interactive = displayTarget.buttonMode = true;

        Transaction.run((): void => {

            const cActive = new CellLoop<boolean>();
            const sTouch = new StreamSink<PIXI.interaction.InteractionEvent>();

            const sUpdate = sTouch.snapshot(cActive, (evt, active) => !active);
            cActive.loop(sUpdate.hold(false));

            displayTarget.on('pointerdown', evt => sTouch.send(evt));

            this.dispose = cActive.listen(selected => displayTarget.redraw(selected));
        });
    }
}

class Row extends PIXI.Container {
    constructor() {
        super();
        const row = new Row_UI(0x0000ff, 0x2a2a2a);
        this.addChild(row);

        const blocks = row.children.forEach((graphics, index) => new Block(graphics as Block_UI));
    }
}

export class Samplers extends PIXI.Container {
    constructor() {
        super();
        
        const rows = this.makeRows();
        rows.forEach(row => this.addChild(row));
    }

    makeRows():Array<Row> {
        const rows = new Array<Row>();
        for(let index = 0, offset = 0; index < 4; index++) {
            let row = new Row();
            row.y = offset;
            rows.push(row);
            offset += row.height + 10;
        }

        return rows;
    }
}