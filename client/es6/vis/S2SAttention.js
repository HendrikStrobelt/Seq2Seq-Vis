class S2SAttention extends VComponent {

    get defaultOptions() {
        return {}
    }

    get layout() {
        return [{name: "main", pos: {x: 50, y: 50}}]
    }

    _bindLocalEvents() {
        return null;
    }

    _init() {

        this.measurer = new SVGMeasurements(this.parent, 'measureWord');

    }

    _wrangle(data) {
        // Translation {
        //     attn (Array[integer]): Attention for each output position ,
        //     in (string): input sentence ,
        //     out (string): translated sentence
        // }


        const toWords = sentence => sentence.split(' ').map(d => ({
            text: d,
            width: Math.max(this.measurer.textLength(d), 20)
        }));

        data['inWords'] = toWords(data.in);
        data['outWords'] = toWords(data.out);

        console.log(data, "--- data");
        return data;
    }

    _renderWords(positions, words, cl, yCoord, hoverPrefix) {
        const inWord = this.layers.main.selectAll(`.${cl}`).data(words);
        inWord.exit().remove();

        const inWordEnter = inWord.enter().append('g').attr('class', cl);
        inWordEnter.append('rect').attrs({
            x: -3,
            y: -3,
            height: 21,
            width: d => d.width + 6,
            rx: 3,
            ry: 3
        });
        inWordEnter.append('text').attr('y', '8').text(d => d.text);


        const all = inWordEnter.merge(inWord)
          .attrs({
              'transform': (d, i) => `translate(${positions[i]},${yCoord})`,
          })
        all.select('text').attr('x', d => d.width * .5).text(d => d.text);
        all.select('rect').attr('width', d => d.width + 6)
          .on('mouseenter', (d, i) => {
              this.layers.main.selectAll(`.${hoverPrefix+i}`).raise().classed('highlight', true);
          })
          .on('mouseout', (d, i) => {
              this.layers.main.selectAll(`.${hoverPrefix+i}`).classed('highlight', null);
          })
        ;

    }

    _render(renderData) {

        const calcPos = words => {
            let inc = 0;
            return [...words.map(w => {
                const res = inc;
                inc += +w.width + 10;
                return res
            })];
        };

        const inPositions = calcPos(renderData.inWords);
        const outPositions = calcPos(renderData.outWords);

        this._renderWords(inPositions, renderData.inWords, 'inWord', 10, 'in');
        this._renderWords(outPositions, renderData.outWords, 'outWord', 100, 'out');

        // renderData.attn.forEach(atn => console.log(_.sum(atn), "--- "))
        // _.unzip(renderData.attn).forEach(atn => console.log(_.sum(atn), "-TTT-- "))

        const maxWidthPixel = 15;
        const attnPerInWord = _.unzip(renderData.attn);
        const attnPerInWordSum = attnPerInWord.map(a => _.sum(a));
        const maxAttnPerAllWords = Math.max(1, _.max(attnPerInWordSum));
        const lineWidthScale = d3.scaleLinear().domain([0, maxAttnPerAllWords]).range([1, maxWidthPixel]);

        const inPositionGraph = renderData.inWords.map((inWord, inIndex) => {
            const offset = inPositions[inIndex] + (inWord.width - lineWidthScale(attnPerInWordSum[inIndex])) / 2;
            let inc = offset;
            return renderData.outWords.map((_, outIndex) => {
                const lw = lineWidthScale(attnPerInWord[inIndex][outIndex]);
                const res = inc + lw / 2;
                inc += lineWidthScale(attnPerInWord[inIndex][outIndex]);
                return {inPos: res, width: lw, classes: `in${inIndex} out${outIndex}`}
            });
        })

        renderData.outWords.forEach((outWord, outIndex) => {
            const offset = outPositions[outIndex] + (outWord.width - lineWidthScale(1)) * .5;
            let inc = offset;
            renderData.inWords.forEach((_, inIndex) => {
                const line = inPositionGraph[inIndex][outIndex]
                console.log(line, "--- line");
                line['outPos'] = inc + line.width * .5;
                inc += line.width;
            })

        })


        const allLines = _.flatten(inPositionGraph);

        const graph = this.layers.main.selectAll(".graph").data(allLines);
        graph.exit().remove();

        const linkGen = d3.linkVertical();

        const graphEnter = graph.enter().append('g').attr('class', 'graph');
        graphEnter.append('path');
        graphEnter.merge(graph).select('path').attrs({
            d: d => {
                return linkGen({
                    source: [d.inPos, 31],
                    target: [d.outPos, 97]
                })
            },
            class: d => d.classes
        }).style('stroke-width', d => d.width);


        console.log(inPositionGraph, "--- inPositionGraph");

    }

}