import * as R from 'ramda';
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
    
    
    public render() {
        let buttonCopies = DisplayFuncs.getLayoutRow(BUTTON_PADDING_X, this.buttons);
        function setProp(obj, key, val) {
        R.lift(data => data[key] = val)(R.of(obj));
    }

        R.zipWith((copy, target) => {target.x = copy.x; return copy}, buttonCopies, this.buttons);
    }
}

class UIHelpers {
    public static createButton(config: MenuConfig): PIXI.Container {
        let container = new PIXI.Container();
        let graphics = new PIXI.Graphics();

        let text: PIXI.Text = new PIXI.Text(config.label, new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
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