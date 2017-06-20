import {Main} from "./Main";
import {TopMenu} from "./topmenu/TopMenu";
import {SimpleMove} from "./modules/simplemove/SimpleMove";

Main.Init();

let stage = Main.app.stage;

let topMenu = new TopMenu(stage);
//todo... change this to a switch that affects which module is active
topMenu.sClicked.listen(console.log);
new SimpleMove(stage);