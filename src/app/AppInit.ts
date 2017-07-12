import { Main } from "./main/Main";
import { Menu, CreateMenuItem } from "../lib/menu/Menu";
import { Simple } from "./modules/simple/Simple";
import { Switch } from "./modules/switch/Switch";
import { Bunnies } from "./modules/bunnies/Bunnies";
import {Draw} from "./modules/draw/Draw";
import {Move} from "./modules/move/Move";
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
    CreateMenuItem("move"),
    CreateMenuItem("move_and_draw", "move + draw")
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
        case "simple": currentModule = new Simple();
            break;
        case "bunnies": currentModule = new Bunnies();
            break;
        case "switch": currentModule = new Switch();
            break;

            case "draw": currentModule = new Draw();
            break;
            case "move": currentModule = new Move();
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
topMenu.forceId("move");
