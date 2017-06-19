import { ScaleToWindow } from "./io/ScaleToWindow";
import { Stream, StreamSink } from "sodiumjs";
import { Map } from "immutable";
import { Transform } from "../structs/Transform";
import { TouchEvent } from "../structs/TouchEvent";

const dMapId = Symbol("dMapId");

export class Main {
    private static app: PIXI.Application;

    private static sInputSink: StreamSink<Event>;

    private static dMap: Map<number, PIXI.DisplayObject>;
    private static dMapCount = 0;

    public static Init(width: number, height: number, appBackgroundColor: number, pageBackgroundColor: string) {
        //SETUP DISPLAY
        this.app = new PIXI.Application(width, height, { backgroundColor: appBackgroundColor }); //preserveDrawingBuffer for saving images
        document.body.appendChild(this.app.view);
        window.onresize = () => ScaleToWindow(this.app.view, pageBackgroundColor);
        ScaleToWindow(this.app.view, pageBackgroundColor);

        //SETUP INPUT
        let interactionManager = this.app.renderer.plugins.interaction as PIXI.interaction.InteractionManager;
        ['pointerdown', 'pointermove', 'pointerup', 'pointeroutside']
            .forEach(evtType => interactionManager.on(evtType, evt => {
                if (evt.currentTarget !== null && evt.currentTarget !== undefined) {

                    if (evt.currentTarget instanceof PIXI.DisplayObject) {
                        let obj = evt.currentTarget;

                        let touchEvent = new TouchEvent(obj[dMapId], evt.type);
                        if (evt.type === "mousedown") {
                            console.log("item touched", touchEvent);
                            //TODO: send as stream!
                        }
                    }

                    /*
                    switch (evt.type) {
                        case "mousedown":
                        case "pointerdown":
                            console.log("will stream", touchEvent);
                            break;

                        case "pointermove":
                        case "mousemove":
                            break;

                        case "pointerover":
                        case "mouseover":
                            break;

                        case "mouseout":
                        case "pointerout":
                            break;

                        case "mouseup":
                        case "pointerup":
                            break;

                        case "mouseupoutside":
                        case "pointerupoutside":
                            break;
                    }*/
                }

            }));

        this.dMap = Map<number, PIXI.DisplayObject>();

        
    }

    public static Add(obj: PIXI.DisplayObject, parent?: PIXI.Container): number {
        if (parent === undefined) {
            parent = this.app.stage;
        }

        parent.addChild(obj);

        let mapId = this.dMapCount;
        obj[dMapId] = mapId;
        this.dMap = this.dMap.set(mapId, obj);
        this.dMapCount++
        return mapId;
    }

    public static Delete(obj: number | PIXI.DisplayObject) {
        if (typeof obj === "number") {
            this.Delete(this.dMap.get(obj));
        } else if (obj instanceof PIXI.DisplayObject) {
            if (obj.parent !== undefined && obj.parent !== null) {
                obj.parent.removeChild(obj);
            }
            this.dMap = this.dMap.delete(obj[dMapId]);
        }
    }


    public static ApplyTransform(transform: Transform) {
        let obj = this.dMap.get(transform.id);
        obj.x = transform.x;
        obj.y = transform.y;
        obj.scale.x = transform.scaleX;
        obj.scale.y = transform.scaleY;
        obj.rotation = transform.rotation;
    }

    public static GetTransform(obj: number | PIXI.DisplayObject): Transform {
        if (typeof obj === "number") {
            return this.GetTransform(this.dMap.get(obj));
        } else if (obj instanceof PIXI.DisplayObject) {
            return new Transform(obj[dMapId],
                obj.x,
                obj.y,
                obj.scale.x,
                obj.scale.y,
                obj.rotation
            )
        }
    }
}