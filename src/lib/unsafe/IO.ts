import {IDisplayObjectRef} from "../refs/Ref";

export class IO {
    public static Update(ptr:any) {
        if(<IDisplayObjectRef>ptr) {
            ptr.__internalPointer.width = ptr.width;
            ptr.__internalPointer.height = ptr.height;
            ptr.__internalPointer.x = ptr.x;
            ptr.__internalPointer.y = ptr.y;
            ptr.__internalPointer.scale.x = ptr.scaleX;
            ptr.__internalPointer.scale.y = ptr.scaleY;
            ptr.__internalPointer.rotation = ptr.rotation;
        }
    }
}