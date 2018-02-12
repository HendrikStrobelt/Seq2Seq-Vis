/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 12/3/16.
 */
import {Util} from "../etc/Util";
import * as d3 from 'd3'
import {SimpleEventHandler} from "../etc/SimpleEventHandler";
import {SVG} from "../etc/SVGplus";
import {D3Sel, LooseObject} from "../etc/LocalTypes";


export abstract class VComponent {

    // STATIC FIELDS ============================================================

    /**
     * The static property that contains all class related events.
     * Should be overwritten and event strings have to be unique!!
     */

    static events: {} = {noEvent: 'VComponent_noEvent'};

    /**
     * set of ALL options and their defaults
     * Example:
     * {
        pos: {x: 10, y: 10},
        // List of Events that are ONLY handled globally:
        globalExclusiveEvents: []
    };
     *
     */
    abstract readonly defaultOptions;


    // /**
    //  * Defines the layers in SVG  for bg,main,fg,...
    //  */
    // protected abstract readonly layout: { name: string, pos: number[] }[] = [{name: 'main', pos: [0, 0]}];


    protected id: string;
    protected parent: any;
    protected options: LooseObject;
    protected base: D3Sel;
    protected layers: { main?: D3Sel, fg?: D3Sel, bg?: D3Sel, [key: string]: D3Sel };
    protected eventHandler: SimpleEventHandler;
    protected _current: LooseObject;
    protected data: any;
    protected renderData: any;


    // CONSTRUCTOR ============================================================


    /**
     * Simple constructor. Subclasses should call @superInit(options) as well.
     * see why here: https://stackoverflow.com/questions/43595943/why-are-derived-class-property-values-not-seen-in-the-base-class-constructor
     *
     * template:
     constructor(d3Parent: D3Sel, eventHandler?: SimpleEventHandler, options: {} = {}) {
        super(d3Parent, eventHandler);
        // -- access to subclass params:
        this.superInit(options);
     }
     *
     * @param {D3Sel} d3parent  D3 selection of parent SVG DOM Element
     * @param {SimpleEventHandler} eventHandler a global event handler object or 'null' for local event handler
     */
    protected constructor(d3parent: D3Sel, eventHandler?: SimpleEventHandler) {
        this.id = Util.simpleUId({});

        this.parent = d3parent;

        // If not further specified - create a local event handler bound to the bas element
        this.eventHandler = eventHandler ||
            new SimpleEventHandler(this.base.node());

        // Object for storing internal states and variables
        this._current = {hidden: false};

    }

    /**
     * Has to be called as last call in subclass constructor.
     * @param {{}} options
     * @param defaultLayers -- create the default <g> layers: bg -> main -> fg
     * @param runInit -- run this._init() or not
     */
    protected superInit(options: {} = {}, defaultLayers = true, runInit = true) {
        // Set default options if not specified in constructor call
        const defaults = this.defaultOptions;
        this.options = {};
        const keys = new Set([...Object.keys(defaults), ...Object.keys(options)]);
        keys.forEach(key => this.options[key] = (key in options) ? options[key] : defaults[key]);

        // Create the base group element
        this.base = SVG.group(this.parent,
            this.constructor.name.toLowerCase() + ' ID' + this.id,
            this.options.pos);

        // create default layers: background, main, foreground
        this.layers = {};
        if (defaultLayers) {
            // construction order is important !
            this.layers.bg = SVG.group(this.base, 'bg');
            this.layers.main = SVG.group(this.base, 'main');
            this.layers.fg = SVG.group(this.base, 'fg');
        }

        // bind events
        this._bindLocalEvents();

        if (runInit) this._init();
    }


    // CREATE BASIC ELEMENTS ============================================================

    // /**
    //  * Creates the base element (<g>) that hosts the vis
    //  * @param {Element} parent the parent Element
    //  * @returns {*} D3 selection of the base element
    //  * @private
    //  */
    // _createBaseElement(parent) {
    //     // Create a group element to host the visualization
    //     // <g> CSS Class is javascript class name in lowercase + ID
    //     return SVG.group(
    //         parent,
    //         this.constructor.name.toLowerCase() + ' ID' + this.id,
    //         this.options.pos || {x: 0, y: 0}
    //     );
    // }
    //
    // _createLayoutLayers(base) {
    //     const res = {};
    //     for (const lE of this.layout) {
    //         res[lE.name] = SVG.group(base, lE.name, {
    //             x: lE.pos[0],
    //             y: lE.pos[1]
    //         });
    //     }
    //
    //     return res;
    // }


    /**
     * Should be overwritten to create the static DOM elements
     * @abstract
     * @return {*} ---
     */
    protected abstract _init();

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
        if (this._current.hidden) return;
        this.renderData = this._wrangle(data);
        this._render(this.renderData);
    }


    /**
     * Data wrangling method -- implement in subclass. Returns this.renderData.
     * Simplest implementation: `return data;`
     * @param {Object} data data
     * @returns {*} ---
     * @abstract
     */
    abstract _wrangle(data): any;


    /**
     * Is responsible for mapping data to DOM elements
     * @param {Object} renderData pre-processed (wrangled) data
     * @abstract
     * @returns {*} ---
     */
    abstract _render(renderData): void;


    // UPDATE OPTIONS ============================================================
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
    _bindEvent(eventHandler, name, func) {
        // Wrap in Set to handle 'undefinded' etc..
        const globalEvents = new Set(this.options.globalExclusiveEvents);
        if (!globalEvents.has(name)) {
            eventHandler.bind(name, func)
        }
    }

    /**
     * Could be used to bind local event handling
     */
    _bindLocalEvents() {
        //console.warn('_bindLocalEvents() not implemented.')
    }

    hideView() {
        if (!this._current.hidden) {
            this.base.styles({
                'opacity': 0,
                'pointer-events': 'none'
            });
            this._current.hidden = true;
        }
    }

    unhideView() {
        if (this._current.hidden) {
            this.base.styles({
                'opacity': 1,
                'pointer-events': null
            });
            this._current.hidden = false;
            this.update(this.data);

        }
    }

    destroy() {
        this.base.remove();
    }

}

