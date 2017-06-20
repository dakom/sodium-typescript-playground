import {Main} from "./Main";
import {TopMenu} from "./topmenu/TopMenu";
import {SimpleMove} from "./modules/simplemove/SimpleMove";
import {Cell, CellLoop, Transaction, StreamSink} from "sodiumjs"
Main.Init();


Transaction.run((): void => {
    let stream = new StreamSink<number>();
    let cell = stream.hold(0);

    stream.snapshot(cell, (a, b) => b)
        .listen(console.log);
    
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