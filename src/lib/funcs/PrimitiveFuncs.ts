import * as R from "ramda";
import { Cell } from "sodiumjs";

//takes a padding and a list of numbers
//adds the padding into them sequentially increasing to give it space
export function addPadding(pad: number, vals: Array<number>): Array<number> {

    let mapIndexed = R.addIndex(R.map);
    return mapIndexed((val, idx) => val + (idx * pad), vals);
}

//accumulates the total of property prop in all the vals - with a leading zero
export function accPropsLeadingZero(prop: string, vals: Array<any>): Array<number> {
    return R.scan(R.add, 0, R.pluck(prop, vals));
}

//sequence() for sodium cells
export function CellSequence<A>(cells: Array<Cell<A>>): Cell<Array<A>> {
    return cells.reduce((out, cell) => 
            out = out.lift(cell, (list, a) => list.concat([a])), 
            new Cell(new Array<A>()));
}