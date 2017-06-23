import { Assets } from "./Switch_Assets";
import * as R from "ramda";
import { CanvasWidth, CanvasHeight } from "../../main/Main";
import { CellSink, Cell } from "sodiumjs";

export class Character extends PIXI.Sprite {
    private currentFrame = 0;


    constructor(private baseId: string, private len: number, scale: number) {
        super();
        this.anchor.set(.5, .5);
        this.x = CanvasWidth / 2;
        this.y = CanvasHeight / 2;
        this.scale.set(scale, scale);

       
    }

    public getPaths(): Array<string> {
        let ret = new Array<string>();
        for (let i = 1; i < this.len; i++) {
            ret.push(this.getPath(i));
        }

        return ret;
    }

   

    getPath(frame: number): string {
        let digit = frame.toString();
        if (frame < 10) {
            digit = "0" + frame;
        }

        return this.baseId + "/" + this.baseId + "_" + digit;
    }

    //todo try to make this more pure
    getTexture(assets: Assets):PIXI.Texture {
        this.currentFrame = R.clamp(1, this.len - 1, this.currentFrame);

        let texture = assets.getTexture(this.getPath(this.currentFrame));

        if (++this.currentFrame === this.len) {
            this.currentFrame = 0;
        }

        return texture;
    }
}