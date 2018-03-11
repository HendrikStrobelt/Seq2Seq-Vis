import {VComponent} from "./VisualComponent";
import * as d3 from 'd3'
import * as _ from "lodash";
// import * as d3_lasso from 'd3-lasso'


// declare function require(name:string);
// let lasso = require('d3-lasso');

export type StateDesc = {
    id: number,
    occ: number[][] | null,
    pivot: { trans_ID: number, word_ID: number } | null,
    pos: number[]
}

export interface StateProjectorData {
    states: StateDesc[],
    loc: string
}

export type StateProjectorClickEvent = {
    loc: string,
    pointIDs: number[],
    neighborIDs: number[],
    caller: StateProjector
}
export type StateProjectorHoverEvent = {
    loc: string,
    transID: number,
    wordID: number,
    caller: StateProjector,
    hovered: boolean
}


export class StateProjector extends VComponent<StateProjectorData> {


    static events = {
        clicked: 'state_projector_clicked',
        hovered: 'state_projector_hovered'
    };

    protected options = {
        pos: {x: 0, y: 0},
        css_class_main: 'state_projector'
    };

    _current = {
        hidden: false,
        xScale: d3.scaleLinear(),
        yScale: d3.scaleLinear(),
        zoom: null,
        noOfLines: 1,
        pivots: <StateDesc[][]>[[]],
        loc: 'src',
        pivotNeighbors: <{ [key: number]: { [key: number]: StateDesc[] } }> {}
    };

    constructor(d3Parent, eventHandler?, options: {} = {}) {
        super(d3Parent, eventHandler);
        this.superInit(options, true)
    }

    protected _init() {
        const zoom = d3.zoom()
            .filter(() => (!(<MouseEvent>d3.event).button)
                && (<MouseEvent>d3.event).shiftKey)
            .scaleExtent([1 / 2, 4])
            .on("zoom", () => this._zoomLayers(d3.event.transform));
        this._current.zoom = zoom;
        this.layers.bg.append("rect")
            .attr('id', 'zoomRect')
            .attr("width", 100)
            .attr("height", 100)
            .style("fill", "none")
            .style("pointer-events", "all")
            .call(zoom)
            .on("dblclick.zoom", () =>
                this.base.select('#zoomRect')
                    .transition().duration(200)
                    .call(<any>zoom.transform, d3.zoomIdentity));


    }

    protected _zoomLayers(transform) {
        // console.log(transform, "--- transform");
        this.layers.fg.attr('transform', transform);
        this.layers.main.attr('transform', transform);
    }


    protected _wrangle(data: StateProjectorData) {

        const st = data.states;
        let [minX, maxX] = d3.extent(st.map(d => d.pos[0]));
        let [minY, maxY] = d3.extent(st.map(d => d.pos[1]));

        let diffX = maxX - minX;
        let diffY = maxY - minY;


        // if (diffX > diffY) {
        //     diffY = diffX
        // } else {
        //     diffX = diffY
        // }

        const cur = this._current;
        cur.xScale.domain([minX, minX + diffX]).range([5, 495]);
        cur.yScale.domain([minY, minY + diffY]).range([5, 495]);

        cur.loc = data.loc === 'encoder' ? 'src' : 'tgt';

        cur.pivotNeighbors = {};

        st.filter(d => !d.pivot).forEach(stt => stt.occ.forEach(occ => {
            const nn = cur.pivotNeighbors[occ[2]] || {};
            const nnn = nn[occ[3]] || [];
            nnn.push(stt);
            nn[occ[3]] = nnn;
            cur.pivotNeighbors[occ[2]] = nn;
        }));


        cur.pivots = [];
        cur.noOfLines = st.filter(d => d.pivot && (d.pivot.word_ID == 0)).length;
        for (let pT = 0; pT < cur.noOfLines; pT++) {
            cur.pivots.push(st.filter(d => d.pivot && (d.pivot.trans_ID == pT))
                .sort((a, b) => a.pivot.word_ID - b.pivot.word_ID));
        }


        this.parent.attrs({
            'width': 500,
            'height': 500
        });
        this.layers.bg.select('#zoomRect').attrs({
            'width': 500,
            'height': 500
        });

        return data;

    }


    protected _render(renderData: StateProjectorData): void {
        const states = renderData.states;
        const cur = this._current;

        let pps = this.layers.main.selectAll('.pp').data(states);
        pps.exit().remove();

        let ppsEnter = pps.enter().append('g').attr('class', 'pp');
        ppsEnter.append('circle');

        pps = ppsEnter.merge(pps);
        pps
        // .transition()
            .attr('transform',
                d => `translate(${cur.xScale(d.pos[0])},${cur.yScale(d.pos[1])})`);

        pps.select('circle').attr('r', d => Math.sqrt(d.occ.length * 1.));

        pps.on('mouseenter', d => {
            const allL = this.layers.main.selectAll('.hoverLine')
                .data(d.occ.map(oc => cur.pivots[oc[2]][oc[3]]));
            allL.exit().remove();

            allL.enter().append('line').attr('class', 'hoverLine')
                .styles({
                    fill: 'none',
                    stroke: 'red',
                    'stroke-width': 2,
                    'pointer-events': 'none'
                })
                .merge(allL)
                .attrs({
                    x1: cur.xScale(d.pos[0]),
                    y1: cur.yScale(d.pos[1]),
                    x2: o => cur.xScale(o.pos[0]),
                    y2: o => cur.yScale(o.pos[1])
                })
        });
        pps.on('mouseleave', () => {
            this.layers.main.selectAll('.hoverLine').remove()
        });

        pps.on('click',
            d => {

                const eventDetails: StateProjectorClickEvent = {
                    loc: cur.loc,
                    pointIDs: [d.id],
                    caller: this,
                    neighborIDs: [d.id]
                };
                this.eventHandler
                    .trigger(StateProjector.events.clicked, eventDetails)
            });


        this.layers.fg.selectAll('.pl').remove();
        this.layers.fg.selectAll('.plPoint').remove();
        for (let pT = 0; pT < cur.noOfLines; pT++) {
            this.lineDraw(cur.pivots[pT], 'pl_' + pT);
        }

    }

    private lineDraw(onlyPivots: StateDesc[], className: string) {
        const cur = this._current;

        console.log(onlyPivots, "--- onlyPivots");

        const line = d3.line<StateDesc>()
            .x(d => cur.xScale(d.pos[0]))
            .y(d => cur.yScale(d.pos[1]));
        // .curve(d3.curveCardinal)

        let pls = this.layers.fg.selectAll('.pl.' + className)
            .data([onlyPivots]);
        pls = pls.enter().append('path').attr('class', 'pl ' + className)
            .merge(pls);
        pls
        // .transition()
            .attr('d', line);

        let plPoints = this.layers.fg.selectAll('.plPoint.' + className).data(onlyPivots);
        plPoints.exit().remove();
        plPoints = plPoints.enter().append('circle').attr('class', 'plPoint ' + className)
            .merge(plPoints);

        plPoints.attrs({
            cx: d => cur.xScale(d.pos[0]),
            cy: d => cur.yScale(d.pos[1]),
            r: 5
        });
        plPoints.classed('startPoint', d => d.pivot.word_ID === 0);
        plPoints.classed('endPoint', d => d.pivot.word_ID === onlyPivots.length - 1);


        plPoints.on('mouseenter', d => {
            const detail: StateProjectorHoverEvent = {
                hovered: true,
                transID: d.pivot.trans_ID,
                wordID: d.pivot.word_ID,
                loc: cur.loc,
                caller: this
            };
            this.eventHandler.trigger(StateProjector.events.hovered, detail);
        });

        plPoints.on('mouseleave', d => {

            const detail: StateProjectorHoverEvent = {
                hovered: false,
                transID: d.pivot.trans_ID,
                wordID: d.pivot.word_ID,
                loc: cur.loc,
                caller: this
            };
            this.eventHandler.trigger(StateProjector.events.hovered, detail);
        });


        plPoints.on('click',
            d => {

                const neighborIDs = this.myNeighbors(d.pivot.trans_ID, d.pivot.word_ID)
                    .map(nn => nn.id);

                const evDetails: StateProjectorClickEvent = {
                    loc: cur.loc,
                    pointIDs: [d.id],
                    neighborIDs,
                    caller: this
                };

                this.eventHandler
                    .trigger(StateProjector.events.clicked, evDetails)
            });


    }

    private myNeighbors = (trans_ID, word_ID) =>
        this._current.pivotNeighbors[trans_ID][word_ID];


    actionSelectPoints(point_IDs: number[]) {

        this.layers.main.selectAll('.pp')
            .classed('selected',
                (d: StateDesc) => _.includes(point_IDs, d.id));
        this.layers.fg.selectAll('.plPoint')
            .classed('selected',
                (d: StateDesc) => _.includes(point_IDs, d.id));

    }


    actionHoverPivot(trans_ID: number, word_ID: number, hovered = true) {

        if (hovered) {
            const cur = this._current;
            const myself = cur.pivots[trans_ID][word_ID];
            const myNeighbors = this.myNeighbors(trans_ID, word_ID);

            const allL = this.layers.main.selectAll('.hoverLine')
                .data(myNeighbors);
            allL.exit().remove();

            allL.enter().append('line').attr('class', 'hoverLine')
                .merge(allL)
                .style('opacity', 1. / (Math.sqrt(myNeighbors.length)))
                .attrs({
                    x1: cur.xScale(myself.pos[0]),
                    y1: cur.yScale(myself.pos[1]),
                    x2: o => cur.xScale(o.pos[0]),
                    y2: o => cur.yScale(o.pos[1])
                })
        } else {
            this.layers.main.selectAll('.hoverLine').remove();
        }

    }


}