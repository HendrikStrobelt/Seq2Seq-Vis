/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 12/3/16.
 */

class VComponent {

    // STATIC FIELDS ============================================================

    // noinspection JSUnusedGlobalSymbols
    /**
     * The static property that contains all class related events.
     * Should be overwritten and event strings have to be unique!!
     * @returns {{}} an key-value object for object to string
     * @abstract
     */
    static get events() {
        console.error('static get events() --  not implemented');

        return {noEvent: 'VComponent_noEvent'}
    }

    /**
     * Should be overwritten to define the set of ALL options and their defaults
     * @returns {{}}  an key-value object for default options
     * @abstract
     */
    static get defaultOptions() {
        console.error('get defaultOptions() not implemented');

        return {
            pos: {x: 10, y: 10},
            // List of Events that are ONLY handled globally:
            globalExclusiveEvents: []
        };
    }

    /**
     * Defines the layers in SVG  for bg,main,fg,...
     * @return {[object]}
     * @abstract
     */
    static get layout() {
        console.error('get layout() not implemented');

        return [{name: 'main', pos: [0, 0]}];
    }

    // CONSTRUCTOR ============================================================


    /**
     * Inits the class and creates static DOM elements
     * @param {Object} d3parent  D3 selection of parent SVG DOM Element
     * @param {*} eventHandler a global event handler object or 'null' for local event handler
     * @param {Object} options initial options
     */
    constructor({d3parent, eventHandler = null, options = {}}) {
        this.id = Util.simpleUId({});

        this.parent = d3parent;

        // Set default options if not specified in constructor call
        const defaults = this.constructor.defaultOptions;
        this.options = {};
        const keys = new Set([...Object.keys(defaults), ...Object.keys(options)]);
        keys.forEach(key => this.options[key] = (key in options) ? options[key] : defaults[key]);

        // Create the base group element
        this.base = this._createBaseElement(this.parent);
        this.layers = this._createLayoutLayers(this.base);

        // If not further specified - create a local event handler bound to the bas element
        this.eventHandler = eventHandler ||
          new SimpleEventHandler(this.base.node());
        this._bindLocalEvents();

        // Object for storing internal states and variables
        this._states = {hidden: false};

        // Setup the static parts of the DOM tree
        this._init()
    }

    // CREATE BASIC ELEMENTS ============================================================

    /**
     * Creates the base element (<g>) that hosts the vis
     * @param {Element} parent the parent Element
     * @returns {*} D3 selection of the base element
     * @private
     */
    _createBaseElement(parent) {
        // Create a group element to host the visualization
        // <g> CSS Class is javascript class name in lowercase + ID
        return SVG.group(
          parent,
          this.constructor.name.toLowerCase() + ' ID' + this.id,
          this.options.pos || {x: 0, y: 0}
        );
    }

    _createLayoutLayers(base) {
        const res = {};
        for (const lE of this.constructor.layout) {
            res[lE.name] = SVG.group(base, lE.name, {x: lE.pos[0], y: lE.pos[1]});
        }

        return res;
    }


    /**
     * Should be overwritten to create the static DOM elements
     * @abstract
     * @return {*} ---
     */
    _init() {
        console.error(this.constructor.name + '._init() not implemented')
    }

    // DATA UPDATE & RENDER ============================================================

    // noinspection JSUnusedGlobalSymbols
    /**
     * Every time data has changed, update is called and
     * triggers wrangling and re-rendering
     * @param {Object} data data object
     * @return {*} ---
     */
    update(data) {
        this.data = data;
        if (this._states.hidden) return;
        this.renderData = this._wrangle(data);
        this._render(this.renderData);
    }


    /**
     * Data wrangling method -- implement in subclass
     * @param {Object} data data
     * @returns {*} ---
     * @abstract
     */
    _wrangle(data) {
        return data;
    }


    /**
     * Is responsible for mapping data to DOM elements
     * @param {Object} renderData pre-processed (wrangled) data
     * @abstract
     * @returns {*} ---
     */
    _render(renderData) {
        console.error(this.constructor.name + '._render() not implemented', renderData)
    }


    // UPDATE OPTIONS ============================================================

    // noinspection JSUnusedGlobalSymbols
    /**
     * Updates instance options
     * @param {Object} options only the options that should be updated
     * @param {Boolean} reRender if option change requires a re-rendering (default:false)
     * @returns {*} ---
     */
    updateOptions({options, reRender = false}) {
        Object.keys(options).forEach(k => this.options[k] = options[k]);
        if (reRender) this._render(this.renderData);
    }

    // BIND LOCAL EVENTS ============================================================

    // noinspection JSUnusedGlobalSymbols
    _bindEvent(eventHandler, name, func) {
        // Wrap in Set to handle 'undefinded' etc..
        const globalEvents = new Set(this.options.globalExclusiveEvents);
        if (!globalEvents.has(name)) {
            eventHandler.bind(name, func)
        }
    }

    /**
     * Could be used to bind local event handling
     * @abstract
     */
    _bindLocalEvents() {
        //console.warn('_bindLocalEvents() not implemented.')
    }

    hideView() {
        if (!this._states.hidden) {
            this.base.styles({
                'opacity': 0,
                'pointer-events': 'none'
            });
            this._states.hidden = true;
        }
    }

    unhideView() {
        if (this._states.hidden) {
            this.base.styles({
                'opacity': 1,
                'pointer-events': null
            });
            this._states.hidden = false;
            this.update(this.data);

        }
    }

    destroy() {
        this.base.remove();
    }

}

