import {VComponent} from "./VisualComponent";
import {D3Sel} from "../etc/LocalTypes";
import {SimpleEventHandler} from "../etc/SimpleEventHandler";
import {StateProjector, StateProjectorData} from "./StateProjector";
import * as _ from "lodash";


export type PointSegment = {
    x: number, y: number, ox: number, oy: number,
    id: number, loc: string, transID: number, wordID: number,
    ow: number, oh: number
};

export type StatePictogramsHovered = {
    caller: StatePictograms,
    segment: PointSegment,
    hovered: boolean
}

export class StatePictograms extends VComponent<null> {

    static events = {
        segmentHovered: 'state_picto_hovered'
    };

    protected hiddenCanvas: D3Sel = null;

    protected options = {
        pos: {x: 0, y: 0},
        // canvas: {w: 500, h: 500},
        gridElements: 5
    };

    colors = {
        bg: '#fffdfa',
        pp: {c: 'black', a: 0.3},
        pl: {w: 2, a: .3, c: ['#5F9EA0', '#9e9e5f']},
        select: {w: 2, c: '#9c605f'}
    }

    constructor(d3Parent: D3Sel, protected projector: StateProjector, eventHandler?: SimpleEventHandler, options: {} = {}) {
        super(d3Parent, eventHandler);

        this.superInit(options, false, true, false);
    }


    protected _init() {
        const pOp = this.projector.current;

        this.hiddenCanvas = this.parent.append('canvas').attrs({
            width: pOp.project.w,
            height: pOp.project.h,
        })
            .style('display', 'none')


    }

    protected _render(renderData): void {
        const pOp = this.projector.current;
        const states = this.projector.states;
        const col = this.colors;

        const vContext = <CanvasRenderingContext2D>this.hiddenCanvas.node().getContext('2d');

        vContext.fillStyle = col.bg;
        vContext.fillRect(0, 0, pOp.project.w, pOp.project.h);

        vContext.globalAlpha = col.pp.a;
        vContext.fillStyle = col.pp.c;
        for (const st of states) {
            vContext.beginPath();
            vContext.arc(pOp.xScale(st.pos[0]), pOp.yScale(st.pos[1]),
                Math.sqrt(st.occ.length), 0, 2 * Math.PI)
            vContext.fill();
        }


        const gridScale = this.options.gridElements / pOp.project.w;

        const panelWidth = pOp.project.w / this.options.gridElements;
        const panelWidthCeil = Math.ceil(panelWidth);


        const lineSeqs: PointSegment[][] = [];
        const pivots = this.projector.current.pivots;
        for (const transID of _.range(pivots.length)) {
            const line = pivots[transID];

            const lineSeq: PointSegment[] = [];

            if (line.length > 0) {
                vContext.globalAlpha = col.pl.a;
                vContext.strokeStyle = col.pl.c[transID];
                vContext.lineWidth = col.pl.w;
                vContext.beginPath();
                for (const pID of _.range(line.length)) {
                    const pp = line[pID].pos;
                    if (pID == 0) vContext.moveTo(pOp.xScale(pp[0]), pOp.yScale(pp[1]));
                    else vContext.lineTo(pOp.xScale(pp[0]), pOp.yScale(pp[1]))
                }
                vContext.stroke();


                vContext.fillStyle = col.pl.c[transID];
                let wordID = 0;
                for (const point of line) {
                    const ox = pOp.xScale(point.pos[0]);
                    const oy = pOp.yScale(point.pos[1]);

                    lineSeq.push({
                        ox, oy,
                        x: Math.floor(ox * gridScale) / gridScale,
                        y: Math.floor(oy * gridScale) / gridScale,
                        id: point.id,
                        loc: this.projector.loc,
                        transID,
                        wordID,
                        ow:panelWidthCeil,
                        oh:panelWidthCeil
                    });

                    vContext.beginPath();
                    vContext.arc(ox, oy, 5, 0, 2 * Math.PI);
                    vContext.fill()

                    wordID += 1;
                }
            }


            lineSeqs.push(lineSeq);
        }


        let panRow = this.parent.selectAll('.row').data(lineSeqs);
        panRow.exit().remove();

        panRow = panRow.enter()
            .append('div').attr('class', 'row')
            .merge(panRow)

        let pCanvas = panRow.selectAll('.pCanvas').data(d => d);
        pCanvas.exit().remove();

        // noinspection JSSuspiciousNameCombination
        pCanvas = pCanvas.enter().append('canvas').attrs({
            class: 'pCanvas',
            width: panelWidthCeil,
            height: panelWidthCeil,
        }).merge(pCanvas)


        const that = this;
        pCanvas.each(function (d: PointSegment) {
            const ctx: CanvasRenderingContext2D = (<HTMLCanvasElement>this)
                .getContext('2d');

            ctx.fillStyle = 'black';
            // ctx.fillRect(2,2,10,10);

            ctx.drawImage(that.hiddenCanvas.node(),
                d.x, d.y, panelWidth, panelWidth,
                0, 0, panelWidth, panelWidth)

            ctx.beginPath();
            ctx.strokeStyle = col.select.c;
            ctx.lineWidth = col.select.w;
            ctx.arc(d.ox - d.x, d.oy - d.y, 5, 0, 2 * Math.PI);
            ctx.stroke();

        })


        pCanvas.on('mouseenter', (d: PointSegment) => {
            const details: StatePictogramsHovered = {
                caller: this,
                segment: d,
                hovered: true
            };
            this.eventHandler.trigger(StatePictograms.events.segmentHovered, details)
        });
        pCanvas.on('mouseleave', (d: PointSegment) => {
            const details: StatePictogramsHovered = {
                caller: this,
                segment: d,
                hovered: false
            };
            this.eventHandler.trigger(StatePictograms.events.segmentHovered, details)
        });


        // vContext.closePath();


    }

    actionHighlightSegment(transID: number, wordID: number, hovered: boolean) {
        if (hovered) {
            this.parent.selectAll('.pCanvas')
                .classed('selected',
                    (d: PointSegment) => d.wordID === wordID && d.transID === transID);
        } else {
            this.parent.selectAll('.pCanvas')
                .classed('selected', false)
        }

    }


    protected _wrangle(data) {
        const pOp = this.projector.current;

        this.hiddenCanvas.attrs({
            width: pOp.project.w,
            height: pOp.project.h,
        })


    }

}