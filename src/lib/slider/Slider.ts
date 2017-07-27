import { Transaction, StreamSink, Stream, Cell, Tuple2 } from "sodiumjs";
import { Draggable, DraggableAxisLock, DraggableEventType } from "../draggable/Draggable";
import {HorizontalValidator, VerticalValidator} from "../draggable/Draggable_Validator"
import * as R from "ramda";

export enum Direction {
    HORIZONTAL,
    VERTICAL
}

export interface SliderOptions {
    initPerc: number;
    dir: Direction;
    knob: {
        radius: number;
        color: number;
    }
    track: {
        sizeX: number;
        sizeY: number;
        color: number;
    }
}

export class Slider extends PIXI.Container {
    public sPerc: Stream<number>
    public cPerc: Cell<number>

    private _sForced: StreamSink<PIXI.Point>;
    private _knob:PIXI.DisplayObject;

    constructor(public readonly opts: SliderOptions) {
        super();

        //limits setup
        const min = opts.knob.radius;
        const max = (opts.dir === Direction.HORIZONTAL) ? (opts.track.sizeX - opts.knob.radius) : (opts.track.sizeY - opts.knob.radius);
        
        
        //utility functions
        function getPerc(pos:number):number {
            const clamp = R.clamp(0,1);
            const p = (pos - min) / (max - min);
            return clamp((opts.dir === Direction.VERTICAL) ? 1 - p : p);
        }

        function getPosition(perc:number):number {
            const clamp = R.clamp(min, max);
            const p = (opts.dir === Direction.VERTICAL) ? 1 - perc : perc;
            return clamp((p * (max - min)) + min);
        }

        //ui setup
        const bg = new PIXI.Graphics();
        bg.beginFill(opts.track.color);
        bg.drawRect(0, 0, opts.track.sizeX, opts.track.sizeY);
        bg.endFill();
        this.addChild(bg);

        const knob = new PIXI.Graphics();
        knob.beginFill(opts.knob.color);
        knob.drawCircle(0, 0, opts.knob.radius);
        knob.endFill();
        this._knob = knob;
        this.addChild(knob);

        knob.x = (opts.dir === Direction.HORIZONTAL) ? getPosition(opts.initPerc) : opts.track.sizeX / 2;
        knob.y = (opts.dir === Direction.VERTICAL) ? getPosition(opts.initPerc) : opts.track.sizeY / 2;

        //frp transaction
        Transaction.run((): void => {
            //create dragger
            const kDrag = new Draggable(knob,
                {
                    validator: (opts.dir === Direction.HORIZONTAL) ? HorizontalValidator(min, max) : VerticalValidator(min, max),
                    axisLock: (opts.dir === Direction.HORIZONTAL) ? DraggableAxisLock.Y : DraggableAxisLock.X
                }
            );

            //set perc stream for reading
            this.sPerc = kDrag.sEvent.filter(evt => evt.type === DraggableEventType.MOVE)
                            .map(evt => getPerc((opts.dir === Direction.HORIZONTAL) ? evt.point.x : evt.point.y));
                            
            this.cPerc = this.sPerc.hold(opts.initPerc);
        });
    }
}