import { Transaction, StreamSink, Stream, Cell } from "sodiumjs";
import { Main } from "../../app/main/Main";
import { DraggableValidator } from "./Draggable_Validator";
import * as R from "ramda";

const TAP_SPACE_THRESHHOLD = 2;
const TAP_TIME_THRESHHOLD = 250;

export enum DraggableAxisLock {
    X,
    Y,
    BOTH
}

export interface DraggableOptions {
    cEnabled?: Cell<boolean>; //enable/disable from the outside
    makeInteractive?: boolean; //default true
    axisLock?: DraggableAxisLock; //undefined does nothing
    validator?: DraggableValidator; //undefined sets always-valid validator
}


export enum DraggableEventType {
    START,
    MOVE,
    END,

}

export enum DraggableGesture {
    TAP
}

export interface DraggableEvent {
    readonly type: DraggableEventType;
    readonly displayTarget: PIXI.DisplayObject;
    readonly point: PIXI.Point;
    readonly localPoint: PIXI.Point;
    readonly timestamp: number;
    readonly pixiEvent: PIXI.interaction.InteractionEvent;
    readonly gesture?: DraggableGesture;

}

export class Draggable {
    public sEvent: Stream<DraggableEvent>;

    //references for dispose()
    private _dispose: () => void;


    constructor(public readonly displayTarget: PIXI.DisplayObject, options?: DraggableOptions) {


        Transaction.run((): void => {
            /* setup options */
            options = normalizeOptions(options);

            if (options.makeInteractive) {
                displayTarget.interactive = displayTarget.buttonMode = true;
            }

            /* stream sinks for dispatching local events (triggered via ui/pixi listeners) */
            const sTouchStart = new StreamSink<PIXI.interaction.InteractionEvent>();
            const sTouchMove = new StreamSink<PIXI.interaction.InteractionEvent>();
            const sTouchEnd = new StreamSink<PIXI.interaction.InteractionEvent>();

            /* UI / PIXI listeners */
            //using named listeners to facilitate removal
            const dispatchStart = evt => sTouchStart.send(evt);
            const dispatchMove = evt => sTouchMove.send(evt);
            const dispatchEnd = evt => { sTouchEnd.send(evt); sTouchStart.send(null); } //send null to reset cDragging

            displayTarget.on('pointerdown', dispatchStart);

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

            /* Core logic  */

            //start event - only if true start (i.e. not null event from send)
            //don't want to use GateDragging since it will only see the stale value of sTouchStart here
            const sStart = makeEventStream(DraggableEventType.START, sTouchStart.gate(options.cEnabled).filterNotNull());

            //move events - only if dragging)
            //values are adjusted by offset
            //events are filtered by validation
            const sMove = makeEventStream(DraggableEventType.MOVE, OnlyIfDragging(sTouchMove))
                .snapshot(sStart.hold(null), (moveEvent, initEvent) => ChangeEventPoint(moveEvent, getOffset(moveEvent.point, initEvent.localPoint)))
                .filter(evt => options.validator(evt));

            //end events - only if dragging
            //gestures are detected and added here
            const sEnd = makeEventStream(DraggableEventType.END, OnlyIfDragging(sTouchEnd))
                .snapshot(sStart.hold(null), (endEvent, initEvent) => ChangeEventGesture(endEvent, getGesture(initEvent, endEvent)));

            /* mappings for external use */
            
            //all merged into one single event stream
            //this is correct, since only one of these should be happening at any moment in time
            this.sEvent = sStart.orElse(sMove).orElse(sEnd);

            /* frp listeners for side-effects */
            const unlisteners = new Array<() => void>();
            unlisteners.push(
                sStart.listen(() => toggleGlobalListeners(true)),
                sEnd.listen(() => toggleGlobalListeners(false)),
                sMove.listen(evt => displayTarget.position.set(evt.point.x, evt.point.y)),

                //sStart.listen(() => console.log("START")), sMove.listen(() => console.log("Move")), sEnd.listen(() => console.log("END"))
            );

            /* helper functions */

            function makeEventStream(eventType: DraggableEventType, stream: Stream<PIXI.interaction.InteractionEvent>): Stream<DraggableEvent> {

                return stream.map(evt =>
                    Object.freeze({
                        type: eventType,
                        displayTarget: displayTarget,
                        point: getPointFromEvent(evt, displayTarget.parent),
                        localPoint: getPointFromEvent(evt, displayTarget),
                        timestamp: Date.now(),
                        pixiEvent: evt
                    })
                );
            }

            function getPointFromEvent(evt: PIXI.interaction.InteractionEvent, coordsTarget: PIXI.DisplayObject): PIXI.Point {
                //note - for performance increase in exchange for purity, a local cached point could be used instead of undefined in getLocalPosition()
                return evt.data.getLocalPosition(coordsTarget, undefined, evt.data.global)
            }

            function OnlyIfDragging<T>(stream: Stream<T>) {
                return stream
                    .gate(options.cEnabled)
                    .gate(sTouchStart.map(evt => evt === null ? false : true).hold(false)) //if dragging)
                    
            }

            function getOffset(movePoint: PIXI.Point, offsetPoint: PIXI.Point): PIXI.Point {
                let x = movePoint.x - (offsetPoint.x * displayTarget.scale.x);
                let y = movePoint.y - (offsetPoint.y * displayTarget.scale.y);


                if (options.axisLock !== undefined && (options.axisLock === DraggableAxisLock.X || options.axisLock === DraggableAxisLock.BOTH)) {
                    x = displayTarget.x;
                }
                if (options.axisLock !== undefined && (options.axisLock === DraggableAxisLock.Y || options.axisLock === DraggableAxisLock.BOTH)) {
                    y = displayTarget.y;
                }

                return new PIXI.Point(x, y);
            }

            function getGesture(startEvent: DraggableEvent, endEvent: DraggableEvent): DraggableGesture {
                //just tap for now
                return Gesture_IsTap() ? DraggableGesture.TAP : undefined;

                function Gesture_IsTap(): boolean {
                    const xDiff = Math.abs(startEvent.point.x - endEvent.point.x);
                    const yDiff = Math.abs(startEvent.point.y - endEvent.point.y);
                    const timeDiff = endEvent.timestamp - startEvent.timestamp;

                    return (timeDiff < TAP_TIME_THRESHHOLD && xDiff < TAP_SPACE_THRESHHOLD && yDiff < TAP_SPACE_THRESHHOLD) ? true : false;
                }
            }

            function ChangeEventGesture(event: DraggableEvent, gesture: DraggableGesture): DraggableEvent {
                return Object.freeze(Object.assign({ ...event }, { gesture: gesture }));
            }

            function ChangeEventPoint(event: DraggableEvent, point: PIXI.Point): DraggableEvent {
                return Object.freeze(Object.assign({ ...event }, { point: point }));
            }

            function normalizeOptions(options: DraggableOptions): DraggableOptions {
                if (options === undefined) {
                    return (normalizeOptions({}));
                }

                if (options.cEnabled === undefined) {
                    options.cEnabled = new Cell<boolean>(true);
                }

                if (options.makeInteractive === undefined) {
                    options.makeInteractive = true;
                }

                if (options.validator === undefined) {
                    options.validator = () => true;
                }

                return options;
            }

            /*cleanup */
            this._dispose = () => {
                unlisteners.forEach(unlistener => unlistener());

                displayTarget.off('pointerdown', dispatchStart);

                toggleGlobalListeners(false);
            }
        });
    }

    dispose() {
        this._dispose();
    }
}



