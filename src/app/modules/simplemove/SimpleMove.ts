
import { Ticker } from "../../../lib/time/Ticker";
import { Transaction, CellLoop } from "sodiumjs";
import { Ball } from "./SimpleMove_Ball";
import { BaseContainer } from "../BaseContainer";

export class SimpleMove extends BaseContainer {
    private ball:Ball;
    private ticker:Ticker;

    constructor() {
        super();

        this.ticker = new Ticker();
        this.ball = new Ball(this.ticker.sTicks);
        this.addChild(this.ball);
    }

    dispose() {
        this.ticker.dispose();

        //removing the ball will cause it to dispose itself
        //in pixi, there's no "removed from scene" in v4 - coming in v5!
        this.removeChild(this.ball); 
    }
}