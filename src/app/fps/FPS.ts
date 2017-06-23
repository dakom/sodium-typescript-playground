import {CanvasWidth} from "../main/Main";

export class FPS extends PIXI.Text {

    constructor() {
        super()

        
        let ticker = new PIXI.ticker.Ticker();
        let startTime = Date.now();

        ticker.add(() => {
            let rFps = Math.round(ticker.FPS);
            let elapsedTime = Math.floor((Date.now() - startTime)/1000);

            this.text = rFps.toString() + " FPS " + elapsedTime + " secs";
            this.x = (CanvasWidth - this.width) - 20;
        }); 
        ticker.start();

        this.on('removed', () => ticker.stop());
    }
}