
import { Ticker } from "../../../lib/time/Ticker";
import { Main, CanvasWidth, CanvasHeight } from "../../main/Main";
import { Transaction, CellLoop, StreamSink, CellSink } from "sodiumjs";
import { BaseContainer } from "../BaseContainer";
import { Path } from "../../../lib/path/Path";
import { Bunny } from "./Bunny";
import { UI } from "./Bunnies_UI";
import { Motion, UpdateMotion, NewMotion } from "./Bunny_Motion";

enum TOUCH {
    DOWN,
    UP
}
export class Bunnies extends BaseContainer {
    private ticker: Ticker;
    private ui: UI;
    private unlisteners: Array<() => void>;


    constructor() {
        super();

        //input
        Main.app.renderer.plugins.interaction.on('pointerdown', () => cTouch.send(TOUCH.DOWN));
        Main.app.renderer.plugins.interaction.on('pointerup', () => cTouch.send(TOUCH.UP));

        //output
        const bounds = new PIXI.Rectangle(0, 0, CanvasWidth, CanvasHeight);
        const ui = new UI();
        this.addChild(ui.status);

        //time
        const ticker = new Ticker();

        //local containers
        const unlisteners = new Array<() => void>();
        const bunnies = new Array<Bunny>();

        //stuff that will need to be disposed
        this.unlisteners = unlisteners;
        this.ticker = ticker;
        this.ui = ui;

        //logic
        const cTouch = new CellSink<TOUCH>(TOUCH.UP);
        const cLoad = ui.load();

        const sReady = ticker.sTicks.gate(cLoad); //prevent anything from happening until ui is loaded
        const sCreating = sReady.gate(cTouch.map(t => t == TOUCH.DOWN ? true : false)); //don't make bunnies unless mouse is down

        //render changes
        /*
        unlisteners.push(
            sReady.listen(deltaTime => 
                bunnies.forEach(bunny => bunny.update(deltaTime)))
        );
        */


        unlisteners.push(
            //Create bunny when mouse is down
            sCreating.listen(() => {
                for (let i = 0; i < 100; i++) {
                    let bunnyCell = new CellLoop<Motion>();
                    let bunnyUpdate = ticker.sTicks.snapshot(bunnyCell, (dt, motion) => UpdateMotion(motion, bounds));
                    bunnyCell.loop(bunnyUpdate.hold(NewMotion()));
                    let bunny = new Bunny(this.ui.texture, bunnyCell);
                    bunnies.push(bunny);
                    this.addChild(bunny);
                }


                ui.updateStatus(bunnies.length + " bunnies!");
            })
        );
    }

    dispose() {
        Main.app.renderer.plugins.interaction.off('pointerdown');
        Main.app.renderer.plugins.interaction.off('pointerup');
        this.unlisteners.forEach(unlistener => unlistener());
        this.ticker.dispose();
        this.ui.dispose();
    }
}