
import {SodiumTests} from "./sodium/SodiumTests";
import {TempTest} from "./temp/TempTest";

import { expect } from 'chai';

class TesterInit {
    
    constructor() {
       describe('init', () => {
            it('should pass', () => {
                expect(1+1).to.equal(2);
            });
       });

       new TempTest();
       new SodiumTests();
    }
}

new TesterInit();



