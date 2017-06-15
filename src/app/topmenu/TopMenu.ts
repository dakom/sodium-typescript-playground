import {MenuConfig, MenuConfigs} from "./MenuConfig";
import * as R from 'ramda';

const BUTTON_MARGIN = 10;
const BUTTON_PADDING_X = 10;

export class TopMenu extends PIXI.Container {
    constructor() {
        super();
    }
    public render() {
        this.removeChildren();

        let buttons = R.map(this.createButton, MenuConfigs);
        let positions = R.scan(
            (total, width) => total + width + BUTTON_PADDING_X, 
            0, 
            R.map(button => button.width, buttons));
        
        //TODO: improve this via: https://stackoverflow.com/questions/44571684/how-to-apply-values-of-two-arrays
        for(let i = 0; i < buttons.length; i++) {
            buttons[i].position.x = positions[i];
        }

        buttons.map(btn => this.addChild(btn));
    }

    setToPositions(targets:Array<PIXI.DisplayObject>, positions:Array<number>) {

        function setToPosition(target:PIXI.DisplayObject, pos:number) {

        }
    }

    createButton(config:MenuConfig):PIXI.Container {
        let container = new PIXI.Container();
        let graphics = new PIXI.Graphics();
       
             let text:PIXI.Text = new PIXI.Text(config.label, new PIXI.TextStyle({
                fontFamily: 'Arial',
                fontSize: 14,
                fill: '#ffffff',
                wordWrap: false,
                align: 'center'
            }));
        graphics.beginFill(0x595234);
        graphics.drawRoundedRect(0,0,text.width + (BUTTON_MARGIN*2),text.height + (BUTTON_MARGIN*2), 10);
        graphics.endFill();

        graphics.addChild(text);
        
        text.x = BUTTON_MARGIN;
        text.y = BUTTON_MARGIN;
        container.addChild(graphics);
        container.interactive = container.buttonMode = true;

        return container;
    }
}