import { Transaction, CellLoop, StreamSink, Stream, Cell, CellSink} from "sodiumjs";

export class Shape extends PIXI.Graphics {
    private _selected:boolean = false;
    private _sTouchStart:StreamSink<PIXI.interaction.InteractionEvent>;
   
    constructor(private sType:string, private _color:number, private borderColor:number) {
        super();
        
        const sTouchStart = new StreamSink<PIXI.interaction.InteractionEvent>();
   
        this._sTouchStart = sTouchStart;
        this.interactive = this.buttonMode = true;
        
        this.on('pointerdown', evt => this._sTouchStart.send(evt));        

        this.redraw();
    }

    public get sTouchStart():Stream<PIXI.interaction.InteractionEvent> {
        return this._sTouchStart;
    }

    public set selected(val:boolean) {
        this._selected = val;
        this.redraw();
    }


    redraw() {
        this.clear();
        this.beginFill(this._color, this._selected ? 1 : 0);
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