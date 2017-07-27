import { Transaction, CellLoop, StreamSink, Stream, Cell, CellSink } from "sodiumjs";

export interface ShapeOptions {
    type: string;
    fillColor: number;
    borderColor: number;
    initX: number;
    initY: number;
}

export class Shape extends PIXI.Graphics {
    private _selected: boolean = false;

    constructor(public readonly opts: ShapeOptions) {
        super();
        this.interactive = this.buttonMode = true;
        this.redraw();
        this.x = opts.initX;
        this.y = opts.initY;
    }

    public set selected(val: boolean) {
        this._selected = val;
        this.redraw();
    }

    redraw() {
        this.clear();
        this.beginFill(this.opts.fillColor, this._selected ? 1 : 0);
        this.lineStyle(2, this.opts.borderColor);
        switch (this.opts.type) {
            case "circle": this.drawCircle(0, 0, 50); break;
            case "square": this.drawRoundedRect(-50, -50, 100, 100, 10); break;
            case "triangle": this.drawPolygon([
                -50, -50,
                -50, 50,
                50, 50,
                -50, -50,
            ]);
                break;
            default: break;
        }
        this.endFill();
    }
}

export function CreateShapes() {
    return [
        new Shape({
            type: "circle",
            fillColor: 0xFF0000,
            borderColor: 0x0,
            initX: 300,
            initY: 300
        }),
        new Shape({
            type: "square",
            fillColor: 0x00FF00,
            borderColor: 0x0,
            initX: 600,
            initY: 300
        }),
        new Shape({
            type: "triangle",
            fillColor: 0x0000FF,
            borderColor: 0x0,
            initX: 900,
            initY: 300
        }),
    ]
}