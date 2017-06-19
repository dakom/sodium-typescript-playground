import * as R from 'ramda';
import {Main} from "../lib/unsafe/Main";
import {Transform} from "../lib/structs/Transform";
const SCREEN_WIDTH = 1920;
const SCREEN_HEIGHT = 1080;

Main.Init(SCREEN_WIDTH,SCREEN_HEIGHT,0xF0EAD2, "#091D27");

//Just for testing now...
let ball = new PIXI.Graphics();
ball.beginFill(0xFF0000);
ball.drawCircle(0,0,40);
ball.endFill();

ball.y = SCREEN_HEIGHT/2;
ball.x = SCREEN_WIDTH/2;
ball.interactive = ball.buttonMode = true;
Main.Add(ball);

let transform = Main.GetTransform(ball);

//todo: change to stream in main
let ticker = new PIXI.ticker.Ticker();
ticker.add(gameLoop);
ticker.start();

function gameLoop(deltaTime:number) {
    transform = R.set(R.lensProp('x'), transform.x + deltaTime * 1, transform);
    Main.ApplyTransform(transform);
}
