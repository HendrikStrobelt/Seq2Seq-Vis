import {D3Sel, LooseObject, VComponent} from "./VisualComponent";
import * as d3 from "d3";
import * as _ from "lodash";
import {SimpleEventHandler} from "../etc/SimpleEventHandler";
import {SVGMeasurements} from "../etc/SVGplus";


export class CloseWordList extends VComponent {

    readonly defaultOptions = {
        height: 400,
        width: 1000,
        lineSpacing: 20,
        scoreWidth: 100,
        css_class_main: 'close_words',
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


    constructor(d3Parent: D3Sel, eventHandler?: SimpleEventHandler, options: {} = {}) {
        super(d3Parent, eventHandler);
        this.superInit(options);
    }


    _init() {
        const op = this.options;
        this.options.text_measurer = this.options.text_measurer
            || new SVGMeasurements(this.parent, 'close_word_list');

        this.parent.attrs({
            width: op.width,
            height: op.height
        });
        if (this.options.hidden) this.hideView();
    }

    _wrangle(data) {

        console.log("wrnagle--- ");

        const op = this.options;

        // const raw_pos = op.data_access.pos(data);
        // const x_values = raw_pos.map(d => d[0]);
        // const y_values = raw_pos.map(d => d[1]);
        //
        // const p0_min = _.minBy(x_values);
        // const p1_min = _.minBy(y_values);
        //
        // const diff0 = _.maxBy(x_values) - p0_min;
        // const diff1 = _.maxBy(y_values) - p1_min;
        //
        //
        // let norm_pos = [];
        //
        // if (diff0 > diff1) {
        //     norm_pos = raw_pos.map(d => [(d[0] - p0_min) / diff0, (d[1] - p1_min) / diff0]);
        // } else {
        //     norm_pos = raw_pos.map(d => [(d[0] - p0_min) / diff1, (d[1] - p1_min) / diff1])
        // }

        const words = op.data_access.words(data);
        const wordWidth = words.map(w => op.text_measurer.textLength(w));
        const scores = op.data_access.scores(data);
        const compare = op.data_access.compare(data);
        this._states.has_compare = compare !== null;

        // if (this._states.has_compare) {
        return _.sortBy(_.zipWith(words, scores, wordWidth, compare,
            (word, score, width, compare) => ({word, score, width, compare})), d => -d.score);
        // } else {
        //     return _.sortBy(_.zipWith(words, scores, wordWidth,
        //       (word, score, width) => ({word, score, width})), d => -d.score);
        // }

    }

    _render(renderData: LooseObject[]) {

        const op = this.options;
        const noItems = renderData.length;
        const ls = op.lineSpacing;
        const f2f = d3.format(".2f");


        this.parent.attr('height', noItems * ls);


        const word = this.layers.main.selectAll(".word").data(renderData);
        word.exit().remove();

        const wordEnter = word.enter().append('text').attr('class', 'word');

        const yscale = d3.scaleLinear().domain([0, noItems - 1])
            .range([ls / 2, (noItems - .5) * ls]);


        //TODO: BAD HACK - -should not be using indices

        wordEnter.merge(word).attrs({
            x: () => 10,
            y: (d, i) => yscale(i),
        }).text(d => d.word);
        // .style('font-size', d => wordScale(d.score) + 'px')


        const wordEnd = _.maxBy(renderData, 'width').width;
        const maxScore = _.maxBy(renderData, 'score').score;

        const barScale = d3.scaleLinear().domain([0, maxScore])
            .range([0, op.scoreWidth]);

        const scoreBars = this.layers.main.selectAll(".scoreBar").data(renderData);
        scoreBars.exit().remove();

        const scoreBarsEnter = scoreBars.enter().append('g').attr('class', 'scoreBar');
        scoreBarsEnter.append('rect');
        scoreBarsEnter.append('text').attrs({x: 2, y: ls / 2 - 2, 'class': 'barText'});

        const allScoreBars = scoreBarsEnter.merge(scoreBars).attrs({
            transform: (d, i) => `translate(${wordEnd + 10 + 10},${yscale(i) - ls / 2 })`
        });

        allScoreBars.select('rect').attrs({
            width: d => barScale(d.score),
            height: ls - 4
        });
        allScoreBars.select('text').text(d => f2f(d.score));


        if (this._states.has_compare) {

            const bd_max = _.max(renderData.map(d => d.compare.dist));
            const bd_scale = d3.scaleLinear().domain([0, bd_max])
                .range([1, 100]);


            const barDist = this.layers.main.selectAll(".distBar").data(renderData);
            barDist.exit().remove();
            const barDistEnter = barDist.enter().append('g').attr('class', 'distBar');
            barDistEnter.append('rect');
            barDistEnter.append('text').attrs({x: 2, y: ls / 2 - 2, 'class': 'barText'});


            const all_barDist = barDistEnter.merge(barDist).attrs({
                transform: (d, i) => `translate(${wordEnd + 10 + 10 + op.scoreWidth + 10},${yscale(i) - ls / 2 })`
            });
            all_barDist.select('rect')
                .attrs({
                    width: d => bd_scale(d.compare.dist),
                    height: ls - 4
                });

            all_barDist.select('text').text(d => f2f(d.compare.dist));


            const wordComp = this.layers.main.selectAll(".wordComp").data(renderData);
            wordComp.exit().remove();

            const wordCompEnter = wordComp.enter().append('text').attr('class', 'wordComp');

            wordCompEnter.merge(wordComp).attrs({
                transform: (d, i) => `translate(${wordEnd + 10 + 10 + op.scoreWidth + 120},${yscale(i)})`
            }).text(d => d.compare.sentence)
        } else {
            this.layers.main.selectAll(".wordComp").remove()
        }


        // console.log(wordEnd, [wordEnd], "--- wordEnd,[wordEnd]");
        // const dLine = this.layers.bg.selectAll('.dividerLine').data([wordEnd])
        // dLine.enter().append('line').attr('class', 'dividerLine')
        //   .merge(dLine).attrs({
        //     x1: d => d + 10,
        //     x2: d => d + 10,
        //     y1: 0,
        //     y2: noItems * ls
        // })


    }

}