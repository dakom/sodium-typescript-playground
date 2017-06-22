import { CanvasWidth, CanvasHeight } from "../../main/Main";
import { Stream, Transaction, CellLoop, Cell } from "sodiumjs";
import { UpdateMotion, Motion, NewMotion } from "./Bunny_Motion";
import { BaseContainer } from "../BaseContainer"
import * as R from "ramda";

export class Bunny extends PIXI.Sprite {
    public motion:Motion;

    constructor(texture: PIXI.Texture) {
        super(texture)
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this.motion = NewMotion();
    }

    public render(motion:Motion) {
        this.x = this.motion.origin.x;
        this.y = this.motion.origin.y;
    }
}