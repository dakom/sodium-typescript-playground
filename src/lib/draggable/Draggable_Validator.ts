import {DraggableEvent} from "./Draggable";

export interface DraggableValidator {
    (evt:DraggableEvent): boolean;
}

export function HorizontalValidator(xMin:number, xMax:number): DraggableValidator {
    return function(evt:DraggableEvent) {
        return (evt.point.x >= xMin && evt.point.x <= xMax) ? true : false;
    }
}

export function VerticalValidator(yMin:number, yMax:number): DraggableValidator {
    return function(evt:DraggableEvent) {
        return (evt.point.y >= yMin && evt.point.y <= yMax) ? true : false;
    }
}

export function RectValidator(rect:PIXI.Rectangle): DraggableValidator {
    return function(evt:DraggableEvent) {
        const hValidator = HorizontalValidator(rect.x, rect.x + rect.width);
        const vValidator = VerticalValidator(rect.y, rect.y + rect.height);
        return (hValidator(evt) && vValidator(evt));
    }
}