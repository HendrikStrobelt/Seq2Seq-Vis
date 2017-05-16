/**
 * Created by hen on 5/15/17.
 */
class SVG {
    static translate({x, y}) {return "translate(" + x + "," + y + ")"}

    static group(parent, classes, pos) {
        return parent.append('g').attrs({
            class: classes,
            "transform": SVG.translate(pos)
        })
    }

}

class SVGMeasurements {
    constructor(baseElement, classes = '') {
        this.measureElement = baseElement.append('text')
          .attrs({x: 0, y: -20, class: classes})

    }

    textLength(text) {
        this.measureElement.text(text);
        const tl = this.measureElement.node().getComputedTextLength();
        this.measureElement.text('');

        return tl;
    }
}