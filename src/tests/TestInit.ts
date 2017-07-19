
import {SodiumTests} from "./sodium/SodiumTests";
import { expect } from 'chai';

class TesterInit {
    
    constructor() {
       describe('init', () => {
            it('should pass', () => {
                expect(1+1).to.equal(2);
            });
       });

       new SodiumTests();
    }
}

new TesterInit();



