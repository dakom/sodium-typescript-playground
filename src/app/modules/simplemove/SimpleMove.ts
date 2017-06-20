import { CanvasWidth, CanvasHeight } from "../../Main";

import * as R from "ramda";
import { TimerStream } from "../../../lib/time/TimerStream";
import { Transform } from "../../../lib/structs/Transform";
import { Transaction,CellLoop} from "sodiumjs";

export class SimpleMove {
    constructor(stage: PIXI.Container) {

        //Just for testing now...
        let graphics = new PIXI.Graphics();
        graphics.beginFill(0xFF0000);
        graphics.drawCircle(0, 0, 40);
        graphics.endFill();
        graphics.y = CanvasHeight / 2;
        graphics.x = CanvasWidth / 2;
        graphics.interactive = graphics.buttonMode = true;
        stage.addChild(graphics);

        Transaction.run((): void => {
            let sTicks = new TimerStream().sTicks;

            let ballX = new CellLoop<number>();
            let sUpdate = sTicks.snapshot(ballX, (dt, x) => dt + x);
            ballX.loop(sUpdate.hold(0));
            ballX.listen(x => graphics.x = x);
        });

    }
}