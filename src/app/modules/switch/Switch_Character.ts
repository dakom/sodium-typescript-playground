import { Assets } from "./Switch_Assets";
import * as R from "ramda";
import { CanvasWidth, CanvasHeight } from "../../main/Main";
import { CellSink, Cell } from "sodiumjs";

export class Character extends PIXI.Sprite {
    private currentFrame = 1;
    private _cTexture: CellSink<PIXI.Texture>
    private _textures: Array<PIXI.Texture>;
    private _paths:Array<string>;

    constructor(private baseId: string, assets: Assets, len: number, scale: number) {
        super();
        this.anchor.set(.5, .5);
        this.x = CanvasWidth / 2;
        this.y = CanvasHeight / 2;
        this.scale.set(scale, scale);

        this._paths = new Array<string>();
        for (let i = 1; i < len; i++) {
            this._paths.push(this.getPath(i));
        }

        assets.cLoad.listen(ready => {
            if (ready) {
                this._textures = new Array<PIXI.Texture>();
                for (let i = 1; i < len; i++) {
                    this._textures.push(assets.getTexture(this.getPath(i)))
                }
                this._cTexture = new CellSink<PIXI.Texture>(this._textures[0]);
            }
        });
    }

    public get paths():Array<string> {
        return this._paths;
    }

    public updateTexture() {
        this._cTexture.send(this._textures[this.currentFrame]);

        if (++this.currentFrame === this._textures.length) {
            this.currentFrame = 0;
        }
    }

    public get cTexture(): Cell<PIXI.Texture> {
        return this._cTexture;
    }

    getPath(frame: number): string {
        let digit = frame.toString();
        if (frame < 10) {
            digit = "0" + frame;
        }

        return this.baseId + "/" + this.baseId + "_" + digit;
    }
}