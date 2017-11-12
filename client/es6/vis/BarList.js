class BarList extends VComponent {

    // noinspection JSUnusedGlobalSymbols
    static get events() {
        return {}
    }

    // noinspection JSUnusedGlobalSymbols
    static get defaultOptions() {
        return {
            width: 90,
            bar_height: 20,
            css_class_main: 'bar_list_vis',
            css_bar: 'bar',
            xScale: d3.scaleLinear(),
            data_access: d => d.encoder.map(e => e.state),
            data_access_all: null
        }
    }

    // noinspection JSUnusedGlobalSymbols
    static get layout() {
        return [
            // {name: 'axis', pos: [0, 0]},
            {name: 'main', pos: [0, 0]},
        ]
    }

    _init() {
        return this;
    }

    _wrangle(data) {
        const op = this.options;

        if (op.data_access_all) {
            const ex = d3.extent(op.data_access_all(data));

            console.log(ex, "--- ex");

            if (ex[0] * ex[1] > 0) {
                if (ex[0] > 0) ex[0] = ex[1];
                ex[1] = 0;
            }


            op.xScale =
              d3.scaleLinear()
                .domain(ex)
                .range([op.width, 0])
        }

        const barValues = op.data_access(data);

        this.parent.attrs({
            width: op.width,
            height: barValues.length * op.bar_height
        });

        return {barValues};
    }

    _render({barValues}) {

        const op = this.options;

        const bars = this.layers.main.selectAll(`.${op.css_bar}`).data(barValues);
        bars.exit().remove();

        const barsEnter = bars.enter().append('rect').attr('class', op.css_bar);

        console.log(op.xScale.domain(), this.options, "--- this.xScale, this.options");


        barsEnter.merge(bars).attrs({
            x: d => op.width - op.xScale(d),
            y: (_, i) => i * op.bar_height,
            height: op.bar_height - 2,
            width: d => op.xScale(d)
        })

    }


    get xScale() {
        return this.options.xScale;
    }

}