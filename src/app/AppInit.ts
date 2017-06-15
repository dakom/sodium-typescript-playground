import {TopMenu} from "./topmenu/TopMenu";

import * as R from 'ramda';
import {Ref} from "../lib/refs/Ref";
import {IO} from "../lib/unsafe/IO";
import {Application} from "../lib/unsafe/Application";

let app:PIXI.Application = Application.Create(1920, 1080,0xF0EAD2, "#091D27");
let topMenu:TopMenu = new TopMenu();
app.stage.addChild(topMenu);

topMenu.render();
topMenu.position.set(10, 10);

//Just for testing now...
let ball = new PIXI.Graphics();
ball.beginFill(0xFF0000);
ball.drawCircle(0,0,40);
ball.endFill();

ball.y = 576/2;

app.stage.addChild(ball); //app

let ticker = new PIXI.ticker.Ticker();
ticker.add(gameLoop);
ticker.start();


let ballRef = Ref.Create_DisplayObject(ball);

function gameLoop(deltaTime:number) {
    //makes a new copy
    ballRef = R.assoc('x', ballRef.x + deltaTime * 1, ballRef);
    IO.Update(ballRef);
}