import { Cell } from "sodiumjs";
import * as FL from "fantasy-land";

export function SodiumFantasyland() {
    console.log(FL.map);
    Cell.prototype[FL.map] = Cell.prototype.map;
}
