import {D3Sel, VComponent} from "./VisualComponent";
import * as _ from "lodash";
import * as d3 from "d3"
import * as cola from "../../node_modules/webcola/dist/index"
import {SimpleEventHandler} from "../etc/SimpleEventHandler";
import {SVGMeasurements} from "../etc/SVGplus";

export class WordProjector extends VComponent {

    readonly defaultOptions = {
        height: 400,
        width: 500,
        css_class_main: 'wp_vis',
        hidden: false,
        data_access: {
            pos: d => d.pos,
            scores: d => d.score,
            words: d => d.word,
            compare: d => d.compare
        }
    };


    readonly layout = [
        {name: 'bg', pos: [0, 0]},
        {name: 'main', pos: [0, 0]},
    ];

    //-- default constructor --
    constructor(d3Parent: D3Sel, eventHandler?: SimpleEventHandler, options: {} = {}) {
        super(d3Parent, eventHandler);
        this.superInit(options);
    }

    _init() {
        const op = this.options;
        this.options.text_measurer = this.options.text_measurer
            || new SVGMeasurements(this.parent, 'measureWord');

        this.parent.attrs({
            width: op.width,
            height: op.height
        });
        if (this.options.hidden) this.hideView();
    }

    _wrangle(data) {

        console.log("wrnagle--- ");

        const op = this.options;

        const raw_pos = op.data_access.pos(data);
        const x_values = <number[]>raw_pos.map(d => d[0]);
        const y_values = <number[]>raw_pos.map(d => d[1]);

        const p0_min = _.min(x_values);
        const p1_min = _.min(y_values);

        const diff0 = _.max(x_values) - p0_min;
        const diff1 = _.max(y_values) - p1_min;


        let norm_pos = [];

        if (diff0 > diff1) {
            norm_pos = raw_pos.map(d => [(d[0] - p0_min) / diff0, (d[1] - p1_min) / diff0]);
        } else {
            norm_pos = raw_pos.map(d => [(d[0] - p0_min) / diff1, (d[1] - p1_min) / diff1])
        }

        const words = op.data_access.words(data);
        const scores = op.data_access.scores(data);
        const compare = op.data_access.compare(data);
        this._states.has_compare = compare !== null;

        return _.sortBy(_.zipWith(words, scores, norm_pos, compare,
            (word, score, pos, compare) => ({word, score, pos, compare})),
            (d:{word, score, pos, compare}) => -d.score);


        // return _.zipWith(words, scores, norm_pos,
        //   (word, score, pos) => ({word, score, pos}));
    }

    _render(renderData) {

        console.log(renderData, "--- renderData");
        const op = this.options;

        const word = this.layers.main.selectAll(".word").data(renderData);
        word.exit().remove();

        const wordEnter = word.enter().append('g').attr('class', 'word');
        wordEnter.append('rect');
        wordEnter.append('text');

        const xscale = d3.scaleLinear().range([30, op.width - 30]);
        const yscale = d3.scaleLinear().range([10, op.height - 10]);
        const scoreExtent = d3.extent(<number[]>renderData.map(d => d.score))
        const wordScale = d3.scaleLinear().domain(scoreExtent).range([6, 14]);


        const ofree = []

        for (const rd of renderData) {
            const w = rd.word;
            const height = wordScale(rd.score);
            const x = xscale(rd.pos[0])
            const y = yscale(rd.pos[1])

            const width = op.text_measurer.textLength(w, 'font-size:' + height + 'px;')
            // console.log(w,height,x,y,width,"--- w,height,x,y,width");

            ofree.push(new cola.Rectangle(x - width / 2 - 4, x + width / 2 + 4, y - height / 2 - 3, y + height / 2 + 3))

        }


        cola.removeOverlaps(ofree);

        const newPos = {};
        ofree.forEach((d, i) => {
            newPos[renderData[i].word] = {
                cx: (d.X + d.x) * .5,
                cy: (d.Y + d.y) * .5,
                w: (d.X - d.x),
                h: (d.Y - d.y)
            }
        });


        // console.log(ofree,"--- ofree");


        //TODO: BAD HACK - -should not be using indices

        const allWords = wordEnter.merge(word);
        allWords.attr('transform',
            (d, i) => `translate(${newPos[d.word].cx}, ${newPos[d.word].cy})`)
        allWords.select('rect').attrs({
            width: (d, i) => newPos[d.word].w,
            height: (d, i) => newPos[d.word].h - 2,
            x: (d, i) => -newPos[d.word].w * .5,
            y: (d, i) => -newPos[d.word].h * .5 + 1,
        });
        allWords.select('text')
            .text(d => d.word)
            .style('font-size', d => wordScale(d.score) + 'px')

        if (this._states.has_compare) {
            const bd_max = _.max(<number[]>renderData.map(d => d.compare.dist));
            const bd_scale = d3.scaleLinear<string,string>().domain([0, bd_max])
                .range(['#ffffff', '#3f6f9e']);
            allWords.select('rect').style('fill', d => {
                // console.log(d,"--- d");
                return bd_scale(d.compare.dist)
            })

        }


    }

}