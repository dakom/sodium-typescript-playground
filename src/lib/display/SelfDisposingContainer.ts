export abstract class SelfDisposingContainer extends PIXI.Container {
    constructor() {
        super();
        this.once('removed', () => this.dispose());
    }

    abstract dispose():void;
}