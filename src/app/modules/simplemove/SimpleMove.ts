import { CanvasWidth, CanvasHeight } from "../../Main";
import { Ticker } from "../../../lib/time/Ticker";
import { Transaction,CellLoop} from "sodiumjs";
import {createBall} from "./SimpleMove_UI";

export class SimpleMove extends PIXI.Container {
    constructor() {
        super();
        this.once('removed', () => this.cleanup());

        //IO is basically in setup and listen()        
        let ball = createBall(CanvasWidth/2, CanvasHeight/2);
        this.addChild(ball);

        Transaction.run((): void => {
            let sTicks = new Ticker().sTicks;
            let ballX = new CellLoop<number>();
            let sUpdate = sTicks.snapshot(ballX, (dt, x) => dt + x);
            ballX.loop(sUpdate.hold(0));
            ballX.listen(x => {
                ball.x = x;
            });
        });
    }

    cleanup() {
        console.log("cleaning up simple ball move...");
    }
}