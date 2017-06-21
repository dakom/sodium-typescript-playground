import {Main} from "./Main";
import {TopMenu} from "./topmenu/TopMenu";
import {SimpleMove} from "./modules/simplemove/SimpleMove";
import {Cell, CellLoop, CellSink, Transaction, StreamSink, Stream, lambda1} from "sodiumjs"
Main.Init();

interface IScene {
    start():void;
    cleanup():void;
}

class IntroScene implements IScene {
    public start() {
        //load assets
        //begin gameplay
    }

    public cleanup() {
        //free texture memory
    }
}

Transaction.run((): void => {
    let stream = new StreamSink<number>();
    let cell = stream.hold(0);

    stream.listen(n => {
        lambda1((a:Cell<number>) => console.log(a.sample()), [cell]);
    });
        

    setInterval(() => stream.send(Date.now()), 1000);
});

/*
let stage = Main.app.stage;

let topMenu = new TopMenu(stage);
//todo... change this to a switch that affects which module is active

Transaction.run((): void => {

    let view = new CellLoop<number>();

    //topMenu.sClicked.snapshot(topMenu.id, (a,b) => console.log(a,b));

    topMenu.sClicked.listen(id => {
        console.log(topMenu.id.sample);
    });
});
new SimpleMove(stage);
*/