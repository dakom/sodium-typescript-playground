import { Frames } from "../../../lib/time/Frames";
import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink } from "sodiumjs";
import { BaseContainer } from "../../../lib/display/BaseContainer";
import { Character } from "./Switch_Character";
import { Assets } from "./Switch_Assets";
import { Menu, CreateMenuItem } from "../../../lib/menu/Menu";
import { CanvasWidth, CanvasHeight } from "../../main/Main";
import * as R from "ramda";

export class Switch extends BaseContainer {
    private unlisteners: Array<() => void>;
    private assets: Assets;
    private characters: any;

    constructor() {
        super();

        //setup & stuff to dispose
        const characters = {
            bird: new Character("bird", 4, 1),
            dinosaur: new Character("terrex", 19, 3)
        }


        this.unlisteners = new Array<() => void>();
        this.assets = new Assets();
        this.characters = characters;

        const character = new PIXI.Sprite();
        character.anchor.set(.5, .5);
        character.x = CanvasWidth / 2;
        character.y = CanvasHeight / 2;
        this.addChild(character);

        const menu = new Menu(Object.keys(this.characters).map(id => CreateMenuItem(id)), "bird");
        menu.y = (CanvasHeight - menu.height) - 100;
        menu.x = (CanvasWidth - menu.width) / 2;
        this.addChild(menu);

        //get all the loaders of all the characters


        const sLoad = this.assets.load(R.reduce((acc: Array<string>, elem: Array<string>) => acc.concat(elem),
            new Array<string>(),
            this.getCharacters().map(chr => chr.paths)));


        const unlistener = sLoad.listen(ready => {
            this.getCharacters()
                .forEach(character => {
                    character.prepAssets(this.assets);

                });



            Transaction.run((): void => {
                const cCharacter = menu.cId.map(id => (this.characters[id] as Character));
                const cTextures = cCharacter.map(chr => chr.cTexture);

                const cTexture = Cell.switchC(cTextures);
                this.unlisteners.push(
                    cTexture.listen(tex => {
                        //can this be moved to a filter?
                        if (tex !== undefined && tex !== null) {
                            character.texture = tex;
                        }
                    })
                );

                //Log the current choice to the console - 

                /*
                    NOTE
                    Switch wasn't really necessary for this example... the following is simpler and works too
                    Though the source code was changed to accommodate the switch and this is now broken
                */
                /*
                const cTicker = this.frames.sFrames.hold(0);
                const cTexture = cTicker.lift(menu.cId.map(id => (this.characters[id] as Character)),
                    (n, chr) => {
                        chr.updateFrame();
                        return chr.fTexture;
                    }
                )
                cTexture.listen(tex => character.texture = tex);

                this.frames.start();
                */
            });

        });
        //wait for load of assets
        this.unlisteners.push(unlistener);

    }

    getCharacters(): Array<Character> {
        //we don't want to rely on es7 object.values yet...
        return Object.keys(this.characters).map(key => this.characters[key] as Character);
    }

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

    dispose() {
        console.log('disposing switch...');

        this.unlisteners.forEach(unlistener => unlistener());
        this.assets.dispose();
        this.getCharacters().forEach(chr => chr.dispose());
    }
}