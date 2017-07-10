import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink } from "sodiumjs";
import {Canvas} from "./Draw_Canvas";

export class Touch {
    constructor(public readonly type:TouchType, public readonly evt:PIXI.interaction.InteractionEvent) {}
}
export enum TouchType {
    START,
    MOVE,
    END
}

export class TouchManager {
    private _sTouch:StreamSink<Touch>;
    constructor(canvas:Canvas) {
        this._sTouch = new StreamSink<Touch>();

        canvas.on('pointerdown', e => this._sTouch.send(new Touch(TouchType.START, e)));
        canvas.on('pointermove', e => this._sTouch.send(new Touch(TouchType.MOVE, e)));
        canvas.on('pointerup', e => this._sTouch.send(new Touch(TouchType.END, e)));
        canvas.on('pointerupoutside', e => this._sTouch.send(new Touch(TouchType.END, e)));
    }

    public get sTouch():Stream<Touch> {
        return this._sTouch;
    }
}