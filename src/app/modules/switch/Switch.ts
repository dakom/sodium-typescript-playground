import { Frames } from "../../../lib/time/Frames";
import { Cell, Transaction, CellLoop, Stream } from "sodiumjs";
import { BaseContainer } from "../../../lib/display/BaseContainer";
import { Character } from "./Switch_Character";
import { Assets } from "./Switch_Assets";
import { Menu, CreateMenuItem } from "../../../lib/menu/Menu";
import { CanvasWidth, CanvasHeight } from "../../main/Main";
import * as R from "ramda";

export class Switch extends BaseContainer {
    private frames: Frames;
    private unlisteners: Array<() => void>;
    private assets: Assets;

    constructor() {
        super();

        //setup
        const frames = new Frames(3);
        const unlisteners = new Array<() => void>();

        const assets = new Assets();

        const characters = {
            bird: new Character("bird", assets, 4, 1),
            dinosaur: new Character("terrex", assets, 19, 3)
        }

        const menu = new Menu(Object.keys(characters).map(id => CreateMenuItem(id)));
        menu.y = (CanvasHeight - menu.height) - 100;
        menu.x = (CanvasWidth - menu.width) / 2;
        this.addChild(menu);

        const character = new PIXI.Sprite();
        character.anchor.set(.5,.5);
        character.x = CanvasWidth/2;
        character.y = CanvasHeight/2;
        this.addChild(character);

        //stuff to dispose
        this.frames = frames;
        this.unlisteners = unlisteners;
        this.assets = assets;

        //helper functions
        function getLoaders():Array<string> {
            return R.reduce((acc:Array<string>, elem:Array<string>) => acc.concat(elem), 
                        new Array<string>(), 
                        //we don't want to rely on es7 object.values yet...
                        Object.keys(characters).map(key => characters[key] as Character)
                            .map(chr => chr.paths));

        }

        //logic
        Transaction.run((): void => {
            assets.load(getLoaders());

            const sFrames = frames.sFrames.gate(assets.cLoad); //prevent anything from happening until ui is loaded

           
            //get selected character
            const cCharacter = new CellLoop<Character>();
            cCharacter.loop(menu.sClicked.snapshot(cCharacter, (id, chr) => characters[id]).hold(undefined));
            
            //get selected textures
            const cTextures = cCharacter.map(chr => chr.cTexture);

            //FIX BELOW HERE!!!! USE SWITCHES AND STUFF!!!

            let tex = Cell.switchC(cTextures);
            
            //update textures... lift?
            unlisteners.push(
                //update this to be based on the switch!
                //also - notice that we're listening to the stream instead of the cell - we aren't interested in first value
                //can we get rid of the cell altogether?
                tex.listen(t => {
                    character.texture = t; 
                })
            )
        });
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

        this.frames.dispose();
        this.unlisteners.forEach(unlistener => unlistener());
        this.assets.dispose();
    }
}