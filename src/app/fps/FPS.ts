import {CanvasWidth} from "../main/Main";

export class FPS extends PIXI.Text {

    constructor() {
        super()

        let nFps:number = -1;

        let ticker = new PIXI.ticker.Ticker();
        ticker.add(() => {
            let rFps = Math.round(ticker.FPS);
            if(nFps != rFps) {
                nFps = rFps;
                this.text = nFps.toString() + " FPS";
                this.x = (CanvasWidth - this.width) - 20;
            }
        }); 
        ticker.start();

        this.on('removed', () => ticker.stop());
    }
}