import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink, Tuple2, lambda2, lambda3 } from "sodiumjs";
import { BaseContainer } from "../../../lib/display/BaseContainer";
import { Menu, CreateMenuItem } from "../../../lib/menu/Menu";
import { Main, CanvasWidth, CanvasHeight } from "../../main/Main";
import { Samplers } from "./DrumMachine_Samplers";
import { Timer } from "./DrumMachine_Timer";
import { Assets } from "./DrumMachine_Assets";
import {sampleIds, startSpeed} from "./DrumMachine_Config";
import { Slider, Direction, SliderOptions } from "../../../lib/slider/Slider";



interface Sound {
    volume:number;
    play: () => void;
}
interface Sounds {
    [sampleId:string]: Sound;
}

export class DrumMachine extends BaseContainer {
    private unlisteners: Array<() => void>;
    private assets: Assets;

    constructor() {
        super();

        this.unlisteners = new Array<() => void>();

        this.assets = new Assets();
        const sLoad = this.assets.load(sampleIds);
        sLoad.listen(resources => {
            
            //assign sounds from loaded assets
            const sounds:Sounds = sampleIds.reduce((all:any, val:string) => {
                all[val] = resources[val]["sound"];
                return all;
            }, {});

            //ui and container setup
            const samplers = new Samplers(sampleIds);
            samplers.x = (CanvasWidth - samplers.width) / 2;
            samplers.y = (CanvasHeight - samplers.height) / 2;
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
                            sounds[sampleId].play();
                        });
                    })
                );

            });
        });
    }

    getSliderOptions(size: number): SliderOptions {
        return {
            initPerc: startSpeed,
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
        this.assets.dispose();
    }
}