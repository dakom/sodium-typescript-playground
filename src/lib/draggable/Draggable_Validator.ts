
export interface DraggableValidator {
    (displayTarget: PIXI.DisplayObject, point:PIXI.Point): boolean;
}

export function HorizontalValidator(xMin:number, xMax:number): DraggableValidator {
    return function(displayTarget: PIXI.DisplayObject, point:PIXI.Point) {
        return (point.x >= xMin && point.x <= xMax) ? true : false;
    }
}

export function VerticalValidator(yMin:number, yMax:number): DraggableValidator {
    return function(displayTarget: PIXI.DisplayObject, point:PIXI.Point) {
        return (point.y >= yMin && point.y <= yMax) ? true : false;
    }
}

export function RectValidator(rect:PIXI.Rectangle): DraggableValidator {
    return function(displayTarget: PIXI.DisplayObject, point:PIXI.Point) {
        const hValidator = HorizontalValidator(rect.x, rect.x + rect.width);
        const vValidator = VerticalValidator(rect.y, rect.y + rect.height);
        return (hValidator(displayTarget, point) && vValidator(displayTarget, point));
    }
}