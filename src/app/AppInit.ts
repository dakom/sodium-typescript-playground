import { Main } from "./main/Main";
import { Menu, CreateMenuItem } from "../lib/menu/Menu";
import { Simple } from "./modules/simple/Simple";
import { Switch } from "./modules/switch/Switch";
import { Bunnies } from "./modules/bunnies/Bunnies";
import { DrumMachine } from "./modules/drum_machine/DrumMachine";
import { Draw } from "./modules/draw/Draw";
import { Move } from "./modules/move/Move";
import { CellLoop, StreamSink, Cell, Transaction, Operational } from "sodiumjs"
import { SelfDisposingContainer } from "../lib/display/SelfDisposingContainer";
import { FPS } from "./fps/FPS";

//Canvas/HTML setup
Main.Init();

//Core UI
const stage = Main.app.stage;

const topMenu = new Menu([
    CreateMenuItem("simple"),
    CreateMenuItem("bunnies"),
    CreateMenuItem("switch"),
    CreateMenuItem("draw"),
    CreateMenuItem("move", "move tap"),
    CreateMenuItem("drum_machine", "drum machine")
]);
stage.addChild(topMenu);

const fps: FPS = new FPS;
stage.addChild(fps);

//Main
const cScene = topMenu.sClicked.map(id => {
    switch (id) {
        case "simple": return new Simple();
        case "bunnies": return new Bunnies();
        case "switch": return new Switch();
        case "draw": return new Draw();
        case "move": return new Move();
        case "drum_machine": return new DrumMachine();      
    }
}).hold(undefined);

//using operational updates so we can get both the old value and the new one
Operational.updates(cScene).snapshot(cScene, (newScene, oldScene) => {
    if (oldScene !== undefined) {
        stage.removeChild(oldScene);
    }
    stage.addChild(newScene);

}).listen(() => {
    //these should always be the top layer
    stage.setChildIndex(topMenu, stage.children.length - 1);
    stage.setChildIndex(fps, stage.children.length - 1);
});

//force starting module (via menu)
//topMenu.forceId("simple");
topMenu.forceId("drum_machine");