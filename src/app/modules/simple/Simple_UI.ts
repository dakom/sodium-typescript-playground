export function UI_Ball(radius:number): PIXI.Graphics {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xFF0000);
    graphics.drawCircle(0, 0, radius);
    graphics.endFill();
    return graphics;
}