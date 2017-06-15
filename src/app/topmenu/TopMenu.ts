import * as R from 'ramda';
import { Ref, IDisplayObjectRef } from "../../lib/refs/Ref";
import { IO } from "../../lib/unsafe/IO";
import { DisplayFuncs } from "../../lib/funcs/DisplayFuncs";
import { MenuConfig, MenuConfigs } from "./MenuConfig";


const BUTTON_MARGIN = 10;
const BUTTON_PADDING_X = 10;

export class TopMenu extends PIXI.Container {
    private buttons: Array<PIXI.Container>;

    constructor() {
        super();

        this.buttons = R.map(UIHelpers.createButton, MenuConfigs);
        this.buttons.forEach((btn) => this.addChild(btn));
    }
    
    //the render function should work with dynamic updates... follows this idea:
    //1. gets fp-safe references
    //2. runs algorithm on them, this is where most of the logic should happen
    //3. at the end runs fp-unsafe update on the objects (IO.Update)
    public render() {
        let refs = R.map(Ref.Create_DisplayObject, this.buttons);

        //in this particular case there isn't much to do!
        DisplayFuncs.getLayoutRow(BUTTON_PADDING_X, refs).forEach(IO.Update);
    }
}

class UIHelpers {
    public static createButton(config: MenuConfig): PIXI.Container {
        let container = new PIXI.Container();
        let graphics = new PIXI.Graphics();

        let text: PIXI.Text = new PIXI.Text(config.label, new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 14,
            fill: '#ffffff',
            wordWrap: false,
            align: 'center'
        }));
        graphics.beginFill(0x595234);
        graphics.drawRoundedRect(0, 0, text.width + (BUTTON_MARGIN * 2), text.height + (BUTTON_MARGIN * 2), 10);
        graphics.endFill();

        graphics.addChild(text);

        text.x = BUTTON_MARGIN;
        text.y = BUTTON_MARGIN;
        container.addChild(graphics);
        container.interactive = container.buttonMode = true;

        return container;
    }
}