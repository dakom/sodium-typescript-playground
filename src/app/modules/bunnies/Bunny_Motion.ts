export interface Motion {
    origin: Point;
    direction: Point;
}

interface Point {
    x: number;
    y: number;
}

const GRAVITY = 0.75;

//update the motion - explicitly copying and freezing to ensure immutability here
export function UpdateMotion(_motion: Motion, bounds: PIXI.Rectangle): Motion {
    const motion = {
        origin: Object.assign({}, _motion.origin),
        direction: Object.assign({}, _motion.direction)
    }

    motion.origin.x += motion.direction.x;
    motion.origin.y += motion.direction.y;
    motion.direction.y += GRAVITY;

    if (motion.origin.x > bounds.right) {
        motion.direction.x *= -1;
        motion.origin.x = bounds.right;
    }
    else if (motion.origin.x < bounds.left) {
        motion.direction.x *= -1;
        motion.origin.x = bounds.left;
    }

    if (motion.origin.y > bounds.bottom) {
        motion.direction.y *= -0.85;
        motion.origin.y = bounds.bottom;
        if (Math.random() > 0.5) {
            motion.direction.y -= Math.random() * 6;
        }
    }
    else if (motion.origin.y < bounds.top) {
        motion.direction.y = 0;
        motion.origin.y = bounds.top;
    }

    return Object.freeze(motion);
}

export function NewMotion(): Motion {
    return Object.freeze({
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