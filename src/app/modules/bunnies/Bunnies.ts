import { Ticker } from "../../../lib/time/Ticker";
import { Main, CanvasWidth, CanvasHeight } from "../../main/Main";
import { Transaction, CellLoop, StreamSink, CellSink} from "sodiumjs";
import { BaseContainer } from "../../../lib/display/BaseContainer";
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
        const bunnyContainer = new PIXI.Container();
        this.addChild(bunnyContainer);
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
        //note that in this example we're using a gate() to control the load-ready status rather than a listener
        const cTouch = new CellSink<TOUCH>(TOUCH.UP); //
        const cLoad = ui.load(); //load ui assets
        const sReady = ticker.sTicks.gate(cLoad); //prevent anything from happening until ui is loaded
        const sCreating = sReady.gate(cTouch.map(t => t == TOUCH.DOWN ? true : false)); //don't make bunnies unless mouse is down

        //render changes when ui is ready
        unlisteners.push(
            sReady.listen(() => 
                bunnies.forEach(b => { 
                    //note - there was an attempt to use cells for this but it was far less performant
                    //still, there's very little "side effects" - just bunny.render() and it's over here in listen anyway
                    b.render(UpdateMotion(b.motion, bounds));
                }))
        );
        
        //Create bunnies while mouse is down
        unlisteners.push(
            sCreating.listen(() => {
                for (let i = 0; i < 100; i++) {
                    const bunny = new Bunny(this.ui.texture);
                    bunnyContainer.addChild(bunny);
                    bunnies.push(bunny);
                }
               
                ui.updateStatus(bunnies.length + " bunnies!");
            })
        );
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