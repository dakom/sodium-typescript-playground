import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink, Tuple2 } from "sodiumjs";
import { SelfDisposingContainer } from "../../../lib/display/SelfDisposingContainer";
import { Assets } from "./Draw_Assets";
import { Canvas} from "./Draw_Canvas";
import { TouchManager, TouchInfo, TouchType} from "./Draw_Touch";
import { Brush } from "./Draw_Brush";
import { Menu, CreateMenuItem } from "../../../lib/menu/Menu";
import { CanvasWidth, CanvasHeight } from "../../main/Main";

export interface Point {
    x: number;
    y: number;
}

export class Draw extends SelfDisposingContainer {
    private _dispose: () => void;

    constructor() {
        super();
        const unlisteners = new Array<() => void>();
        const assets = new Assets();

        const sLoad = assets.load();

        unlisteners.push(sLoad.listen(b => {
            Transaction.run((): void => {
                const brush = new Brush(assets.getTexture());
                const canvas = new Canvas(brush); //the canvas itself is very mutable
                const touchManager = new TouchManager(canvas); //so touch processing and "state" is dealt with separately
                
                this.addChild(canvas);

                unlisteners.push(
                    touchManager.sTouch
                        .filter(t => t.type === TouchType.START)
                        .listen(t => canvas.drawBegin(t.point))
                );

                unlisteners.push(
                    touchManager.sTouch
                        .filter(t => t.type === TouchType.MOVE)
                        .listen(t => canvas.drawUpdate(t.point))
                );

                unlisteners.push(
                    touchManager.sTouch
                        .filter(t => t.type === TouchType.END)
                        .listen(t => canvas.drawEnd(t.point))
                );
            });
        }));

        this._dispose = () => {
            unlisteners.forEach(unlistener => unlistener());
        }
    }

    dispose() {
        this._dispose();
    }
}