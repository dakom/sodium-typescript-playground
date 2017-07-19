import { Transaction, StreamSink, Stream, Cell, Tuple2 } from "sodiumjs";
import { Main } from "../../app/main/Main";
import { DraggableValidator } from "./Draggable_Validator";

export enum DraggableAxisLock {
    NONE,
    X,
    Y,
    BOTH
}


export class Draggable {
    //streams for listening externally
    //for move, use the provided point rather than the DisplayObject position
    public sStart: Stream<PIXI.DisplayObject>;
    public sMove: Stream<Tuple2<PIXI.DisplayObject, PIXI.Point>>;
    public sEnd: Stream<PIXI.DisplayObject>;

    //references for dispose()
    private unlisteners: Array<() => void>;

    private dispatchStart: (evt: PIXI.interaction.InteractionEvent) => void;
    private dispatchMove: (evt: PIXI.interaction.InteractionEvent) => void;
    private dispatchEnd: (evt: PIXI.interaction.InteractionEvent) => void;

    constructor(private displayTarget: PIXI.DisplayObject, validator?:DraggableValidator, axisLock?:DraggableAxisLock) {
        displayTarget.interactive = displayTarget.buttonMode = true;

        this.unlisteners = new Array<() => void>();

        if(validator === undefined) {
            validator = (displayTarget, point) => true;
        }

        if(axisLock === undefined) {
            axisLock = DraggableAxisLock.NONE;
        }

        Transaction.run((): void => {
            //touch streams
            const sTouchStart = new StreamSink<PIXI.interaction.InteractionEvent>();
            const sTouchMove = new StreamSink<PIXI.interaction.InteractionEvent>();
            const sTouchEnd = new StreamSink<PIXI.interaction.InteractionEvent>();

            //get the init position offset when it's touched
            const cInitPosition = sTouchStart
                //get coordinates relative to the object itself (i.e. inner coordinates)
                .map(evt => evt.data.getLocalPosition(displayTarget, undefined, evt.data.global))
                .hold(new PIXI.Point());

            //dragging state (boolean, whether there's a valid event in sTouchStart or not)
            const cDraggingGate = sTouchStart
                .orElse(sTouchEnd.map(evt => null)) //map sTouchEnd to always be null for evaluation purposes here
                .map(evt => evt === null ? false : true)
                .hold(false);

            //get the move position, only if we're dragging
            const sMovePositionTest = sTouchMove
                .gate(cDraggingGate)
                .snapshot(cInitPosition, (evt, initPos) => {
                    //map to coordinates based on parent
                    const pos = evt.data.getLocalPosition(displayTarget.parent, undefined, evt.data.global);
                    pos.x -= initPos.x;
                    pos.y -= initPos.y;

                    //account for axis lock
                    if(axisLock === DraggableAxisLock.X || axisLock === DraggableAxisLock.BOTH) {
                        pos.x = displayTarget.x;
                    }
                    if(axisLock === DraggableAxisLock.Y || axisLock === DraggableAxisLock.BOTH) {
                        pos.y = displayTarget.y;
                    }

                    return pos;
                })
            //and only if it passes validation
            const cValidatedGate = sMovePositionTest
                .map(pos => validator(displayTarget, pos))
                .hold(false);
            const sMovePosition = sMovePositionTest.gate(cValidatedGate);

            //assignments for external and internal use
            this.sStart = sTouchStart.map(evt => displayTarget);
            this.sMove = sMovePosition.map(p => new Tuple2<PIXI.DisplayObject, PIXI.Point>(displayTarget, p));
            this.sEnd = sTouchEnd.map(evt => displayTarget);

            //named callbacks so that we can off() them explicitly
            this.dispatchStart = evt => sTouchStart.send(evt);
            this.dispatchMove = evt => sTouchMove.send(evt);
            this.dispatchEnd = evt => sTouchEnd.send(evt);
 
            //display listener
            displayTarget.on('pointerdown', this.dispatchStart);

            //frp listeners
            this.unlisteners.push(
                //use named functions so we can remove them
                this.sStart.listen(d => {
                    Main.app.renderer.plugins.interaction.on('pointermove', this.dispatchMove);
                    Main.app.renderer.plugins.interaction.on('pointerup', this.dispatchEnd);
                    Main.app.renderer.plugins.interaction.on('pointeroutside', this.dispatchEnd);
                }),
                this.sEnd.listen(d => {
                    
                    Main.app.renderer.plugins.interaction.off('pointermove', this.dispatchMove);
                    Main.app.renderer.plugins.interaction.off('pointerup', this.dispatchEnd);
                    Main.app.renderer.plugins.interaction.off('pointeroutside', this.dispatchEnd);
                }),

                //move it!
                this.sMove.listen(t => {
                    t.a.position.set(t.b.x, t.b.y)
                }),
            );
        });
    }

    dispose() {
        this.unlisteners.forEach(unlistener => unlistener());

        this.displayTarget.off('pointerdown', this.dispatchStart);

        Main.app.renderer.plugins.interaction.off('pointermove', this.dispatchMove);
        Main.app.renderer.plugins.interaction.off('pointerup', this.dispatchEnd);
        Main.app.renderer.plugins.interaction.off('pointeroutside', this.dispatchEnd);
    }
}



