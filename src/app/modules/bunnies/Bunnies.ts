import { Ticker } from "../../../lib/time/Ticker";
import { Main, CanvasWidth, CanvasHeight } from "../../main/Main";
import { Transaction, CellLoop, StreamSink, CellSink} from "sodiumjs";
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

        //disposable stuff
        this.unlisteners = unlisteners;
        this.ticker = ticker;
        this.ui = ui;

        //logic
        const cTouch = new CellSink<TOUCH>(TOUCH.UP); //
        const cLoad = ui.load(); //load ui assets

        const sReady = ticker.sTicks.gate(cLoad); //prevent anything from happening until ui is loaded
        const sCreating = sReady.gate(cTouch.map(t => t == TOUCH.DOWN ? true : false)); //don't make bunnies unless mouse is down

        //render changes when ui is ready
        unlisteners.push(
            sReady.listen(() => 
                bunnies.forEach(b => { 
                    b.motion = UpdateMotion(b.motion, bounds);
                    b.render(b.motion);
                }))
        );
        
        //Create bunnies while mouse is down
        unlisteners.push(
            sCreating.listen(() => {
                for (let i = 0; i < 100; i++) {
                    bunnies.push(this.makeBunny());
                }
               
                ui.updateStatus(bunnies.length + " bunnies!");
            })
        );
    }

    makeBunny():Bunny {
        let bunny = new Bunny(this.ui.texture);
        this.addChild(bunny);
        return bunny;
    }

    //called automatically when the container is removed from stage
    dispose() {
        Main.app.renderer.plugins.interaction.off('pointerdown');
        Main.app.renderer.plugins.interaction.off('pointerup');
        this.unlisteners.forEach(unlistener => unlistener());
        this.ticker.dispose();
        this.ui.dispose();
    }
}