import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink, Tuple2, lambda2, lambda3 } from "sodiumjs";
import { SelfDisposingContainer } from "../../../lib/display/SelfDisposingContainer";
import { Menu, CreateMenuItem } from "../../../lib/menu/Menu";
import { Main, CanvasWidth, CanvasHeight } from "../../main/Main";
import {Draggable} from "../../../lib/draggable/Draggable";
import { Shape, CreateShapes } from "./Move_UI";


export class Move extends SelfDisposingContainer {
    private _dispose: () => void;

    constructor() {
        super();

        const unlisteners = new Array<() => void>();

        //ui
        const shapes = CreateShapes();
        shapes.forEach(shape => this.addChild(shape));

        //create draggables for ui elements, and assign for later disposing
        const draggables = shapes.map(shape => new Draggable(shape));

        //combine all drag starts into one stream
        const sTouchStart = draggables
                .map(drag => drag.sStart)
                .reduce((acc: Stream<PIXI.DisplayObject>, elem: Stream<PIXI.DisplayObject>) => acc.orElse(elem));

        //combine all drag ends into one stream
        const sTouchEnd = draggables
                .map(drag => drag.sEnd
                    .map(t => t.a)) //we're only interested in the displayobject, discard the diff point
                .reduce((acc: Stream<PIXI.DisplayObject>, elem: Stream<PIXI.DisplayObject>) => acc.orElse(elem));

        //listen to updates and change highlight (position updates are handled via Draggable)
        Transaction.run((): void => {
            unlisteners.push(
                sTouchStart.listen(target => {
                    (target as Shape).selected = true;
                }),

                sTouchEnd.listen(target => {
                    (target as Shape).selected = false;
                }),
            );
        });

        this._dispose = () => {
            unlisteners.forEach(unlistener => unlistener());
            draggables.forEach(drag => drag.dispose());
        }
    }

    //cleanup
    dispose() {
        this._dispose();
    }
}
