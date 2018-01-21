import {D3Sel, VComponent} from "./VisualComponent";
import * as d3 from "d3";
import * as _ from "lodash";
import {SimpleEventHandler} from "../etc/SimpleEventHandler";

export class AttentionVis extends VComponent {

    static events = {};

    readonly defaultOptions = {
        max_bundle_width: 15,
        height: 50,
        css_class_main: 'attn_graph',
        css_edge: 'attn_edge',
        x_offset: 3
    };

    readonly layout = [];

    constructor(d3Parent: D3Sel, eventHandler?: SimpleEventHandler, options: {} = {}) {
        super(d3Parent, eventHandler);
        this.superInit(options);
    }

    _init() {
    }

    _createGraph(attnWeights: number[][], maxBundleWidth, inWords, outWords, inPos, outPos) {

        const attnPerInWord = _.unzip(attnWeights);
        const attnPerInWordSum = attnPerInWord.map(a => _.sum(a));
        const maxAttnPerAllWords = Math.max(1, _.max(attnPerInWordSum));
        const lineWidthScale = d3.scaleLinear()
            .domain([0, maxAttnPerAllWords]).range([0, maxBundleWidth]);

        let maxPos = 0;

        const inPositionGraph = inWords.map((inWord, inIndex) => {
            let inc = inPos[inIndex] + (inWord.width - lineWidthScale(attnPerInWordSum[inIndex])) * .5;
            return outWords.map((_, outIndex) => {
                const lw = lineWidthScale(attnPerInWord[inIndex][outIndex]);
                const res = inc + lw * .5;
                inc += lineWidthScale(attnPerInWord[inIndex][outIndex]);
                maxPos = inc > maxPos ? inc : maxPos;
                return {inPos: res, width: lw, edge: [inIndex, outIndex], classes: `in${inIndex} out${outIndex}`}
            });
        });

        outWords.forEach((outWord, outIndex) => {
            let inc = outPos[outIndex] + (outWord.width - lineWidthScale(1)) * .5;
            inWords.forEach((_, inIndex) => {
                const line = inPositionGraph[inIndex][outIndex];
                line['outPos'] = inc + line.width * .5;
                inc += line.width;
                maxPos = inc > maxPos ? inc : maxPos;
            })
        });

        return {edges: _.flatten(inPositionGraph), maxPos};

    }


    _wrangle(data) {

        const {edges, maxPos} = this._createGraph(data.attnFiltered[data._current.topN],
            this.options.max_bundle_width,
            data._current.inWords, data._current.outWords,
            data._current.inWordPos, data._current.outWordPos);

        this.parent.attrs({
            width: maxPos + 5 + this.options.x_offset, //reserve
            height: this.options.height
        });

        return {edges, maxPos}

    }

    _render(renderData) {

        const op = this.options;

        const graph = this.base.selectAll(`.${op.css_class_main}`)
            .data(<{ inPos, outPos, width, edge, classes }[]> renderData.edges);
        graph.exit().remove();

        const linkGen = d3.linkVertical();

        const graphEnter = graph.enter().append('g').attr('class', op.css_class_main);
        graphEnter.append('path');
        graphEnter.merge(graph).select('path').attrs({
            'd': d => {
                return linkGen({
                    source: [d.inPos + op.x_offset, 0],
                    target: [d.outPos + op.x_offset, op.height]
                })
            },
            'class': d => `${this.options.css_edge} ${d.classes}`
        }).style('stroke-width', d => d.width);

    }

    _bindLocalEvents() {

    }


}