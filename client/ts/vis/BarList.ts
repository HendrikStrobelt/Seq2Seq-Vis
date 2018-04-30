import {VComponent} from "./VisualComponent";
import * as d3 from "d3";

export interface BarListData {
    extent: [number, number],
    values: number[]
}


export class BarList extends VComponent<BarListData> {

    css_name = 'barlist';

    static events = {};

    options = {
        pos: {x: 0, y: 0},
        width: 90,
        bar_height: 20,
        css_class_main: 'bar_list_vis',
        css_bar: 'bar'
    };

    _current= {
        hidden: false,
        xScale:d3.scaleLinear()
    }


    constructor(d3Parent, eventHandler, options:{} = {}) {
        super(d3Parent, eventHandler);
        this.superInit(options, false)
    }

    _init() {
    }

    _wrangle(data: BarListData): BarListData {
        const cur = this._current;
        const op = this.options;


        const ex = data.extent;
        cur.xScale =
            d3.scaleLinear()
                .domain(ex)
                .range([op.width, 0]);

        const barValues = data.values;

        this.parent.attrs({
            width: op.width,
            height: barValues.length * op.bar_height
        });

        return data;
    }

    _render(rData: BarListData) {

        const op = this.options;
        const cur = this._current;

        const bars = this.base.selectAll(`.${op.css_bar}`).data(rData.values);
        bars.exit().remove();

        const barsEnter = bars.enter().append('rect').attr('class', op.css_bar);


        barsEnter.merge(bars).attrs({
            x: d => op.width - cur.xScale(d),
            y: (_, i) => i * op.bar_height,
            height: op.bar_height - 2,
            width: d => cur.xScale(d)
        })

    }


    get xScale() {
        return this._current.xScale;
    }

}
