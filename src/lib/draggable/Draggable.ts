import { Transaction, StreamSink, Stream, Cell } from "sodiumjs";
import { Main } from "../../app/main/Main";
import { DraggableValidator } from "./Draggable_Validator";

const TAP_SPACE_THRESHHOLD = 2;
const TAP_TIME_THRESHHOLD = 250;

export enum DraggableAxisLock {
    X,
    Y,
    BOTH
}

export interface DraggableOptions {
    forceInteractive?: boolean; //default true
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
    readonly timestamp: number;
    readonly pixiEvent: PIXI.interaction.InteractionEvent;
    readonly gesture?: DraggableGesture;
}

export class Draggable {
    public sEvent: Stream<DraggableEvent>;

    //references for dispose()
    private _dispose: () => void;


    constructor(public readonly displayTarget: PIXI.DisplayObject, options?: DraggableOptions) {
        options = normalizeOptions(options);

        if (options.forceInteractive) {
            displayTarget.interactive = displayTarget.buttonMode = true;
        }

        Transaction.run((): void => {
            //touch streams
            const sTouchStart = new StreamSink<PIXI.interaction.InteractionEvent>();
            const sTouchMove = new StreamSink<PIXI.interaction.InteractionEvent>();
            const sTouchEnd = new StreamSink<PIXI.interaction.InteractionEvent>();

            //shorthand for getting only the active start events
            const sTouchStartActive = sTouchStart
                .filterNotNull();

            //touch start events
            const sStart = sTouchStartActive
                .map(evt => makeEvent(DraggableEventType.START, evt, true));

            //contains initial position at first touch
            const cStartPosition = sStart
                .hold(null);

            //contains initial offset at first touch
            const cStartOffset = sTouchStartActive
                .map(evt => makeEvent(null, evt, false))
                .hold(null);

            //gate to check if dragging
            const cDragging = sTouchStart
                .map(evt => evt === null ? false : true)
                .hold(false);

            //move events - only if dragging
            //values are adjusted by offset
            //events are filtered by validation
            const sMove = sTouchMove
                .gate(cDragging)
                .map(evt => makeEvent(DraggableEventType.MOVE, evt, true))
                .snapshot(cStartOffset, (moveEvent, offsetEvent) => ChangeEventPoint(moveEvent, getOffset(moveEvent.point, offsetEvent.point)))
                .filter(evt => options.validator(evt));

            //end events - only if dragging
            //gestures are detected and added here
            const sEnd = sTouchEnd
                .gate(cDragging)
                .map(evt => makeEvent(DraggableEventType.END, evt, true))
                .snapshot(cStartPosition, (endEvent, initEvent) => ChangeEventGesture(endEvent, getGesture(initEvent, endEvent)));

            //mappings for external use - all merged into one single event stream
            //this is correct, since only one of these should be happening at any moment in time
            this.sEvent = sStart.orElse(sMove).orElse(sEnd);

            //frp listeners for side-effects
            const unlisteners = new Array<() => void>();
            unlisteners.push(
                sTouchStart.listen(() => toggleGlobalListeners(true)),
                sTouchEnd.listen(() => toggleGlobalListeners(false)),
                sMove.listen(evt => displayTarget.position.set(evt.point.x, evt.point.y)),
            );

            //display listeners, named so that we can off() them explicitly
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

            //cleanup
            this._dispose = () => {
                unlisteners.forEach(unlistener => unlistener());

                displayTarget.off('pointerdown', dispatchStart);

                toggleGlobalListeners(false);
            }
        });


        //helper functions
        function makeEvent(eventType: DraggableEventType, evt: PIXI.interaction.InteractionEvent, coordsIsParent: boolean): DraggableEvent {
            //note - for performance increase in exchange for purity, a local cached point could be used instead of undefined
            return Object.freeze({
                type: eventType,
                displayTarget: displayTarget,
                point: evt.data.getLocalPosition(coordsIsParent ? displayTarget.parent : displayTarget, undefined, evt.data.global),
                timestamp: Date.now(),
                pixiEvent: evt
            });
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

            if (options.forceInteractive === undefined) {
                options.forceInteractive = true;
            }

            if (options.validator === undefined) {
                options.validator = () => true;
            }

            return options;

        }
    }

    dispose() {
        this._dispose();
    }
}



