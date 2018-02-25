import {VComponent} from "./VisualComponent";
import * as d3 from 'd3'
import {ZoomTransform} from "d3-zoom";

type StateDesc = { id: number, occ: number[][], pivot: number, pos: number[] }

export interface StateProjectorData {
    states: StateDesc[]
}

export class StateProjector extends VComponent<StateProjectorData> {
    protected options = {
        pos: {x: 0, y: 0},
        css_class_main: 'state_projector'
    };

    _current = {
        hidden: false,
        xScale: d3.scaleLinear(),
        yScale: d3.scaleLinear(),
        zoom: null,
        noOfLines: 1
    };

    constructor(d3Parent, eventHandler?, options: {} = {}) {
        super(d3Parent, eventHandler);
        this.superInit(options, true)
    }

    protected _init() {
        const zoom = d3.zoom()
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

        this._current.xScale.domain([minX, minX + diffX]).range([5, 495]);
        this._current.yScale.domain([minY, minY + diffY]).range([5, 495]);

        this._current.noOfLines = st.filter(d => d.pivot == 0).length;

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

        let pps = this.layers.main.selectAll('.pp').data(states)
        pps.exit().remove();

        let ppsEnter = pps.enter().append('g').attr('class', 'pp');
        ppsEnter.append('circle');

        pps = ppsEnter.merge(pps)
        pps
        // .transition()
            .attr('transform',
                d => `translate(${cur.xScale(d.pos[0])},${cur.yScale(d.pos[1])})`);

        pps.select('circle').attr('r', d => d.occ.length);

        this.layers.fg.selectAll('.pl').remove();
        this.layers.fg.selectAll('.plPoint').remove();
        for (let pT = 0; pT < cur.noOfLines; pT++) {
            const onlyPivots = states.filter(d => (d.pivot > -1) && (d.occ[0][2] == pT))
                .sort((a, b) => a.pivot - b.pivot);
            this.lineDraw(onlyPivots, 'pl_'+pT);
        }

    }

    private lineDraw(onlyPivots: StateDesc[], className:string) {
        const cur = this._current;

        const line = d3.line<StateDesc>()
            .x(d => cur.xScale(d.pos[0]))
            .y(d => cur.yScale(d.pos[1]))
        // .curve(d3.curveCardinal)

        let pls = this.layers.fg.selectAll('.pl.'+className)
            .data([onlyPivots]);
        pls = pls.enter().append('path').attr('class', 'pl '+className)
            .merge(pls);
        pls
        // .transition()
            .attr('d', line);

        let plPoints = this.layers.fg.selectAll('.plPoint.'+className).data(onlyPivots);
        plPoints.exit().remove();
        plPoints = plPoints.enter().append('circle').attr('class', 'plPoint '+className)
            .merge(plPoints);

        plPoints.attrs({
            cx: d => cur.xScale(d.pos[0]),
            cy: d => cur.yScale(d.pos[1]),
            r: 3
        })
        plPoints.classed('startPoint', d => d.pivot === 0);
        plPoints.classed('endPoint', d => d.pivot === onlyPivots.length - 1);
    }
}