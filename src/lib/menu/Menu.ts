import * as R from "ramda";

import { Cell, CellLoop, CellSink, StreamSink, Transaction, Stream, StreamLoop } from "sodiumjs";
import { MenuButton } from "./Menu_Button";
import { Menu_SetLayout } from "./Menu_UI";

export function CreateMenuItem(id: string, label?: string): MenuItem {
    return {
        id: id,
        label: label === undefined ? id : label
    }
}

export interface MenuItem {
    id: string;
    label: string;
}

export class Menu extends PIXI.Container {
    private _sClicked:Stream<string>;
    private _sForceClicked:StreamSink<string>;
    private _selectedCell:CellLoop<string>;

    constructor(private configs: Array<MenuItem>, firstId?:string) {
        super();

        this.x = 10;
        this.y = 10;

        Transaction.run((): void => {

            //needs to be a loop since:
            //1. button is defined in terms of selectedCell
            //2. selectedCell is defined in terms of sClicked.hold() 
            //3. sClicked is defined in terms of button.sClicked
            // therefore button (selectedCell) is defined in terms of itself
            this._selectedCell = new CellLoop<string>();

            //create the buttons
            const buttons = configs.map(config => new MenuButton(this._selectedCell, config));

            //merge all the button click streams into one
            this._sClicked = buttons
                                .map(button => button.sClicked)
                                .reduce((acc:Stream<string>, elem:Stream<string>) => acc.orElse(elem));
            
            //add capability to force an id to be set from the outside
            this._sForceClicked = new StreamSink<string>();
            this._sClicked = this._sClicked.orElse(this._sForceClicked);

            //create the cell that holds the value of the clicks
            this._selectedCell.loop(this._sClicked.hold(firstId));

            //output - render
            Menu_SetLayout(buttons);
            buttons.forEach(button => this.addChild(button));
            
        });
    }

    public forceId(id:string) {
        this._sForceClicked.send(id);
    }

    public get sClicked():Stream<string> {
        return this._sClicked
    }

    public get cId():Cell<string> {
        return this._selectedCell;
    }
}