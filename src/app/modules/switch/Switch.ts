import { Frames } from "../../../lib/time/Frames";
import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink } from "sodiumjs";
import { BaseContainer } from "../../../lib/display/BaseContainer";
import { Character, CharacterConfig } from "./Switch_Character";
import { Assets } from "./Switch_Assets";
import { Menu, CreateMenuItem } from "../../../lib/menu/Menu";
import { CanvasWidth, CanvasHeight } from "../../main/Main";

export class Switch extends BaseContainer {
    private unlisteners: Array<() => void>;
    private assets: Assets;
    private characters: any;

    constructor() {
        super();

        //setup & stuff to dispose
        const characters = {
            bird: new Character(new CharacterConfig("bird", 4, 1)),
            dinosaur: new Character(new CharacterConfig("terrex", 19, 5))
        }


        this.unlisteners = new Array<() => void>();
        this.assets = new Assets();
        this.characters = characters;

        //get all the loaders of all the characters
        const sLoad = this.assets.load(
            this.getCharacters()
                .map(chr => chr.paths)
                .reduce((acc: Array<string>, elem: Array<string>) => acc.concat(elem)))


        this.unlisteners.push(sLoad.listen(ready => {
            //create the menu (with default set to bird)
            const menu = new Menu(Object.keys(this.characters).map(id => CreateMenuItem(id)), "bird");
            menu.y = (CanvasHeight - menu.height) - 100;
            menu.x = (CanvasWidth - menu.width) / 2;
            this.addChild(menu);

            //the sprite holder
            const sprite = new PIXI.Sprite();
            sprite.anchor.set(.5, .5);
            sprite.x = CanvasWidth / 2;
            sprite.y = CanvasHeight / 2;
            this.addChild(sprite);

            this.getCharacters()
                .forEach(character => {
                    character.prepAssets(this.assets);
                });

            Transaction.run((): void => {
                //logic
                const cCharacter = menu.cId.map(id => (this.characters[id] as Character))
                this.unlisteners.push(cCharacter.listen(chr => sprite.scale.set(chr.config.scale, chr.config.scale)));

                const cTexture = Cell.switchC(cCharacter.map(chr => chr.cTexture));
                this.unlisteners.push(cTexture.listen(tex => this.setTexture(sprite, tex)));
            });

        }));
    }

    setTexture(spr: PIXI.Sprite, tex: PIXI.Texture) {

        if (tex === undefined || tex === null) {
            return;
        }
        spr.texture = tex;
    }
    getCharacters(): Array<Character> {
        //we don't want to rely on es7 object.values yet...
        return Object.keys(this.characters).map(key => this.characters[key] as Character);
    }

    dispose() {
        this.unlisteners.forEach(unlistener => unlistener());
        this.assets.dispose();
        this.getCharacters().forEach(chr => chr.dispose());
    }
}