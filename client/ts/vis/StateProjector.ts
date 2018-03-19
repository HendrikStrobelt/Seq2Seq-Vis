import {VComponent} from "./VisualComponent";
import * as d3 from 'd3'
import * as _ from "lodash";
import {ZoomTransform} from "d3-zoom";
// import * as d3_lasso from 'd3-lasso'


// declare function require(name:string);
// let lasso = require('d3-lasso');

export type NeighborDetail = {
    indexID: number, distance: number, refTransID: number, refWordID: number
}

export type StateDesc = {
    id: number,
    occ: number[][] | null,
    pivot: { trans_ID: number, word_ID: number } | null,
    pos: number[]
}

export interface StateProjectorData {
    states: StateDesc[],
    loc: string,
    labels?: string[][]
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
        css_class_main: 'state_projector',
        keepAspectRatio: false
    };

    protected _current = {
        hidden: false,
        xScale: d3.scaleLinear(),
        yScale: d3.scaleLinear(),
        zoom: null,
        noOfLines: 1,
        pivots: <StateDesc[][]>[[]],
        loc: 'src',
        pivotNeighbors: <{ [key: number]: { [key: number]: StateDesc[] } }> {},
        project: {w: 500, h: 500},
        zoomTransform: d3.zoomIdentity,
        hasLabels: false
    };

    data:StateProjectorData;

    // readonly getter
    get current() {
        return this._current
    }

    get states(): StateDesc[] {
        return this.data.states;
    }

    get loc(): string {
        return this.current.loc;
    }

    get labels(): string[][] {
        return this.data.labels;

    }


    constructor(d3Parent, eventHandler?, options: {} = {}) {
        super(d3Parent, eventHandler);
        this.superInit(options, true)
    }

    protected _init() {
        const zoom = d3.zoom()
        // .filter(() => (<MouseEvent>d3.event).shiftKey)
            .scaleExtent([1 / 2, 4])
            .on("zoom", () => this._zoomLayers((<d3.D3ZoomEvent<any, any>>d3.event).transform));
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

    protected _zoomLayers(transform: ZoomTransform) {
        this._current.zoomTransform = transform;
        // console.log(transform, "--- transform");
        this.layers.fg.attr('transform', transform.toString());
        this.layers.main.attr('transform', transform.toString());

        const f = 1. / Math.sqrt(transform.k);

        const plR = 5 * f;
        this.layers.fg.selectAll('.plPoint').attr('r', plR);

        const w = 2 * f;
        this.layers.fg.selectAll('.pl')
            .style('stroke-width', w + 'px');


    }


    protected static neighborDetails(occ: number[][]): NeighborDetail[] {

        return occ.map(oc => {
            const [indexID, distance, refTransID, refWordID] = oc;
            return {indexID, distance, refTransID, refWordID}
        })


    }

    protected _wrangle(data: StateProjectorData) {
        const op = this.options;
        const cur = this._current;
        const nDetails = StateProjector.neighborDetails;


        /*======================================
        determine scales and positions
        =======================================*/
        const st = data.states;
        let [minX, maxX] = d3.extent(st.map(d => d.pos[0]));
        let [minY, maxY] = d3.extent(st.map(d => d.pos[1]));

        let diffX = maxX - minX;
        let diffY = maxY - minY;

        if (op.keepAspectRatio) {
            if (diffX > diffY) {
                // noinspection JSSuspiciousNameCombination
                diffY = diffX
            } else {
                // noinspection JSSuspiciousNameCombination
                diffX = diffY
            }
        }

        cur.xScale.domain([minX, minX + diffX]).range([10, cur.project.w-10]);
        cur.yScale.domain([minY, minY + diffY]).range([10, cur.project.h-10]);


        /*======================================
        determine neighbor information
        =======================================*/
        cur.loc = data.loc;

        cur.pivotNeighbors = {};

        // go through all non-pivot state and make them 'neighbors' to their reference
        // translation and word
        st.filter(d => !d.pivot).forEach(me =>
            nDetails(me.occ).forEach(occ => {
                const wordList = cur.pivotNeighbors[occ.refTransID] || {};
                const neighbors = wordList[occ.refWordID] || [];
                neighbors.push(me);
                wordList[occ.refWordID] = neighbors;
                cur.pivotNeighbors[occ.refTransID] = wordList;
            }));


        // create a list of all pivots (anchor for lines)
        cur.pivots = [];
        cur.noOfLines = st.filter(d => d.pivot && (d.pivot.word_ID == 0)).length;
        for (let pT = 0; pT < cur.noOfLines; pT++) {
            cur.pivots.push(st.filter(d => d.pivot && (d.pivot.trans_ID == pT))
                .sort((a, b) => a.pivot.word_ID - b.pivot.word_ID));
        }


        cur.hasLabels = data.labels != null;

        this.parent.attrs({
            'width': cur.project.w,
            'height': cur.project.h,
        });
        this.layers.bg.select('#zoomRect').attrs({
            'width': cur.project.w,
            'height': cur.project.h,
        });

        return data;

    }


    protected _render(renderData: StateProjectorData): void {
        // shortcuts:
        const states = renderData.states;
        const cur = this._current;
        const sX = cur.xScale;
        const sY = cur.yScale;
        const nDetails = StateProjector.neighborDetails;


        let pps = this.layers.main.selectAll('.pp').data(states);
        pps.exit().remove();

        let ppsEnter = pps.enter().append('g').attr('class', 'pp');
        ppsEnter.append('circle');

        pps = ppsEnter.merge(pps);
        pps.attr('transform',
            d => `translate(${sX(d.pos[0])},${sY(d.pos[1])})`);

        pps.select('circle').attr('r', d => d.occ.length);

        pps.on('mouseenter', d => {
            const allL = this.layers.main.selectAll('.hoverLine')
                .data(nDetails(d.occ)
                    .map(oc => cur.pivots[oc.refTransID][oc.refWordID]));

            allL.exit().remove();

            allL.enter().append('line').attr('class', 'hoverLine')
                .styles({
                    fill: 'none',
                    stroke: 'red',
                    'stroke-width': (2 / Math.sqrt(this._current.zoomTransform.k)),
                    'pointer-events': 'none'
                })
                .merge(allL)
                .attrs({
                    x1: sX(d.pos[0]),
                    y1: sY(d.pos[1]),
                    x2: o => sX(o.pos[0]),
                    y2: o => sY(o.pos[1])
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


        // this.layers.fg.selectAll('.label').data(renderData.states[0].)


        this.layers.fg.selectAll('.pl').remove();
        this.layers.fg.selectAll('.plPoint').remove();
        for (let pT = 0; pT < cur.noOfLines; pT++) {
            this.lineDraw(cur.pivots[pT], 'pl_' + pT,
                cur.hasLabels ? renderData.labels[pT] || [] : []);
        }

    }

    private lineDraw(onlyPivots: StateDesc[], className: string, labels: string[]) {
        const cur = this._current;

        console.log(onlyPivots, "--- onlyPivots", labels);

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
            .attr('d', line)
            .style('stroke-width', 2. / Math.sqrt(cur.zoomTransform.k) + 'px');

        let plPoints = this.layers.fg.selectAll('.plPoint.' + className).data(onlyPivots);
        plPoints.exit().remove();
        plPoints = plPoints.enter().append('circle').attr('class', 'plPoint ' + className)
            .merge(plPoints);

        plPoints.attrs({
            cx: d => cur.xScale(d.pos[0]),
            cy: d => cur.yScale(d.pos[1]),
            r: 5 / Math.sqrt(cur.zoomTransform.k)
        });
        plPoints.classed('startPoint', d => d.pivot.word_ID === 0);
        plPoints.classed('endPoint', d => d.pivot.word_ID === onlyPivots.length - 1);


        const plLabel = this.layers.fg.selectAll(".plLabel." + className)
            .data(labels);

        plLabel.exit().remove();

        const plLabelEnter = plLabel.enter()
            .append('text')
            .attr('class', 'plLabel '+className);

        plLabelEnter.merge(plLabel).attrs({
            x: (d, i) => cur.xScale(onlyPivots[i].pos[0]),
            y: (d, i) => cur.yScale(onlyPivots[i].pos[1]),
        }).text(d => d);


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

    myNeighbors = (trans_ID, word_ID) => {
        const trans = this._current.pivotNeighbors[trans_ID];
        if (trans) {
            return trans[word_ID] || [];
        } else {
            return []
        }
    }


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

    actionHoverRegion(regions: { x: number, y: number, w: number, h: number }[], hovered: boolean, pixelCoord = true) {

        let hRect = this.layers.fg.selectAll('.highlightRect')
            .data(hovered ? regions : []);
        hRect.exit().remove();

        hRect = hRect.enter().append('rect').attr('class', 'highlightRect')
            .merge(hRect);

        hRect.attrs({
            x: d => d.x,
            y: d => d.y,
            width: d => d.w,
            height: d => d.h,
        })


    }


}