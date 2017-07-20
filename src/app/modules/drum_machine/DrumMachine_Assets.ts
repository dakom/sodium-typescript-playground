import {Path} from "../../../lib/path/Path";
import {Stream, StreamSink} from "sodiumjs";
import {CanvasWidth} from "../../main/Main";

export class Assets {
    private loader:PIXI.loaders.Loader;
    
    load(sampleIds:Array<string>):Stream<PIXI.loaders.ResourceDictionary> {
        const loader = new PIXI.loaders.Loader();

        const sLoad = new StreamSink<PIXI.loaders.ResourceDictionary>();
        sampleIds.forEach(sampleId => loader.add(sampleId, Path.GetAudioPath(sampleId + `.wav`)));
        loader.once("complete", () => {
            sLoad.send(this.loader.resources);
        })
        loader.load();

        this.loader = loader;
        return sLoad;
    }

    dispose():void {
        this.loader.reset();
    }
}