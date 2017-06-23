import { CanvasWidth, CanvasHeight } from "../../main/Main";
import { Stream, Transaction, CellLoop, Cell } from "sodiumjs";
import { UpdateMotion, Motion, NewMotion } from "./Bunny_Motion";
import * as R from "ramda";

export class Bunny extends PIXI.Sprite {
    public motion:Motion;

    constructor(texture: PIXI.Texture) {
        super(texture)
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this.motion = NewMotion();
    }

    public render(_motion:Motion) {
        
        this.x = _motion.origin.x;
        this.y = _motion.origin.y;
        this.motion = _motion;
    }
}