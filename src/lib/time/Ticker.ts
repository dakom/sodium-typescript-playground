import { Stream, StreamSink } from "sodiumjs";

export class Ticker {
    private readonly sink: StreamSink<number>;
    private readonly ticker: PIXI.ticker.Ticker;

    private unlistener:() => void;

    constructor(autoStart?:boolean) {
        if(autoStart !== false) {
            autoStart = true;
        }

        this.sink = new StreamSink<number>();
        // A dummy listener to time to keep it alive even when there are no other listeners.
        //see https://github.com/SodiumFRP/sodium-typescript/blob/master/src/lib/TimerSystem.ts#L45
        this.unlistener = this.sink.listen(t => {});

        this.ticker = new PIXI.ticker.Ticker();
        this.ticker.add(deltaTime => {
            this.sink.send(deltaTime);
        });   

        if(autoStart) {
            this.start();
        }
    }
    public get sTicks(): Stream<number> {
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