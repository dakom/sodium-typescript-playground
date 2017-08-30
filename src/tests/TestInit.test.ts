
//import {SodiumTests} from "./sodium/SodiumTests";
//import {TempTest} from "./temp/TempTest";

import { expect } from 'chai';

export class TesterInit {
    'init'() {
        
        expect(1+1).to.equal(3);
        
    }
}

new TesterInit();



