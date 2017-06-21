import * as R from 'ramda';
import { PrimitiveFuncs } from "../../lib/funcs/PrimitiveFuncs";
import { SimpleMove } from "../modules/simplemove/SimpleMove";
import {Cell, CellSink} from "sodiumjs";
import {UI} from "./TopMenu_UI";

export class TopMenu extends PIXI.Container {
    private _onSelected:CellSink<string>;
    
    constructor(stage: PIXI.Container, initialId:string) {
        super();
        
        stage.addChild(this);

        this._onSelected = new CellSink<string>(initialId);
        this._onSelected.listen(id => this.render(id));
        this.x = 10;
        this.y = 10;
    }

    public changeId(_id:string) {
        this._onSelected.send(_id);
    }

    public get onSelected():Cell<string> {
        return this._onSelected;
    }

    render(selectedId:string) {
        this.removeChildren();

        UI.CreateButtons(selectedId)
            .forEach(btn => {
                this.addChild(btn);
                btn.on('pointerdown', evt => {
                    this._onSelected.send(btn.id);
                })
            });
    }
    
}

