import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink, Tuple2, lambda2, lambda3 } from "sodiumjs";
import { BaseContainer } from "../../../lib/display/BaseContainer";
import { Menu, CreateMenuItem } from "../../../lib/menu/Menu";
import { Main, CanvasWidth, CanvasHeight } from "../../main/Main";
import { Shape } from "./Move_Shape";
import * as R from "ramda";

export class Move extends BaseContainer {
    private unlisteners: Array<() => void>;

    constructor() {
        super();
        this.unlisteners = new Array<() => void>();


        const shapes = this.createShapes();

        Transaction.run((): void => {
            //get first touch from all shapes into one stream
            const sTouchStart = shapes
                .map(shape => shape.sTouchStart)
                .reduce((acc: Stream<PIXI.interaction.InteractionEvent>, elem: Stream<PIXI.interaction.InteractionEvent>) => acc.orElse(elem),
                new Stream<PIXI.interaction.InteractionEvent>());

            //get the shape that was touched
            const cShape = sTouchStart
                .map(evt => evt.currentTarget as Shape).hold(null);

            //get move and end event streams
            const sMove = new StreamSink<PIXI.interaction.InteractionEvent>();
            const sEnd = new StreamSink<PIXI.interaction.InteractionEvent>();

            //dragging state (boolean, whether there's a valid event in sTouchStart or not)
            const cDragging = sTouchStart
                .orElse(sEnd)
                .map(evt => evt === null ? false : true)
                .hold(false);

            //get the init position offset when an object is touched
            const cInitPosition = sTouchStart
                .map(evt => evt.data.getLocalPosition(evt.currentTarget, undefined, evt.data.global))
                .hold(new PIXI.Point());

            //get the move position
            const sMovePosition = sMove
                .gate(cDragging) //but only if we're dragging
                .snapshot(cShape, (evt, shape) => evt.data.getLocalPosition(shape.parent, undefined, evt.data.global));
            
            //hold the value in a cell
            const cPosition = sMovePosition.hold(new PIXI.Point());

            //listeners - only to apply the changes visually
            this.unlisteners.push(
                sTouchStart.listen(evt => {
                    shapes.forEach(shape => {
                        shape.selected = (evt.currentTarget === shape)
                    });
                }),
                
                //TODO - remove this... maybe use lambda below?
                cInitPosition.listen(() => {}),

                sMovePosition.listen(position => {
                    cShape.lift3(cInitPosition, cPosition, (shape, initPos, pos) => {
                        shape.position.set(pos.x - initPos.x, pos.y - initPos.y);
                    });
                }),

                sEnd.listen(evt => {
                    shapes.forEach(shape => {
                        shape.selected = false;
                    });
                })
            );

            //global listeners for move and end (helps deal with fast movement mismatches)
            Main.app.renderer.plugins.interaction.on('pointermove', evt => sMove.send(evt));
            Main.app.renderer.plugins.interaction.on('pointerup', evt => sEnd.send(null));
            Main.app.renderer.plugins.interaction.on('pointeroutside', evt => sEnd.send(null));
        });
    }

    createShapes() {
        let shapes = new Array<Shape>(
            new Shape("circle", 0xFF0000, 0x0),
            new Shape("square", 0x00FF00, 0x0),
            new Shape("triangle", 0x0000FF, 0x0),
        );
        let xOffset = 300;
        shapes.forEach(shape => {
            shape.x = xOffset;
            shape.y = 300;
            xOffset += 300;
            this.addChild(shape);
        });

        return shapes;
    }

    dispose() {
        this.unlisteners.forEach(unlistener => unlistener());
        Main.app.renderer.plugins.interaction.off('pointermove');
        Main.app.renderer.plugins.interaction.off('pointerup');
        Main.app.renderer.plugins.interaction.off('pointeroutside');
    }
}