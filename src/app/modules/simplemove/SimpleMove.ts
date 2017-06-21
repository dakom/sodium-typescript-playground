
import { Ticker } from "../../../lib/time/Ticker";
import { Transaction, CellLoop } from "sodiumjs";
import { Ball } from "./SimpleMove_Ball";

export class SimpleMove extends PIXI.Container {
    private ball:Ball;

    constructor() {
        super();
        this.once('removed', () => this.cleanup());

        //IO is basically in setup and listen()        
        let sTicks = new Ticker().sTicks;
        this.ball = new Ball(sTicks);
        this.addChild(this.ball);


    }

    cleanup() {
        
        console.log("cleaning up simple ball move...");
    }
}