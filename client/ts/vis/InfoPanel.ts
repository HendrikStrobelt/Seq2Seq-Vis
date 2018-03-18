import {D3Sel} from "../etc/LocalTypes";
import * as d3 from "d3";


export interface InfoPanelData {
    translations: { src: string[], tgt: string[] }[],
    highlights: {
        on: string, //'tgt' | 'src'
        indices: number[]
    }
}

export class InfoPanel {
    private infoPanel: D3Sel;
    private tgt: D3Sel;
    private src: D3Sel;

    current = {
        highlightOffset: 0,
        display: {
            tgt: true,
            src: true
        }
    };
    private show_btns: D3Sel;
    private offset_btns: D3Sel;
    private data: InfoPanelData;


    constructor(private parent: D3Sel) {
        parent.html('<div class="info_panel">' +
            '<div class="menu"> ' +
            'show: ' +
            '<span class="show_src show_btn btn btn_left">src</span>' +
            '<span class="show_tgt show_btn btn btn_right">tgt</span>' +
            ' highlight: ' +
            '<span class="h_minus offset_btn btn btn_left">-1</span>' +
            '<span class="h_null offset_btn btn">0</span>' +
            '<span class="h_plus offset_btn btn btn_right">+1</span>' +
            '</div></div>')

        this.infoPanel = parent.select('.info_panel');

        this.show_btns = parent.selectAll('.show_btn');
        this.offset_btns = parent.selectAll('.offset_btn');

        const that = this;
        this.show_btns.on('click', function () {
            const v = d3.select(this).text();
            that.current.display[v] = !that.current.display[v];
            that.updateMenu();
            that.actionUpdateCurrent();
        });

        this.offset_btns.on('click', function () {
            const v = +d3.select(this).text();
            that.current.highlightOffset = v;
            that.updateMenu();
            that.actionUpdateCurrent();
        });


        this.updateMenu();

        // this.src = parent.select('.src');
        // this.tgt = parent.select('.tgt');
    }

    private updateMenu() {
        const that = this;
        this.show_btns.classed('selected', function () {
            const v = d3.select(this).text();
            return that.current.display[v]
        });

        this.offset_btns.classed('selected', function () {
            const v = +d3.select(this).text();
            return that.current.highlightOffset === v;
        });
    }


    actionUpdateCurrent() {
        const cur = this.current;
        const data = this.data;

        const allT = this.infoPanel.selectAll(".translation");

        allT.select('.src').html((d: any, i) =>
            this.renderHighlight(d.src, data.highlights.on === 'src' ? data.highlights.indices[i]+cur.highlightOffset : -1))
            .attr('hidden', cur.display.src ? null : true);
        allT.select('.tgt').html((d: any, i) =>
            this.renderHighlight(d.tgt, data.highlights.on === 'tgt' ? data.highlights.indices[i]+cur.highlightOffset : -1))
            .attr('hidden', cur.display.tgt ? null : true);

    }


    private cleanData(s: string) {
        return s.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
        // .replace(new RegExp('--\\|'), '<span class="highlight">')
        // .replace(new RegExp('\\|--'), '</span>')
    }

    private renderHighlight(words: string[], index: number) {

        return words.map((w, i) => {
            w = this.cleanData(w);
            return i === index ? `<span class="highlight">${w}</span>` : w
        }).join(' ')

    }


    update(data: InfoPanelData) {
        const cur = this.current;

        this.data = data;

        let tSel = this.infoPanel.selectAll(".translation").data(data.translations);
        tSel.exit().remove();

        const tEnter = tSel.enter().append('div').attr('class', 'translation');
        tEnter.html('<div class="src"></div><div class="tgt"></div>');

        tSel = tEnter.merge(tSel).order();

        this.actionUpdateCurrent();

        // tSel.select('.src').html((d, i) =>
        //     this.renderHighlight(d.src, data.highlights.on === 'src' ? data.highlights.indices[i] : -1))
        //     .attr('hidden', cur.display.src ? null : true);
        // tSel.select('.tgt').html((d, i) =>
        //     this.renderHighlight(d.tgt, data.highlights.on === 'tgt' ? data.highlights.indices[i] : -1))
        //     .attr('hidden', cur.display.tgt ? null : true);

    }

}