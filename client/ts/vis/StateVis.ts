import {VComponent} from "./VisualComponent";
import * as d3 from "d3";
import * as _ from "lodash";
import {SimpleEventHandler} from "../etc/SimpleEventHandler";
import {D3Sel} from "../etc/LocalTypes";

export class StateVis extends VComponent {

    static events = {};

    readonly defaultOptions = {
        cell_width: 100,
        height: 50,
        css_class_main: 'state_vis',
        css_line: 'state_line',
        x_offset: 3,
        hidden: true,
        data_access: d => d.encoder.map(e => e.state)
    };

    readonly layout = [
        {name: 'axis', pos: [0, 0]},
        {name: 'main', pos: [0, 0]},
    ];

    constructor(d3Parent:D3Sel, eventHandler: SimpleEventHandler, options = {}) {
        super(d3Parent, eventHandler);
        this.superInit(options)
    }

    _init() {
        if (this.options.hidden) this.hideView();
    }

    _wrangle(data) {

        const op = this.options;

        const orig_states = op.data_access(data);
        const states = d3.transpose(orig_states);
        const yDomain = d3.extent(<number[]> _.flattenDeep(<any[][]> states));

        this.parent.attrs({
            width: (orig_states.length * op.cell_width + (op.x_offset + 5 + 20)),
            height: op.height
        });

        console.log(states, op.data_access(data), "--- states,op.data_access(data)");

        return {states, yDomain}
    }

    _render(renderData) {


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