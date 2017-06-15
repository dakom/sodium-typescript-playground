import {Main} from "./main/Main";
import {MenuConfigs} from "./topmenu/MenuConfig";
import {TopMenu} from "./topmenu/TopMenu";

let app:PIXI.Application = Main.CreateApplicationWindow(1024, 576,0xF0EAD2, "#091D27");

let topMenu:TopMenu = new TopMenu();
app.stage.addChild(topMenu);

topMenu.render();
topMenu.position.set(10, 10);

