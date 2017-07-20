import {Path} from "../../../lib/path/Path";
import {Stream, StreamSink} from "sodiumjs";
import {CanvasWidth} from "../../main/Main";


export class Assets {
    private loader:PIXI.loaders.Loader;
    constructor() {
    }

    load():Stream<boolean> {
        const loader = new PIXI.loaders.Loader();

        const sLoad = new StreamSink<boolean>();
        loader.add("brush", Path.GetImagePath("brush.png"));
        loader.once("complete", () => {
            sLoad.send(true);
        })
        loader.load();

        this.loader = loader;
        return sLoad;
    }

    public getTexture():PIXI.Texture {
        
        return this.loader.resources["brush"].texture;
    }

    dispose():void {
        this.getTexture().destroy();
        this.loader.reset();
    }
}