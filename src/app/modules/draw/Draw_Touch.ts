
import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink, Tuple2 } from "sodiumjs";
import { Point } from "./Draw";

export enum TouchType {
    WAIT,
    START,
    MOVE,
    END
}

export interface TouchInfo {
    type: TouchType;
    point: Point;
}

export class TouchManager {
    
    private _sTouch:Stream<TouchInfo>;

    constructor(private target: PIXI.Sprite) {
        //basic touch setup... raw touches are internal only.
        const sRawTouch = new StreamSink<TouchInfo>();

        target.on('pointerdown', evt => updateRawTouch(TouchType.START, evt));
        target.on('pointermove', evt => updateRawTouch(TouchType.MOVE, evt));
        target.on('pointerup', evt => updateRawTouch(TouchType.END, evt));
        target.on('pointerupoutside', evt => updateRawTouch(TouchType.END, evt));

        function updateRawTouch(touchType: TouchType, evt: PIXI.interaction.InteractionEvent) {
            let touchPoint = evt.data.getLocalPosition(evt.currentTarget, undefined, evt.data.global);
            sRawTouch.send({
                type: touchType,
                point: {
                    x: touchPoint.x >> 0,
                    y: touchPoint.y >> 0
                }
            });
        }

        //validate rawTouch. The validation function gets the oldState via collect()
        //in other words this is a sort of state machine implemented in frp
        //ultimately, it filters out WAIT events
        this._sTouch = sRawTouch.collect(TouchType.WAIT, (touchInfo, state) => {
            //copy the object, for the sake of purity
            let updatedInfo = {
                    type: this.validate(state, touchInfo) ? touchInfo.type : TouchType.WAIT,
                    point: {
                        x: touchInfo.point.x,
                        y: touchInfo.point.y
                    }
                }
                return new Tuple2<TouchInfo, TouchType>(updatedInfo, updatedInfo.type);
            })
            .filter(t => t.type !== TouchType.WAIT);
    }

    public get sTouch(): Stream<TouchInfo> {
        return this._sTouch;
    }

    validate(oldState: TouchType, touchInfo: TouchInfo): boolean {
            //could add more validation here, like maybe geom coordinates
            if (touchInfo.type === TouchType.START) {
                if (oldState === TouchType.WAIT || oldState === TouchType.END) {
                    return true;
                }
            } else if (touchInfo.type === TouchType.MOVE) {
                if (oldState === TouchType.START || oldState === TouchType.MOVE) {
                    return true;
                }
            } else {
                return true;
            }

            return false;
        }
}