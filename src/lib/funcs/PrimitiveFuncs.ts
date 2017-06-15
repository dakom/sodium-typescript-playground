import * as R from "ramda";

export class PrimitiveFuncs {
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
}