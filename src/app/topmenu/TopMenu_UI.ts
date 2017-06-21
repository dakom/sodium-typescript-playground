const BUTTON_MARGIN = 10;
const BUTTON_PADDING_X = 10;
import { PrimitiveFuncs } from "../../lib/funcs/PrimitiveFuncs";
import { MenuConfig, Configs } from "./TopMenu_Config";
import * as R from 'ramda';

export class MenuButton extends PIXI.Container {

    constructor(private config: MenuConfig, selected: boolean) {
        super();
        let textStyle = selected
            ? new PIXI.TextStyle({
                fontFamily: 'Arial',
                fontSize: 24,
                fill: '#ffffff',
                wordWrap: false,
                align: 'center'
            })
            : new PIXI.TextStyle({
                fontFamily: 'Arial',
                fontSize: 24,
                fill: '#ffffff',
                wordWrap: false,
                align: 'center'
            });
        let bgColor = selected ? 0x595234 : 0x2a2a2a;
        let graphics = new PIXI.Graphics();
        let text: PIXI.Text = new PIXI.Text(config.label, textStyle);
        graphics.beginFill(bgColor);
        graphics.drawRoundedRect(0, 0, text.width + (BUTTON_MARGIN * 2), text.height + (BUTTON_MARGIN * 2), 10);
        graphics.endFill();

        graphics.addChild(text);

        text.x = BUTTON_MARGIN;
        text.y = BUTTON_MARGIN;
        this.addChild(graphics);
        this.interactive = this.buttonMode = true;

    
    }

    public get id():string {
        return this.config.id;
    }
}

export function createButtons(selectedId): Array<MenuButton> {
    let buttons = Configs.map(config => new MenuButton(config, config.id === selectedId ? true : false));

    let positions = PrimitiveFuncs.addPadding(  BUTTON_PADDING_X, 
                                                PrimitiveFuncs.accProps("width", buttons));

    R.zipWith((ref, x) => ref.x = x, buttons, positions);

    return buttons;
}