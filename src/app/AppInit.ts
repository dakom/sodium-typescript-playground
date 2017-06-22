import { Main } from "./Main";
import { TopMenu } from "./topmenu/TopMenu";
import { SimpleMove } from "./modules/simplemove/SimpleMove";
import { CellLoop, StreamSink, Cell, Transaction } from "sodiumjs"
import { IDisposable } from "./interfaces/IDisposable";
//Core IO
Main.Init();

let stage = Main.app.stage;
let topMenu = new TopMenu(stage, undefined);
//let topMenu = new TopMenu(stage, "simple");
let currentModule: PIXI.DisplayObject | IDisposable;

//Module changing handler
topMenu.onSelected.listen(id => {
    if (currentModule !== undefined) {
        stage.removeChild(currentModule as PIXI.DisplayObject);
        (currentModule as IDisposable).dispose();

        currentModule = undefined;
    }

    switch (id) {
        case "simple": currentModule = new SimpleMove();
            break;
    }

    if (currentModule !== undefined) {
        stage.addChild(currentModule as PIXI.DisplayObject);
    }
});
