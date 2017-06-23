import {Cell, Stream, StreamSink} from "sodiumjs";
import {MenuItem} from "./Menu";
import {MenuButton_UI} from "./Menu_UI";
import {BaseContainer} from "../../lib/display/BaseContainer"

export class MenuButton extends BaseContainer {
    private unlisten:() => void;

    private _sClicked:StreamSink<string>;

    constructor(selectedCell:Cell<string>, config:MenuItem) {
        super();

        //dispatch changes when clicked
        this._sClicked = new StreamSink<string>();
        this.on('pointerdown', evt => {
                    this._sClicked.send(config.id);
        });
        this.interactive = this.buttonMode = true;

        //re-render when the cell is updated
        this.unlisten = selectedCell
                        .map(id => id == config.id) //selected is boolean
                        .listen(selected => this.render(config.label, selected));

        //initial render is required to get the width
        this.render(config.label, false);
    }

    public get sClicked():Stream<string> {
        return this._sClicked;
    }

    render(label:string, selected:boolean) {
        this.removeChildren();
        this.addChild(MenuButton_UI(label, selected));
    }

    dispose() {
        this.unlisten();
    }
}