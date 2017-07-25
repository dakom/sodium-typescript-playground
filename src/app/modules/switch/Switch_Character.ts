import { Assets } from "./Switch_Assets";
import { CanvasWidth, CanvasHeight } from "../../main/Main";
import { Transaction, CellSink, Cell, Stream, CellLoop } from "sodiumjs";
import { Frames } from "../../../lib/time/Frames";
import * as R from "ramda";

export class CharacterConfig {
    constructor(public readonly baseId: string, public readonly len: number, public readonly scale: number) {}
}

export class Character  {
    private _textures: Array<PIXI.Texture>;
    private _cFrame:CellLoop<number>;

    private frames:Frames;

    constructor(public readonly config:CharacterConfig) {
        //continuously update frame count
        Transaction.run((): void => {
            this._cFrame = new CellLoop<number>();
            this._cFrame.listen(() => {}); //required dummy listener
            this.frames = new Frames(3); //arbitrary frame speed to look okay
            const sFrameUpdate = this.frames.sFrames.snapshot(this._cFrame, (dt, val) => {
                if(val == config.len -1) {
                    val = 0;
                }

                return val+1;
            });
            this._cFrame.loop(sFrameUpdate.hold(1));
        });
    }


    public get cFrame():Cell<number> {
        return this._cFrame;
    }

    public get cTexture():Cell<PIXI.Texture> {
        return this._cFrame.map(num => this.getTexture(num));
    }

    public dispose() {
       this.frames.stop();
    }
    public prepAssets(assets: Assets) {
        this._textures = this.getPaths().map(path => assets.getTexture(path));
    }

    public getTexture(fNum:number):PIXI.Texture {
        return this._textures[fNum];
    }

    public getPaths(): Array<string> {
       return R.times((n) => this.getPath(n+1), this.config.len);
    }
   

    getPath(frame: number): string {
        const digit = (frame < 10) ? "0" + frame : frame.toString();

        return this.config.baseId + "/" + this.config.baseId + "_" + digit;
    }
}