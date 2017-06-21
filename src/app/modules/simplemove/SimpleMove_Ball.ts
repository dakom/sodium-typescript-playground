import {UI_Ball} from "./SimpleMove_UI";
import {CanvasWidth, CanvasHeight } from "../../Main";
import {Stream, Transaction, CellLoop} from "sodiumjs";
import {Listener} from "../../../../node_modules/sodiumjs/dist/lib/Listener";
import * as R from "ramda";
const SPEED = 10;
const RADIUS = 50;
export class Ball extends PIXI.Container {
    private vx:number = SPEED;
    private listener:Listener<number>;

    constructor(sTicks:Stream<number>) {
        super();
        this.addChild(UI_Ball(RADIUS));
        this.once('removed', () => this.cleanup());
        this.y = CanvasHeight/2;

        Transaction.run((): void => {
            let posX = new CellLoop<number>();
            let sUpdate = sTicks.snapshot(posX, (dt, x) => this.getPosition(dt, x));
            posX.loop(sUpdate.hold(0));
            posX.listen(x => {
                console.log(x);
                this.x = x;
            });
        });


    }

    getPosition(dt:number, posX:number):number {
        let xMin = RADIUS;
        let xMax = CanvasWidth - RADIUS;

        posX = R.clamp(xMin, xMax, posX + dt * this.vx);

        if(posX == xMin || posX == xMax) {
            this.vx *= -1;
        }

        //console.log(posX);

        return posX;
    }

    cleanup() {
       // this.listener.unlisten();
    }
}