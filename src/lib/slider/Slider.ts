class Knob {

}

export interface SliderOptions {
    knobWidth:number;
    knobColor:number;
    bgColor:number;
}

export class Slider extends PIXI.Container {

        private xMin:number = 0;
        private xMax:number;
        
        constructor(width:number, height:number, opts:SliderOptions)  {
            super();

            this.xMax = width - opts.knobWidth;

            const bg = new PIXI.Graphics();
            bg.beginFill(opts.bgColor);
            bg.drawRect(0, 0, width, height);
            bg.endFill();
            this.addChild(bg);

            const knobGraphic = new PIXI.Graphics();
            knobGraphic.beginFill(opts.knobColor);
            knobGraphic.drawRect(0, 0, opts.knobWidth, height);
            knobGraphic.endFill();
        }
        

        /*

        

        _self.knob = new TJ.Interactions.Draggable(null, {
            onDragMove: function(obj, info) {
              if(opts.onUpdate !== undefined) {
                opts.onUpdate(_self.getPerc());
              }
            },
            lockY: true,
            xMin: 0,
            xMax: width - opts.knobWidth,
        });

        _self.knob.addChild(knobGraphic);
        _self.addChild(_self.knob);
        */
    
        /*
    public get perc():number {
      return(this.knob.x / this.xMax);
    }
    public set perc(val:number) {
      return(this.knob.x = val * this.xMax);
    }
    */
}