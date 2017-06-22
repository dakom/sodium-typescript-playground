export abstract class BaseContainer extends PIXI.Container {
    constructor() {
        super();
        this.once('removed', () => this.dispose());
    }

    abstract dispose():void;
}