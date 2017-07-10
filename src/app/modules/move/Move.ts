import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink, Tuple2 } from "sodiumjs";
import { BaseContainer } from "../../../lib/display/BaseContainer";
import { Menu, CreateMenuItem } from "../../../lib/menu/Menu";
import { CanvasWidth, CanvasHeight } from "../../main/Main";
import {Shape} from "./Move_Shape";

import * as R from "ramda";

export interface Point {
    x: number;
    y: number;
}

export class Move extends BaseContainer {
    private unlisteners: Array<() => void>;
    
    constructor() {
        super();
        this.unlisteners = new Array<() => void>();
        
        const circle = new Shape("circle", 0xFF0000, 0x0);
        const square = new Shape("square", 0x00FF00, 0x0);
        const triangle = new Shape("triangle", 0x0000FF, 0x0);
        circle.position.set(200, 300);
        square.position.set(400, 300);
        triangle.position.set(600, 300);
        this.addChild(circle);
        this.addChild(square);
        this.addChild(triangle);
        Transaction.run((): void => {
                
        });
    }

    dispose() {
        this.unlisteners.forEach(unlistener => unlistener());
    }
}