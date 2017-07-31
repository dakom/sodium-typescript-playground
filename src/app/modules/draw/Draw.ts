import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink, Tuple2 } from "sodiumjs";
import { SelfDisposingContainer } from "../../../lib/display/SelfDisposingContainer";
import { Assets } from "./Draw_Assets";
import { CanvasRender } from "./Draw_Render";
import { CanvasTouch } from "./Draw_Touch";
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
                const renderLayer = new CanvasRender(brush, new PIXI.Rectangle(0,0,CanvasWidth, CanvasHeight)); //the canvas itself is very mutable
                const touchManager = new CanvasTouch(renderLayer); //so touch processing and "state" is dealt with separately

                this.addChild(renderLayer);

                //unlisteners.push(touchManager.sStart.listen(p => console.log("start", p)), touchManager.sMove.listen(p => console.log("move", p)),touchManager.sEnd.listen(p => console.log("end", p)));

                unlisteners.push(
                    touchManager.sStart.listen(point => renderLayer.drawBegin(point)),
                    touchManager.sMove.listen(move => renderLayer.drawUpdate(move.p1, move.p2)),
                    touchManager.sEnd.listen(point => renderLayer.drawEnd(point))
                );

                this._dispose = () => {
                    unlisteners.forEach(unlistener => unlistener());
                    touchManager.dispose();
                }
            });
        }));

        
    }

    dispose() {
        this._dispose();
    }
}