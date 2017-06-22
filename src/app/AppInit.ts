import { Main } from "./main/Main";
import { TopMenu } from "./topmenu/TopMenu";
import { SimpleMove } from "./modules/simplemove/SimpleMove";
import { Bunnies } from "./modules/bunnies/Bunnies";
import { CellLoop, StreamSink, Cell, Transaction } from "sodiumjs"
import { BaseContainer } from "./modules/BaseContainer";

//Core IO
Main.Init();

let stage = Main.app.stage;
//let topMenu = new TopMenu(stage, undefined);
let topMenu = new TopMenu(stage, "bunnies");
let currentModule: BaseContainer;

//Module changing handler
topMenu.onSelected.listen(id => {
    if (currentModule !== undefined) {
        stage.removeChild(currentModule);
        currentModule = undefined;
    }

    switch (id) {
        case "simple": currentModule = new SimpleMove();
        break;
        case "bunnies": currentModule = new Bunnies();
            break;
    }

    if (currentModule !== undefined) {
        stage.addChild(currentModule);
    }
});
