export class Shape extends PIXI.Graphics {
    private _selected:boolean = true;

    constructor(private sType:string, private fillColor:number, private borderColor:number) {
        super();
        this.redraw();
    }


    redraw() {
        this.clear();
        this.beginFill(this.fillColor, this._selected ? 1 : 0);
        this.lineStyle(2, this.borderColor);
        switch(this.sType) {
            case "circle": this.drawCircle(0,0,50); break;
            case "square": this.drawRoundedRect(-50,-50,100,100, 10); break;
            case "triangle": this.drawPolygon([
                -50,-50,
                -50,50,
                50,50,
                -50,-50,
            ]); 
            break;
            default: break;
        }
        this.endFill();
    }
}