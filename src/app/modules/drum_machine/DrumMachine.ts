import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink, Tuple2, lambda2, lambda3 } from "sodiumjs";
import { BaseContainer } from "../../../lib/display/BaseContainer";
import { Menu, CreateMenuItem } from "../../../lib/menu/Menu";
import { Main, CanvasWidth, CanvasHeight } from "../../main/Main";
import {Samplers} from "./DrumMachine_Samplers";
import {Timer} from "./DrumMachine_Timer";
import {Slider, Direction, SliderOptions} from "../../../lib/slider/Slider";


export class DrumMachine extends BaseContainer {
    private unlisteners: Array<() => void>;

    constructor() {
        super();

        this.unlisteners = new Array<() => void>();

        //ui and container setup
        const samplers = new Samplers();
        samplers.x = (CanvasWidth - samplers.width)/2;
        samplers.y = (CanvasHeight - samplers.height)/2;
        this.addChild(samplers);

        const timer = new Timer();
        timer.x = samplers.x;
        timer.y = samplers.y + samplers.height + 30;
        this.addChild(timer);

        const slider = new Slider(this.getSliderOptions((timer.y + timer.height) - samplers.y));
        slider.x = samplers.x + samplers.width + 40;
        slider.y = samplers.y;
        this.addChild(slider);

        //frp transaction
        Transaction.run((): void => {
            //start the timer with a hookup to slider for speed control
            timer.start(slider.sPerc.hold(slider.opts.initPerc));

            //get the current samples and play
            this.unlisteners.push(
                samplers.getSamples(timer.cMeasure).listen(samples => {
                    samples.forEach(sampleId => {
                        console.log(sampleId);
                    });    
                })
            );
                
        });
    }

   getSliderOptions(size:number):SliderOptions {
       return {
            initPerc: .25,
            dir: Direction.VERTICAL,
            knob: {
                radius: 25,
                color: 0xFF0000
            },
            track: {
                sizeX: 50,
                sizeY: size,
                color: 0x00ff00
            }
        }
    }

    dispose() {
        this.unlisteners.forEach(unlistener => unlistener());
   
    }
}