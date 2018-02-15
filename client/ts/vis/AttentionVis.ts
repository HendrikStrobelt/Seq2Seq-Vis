import {VComponent} from "./VisualComponent";
import * as d3 from "d3";
import * as _ from "lodash";
import {SimpleEventHandler} from "../etc/SimpleEventHandler";
import {D3Sel} from "../etc/LocalTypes";
import {Translation} from "../api/S2SApi";


type Edge = {
    classes: string,
    inPos: number,
    outPos: number,
    width: number,
    edge: number[]
}

enum VertexType {Encoder = 0, Decoder = 1}

/**
 * Input to render()
 */
type AV_RenderType = { edges: Edge[], maxPos: number }

export interface AttentionVisData {
    inWidths: number[],
    outWidths: number[],
    inPos: number[],
    outPos: number[],
    edgeWeights: number[][],
}


export class AttentionVis extends VComponent<AttentionVisData> {

    static VERTEX_TYPE = VertexType;

    static events = {};


    options = {
        pos: {x: 0, y: 0},
        max_bundle_width: 15,
        height: 50,
        css_class_main: 'attn_graph',
        css_edge: 'attn_edge',
        x_offset: 3
    };

    constructor(d3Parent: D3Sel, eventHandler?: SimpleEventHandler, options: {} = {}) {
        super(d3Parent, eventHandler);
        this.superInit(options, false);
    }

    _init() {
    }

    private _createGraph(attnWeights: number[][], maxBundleWidth: number,
                         inWidths: number[], outWidths: number[],
                         inPos: number[], outPos: number[]): AV_RenderType {

        const attnPerInWord = _.unzip(attnWeights);
        const attnPerInWordSum = attnPerInWord.map(a => _.sum(a));
        const maxAttnPerAllWords = Math.max(1, _.max(attnPerInWordSum));
        const lineWidthScale = d3.scaleLinear()
            .domain([0, maxAttnPerAllWords]).range([0, maxBundleWidth]);

        let maxPos = 0;

        const inPositionGraph = inWidths.map((inWord, inIndex) => {
            let inc = inPos[inIndex] + (inWord - lineWidthScale(attnPerInWordSum[inIndex])) * .5;
            return outWidths.map((_, outIndex) => {
                const lw = lineWidthScale(attnPerInWord[inIndex][outIndex]);
                const res = inc + lw * .5;
                inc += lineWidthScale(attnPerInWord[inIndex][outIndex]);
                maxPos = inc > maxPos ? inc : maxPos;
                return {
                    inPos: res,
                    width: lw,
                    edge: [inIndex, outIndex],
                    classes: `in${inIndex} out${outIndex}`,
                    outPos: null
                }
            });
        });

        outWidths.forEach((outWord, outIndex) => {
            let inc = outPos[outIndex] + (outWord - lineWidthScale(1)) * .5;
            inWidths.forEach((_, inIndex) => {
                const line = inPositionGraph[inIndex][outIndex];
                line['outPos'] = inc + line.width * .5;
                inc += line.width;
                maxPos = inc > maxPos ? inc : maxPos;
            })
        });

        return {edges: _.flatten(inPositionGraph), maxPos};

    }

    protected _wrangle(data: AttentionVisData) {

        const {edges, maxPos} = this._createGraph(
            data.edgeWeights,
            this.options.max_bundle_width,
            data.inWidths,
            data.outWidths,
            data.inPos,
            data.outPos
        );


        // const {edges, maxPos} = this._createGraph(data.attnFiltered[data._current.topN],
        //     this.options.max_bundle_width,
        //     data._current.inWords, data._current.outWords,
        //     data._current.inWordPos, data._current.outWordPos);

        this.parent.attrs({
            width: maxPos + 5 + this.options.x_offset, //reserve
            height: this.options.height
        });

        return {edges, maxPos}

    }

    protected _render(renderData: AV_RenderType) {

        // console.log(renderData, "--- renderData");

        const op = this.options;

        const graph = this.base.selectAll(`.${op.css_class_main}`)
            .data(renderData.edges);
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

    actionHighlightEdges(index: number, type: VertexType, highlight: boolean) {

        if (highlight) {
            this.base.selectAll(`.${this.options.css_class_main}`)
                .classed('highlight', d => {
                    return (<Edge>d).edge[type] === index;
                })
        } else {
            this.base.selectAll(`.${this.options.css_class_main}`)
                .classed('highlight', false)

        }

    }


}