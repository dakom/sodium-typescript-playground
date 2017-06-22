import { Ticker } from "../../../lib/time/Ticker";
import { Transaction, CellLoop } from "sodiumjs";
import { BaseContainer } from "../BaseContainer";

export class Switch extends BaseContainer {
    private ticker:Ticker;

    constructor() {
        super();

        this.ticker = new Ticker();
        
    }

    dispose() {
        this.ticker.dispose();
    }
}