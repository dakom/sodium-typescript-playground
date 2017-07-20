import * as R from "ramda";
import { Cell } from "sodiumjs";

//accumulates object[measureProp] and spaces them by padding
//used in this app for layout - both across the horizontal and vertical axis (see menu or drum machine)
export function spreadPosition(padding:number, measureProp:string, objects:any):Array<number> {
    const measures = R.pluck(measureProp, objects);

    return R.scan(R.add,0,measures)
            .map((val, idx) => val + (idx * padding));
}


//sequence() for sodium cells
export function CellSequence<A>(cells: Array<Cell<A>>): Cell<Array<A>> {
    return cells.reduce((out, cell) => 
            out = out.lift(cell, (list, a) => list.concat([a])), 
            new Cell(new Array<A>()));
}