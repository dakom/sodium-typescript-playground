import {Path} from "../../../lib/path/Path";
import {Stream, StreamSink} from "sodiumjs";
import {CanvasWidth} from "../../main/Main";


export class Assets {
    private loader:PIXI.loaders.Loader;
   
    constructor() {
    }

    load(ids:Array<string>):Stream<boolean> {
       
        let loader = new PIXI.loaders.Loader();

        const sLoad = new StreamSink<boolean>();
        ids.forEach(id => loader.add(id, Path.GetImagePath(id) + ".png"));
        loader.once("complete", () => {
            sLoad.send(true);
        })
        loader.load();

        this.loader = loader;
        return sLoad;
    }

    public getTexture(id:string):PIXI.Texture {
        return this.loader.resources[id].texture;
    }

    dispose():void {
        Object.keys(this.loader.resources)
            .forEach(key => {
                let texture = this.loader.resources[key].texture;
                texture.destroy();
            });
        this.loader.reset();
    }
}