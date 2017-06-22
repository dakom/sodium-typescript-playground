import {UI_Ball} from "./SimpleMove_UI";
import {CanvasWidth, CanvasHeight } from "../../main/Main";
import {Stream, Transaction, CellLoop} from "sodiumjs";
import {BaseContainer} from "../BaseContainer"
import * as R from "ramda";

const SPEED = 10;
const RADIUS = 50;

interface Motion {
    x:number;
    v:number;
}

export class Ball extends BaseContainer {
    private unlistener:() => void;

    constructor(private sTicks:Stream<number>) {
        super();
        this.addChild(UI_Ball(RADIUS));
        this.y = CanvasHeight/2;


        Transaction.run((): void => {
            let cMotion = new CellLoop<Motion>();
            let sUpdate = sTicks.snapshot(cMotion, (dt, motion) => this.getMotion(dt, motion));
            cMotion.loop(sUpdate.hold({
                x: 0,
                v: SPEED
            }));
            this.unlistener = cMotion.listen(motion => {
                //console.log(x);
                this.x = motion.x;
            });
        });
    }

    getMotion(dt:number, _motion:Motion):Motion {
        let xMin = RADIUS;
        let xMax = CanvasWidth - RADIUS;
        let xUpdate = R.clamp(xMin, xMax, _motion.x + dt * _motion.v);
        let motion = R.set(R.lensProp("x"), xUpdate, _motion);

        if(motion.x == xMin || motion.x == xMax) {
            motion.v *= -1;
        }

        return motion;
    }

    dispose() {
       this.unlistener();
    }
}