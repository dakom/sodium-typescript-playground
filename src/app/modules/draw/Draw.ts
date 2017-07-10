import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink } from "sodiumjs";
import { BaseContainer } from "../../../lib/display/BaseContainer";
import { Assets } from "./Draw_Assets";
import { Canvas } from "./Draw_Canvas";
import { Brush } from "./Draw_Brush";
import { Menu, CreateMenuItem } from "../../../lib/menu/Menu";
import { CanvasWidth, CanvasHeight } from "../../main/Main";

import * as R from "ramda";

export class Draw extends BaseContainer {
    private unlisteners: Array<() => void>;
    private assets:Assets;
   
    constructor() {
        super();
        this.unlisteners = new Array<() => void>();
        this.assets = new Assets();

        const sLoad = this.assets.load();

        this.unlisteners.push(sLoad.listen(b => {
            const brush = new Brush(this.assets.getTexture());
            const canvas = new Canvas(brush);
            
            this.addChild(canvas);
        }));
    }

    dispose() {
        this.unlisteners.forEach(unlistener => unlistener());
       
    }
}