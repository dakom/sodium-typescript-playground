import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink, Tuple2, lambda2, lambda3 } from "sodiumjs";
import { BaseContainer } from "../../../lib/display/BaseContainer";
import { Menu, CreateMenuItem } from "../../../lib/menu/Menu";
import { Main, CanvasWidth, CanvasHeight } from "../../main/Main";
import {Draggable} from "../../../lib/draggable/Draggable";
import { Shape, CreateShapes } from "./Move_UI";


export class Move extends BaseContainer {
    private unlisteners: Array<() => void>;
    private draggables:Array<Draggable>;

    constructor() {
        super();

        this.unlisteners = new Array<() => void>();

        //ui
        const shapes = CreateShapes();
        shapes.forEach(shape => this.addChild(shape));

        //create draggables for ui elements, and assign for later disposing
        const draggables = shapes.map(shape => new Draggable(shape));
        this.draggables = draggables;

        //combine all drag starts into one stream
        const sTouchStart = draggables
                .map(drag => drag.sStart)
                .reduce((acc: Stream<PIXI.DisplayObject>, elem: Stream<PIXI.DisplayObject>) => acc.orElse(elem));

        //combine all drag ends into one stream
        const sTouchEnd = draggables
                .map(drag => drag.sEnd)
                .reduce((acc: Stream<PIXI.DisplayObject>, elem: Stream<PIXI.DisplayObject>) => acc.orElse(elem));

        //listen to updates and change highlight (position updates are handled via Draggable)
        Transaction.run((): void => {
            this.unlisteners.push(
                sTouchStart.listen(target => {
                    (target as Shape).selected = true;
                }),

                sTouchEnd.listen(target => {
                    (target as Shape).selected = false;
                }),
            );
        });
    }

    //cleanup
    dispose() {
        this.unlisteners.forEach(unlistener => unlistener());
        this.draggables.forEach(drag => drag.dispose());
    }
}
