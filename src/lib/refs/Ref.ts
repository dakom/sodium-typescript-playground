//there's a lot of repetition but since this is already in "unsafe" it's intended
//for simple imperative getters/setters. in any case these things could be templatized

//ts doesn't seem to support embedded types like go
//so __internalPointer probably needs to just be copied/pasted
//all of these should be primitives, e.g. no PIXI.Point()

export interface IRef {
    __internalPointer:any; 
}

export interface IDisplayObjectRef {
    __internalPointer:PIXI.DisplayObject;
    width:number;
    height:number;
    x:number;
    y:number;
    scaleX:number;
    scaleY:number;
    rotation:number;
}

export class Ref {
    

    public static Create_DisplayObject(target:PIXI.Container): IDisplayObjectRef {
        return {
            __internalPointer: target,
            width: target.width,
            height: target.height,
            x: target.x,
            y: target.y,
            scaleX: target.scale.x,
            scaleY: target.scale.y,
            rotation: target.rotation
        }    
    }
}