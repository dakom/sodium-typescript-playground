import * as R from "ramda";

import {UI_Ball} from "./Simple_UI";
import {CanvasWidth, CanvasHeight } from "../../main/Main";
import {Stream, Transaction, CellLoop} from "sodiumjs";
import { SelfDisposingContainer } from "../../../lib/display/SelfDisposingContainer";

const SPEED = 10;
const RADIUS = 50;

interface Motion {
    x:number;
    v:number;
}

export class Ball extends SelfDisposingContainer {
    private unlistener:() => void;

    constructor(private sTicks:Stream<number>) {
        super();
        this.addChild(UI_Ball(RADIUS));
        this.y = CanvasHeight/2;


        Transaction.run((): void => {
            const cMotion = new CellLoop<Motion>();
            const sUpdate = sTicks.snapshot(cMotion, (dt, motion) => this.getMotion(dt, motion));
            cMotion.loop(sUpdate.hold({
                x: 0,
                v: SPEED
            }));
            this.unlistener = cMotion.listen(motion => this.x = motion.x);
        });
    }

    getMotion(dt:number, _motion:Motion):Motion {
        const xMin = RADIUS;
        const xMax = CanvasWidth - RADIUS;
        const xUpdate = R.clamp(xMin, xMax, _motion.x + dt * _motion.v);
        const motion = R.set(R.lensProp("x"), xUpdate, _motion);
        
        if(motion.x == xMin || motion.x == xMax) {
            motion.v *= -1;
        }

        return motion;
    }

    dispose() {
       this.unlistener();
    }
}