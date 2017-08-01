
import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink, Tuple2 } from "sodiumjs";
import { Point } from "./Draw";
import { Main } from "../../main/Main";

export interface Move {
    p1: PIXI.Point;
    p2: PIXI.Point;
}

export class CanvasTouch {
    public readonly sStart: Stream<PIXI.Point>;
    public readonly sMove: Stream<Move>;
    public readonly sEnd: Stream<PIXI.Point>;

    private _dispose:() => void;

    constructor(private target: PIXI.Sprite) {
        //stream sinks for dispatching local events (triggered via ui/pixi listeners)
        const sTouchStart = new StreamSink<PIXI.interaction.InteractionEvent>();
        const sTouchMove = new StreamSink<PIXI.interaction.InteractionEvent>();
        const sTouchEnd = new StreamSink<PIXI.interaction.InteractionEvent>();

        /* UI / PIXI listeners */
        //using named listeners to facilitate removal
        const dispatchStart = evt => sTouchStart.send(evt);
        const dispatchMove = evt => sTouchMove.send(evt);
        const dispatchEnd = evt => {
            sTouchEnd.send(evt); 
                sTouchStart.send(null); //send null to reset cDragging
        }
        target.on('pointerdown', dispatchStart);
        
        function toggleGlobalListeners(flag: boolean) {
            if (flag) {
                Main.app.renderer.plugins.interaction.on('pointermove', dispatchMove);
                Main.app.renderer.plugins.interaction.on('pointerup', dispatchEnd);
                Main.app.renderer.plugins.interaction.on('pointeroutside', dispatchEnd);
            } else {
                Main.app.renderer.plugins.interaction.off('pointermove', dispatchMove);
                Main.app.renderer.plugins.interaction.off('pointerup', dispatchEnd);
                Main.app.renderer.plugins.interaction.off('pointeroutside', dispatchEnd);
            }
        }

        /* Main FRP logic */
        const cDragging = sTouchStart.map(evt => evt === null ? false : true).hold(false);

        this.sStart = pointStream(sTouchStart, false);
        this.sEnd = pointStream(sTouchEnd, true);

        /* This is where the magic happens. It's like this:
            1. Get any start events and map it to null
            2. Merge that with any move events (which are points)
            3. Collect these updates into a state machine which uses a Point as state and outputs a Move (containing two points)
            3a. If the updated move point (nextPoint) or state (prevPoint) are null, or if they are equal, the output is null
            3b. Otherwise, the output is the Move with prevPoint and nextPoint.
            3c. The next state (prevPoint of the next call) is always set to nextPoint of this call - this allows continous lines.
            4. If the update is invalid (due to the event being a start or both points being identical), filter it out 
        */
        this.sMove = this.sStart
                .map(evt => null)
                .orElse(pointStream(sTouchMove, true))
                .collect(null, (nextPoint, prevPoint: PIXI.Point) => new Tuple2(
                    (prevPoint === null || nextPoint === null || prevPoint.equals(nextPoint)) 
                        ? null 
                        : Object.freeze({
                            p1: prevPoint,
                            p2: nextPoint
                        }), 
                        nextPoint))
                    .filterNotNull();


        //listeners
        const unlisteners = new Array<() => void>();

        unlisteners.push(
            this.sStart.listen(() => toggleGlobalListeners(true)),
            this.sEnd.listen(() => toggleGlobalListeners(false)),
        )

        //helper function to create gated/validated streams
        function pointStream(s: Stream<PIXI.interaction.InteractionEvent>, onlyIfDragging: boolean): Stream<PIXI.Point> {
            return s.snapshot(cDragging, (evt, dragging) => 
                (dragging || !onlyIfDragging) ? evt : null)
                    .filterNotNull()
                    .map(evt => evt.data.getLocalPosition(target, undefined, evt.data.global)) //note - for performance increase in exchange for purity, a local cached point could be used instead of undefined in getLocalPosition()
                    .map(point => new PIXI.Point(point.x >> 0, point.y >> 0)) //we're only interested in the rounded numbers
        }

        /* Cleanup */
        this._dispose = () => {
            unlisteners.forEach(unlistener => unlistener());
            target.off('pointerdown', dispatchStart);
            toggleGlobalListeners(false);
            
        }
        
    }

    public dispose() {
        this._dispose();
    }
}