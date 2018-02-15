import {VComponent} from "./VisualComponent";
import * as d3 from "d3";
import * as _ from "lodash";
import {SimpleEventHandler} from "../etc/SimpleEventHandler";
import {D3Sel} from "../etc/LocalTypes";
import {SVG} from "../etc/SVGplus";

type StateVisRender = { states: number[][], yDomain: number[] }

export interface StateVisData {
    states: number[][]
}


export class StateVis extends VComponent<StateVisData> {

    layers: { main: D3Sel, axis: D3Sel };

    static events = {};

    options = {
        pos: {x: 0, y: 0},
        cell_width: 100,
        height: 50,
        css_class_main: 'state_vis',
        css_line: 'state_line',
        x_offset: 3,
        hidden: true,
        // data_access: d => d.encoder.map(e => e.state)
    };

    constructor(d3Parent: D3Sel, eventHandler: SimpleEventHandler, options = {}) {
        super(d3Parent, eventHandler);
        this.superInit(options, false)
    }

    _init() {
        if (this.options.hidden) this.hideView();
        this.layers.main = SVG.group(this.base, 'main');
        this.layers.axis = SVG.group(this.base, 'axis');
    }

    _wrangle(data: StateVisData): StateVisRender {

        const op = this.options;

        const orig_states = data.states;
        const states = <number[][]> d3.transpose(orig_states);
        const yDomain = d3.extent(<number[]>_.flattenDeep(states));

        this.parent.attrs({
            width: (orig_states.length * op.cell_width + (op.x_offset + 5 + 20)),
            height: op.height
        });


        return {states, yDomain}
    }

    _render(renderData: StateVisRender) {


        const op = this.options;

        const x = (i) => op.x_offset + Math.round((i + .5) * op.cell_width);

        const y = d3.scalePow().exponent(.5).domain(renderData.yDomain).range([op.height, 0]);

        const line = d3.line<number>()
            .x((_, i) => x(i))
            .y(d => y(d));


        const stateLine = this.layers.main.selectAll(`.${op.css_line}`).data(renderData.states);
        stateLine.exit().remove();

        const stateLineEnter = stateLine.enter().append('path').attr('class', op.css_line);

        stateLineEnter.merge(stateLine).attrs({
            'd': line
        });


        if (renderData.states.length > 0) {
            const yAxis = d3.axisLeft(y).ticks(7);
            this.layers.axis.classed("axis state_axis", true)
                .call(yAxis).selectAll('*');
            this.layers.axis.attrs({
                // transform: `translate(${x(renderData.states[0].length - 1) + 3},0)`
                transform: `translate(${op.x_offset + op.cell_width * .5 - 3},0)`
            })
        } else {
            this.layers.axis.selectAll("*").remove();
        }


    }

}