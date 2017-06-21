import { Main } from "./Main";
import { TopMenu } from "./topmenu/TopMenu";
import { SimpleMove } from "./modules/simplemove/SimpleMove";
import { Cell, Transaction } from "sodiumjs"

//Core IO
Main.Init();

let stage = Main.app.stage;
let topMenu = new TopMenu(stage, "simple");
let currentModule: PIXI.Container;

//Module changing handler
function changeModule(id) {
    if (currentModule !== undefined) {
        stage.removeChild(currentModule);
        currentModule = undefined;
    }

    switch (id) {
        case "simple": currentModule = new SimpleMove();
            break;
    }

    if (currentModule !== undefined) {
        stage.addChild(currentModule);
    }
}

//Basically, main
topMenu.onSelected.listen(changeModule);
