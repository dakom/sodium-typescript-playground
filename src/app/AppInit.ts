import { Main } from "./Main";
import { TopMenu } from "./topmenu/TopMenu";
import { SimpleMove } from "./modules/simplemove/SimpleMove";
import { CellLoop, StreamSink, Cell, Transaction } from "sodiumjs"

//Core IO
Main.Init();

let stage = Main.app.stage;
let topMenu = new TopMenu(stage, "simple");
let currentModule: PIXI.Container;

//Module changing handler

topMenu.onSelected.listen(id => {
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
});


/*
Transaction.run((): void => {
    let counter = new StreamSink<number>();
    let holder = counter.hold(Date.now());
    let listener:any = holder.listen(console.log);
    
    //how to destroy holder?
    //this says unlisten is not a function
    listener.unlisten();
    
    setInterval(() => counter.send(Date.now()), 300);
});
*/

