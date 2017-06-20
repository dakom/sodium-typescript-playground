import * as R from 'ramda';
import { PrimitiveFuncs } from "../../lib/funcs/PrimitiveFuncs";

import { Stream, StreamSink} from "sodiumjs";

const BUTTON_MARGIN = 10;
const BUTTON_PADDING_X = 10;

class MenuConfig {
    constructor(public readonly id:string, public readonly label?: string) { 
        if(label === undefined) {
            this.label = id;
        }
    }
}

export class TopMenu extends PIXI.Container {
    private _sClicked:StreamSink<string>;

    constructor(stage: PIXI.Container) {
        super();
        this._sClicked = new StreamSink<string>();

        stage.addChild(this);
        this.render();        
    }

    public get sClicked():Stream<string> {
        return this._sClicked;
    }

    public render() {
        this.removeChildren();

        let buttons:Array<PIXI.Container> = [
            new MenuConfig("simple"),
            new MenuConfig("bunnies"),
            new MenuConfig("draw"),
            new MenuConfig("pong")
        ].map(config => {
            let btn = UIHelpers.createButton(config);
            btn.on('pointerdown', evt => {
                this._sClicked.send(config.id);
            })
            this.addChild(btn);
            return btn;
        })

        let widths = PrimitiveFuncs.accProps("width", buttons);
        let positions = PrimitiveFuncs.addPadding(BUTTON_PADDING_X, widths);
        R.zipWith((ref, x) => ref.x = x, buttons, positions);

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