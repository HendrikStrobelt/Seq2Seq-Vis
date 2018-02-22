import * as d3 from "d3"
import * as _ from "lodash";

import {PanelController} from "./controller/PanelController";
import {S2SApi, Translation} from "./api/S2SApi";
import '../css/main.scss'


window.onload = () => {
    // let svg = d3.selectAll('#vis');
    //
    //
    // const globalEvents = new SimpleEventHandler(svg.node());
    // const sv = new S2SAttention({parent: svg, eventHandler: globalEvents});

    const panelCtrl = new PanelController();


    //    --- EVENTS ---

    const updateAllVis = () => {
        $('#spinner').show();
        const value = (<HTMLInputElement> d3.select('#query_input').node()).value;




        S2SApi.translate({input: value.trim()})
            .then((data: string) => {
                const raw_data = JSON.parse(data);
                console.log(raw_data, "--- data");
                panelCtrl.update(raw_data);
                panelCtrl.cleanPanels();


                $('#spinner').hide();
            })
            .catch((error: Error) => console.log(error, "--- error"));
    };

    const updateDebounced = _.debounce(updateAllVis, 1000);

    d3.select('#query_button').on('click', updateAllVis);

    d3.select('#query_input').on('keypress', () => {
        const keycode = d3.event.keyCode;
        if (d3.event instanceof KeyboardEvent
        //&& (keycode === 13 || keycode === 32)
        ) {

            updateDebounced();
            // updateAllVis();
        }
    })


    // little eventHandling
    // globalEvents.bind('svg-resize', ({width, height}) => svg.attrs({width, height}));

    function windowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight
            - $("#title").height()
            - $("#ui").height() - 5;
        // globalEvents.trigger('svg-resize', {width, height})
    }


    $(window).resize(windowResize);

    windowResize();


};