import { Assets } from "./Switch_Assets";
import * as R from "ramda";
import { CanvasWidth, CanvasHeight } from "../../main/Main";
import { Transaction, CellSink, Cell, Stream, CellLoop } from "sodiumjs";
import { Frames } from "../../../lib/time/Frames";

export class Character  {
    private _textures: Array<PIXI.Texture>;
    private _paths: Array<string>;
    private _cFrame:CellLoop<number>;

    private frames:Frames;

    constructor(private baseId: string, private len: number, public scale: number) {

        this._paths = new Array<string>();
        for (let i = 1; i < len; i++) {
            this._paths.push(this.getPath(i));
        }

        Transaction.run((): void => {
            this._cFrame = new CellLoop<number>();
            this._cFrame.listen(() => {});
            this.frames = new Frames(3);
            const sFrameUpdate = this.frames.sFrames.snapshot(this._cFrame, (dt, val) => {
                if(val == len -1) {
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
        this._textures = new Array<PIXI.Texture>();
        for (let i = 1; i < this.len; i++) {
            this._textures.push(assets.getTexture(this.getPath(i)))
        }
       
    }

    public getTexture(fNum:number):PIXI.Texture {
        return this._textures[fNum];
    }

    public get paths(): Array<string> {
        return this._paths;
    }

   

    getPath(frame: number): string {
        let digit = frame.toString();
        if (frame < 10) {
            digit = "0" + frame;
        }

        return this.baseId + "/" + this.baseId + "_" + digit;
    }
}