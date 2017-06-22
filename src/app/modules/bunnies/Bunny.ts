import { CanvasWidth, CanvasHeight } from "../../main/Main";
import { Stream, Transaction, CellLoop, Cell } from "sodiumjs";
import { Move} from "./Bunny_Move";
import { BaseContainer } from "../BaseContainer"
import * as R from "ramda";

export class Bunny extends PIXI.Sprite {
    constructor(texture: PIXI.Texture, cMove:Cell<Move>) {
        super(texture)
        this.anchor.x = 0.5;
        this.anchor.y = 1;

        cMove.listen(move => {
            this.x = move.origin.x;
            this.y = move.origin.y;
        });
    }
}