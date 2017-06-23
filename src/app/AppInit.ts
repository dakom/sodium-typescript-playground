import { Main } from "./main/Main";
import { Menu, CreateMenuItem } from "../lib/menu/Menu";
import { SimpleMove } from "./modules/simplemove/SimpleMove";
import { Switch } from "./modules/switch/Switch";

import { Bunnies } from "./modules/bunnies/Bunnies";
import { CellLoop, StreamSink, Cell, Transaction } from "sodiumjs"
import { BaseContainer } from "../lib/display/BaseContainer";
import { FPS } from "./fps/FPS";

//Core IO
Main.Init();

const stage = Main.app.stage;

const topMenu = new Menu([
    CreateMenuItem("simple"),
    CreateMenuItem("bunnies"),
    CreateMenuItem("switch"),
    CreateMenuItem("draw"),
    CreateMenuItem("select"),
    CreateMenuItem("select_and_draw", "select + draw")
]);
stage.addChild(topMenu);

const fps: FPS = new FPS;
stage.addChild(fps);

//disposable stuff
let currentModule: BaseContainer;

//top menu listener
topMenu.sClicked.listen(id => {
    if (currentModule !== undefined) {
        stage.removeChild(currentModule);
        currentModule = undefined;
    }

    switch (id) {
        case "simple": currentModule = new SimpleMove();
            break;
        case "bunnies": currentModule = new Bunnies();
            break;
        case "switch": currentModule = new Switch();
            break;
    }

    if (currentModule !== undefined) {
        stage.addChild(currentModule);
    }

    //these should always be the top layer
    stage.setChildIndex(topMenu, stage.children.length - 1);
    stage.setChildIndex(fps, stage.children.length - 1);

});

//just for testing
topMenu.forceId("switch");
