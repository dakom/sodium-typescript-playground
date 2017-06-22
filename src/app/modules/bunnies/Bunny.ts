import { CanvasWidth, CanvasHeight } from "../../main/Main";
import { Stream, Transaction, CellLoop, Cell } from "sodiumjs";
import { Motion} from "./Bunny_Motion";
import { BaseContainer } from "../BaseContainer"
import * as R from "ramda";

export class Bunny extends PIXI.Sprite {
    constructor(texture: PIXI.Texture, cMotion:Cell<Motion>) {
        super(texture)
        this.anchor.x = 0.5;
        this.anchor.y = 1;

        cMotion.listen(motion => {
            this.x = motion.origin.x;
            this.y = motion.origin.y;
        });
    }
}