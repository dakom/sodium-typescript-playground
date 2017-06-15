import {Ref, IDisplayObjectRef} from "../refs/Ref";
import {PrimitiveFuncs} from "./PrimitiveFuncs";
import * as R from "ramda";

export class DisplayFuncs {
    
    //takes in refs and gives back refs in a row layout
    //takes in padding as an option, calculates based on ref width and x
    public static getLayoutRow(padding:number, refs:Array<IDisplayObjectRef>):Array<IDisplayObjectRef> {
        //todo - change this to compose()
        let widths = PrimitiveFuncs.accProps("width", refs);
        let positions = PrimitiveFuncs.addPadding(padding, widths);
        return R.zipWith((ref, x) => R.assoc('x', x, ref), refs, positions);
    }
}