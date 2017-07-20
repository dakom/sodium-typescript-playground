import { spreadPosition} from "../../../lib/funcs/PrimitiveFuncs";
import * as R from "ramda";

export class Row_UI extends PIXI.Container {
    constructor(onColor: number, offColor: number) {
        super();
        const blocks = R.repeat(null, 16).map(() => new Block_UI(onColor, offColor));

        const positions = spreadPosition(10, "width", blocks);
        R.zipWith((ref, x) => ref.x = x, blocks, positions);

        blocks.forEach(block => this.addChild(block))
    }
}

export class Block_UI extends PIXI.Graphics {
    constructor(private onColor: number, private offColor: number) {
        super();

        this.beginFill(0xFFFFFF, 1.0);
        this.drawRoundedRect(0, 0, 50, 50, 10);
        this.endFill();
    }
    redraw(selected: boolean) {
        this.tint = selected ? this.onColor : this.offColor;
    }
}