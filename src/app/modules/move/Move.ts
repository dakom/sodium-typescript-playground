import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink, Tuple2, lambda2, lambda3 } from "sodiumjs";
import { SelfDisposingContainer } from "../../../lib/display/SelfDisposingContainer";
import { Menu, CreateMenuItem } from "../../../lib/menu/Menu";
import { Main, CanvasWidth, CanvasHeight } from "../../main/Main";
import {Draggable, DraggableEvent, DraggableEventType, DraggableGesture} from "../../../lib/draggable/Draggable";
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

        //combine all drag events into one stream (we're not interested in multi-touch)
        const sDragEvents = draggables
                .map(drag => drag.sEvent)
                .reduce((acc: Stream<DraggableEvent>, elem: Stream<DraggableEvent>) => acc.orElse(elem));

        //listen to updates and change highlight (position updates are handled via Draggable)
        Transaction.run((): void => {
            unlisteners.push(
                sDragEvents
                    .filter(evt => evt.type === DraggableEventType.START)
                    .listen(evt => {
                        (evt.displayTarget as Shape).selected = true;
                    }),

                sDragEvents
                    .filter(evt => evt.type === DraggableEventType.END)
                    .listen(evt => {
                        (evt.displayTarget as Shape).selected = false;
                    }),

                sDragEvents
                    .filter(evt => evt.gesture === DraggableGesture.TAP)
                    .listen(evt => {
                        alert((evt.displayTarget as Shape).opts.type + " was tapped!")
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
