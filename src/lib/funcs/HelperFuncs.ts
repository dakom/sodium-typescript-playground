import {Ref, IDisplayObjectRef} from "../refs/Ref";
import * as R from "ramda";

export class HelperFuncs {
    //takes a margin and a list of numbers
    //adds the margin into them sequentially increasing to give it space
    public static addMargin(margin:number, vals:Array<number>):Array<number> {
        let mapIndexed = R.addIndex(R.map);
        return mapIndexed((val, idx) => val + (idx * margin), vals);
    }

    //accumulates the total of property prop in all the vals
    public static accProps(prop:string, vals:Array<any>):Array<number> {
        return R.scan(R.add, 0, R.pluck(prop, vals));
    }

    //takes in refs and gives back refs in a row layout
    //takes in padding as an option, calculates based on ref width and x
    public static getLayoutRow(padding:number, refs:Array<IDisplayObjectRef>):Array<IDisplayObjectRef> {
        //todo - change this to compose()
        let positions = HelperFuncs.addMargin(padding, HelperFuncs.accProps("width", refs));
        return R.zipWith((ref, x) => R.assoc('x', x, ref), refs, positions);
    }
}