
import { Cell, Transaction, CellLoop, CellSink, Stream, StreamSink } from "sodiumjs";
import { Brush } from "./Draw_Brush";
import { Point } from "./Draw";
import { Main } from "../../main/Main";
import * as R from "ramda";

export class CanvasRender extends PIXI.Sprite {
    private renderTexture: PIXI.RenderTexture;
    private drawBuffer: PIXI.Sprite;
    
    constructor(private brush: Brush, bounds:PIXI.Rectangle) {
        //rendering/vis setup
        super(PIXI.RenderTexture.create(bounds.width, bounds.height));
        this.interactive = true;
        this.renderTexture = this.texture as PIXI.RenderTexture;
        this.drawBuffer = new PIXI.Sprite();
    }

    public drawBegin(point:Point) {
        this.brush.changeColor();
    }

    public drawEnd(point:Point) {

    }

    public drawUpdate(p1:PIXI.Point, p2:PIXI.Point) {
        const points = this.getLine(p1.x, p1.y, p2.x, p2.y);
        if (points.length == 0) {
            console.error("THIS SHOULD NEVER HAPPEN");
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
        const d = new PIXI.Point();
        const i = new PIXI.Point();

        let e:number;
       


        if (x1 == x2 && y1 == y2) {
            return line;
        }

        d.x = x2 - x1;
        d.y = y2 - y1;
        i.x = d.x > 0 ? 1 : -1;
        i.y = d.y > 0 ? 1 : -1;

        d.x = Math.abs(d.x);
        d.y = Math.abs(d.y);

        if (d.x >= d.y) {
            d.y <<= 1;
            e = d.y - d.x;
            d.x <<= 1;
            while (x1 != x2) {
                line.push({ x: x1, y: y1 });
                if (e >= 0) {
                    y1 += i.y;
                    e -= d.x;
                }
                e += d.y;
                x1 += i.x;
            }
        } else {
            d.x <<= 1;
            e = d.x - d.y;
            d.y <<= 1;
            while (y1 != y2) {
                line.push({ x: x1, y: y1 });
                if (e >= 0) {
                    x1 += i.x;
                    e -= d.y;
                }
                e += d.x;
                y1 += i.y;
            }
        }
        line.push({ x: x1, y: y1 });
        return (line);
    }
}