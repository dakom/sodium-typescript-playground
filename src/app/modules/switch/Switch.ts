import { Ticker } from "../../../lib/time/Ticker";
import { Transaction, CellLoop } from "sodiumjs";
import { BaseContainer } from "../../../lib/display/BaseContainer";
import { Cell } from "sodiumjs";
import { Character } from "./Switch_Character";
import { Assets } from "./Switch_Assets";
import { Menu, CreateMenuItem } from "../../../lib/menu/Menu";
import {CanvasWidth, CanvasHeight } from "../../main/Main";
export class Switch extends BaseContainer {
    private ticker: Ticker;
    private unlisteners: Array<() => void>;
    private assets:Assets;

    constructor() {
        super();

        //setup
        const ticker = new Ticker();
        const unlisteners = new Array<() => void>();

        const bird = new Character("bird", 4, 1);
        const terrex = new Character("terrex", 19, 3);

        const assets = new Assets();

        const menu = new Menu([CreateMenuItem("bird"),CreateMenuItem("dinosaur")]);

        //stuff to dispose
        this.ticker = ticker;
        this.unlisteners = unlisteners;
        this.assets = assets;

        //logic
        const cLoad = assets.load(bird.getPaths().concat(terrex.getPaths()));

        const sReady = ticker.sTicks.gate(cLoad); //prevent anything from happening until ui is loaded

        //pick up from here!
        this.addChild(bird);
        this.addChild(menu);
        menu.y = (CanvasHeight - menu.height) - 100;
        menu.x = (CanvasWidth - menu.width)/2;
        
        unlisteners.push(
            sReady.listen(deltaTime => {
                bird.render(deltaTime, assets);
            })
        );

        //const movies = new Array<Cell<Texture>>();

        /*
        //One stream - represents the remote controller
    let remote = new StreamSink<number>();

    //Although the type can be derived in the below lines, it's set for illustrative purposes

    //Three cells - represents the different options of what's on tv (e.g. shows change)
    let channels: Array<CellSink<ChannelInfo>> = config.map(info => new CellSink<ChannelInfo>(Object.assign({}, info)));

    //give the channels dummy listeners - required for changing the cell contents algorithmically (see power outage)
    channels.forEach(c => c.listen(() => { }));

    //Map the numeric remote controller choices to their corresponding channels
    //Just as the remote is a stream of button presses over time, the results are
    //A stream of channel choices over time
    let choices: Stream<Cell<ChannelInfo>> = remote.map(n => channels[n]);

    //Derive a single time-varying representation of the choices (which change via choices events)
    //In other words - this changes when choices changes (which changes when remote sends updates)
    let choice: Cell<Cell<ChannelInfo>> = choices.hold(channels[0]);

    //reduce the time-varying representation of the current choice to the actual current choice
    let onTv: Cell<ChannelInfo> = Cell.switchC(choice);

    //Log the current choice to the console - as its changed
    onTv.listen(c => {
        //for demo purposes - just get a random show from this channel
        let show = c.shows[Math.floor(Math.random() * c.shows.length)];
        console.log(`channel ` + c.channel + `: ` + show + ` (` + c.genre + `)`);
    });
    */
    }

    dispose() {
        console.log('disposing switch...');
        
        this.ticker.dispose();
        this.unlisteners.forEach(unlistener => unlistener());
        this.assets.dispose();
    }
}