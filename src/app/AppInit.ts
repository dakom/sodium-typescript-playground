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



//ts doesn't seem to support embedded types like go
//so __internalPointer probably needs to just be copied/pasted
//all of these should be primitives, e.g. no PIXI.Point()
interface IRef {
    __internalPointer:any; 
}

interface IDisplayObjectRef {
    __internalPointer:PIXI.DisplayObject;
    x:number;
    y:number;
    scaleX:number;
    scaleY:number;
    rotation:number;
}

class Ref {
    public static Update(ptr:any) {
        if(<IDisplayObjectRef>ptr) {
            ptr.__internalPointer.x = ptr.x;
            ptr.__internalPointer.y = ptr.y;
            ptr.__internalPointer.scale.x = ptr.scaleX;
            ptr.__internalPointer.scale.y = ptr.scaleY;
            ptr.__internalPointer.rotation = ptr.rotation;
        }
    }

    public static Create_DisplayObject(target:PIXI.DisplayObject): IDisplayObjectRef {
        return {
            __internalPointer: target,
            x: target.x,
            y: target.y,
            scaleX: target.scale.x,
            scaleY: target.scale.y,
            rotation: target.rotation
        }    
    }
}



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


let ballRef = Ref.Create_DisplayObject(ball);

function gameLoop(deltaTime:number) {
    //makes a new copy
    ballRef = R.assoc('x', ballRef.x + deltaTime * 1, ballRef);
    Ref.Update(ballRef);
}