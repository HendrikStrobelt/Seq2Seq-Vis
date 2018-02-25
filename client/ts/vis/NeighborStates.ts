import {VComponent} from "./VisualComponent";
import * as _ from "lodash";
import * as d3 from "d3";


export interface NeighborStatesData {
    row: number[][][]
}

export class NeighborStates extends VComponent<NeighborStatesData> {

    // options to configure vis
    protected options = {
        pos: {x: 0, y: 0},
        box_height: 21,
        box_width: 100,
        css_class_main: 'neighbor'
    };

    _current = {
        hidden: false,
        maxDistance: 0,
        xScale: d3.scaleLinear()
    };


    constructor(d3Parent, eventHandler?, options:{} = {}) {
        super(d3Parent, eventHandler);
        this.superInit(options, false)
    }


    protected _init() {
    }

    protected _render(renderData: NeighborStatesData): void {
        const op = this.options;
        const cur = this._current;

        cur.xScale.range([5, op.box_width - 10]);

        const indexToPos = index => index * op.box_width;

        let row = this.base.selectAll('.neighborState').data(renderData.row);
        row.exit().remove();
        const rowEnter = row.enter().append('g').attr('class', 'neighborState')
        rowEnter.append('rect');
        row = rowEnter.merge(row)
            .attr('transform',
                (d, i) => `translate(${indexToPos(i)},0)`);

        // bg rect:
        row.select('rect').attrs({
            width: op.box_width-5,
            height: op.box_height
        });


        let lines = row.selectAll('.line').data(d => d);
        lines.exit().remove();

        lines = lines.enter().append('line').attr('class', 'line')
            .merge(lines)
            .attrs({
                x1: d => cur.xScale(d[1]),
                x2: d => cur.xScale(d[1]),
                y1: 2,
                y2: op.box_height - 4
            })


    }

    protected _wrangle(data: NeighborStatesData) {
        const cur = this._current;
        cur.maxDistance = 1.5;// <number>_.max(_.flatten(data.row).map(d => d[1]))
        cur.xScale = d3.scaleLinear().domain([0, cur.maxDistance])


        this.parent.attrs({
            width: data.row.length * this.options.box_width + 6,
            height: this.options.box_height
        });

        return data;
    }

}