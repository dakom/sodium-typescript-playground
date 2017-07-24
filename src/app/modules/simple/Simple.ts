
import { Ticker } from "../../../lib/time/Ticker";
import { Transaction, CellLoop } from "sodiumjs";
import { Ball } from "./Simple_Ball";
import { SelfDisposingContainer } from "../../../lib/display/SelfDisposingContainer";

export class Simple extends SelfDisposingContainer {
    private _dispose: () => void;

    constructor() {
        super();

        const ticker = new Ticker();
        const ball = new Ball(ticker.sTicks);
        this.addChild(ball);

        this._dispose = () => {
            ticker.dispose();

            //removing the ball will cause it to dispose itself
            //in pixi, there's no "removed from scene" in v4 - coming in v5!
            this.removeChild(ball); 
        }
    }

    dispose() {
        this._dispose();
    }
}