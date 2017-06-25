import { Stream, StreamSink } from "sodiumjs";

export class Frames {
    private readonly sink: StreamSink<number>;
    private readonly ticker: PIXI.ticker.Ticker;

    private unlistener: () => void;



    constructor(framerate: number) {

        let accumTime = 0;

        this.sink = new StreamSink<number>();
        // A dummy listener to time to keep it alive even when there are no other listeners.
        //see https://github.com/SodiumFRP/sodium-typescript/blob/master/src/lib/TimerSystem.ts#L45
        this.unlistener = this.sink.listen(t => { });

        this.ticker = new PIXI.ticker.Ticker();
        this.ticker.add(deltaTime => {
            if ((accumTime += deltaTime) >= 3) {
                accumTime = 0;
                this.sink.send(accumTime);
            }
        });

        this.start();
    }

    public get sFrames(): Stream<number> {
        return this.sink;
    }

    public start() {
        this.ticker.start();
    }

    public stop() {
        this.ticker.stop();
    }

    public dispose() {
        this.stop();
        this.unlistener();
    }
}