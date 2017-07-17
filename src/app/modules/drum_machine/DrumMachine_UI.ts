
export class Row_UI extends PIXI.Container {
    constructor(onColor: number, offColor: number) {
        super();

        for(let i = 0, offset = 0; i < 16; i++) {
            let block = new Block_UI(onColor, offColor);
            block.x = offset;
            
            this.addChild(block);
            offset += block.width + 10;
        }
    }
}

export class Block_UI extends PIXI.Graphics {
    constructor(private onColor: number, private offColor: number) {
        super();

        this.beginFill(0xFFFFFF, 1.0);
        this.drawRoundedRect(0, 0, 50, 50, 10);
        this.endFill();
    }
    redraw(selected: boolean) {
        this.tint = selected ? this.onColor : this.offColor;
    }
}