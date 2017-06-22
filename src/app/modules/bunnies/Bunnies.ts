
import { Ticker } from "../../../lib/time/Ticker";
import {Main, CanvasWidth, CanvasHeight } from "../../main/Main";
import { Transaction, CellLoop, StreamSink, CellSink } from "sodiumjs";
import { BaseContainer } from "../BaseContainer";
import {Path} from "../../../lib/path/Path";
import {Bunny} from "./Bunny";
import {Bunnies_UI} from "./Bunnies_UI";

enum TOUCH {
    DOWN,
    UP
}
export class Bunnies extends BaseContainer {
    private ticker:Ticker;
    private ui:Bunnies_UI;
    private unlisteners:Array<() => void>;
   

    constructor() {
        super();

        this.unlisteners = new Array<() => void>();

        const bunnies = new Array<Bunny>();
        const ui = new Bunnies_UI();
        const bounds = new PIXI.Rectangle(0,0,CanvasWidth, CanvasHeight);
        const ticker = new Ticker();
        const cTouch = new CellSink<TOUCH>(TOUCH.UP);
        const cLoad =  ui.load();

        const sReady = ticker.sTicks.gate(cLoad); //prevent anything from happening until ui is loaded
        const sCreating = sReady.gate(cTouch.map(t => t == TOUCH.DOWN ? true : false)); //don't make bunnies unless mouse is down

        this.unlisteners.push(
            sReady.listen(deltaTime => 
                bunnies.forEach(bunny => bunny.update(deltaTime)))
        );

        this.unlisteners.push(
            sCreating.listen(() => {
                let bunny = new Bunny(this.ui.texture, bounds);
                bunnies.push(bunny);
                this.addChild(bunny);
            })
        );
        
        Main.app.renderer.plugins.interaction.on('pointerdown', () => cTouch.send(TOUCH.DOWN));
        Main.app.renderer.plugins.interaction.on('pointerup', () => cTouch.send(TOUCH.UP));

        //more stuff that will need to be disposed
        this.ticker = ticker;
        this.ui = ui;
    }

    dispose() {
        Main.app.renderer.plugins.interaction.off('pointerdown');
        Main.app.renderer.plugins.interaction.off('pointerup');
        this.unlisteners.forEach(unlistener => unlistener());
        this.ticker.dispose();
        this.ui.dispose();
    }
}