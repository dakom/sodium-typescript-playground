import { CanvasWidth, CanvasHeight } from "../../main/Main";
import { Stream, Transaction, CellLoop } from "sodiumjs";
import { BaseContainer } from "../BaseContainer"
import * as R from "ramda";

interface Point {
    x: number;
    y: number;
}

interface Move {
    origin: Point;
    direction: Point;
}

const GRAVITY = 0.75;

export class Bunny extends PIXI.Sprite {
    private move: Move;

    constructor(texture: PIXI.Texture, private bounds: PIXI.Rectangle) {
        super(texture)
        this.anchor.x = 0.5;
        this.anchor.y = 1;

        this.move = Object.freeze({
            origin: {
                x: 0,
                y: 0
            },
            direction: {
                x: Math.random() * 10,
                y: (Math.random() * 10) - 5
            }
        });
    }

    public update(deltaTime: number) {
        this.move = this.updatePosition(this.move);
        this.x = this.move.origin.x;
        this.y = this.move.origin.y;
    }

    updatePosition(_move: Move): Move {
        let move = {
            origin: Object.assign(_move.origin),
            direction: Object.assign(_move.direction)
        }

        move.origin.x += move.direction.x;
        move.origin.y += move.direction.y;
        move.direction.y += GRAVITY;

        if (move.origin.x > this.bounds.right) {
            move.direction.x *= -1;
            move.origin.x = this.bounds.right;
        }
        else if (move.origin.x < this.bounds.left) {
            move.direction.x *= -1;
            move.origin.x = this.bounds.left;
        }

        if (move.origin.y > this.bounds.bottom) {
            move.direction.y *= -0.85;
            move.origin.y = this.bounds.bottom;
            if (Math.random() > 0.5) {
                move.direction.y -= Math.random() * 6;
            }
        }
        else if (move.origin.y < this.bounds.top) {
            move.direction.y = 0;
            move.origin.y = this.bounds.top;
        }

        return Object.freeze(move);
    }
}