import {Path} from "../../../lib/path/Path";
import {Cell, CellSink} from "sodiumjs";
import {CanvasWidth} from "../../main/Main";


export class Assets {
    private loader:PIXI.loaders.Loader;
    private _cLoad = new CellSink<boolean>(false);
    constructor() {
    }

    load(ids:Array<string>) {
        let loader = new PIXI.loaders.Loader();

        ids.forEach(id => loader.add(id, Path.GetImagePath(id) + ".png"));
        loader.once("complete", () => {
            this._cLoad.send(true);
        })
        loader.load();

        this.loader = loader;
    }

    public get cLoad():Cell<boolean> {
        return this._cLoad;
    }

    public getTexture(id:string):PIXI.Texture {
        return this.loader.resources[id].texture;
    }

    dispose():void {
        this.loader.reset();
    }
}