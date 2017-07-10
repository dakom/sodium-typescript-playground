
import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink } from "sodiumjs";
import { CanvasWidth, CanvasHeight, Main } from "../../main/Main";
import { Brush } from "./Draw_Brush";
import { Point } from "./Draw";

export class Canvas extends PIXI.Sprite {
    private renderTexture: PIXI.RenderTexture;
    private drawBuffer: PIXI.Sprite;
    private startPoint: Point;
    
    constructor(private brush: Brush) {
        //rendering/vis setup
        super(PIXI.RenderTexture.create(CanvasWidth, CanvasHeight));
        this.interactive = true;
        this.renderTexture = this.texture as PIXI.RenderTexture;
        this.drawBuffer = new PIXI.Sprite();
    }

    public drawBegin(point:Point) {
        this.startPoint = point;
        this.brush.changeColor();
    }

    public drawUpdate(point:Point) {
        this.drawLine(this.startPoint, point);
        this.startPoint = point;
    }

    public drawEnd(point:Point) {

    }

    drawLine(p1:Point, p2:Point) {
        let points: Array<number> = this.getLine(p1.x, p1.y, p2.x, p2.y);
        if (points.length == 0) {
            return;
        }

        let sprites: Array<PIXI.Sprite> = this.brush.getSprites(points.length / 2);
        for (let pointIndex = 0, spriteIndex = 0; pointIndex < points.length;) {
            let sprite = sprites[spriteIndex++];
            sprite.position.set(points[pointIndex++], points[pointIndex++]);
            this.drawBuffer.addChild(sprite);
        }
        Main.app.renderer.render(this.drawBuffer, this.renderTexture, false);
        this.brush.returnToPool(sprites);
        this.drawBuffer.removeChildren();
    }

    //algorithm adapted from http://cboard.cprogramming.com/game-programming/67832-line-drawing-algorithm.html#post485086
    getLine(x1: number, y1: number, x2: number, y2: number): Array<number> {

        var dx: number;
        var dy: number;
        var inx: number;
        var iny: number;
        var e: number;
        var line: Array<number> = new Array<number>();


        if (x1 == x2 && y1 == y2) {
            return line;
        }

        dx = x2 - x1;
        dy = y2 - y1;
        inx = dx > 0 ? 1 : -1;
        iny = dy > 0 ? 1 : -1;

        dx = Math.abs(dx);
        dy = Math.abs(dy);

        if (dx >= dy) {
            dy <<= 1;
            e = dy - dx;
            dx <<= 1;
            while (x1 != x2) {
                line.push(x1, y1);
                if (e >= 0) {
                    y1 += iny;
                    e -= dx;
                }
                e += dy;
                x1 += inx;
            }
        } else {
            dx <<= 1;
            e = dx - dy;
            dy <<= 1;
            while (y1 != y2) {
                line.push(x1, y1);
                if (e >= 0) {
                    x1 += inx;
                    e -= dy;
                }
                e += dx;
                y1 += iny;
            }
        }
        line.push(x1, y1);
        return (line);
    }
}