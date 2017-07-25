import { Ticker } from "../../../lib/time/Ticker";
import { Main, CanvasWidth, CanvasHeight } from "../../main/Main";
import { Transaction, CellLoop, StreamSink, CellSink } from "sodiumjs";
import { SelfDisposingContainer } from "../../../lib/display/SelfDisposingContainer";
import { Path } from "../../../lib/path/Path";
import { Bunny } from "./Bunny";
import { UI } from "./Bunnies_UI";
import { Motion, UpdateMotion, NewMotion } from "./Bunny_Motion";
import * as R from "ramda";

enum TOUCH {
    DOWN,
    UP
}

export class Bunnies extends SelfDisposingContainer {
    private _dispose: () => void;

    constructor() {
        super();

        //ui
        const bounds = new PIXI.Rectangle(0, 0, CanvasWidth, CanvasHeight);
        const ui = new UI();
        const bunnyContainer = new PIXI.Container();
        this.addChild(bunnyContainer);
        this.addChild(ui.status);

        //time
        const ticker = new Ticker();

        //local containers
        const unlisteners = new Array<() => void>();
        const bunnies = new Array<Bunny>();

        //logic
        //note that in this example we're using a gate() to control the load-ready status rather than a listener
        const cTouch = new CellSink<TOUCH>(TOUCH.UP);
        const cLoad = ui.load(); //load ui assets
        const sTicksReady = ticker.sTicks.gate(cLoad); //prevent anything from happening until ui is loaded
        const sCreating = sTicksReady.gate(cTouch.map(t => t == TOUCH.DOWN ? true : false)); //don't make bunnies unless mouse is down

        unlisteners.push(
            cLoad.listen(() => {
                Main.app.renderer.plugins.interaction.on('pointerdown', sendTouchDown);
                Main.app.renderer.plugins.interaction.on('pointerup', sendTouchUp);
            }),
            sTicksReady.listen(() => {
                bunnies.forEach(b => {
                    //note - there was an attempt to use cells for this but it was far less performant
                    //still, there's very little "side effects" - just bunny.render() and it's over here in listen anyway
                    b.render(UpdateMotion(b.motion, bounds));
                });
            }),
            sCreating.listen(() => {
                //Create bunnies while mouse is down
                R.repeat(() => new Bunny(ui.texture), 100)
                    .forEach(bunnyF => {
                        const bunny = bunnyF();
                        bunnyContainer.addChild(bunny);
                        bunnies.push(bunny);
                    });

                ui.updateStatus(bunnies.length + " bunnies!");
            })
        );

        //function helpers
        function sendTouchDown() {
            cTouch.send(TOUCH.DOWN);
        }

        function sendTouchUp() {
            cTouch.send(TOUCH.UP);
        }

        //cleanup
        this._dispose = () => {
            Main.app.renderer.plugins.interaction.off('pointerdown', sendTouchDown);
            Main.app.renderer.plugins.interaction.off('pointerup', sendTouchUp);
            unlisteners.forEach(unlistener => unlistener());
            ticker.dispose();
            ui.dispose();
        }
    }

    public dispose() {
        this._dispose();
    }


}