import {UI_Ball} from "./SimpleMove_UI";
import {CanvasWidth, CanvasHeight } from "../../Main";
import {Stream, Transaction, CellLoop} from "sodiumjs";
import { IDisposable } from "../../interfaces/IDisposable";
import * as R from "ramda";

const SPEED = 10;
const RADIUS = 50;

export class Ball extends PIXI.Container implements IDisposable {
    private vx:number = SPEED;
    private unlistener:() => void;

    constructor(private sTicks:Stream<number>) {
        super();
        this.addChild(UI_Ball(RADIUS));
        this.y = CanvasHeight/2;

        Transaction.run((): void => {
            let posX = new CellLoop<number>();
            let sUpdate = sTicks.snapshot(posX, (dt, x) => this.getPosition(dt, x));
            posX.loop(sUpdate.hold(0));
            this.unlistener = posX.listen(x => {
                //console.log(x);
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
        
        return posX;
    }

    public dispose() {
       this.unlistener();
    }
}