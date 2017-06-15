/*import {Main} from "./main/Main";
import {MenuConfigs} from "./topmenu/MenuConfig";
import {TopMenu} from "./topmenu/TopMenu";

let app:PIXI.Application = Main.CreateApplicationWindow(1024, 576,0xF0EAD2, "#091D27");

let topMenu:TopMenu = new TopMenu();
app.stage.addChild(topMenu);

topMenu.render();
topMenu.position.set(10, 10);
*/

import * as R from 'ramda';


let app = new PIXI.Application(window.innerWidth, window.innerHeight);
document.body.appendChild(app.view);


let ball = new PIXI.Graphics();
ball.beginFill(0xFF0000);
ball.drawCircle(0,0,40);
ball.endFill();

ball.y = app.stage.height/2;

app.stage.addChild(ball); //app

let ticker = new PIXI.ticker.Ticker();
ticker.add(gameLoop);
ticker.start();

let ballReference = {
    ptr: ball,
    x: 0
}

function performUnsafeIO(reference) {
    reference.ptr.x = reference.x;
}
function gameLoop(deltaTime:number) {
    //this version breaks!
    //ball = R.assoc('x', ball.position.x + deltaTime * 1, ball);
    
    //This works fine... but are there any gotchas?
    ballReference = R.assoc('x', ballReference.x + deltaTime * 1, ballReference);
    performUnsafeIO(ballReference);
}