export class Brush {
    private pool: Array<PIXI.Sprite>;
    private _color:number;

    constructor(private texture:PIXI.Texture) {
        this.pool = new Array<PIXI.Sprite>();
        this.changeColor();
        this.getSprites(100); //pre-warm
    }

    public changeColor() {
        this._color = Math.random() * 0xCCCCCCCC;
        this.pool.forEach(spr => {
            spr.tint = this._color;
        });
    }

    public returnToPool(sprites: Array<PIXI.Sprite>) {
        this.pool = this.pool.concat(sprites);
    }

    public getSprites(len: number): Array<PIXI.Sprite> {
        //need to grow the pool first...
        if (this.pool.length < len) {
            let amount: number = len - this.pool.length;
            for (let i = 0; i < amount; i++) {           
                let sprite: PIXI.Sprite = new PIXI.Sprite(this.texture);
                sprite.anchor.set(.5, .5);
                sprite.tint = this._color;
                this.pool.push(sprite);
            }
        }
        return this.pool.splice(0, len);
    }
}

