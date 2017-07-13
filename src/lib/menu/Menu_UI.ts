const BUTTON_MARGIN = 10;
const BUTTON_PADDING_X = 10;
import { PrimitiveFuncs } from "../../lib/funcs/PrimitiveFuncs";
import {MenuItem} from "./Menu";

declare const R;

export function Menu_SetLayout(buttons:Array<PIXI.DisplayObject>) {
    let positions = PrimitiveFuncs.addPadding(BUTTON_PADDING_X, PrimitiveFuncs.accProps("width", buttons));
    R.zipWith((ref, x) => ref.x = x, buttons, positions);
}

export function MenuButton_UI(label:string, selected: boolean):PIXI.Graphics {
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
        let text: PIXI.Text = new PIXI.Text(label, textStyle);
        graphics.beginFill(bgColor);
        graphics.drawRoundedRect(0, 0, text.width + (BUTTON_MARGIN * 2), text.height + (BUTTON_MARGIN * 2), 10);
        graphics.endFill();

        graphics.addChild(text);

        text.x = BUTTON_MARGIN;
        text.y = BUTTON_MARGIN;
        return graphics;
}

