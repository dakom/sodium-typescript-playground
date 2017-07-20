import {Path} from "../../../lib/path/Path";
import {Cell, CellSink} from "sodiumjs";
import {CanvasWidth} from "../../main/Main";

export class UI {
    private loader:PIXI.loaders.Loader;

    public status:PIXI.Text;

    constructor() {
        this.status = new PIXI.Text();
    }

    load():Cell<boolean> {
        const cLoad = new CellSink<boolean>(false);

        const loader = new PIXI.loaders.Loader();

        loader.add("bunny", Path.GetImagePath("bunny.png"));
        loader.once("complete", () => {
            cLoad.send(true);
        })
        loader.load();

        this.loader = loader;
        return cLoad;
    }

    public get texture():PIXI.Texture {
        return this.loader.resources["bunny"].texture;
    }

    updateStatus(text:string) {
        this.status.text = text;
        this.status.x = (CanvasWidth - this.status.width)/2;
    }

    dispose():void {
        this.texture.destroy();
        this.loader.reset();
        
    }
}