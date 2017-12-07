class WordProjector extends VComponent {

    // noinspection JSUnusedGlobalSymbols
    static get events() {
        return {}
    }

    // noinspection JSUnusedGlobalSymbols
    static get defaultOptions() {
        return {
            height: 400,
            width: 500,
            css_class_main: 'wp_vis',
            hidden: false,
            data_access: {pos: d => d.pos, scores: d => d.score, words: d => d.word}

        }
    }

    // noinspection JSUnusedGlobalSymbols
    static get layout() {
        return [
            {name: 'bg', pos: [0, 0]},
            {name: 'main', pos: [0, 0]},
        ]
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
        const x_values = raw_pos.map(d => d[0]);
        const y_values = raw_pos.map(d => d[1]);

        const p0_min = _.minBy(x_values);
        const p1_min = _.minBy(y_values);

        const diff0 = _.maxBy(x_values) - p0_min;
        const diff1 = _.maxBy(y_values) - p1_min;


        let norm_pos = [];

        if (diff0 > diff1) {
            norm_pos = raw_pos.map(d => [(d[0] - p0_min) / diff0, (d[1] - p1_min) / diff0]);
        } else {
            norm_pos = raw_pos.map(d => [(d[0] - p0_min) / diff1, (d[1] - p1_min) / diff1])
        }

        const words = op.data_access.words(data);
        const scores = op.data_access.scores(data);

        return _.zipWith(words, scores, norm_pos,
          (word, score, pos) => ({word, score, pos}));
    }

    _render(renderData) {

        console.log(renderData, "--- renderData");
        const op = this.options;

        const word = this.layers.main.selectAll(".word").data(renderData);
        word.exit().remove();

        const wordEnter = word.enter().append('text').attr('class', 'word');

        const xscale = d3.scaleLinear().range([30, op.width - 30]);
        const yscale = d3.scaleLinear().range([10, op.height - 10]);
        const wordScale = d3.scalePow().exponent(.9).range([6, 14]);


        const ofree = []
        
        for (const rd of renderData){
            const w = rd.word;
            const height = wordScale(rd.score);
            const x = xscale(rd.pos[0])
            const y = yscale(rd.pos[1])
            
            const width = op.text_measurer.textLength(w,'font-size:' +height+ 'px;')
            // console.log(w,height,x,y,width,"--- w,height,x,y,width");

            ofree.push(new cola.Rectangle(x-width/2, x+width/2, y-height/2, y+height/2))
            
        }


        cola.removeOverlaps(ofree);

        // console.log(ofree,"--- ofree");


        //TODO: BAD HACK - -should not be using indices

        wordEnter.merge(word).attrs({
            x: (d,i) => (ofree[i].X-ofree[i].x)/2+ofree[i].x,
            y: (d,i) => (ofree[i].Y-ofree[i].y)/2+ofree[i].y,
        }).text(d => d.word).style('font-size', d => wordScale(d.score) + 'px')


        // wordEnter.merge(word).attrs({
        //     x: d => xscale(d.pos[0]),
        //     y: d => yscale(d.pos[1])
        // }).text(d => d.word).style('font-size', d => wordScale(d.score) + 'px')


        // const op = this.options;
        //
        // const x = (i) => op.x_offset + Math.round((i + .5) * op.cell_width);
        //
        // const y = d3.scalePow().exponent(.5).domain(renderData.yDomain).range([op.height, 0]);
        //
        // const line = d3.line()
        //   .x((_, i) => x(i))
        //   .y(d => y(d));
        //
        //
        // const stateLine = this.layers.main.selectAll(`.${op.css_line}`).data(renderData.states);
        // stateLine.exit().remove();
        //
        // const stateLineEnter = stateLine.enter().append('path').attr('class', op.css_line);
        //
        // stateLineEnter.merge(stateLine).attrs({
        //     'd': line
        // });
        //
        //
        // if (renderData.states.length > 0) {
        //     const yAxis = d3.axisLeft(y).ticks(7);
        //     this.layers.axis.classed("axis state_axis", true)
        //       .call(yAxis).selectAll('*');
        //     this.layers.axis.attrs({
        //         // transform: `translate(${x(renderData.states[0].length - 1) + 3},0)`
        //         transform: `translate(${op.x_offset + op.cell_width * .5 - 3},0)`
        //     })
        // } else {
        //     this.layers.axis.selectAll("*").remove();
        // }


    }

}