class PanelController {

    constructor() {
        this._columns = {
            zero: d3.select('.col0'),
            left: d3.select('.col1'),
            middle: d3.select('.col3'),
            right: d3.select('.col5'),
            setup_left: d3.select('.col2'),
            setup_right: d3.select('.col4'),
        };

        this._vis = {
            zero: {
                encoder_extra: [],
                encoder_words: null,
                attention: null,
                decoder_words: null,
                decoder_extra: []
            },
            left: {
                encoder_extra: [],
                encoder_words: null,
                attention: null,
                decoder_words: null,
                decoder_extra: []
            },
            middle: [],
            right: [],
            setup_left: [],
            setup_right: []
        };

        this._current = {
            topN: 0,
            inWordPos: [],
            outWordPos: [],
            inWords: [],
            outWords: [],
            hideStates: false,
            box_width: 50,
            wordProjector: null,
            closeWordsList: null
        };


        this.eventHandler = new SimpleEventHandler(d3.select('body').node());

        this._init()

        this._bindEvents();

    }

    _init() {

        this._vis.left.encoder_extra.push(this._createStatesVis({
            col: this._columns.left,
            className: 'states_encoder',
            divStyles: {'padding-top': '5px'},
            options: {
                data_access: d => d.encoder.map(e => _.isArray(e.state) ? e.state : []),// TODO: fix hack !!!
                hidden: this._current.hideStates,
                height: 100,
                cell_width: this._current.box_width
            }
        }));

        this._vis.left.encoder_words = this._createWordLine({
            col: this._columns.left,
            className: 'encoder_words',
            divStyles: {'padding-top': '5px'},
            options: {
                box_type: this._current.hideStates ? WordLine.BoxType.flow : WordLine.BoxType.fixed,
                box_width: this._current.box_width
            }
        });

        this._vis.left.attention = this._createAttention({
            col: this._columns.left,
            className: 'attn_vis',
            options: {}
        });

        this._vis.left.decoder_words = this._createWordLine({
            col: this._columns.left,
            className: 'decoder_words',
            divStyles: {'padding-bottom': '5px'},
            options: {
                box_width: this._current.box_width,
                box_type: this._current.hideStates ? WordLine.BoxType.flow : WordLine.BoxType.fixed,
                css_class_main: 'outWord',
                data_access: d => d.decoder.length ? [d.decoder[this._current.topN]] : []
            }
        });

        this._vis.left.decoder_extra.push(this._createStatesVis({
            col: this._columns.left,
            className: 'states_decoder',
            divStyles: {'padding-bottom': '5px'},
            options: {
                data_access: d =>
                  (d.decoder.length > this._current.topN) ?
                    d.decoder[this._current.topN].map(e => _.isArray(e.state) ? e.state : []) : [[]], // TODO: fix hack !!!
                hidden: this._current.hideStates,
                height: 100,
                cell_width: this._current.box_width
            }
        }));

        this._vis.left.decoder_extra.push(this._createWordLine({
            col: this._columns.left,
            className: 'decoder_topK',
            divStyles: {'padding-top': '5px'},
            options: {
                css_class_main: 'topKWord',
                data_access: d => d.decoder.filter((_, i) => i !== this._current.topN)
            }
        }))


        // Zero


        this._vis.zero.encoder_extra.push(PanelController._setupPanel({
            col: this._columns.zero,
            className: "encoder_states_setup",
            addSVG: false,
            title: 'Enc states: ',
            divStyles: {height: '100px', width: '100px', 'padding-top': '5px'}
        }));

        this._vis.zero.encoder_words = PanelController._setupPanel({
            col: this._columns.zero,
            className: "encoder_words_setup",
            addSVG: false,
            title: 'Enc words: ',
            divStyles: {height: '21px', width: '100px', 'padding-top': '5px'}
        })

        this._vis.zero.attention = PanelController._setupPanel({
            col: this._columns.zero,
            className: "attn_setup",
            addSVG: false,
            title: 'Attention: ',
            divStyles: {height: '50px', width: '100px'}
        })

        // noinspection JSUnresolvedVariable
        this._vis.zero.decoder_words = this._createScoreVis({
            col: this._columns.zero,
            className: "decoder_words_setup",
            divStyles: {height: '21px', width: '100px', 'padding-bottom': '5px'},
            options: {
                bar_height: 20,
                data_access: d => [d.scores[this._current.topN]],
                data_access_all: d => d.scores
            }
        })

        this._vis.zero.decoder_extra.push(PanelController._setupPanel({
            col: this._columns.zero,
            className: "decoder_states_setup",
            addSVG: false,
            title: 'Dec states: ',
            divStyles: {height: '100px', width: '100px', 'padding-bottom': '5px'}
        }))

        this._vis.zero.decoder_extra.push(this._createScoreVis({
            col: this._columns.zero,
            className: "decoder_words_setup",
            divStyles: {width: '100px', 'padding-top': '5px'},
            options: {
                bar_height: 23,
                data_access: d => d.scores.filter((_, i) => i !== this._current.topN),
                data_access_all: null
            }
        }))

    }

    update(data) {
        console.log(data, "--- data");

        const enc = this._vis.left.encoder_words;
        const dec = this._vis.left.decoder_words;
        const attn = this._vis.left.attention;
        const cur = this._current;

        enc.update(data);
        dec.update(data);

        cur.inWordPos = enc.positions[0];
        cur.inWords = enc.rows[0];
        cur.outWordPos = dec.positions[0];
        cur.outWords = dec.rows[0];
        data._current = cur;

        attn.update(data);

        this._vis.left.encoder_extra.forEach(e => e.update(data));
        this._vis.left.decoder_extra.forEach(e => e.update(data));


        //==== setup column

        this._vis.zero.decoder_words.update(data);
        console.log(this._vis.zero.decoder_words.xScale, "--- this._vis.zero.decoder_words.xScale");

        this._vis.zero.decoder_extra.forEach(d => {
            if ('updateOptions' in d) {
                d.updateOptions({options: {xScale: this._vis.zero.decoder_words.xScale}});
                d.update(data);
            }

        })


    }


    static _setupPanel({col, className, divStyles, addSVG = true, title = null}) {
        const div = col
          .append('div').attr('class', 'setup ' + className).styles(divStyles)
        // .style('background', 'lightgray');
        if (title) {div.html(title);}
        if (addSVG) return div.append('svg').attrs({width: 100, height: 30})
          .styles({
              display: 'inline-block'
          });
        else return div;
    }

    _createScoreVis({col, className, options, divStyles}) {
        const svg = PanelController._setupPanel({col, className, divStyles, addSVG: true});

        return new BarList({
            d3parent: svg,
            eventHandler: this.eventHandler,
            options
        })
    }


    static _standardSVGPanel({col, className, divStyles}) {
        return col
          .append('div').attr('class', className).styles(divStyles)
          .append('svg').attrs({width: 500, height: 30});
    }


    _createStatesVis({col, className, options, divStyles}) {
        const svg = PanelController._standardSVGPanel({col, className, divStyles});

        return new StateVis({
            d3parent: svg,
            eventHandler: this.eventHandler,
            options
        })
    }


    _createAttention({col, className, options, divStyles}) {
        const svg = PanelController._standardSVGPanel({col, className, divStyles});

        return new AttentionVis({
            d3parent: svg,
            eventHandler: this.eventHandler,
            options
        })
    }

    _createWordLine({col, className, options, divStyles}) {
        const svg = PanelController._standardSVGPanel({col, className, divStyles});

        return new WordLine({
            d3parent: svg,
            eventHandler: this.eventHandler,
            options
        })
    }

    _createWordProjector({col, className, options, divStyles}) {
        const svg = PanelController._standardSVGPanel({col, className, divStyles});

        return new WordProjector({
            d3parent: svg,
            eventHandler: this.eventHandler,
            options
        })
    }

    _createCloseWordList({col, className, options, divStyles}) {
        const svg = PanelController._standardSVGPanel({col, className, divStyles});

        return new CloseWordList({
            d3parent: svg,
            eventHandler: this.eventHandler,
            options
        })
    }


    updateAndShowWordProjector(data) {
        if (this._current.wordProjector === null) {
            this._current.wordProjector = this._createWordProjector({
                col: this._columns.middle,
                className: "word_projector",
                divStyles: {'padding-top': '105px'},
                options: {}
            })
        }
        console.log(this._current.wordProjector, "--- this._current.wordProjector");
        this._current.wordProjector.update(data);
    }

    closeWordProjector() {
        if (this._current.wordProjector) {
            this._current.wordProjector.destroy();
            this._current.wordProjector = null;
        }
    }


    updateAndShowWordList(data) {
        if (this._current.closeWordsList === null) {
            this._current.closeWordsList = this._createCloseWordList({
                col: this._columns.middle,
                className: "close_word_list",
                divStyles: {'padding-top': '10px'},
                options: {}
            })
        }
        console.log(this._current, "--- this._current");
        this._current.closeWordsList.update(data);
    }


    _bindEvents() {
        this.eventHandler.bind(WordLine.events.wordSelected, (d, e) => {
            if (d.caller === this._vis.left.encoder_words
              || d.caller === this._vis.left.decoder_words) {

                let loc = 'src';
                if (d.caller === this._vis.left.decoder_words) {
                    loc = 'tgt'
                }

                const allWords = d.caller.firstRowPlainWords;

                S2SApi.closeWords({input: d.word.word.text, loc, limit: 20})
                  .then(data => {
                      // console.log(JSON.parse(data), "--- data");

                      const word_data = JSON.parse(data);
                      // this.updateAndShowWordProjector(word_data);
                      const replaceIndex = d.index;
                      if (loc === 'src') {
                          const pivot = allWords.join(' ');

                          const compare = word_data.word.map(wd => {
                              return allWords.map((aw, wi) =>
                                (wi === replaceIndex) ? wd : aw).join(' ');
                          })
                          console.log(pivot, compare, "--- pivot, compare");
                          S2SApi.compareTranslation({pivot, compare})
                            .then(data => {
                                word_data["compare"] = JSON.parse(data)["compare"];
                                this.updateAndShowWordList(word_data);
                            })

                      } else {
                          this.updateAndShowWordList(word_data);

                      }


                  })
                  .catch(error => console.log(error, "--- error"));


                console.log(d.word.word.text, d, " enc--- ");
            }


        })

    }
}