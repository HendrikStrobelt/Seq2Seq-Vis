window.onload = () => {
    let svg = d3.selectAll('#vis');


    const globalEvents = new SimpleEventHandler(svg.node());
    const sv = new S2SAttention({parent: svg, eventHandler: globalEvents});


    //    --- EVENTS ---

    const updateAllVis = () => {
        const value = d3.select('#query_input').node().value;


        const request = Networking.ajax_request('/api/translate');
        const payload = new Map([['in', value.trim()]]);

        request
          .get(payload)
          .then(data => {
              // console.log(data, "--- data");
              sv.update(JSON.parse(data))
              $('#spinner').hide();
          })
          .catch(error => console.log(error, "--- error"));
    };


    d3.select('#query_button').on('click', updateAllVis);
    d3.select('#query_input').on('keypress', () => {
        if (d3.event instanceof KeyboardEvent && (d3.event.keyCode === 13 || d3.event.keyCode === 32)) {
            $('#spinner').show();
            updateAllVis();
        }
    })

    // little eventHandling
    globalEvents.bind('svg-resize', ({width, height}) => svg.attrs({width, height}));

    function windowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight - $("#title").height() - $("#ui").height() - 5;
        globalEvents.trigger('svg-resize', {width, height})
    }

    $(window).resize(windowResize);

    windowResize();


};





