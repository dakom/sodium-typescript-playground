import * as R from "ramda";

export class PrimitiveFuncs {
    //takes a padding and a list of numbers
    //adds the padding into them sequentially increasing to give it space
    public static addPadding(pad:number, vals:Array<number>):Array<number> {
        
        let mapIndexed = R.addIndex(R.map);
        return mapIndexed((val, idx) => val + (idx * pad), vals);
    }

    //accumulates the total of property prop in all the vals - with a leading zero
    public static accPropsLeadingZero(prop:string, vals:Array<any>):Array<number> {
        return R.scan(R.add, 0, R.pluck(prop, vals));
    }
}