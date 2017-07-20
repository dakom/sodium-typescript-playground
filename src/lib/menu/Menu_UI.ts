const BUTTON_MARGIN = 10;
const BUTTON_PADDING_X = 10;
import { spreadPosition} from "../../lib/funcs/PrimitiveFuncs";
import {MenuItem} from "./Menu";
import * as R from "ramda";

export function Menu_SetLayout(buttons:Array<PIXI.DisplayObject>) {
    const positions = spreadPosition(BUTTON_PADDING_X, "width", buttons);
    R.zipWith((ref, x) => ref.x = x, buttons, positions);
}

export function MenuButton_UI(label:string, selected: boolean):PIXI.Graphics {
        const textStyle = selected
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
        const bgColor = selected ? 0x595234 : 0x2a2a2a;
        const graphics = new PIXI.Graphics();
        const text: PIXI.Text = new PIXI.Text(label, textStyle);
        graphics.beginFill(bgColor);
        graphics.drawRoundedRect(0, 0, text.width + (BUTTON_MARGIN * 2), text.height + (BUTTON_MARGIN * 2), 10);
        graphics.endFill();

        graphics.addChild(text);

        text.x = BUTTON_MARGIN;
        text.y = BUTTON_MARGIN;
        return graphics;
}

