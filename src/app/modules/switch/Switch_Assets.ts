import {Path} from "../../../lib/path/Path";
import {Cell, CellSink} from "sodiumjs";
import {CanvasWidth} from "../../main/Main";


export class Assets {
    private loader:PIXI.loaders.Loader;

    constructor() {
    }

    load(ids:Array<string>):Cell<boolean> {
        let cLoad = new CellSink<boolean>(false);

        let loader = new PIXI.loaders.Loader();

        ids.forEach(id => loader.add(id, Path.GetImagePath(id) + ".png"));
        loader.once("complete", () => {
            cLoad.send(true);
        })
        loader.load();

        this.loader = loader;
        return cLoad;
    }

    public getTexture(id:string):PIXI.Texture {
        return this.loader.resources[id].texture;
    }

    dispose():void {
        this.loader.reset();
    }
}