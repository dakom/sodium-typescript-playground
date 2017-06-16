import {PrimitiveFuncs} from "./PrimitiveFuncs";
import * as R from "ramda";

export class DisplayFuncs {
    
    //takes in refs and gives back refs in a row layout
    //takes in padding as an option, calculates based on ref width and x
    public static getLayoutRow<T>(padding:number, refs:Array<T>):Array<T> {
        //todo - change this to compose()
        let widths = PrimitiveFuncs.accProps("width", refs);
        let positions = PrimitiveFuncs.addPadding(padding, widths);
        return R.zipWith((ref, x) => R.assoc('x', x, ref), refs, positions);
    }
}