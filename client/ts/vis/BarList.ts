import {VComponent} from "./VisualComponent";
import * as d3 from "d3";

type BL_RenderType = { barValues: number[] }

export interface BarListData{
    extent: [number, number],
    values: number[]
}


export class BarList extends VComponent<BarListData> {


    static events = {};

    options = {
        pos: {x: 0, y: 0},
        width: 90,
        bar_height: 20,
        css_class_main: 'bar_list_vis',
        css_bar: 'bar',
        xScale: d3.scaleLinear()
    };


    constructor(d3Parent, eventHandler, options: {} = {}) {
        super(d3Parent, eventHandler);
        this.superInit(options, false)
    }

    _init() {
    }

    _wrangle(data: BarListData): BL_RenderType {
        const op = this.options;

        // if (op.data_access_all) {
            // const ex = <number[]>d3.extent(op.data_access_all(data));
            //
            // if (ex[0] * ex[1] > 0) {
            //     if (ex[0] > 0) ex[0] = ex[1];
            //     ex[1] = 0;
            // }

            const ex = data.extent;
            op.xScale =
                d3.scaleLinear()
                    .domain(ex)
                    .range([op.width, 0])
        // }

        const barValues = data.values;

        this.parent.attrs({
            width: op.width,
            height: barValues.length * op.bar_height
        });

        return {barValues};
    }

    _render(rData: BL_RenderType) {

        const op = this.options;

        const bars = this.base.selectAll(`.${op.css_bar}`).data(rData.barValues);
        bars.exit().remove();

        const barsEnter = bars.enter().append('rect').attr('class', op.css_bar);


        barsEnter.merge(bars).attrs({
            x: d => op.width - op.xScale(d),
            y: (_, i) => i * op.bar_height,
            height: op.bar_height - 2,
            width: d => op.xScale(d)
        })

    }


    get xScale() {
        return this.options.xScale;
    }

}