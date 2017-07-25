import { Frames } from "../../../lib/time/Frames";
import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink } from "sodiumjs";
import { SelfDisposingContainer } from "../../../lib/display/SelfDisposingContainer";
import { Character, CharacterConfig } from "./Switch_Character";
import { Assets } from "./Switch_Assets";
import { Menu, CreateMenuItem } from "../../../lib/menu/Menu";
import { CanvasWidth, CanvasHeight } from "../../main/Main";

interface CharacterLookup {
    [id: string]: Character;
}

export class Switch extends SelfDisposingContainer {
    private _dispose: () => void;

    constructor() {
        super();

        //setup & stuff to dispose
        const characterLookup: CharacterLookup = {
            bird: new Character(new CharacterConfig("bird", 4, 1)),
            dinosaur: new Character(new CharacterConfig("terrex", 19, 5))
        }

        //we don't want to rely on es7 object.values yet...
        const characterList: Array<Character> = Object.keys(characterLookup).map(key => characterLookup[key] as Character);

        const unlisteners = new Array<() => void>();
        const assets = new Assets();

        //get all the loaders of all the characters
        const sLoad = assets.load(
            characterList
                .map(chr => chr.getPaths())
                .reduce((acc: Array<string>, elem: Array<string>) => acc.concat(elem)))


        unlisteners.push(sLoad.listen(ready => {
            //create the menu (with default set to bird)
            const menu = new Menu(Object.keys(characterLookup).map(id => CreateMenuItem(id)), "bird");
            menu.y = (CanvasHeight - menu.height) - 100;
            menu.x = (CanvasWidth - menu.width) / 2;
            this.addChild(menu);

            //the sprite holder
            const sprite = new PIXI.Sprite();
            sprite.anchor.set(.5, .5);
            sprite.x = CanvasWidth / 2;
            sprite.y = CanvasHeight / 2;
            this.addChild(sprite);

            characterList
                .forEach(character => {
                    character.prepAssets(assets);
                });

            Transaction.run((): void => {
                //logic
                const cCharacter = menu.cId.map(id => (characterLookup[id] as Character))
                unlisteners.push(cCharacter.listen(chr => sprite.scale.set(chr.config.scale, chr.config.scale)));

                const cTexture = Cell.switchC(cCharacter.map(chr => chr.cTexture));
                unlisteners.push(cTexture.listen(tex => setTexture(sprite, tex)));
            });

        }));

        //helper functions
        function setTexture(spr: PIXI.Sprite, tex: PIXI.Texture) {
            if (tex === undefined || tex === null) {
                return;
            }
            spr.texture = tex;
        }

        //cleanup
        this._dispose = () => {
            unlisteners.forEach(unlistener => unlistener());
            assets.dispose();
            characterList.forEach(chr => chr.dispose());
        }
    }

    dispose() {
        this._dispose();
    }
}