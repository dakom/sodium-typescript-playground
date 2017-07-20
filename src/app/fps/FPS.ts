import {CanvasWidth} from "../main/Main";

export class FPS extends PIXI.Text {

    constructor() {
        super()

        
        const ticker = new PIXI.ticker.Ticker();
        const startTime = Date.now();

        ticker.add(() => {
            const rFps = Math.round(ticker.FPS);
            const elapsedTime = Math.floor((Date.now() - startTime)/1000);

            this.text = rFps.toString() + " FPS " + elapsedTime + " secs";
            this.x = (CanvasWidth - this.width) - 20;
        }); 
        ticker.start();

        this.on('removed', () => ticker.stop());
    }
}