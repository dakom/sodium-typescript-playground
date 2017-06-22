
import { Ticker } from "../../../lib/time/Ticker";
import { Transaction, CellLoop } from "sodiumjs";
import { Ball } from "./SimpleMove_Ball";
import { IDisposable } from "../../interfaces/IDisposable";

export class SimpleMove extends PIXI.Container implements IDisposable {
    private ball:Ball;
    private ticker:Ticker;

    constructor() {
        super();

        this.ticker = new Ticker();
        this.ball = new Ball(this.ticker.sTicks);
        this.addChild(this.ball);
    }

    public dispose() {
        this.ticker.dispose();
        this.ball.dispose();
    }
}