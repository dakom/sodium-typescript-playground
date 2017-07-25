
import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink } from "sodiumjs";
import { CanvasWidth, CanvasHeight, Main } from "../../main/Main";
import { Brush } from "./Draw_Brush";
import { Point } from "./Draw";
import * as R from "ramda";

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
        const points = this.getLine(p1.x, p1.y, p2.x, p2.y);
        if (points.length == 0) {
            return;
        }

        const sprites: Array<PIXI.Sprite> = this.brush.getSprites(points.length);

        sprites.forEach((sprite, index) => {
            const point = points[index];
            sprite.position.set(point.x, point.y);
            this.drawBuffer.addChild(sprite);
        });

        Main.app.renderer.render(this.drawBuffer, this.renderTexture, false);
        this.brush.returnToPool(sprites);
        this.drawBuffer.removeChildren();
    }

    //algorithm adapted from http://cboard.cprogramming.com/game-programming/67832-line-drawing-algorithm.html#post485086
    getLine(x1: number, y1: number, x2: number, y2: number): Array<Point> {
        const line = new Array<Point>();
        
        let dx: number;
        let dy: number;
        let inx: number;
        let iny: number;
        let e: number;
        


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
                line.push({ x: x1, y: y1 });
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
                line.push({ x: x1, y: y1 });
                if (e >= 0) {
                    x1 += inx;
                    e -= dy;
                }
                e += dx;
                y1 += iny;
            }
        }
        line.push({ x: x1, y: y1 });
        return (line);
    }
}