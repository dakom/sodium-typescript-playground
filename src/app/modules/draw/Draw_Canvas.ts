
import { CanvasWidth, CanvasHeight, Main } from "../../main/Main";
import {Brush} from "./Draw_Brush";
import {TouchManager, Touch, TouchType} from "./Draw_Interaction";

enum STATE {
    NONE = 1,
    DRAWING
}

class TouchPoint {
    private _point:PIXI.Point = new PIXI.Point();
    public x:number;
    public y:number;

    public update(e:PIXI.interaction.InteractionEvent) {
        e.data.getLocalPosition(e.currentTarget, this._point, e.data.global);

        this.x = this._point.x >> 0;
        this.y = this._point.y >> 0;
    }
}

export class Canvas extends PIXI.Sprite {
    private renderTexture:PIXI.RenderTexture;
    private drawBuffer:PIXI.Sprite;
    private state:STATE = STATE.NONE;
    private startPoint:TouchPoint = new TouchPoint();
    private endPoint:TouchPoint = new TouchPoint();

    constructor(private brush:Brush) {
        super(PIXI.RenderTexture.create(CanvasWidth, CanvasHeight));

        this.renderTexture = this.texture as PIXI.RenderTexture;
        
        this.drawBuffer = new PIXI.Sprite();

        this.interactive = true;

        const touchManager = new TouchManager(this);
        
        touchManager.sTouch.listen(t => {
            switch(t.type) {
                case TouchType.START:
                    this.touchBegin(t.evt);
                    break;
                case TouchType.MOVE:
                    this.touchMove(t.evt);
                    break;
                case TouchType.END:
                    this.touchEnd(t.evt);
                    break;
            }
        })
        
    }

    touchBegin(e:PIXI.interaction.InteractionEvent) {
        this.startPoint.update(e);
        this.brush.changeColor();
        
        this.state = STATE.DRAWING;
    }

    

    touchMove(e:PIXI.interaction.InteractionEvent) {
        if(this.state === STATE.DRAWING) {
            if(e.data.global.x > 0 && e.data.global.x < CanvasWidth && e.data.global.y > 0 && e.data.global.y < CanvasHeight) {
                this.endPoint.update(e);
                
                this.drawLine();
                
                this.startPoint.x = this.endPoint.x;
                this.startPoint.y = this.endPoint.y;
            }
            
        }
    }

    touchEnd(e:PIXI.interaction.InteractionEvent) {
        if(this.state === STATE.DRAWING) {
            this.state = STATE.NONE;
        }
    }

    drawLine() {
        let points:Array<number> = this.getLine(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
        if(points.length == 0) {
            return;
        }

        let sprites:Array<PIXI.Sprite> = this.brush.getSprites(points.length/2);
        for(let pointIndex = 0, spriteIndex = 0; pointIndex < points.length;) {
            let sprite = sprites[spriteIndex++];
            sprite.position.set(points[pointIndex++], points[pointIndex++]);
            this.drawBuffer.addChild(sprite);
        }
        Main.app.renderer.render(this.drawBuffer, this.renderTexture, false);
        this.brush.returnToPool(sprites);
        this.drawBuffer.removeChildren();
    }
    
    //algorithm adapted from http://cboard.cprogramming.com/game-programming/67832-line-drawing-algorithm.html#post485086
    getLine(x1:number, y1:number, x2:number, y2:number):Array<number> {
        
        var dx:number;
        var dy:number;
        var inx:number;
        var iny:number;
        var e:number;
        var line:Array<number> = new Array<number>();


        if(x1 == x2 && y1 == y2) {
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