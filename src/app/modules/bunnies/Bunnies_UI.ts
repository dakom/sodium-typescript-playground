import {Path} from "../../../lib/path/Path";
import {Cell, CellSink} from "sodiumjs";

export class Bunnies_UI {
    private loader:PIXI.loaders.Loader;
    
    load():Cell<boolean> {
        let cLoad = new CellSink<boolean>(false);

        let loader = new PIXI.loaders.Loader();

        loader.add("bunny", Path.GetImagePath("bunny.png"));
        loader.once("complete", () => {
            console.log("loaded");
            cLoad.send(true);
        })
        loader.load();

        this.loader = loader;
        return cLoad;
    }

    public get texture():PIXI.Texture {
        return this.loader.resources["bunny"].texture;
    }

    dispose():void {
        this.loader.reset();
    }
}