import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink, Tuple2, lambda2, lambda3 } from "sodiumjs";
import { BaseContainer } from "../../../lib/display/BaseContainer";
import { Menu, CreateMenuItem } from "../../../lib/menu/Menu";
import { Main, CanvasWidth, CanvasHeight } from "../../main/Main";
import {Samplers} from "./DrumMachine_Samplers";
import {Timer} from "./DrumMachine_Timer";
import {Slider, Direction} from "../../../lib/slider/Slider";


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

        //slider
        
        const sliderConfig = {
            initPerc: .25,
            dir: Direction.VERTICAL,
            knob: {
                radius: 25,
                color: 0xFF0000
            },
            track: {
                sizeX: 50,
                sizeY: (timer.y + timer.height) - samplers.y,
                color: 0x00ff00
            }
        };
        /*
        const sliderConfig = {
            initPerc: .25,
            dir: Direction.VERTICAL,
            knob: {
                radius: 25,
                color: 0xFF0000
            },
            track: {
                sizeX: 300,
                sizeY: 300,
                color: 0x00ff00
            }
        };
        */
        const slider = new Slider(sliderConfig);
        slider.x = samplers.x + samplers.width + 40;
        slider.y = samplers.y;
        this.addChild(slider);

        //frp transaction
        Transaction.run((): void => {
            //start the timer, hooking up to slider for perc
            timer.start(slider.sPerc.hold(sliderConfig.initPerc));
        });
    }

   
    dispose() {
        this.unlisteners.forEach(unlistener => unlistener());
   
    }
}