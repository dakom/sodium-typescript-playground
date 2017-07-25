import { Operational, Stream, CellLoop, StreamSink, Transaction } from "sodiumjs";
import { Ticker } from "./Ticker";

export class Frames {
    private _sFrames: Stream<number>;
    private ticker: Ticker;
    private unlistener: () => void;

    constructor(speedLimit: number) {
        this.ticker = new Ticker();

        Transaction.run((): void => {
            //get the updated time in intervals limited by speedLimit
            const cTime = this.ticker.sTicks.accum(0, (deltaTime, accumTime) => 
                ((accumTime += deltaTime) >= speedLimit) ? 0 : accumTime + deltaTime
            );

            //convert these into frame updates (when interval === 0)
            const cFrame = Operational.updates(cTime)
                .filter(n => n === 0)
                .accum(0, (n, accumFrames) => accumFrames + 1);

            //get a stream for outside listening
            this._sFrames = Operational.updates(cFrame);

            // A dummy listener to time to keep it alive even when there are no other listeners.
            //see https://github.com/SodiumFRP/sodium-typescript/blob/master/src/lib/TimerSystem.ts#L45
            this.unlistener = this._sFrames.listen(() => {});
        });
    }

    public get sFrames(): Stream<number> {
        return this._sFrames;
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