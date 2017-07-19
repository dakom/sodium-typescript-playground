import * as R from "ramda";

export class PrimitiveFuncs {
    //takes a padding and a list of numbers
    //adds the padding into them sequentially increasing to give it space
    public static addPadding(pad: number, vals: Array<number>): Array<number> {

        let mapIndexed = R.addIndex(R.map);
        return mapIndexed((val, idx) => val + (idx * pad), vals);
    }

    //accumulates the total of property prop in all the vals - with a leading zero
    public static accPropsLeadingZero(prop: string, vals: Array<any>): Array<number> {
        return R.scan(R.add, 0, R.pluck(prop, vals));
    }

    //adapted from https://stackoverflow.com/questions/846221/logarithmic-slider
    public static logarithmic(position:number): number {
        // position will be between 0 and 100
  var minp = 0;
  var maxp = 1;

  // The result should be between 100 an 10000000
  var minv = Math.log(0);
  var maxv = Math.log(1);

  // calculate adjustment factor
  var scale = (maxv-minv) / (maxp-minp);

  return Math.exp(minv + scale*(position-minp));
    }
}