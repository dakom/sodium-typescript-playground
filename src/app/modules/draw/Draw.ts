import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink, Tuple2 } from "sodiumjs";
import { BaseContainer } from "../../../lib/display/BaseContainer";
import { Assets } from "./Draw_Assets";
import { Canvas} from "./Draw_Canvas";
import { TouchManager, TouchInfo, TouchType} from "./Draw_Touch";
import { Brush } from "./Draw_Brush";
import { Menu, CreateMenuItem } from "../../../lib/menu/Menu";
import { CanvasWidth, CanvasHeight } from "../../main/Main";

import * as R from "ramda";

export interface Point {
    x: number;
    y: number;
}

export class Draw extends BaseContainer {
    private unlisteners: Array<() => void>;
    private assets:Assets;
   
    constructor() {
        super();
        this.unlisteners = new Array<() => void>();
        this.assets = new Assets();

        const sLoad = this.assets.load();

        this.unlisteners.push(sLoad.listen(b => {
            Transaction.run((): void => {
                const brush = new Brush(this.assets.getTexture());
                const canvas = new Canvas(brush); //the canvas itself is very mutable
                const touchManager = new TouchManager(canvas); //so touch processing and "state" is dealt with separately
                
                this.addChild(canvas);

                this.unlisteners.push(
                    touchManager.sTouch
                        .filter(t => t.type === TouchType.START)
                        .listen(t => canvas.drawBegin(t.point))
                );

                this.unlisteners.push(
                    touchManager.sTouch
                        .filter(t => t.type === TouchType.MOVE)
                        .listen(t => canvas.drawUpdate(t.point))
                );

                this.unlisteners.push(
                    touchManager.sTouch
                        .filter(t => t.type === TouchType.END)
                        .listen(t => canvas.drawEnd(t.point))
                );
            });
        }));
    }

    dispose() {
        this.unlisteners.forEach(unlistener => unlistener());
       
    }
}