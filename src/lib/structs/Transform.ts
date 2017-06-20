import {Stream, StreamSink} from "sodiumjs";

export class Transform {
    constructor(
        public readonly ptr: PIXI.DisplayObject,
        public readonly x: number,
        public readonly y: number,
        public readonly scaleX: number,
        public readonly scaleY: number,
        public readonly rotation: number
    ) { }

    public writeDisplayObject():Transform {
        return Transform.writeDisplayObject(this);
    }

    public static readDisplayObject(obj:PIXI.DisplayObject):Transform {
        return new Transform(obj,
        obj.x,
        obj.y,
        obj.scale.x,
        obj.scale.y,
        obj.rotation
        )
    }

    public static writeDisplayObject(t:Transform):Transform {
        t.ptr.x = t.x;
        t.ptr.y = t.y;
        t.ptr.scale.x = t.scaleX;
        t.ptr.scale.y = t.scaleY;
        t.ptr.rotation = t.rotation;
        
        return t;
    }
}