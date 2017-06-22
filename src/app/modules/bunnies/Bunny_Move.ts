export interface Move {
    origin: Point;
    direction: Point;
}

interface Point {
    x: number;
    y: number;
}

const GRAVITY = 0.75;

export function UpdateMove(_move: Move, bounds:PIXI.Rectangle): Move {
    let move = {
        origin: Object.assign(_move.origin),
        direction: Object.assign(_move.direction)
    }

    move.origin.x += move.direction.x;
    move.origin.y += move.direction.y;
    move.direction.y += GRAVITY;

    if (move.origin.x > bounds.right) {
        move.direction.x *= -1;
        move.origin.x = bounds.right;
    }
    else if (move.origin.x < bounds.left) {
        move.direction.x *= -1;
        move.origin.x = bounds.left;
    }

    if (move.origin.y > bounds.bottom) {
        move.direction.y *= -0.85;
        move.origin.y = bounds.bottom;
        if (Math.random() > 0.5) {
            move.direction.y -= Math.random() * 6;
        }
    }
    else if (move.origin.y < bounds.top) {
        move.direction.y = 0;
        move.origin.y = bounds.top;
    }

    return Object.freeze(move);
}
