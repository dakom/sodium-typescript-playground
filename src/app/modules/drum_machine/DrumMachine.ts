import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink, Tuple2, lambda2, lambda3 } from "sodiumjs";
import { BaseContainer } from "../../../lib/display/BaseContainer";
import { Menu, CreateMenuItem } from "../../../lib/menu/Menu";
import { Main, CanvasWidth, CanvasHeight } from "../../main/Main";
import { Samplers } from "./DrumMachine_Samplers";
import { Timer } from "./DrumMachine_Timer";
import { Assets } from "./DrumMachine_Assets";
import { sampleIds, VolumeSliderOptions, SpeedSliderOptions } from "./DrumMachine_Config";
import { Slider, Direction, SliderOptions } from "../../../lib/slider/Slider";
import * as R from "ramda";


interface Sound {
    volume: number;
    play: () => void;
    destroy: () => void;
}
interface SoundLookup {
    [sampleId: string]: Sound;
}

export class DrumMachine extends BaseContainer {
    private unlisteners: Array<() => void>;
    private assets: Assets;

    constructor() {
        super();

        this.unlisteners = new Array<() => void>();

        this.assets = new Assets();
        this.unlisteners.push(
            this.assets.load(sampleIds).listen(resources => {
                //assign sounds from loaded assets
                const soundLookup: SoundLookup = sampleIds.reduce((all: any, val: string) => {
                    all[val] = resources[val]["sound"];
                    return all;
                }, {});
                //we don't want to rely on es7 object.values yet...
                const soundList = Object.keys(soundLookup).map(key => soundLookup[key] as Sound);

                //ui and container setup
                const samplers = new Samplers(sampleIds);
                samplers.x = (CanvasWidth - samplers.width) / 2;
                samplers.y = ((CanvasHeight - samplers.height) / 2) - 100;
                this.addChild(samplers);

                const timer = new Timer();
                timer.x = samplers.x;
                timer.y = samplers.y + samplers.height + 30;
                this.addChild(timer);

                const volumeSlider = new Slider(VolumeSliderOptions((timer.y + timer.height) - samplers.y));
                volumeSlider.x = samplers.x + samplers.width + 40;
                volumeSlider.y = samplers.y;
                this.addChild(volumeSlider);

                const speedSlider = new Slider(SpeedSliderOptions(samplers.width));
                speedSlider.x = samplers.x;
                speedSlider.y = timer.y + timer.height + 40;
                this.addChild(speedSlider);


                //frp transaction
                Transaction.run((): void => {
                    //start the timer with a hookup to slider for speed control
                    timer.start(speedSlider.cPerc);

                    //get the current samples and play
                    this.unlisteners.push(
                        volumeSlider.cPerc.listen(perc => {
                            soundList.forEach(sound => sound.volume = perc);
                        }),

                        samplers.getSamples(timer.cMeasure).listen(samples => {
                            samples.forEach(sampleId => {
                                soundLookup[sampleId].play();
                            });
                        })
                    );

                });
            })
        );
    }



    dispose() {
        this.unlisteners.forEach(unlistener => unlistener());
        this.assets.dispose();
        (window as any).PIXI.sound.removeAll();
    }
}