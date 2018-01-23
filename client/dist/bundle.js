/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = d3;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = _;

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__etc_Util__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__etc_SimpleEventHandler__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__etc_SVGplus__ = __webpack_require__(5);
/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 12/3/16.
 */



class VComponent {
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
    constructor(d3parent, eventHandler) {
        /**
         * set of ALL options and their defaults
         */
        this.defaultOptions = {
            pos: { x: 10, y: 10 },
            // List of Events that are ONLY handled globally:
            globalExclusiveEvents: []
        };
        /**
         * Defines the layers in SVG  for bg,main,fg,...
         */
        this.layout = [{ name: 'main', pos: [0, 0] }];
        this.id = __WEBPACK_IMPORTED_MODULE_0__etc_Util__["a" /* Util */].simpleUId({});
        this.parent = d3parent;
        // If not further specified - create a local event handler bound to the bas element
        this.eventHandler = eventHandler ||
            new __WEBPACK_IMPORTED_MODULE_1__etc_SimpleEventHandler__["a" /* SimpleEventHandler */](this.base.node());
        // Object for storing internal states and variables
        this._current = { hidden: false };
    }
    /**
     * Has to be called as last call in subclass constructor.
     * @param {{}} options
     * @param runInit -- run this._init() or not
     */
    superInit(options = {}, runInit = true) {
        // Set default options if not specified in constructor call
        const defaults = this.defaultOptions;
        this.options = {};
        const keys = new Set([...Object.keys(defaults), ...Object.keys(options)]);
        keys.forEach(key => this.options[key] = (key in options) ? options[key] : defaults[key]);
        // Create the base group element
        this.base = this._createBaseElement(this.parent);
        this.layers = this._createLayoutLayers(this.base);
        // bind events
        this._bindLocalEvents();
        if (runInit)
            this._init();
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
        return __WEBPACK_IMPORTED_MODULE_2__etc_SVGplus__["a" /* SVG */].group(parent, this.constructor.name.toLowerCase() + ' ID' + this.id, this.options.pos || { x: 0, y: 0 });
    }
    _createLayoutLayers(base) {
        const res = {};
        for (const lE of this.layout) {
            res[lE.name] = __WEBPACK_IMPORTED_MODULE_2__etc_SVGplus__["a" /* SVG */].group(base, lE.name, { x: lE.pos[0], y: lE.pos[1] });
        }
        return res;
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
        if (this._current.hidden)
            return;
        this.renderData = this._wrangle(data);
        this._render(this.renderData);
    }
    // UPDATE OPTIONS ============================================================
    /**
     * Updates instance options
     * @param {Object} options only the options that should be updated
     * @param {Boolean} reRender if option change requires a re-rendering (default:false)
     * @returns {*} ---
     */
    updateOptions({ options, reRender = false }) {
        Object.keys(options).forEach(k => this.options[k] = options[k]);
        if (reRender)
            this._render(this.renderData);
    }
    // BIND LOCAL EVENTS ============================================================
    _bindEvent(eventHandler, name, func) {
        // Wrap in Set to handle 'undefinded' etc..
        const globalEvents = new Set(this.options.globalExclusiveEvents);
        if (!globalEvents.has(name)) {
            eventHandler.bind(name, func);
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
/* harmony export (immutable) */ __webpack_exports__["a"] = VComponent;

// STATIC FIELDS ============================================================
/**
 * The static property that contains all class related events.
 * Should be overwritten and event strings have to be unique!!
 */
VComponent.events = { noEvent: 'VComponent_noEvent' };


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var powergraph = __webpack_require__(11);
var linklengths_1 = __webpack_require__(7);
var descent_1 = __webpack_require__(8);
var rectangle_1 = __webpack_require__(4);
var shortestpaths_1 = __webpack_require__(6);
var geom_1 = __webpack_require__(14);
var handledisconnected_1 = __webpack_require__(15);
var EventType;
(function (EventType) {
    EventType[EventType["start"] = 0] = "start";
    EventType[EventType["tick"] = 1] = "tick";
    EventType[EventType["end"] = 2] = "end";
})(EventType = exports.EventType || (exports.EventType = {}));
;
function isGroup(g) {
    return typeof g.leaves !== 'undefined' || typeof g.groups !== 'undefined';
}
var Layout = (function () {
    function Layout() {
        var _this = this;
        this._canvasSize = [1, 1];
        this._linkDistance = 20;
        this._defaultNodeSize = 10;
        this._linkLengthCalculator = null;
        this._linkType = null;
        this._avoidOverlaps = false;
        this._handleDisconnected = true;
        this._running = false;
        this._nodes = [];
        this._groups = [];
        this._rootGroup = null;
        this._links = [];
        this._constraints = [];
        this._distanceMatrix = null;
        this._descent = null;
        this._directedLinkConstraints = null;
        this._threshold = 0.01;
        this._visibilityGraph = null;
        this._groupCompactness = 1e-6;
        this.event = null;
        this.linkAccessor = {
            getSourceIndex: Layout.getSourceIndex,
            getTargetIndex: Layout.getTargetIndex,
            setLength: Layout.setLinkLength,
            getType: function (l) { return typeof _this._linkType === "function" ? _this._linkType(l) : 0; }
        };
    }
    Layout.prototype.on = function (e, listener) {
        if (!this.event)
            this.event = {};
        if (typeof e === 'string') {
            this.event[EventType[e]] = listener;
        }
        else {
            this.event[e] = listener;
        }
        return this;
    };
    Layout.prototype.trigger = function (e) {
        if (this.event && typeof this.event[e.type] !== 'undefined') {
            this.event[e.type](e);
        }
    };
    Layout.prototype.kick = function () {
        while (!this.tick())
            ;
    };
    Layout.prototype.tick = function () {
        if (this._alpha < this._threshold) {
            this._running = false;
            this.trigger({ type: EventType.end, alpha: this._alpha = 0, stress: this._lastStress });
            return true;
        }
        var n = this._nodes.length, m = this._links.length;
        var o, i;
        this._descent.locks.clear();
        for (i = 0; i < n; ++i) {
            o = this._nodes[i];
            if (o.fixed) {
                if (typeof o.px === 'undefined' || typeof o.py === 'undefined') {
                    o.px = o.x;
                    o.py = o.y;
                }
                var p = [o.px, o.py];
                this._descent.locks.add(i, p);
            }
        }
        var s1 = this._descent.rungeKutta();
        if (s1 === 0) {
            this._alpha = 0;
        }
        else if (typeof this._lastStress !== 'undefined') {
            this._alpha = s1;
        }
        this._lastStress = s1;
        this.updateNodePositions();
        this.trigger({ type: EventType.tick, alpha: this._alpha, stress: this._lastStress });
        return false;
    };
    Layout.prototype.updateNodePositions = function () {
        var x = this._descent.x[0], y = this._descent.x[1];
        var o, i = this._nodes.length;
        while (i--) {
            o = this._nodes[i];
            o.x = x[i];
            o.y = y[i];
        }
    };
    Layout.prototype.nodes = function (v) {
        if (!v) {
            if (this._nodes.length === 0 && this._links.length > 0) {
                var n = 0;
                this._links.forEach(function (l) {
                    n = Math.max(n, l.source, l.target);
                });
                this._nodes = new Array(++n);
                for (var i = 0; i < n; ++i) {
                    this._nodes[i] = {};
                }
            }
            return this._nodes;
        }
        this._nodes = v;
        return this;
    };
    Layout.prototype.groups = function (x) {
        var _this = this;
        if (!x)
            return this._groups;
        this._groups = x;
        this._rootGroup = {};
        this._groups.forEach(function (g) {
            if (typeof g.padding === "undefined")
                g.padding = 1;
            if (typeof g.leaves !== "undefined") {
                g.leaves.forEach(function (v, i) {
                    if (typeof v === 'number')
                        (g.leaves[i] = _this._nodes[v]).parent = g;
                });
            }
            if (typeof g.groups !== "undefined") {
                g.groups.forEach(function (gi, i) {
                    if (typeof gi === 'number')
                        (g.groups[i] = _this._groups[gi]).parent = g;
                });
            }
        });
        this._rootGroup.leaves = this._nodes.filter(function (v) { return typeof v.parent === 'undefined'; });
        this._rootGroup.groups = this._groups.filter(function (g) { return typeof g.parent === 'undefined'; });
        return this;
    };
    Layout.prototype.powerGraphGroups = function (f) {
        var g = powergraph.getGroups(this._nodes, this._links, this.linkAccessor, this._rootGroup);
        this.groups(g.groups);
        f(g);
        return this;
    };
    Layout.prototype.avoidOverlaps = function (v) {
        if (!arguments.length)
            return this._avoidOverlaps;
        this._avoidOverlaps = v;
        return this;
    };
    Layout.prototype.handleDisconnected = function (v) {
        if (!arguments.length)
            return this._handleDisconnected;
        this._handleDisconnected = v;
        return this;
    };
    Layout.prototype.flowLayout = function (axis, minSeparation) {
        if (!arguments.length)
            axis = 'y';
        this._directedLinkConstraints = {
            axis: axis,
            getMinSeparation: typeof minSeparation === 'number' ? function () { return minSeparation; } : minSeparation
        };
        return this;
    };
    Layout.prototype.links = function (x) {
        if (!arguments.length)
            return this._links;
        this._links = x;
        return this;
    };
    Layout.prototype.constraints = function (c) {
        if (!arguments.length)
            return this._constraints;
        this._constraints = c;
        return this;
    };
    Layout.prototype.distanceMatrix = function (d) {
        if (!arguments.length)
            return this._distanceMatrix;
        this._distanceMatrix = d;
        return this;
    };
    Layout.prototype.size = function (x) {
        if (!x)
            return this._canvasSize;
        this._canvasSize = x;
        return this;
    };
    Layout.prototype.defaultNodeSize = function (x) {
        if (!x)
            return this._defaultNodeSize;
        this._defaultNodeSize = x;
        return this;
    };
    Layout.prototype.groupCompactness = function (x) {
        if (!x)
            return this._groupCompactness;
        this._groupCompactness = x;
        return this;
    };
    Layout.prototype.linkDistance = function (x) {
        if (!x) {
            return this._linkDistance;
        }
        this._linkDistance = typeof x === "function" ? x : +x;
        this._linkLengthCalculator = null;
        return this;
    };
    Layout.prototype.linkType = function (f) {
        this._linkType = f;
        return this;
    };
    Layout.prototype.convergenceThreshold = function (x) {
        if (!x)
            return this._threshold;
        this._threshold = typeof x === "function" ? x : +x;
        return this;
    };
    Layout.prototype.alpha = function (x) {
        if (!arguments.length)
            return this._alpha;
        else {
            x = +x;
            if (this._alpha) {
                if (x > 0)
                    this._alpha = x;
                else
                    this._alpha = 0;
            }
            else if (x > 0) {
                if (!this._running) {
                    this._running = true;
                    this.trigger({ type: EventType.start, alpha: this._alpha = x });
                    this.kick();
                }
            }
            return this;
        }
    };
    Layout.prototype.getLinkLength = function (link) {
        return typeof this._linkDistance === "function" ? +(this._linkDistance(link)) : this._linkDistance;
    };
    Layout.setLinkLength = function (link, length) {
        link.length = length;
    };
    Layout.prototype.getLinkType = function (link) {
        return typeof this._linkType === "function" ? this._linkType(link) : 0;
    };
    Layout.prototype.symmetricDiffLinkLengths = function (idealLength, w) {
        var _this = this;
        if (w === void 0) { w = 1; }
        this.linkDistance(function (l) { return idealLength * l.length; });
        this._linkLengthCalculator = function () { return linklengths_1.symmetricDiffLinkLengths(_this._links, _this.linkAccessor, w); };
        return this;
    };
    Layout.prototype.jaccardLinkLengths = function (idealLength, w) {
        var _this = this;
        if (w === void 0) { w = 1; }
        this.linkDistance(function (l) { return idealLength * l.length; });
        this._linkLengthCalculator = function () { return linklengths_1.jaccardLinkLengths(_this._links, _this.linkAccessor, w); };
        return this;
    };
    Layout.prototype.start = function (initialUnconstrainedIterations, initialUserConstraintIterations, initialAllConstraintsIterations, gridSnapIterations, keepRunning) {
        var _this = this;
        if (initialUnconstrainedIterations === void 0) { initialUnconstrainedIterations = 0; }
        if (initialUserConstraintIterations === void 0) { initialUserConstraintIterations = 0; }
        if (initialAllConstraintsIterations === void 0) { initialAllConstraintsIterations = 0; }
        if (gridSnapIterations === void 0) { gridSnapIterations = 0; }
        if (keepRunning === void 0) { keepRunning = true; }
        var i, j, n = this.nodes().length, N = n + 2 * this._groups.length, m = this._links.length, w = this._canvasSize[0], h = this._canvasSize[1];
        var x = new Array(N), y = new Array(N);
        var G = null;
        var ao = this._avoidOverlaps;
        this._nodes.forEach(function (v, i) {
            v.index = i;
            if (typeof v.x === 'undefined') {
                v.x = w / 2, v.y = h / 2;
            }
            x[i] = v.x, y[i] = v.y;
        });
        if (this._linkLengthCalculator)
            this._linkLengthCalculator();
        var distances;
        if (this._distanceMatrix) {
            distances = this._distanceMatrix;
        }
        else {
            distances = (new shortestpaths_1.Calculator(N, this._links, Layout.getSourceIndex, Layout.getTargetIndex, function (l) { return _this.getLinkLength(l); })).DistanceMatrix();
            G = descent_1.Descent.createSquareMatrix(N, function () { return 2; });
            this._links.forEach(function (l) {
                if (typeof l.source == "number")
                    l.source = _this._nodes[l.source];
                if (typeof l.target == "number")
                    l.target = _this._nodes[l.target];
            });
            this._links.forEach(function (e) {
                var u = Layout.getSourceIndex(e), v = Layout.getTargetIndex(e);
                G[u][v] = G[v][u] = e.weight || 1;
            });
        }
        var D = descent_1.Descent.createSquareMatrix(N, function (i, j) {
            return distances[i][j];
        });
        if (this._rootGroup && typeof this._rootGroup.groups !== 'undefined') {
            var i = n;
            var addAttraction = function (i, j, strength, idealDistance) {
                G[i][j] = G[j][i] = strength;
                D[i][j] = D[j][i] = idealDistance;
            };
            this._groups.forEach(function (g) {
                addAttraction(i, i + 1, _this._groupCompactness, 0.1);
                x[i] = 0, y[i++] = 0;
                x[i] = 0, y[i++] = 0;
            });
        }
        else
            this._rootGroup = { leaves: this._nodes, groups: [] };
        var curConstraints = this._constraints || [];
        if (this._directedLinkConstraints) {
            this.linkAccessor.getMinSeparation = this._directedLinkConstraints.getMinSeparation;
            curConstraints = curConstraints.concat(linklengths_1.generateDirectedEdgeConstraints(n, this._links, this._directedLinkConstraints.axis, (this.linkAccessor)));
        }
        this.avoidOverlaps(false);
        this._descent = new descent_1.Descent([x, y], D);
        this._descent.locks.clear();
        for (var i = 0; i < n; ++i) {
            var o = this._nodes[i];
            if (o.fixed) {
                o.px = o.x;
                o.py = o.y;
                var p = [o.x, o.y];
                this._descent.locks.add(i, p);
            }
        }
        this._descent.threshold = this._threshold;
        this.initialLayout(initialUnconstrainedIterations, x, y);
        if (curConstraints.length > 0)
            this._descent.project = new rectangle_1.Projection(this._nodes, this._groups, this._rootGroup, curConstraints).projectFunctions();
        this._descent.run(initialUserConstraintIterations);
        this.separateOverlappingComponents(w, h);
        this.avoidOverlaps(ao);
        if (ao) {
            this._nodes.forEach(function (v, i) { v.x = x[i], v.y = y[i]; });
            this._descent.project = new rectangle_1.Projection(this._nodes, this._groups, this._rootGroup, curConstraints, true).projectFunctions();
            this._nodes.forEach(function (v, i) { x[i] = v.x, y[i] = v.y; });
        }
        this._descent.G = G;
        this._descent.run(initialAllConstraintsIterations);
        if (gridSnapIterations) {
            this._descent.snapStrength = 1000;
            this._descent.snapGridSize = this._nodes[0].width;
            this._descent.numGridSnapNodes = n;
            this._descent.scaleSnapByMaxH = n != N;
            var G0 = descent_1.Descent.createSquareMatrix(N, function (i, j) {
                if (i >= n || j >= n)
                    return G[i][j];
                return 0;
            });
            this._descent.G = G0;
            this._descent.run(gridSnapIterations);
        }
        this.updateNodePositions();
        this.separateOverlappingComponents(w, h);
        return keepRunning ? this.resume() : this;
    };
    Layout.prototype.initialLayout = function (iterations, x, y) {
        if (this._groups.length > 0 && iterations > 0) {
            var n = this._nodes.length;
            var edges = this._links.map(function (e) { return ({ source: e.source.index, target: e.target.index }); });
            var vs = this._nodes.map(function (v) { return ({ index: v.index }); });
            this._groups.forEach(function (g, i) {
                vs.push({ index: g.index = n + i });
            });
            this._groups.forEach(function (g, i) {
                if (typeof g.leaves !== 'undefined')
                    g.leaves.forEach(function (v) { return edges.push({ source: g.index, target: v.index }); });
                if (typeof g.groups !== 'undefined')
                    g.groups.forEach(function (gg) { return edges.push({ source: g.index, target: gg.index }); });
            });
            new Layout()
                .size(this.size())
                .nodes(vs)
                .links(edges)
                .avoidOverlaps(false)
                .linkDistance(this.linkDistance())
                .symmetricDiffLinkLengths(5)
                .convergenceThreshold(1e-4)
                .start(iterations, 0, 0, 0, false);
            this._nodes.forEach(function (v) {
                x[v.index] = vs[v.index].x;
                y[v.index] = vs[v.index].y;
            });
        }
        else {
            this._descent.run(iterations);
        }
    };
    Layout.prototype.separateOverlappingComponents = function (width, height) {
        var _this = this;
        if (!this._distanceMatrix && this._handleDisconnected) {
            var x_1 = this._descent.x[0], y_1 = this._descent.x[1];
            this._nodes.forEach(function (v, i) { v.x = x_1[i], v.y = y_1[i]; });
            var graphs = handledisconnected_1.separateGraphs(this._nodes, this._links);
            handledisconnected_1.applyPacking(graphs, width, height, this._defaultNodeSize);
            this._nodes.forEach(function (v, i) {
                _this._descent.x[0][i] = v.x, _this._descent.x[1][i] = v.y;
                if (v.bounds) {
                    v.bounds.setXCentre(v.x);
                    v.bounds.setYCentre(v.y);
                }
            });
        }
    };
    Layout.prototype.resume = function () {
        return this.alpha(0.1);
    };
    Layout.prototype.stop = function () {
        return this.alpha(0);
    };
    Layout.prototype.prepareEdgeRouting = function (nodeMargin) {
        if (nodeMargin === void 0) { nodeMargin = 0; }
        this._visibilityGraph = new geom_1.TangentVisibilityGraph(this._nodes.map(function (v) {
            return v.bounds.inflate(-nodeMargin).vertices();
        }));
    };
    Layout.prototype.routeEdge = function (edge, draw) {
        var lineData = [];
        var vg2 = new geom_1.TangentVisibilityGraph(this._visibilityGraph.P, { V: this._visibilityGraph.V, E: this._visibilityGraph.E }), port1 = { x: edge.source.x, y: edge.source.y }, port2 = { x: edge.target.x, y: edge.target.y }, start = vg2.addPoint(port1, edge.source.index), end = vg2.addPoint(port2, edge.target.index);
        vg2.addEdgeIfVisible(port1, port2, edge.source.index, edge.target.index);
        if (typeof draw !== 'undefined') {
            draw(vg2);
        }
        var sourceInd = function (e) { return e.source.id; }, targetInd = function (e) { return e.target.id; }, length = function (e) { return e.length(); }, spCalc = new shortestpaths_1.Calculator(vg2.V.length, vg2.E, sourceInd, targetInd, length), shortestPath = spCalc.PathFromNodeToNode(start.id, end.id);
        if (shortestPath.length === 1 || shortestPath.length === vg2.V.length) {
            var route = rectangle_1.makeEdgeBetween(edge.source.innerBounds, edge.target.innerBounds, 5);
            lineData = [route.sourceIntersection, route.arrowStart];
        }
        else {
            var n = shortestPath.length - 2, p = vg2.V[shortestPath[n]].p, q = vg2.V[shortestPath[0]].p, lineData = [edge.source.innerBounds.rayIntersection(p.x, p.y)];
            for (var i = n; i >= 0; --i)
                lineData.push(vg2.V[shortestPath[i]].p);
            lineData.push(rectangle_1.makeEdgeTo(q, edge.target.innerBounds, 5));
        }
        return lineData;
    };
    Layout.getSourceIndex = function (e) {
        return typeof e.source === 'number' ? e.source : e.source.index;
    };
    Layout.getTargetIndex = function (e) {
        return typeof e.target === 'number' ? e.target : e.target.index;
    };
    Layout.linkId = function (e) {
        return Layout.getSourceIndex(e) + "-" + Layout.getTargetIndex(e);
    };
    Layout.dragStart = function (d) {
        if (isGroup(d)) {
            Layout.storeOffset(d, Layout.dragOrigin(d));
        }
        else {
            Layout.stopNode(d);
            d.fixed |= 2;
        }
    };
    Layout.stopNode = function (v) {
        v.px = v.x;
        v.py = v.y;
    };
    Layout.storeOffset = function (d, origin) {
        if (typeof d.leaves !== 'undefined') {
            d.leaves.forEach(function (v) {
                v.fixed |= 2;
                Layout.stopNode(v);
                v._dragGroupOffsetX = v.x - origin.x;
                v._dragGroupOffsetY = v.y - origin.y;
            });
        }
        if (typeof d.groups !== 'undefined') {
            d.groups.forEach(function (g) { return Layout.storeOffset(g, origin); });
        }
    };
    Layout.dragOrigin = function (d) {
        if (isGroup(d)) {
            return {
                x: d.bounds.cx(),
                y: d.bounds.cy()
            };
        }
        else {
            return d;
        }
    };
    Layout.drag = function (d, position) {
        if (isGroup(d)) {
            if (typeof d.leaves !== 'undefined') {
                d.leaves.forEach(function (v) {
                    d.bounds.setXCentre(position.x);
                    d.bounds.setYCentre(position.y);
                    v.px = v._dragGroupOffsetX + position.x;
                    v.py = v._dragGroupOffsetY + position.y;
                });
            }
            if (typeof d.groups !== 'undefined') {
                d.groups.forEach(function (g) { return Layout.drag(g, position); });
            }
        }
        else {
            d.px = position.x;
            d.py = position.y;
        }
    };
    Layout.dragEnd = function (d) {
        if (isGroup(d)) {
            if (typeof d.leaves !== 'undefined') {
                d.leaves.forEach(function (v) {
                    Layout.dragEnd(v);
                    delete v._dragGroupOffsetX;
                    delete v._dragGroupOffsetY;
                });
            }
            if (typeof d.groups !== 'undefined') {
                d.groups.forEach(Layout.dragEnd);
            }
        }
        else {
            d.fixed &= ~6;
        }
    };
    Layout.mouseOver = function (d) {
        d.fixed |= 4;
        d.px = d.x, d.py = d.y;
    };
    Layout.mouseOut = function (d) {
        d.fixed &= ~4;
    };
    return Layout;
}());
exports.Layout = Layout;
//# sourceMappingURL=layout.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var vpsc_1 = __webpack_require__(9);
var rbtree_1 = __webpack_require__(12);
function computeGroupBounds(g) {
    g.bounds = typeof g.leaves !== "undefined" ?
        g.leaves.reduce(function (r, c) { return c.bounds.union(r); }, Rectangle.empty()) :
        Rectangle.empty();
    if (typeof g.groups !== "undefined")
        g.bounds = g.groups.reduce(function (r, c) { return computeGroupBounds(c).union(r); }, g.bounds);
    g.bounds = g.bounds.inflate(g.padding);
    return g.bounds;
}
exports.computeGroupBounds = computeGroupBounds;
var Rectangle = (function () {
    function Rectangle(x, X, y, Y) {
        this.x = x;
        this.X = X;
        this.y = y;
        this.Y = Y;
    }
    Rectangle.empty = function () { return new Rectangle(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY); };
    Rectangle.prototype.cx = function () { return (this.x + this.X) / 2; };
    Rectangle.prototype.cy = function () { return (this.y + this.Y) / 2; };
    Rectangle.prototype.overlapX = function (r) {
        var ux = this.cx(), vx = r.cx();
        if (ux <= vx && r.x < this.X)
            return this.X - r.x;
        if (vx <= ux && this.x < r.X)
            return r.X - this.x;
        return 0;
    };
    Rectangle.prototype.overlapY = function (r) {
        var uy = this.cy(), vy = r.cy();
        if (uy <= vy && r.y < this.Y)
            return this.Y - r.y;
        if (vy <= uy && this.y < r.Y)
            return r.Y - this.y;
        return 0;
    };
    Rectangle.prototype.setXCentre = function (cx) {
        var dx = cx - this.cx();
        this.x += dx;
        this.X += dx;
    };
    Rectangle.prototype.setYCentre = function (cy) {
        var dy = cy - this.cy();
        this.y += dy;
        this.Y += dy;
    };
    Rectangle.prototype.width = function () {
        return this.X - this.x;
    };
    Rectangle.prototype.height = function () {
        return this.Y - this.y;
    };
    Rectangle.prototype.union = function (r) {
        return new Rectangle(Math.min(this.x, r.x), Math.max(this.X, r.X), Math.min(this.y, r.y), Math.max(this.Y, r.Y));
    };
    Rectangle.prototype.lineIntersections = function (x1, y1, x2, y2) {
        var sides = [[this.x, this.y, this.X, this.y],
            [this.X, this.y, this.X, this.Y],
            [this.X, this.Y, this.x, this.Y],
            [this.x, this.Y, this.x, this.y]];
        var intersections = [];
        for (var i = 0; i < 4; ++i) {
            var r = Rectangle.lineIntersection(x1, y1, x2, y2, sides[i][0], sides[i][1], sides[i][2], sides[i][3]);
            if (r !== null)
                intersections.push({ x: r.x, y: r.y });
        }
        return intersections;
    };
    Rectangle.prototype.rayIntersection = function (x2, y2) {
        var ints = this.lineIntersections(this.cx(), this.cy(), x2, y2);
        return ints.length > 0 ? ints[0] : null;
    };
    Rectangle.prototype.vertices = function () {
        return [
            { x: this.x, y: this.y },
            { x: this.X, y: this.y },
            { x: this.X, y: this.Y },
            { x: this.x, y: this.Y },
            { x: this.x, y: this.y }
        ];
    };
    Rectangle.lineIntersection = function (x1, y1, x2, y2, x3, y3, x4, y4) {
        var dx12 = x2 - x1, dx34 = x4 - x3, dy12 = y2 - y1, dy34 = y4 - y3, denominator = dy34 * dx12 - dx34 * dy12;
        if (denominator == 0)
            return null;
        var dx31 = x1 - x3, dy31 = y1 - y3, numa = dx34 * dy31 - dy34 * dx31, a = numa / denominator, numb = dx12 * dy31 - dy12 * dx31, b = numb / denominator;
        if (a >= 0 && a <= 1 && b >= 0 && b <= 1) {
            return {
                x: x1 + a * dx12,
                y: y1 + a * dy12
            };
        }
        return null;
    };
    Rectangle.prototype.inflate = function (pad) {
        return new Rectangle(this.x - pad, this.X + pad, this.y - pad, this.Y + pad);
    };
    return Rectangle;
}());
exports.Rectangle = Rectangle;
function makeEdgeBetween(source, target, ah) {
    var si = source.rayIntersection(target.cx(), target.cy()) || { x: source.cx(), y: source.cy() }, ti = target.rayIntersection(source.cx(), source.cy()) || { x: target.cx(), y: target.cy() }, dx = ti.x - si.x, dy = ti.y - si.y, l = Math.sqrt(dx * dx + dy * dy), al = l - ah;
    return {
        sourceIntersection: si,
        targetIntersection: ti,
        arrowStart: { x: si.x + al * dx / l, y: si.y + al * dy / l }
    };
}
exports.makeEdgeBetween = makeEdgeBetween;
function makeEdgeTo(s, target, ah) {
    var ti = target.rayIntersection(s.x, s.y);
    if (!ti)
        ti = { x: target.cx(), y: target.cy() };
    var dx = ti.x - s.x, dy = ti.y - s.y, l = Math.sqrt(dx * dx + dy * dy);
    return { x: ti.x - ah * dx / l, y: ti.y - ah * dy / l };
}
exports.makeEdgeTo = makeEdgeTo;
var Node = (function () {
    function Node(v, r, pos) {
        this.v = v;
        this.r = r;
        this.pos = pos;
        this.prev = makeRBTree();
        this.next = makeRBTree();
    }
    return Node;
}());
var Event = (function () {
    function Event(isOpen, v, pos) {
        this.isOpen = isOpen;
        this.v = v;
        this.pos = pos;
    }
    return Event;
}());
function compareEvents(a, b) {
    if (a.pos > b.pos) {
        return 1;
    }
    if (a.pos < b.pos) {
        return -1;
    }
    if (a.isOpen) {
        return -1;
    }
    if (b.isOpen) {
        return 1;
    }
    return 0;
}
function makeRBTree() {
    return new rbtree_1.RBTree(function (a, b) { return a.pos - b.pos; });
}
var xRect = {
    getCentre: function (r) { return r.cx(); },
    getOpen: function (r) { return r.y; },
    getClose: function (r) { return r.Y; },
    getSize: function (r) { return r.width(); },
    makeRect: function (open, close, center, size) { return new Rectangle(center - size / 2, center + size / 2, open, close); },
    findNeighbours: findXNeighbours
};
var yRect = {
    getCentre: function (r) { return r.cy(); },
    getOpen: function (r) { return r.x; },
    getClose: function (r) { return r.X; },
    getSize: function (r) { return r.height(); },
    makeRect: function (open, close, center, size) { return new Rectangle(open, close, center - size / 2, center + size / 2); },
    findNeighbours: findYNeighbours
};
function generateGroupConstraints(root, f, minSep, isContained) {
    if (isContained === void 0) { isContained = false; }
    var padding = root.padding, gn = typeof root.groups !== 'undefined' ? root.groups.length : 0, ln = typeof root.leaves !== 'undefined' ? root.leaves.length : 0, childConstraints = !gn ? []
        : root.groups.reduce(function (ccs, g) { return ccs.concat(generateGroupConstraints(g, f, minSep, true)); }, []), n = (isContained ? 2 : 0) + ln + gn, vs = new Array(n), rs = new Array(n), i = 0, add = function (r, v) { rs[i] = r; vs[i++] = v; };
    if (isContained) {
        var b = root.bounds, c = f.getCentre(b), s = f.getSize(b) / 2, open = f.getOpen(b), close = f.getClose(b), min = c - s + padding / 2, max = c + s - padding / 2;
        root.minVar.desiredPosition = min;
        add(f.makeRect(open, close, min, padding), root.minVar);
        root.maxVar.desiredPosition = max;
        add(f.makeRect(open, close, max, padding), root.maxVar);
    }
    if (ln)
        root.leaves.forEach(function (l) { return add(l.bounds, l.variable); });
    if (gn)
        root.groups.forEach(function (g) {
            var b = g.bounds;
            add(f.makeRect(f.getOpen(b), f.getClose(b), f.getCentre(b), f.getSize(b)), g.minVar);
        });
    var cs = generateConstraints(rs, vs, f, minSep);
    if (gn) {
        vs.forEach(function (v) { v.cOut = [], v.cIn = []; });
        cs.forEach(function (c) { c.left.cOut.push(c), c.right.cIn.push(c); });
        root.groups.forEach(function (g) {
            var gapAdjustment = (g.padding - f.getSize(g.bounds)) / 2;
            g.minVar.cIn.forEach(function (c) { return c.gap += gapAdjustment; });
            g.minVar.cOut.forEach(function (c) { c.left = g.maxVar; c.gap += gapAdjustment; });
        });
    }
    return childConstraints.concat(cs);
}
function generateConstraints(rs, vars, rect, minSep) {
    var i, n = rs.length;
    var N = 2 * n;
    console.assert(vars.length >= n);
    var events = new Array(N);
    for (i = 0; i < n; ++i) {
        var r = rs[i];
        var v = new Node(vars[i], r, rect.getCentre(r));
        events[i] = new Event(true, v, rect.getOpen(r));
        events[i + n] = new Event(false, v, rect.getClose(r));
    }
    events.sort(compareEvents);
    var cs = new Array();
    var scanline = makeRBTree();
    for (i = 0; i < N; ++i) {
        var e = events[i];
        var v = e.v;
        if (e.isOpen) {
            scanline.insert(v);
            rect.findNeighbours(v, scanline);
        }
        else {
            scanline.remove(v);
            var makeConstraint = function (l, r) {
                var sep = (rect.getSize(l.r) + rect.getSize(r.r)) / 2 + minSep;
                cs.push(new vpsc_1.Constraint(l.v, r.v, sep));
            };
            var visitNeighbours = function (forward, reverse, mkcon) {
                var u, it = v[forward].iterator();
                while ((u = it[forward]()) !== null) {
                    mkcon(u, v);
                    u[reverse].remove(v);
                }
            };
            visitNeighbours("prev", "next", function (u, v) { return makeConstraint(u, v); });
            visitNeighbours("next", "prev", function (u, v) { return makeConstraint(v, u); });
        }
    }
    console.assert(scanline.size === 0);
    return cs;
}
function findXNeighbours(v, scanline) {
    var f = function (forward, reverse) {
        var it = scanline.findIter(v);
        var u;
        while ((u = it[forward]()) !== null) {
            var uovervX = u.r.overlapX(v.r);
            if (uovervX <= 0 || uovervX <= u.r.overlapY(v.r)) {
                v[forward].insert(u);
                u[reverse].insert(v);
            }
            if (uovervX <= 0) {
                break;
            }
        }
    };
    f("next", "prev");
    f("prev", "next");
}
function findYNeighbours(v, scanline) {
    var f = function (forward, reverse) {
        var u = scanline.findIter(v)[forward]();
        if (u !== null && u.r.overlapX(v.r) > 0) {
            v[forward].insert(u);
            u[reverse].insert(v);
        }
    };
    f("next", "prev");
    f("prev", "next");
}
function generateXConstraints(rs, vars) {
    return generateConstraints(rs, vars, xRect, 1e-6);
}
exports.generateXConstraints = generateXConstraints;
function generateYConstraints(rs, vars) {
    return generateConstraints(rs, vars, yRect, 1e-6);
}
exports.generateYConstraints = generateYConstraints;
function generateXGroupConstraints(root) {
    return generateGroupConstraints(root, xRect, 1e-6);
}
exports.generateXGroupConstraints = generateXGroupConstraints;
function generateYGroupConstraints(root) {
    return generateGroupConstraints(root, yRect, 1e-6);
}
exports.generateYGroupConstraints = generateYGroupConstraints;
function removeOverlaps(rs) {
    var vs = rs.map(function (r) { return new vpsc_1.Variable(r.cx()); });
    var cs = generateXConstraints(rs, vs);
    var solver = new vpsc_1.Solver(vs, cs);
    solver.solve();
    vs.forEach(function (v, i) { return rs[i].setXCentre(v.position()); });
    vs = rs.map(function (r) { return new vpsc_1.Variable(r.cy()); });
    cs = generateYConstraints(rs, vs);
    solver = new vpsc_1.Solver(vs, cs);
    solver.solve();
    vs.forEach(function (v, i) { return rs[i].setYCentre(v.position()); });
}
exports.removeOverlaps = removeOverlaps;
var IndexedVariable = (function (_super) {
    __extends(IndexedVariable, _super);
    function IndexedVariable(index, w) {
        var _this = _super.call(this, 0, w) || this;
        _this.index = index;
        return _this;
    }
    return IndexedVariable;
}(vpsc_1.Variable));
exports.IndexedVariable = IndexedVariable;
var Projection = (function () {
    function Projection(nodes, groups, rootGroup, constraints, avoidOverlaps) {
        if (rootGroup === void 0) { rootGroup = null; }
        if (constraints === void 0) { constraints = null; }
        if (avoidOverlaps === void 0) { avoidOverlaps = false; }
        var _this = this;
        this.nodes = nodes;
        this.groups = groups;
        this.rootGroup = rootGroup;
        this.avoidOverlaps = avoidOverlaps;
        this.variables = nodes.map(function (v, i) {
            return v.variable = new IndexedVariable(i, 1);
        });
        if (constraints)
            this.createConstraints(constraints);
        if (avoidOverlaps && rootGroup && typeof rootGroup.groups !== 'undefined') {
            nodes.forEach(function (v) {
                if (!v.width || !v.height) {
                    v.bounds = new Rectangle(v.x, v.x, v.y, v.y);
                    return;
                }
                var w2 = v.width / 2, h2 = v.height / 2;
                v.bounds = new Rectangle(v.x - w2, v.x + w2, v.y - h2, v.y + h2);
            });
            computeGroupBounds(rootGroup);
            var i = nodes.length;
            groups.forEach(function (g) {
                _this.variables[i] = g.minVar = new IndexedVariable(i++, typeof g.stiffness !== "undefined" ? g.stiffness : 0.01);
                _this.variables[i] = g.maxVar = new IndexedVariable(i++, typeof g.stiffness !== "undefined" ? g.stiffness : 0.01);
            });
        }
    }
    Projection.prototype.createSeparation = function (c) {
        return new vpsc_1.Constraint(this.nodes[c.left].variable, this.nodes[c.right].variable, c.gap, typeof c.equality !== "undefined" ? c.equality : false);
    };
    Projection.prototype.makeFeasible = function (c) {
        var _this = this;
        if (!this.avoidOverlaps)
            return;
        var axis = 'x', dim = 'width';
        if (c.axis === 'x')
            axis = 'y', dim = 'height';
        var vs = c.offsets.map(function (o) { return _this.nodes[o.node]; }).sort(function (a, b) { return a[axis] - b[axis]; });
        var p = null;
        vs.forEach(function (v) {
            if (p) {
                var nextPos = p[axis] + p[dim];
                if (nextPos > v[axis]) {
                    v[axis] = nextPos;
                }
            }
            p = v;
        });
    };
    Projection.prototype.createAlignment = function (c) {
        var _this = this;
        var u = this.nodes[c.offsets[0].node].variable;
        this.makeFeasible(c);
        var cs = c.axis === 'x' ? this.xConstraints : this.yConstraints;
        c.offsets.slice(1).forEach(function (o) {
            var v = _this.nodes[o.node].variable;
            cs.push(new vpsc_1.Constraint(u, v, o.offset, true));
        });
    };
    Projection.prototype.createConstraints = function (constraints) {
        var _this = this;
        var isSep = function (c) { return typeof c.type === 'undefined' || c.type === 'separation'; };
        this.xConstraints = constraints
            .filter(function (c) { return c.axis === "x" && isSep(c); })
            .map(function (c) { return _this.createSeparation(c); });
        this.yConstraints = constraints
            .filter(function (c) { return c.axis === "y" && isSep(c); })
            .map(function (c) { return _this.createSeparation(c); });
        constraints
            .filter(function (c) { return c.type === 'alignment'; })
            .forEach(function (c) { return _this.createAlignment(c); });
    };
    Projection.prototype.setupVariablesAndBounds = function (x0, y0, desired, getDesired) {
        this.nodes.forEach(function (v, i) {
            if (v.fixed) {
                v.variable.weight = v.fixedWeight ? v.fixedWeight : 1000;
                desired[i] = getDesired(v);
            }
            else {
                v.variable.weight = 1;
            }
            var w = (v.width || 0) / 2, h = (v.height || 0) / 2;
            var ix = x0[i], iy = y0[i];
            v.bounds = new Rectangle(ix - w, ix + w, iy - h, iy + h);
        });
    };
    Projection.prototype.xProject = function (x0, y0, x) {
        if (!this.rootGroup && !(this.avoidOverlaps || this.xConstraints))
            return;
        this.project(x0, y0, x0, x, function (v) { return v.px; }, this.xConstraints, generateXGroupConstraints, function (v) { return v.bounds.setXCentre(x[v.variable.index] = v.variable.position()); }, function (g) {
            var xmin = x[g.minVar.index] = g.minVar.position();
            var xmax = x[g.maxVar.index] = g.maxVar.position();
            var p2 = g.padding / 2;
            g.bounds.x = xmin - p2;
            g.bounds.X = xmax + p2;
        });
    };
    Projection.prototype.yProject = function (x0, y0, y) {
        if (!this.rootGroup && !this.yConstraints)
            return;
        this.project(x0, y0, y0, y, function (v) { return v.py; }, this.yConstraints, generateYGroupConstraints, function (v) { return v.bounds.setYCentre(y[v.variable.index] = v.variable.position()); }, function (g) {
            var ymin = y[g.minVar.index] = g.minVar.position();
            var ymax = y[g.maxVar.index] = g.maxVar.position();
            var p2 = g.padding / 2;
            g.bounds.y = ymin - p2;
            ;
            g.bounds.Y = ymax + p2;
        });
    };
    Projection.prototype.projectFunctions = function () {
        var _this = this;
        return [
            function (x0, y0, x) { return _this.xProject(x0, y0, x); },
            function (x0, y0, y) { return _this.yProject(x0, y0, y); }
        ];
    };
    Projection.prototype.project = function (x0, y0, start, desired, getDesired, cs, generateConstraints, updateNodeBounds, updateGroupBounds) {
        this.setupVariablesAndBounds(x0, y0, desired, getDesired);
        if (this.rootGroup && this.avoidOverlaps) {
            computeGroupBounds(this.rootGroup);
            cs = cs.concat(generateConstraints(this.rootGroup));
        }
        this.solve(this.variables, cs, start, desired);
        this.nodes.forEach(updateNodeBounds);
        if (this.rootGroup && this.avoidOverlaps) {
            this.groups.forEach(updateGroupBounds);
            computeGroupBounds(this.rootGroup);
        }
    };
    Projection.prototype.solve = function (vs, cs, starting, desired) {
        var solver = new vpsc_1.Solver(vs, cs);
        solver.setStartingPositions(starting);
        solver.setDesiredPositions(desired);
        solver.solve();
    };
    return Projection;
}());
exports.Projection = Projection;
//# sourceMappingURL=rectangle.js.map

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Created by hen on 5/15/17.
 */
class SVG {
    static translate({ x, y }) {
        return "translate(" + x + "," + y + ")";
    }
    static group(parent, classes, pos) {
        return parent.append('g').attrs({
            class: classes,
            "transform": SVG.translate(pos)
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SVG;

class SVGMeasurements {
    constructor(baseElement, classes = '') {
        this.measureElement = baseElement.append('text')
            .attrs({ x: 0, y: -20, class: classes });
    }
    textLength(text, style = null) {
        this.measureElement.attr('style', style);
        this.measureElement.text(text);
        const tl = this.measureElement.node().getComputedTextLength();
        this.measureElement.text('');
        return tl;
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = SVGMeasurements;



/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var pqueue_1 = __webpack_require__(13);
var Neighbour = (function () {
    function Neighbour(id, distance) {
        this.id = id;
        this.distance = distance;
    }
    return Neighbour;
}());
var Node = (function () {
    function Node(id) {
        this.id = id;
        this.neighbours = [];
    }
    return Node;
}());
var QueueEntry = (function () {
    function QueueEntry(node, prev, d) {
        this.node = node;
        this.prev = prev;
        this.d = d;
    }
    return QueueEntry;
}());
var Calculator = (function () {
    function Calculator(n, es, getSourceIndex, getTargetIndex, getLength) {
        this.n = n;
        this.es = es;
        this.neighbours = new Array(this.n);
        var i = this.n;
        while (i--)
            this.neighbours[i] = new Node(i);
        i = this.es.length;
        while (i--) {
            var e = this.es[i];
            var u = getSourceIndex(e), v = getTargetIndex(e);
            var d = getLength(e);
            this.neighbours[u].neighbours.push(new Neighbour(v, d));
            this.neighbours[v].neighbours.push(new Neighbour(u, d));
        }
    }
    Calculator.prototype.DistanceMatrix = function () {
        var D = new Array(this.n);
        for (var i = 0; i < this.n; ++i) {
            D[i] = this.dijkstraNeighbours(i);
        }
        return D;
    };
    Calculator.prototype.DistancesFromNode = function (start) {
        return this.dijkstraNeighbours(start);
    };
    Calculator.prototype.PathFromNodeToNode = function (start, end) {
        return this.dijkstraNeighbours(start, end);
    };
    Calculator.prototype.PathFromNodeToNodeWithPrevCost = function (start, end, prevCost) {
        var q = new pqueue_1.PriorityQueue(function (a, b) { return a.d <= b.d; }), u = this.neighbours[start], qu = new QueueEntry(u, null, 0), visitedFrom = {};
        q.push(qu);
        while (!q.empty()) {
            qu = q.pop();
            u = qu.node;
            if (u.id === end) {
                break;
            }
            var i = u.neighbours.length;
            while (i--) {
                var neighbour = u.neighbours[i], v = this.neighbours[neighbour.id];
                if (qu.prev && v.id === qu.prev.node.id)
                    continue;
                var viduid = v.id + ',' + u.id;
                if (viduid in visitedFrom && visitedFrom[viduid] <= qu.d)
                    continue;
                var cc = qu.prev ? prevCost(qu.prev.node.id, u.id, v.id) : 0, t = qu.d + neighbour.distance + cc;
                visitedFrom[viduid] = t;
                q.push(new QueueEntry(v, qu, t));
            }
        }
        var path = [];
        while (qu.prev) {
            qu = qu.prev;
            path.push(qu.node.id);
        }
        return path;
    };
    Calculator.prototype.dijkstraNeighbours = function (start, dest) {
        if (dest === void 0) { dest = -1; }
        var q = new pqueue_1.PriorityQueue(function (a, b) { return a.d <= b.d; }), i = this.neighbours.length, d = new Array(i);
        while (i--) {
            var node = this.neighbours[i];
            node.d = i === start ? 0 : Number.POSITIVE_INFINITY;
            node.q = q.push(node);
        }
        while (!q.empty()) {
            var u = q.pop();
            d[u.id] = u.d;
            if (u.id === dest) {
                var path = [];
                var v = u;
                while (typeof v.prev !== 'undefined') {
                    path.push(v.prev.id);
                    v = v.prev;
                }
                return path;
            }
            i = u.neighbours.length;
            while (i--) {
                var neighbour = u.neighbours[i];
                var v = this.neighbours[neighbour.id];
                var t = u.d + neighbour.distance;
                if (u.d !== Number.MAX_VALUE && v.d > t) {
                    v.d = t;
                    v.prev = u;
                    q.reduceKey(v.q, v, function (e, q) { return e.q = q; });
                }
            }
        }
        return d;
    };
    return Calculator;
}());
exports.Calculator = Calculator;
//# sourceMappingURL=shortestpaths.js.map

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function unionCount(a, b) {
    var u = {};
    for (var i in a)
        u[i] = {};
    for (var i in b)
        u[i] = {};
    return Object.keys(u).length;
}
function intersectionCount(a, b) {
    var n = 0;
    for (var i in a)
        if (typeof b[i] !== 'undefined')
            ++n;
    return n;
}
function getNeighbours(links, la) {
    var neighbours = {};
    var addNeighbours = function (u, v) {
        if (typeof neighbours[u] === 'undefined')
            neighbours[u] = {};
        neighbours[u][v] = {};
    };
    links.forEach(function (e) {
        var u = la.getSourceIndex(e), v = la.getTargetIndex(e);
        addNeighbours(u, v);
        addNeighbours(v, u);
    });
    return neighbours;
}
function computeLinkLengths(links, w, f, la) {
    var neighbours = getNeighbours(links, la);
    links.forEach(function (l) {
        var a = neighbours[la.getSourceIndex(l)];
        var b = neighbours[la.getTargetIndex(l)];
        la.setLength(l, 1 + w * f(a, b));
    });
}
function symmetricDiffLinkLengths(links, la, w) {
    if (w === void 0) { w = 1; }
    computeLinkLengths(links, w, function (a, b) { return Math.sqrt(unionCount(a, b) - intersectionCount(a, b)); }, la);
}
exports.symmetricDiffLinkLengths = symmetricDiffLinkLengths;
function jaccardLinkLengths(links, la, w) {
    if (w === void 0) { w = 1; }
    computeLinkLengths(links, w, function (a, b) {
        return Math.min(Object.keys(a).length, Object.keys(b).length) < 1.1 ? 0 : intersectionCount(a, b) / unionCount(a, b);
    }, la);
}
exports.jaccardLinkLengths = jaccardLinkLengths;
function generateDirectedEdgeConstraints(n, links, axis, la) {
    var components = stronglyConnectedComponents(n, links, la);
    var nodes = {};
    components.forEach(function (c, i) {
        return c.forEach(function (v) { return nodes[v] = i; });
    });
    var constraints = [];
    links.forEach(function (l) {
        var ui = la.getSourceIndex(l), vi = la.getTargetIndex(l), u = nodes[ui], v = nodes[vi];
        if (u !== v) {
            constraints.push({
                axis: axis,
                left: ui,
                right: vi,
                gap: la.getMinSeparation(l)
            });
        }
    });
    return constraints;
}
exports.generateDirectedEdgeConstraints = generateDirectedEdgeConstraints;
function stronglyConnectedComponents(numVertices, edges, la) {
    var nodes = [];
    var index = 0;
    var stack = [];
    var components = [];
    function strongConnect(v) {
        v.index = v.lowlink = index++;
        stack.push(v);
        v.onStack = true;
        for (var _i = 0, _a = v.out; _i < _a.length; _i++) {
            var w = _a[_i];
            if (typeof w.index === 'undefined') {
                strongConnect(w);
                v.lowlink = Math.min(v.lowlink, w.lowlink);
            }
            else if (w.onStack) {
                v.lowlink = Math.min(v.lowlink, w.index);
            }
        }
        if (v.lowlink === v.index) {
            var component = [];
            while (stack.length) {
                w = stack.pop();
                w.onStack = false;
                component.push(w);
                if (w === v)
                    break;
            }
            components.push(component.map(function (v) { return v.id; }));
        }
    }
    for (var i = 0; i < numVertices; i++) {
        nodes.push({ id: i, out: [] });
    }
    for (var _i = 0, edges_1 = edges; _i < edges_1.length; _i++) {
        var e = edges_1[_i];
        var v_1 = nodes[la.getSourceIndex(e)], w = nodes[la.getTargetIndex(e)];
        v_1.out.push(w);
    }
    for (var _a = 0, nodes_1 = nodes; _a < nodes_1.length; _a++) {
        var v = nodes_1[_a];
        if (typeof v.index === 'undefined')
            strongConnect(v);
    }
    return components;
}
exports.stronglyConnectedComponents = stronglyConnectedComponents;
//# sourceMappingURL=linklengths.js.map

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Locks = (function () {
    function Locks() {
        this.locks = {};
    }
    Locks.prototype.add = function (id, x) {
        this.locks[id] = x;
    };
    Locks.prototype.clear = function () {
        this.locks = {};
    };
    Locks.prototype.isEmpty = function () {
        for (var l in this.locks)
            return false;
        return true;
    };
    Locks.prototype.apply = function (f) {
        for (var l in this.locks) {
            f(Number(l), this.locks[l]);
        }
    };
    return Locks;
}());
exports.Locks = Locks;
var Descent = (function () {
    function Descent(x, D, G) {
        if (G === void 0) { G = null; }
        this.D = D;
        this.G = G;
        this.threshold = 0.0001;
        this.numGridSnapNodes = 0;
        this.snapGridSize = 100;
        this.snapStrength = 1000;
        this.scaleSnapByMaxH = false;
        this.random = new PseudoRandom();
        this.project = null;
        this.x = x;
        this.k = x.length;
        var n = this.n = x[0].length;
        this.H = new Array(this.k);
        this.g = new Array(this.k);
        this.Hd = new Array(this.k);
        this.a = new Array(this.k);
        this.b = new Array(this.k);
        this.c = new Array(this.k);
        this.d = new Array(this.k);
        this.e = new Array(this.k);
        this.ia = new Array(this.k);
        this.ib = new Array(this.k);
        this.xtmp = new Array(this.k);
        this.locks = new Locks();
        this.minD = Number.MAX_VALUE;
        var i = n, j;
        while (i--) {
            j = n;
            while (--j > i) {
                var d = D[i][j];
                if (d > 0 && d < this.minD) {
                    this.minD = d;
                }
            }
        }
        if (this.minD === Number.MAX_VALUE)
            this.minD = 1;
        i = this.k;
        while (i--) {
            this.g[i] = new Array(n);
            this.H[i] = new Array(n);
            j = n;
            while (j--) {
                this.H[i][j] = new Array(n);
            }
            this.Hd[i] = new Array(n);
            this.a[i] = new Array(n);
            this.b[i] = new Array(n);
            this.c[i] = new Array(n);
            this.d[i] = new Array(n);
            this.e[i] = new Array(n);
            this.ia[i] = new Array(n);
            this.ib[i] = new Array(n);
            this.xtmp[i] = new Array(n);
        }
    }
    Descent.createSquareMatrix = function (n, f) {
        var M = new Array(n);
        for (var i = 0; i < n; ++i) {
            M[i] = new Array(n);
            for (var j = 0; j < n; ++j) {
                M[i][j] = f(i, j);
            }
        }
        return M;
    };
    Descent.prototype.offsetDir = function () {
        var _this = this;
        var u = new Array(this.k);
        var l = 0;
        for (var i = 0; i < this.k; ++i) {
            var x = u[i] = this.random.getNextBetween(0.01, 1) - 0.5;
            l += x * x;
        }
        l = Math.sqrt(l);
        return u.map(function (x) { return x *= _this.minD / l; });
    };
    Descent.prototype.computeDerivatives = function (x) {
        var _this = this;
        var n = this.n;
        if (n < 1)
            return;
        var i;
        var d = new Array(this.k);
        var d2 = new Array(this.k);
        var Huu = new Array(this.k);
        var maxH = 0;
        for (var u = 0; u < n; ++u) {
            for (i = 0; i < this.k; ++i)
                Huu[i] = this.g[i][u] = 0;
            for (var v = 0; v < n; ++v) {
                if (u === v)
                    continue;
                var maxDisplaces = n;
                while (maxDisplaces--) {
                    var sd2 = 0;
                    for (i = 0; i < this.k; ++i) {
                        var dx = d[i] = x[i][u] - x[i][v];
                        sd2 += d2[i] = dx * dx;
                    }
                    if (sd2 > 1e-9)
                        break;
                    var rd = this.offsetDir();
                    for (i = 0; i < this.k; ++i)
                        x[i][v] += rd[i];
                }
                var l = Math.sqrt(sd2);
                var D = this.D[u][v];
                var weight = this.G != null ? this.G[u][v] : 1;
                if (weight > 1 && l > D || !isFinite(D)) {
                    for (i = 0; i < this.k; ++i)
                        this.H[i][u][v] = 0;
                    continue;
                }
                if (weight > 1) {
                    weight = 1;
                }
                var D2 = D * D;
                var gs = 2 * weight * (l - D) / (D2 * l);
                var l3 = l * l * l;
                var hs = 2 * -weight / (D2 * l3);
                if (!isFinite(gs))
                    console.log(gs);
                for (i = 0; i < this.k; ++i) {
                    this.g[i][u] += d[i] * gs;
                    Huu[i] -= this.H[i][u][v] = hs * (l3 + D * (d2[i] - sd2) + l * sd2);
                }
            }
            for (i = 0; i < this.k; ++i)
                maxH = Math.max(maxH, this.H[i][u][u] = Huu[i]);
        }
        var r = this.snapGridSize / 2;
        var g = this.snapGridSize;
        var w = this.snapStrength;
        var k = w / (r * r);
        var numNodes = this.numGridSnapNodes;
        for (var u = 0; u < numNodes; ++u) {
            for (i = 0; i < this.k; ++i) {
                var xiu = this.x[i][u];
                var m = xiu / g;
                var f = m % 1;
                var q = m - f;
                var a = Math.abs(f);
                var dx = (a <= 0.5) ? xiu - q * g :
                    (xiu > 0) ? xiu - (q + 1) * g : xiu - (q - 1) * g;
                if (-r < dx && dx <= r) {
                    if (this.scaleSnapByMaxH) {
                        this.g[i][u] += maxH * k * dx;
                        this.H[i][u][u] += maxH * k;
                    }
                    else {
                        this.g[i][u] += k * dx;
                        this.H[i][u][u] += k;
                    }
                }
            }
        }
        if (!this.locks.isEmpty()) {
            this.locks.apply(function (u, p) {
                for (i = 0; i < _this.k; ++i) {
                    _this.H[i][u][u] += maxH;
                    _this.g[i][u] -= maxH * (p[i] - x[i][u]);
                }
            });
        }
    };
    Descent.dotProd = function (a, b) {
        var x = 0, i = a.length;
        while (i--)
            x += a[i] * b[i];
        return x;
    };
    Descent.rightMultiply = function (m, v, r) {
        var i = m.length;
        while (i--)
            r[i] = Descent.dotProd(m[i], v);
    };
    Descent.prototype.computeStepSize = function (d) {
        var numerator = 0, denominator = 0;
        for (var i = 0; i < this.k; ++i) {
            numerator += Descent.dotProd(this.g[i], d[i]);
            Descent.rightMultiply(this.H[i], d[i], this.Hd[i]);
            denominator += Descent.dotProd(d[i], this.Hd[i]);
        }
        if (denominator === 0 || !isFinite(denominator))
            return 0;
        return 1 * numerator / denominator;
    };
    Descent.prototype.reduceStress = function () {
        this.computeDerivatives(this.x);
        var alpha = this.computeStepSize(this.g);
        for (var i = 0; i < this.k; ++i) {
            this.takeDescentStep(this.x[i], this.g[i], alpha);
        }
        return this.computeStress();
    };
    Descent.copy = function (a, b) {
        var m = a.length, n = b[0].length;
        for (var i = 0; i < m; ++i) {
            for (var j = 0; j < n; ++j) {
                b[i][j] = a[i][j];
            }
        }
    };
    Descent.prototype.stepAndProject = function (x0, r, d, stepSize) {
        Descent.copy(x0, r);
        this.takeDescentStep(r[0], d[0], stepSize);
        if (this.project)
            this.project[0](x0[0], x0[1], r[0]);
        this.takeDescentStep(r[1], d[1], stepSize);
        if (this.project)
            this.project[1](r[0], x0[1], r[1]);
        for (var i = 2; i < this.k; i++)
            this.takeDescentStep(r[i], d[i], stepSize);
    };
    Descent.mApply = function (m, n, f) {
        var i = m;
        while (i-- > 0) {
            var j = n;
            while (j-- > 0)
                f(i, j);
        }
    };
    Descent.prototype.matrixApply = function (f) {
        Descent.mApply(this.k, this.n, f);
    };
    Descent.prototype.computeNextPosition = function (x0, r) {
        var _this = this;
        this.computeDerivatives(x0);
        var alpha = this.computeStepSize(this.g);
        this.stepAndProject(x0, r, this.g, alpha);
        if (this.project) {
            this.matrixApply(function (i, j) { return _this.e[i][j] = x0[i][j] - r[i][j]; });
            var beta = this.computeStepSize(this.e);
            beta = Math.max(0.2, Math.min(beta, 1));
            this.stepAndProject(x0, r, this.e, beta);
        }
    };
    Descent.prototype.run = function (iterations) {
        var stress = Number.MAX_VALUE, converged = false;
        while (!converged && iterations-- > 0) {
            var s = this.rungeKutta();
            converged = Math.abs(stress / s - 1) < this.threshold;
            stress = s;
        }
        return stress;
    };
    Descent.prototype.rungeKutta = function () {
        var _this = this;
        this.computeNextPosition(this.x, this.a);
        Descent.mid(this.x, this.a, this.ia);
        this.computeNextPosition(this.ia, this.b);
        Descent.mid(this.x, this.b, this.ib);
        this.computeNextPosition(this.ib, this.c);
        this.computeNextPosition(this.c, this.d);
        var disp = 0;
        this.matrixApply(function (i, j) {
            var x = (_this.a[i][j] + 2.0 * _this.b[i][j] + 2.0 * _this.c[i][j] + _this.d[i][j]) / 6.0, d = _this.x[i][j] - x;
            disp += d * d;
            _this.x[i][j] = x;
        });
        return disp;
    };
    Descent.mid = function (a, b, m) {
        Descent.mApply(a.length, a[0].length, function (i, j) {
            return m[i][j] = a[i][j] + (b[i][j] - a[i][j]) / 2.0;
        });
    };
    Descent.prototype.takeDescentStep = function (x, d, stepSize) {
        for (var i = 0; i < this.n; ++i) {
            x[i] = x[i] - stepSize * d[i];
        }
    };
    Descent.prototype.computeStress = function () {
        var stress = 0;
        for (var u = 0, nMinus1 = this.n - 1; u < nMinus1; ++u) {
            for (var v = u + 1, n = this.n; v < n; ++v) {
                var l = 0;
                for (var i = 0; i < this.k; ++i) {
                    var dx = this.x[i][u] - this.x[i][v];
                    l += dx * dx;
                }
                l = Math.sqrt(l);
                var d = this.D[u][v];
                if (!isFinite(d))
                    continue;
                var rl = d - l;
                var d2 = d * d;
                stress += rl * rl / d2;
            }
        }
        return stress;
    };
    Descent.zeroDistance = 1e-10;
    return Descent;
}());
exports.Descent = Descent;
var PseudoRandom = (function () {
    function PseudoRandom(seed) {
        if (seed === void 0) { seed = 1; }
        this.seed = seed;
        this.a = 214013;
        this.c = 2531011;
        this.m = 2147483648;
        this.range = 32767;
    }
    PseudoRandom.prototype.getNext = function () {
        this.seed = (this.seed * this.a + this.c) % this.m;
        return (this.seed >> 16) / this.range;
    };
    PseudoRandom.prototype.getNextBetween = function (min, max) {
        return min + this.getNext() * (max - min);
    };
    return PseudoRandom;
}());
exports.PseudoRandom = PseudoRandom;
//# sourceMappingURL=descent.js.map

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PositionStats = (function () {
    function PositionStats(scale) {
        this.scale = scale;
        this.AB = 0;
        this.AD = 0;
        this.A2 = 0;
    }
    PositionStats.prototype.addVariable = function (v) {
        var ai = this.scale / v.scale;
        var bi = v.offset / v.scale;
        var wi = v.weight;
        this.AB += wi * ai * bi;
        this.AD += wi * ai * v.desiredPosition;
        this.A2 += wi * ai * ai;
    };
    PositionStats.prototype.getPosn = function () {
        return (this.AD - this.AB) / this.A2;
    };
    return PositionStats;
}());
exports.PositionStats = PositionStats;
var Constraint = (function () {
    function Constraint(left, right, gap, equality) {
        if (equality === void 0) { equality = false; }
        this.left = left;
        this.right = right;
        this.gap = gap;
        this.equality = equality;
        this.active = false;
        this.unsatisfiable = false;
        this.left = left;
        this.right = right;
        this.gap = gap;
        this.equality = equality;
    }
    Constraint.prototype.slack = function () {
        return this.unsatisfiable ? Number.MAX_VALUE
            : this.right.scale * this.right.position() - this.gap
                - this.left.scale * this.left.position();
    };
    return Constraint;
}());
exports.Constraint = Constraint;
var Variable = (function () {
    function Variable(desiredPosition, weight, scale) {
        if (weight === void 0) { weight = 1; }
        if (scale === void 0) { scale = 1; }
        this.desiredPosition = desiredPosition;
        this.weight = weight;
        this.scale = scale;
        this.offset = 0;
    }
    Variable.prototype.dfdv = function () {
        return 2.0 * this.weight * (this.position() - this.desiredPosition);
    };
    Variable.prototype.position = function () {
        return (this.block.ps.scale * this.block.posn + this.offset) / this.scale;
    };
    Variable.prototype.visitNeighbours = function (prev, f) {
        var ff = function (c, next) { return c.active && prev !== next && f(c, next); };
        this.cOut.forEach(function (c) { return ff(c, c.right); });
        this.cIn.forEach(function (c) { return ff(c, c.left); });
    };
    return Variable;
}());
exports.Variable = Variable;
var Block = (function () {
    function Block(v) {
        this.vars = [];
        v.offset = 0;
        this.ps = new PositionStats(v.scale);
        this.addVariable(v);
    }
    Block.prototype.addVariable = function (v) {
        v.block = this;
        this.vars.push(v);
        this.ps.addVariable(v);
        this.posn = this.ps.getPosn();
    };
    Block.prototype.updateWeightedPosition = function () {
        this.ps.AB = this.ps.AD = this.ps.A2 = 0;
        for (var i = 0, n = this.vars.length; i < n; ++i)
            this.ps.addVariable(this.vars[i]);
        this.posn = this.ps.getPosn();
    };
    Block.prototype.compute_lm = function (v, u, postAction) {
        var _this = this;
        var dfdv = v.dfdv();
        v.visitNeighbours(u, function (c, next) {
            var _dfdv = _this.compute_lm(next, v, postAction);
            if (next === c.right) {
                dfdv += _dfdv * c.left.scale;
                c.lm = _dfdv;
            }
            else {
                dfdv += _dfdv * c.right.scale;
                c.lm = -_dfdv;
            }
            postAction(c);
        });
        return dfdv / v.scale;
    };
    Block.prototype.populateSplitBlock = function (v, prev) {
        var _this = this;
        v.visitNeighbours(prev, function (c, next) {
            next.offset = v.offset + (next === c.right ? c.gap : -c.gap);
            _this.addVariable(next);
            _this.populateSplitBlock(next, v);
        });
    };
    Block.prototype.traverse = function (visit, acc, v, prev) {
        var _this = this;
        if (v === void 0) { v = this.vars[0]; }
        if (prev === void 0) { prev = null; }
        v.visitNeighbours(prev, function (c, next) {
            acc.push(visit(c));
            _this.traverse(visit, acc, next, v);
        });
    };
    Block.prototype.findMinLM = function () {
        var m = null;
        this.compute_lm(this.vars[0], null, function (c) {
            if (!c.equality && (m === null || c.lm < m.lm))
                m = c;
        });
        return m;
    };
    Block.prototype.findMinLMBetween = function (lv, rv) {
        this.compute_lm(lv, null, function () { });
        var m = null;
        this.findPath(lv, null, rv, function (c, next) {
            if (!c.equality && c.right === next && (m === null || c.lm < m.lm))
                m = c;
        });
        return m;
    };
    Block.prototype.findPath = function (v, prev, to, visit) {
        var _this = this;
        var endFound = false;
        v.visitNeighbours(prev, function (c, next) {
            if (!endFound && (next === to || _this.findPath(next, v, to, visit))) {
                endFound = true;
                visit(c, next);
            }
        });
        return endFound;
    };
    Block.prototype.isActiveDirectedPathBetween = function (u, v) {
        if (u === v)
            return true;
        var i = u.cOut.length;
        while (i--) {
            var c = u.cOut[i];
            if (c.active && this.isActiveDirectedPathBetween(c.right, v))
                return true;
        }
        return false;
    };
    Block.split = function (c) {
        c.active = false;
        return [Block.createSplitBlock(c.left), Block.createSplitBlock(c.right)];
    };
    Block.createSplitBlock = function (startVar) {
        var b = new Block(startVar);
        b.populateSplitBlock(startVar, null);
        return b;
    };
    Block.prototype.splitBetween = function (vl, vr) {
        var c = this.findMinLMBetween(vl, vr);
        if (c !== null) {
            var bs = Block.split(c);
            return { constraint: c, lb: bs[0], rb: bs[1] };
        }
        return null;
    };
    Block.prototype.mergeAcross = function (b, c, dist) {
        c.active = true;
        for (var i = 0, n = b.vars.length; i < n; ++i) {
            var v = b.vars[i];
            v.offset += dist;
            this.addVariable(v);
        }
        this.posn = this.ps.getPosn();
    };
    Block.prototype.cost = function () {
        var sum = 0, i = this.vars.length;
        while (i--) {
            var v = this.vars[i], d = v.position() - v.desiredPosition;
            sum += d * d * v.weight;
        }
        return sum;
    };
    return Block;
}());
exports.Block = Block;
var Blocks = (function () {
    function Blocks(vs) {
        this.vs = vs;
        var n = vs.length;
        this.list = new Array(n);
        while (n--) {
            var b = new Block(vs[n]);
            this.list[n] = b;
            b.blockInd = n;
        }
    }
    Blocks.prototype.cost = function () {
        var sum = 0, i = this.list.length;
        while (i--)
            sum += this.list[i].cost();
        return sum;
    };
    Blocks.prototype.insert = function (b) {
        b.blockInd = this.list.length;
        this.list.push(b);
    };
    Blocks.prototype.remove = function (b) {
        var last = this.list.length - 1;
        var swapBlock = this.list[last];
        this.list.length = last;
        if (b !== swapBlock) {
            this.list[b.blockInd] = swapBlock;
            swapBlock.blockInd = b.blockInd;
        }
    };
    Blocks.prototype.merge = function (c) {
        var l = c.left.block, r = c.right.block;
        var dist = c.right.offset - c.left.offset - c.gap;
        if (l.vars.length < r.vars.length) {
            r.mergeAcross(l, c, dist);
            this.remove(l);
        }
        else {
            l.mergeAcross(r, c, -dist);
            this.remove(r);
        }
    };
    Blocks.prototype.forEach = function (f) {
        this.list.forEach(f);
    };
    Blocks.prototype.updateBlockPositions = function () {
        this.list.forEach(function (b) { return b.updateWeightedPosition(); });
    };
    Blocks.prototype.split = function (inactive) {
        var _this = this;
        this.updateBlockPositions();
        this.list.forEach(function (b) {
            var v = b.findMinLM();
            if (v !== null && v.lm < Solver.LAGRANGIAN_TOLERANCE) {
                b = v.left.block;
                Block.split(v).forEach(function (nb) { return _this.insert(nb); });
                _this.remove(b);
                inactive.push(v);
            }
        });
    };
    return Blocks;
}());
exports.Blocks = Blocks;
var Solver = (function () {
    function Solver(vs, cs) {
        this.vs = vs;
        this.cs = cs;
        this.vs = vs;
        vs.forEach(function (v) {
            v.cIn = [], v.cOut = [];
        });
        this.cs = cs;
        cs.forEach(function (c) {
            c.left.cOut.push(c);
            c.right.cIn.push(c);
        });
        this.inactive = cs.map(function (c) { c.active = false; return c; });
        this.bs = null;
    }
    Solver.prototype.cost = function () {
        return this.bs.cost();
    };
    Solver.prototype.setStartingPositions = function (ps) {
        this.inactive = this.cs.map(function (c) { c.active = false; return c; });
        this.bs = new Blocks(this.vs);
        this.bs.forEach(function (b, i) { return b.posn = ps[i]; });
    };
    Solver.prototype.setDesiredPositions = function (ps) {
        this.vs.forEach(function (v, i) { return v.desiredPosition = ps[i]; });
    };
    Solver.prototype.mostViolated = function () {
        var minSlack = Number.MAX_VALUE, v = null, l = this.inactive, n = l.length, deletePoint = n;
        for (var i = 0; i < n; ++i) {
            var c = l[i];
            if (c.unsatisfiable)
                continue;
            var slack = c.slack();
            if (c.equality || slack < minSlack) {
                minSlack = slack;
                v = c;
                deletePoint = i;
                if (c.equality)
                    break;
            }
        }
        if (deletePoint !== n &&
            (minSlack < Solver.ZERO_UPPERBOUND && !v.active || v.equality)) {
            l[deletePoint] = l[n - 1];
            l.length = n - 1;
        }
        return v;
    };
    Solver.prototype.satisfy = function () {
        if (this.bs == null) {
            this.bs = new Blocks(this.vs);
        }
        this.bs.split(this.inactive);
        var v = null;
        while ((v = this.mostViolated()) && (v.equality || v.slack() < Solver.ZERO_UPPERBOUND && !v.active)) {
            var lb = v.left.block, rb = v.right.block;
            if (lb !== rb) {
                this.bs.merge(v);
            }
            else {
                if (lb.isActiveDirectedPathBetween(v.right, v.left)) {
                    v.unsatisfiable = true;
                    continue;
                }
                var split = lb.splitBetween(v.left, v.right);
                if (split !== null) {
                    this.bs.insert(split.lb);
                    this.bs.insert(split.rb);
                    this.bs.remove(lb);
                    this.inactive.push(split.constraint);
                }
                else {
                    v.unsatisfiable = true;
                    continue;
                }
                if (v.slack() >= 0) {
                    this.inactive.push(v);
                }
                else {
                    this.bs.merge(v);
                }
            }
        }
    };
    Solver.prototype.solve = function () {
        this.satisfy();
        var lastcost = Number.MAX_VALUE, cost = this.bs.cost();
        while (Math.abs(lastcost - cost) > 0.0001) {
            this.satisfy();
            lastcost = cost;
            cost = this.bs.cost();
        }
        return cost;
    };
    Solver.LAGRANGIAN_TOLERANCE = -1e-4;
    Solver.ZERO_UPPERBOUND = -1e-10;
    return Solver;
}());
exports.Solver = Solver;
function removeOverlapInOneDimension(spans, lowerBound, upperBound) {
    var vs = spans.map(function (s) { return new Variable(s.desiredCenter); });
    var cs = [];
    var n = spans.length;
    for (var i = 0; i < n - 1; i++) {
        var left = spans[i], right = spans[i + 1];
        cs.push(new Constraint(vs[i], vs[i + 1], (left.size + right.size) / 2));
    }
    var leftMost = vs[0], rightMost = vs[n - 1], leftMostSize = spans[0].size / 2, rightMostSize = spans[n - 1].size / 2;
    var vLower = null, vUpper = null;
    if (lowerBound) {
        vLower = new Variable(lowerBound, leftMost.weight * 1000);
        vs.push(vLower);
        cs.push(new Constraint(vLower, leftMost, leftMostSize));
    }
    if (upperBound) {
        vUpper = new Variable(upperBound, rightMost.weight * 1000);
        vs.push(vUpper);
        cs.push(new Constraint(rightMost, vUpper, rightMostSize));
    }
    var solver = new Solver(vs, cs);
    solver.solve();
    return {
        newCenters: vs.slice(0, spans.length).map(function (v) { return v.position(); }),
        lowerBound: vLower ? vLower.position() : leftMost.position() - leftMostSize,
        upperBound: vUpper ? vUpper.position() : rightMost.position() + rightMostSize
    };
}
exports.removeOverlapInOneDimension = removeOverlapInOneDimension;
//# sourceMappingURL=vpsc.js.map

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Created by hen on 5/15/17.
 */
class SimpleEventHandler {
    constructor(element) {
        this.element = element;
        this.eventListeners = [];
    }
    bind(eventNames, eventFunction) {
        for (const eventName of eventNames.split(' ')) {
            this.eventListeners.push({ eventName, eventFunction });
            const eventFunctionWrap = e => eventFunction(e.detail, e);
            this.element.addEventListener(eventName, eventFunctionWrap, false);
        }
    }
    getListeners() {
        return this.eventListeners;
    }
    trigger(eventName, detail) {
        this.element.dispatchEvent(new CustomEvent(eventName, { detail }));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SimpleEventHandler;



/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PowerEdge = (function () {
    function PowerEdge(source, target, type) {
        this.source = source;
        this.target = target;
        this.type = type;
    }
    return PowerEdge;
}());
exports.PowerEdge = PowerEdge;
var Configuration = (function () {
    function Configuration(n, edges, linkAccessor, rootGroup) {
        var _this = this;
        this.linkAccessor = linkAccessor;
        this.modules = new Array(n);
        this.roots = [];
        if (rootGroup) {
            this.initModulesFromGroup(rootGroup);
        }
        else {
            this.roots.push(new ModuleSet());
            for (var i = 0; i < n; ++i)
                this.roots[0].add(this.modules[i] = new Module(i));
        }
        this.R = edges.length;
        edges.forEach(function (e) {
            var s = _this.modules[linkAccessor.getSourceIndex(e)], t = _this.modules[linkAccessor.getTargetIndex(e)], type = linkAccessor.getType(e);
            s.outgoing.add(type, t);
            t.incoming.add(type, s);
        });
    }
    Configuration.prototype.initModulesFromGroup = function (group) {
        var moduleSet = new ModuleSet();
        this.roots.push(moduleSet);
        for (var i = 0; i < group.leaves.length; ++i) {
            var node = group.leaves[i];
            var module = new Module(node.id);
            this.modules[node.id] = module;
            moduleSet.add(module);
        }
        if (group.groups) {
            for (var j = 0; j < group.groups.length; ++j) {
                var child = group.groups[j];
                var definition = {};
                for (var prop in child)
                    if (prop !== "leaves" && prop !== "groups" && child.hasOwnProperty(prop))
                        definition[prop] = child[prop];
                moduleSet.add(new Module(-1 - j, new LinkSets(), new LinkSets(), this.initModulesFromGroup(child), definition));
            }
        }
        return moduleSet;
    };
    Configuration.prototype.merge = function (a, b, k) {
        if (k === void 0) { k = 0; }
        var inInt = a.incoming.intersection(b.incoming), outInt = a.outgoing.intersection(b.outgoing);
        var children = new ModuleSet();
        children.add(a);
        children.add(b);
        var m = new Module(this.modules.length, outInt, inInt, children);
        this.modules.push(m);
        var update = function (s, i, o) {
            s.forAll(function (ms, linktype) {
                ms.forAll(function (n) {
                    var nls = n[i];
                    nls.add(linktype, m);
                    nls.remove(linktype, a);
                    nls.remove(linktype, b);
                    a[o].remove(linktype, n);
                    b[o].remove(linktype, n);
                });
            });
        };
        update(outInt, "incoming", "outgoing");
        update(inInt, "outgoing", "incoming");
        this.R -= inInt.count() + outInt.count();
        this.roots[k].remove(a);
        this.roots[k].remove(b);
        this.roots[k].add(m);
        return m;
    };
    Configuration.prototype.rootMerges = function (k) {
        if (k === void 0) { k = 0; }
        var rs = this.roots[k].modules();
        var n = rs.length;
        var merges = new Array(n * (n - 1));
        var ctr = 0;
        for (var i = 0, i_ = n - 1; i < i_; ++i) {
            for (var j = i + 1; j < n; ++j) {
                var a = rs[i], b = rs[j];
                merges[ctr] = { id: ctr, nEdges: this.nEdges(a, b), a: a, b: b };
                ctr++;
            }
        }
        return merges;
    };
    Configuration.prototype.greedyMerge = function () {
        for (var i = 0; i < this.roots.length; ++i) {
            if (this.roots[i].modules().length < 2)
                continue;
            var ms = this.rootMerges(i).sort(function (a, b) { return a.nEdges == b.nEdges ? a.id - b.id : a.nEdges - b.nEdges; });
            var m = ms[0];
            if (m.nEdges >= this.R)
                continue;
            this.merge(m.a, m.b, i);
            return true;
        }
    };
    Configuration.prototype.nEdges = function (a, b) {
        var inInt = a.incoming.intersection(b.incoming), outInt = a.outgoing.intersection(b.outgoing);
        return this.R - inInt.count() - outInt.count();
    };
    Configuration.prototype.getGroupHierarchy = function (retargetedEdges) {
        var _this = this;
        var groups = [];
        var root = {};
        toGroups(this.roots[0], root, groups);
        var es = this.allEdges();
        es.forEach(function (e) {
            var a = _this.modules[e.source];
            var b = _this.modules[e.target];
            retargetedEdges.push(new PowerEdge(typeof a.gid === "undefined" ? e.source : groups[a.gid], typeof b.gid === "undefined" ? e.target : groups[b.gid], e.type));
        });
        return groups;
    };
    Configuration.prototype.allEdges = function () {
        var es = [];
        Configuration.getEdges(this.roots[0], es);
        return es;
    };
    Configuration.getEdges = function (modules, es) {
        modules.forAll(function (m) {
            m.getEdges(es);
            Configuration.getEdges(m.children, es);
        });
    };
    return Configuration;
}());
exports.Configuration = Configuration;
function toGroups(modules, group, groups) {
    modules.forAll(function (m) {
        if (m.isLeaf()) {
            if (!group.leaves)
                group.leaves = [];
            group.leaves.push(m.id);
        }
        else {
            var g = group;
            m.gid = groups.length;
            if (!m.isIsland() || m.isPredefined()) {
                g = { id: m.gid };
                if (m.isPredefined())
                    for (var prop in m.definition)
                        g[prop] = m.definition[prop];
                if (!group.groups)
                    group.groups = [];
                group.groups.push(m.gid);
                groups.push(g);
            }
            toGroups(m.children, g, groups);
        }
    });
}
var Module = (function () {
    function Module(id, outgoing, incoming, children, definition) {
        if (outgoing === void 0) { outgoing = new LinkSets(); }
        if (incoming === void 0) { incoming = new LinkSets(); }
        if (children === void 0) { children = new ModuleSet(); }
        this.id = id;
        this.outgoing = outgoing;
        this.incoming = incoming;
        this.children = children;
        this.definition = definition;
    }
    Module.prototype.getEdges = function (es) {
        var _this = this;
        this.outgoing.forAll(function (ms, edgetype) {
            ms.forAll(function (target) {
                es.push(new PowerEdge(_this.id, target.id, edgetype));
            });
        });
    };
    Module.prototype.isLeaf = function () {
        return this.children.count() === 0;
    };
    Module.prototype.isIsland = function () {
        return this.outgoing.count() === 0 && this.incoming.count() === 0;
    };
    Module.prototype.isPredefined = function () {
        return typeof this.definition !== "undefined";
    };
    return Module;
}());
exports.Module = Module;
function intersection(m, n) {
    var i = {};
    for (var v in m)
        if (v in n)
            i[v] = m[v];
    return i;
}
var ModuleSet = (function () {
    function ModuleSet() {
        this.table = {};
    }
    ModuleSet.prototype.count = function () {
        return Object.keys(this.table).length;
    };
    ModuleSet.prototype.intersection = function (other) {
        var result = new ModuleSet();
        result.table = intersection(this.table, other.table);
        return result;
    };
    ModuleSet.prototype.intersectionCount = function (other) {
        return this.intersection(other).count();
    };
    ModuleSet.prototype.contains = function (id) {
        return id in this.table;
    };
    ModuleSet.prototype.add = function (m) {
        this.table[m.id] = m;
    };
    ModuleSet.prototype.remove = function (m) {
        delete this.table[m.id];
    };
    ModuleSet.prototype.forAll = function (f) {
        for (var mid in this.table) {
            f(this.table[mid]);
        }
    };
    ModuleSet.prototype.modules = function () {
        var vs = [];
        this.forAll(function (m) {
            if (!m.isPredefined())
                vs.push(m);
        });
        return vs;
    };
    return ModuleSet;
}());
exports.ModuleSet = ModuleSet;
var LinkSets = (function () {
    function LinkSets() {
        this.sets = {};
        this.n = 0;
    }
    LinkSets.prototype.count = function () {
        return this.n;
    };
    LinkSets.prototype.contains = function (id) {
        var result = false;
        this.forAllModules(function (m) {
            if (!result && m.id == id) {
                result = true;
            }
        });
        return result;
    };
    LinkSets.prototype.add = function (linktype, m) {
        var s = linktype in this.sets ? this.sets[linktype] : this.sets[linktype] = new ModuleSet();
        s.add(m);
        ++this.n;
    };
    LinkSets.prototype.remove = function (linktype, m) {
        var ms = this.sets[linktype];
        ms.remove(m);
        if (ms.count() === 0) {
            delete this.sets[linktype];
        }
        --this.n;
    };
    LinkSets.prototype.forAll = function (f) {
        for (var linktype in this.sets) {
            f(this.sets[linktype], Number(linktype));
        }
    };
    LinkSets.prototype.forAllModules = function (f) {
        this.forAll(function (ms, lt) { return ms.forAll(f); });
    };
    LinkSets.prototype.intersection = function (other) {
        var result = new LinkSets();
        this.forAll(function (ms, lt) {
            if (lt in other.sets) {
                var i = ms.intersection(other.sets[lt]), n = i.count();
                if (n > 0) {
                    result.sets[lt] = i;
                    result.n += n;
                }
            }
        });
        return result;
    };
    return LinkSets;
}());
exports.LinkSets = LinkSets;
function intersectionCount(m, n) {
    return Object.keys(intersection(m, n)).length;
}
function getGroups(nodes, links, la, rootGroup) {
    var n = nodes.length, c = new Configuration(n, links, la, rootGroup);
    while (c.greedyMerge())
        ;
    var powerEdges = [];
    var g = c.getGroupHierarchy(powerEdges);
    powerEdges.forEach(function (e) {
        var f = function (end) {
            var g = e[end];
            if (typeof g == "number")
                e[end] = nodes[g];
        };
        f("source");
        f("target");
    });
    return { groups: g, powerEdges: powerEdges };
}
exports.getGroups = getGroups;
//# sourceMappingURL=powergraph.js.map

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var TreeBase = (function () {
    function TreeBase() {
        this.findIter = function (data) {
            var res = this._root;
            var iter = this.iterator();
            while (res !== null) {
                var c = this._comparator(data, res.data);
                if (c === 0) {
                    iter._cursor = res;
                    return iter;
                }
                else {
                    iter._ancestors.push(res);
                    res = res.get_child(c > 0);
                }
            }
            return null;
        };
    }
    TreeBase.prototype.clear = function () {
        this._root = null;
        this.size = 0;
    };
    ;
    TreeBase.prototype.find = function (data) {
        var res = this._root;
        while (res !== null) {
            var c = this._comparator(data, res.data);
            if (c === 0) {
                return res.data;
            }
            else {
                res = res.get_child(c > 0);
            }
        }
        return null;
    };
    ;
    TreeBase.prototype.lowerBound = function (data) {
        return this._bound(data, this._comparator);
    };
    ;
    TreeBase.prototype.upperBound = function (data) {
        var cmp = this._comparator;
        function reverse_cmp(a, b) {
            return cmp(b, a);
        }
        return this._bound(data, reverse_cmp);
    };
    ;
    TreeBase.prototype.min = function () {
        var res = this._root;
        if (res === null) {
            return null;
        }
        while (res.left !== null) {
            res = res.left;
        }
        return res.data;
    };
    ;
    TreeBase.prototype.max = function () {
        var res = this._root;
        if (res === null) {
            return null;
        }
        while (res.right !== null) {
            res = res.right;
        }
        return res.data;
    };
    ;
    TreeBase.prototype.iterator = function () {
        return new Iterator(this);
    };
    ;
    TreeBase.prototype.each = function (cb) {
        var it = this.iterator(), data;
        while ((data = it.next()) !== null) {
            cb(data);
        }
    };
    ;
    TreeBase.prototype.reach = function (cb) {
        var it = this.iterator(), data;
        while ((data = it.prev()) !== null) {
            cb(data);
        }
    };
    ;
    TreeBase.prototype._bound = function (data, cmp) {
        var cur = this._root;
        var iter = this.iterator();
        while (cur !== null) {
            var c = this._comparator(data, cur.data);
            if (c === 0) {
                iter._cursor = cur;
                return iter;
            }
            iter._ancestors.push(cur);
            cur = cur.get_child(c > 0);
        }
        for (var i = iter._ancestors.length - 1; i >= 0; --i) {
            cur = iter._ancestors[i];
            if (cmp(data, cur.data) > 0) {
                iter._cursor = cur;
                iter._ancestors.length = i;
                return iter;
            }
        }
        iter._ancestors.length = 0;
        return iter;
    };
    ;
    return TreeBase;
}());
exports.TreeBase = TreeBase;
var Iterator = (function () {
    function Iterator(tree) {
        this._tree = tree;
        this._ancestors = [];
        this._cursor = null;
    }
    Iterator.prototype.data = function () {
        return this._cursor !== null ? this._cursor.data : null;
    };
    ;
    Iterator.prototype.next = function () {
        if (this._cursor === null) {
            var root = this._tree._root;
            if (root !== null) {
                this._minNode(root);
            }
        }
        else {
            if (this._cursor.right === null) {
                var save;
                do {
                    save = this._cursor;
                    if (this._ancestors.length) {
                        this._cursor = this._ancestors.pop();
                    }
                    else {
                        this._cursor = null;
                        break;
                    }
                } while (this._cursor.right === save);
            }
            else {
                this._ancestors.push(this._cursor);
                this._minNode(this._cursor.right);
            }
        }
        return this._cursor !== null ? this._cursor.data : null;
    };
    ;
    Iterator.prototype.prev = function () {
        if (this._cursor === null) {
            var root = this._tree._root;
            if (root !== null) {
                this._maxNode(root);
            }
        }
        else {
            if (this._cursor.left === null) {
                var save;
                do {
                    save = this._cursor;
                    if (this._ancestors.length) {
                        this._cursor = this._ancestors.pop();
                    }
                    else {
                        this._cursor = null;
                        break;
                    }
                } while (this._cursor.left === save);
            }
            else {
                this._ancestors.push(this._cursor);
                this._maxNode(this._cursor.left);
            }
        }
        return this._cursor !== null ? this._cursor.data : null;
    };
    ;
    Iterator.prototype._minNode = function (start) {
        while (start.left !== null) {
            this._ancestors.push(start);
            start = start.left;
        }
        this._cursor = start;
    };
    ;
    Iterator.prototype._maxNode = function (start) {
        while (start.right !== null) {
            this._ancestors.push(start);
            start = start.right;
        }
        this._cursor = start;
    };
    ;
    return Iterator;
}());
exports.Iterator = Iterator;
var Node = (function () {
    function Node(data) {
        this.data = data;
        this.left = null;
        this.right = null;
        this.red = true;
    }
    Node.prototype.get_child = function (dir) {
        return dir ? this.right : this.left;
    };
    ;
    Node.prototype.set_child = function (dir, val) {
        if (dir) {
            this.right = val;
        }
        else {
            this.left = val;
        }
    };
    ;
    return Node;
}());
var RBTree = (function (_super) {
    __extends(RBTree, _super);
    function RBTree(comparator) {
        var _this = _super.call(this) || this;
        _this._root = null;
        _this._comparator = comparator;
        _this.size = 0;
        return _this;
    }
    RBTree.prototype.insert = function (data) {
        var ret = false;
        if (this._root === null) {
            this._root = new Node(data);
            ret = true;
            this.size++;
        }
        else {
            var head = new Node(undefined);
            var dir = false;
            var last = false;
            var gp = null;
            var ggp = head;
            var p = null;
            var node = this._root;
            ggp.right = this._root;
            while (true) {
                if (node === null) {
                    node = new Node(data);
                    p.set_child(dir, node);
                    ret = true;
                    this.size++;
                }
                else if (RBTree.is_red(node.left) && RBTree.is_red(node.right)) {
                    node.red = true;
                    node.left.red = false;
                    node.right.red = false;
                }
                if (RBTree.is_red(node) && RBTree.is_red(p)) {
                    var dir2 = ggp.right === gp;
                    if (node === p.get_child(last)) {
                        ggp.set_child(dir2, RBTree.single_rotate(gp, !last));
                    }
                    else {
                        ggp.set_child(dir2, RBTree.double_rotate(gp, !last));
                    }
                }
                var cmp = this._comparator(node.data, data);
                if (cmp === 0) {
                    break;
                }
                last = dir;
                dir = cmp < 0;
                if (gp !== null) {
                    ggp = gp;
                }
                gp = p;
                p = node;
                node = node.get_child(dir);
            }
            this._root = head.right;
        }
        this._root.red = false;
        return ret;
    };
    ;
    RBTree.prototype.remove = function (data) {
        if (this._root === null) {
            return false;
        }
        var head = new Node(undefined);
        var node = head;
        node.right = this._root;
        var p = null;
        var gp = null;
        var found = null;
        var dir = true;
        while (node.get_child(dir) !== null) {
            var last = dir;
            gp = p;
            p = node;
            node = node.get_child(dir);
            var cmp = this._comparator(data, node.data);
            dir = cmp > 0;
            if (cmp === 0) {
                found = node;
            }
            if (!RBTree.is_red(node) && !RBTree.is_red(node.get_child(dir))) {
                if (RBTree.is_red(node.get_child(!dir))) {
                    var sr = RBTree.single_rotate(node, dir);
                    p.set_child(last, sr);
                    p = sr;
                }
                else if (!RBTree.is_red(node.get_child(!dir))) {
                    var sibling = p.get_child(!last);
                    if (sibling !== null) {
                        if (!RBTree.is_red(sibling.get_child(!last)) && !RBTree.is_red(sibling.get_child(last))) {
                            p.red = false;
                            sibling.red = true;
                            node.red = true;
                        }
                        else {
                            var dir2 = gp.right === p;
                            if (RBTree.is_red(sibling.get_child(last))) {
                                gp.set_child(dir2, RBTree.double_rotate(p, last));
                            }
                            else if (RBTree.is_red(sibling.get_child(!last))) {
                                gp.set_child(dir2, RBTree.single_rotate(p, last));
                            }
                            var gpc = gp.get_child(dir2);
                            gpc.red = true;
                            node.red = true;
                            gpc.left.red = false;
                            gpc.right.red = false;
                        }
                    }
                }
            }
        }
        if (found !== null) {
            found.data = node.data;
            p.set_child(p.right === node, node.get_child(node.left === null));
            this.size--;
        }
        this._root = head.right;
        if (this._root !== null) {
            this._root.red = false;
        }
        return found !== null;
    };
    ;
    RBTree.is_red = function (node) {
        return node !== null && node.red;
    };
    RBTree.single_rotate = function (root, dir) {
        var save = root.get_child(!dir);
        root.set_child(!dir, save.get_child(dir));
        save.set_child(dir, root);
        root.red = true;
        save.red = false;
        return save;
    };
    RBTree.double_rotate = function (root, dir) {
        root.set_child(!dir, RBTree.single_rotate(root.get_child(!dir), !dir));
        return RBTree.single_rotate(root, dir);
    };
    return RBTree;
}(TreeBase));
exports.RBTree = RBTree;
//# sourceMappingURL=rbtree.js.map

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PairingHeap = (function () {
    function PairingHeap(elem) {
        this.elem = elem;
        this.subheaps = [];
    }
    PairingHeap.prototype.toString = function (selector) {
        var str = "", needComma = false;
        for (var i = 0; i < this.subheaps.length; ++i) {
            var subheap = this.subheaps[i];
            if (!subheap.elem) {
                needComma = false;
                continue;
            }
            if (needComma) {
                str = str + ",";
            }
            str = str + subheap.toString(selector);
            needComma = true;
        }
        if (str !== "") {
            str = "(" + str + ")";
        }
        return (this.elem ? selector(this.elem) : "") + str;
    };
    PairingHeap.prototype.forEach = function (f) {
        if (!this.empty()) {
            f(this.elem, this);
            this.subheaps.forEach(function (s) { return s.forEach(f); });
        }
    };
    PairingHeap.prototype.count = function () {
        return this.empty() ? 0 : 1 + this.subheaps.reduce(function (n, h) {
            return n + h.count();
        }, 0);
    };
    PairingHeap.prototype.min = function () {
        return this.elem;
    };
    PairingHeap.prototype.empty = function () {
        return this.elem == null;
    };
    PairingHeap.prototype.contains = function (h) {
        if (this === h)
            return true;
        for (var i = 0; i < this.subheaps.length; i++) {
            if (this.subheaps[i].contains(h))
                return true;
        }
        return false;
    };
    PairingHeap.prototype.isHeap = function (lessThan) {
        var _this = this;
        return this.subheaps.every(function (h) { return lessThan(_this.elem, h.elem) && h.isHeap(lessThan); });
    };
    PairingHeap.prototype.insert = function (obj, lessThan) {
        return this.merge(new PairingHeap(obj), lessThan);
    };
    PairingHeap.prototype.merge = function (heap2, lessThan) {
        if (this.empty())
            return heap2;
        else if (heap2.empty())
            return this;
        else if (lessThan(this.elem, heap2.elem)) {
            this.subheaps.push(heap2);
            return this;
        }
        else {
            heap2.subheaps.push(this);
            return heap2;
        }
    };
    PairingHeap.prototype.removeMin = function (lessThan) {
        if (this.empty())
            return null;
        else
            return this.mergePairs(lessThan);
    };
    PairingHeap.prototype.mergePairs = function (lessThan) {
        if (this.subheaps.length == 0)
            return new PairingHeap(null);
        else if (this.subheaps.length == 1) {
            return this.subheaps[0];
        }
        else {
            var firstPair = this.subheaps.pop().merge(this.subheaps.pop(), lessThan);
            var remaining = this.mergePairs(lessThan);
            return firstPair.merge(remaining, lessThan);
        }
    };
    PairingHeap.prototype.decreaseKey = function (subheap, newValue, setHeapNode, lessThan) {
        var newHeap = subheap.removeMin(lessThan);
        subheap.elem = newHeap.elem;
        subheap.subheaps = newHeap.subheaps;
        if (setHeapNode !== null && newHeap.elem !== null) {
            setHeapNode(subheap.elem, subheap);
        }
        var pairingNode = new PairingHeap(newValue);
        if (setHeapNode !== null) {
            setHeapNode(newValue, pairingNode);
        }
        return this.merge(pairingNode, lessThan);
    };
    return PairingHeap;
}());
exports.PairingHeap = PairingHeap;
var PriorityQueue = (function () {
    function PriorityQueue(lessThan) {
        this.lessThan = lessThan;
    }
    PriorityQueue.prototype.top = function () {
        if (this.empty()) {
            return null;
        }
        return this.root.elem;
    };
    PriorityQueue.prototype.push = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var pairingNode;
        for (var i = 0, arg; arg = args[i]; ++i) {
            pairingNode = new PairingHeap(arg);
            this.root = this.empty() ?
                pairingNode : this.root.merge(pairingNode, this.lessThan);
        }
        return pairingNode;
    };
    PriorityQueue.prototype.empty = function () {
        return !this.root || !this.root.elem;
    };
    PriorityQueue.prototype.isHeap = function () {
        return this.root.isHeap(this.lessThan);
    };
    PriorityQueue.prototype.forEach = function (f) {
        this.root.forEach(f);
    };
    PriorityQueue.prototype.pop = function () {
        if (this.empty()) {
            return null;
        }
        var obj = this.root.min();
        this.root = this.root.removeMin(this.lessThan);
        return obj;
    };
    PriorityQueue.prototype.reduceKey = function (heapNode, newKey, setHeapNode) {
        if (setHeapNode === void 0) { setHeapNode = null; }
        this.root = this.root.decreaseKey(heapNode, newKey, setHeapNode, this.lessThan);
    };
    PriorityQueue.prototype.toString = function (selector) {
        return this.root.toString(selector);
    };
    PriorityQueue.prototype.count = function () {
        return this.root.count();
    };
    return PriorityQueue;
}());
exports.PriorityQueue = PriorityQueue;
//# sourceMappingURL=pqueue.js.map

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var rectangle_1 = __webpack_require__(4);
var Point = (function () {
    function Point() {
    }
    return Point;
}());
exports.Point = Point;
var LineSegment = (function () {
    function LineSegment(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    return LineSegment;
}());
exports.LineSegment = LineSegment;
var PolyPoint = (function (_super) {
    __extends(PolyPoint, _super);
    function PolyPoint() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PolyPoint;
}(Point));
exports.PolyPoint = PolyPoint;
function isLeft(P0, P1, P2) {
    return (P1.x - P0.x) * (P2.y - P0.y) - (P2.x - P0.x) * (P1.y - P0.y);
}
exports.isLeft = isLeft;
function above(p, vi, vj) {
    return isLeft(p, vi, vj) > 0;
}
function below(p, vi, vj) {
    return isLeft(p, vi, vj) < 0;
}
function ConvexHull(S) {
    var P = S.slice(0).sort(function (a, b) { return a.x !== b.x ? b.x - a.x : b.y - a.y; });
    var n = S.length, i;
    var minmin = 0;
    var xmin = P[0].x;
    for (i = 1; i < n; ++i) {
        if (P[i].x !== xmin)
            break;
    }
    var minmax = i - 1;
    var H = [];
    H.push(P[minmin]);
    if (minmax === n - 1) {
        if (P[minmax].y !== P[minmin].y)
            H.push(P[minmax]);
    }
    else {
        var maxmin, maxmax = n - 1;
        var xmax = P[n - 1].x;
        for (i = n - 2; i >= 0; i--)
            if (P[i].x !== xmax)
                break;
        maxmin = i + 1;
        i = minmax;
        while (++i <= maxmin) {
            if (isLeft(P[minmin], P[maxmin], P[i]) >= 0 && i < maxmin)
                continue;
            while (H.length > 1) {
                if (isLeft(H[H.length - 2], H[H.length - 1], P[i]) > 0)
                    break;
                else
                    H.length -= 1;
            }
            if (i != minmin)
                H.push(P[i]);
        }
        if (maxmax != maxmin)
            H.push(P[maxmax]);
        var bot = H.length;
        i = maxmin;
        while (--i >= minmax) {
            if (isLeft(P[maxmax], P[minmax], P[i]) >= 0 && i > minmax)
                continue;
            while (H.length > bot) {
                if (isLeft(H[H.length - 2], H[H.length - 1], P[i]) > 0)
                    break;
                else
                    H.length -= 1;
            }
            if (i != minmin)
                H.push(P[i]);
        }
    }
    return H;
}
exports.ConvexHull = ConvexHull;
function clockwiseRadialSweep(p, P, f) {
    P.slice(0).sort(function (a, b) { return Math.atan2(a.y - p.y, a.x - p.x) - Math.atan2(b.y - p.y, b.x - p.x); }).forEach(f);
}
exports.clockwiseRadialSweep = clockwiseRadialSweep;
function nextPolyPoint(p, ps) {
    if (p.polyIndex === ps.length - 1)
        return ps[0];
    return ps[p.polyIndex + 1];
}
function prevPolyPoint(p, ps) {
    if (p.polyIndex === 0)
        return ps[ps.length - 1];
    return ps[p.polyIndex - 1];
}
function tangent_PointPolyC(P, V) {
    return { rtan: Rtangent_PointPolyC(P, V), ltan: Ltangent_PointPolyC(P, V) };
}
function Rtangent_PointPolyC(P, V) {
    var n = V.length - 1;
    var a, b, c;
    var upA, dnC;
    if (below(P, V[1], V[0]) && !above(P, V[n - 1], V[0]))
        return 0;
    for (a = 0, b = n;;) {
        if (b - a === 1)
            if (above(P, V[a], V[b]))
                return a;
            else
                return b;
        c = Math.floor((a + b) / 2);
        dnC = below(P, V[c + 1], V[c]);
        if (dnC && !above(P, V[c - 1], V[c]))
            return c;
        upA = above(P, V[a + 1], V[a]);
        if (upA) {
            if (dnC)
                b = c;
            else {
                if (above(P, V[a], V[c]))
                    b = c;
                else
                    a = c;
            }
        }
        else {
            if (!dnC)
                a = c;
            else {
                if (below(P, V[a], V[c]))
                    b = c;
                else
                    a = c;
            }
        }
    }
}
function Ltangent_PointPolyC(P, V) {
    var n = V.length - 1;
    var a, b, c;
    var dnA, dnC;
    if (above(P, V[n - 1], V[0]) && !below(P, V[1], V[0]))
        return 0;
    for (a = 0, b = n;;) {
        if (b - a === 1)
            if (below(P, V[a], V[b]))
                return a;
            else
                return b;
        c = Math.floor((a + b) / 2);
        dnC = below(P, V[c + 1], V[c]);
        if (above(P, V[c - 1], V[c]) && !dnC)
            return c;
        dnA = below(P, V[a + 1], V[a]);
        if (dnA) {
            if (!dnC)
                b = c;
            else {
                if (below(P, V[a], V[c]))
                    b = c;
                else
                    a = c;
            }
        }
        else {
            if (dnC)
                a = c;
            else {
                if (above(P, V[a], V[c]))
                    b = c;
                else
                    a = c;
            }
        }
    }
}
function tangent_PolyPolyC(V, W, t1, t2, cmp1, cmp2) {
    var ix1, ix2;
    ix1 = t1(W[0], V);
    ix2 = t2(V[ix1], W);
    var done = false;
    while (!done) {
        done = true;
        while (true) {
            if (ix1 === V.length - 1)
                ix1 = 0;
            if (cmp1(W[ix2], V[ix1], V[ix1 + 1]))
                break;
            ++ix1;
        }
        while (true) {
            if (ix2 === 0)
                ix2 = W.length - 1;
            if (cmp2(V[ix1], W[ix2], W[ix2 - 1]))
                break;
            --ix2;
            done = false;
        }
    }
    return { t1: ix1, t2: ix2 };
}
exports.tangent_PolyPolyC = tangent_PolyPolyC;
function LRtangent_PolyPolyC(V, W) {
    var rl = RLtangent_PolyPolyC(W, V);
    return { t1: rl.t2, t2: rl.t1 };
}
exports.LRtangent_PolyPolyC = LRtangent_PolyPolyC;
function RLtangent_PolyPolyC(V, W) {
    return tangent_PolyPolyC(V, W, Rtangent_PointPolyC, Ltangent_PointPolyC, above, below);
}
exports.RLtangent_PolyPolyC = RLtangent_PolyPolyC;
function LLtangent_PolyPolyC(V, W) {
    return tangent_PolyPolyC(V, W, Ltangent_PointPolyC, Ltangent_PointPolyC, below, below);
}
exports.LLtangent_PolyPolyC = LLtangent_PolyPolyC;
function RRtangent_PolyPolyC(V, W) {
    return tangent_PolyPolyC(V, W, Rtangent_PointPolyC, Rtangent_PointPolyC, above, above);
}
exports.RRtangent_PolyPolyC = RRtangent_PolyPolyC;
var BiTangent = (function () {
    function BiTangent(t1, t2) {
        this.t1 = t1;
        this.t2 = t2;
    }
    return BiTangent;
}());
exports.BiTangent = BiTangent;
var BiTangents = (function () {
    function BiTangents() {
    }
    return BiTangents;
}());
exports.BiTangents = BiTangents;
var TVGPoint = (function (_super) {
    __extends(TVGPoint, _super);
    function TVGPoint() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TVGPoint;
}(Point));
exports.TVGPoint = TVGPoint;
var VisibilityVertex = (function () {
    function VisibilityVertex(id, polyid, polyvertid, p) {
        this.id = id;
        this.polyid = polyid;
        this.polyvertid = polyvertid;
        this.p = p;
        p.vv = this;
    }
    return VisibilityVertex;
}());
exports.VisibilityVertex = VisibilityVertex;
var VisibilityEdge = (function () {
    function VisibilityEdge(source, target) {
        this.source = source;
        this.target = target;
    }
    VisibilityEdge.prototype.length = function () {
        var dx = this.source.p.x - this.target.p.x;
        var dy = this.source.p.y - this.target.p.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    return VisibilityEdge;
}());
exports.VisibilityEdge = VisibilityEdge;
var TangentVisibilityGraph = (function () {
    function TangentVisibilityGraph(P, g0) {
        this.P = P;
        this.V = [];
        this.E = [];
        if (!g0) {
            var n = P.length;
            for (var i = 0; i < n; i++) {
                var p = P[i];
                for (var j = 0; j < p.length; ++j) {
                    var pj = p[j], vv = new VisibilityVertex(this.V.length, i, j, pj);
                    this.V.push(vv);
                    if (j > 0)
                        this.E.push(new VisibilityEdge(p[j - 1].vv, vv));
                }
            }
            for (var i = 0; i < n - 1; i++) {
                var Pi = P[i];
                for (var j = i + 1; j < n; j++) {
                    var Pj = P[j], t = tangents(Pi, Pj);
                    for (var q in t) {
                        var c = t[q], source = Pi[c.t1], target = Pj[c.t2];
                        this.addEdgeIfVisible(source, target, i, j);
                    }
                }
            }
        }
        else {
            this.V = g0.V.slice(0);
            this.E = g0.E.slice(0);
        }
    }
    TangentVisibilityGraph.prototype.addEdgeIfVisible = function (u, v, i1, i2) {
        if (!this.intersectsPolys(new LineSegment(u.x, u.y, v.x, v.y), i1, i2)) {
            this.E.push(new VisibilityEdge(u.vv, v.vv));
        }
    };
    TangentVisibilityGraph.prototype.addPoint = function (p, i1) {
        var n = this.P.length;
        this.V.push(new VisibilityVertex(this.V.length, n, 0, p));
        for (var i = 0; i < n; ++i) {
            if (i === i1)
                continue;
            var poly = this.P[i], t = tangent_PointPolyC(p, poly);
            this.addEdgeIfVisible(p, poly[t.ltan], i1, i);
            this.addEdgeIfVisible(p, poly[t.rtan], i1, i);
        }
        return p.vv;
    };
    TangentVisibilityGraph.prototype.intersectsPolys = function (l, i1, i2) {
        for (var i = 0, n = this.P.length; i < n; ++i) {
            if (i != i1 && i != i2 && intersects(l, this.P[i]).length > 0) {
                return true;
            }
        }
        return false;
    };
    return TangentVisibilityGraph;
}());
exports.TangentVisibilityGraph = TangentVisibilityGraph;
function intersects(l, P) {
    var ints = [];
    for (var i = 1, n = P.length; i < n; ++i) {
        var int = rectangle_1.Rectangle.lineIntersection(l.x1, l.y1, l.x2, l.y2, P[i - 1].x, P[i - 1].y, P[i].x, P[i].y);
        if (int)
            ints.push(int);
    }
    return ints;
}
function tangents(V, W) {
    var m = V.length - 1, n = W.length - 1;
    var bt = new BiTangents();
    for (var i = 0; i < m; ++i) {
        for (var j = 0; j < n; ++j) {
            var v1 = V[i == 0 ? m - 1 : i - 1];
            var v2 = V[i];
            var v3 = V[i + 1];
            var w1 = W[j == 0 ? n - 1 : j - 1];
            var w2 = W[j];
            var w3 = W[j + 1];
            var v1v2w2 = isLeft(v1, v2, w2);
            var v2w1w2 = isLeft(v2, w1, w2);
            var v2w2w3 = isLeft(v2, w2, w3);
            var w1w2v2 = isLeft(w1, w2, v2);
            var w2v1v2 = isLeft(w2, v1, v2);
            var w2v2v3 = isLeft(w2, v2, v3);
            if (v1v2w2 >= 0 && v2w1w2 >= 0 && v2w2w3 < 0
                && w1w2v2 >= 0 && w2v1v2 >= 0 && w2v2v3 < 0) {
                bt.ll = new BiTangent(i, j);
            }
            else if (v1v2w2 <= 0 && v2w1w2 <= 0 && v2w2w3 > 0
                && w1w2v2 <= 0 && w2v1v2 <= 0 && w2v2v3 > 0) {
                bt.rr = new BiTangent(i, j);
            }
            else if (v1v2w2 <= 0 && v2w1w2 > 0 && v2w2w3 <= 0
                && w1w2v2 >= 0 && w2v1v2 < 0 && w2v2v3 >= 0) {
                bt.rl = new BiTangent(i, j);
            }
            else if (v1v2w2 >= 0 && v2w1w2 < 0 && v2w2w3 >= 0
                && w1w2v2 <= 0 && w2v1v2 > 0 && w2v2v3 <= 0) {
                bt.lr = new BiTangent(i, j);
            }
        }
    }
    return bt;
}
exports.tangents = tangents;
function isPointInsidePoly(p, poly) {
    for (var i = 1, n = poly.length; i < n; ++i)
        if (below(poly[i - 1], poly[i], p))
            return false;
    return true;
}
function isAnyPInQ(p, q) {
    return !p.every(function (v) { return !isPointInsidePoly(v, q); });
}
function polysOverlap(p, q) {
    if (isAnyPInQ(p, q))
        return true;
    if (isAnyPInQ(q, p))
        return true;
    for (var i = 1, n = p.length; i < n; ++i) {
        var v = p[i], u = p[i - 1];
        if (intersects(new LineSegment(u.x, u.y, v.x, v.y), q).length > 0)
            return true;
    }
    return false;
}
exports.polysOverlap = polysOverlap;
//# sourceMappingURL=geom.js.map

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var packingOptions = {
    PADDING: 10,
    GOLDEN_SECTION: (1 + Math.sqrt(5)) / 2,
    FLOAT_EPSILON: 0.0001,
    MAX_INERATIONS: 100
};
function applyPacking(graphs, w, h, node_size, desired_ratio) {
    if (desired_ratio === void 0) { desired_ratio = 1; }
    var init_x = 0, init_y = 0, svg_width = w, svg_height = h, desired_ratio = typeof desired_ratio !== 'undefined' ? desired_ratio : 1, node_size = typeof node_size !== 'undefined' ? node_size : 0, real_width = 0, real_height = 0, min_width = 0, global_bottom = 0, line = [];
    if (graphs.length == 0)
        return;
    calculate_bb(graphs);
    apply(graphs, desired_ratio);
    put_nodes_to_right_positions(graphs);
    function calculate_bb(graphs) {
        graphs.forEach(function (g) {
            calculate_single_bb(g);
        });
        function calculate_single_bb(graph) {
            var min_x = Number.MAX_VALUE, min_y = Number.MAX_VALUE, max_x = 0, max_y = 0;
            graph.array.forEach(function (v) {
                var w = typeof v.width !== 'undefined' ? v.width : node_size;
                var h = typeof v.height !== 'undefined' ? v.height : node_size;
                w /= 2;
                h /= 2;
                max_x = Math.max(v.x + w, max_x);
                min_x = Math.min(v.x - w, min_x);
                max_y = Math.max(v.y + h, max_y);
                min_y = Math.min(v.y - h, min_y);
            });
            graph.width = max_x - min_x;
            graph.height = max_y - min_y;
        }
    }
    function put_nodes_to_right_positions(graphs) {
        graphs.forEach(function (g) {
            var center = { x: 0, y: 0 };
            g.array.forEach(function (node) {
                center.x += node.x;
                center.y += node.y;
            });
            center.x /= g.array.length;
            center.y /= g.array.length;
            var corner = { x: center.x - g.width / 2, y: center.y - g.height / 2 };
            var offset = { x: g.x - corner.x + svg_width / 2 - real_width / 2, y: g.y - corner.y + svg_height / 2 - real_height / 2 };
            g.array.forEach(function (node) {
                node.x += offset.x;
                node.y += offset.y;
            });
        });
    }
    function apply(data, desired_ratio) {
        var curr_best_f = Number.POSITIVE_INFINITY;
        var curr_best = 0;
        data.sort(function (a, b) { return b.height - a.height; });
        min_width = data.reduce(function (a, b) {
            return a.width < b.width ? a.width : b.width;
        });
        var left = x1 = min_width;
        var right = x2 = get_entire_width(data);
        var iterationCounter = 0;
        var f_x1 = Number.MAX_VALUE;
        var f_x2 = Number.MAX_VALUE;
        var flag = -1;
        var dx = Number.MAX_VALUE;
        var df = Number.MAX_VALUE;
        while ((dx > min_width) || df > packingOptions.FLOAT_EPSILON) {
            if (flag != 1) {
                var x1 = right - (right - left) / packingOptions.GOLDEN_SECTION;
                var f_x1 = step(data, x1);
            }
            if (flag != 0) {
                var x2 = left + (right - left) / packingOptions.GOLDEN_SECTION;
                var f_x2 = step(data, x2);
            }
            dx = Math.abs(x1 - x2);
            df = Math.abs(f_x1 - f_x2);
            if (f_x1 < curr_best_f) {
                curr_best_f = f_x1;
                curr_best = x1;
            }
            if (f_x2 < curr_best_f) {
                curr_best_f = f_x2;
                curr_best = x2;
            }
            if (f_x1 > f_x2) {
                left = x1;
                x1 = x2;
                f_x1 = f_x2;
                flag = 1;
            }
            else {
                right = x2;
                x2 = x1;
                f_x2 = f_x1;
                flag = 0;
            }
            if (iterationCounter++ > 100) {
                break;
            }
        }
        step(data, curr_best);
    }
    function step(data, max_width) {
        line = [];
        real_width = 0;
        real_height = 0;
        global_bottom = init_y;
        for (var i = 0; i < data.length; i++) {
            var o = data[i];
            put_rect(o, max_width);
        }
        return Math.abs(get_real_ratio() - desired_ratio);
    }
    function put_rect(rect, max_width) {
        var parent = undefined;
        for (var i = 0; i < line.length; i++) {
            if ((line[i].space_left >= rect.height) && (line[i].x + line[i].width + rect.width + packingOptions.PADDING - max_width) <= packingOptions.FLOAT_EPSILON) {
                parent = line[i];
                break;
            }
        }
        line.push(rect);
        if (parent !== undefined) {
            rect.x = parent.x + parent.width + packingOptions.PADDING;
            rect.y = parent.bottom;
            rect.space_left = rect.height;
            rect.bottom = rect.y;
            parent.space_left -= rect.height + packingOptions.PADDING;
            parent.bottom += rect.height + packingOptions.PADDING;
        }
        else {
            rect.y = global_bottom;
            global_bottom += rect.height + packingOptions.PADDING;
            rect.x = init_x;
            rect.bottom = rect.y;
            rect.space_left = rect.height;
        }
        if (rect.y + rect.height - real_height > -packingOptions.FLOAT_EPSILON)
            real_height = rect.y + rect.height - init_y;
        if (rect.x + rect.width - real_width > -packingOptions.FLOAT_EPSILON)
            real_width = rect.x + rect.width - init_x;
    }
    ;
    function get_entire_width(data) {
        var width = 0;
        data.forEach(function (d) { return width += d.width + packingOptions.PADDING; });
        return width;
    }
    function get_real_ratio() {
        return (real_width / real_height);
    }
}
exports.applyPacking = applyPacking;
function separateGraphs(nodes, links) {
    var marks = {};
    var ways = {};
    var graphs = [];
    var clusters = 0;
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var n1 = link.source;
        var n2 = link.target;
        if (ways[n1.index])
            ways[n1.index].push(n2);
        else
            ways[n1.index] = [n2];
        if (ways[n2.index])
            ways[n2.index].push(n1);
        else
            ways[n2.index] = [n1];
    }
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (marks[node.index])
            continue;
        explore_node(node, true);
    }
    function explore_node(n, is_new) {
        if (marks[n.index] !== undefined)
            return;
        if (is_new) {
            clusters++;
            graphs.push({ array: [] });
        }
        marks[n.index] = clusters;
        graphs[clusters - 1].array.push(n);
        var adjacent = ways[n.index];
        if (!adjacent)
            return;
        for (var j = 0; j < adjacent.length; j++) {
            explore_node(adjacent[j], false);
        }
    }
    return graphs;
}
exports.separateGraphs = separateGraphs;
//# sourceMappingURL=handledisconnected.js.map

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var rectangle_1 = __webpack_require__(4);
var vpsc_1 = __webpack_require__(9);
var shortestpaths_1 = __webpack_require__(6);
var NodeWrapper = (function () {
    function NodeWrapper(id, rect, children) {
        this.id = id;
        this.rect = rect;
        this.children = children;
        this.leaf = typeof children === 'undefined' || children.length === 0;
    }
    return NodeWrapper;
}());
exports.NodeWrapper = NodeWrapper;
var Vert = (function () {
    function Vert(id, x, y, node, line) {
        if (node === void 0) { node = null; }
        if (line === void 0) { line = null; }
        this.id = id;
        this.x = x;
        this.y = y;
        this.node = node;
        this.line = line;
    }
    return Vert;
}());
exports.Vert = Vert;
var LongestCommonSubsequence = (function () {
    function LongestCommonSubsequence(s, t) {
        this.s = s;
        this.t = t;
        var mf = LongestCommonSubsequence.findMatch(s, t);
        var tr = t.slice(0).reverse();
        var mr = LongestCommonSubsequence.findMatch(s, tr);
        if (mf.length >= mr.length) {
            this.length = mf.length;
            this.si = mf.si;
            this.ti = mf.ti;
            this.reversed = false;
        }
        else {
            this.length = mr.length;
            this.si = mr.si;
            this.ti = t.length - mr.ti - mr.length;
            this.reversed = true;
        }
    }
    LongestCommonSubsequence.findMatch = function (s, t) {
        var m = s.length;
        var n = t.length;
        var match = { length: 0, si: -1, ti: -1 };
        var l = new Array(m);
        for (var i = 0; i < m; i++) {
            l[i] = new Array(n);
            for (var j = 0; j < n; j++)
                if (s[i] === t[j]) {
                    var v = l[i][j] = (i === 0 || j === 0) ? 1 : l[i - 1][j - 1] + 1;
                    if (v > match.length) {
                        match.length = v;
                        match.si = i - v + 1;
                        match.ti = j - v + 1;
                    }
                    ;
                }
                else
                    l[i][j] = 0;
        }
        return match;
    };
    LongestCommonSubsequence.prototype.getSequence = function () {
        return this.length >= 0 ? this.s.slice(this.si, this.si + this.length) : [];
    };
    return LongestCommonSubsequence;
}());
exports.LongestCommonSubsequence = LongestCommonSubsequence;
var GridRouter = (function () {
    function GridRouter(originalnodes, accessor, groupPadding) {
        if (groupPadding === void 0) { groupPadding = 12; }
        var _this = this;
        this.originalnodes = originalnodes;
        this.groupPadding = groupPadding;
        this.leaves = null;
        this.nodes = originalnodes.map(function (v, i) { return new NodeWrapper(i, accessor.getBounds(v), accessor.getChildren(v)); });
        this.leaves = this.nodes.filter(function (v) { return v.leaf; });
        this.groups = this.nodes.filter(function (g) { return !g.leaf; });
        this.cols = this.getGridLines('x');
        this.rows = this.getGridLines('y');
        this.groups.forEach(function (v) {
            return v.children.forEach(function (c) { return _this.nodes[c].parent = v; });
        });
        this.root = { children: [] };
        this.nodes.forEach(function (v) {
            if (typeof v.parent === 'undefined') {
                v.parent = _this.root;
                _this.root.children.push(v.id);
            }
            v.ports = [];
        });
        this.backToFront = this.nodes.slice(0);
        this.backToFront.sort(function (x, y) { return _this.getDepth(x) - _this.getDepth(y); });
        var frontToBackGroups = this.backToFront.slice(0).reverse().filter(function (g) { return !g.leaf; });
        frontToBackGroups.forEach(function (v) {
            var r = rectangle_1.Rectangle.empty();
            v.children.forEach(function (c) { return r = r.union(_this.nodes[c].rect); });
            v.rect = r.inflate(_this.groupPadding);
        });
        var colMids = this.midPoints(this.cols.map(function (r) { return r.pos; }));
        var rowMids = this.midPoints(this.rows.map(function (r) { return r.pos; }));
        var rowx = colMids[0], rowX = colMids[colMids.length - 1];
        var coly = rowMids[0], colY = rowMids[rowMids.length - 1];
        var hlines = this.rows.map(function (r) { return ({ x1: rowx, x2: rowX, y1: r.pos, y2: r.pos }); })
            .concat(rowMids.map(function (m) { return ({ x1: rowx, x2: rowX, y1: m, y2: m }); }));
        var vlines = this.cols.map(function (c) { return ({ x1: c.pos, x2: c.pos, y1: coly, y2: colY }); })
            .concat(colMids.map(function (m) { return ({ x1: m, x2: m, y1: coly, y2: colY }); }));
        var lines = hlines.concat(vlines);
        lines.forEach(function (l) { return l.verts = []; });
        this.verts = [];
        this.edges = [];
        hlines.forEach(function (h) {
            return vlines.forEach(function (v) {
                var p = new Vert(_this.verts.length, v.x1, h.y1);
                h.verts.push(p);
                v.verts.push(p);
                _this.verts.push(p);
                var i = _this.backToFront.length;
                while (i-- > 0) {
                    var node = _this.backToFront[i], r = node.rect;
                    var dx = Math.abs(p.x - r.cx()), dy = Math.abs(p.y - r.cy());
                    if (dx < r.width() / 2 && dy < r.height() / 2) {
                        p.node = node;
                        break;
                    }
                }
            });
        });
        lines.forEach(function (l, li) {
            _this.nodes.forEach(function (v, i) {
                v.rect.lineIntersections(l.x1, l.y1, l.x2, l.y2).forEach(function (intersect, j) {
                    var p = new Vert(_this.verts.length, intersect.x, intersect.y, v, l);
                    _this.verts.push(p);
                    l.verts.push(p);
                    v.ports.push(p);
                });
            });
            var isHoriz = Math.abs(l.y1 - l.y2) < 0.1;
            var delta = function (a, b) { return isHoriz ? b.x - a.x : b.y - a.y; };
            l.verts.sort(delta);
            for (var i = 1; i < l.verts.length; i++) {
                var u = l.verts[i - 1], v = l.verts[i];
                if (u.node && u.node === v.node && u.node.leaf)
                    continue;
                _this.edges.push({ source: u.id, target: v.id, length: Math.abs(delta(u, v)) });
            }
        });
    }
    GridRouter.prototype.avg = function (a) { return a.reduce(function (x, y) { return x + y; }) / a.length; };
    GridRouter.prototype.getGridLines = function (axis) {
        var columns = [];
        var ls = this.leaves.slice(0, this.leaves.length);
        while (ls.length > 0) {
            var overlapping = ls.filter(function (v) { return v.rect['overlap' + axis.toUpperCase()](ls[0].rect); });
            var col = {
                nodes: overlapping,
                pos: this.avg(overlapping.map(function (v) { return v.rect['c' + axis](); }))
            };
            columns.push(col);
            col.nodes.forEach(function (v) { return ls.splice(ls.indexOf(v), 1); });
        }
        columns.sort(function (a, b) { return a.pos - b.pos; });
        return columns;
    };
    GridRouter.prototype.getDepth = function (v) {
        var depth = 0;
        while (v.parent !== this.root) {
            depth++;
            v = v.parent;
        }
        return depth;
    };
    GridRouter.prototype.midPoints = function (a) {
        var gap = a[1] - a[0];
        var mids = [a[0] - gap / 2];
        for (var i = 1; i < a.length; i++) {
            mids.push((a[i] + a[i - 1]) / 2);
        }
        mids.push(a[a.length - 1] + gap / 2);
        return mids;
    };
    GridRouter.prototype.findLineage = function (v) {
        var lineage = [v];
        do {
            v = v.parent;
            lineage.push(v);
        } while (v !== this.root);
        return lineage.reverse();
    };
    GridRouter.prototype.findAncestorPathBetween = function (a, b) {
        var aa = this.findLineage(a), ba = this.findLineage(b), i = 0;
        while (aa[i] === ba[i])
            i++;
        return { commonAncestor: aa[i - 1], lineages: aa.slice(i).concat(ba.slice(i)) };
    };
    GridRouter.prototype.siblingObstacles = function (a, b) {
        var _this = this;
        var path = this.findAncestorPathBetween(a, b);
        var lineageLookup = {};
        path.lineages.forEach(function (v) { return lineageLookup[v.id] = {}; });
        var obstacles = path.commonAncestor.children.filter(function (v) { return !(v in lineageLookup); });
        path.lineages
            .filter(function (v) { return v.parent !== path.commonAncestor; })
            .forEach(function (v) { return obstacles = obstacles.concat(v.parent.children.filter(function (c) { return c !== v.id; })); });
        return obstacles.map(function (v) { return _this.nodes[v]; });
    };
    GridRouter.getSegmentSets = function (routes, x, y) {
        var vsegments = [];
        for (var ei = 0; ei < routes.length; ei++) {
            var route = routes[ei];
            for (var si = 0; si < route.length; si++) {
                var s = route[si];
                s.edgeid = ei;
                s.i = si;
                var sdx = s[1][x] - s[0][x];
                if (Math.abs(sdx) < 0.1) {
                    vsegments.push(s);
                }
            }
        }
        vsegments.sort(function (a, b) { return a[0][x] - b[0][x]; });
        var vsegmentsets = [];
        var segmentset = null;
        for (var i = 0; i < vsegments.length; i++) {
            var s = vsegments[i];
            if (!segmentset || Math.abs(s[0][x] - segmentset.pos) > 0.1) {
                segmentset = { pos: s[0][x], segments: [] };
                vsegmentsets.push(segmentset);
            }
            segmentset.segments.push(s);
        }
        return vsegmentsets;
    };
    GridRouter.nudgeSegs = function (x, y, routes, segments, leftOf, gap) {
        var n = segments.length;
        if (n <= 1)
            return;
        var vs = segments.map(function (s) { return new vpsc_1.Variable(s[0][x]); });
        var cs = [];
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                if (i === j)
                    continue;
                var s1 = segments[i], s2 = segments[j], e1 = s1.edgeid, e2 = s2.edgeid, lind = -1, rind = -1;
                if (x == 'x') {
                    if (leftOf(e1, e2)) {
                        if (s1[0][y] < s1[1][y]) {
                            lind = j, rind = i;
                        }
                        else {
                            lind = i, rind = j;
                        }
                    }
                }
                else {
                    if (leftOf(e1, e2)) {
                        if (s1[0][y] < s1[1][y]) {
                            lind = i, rind = j;
                        }
                        else {
                            lind = j, rind = i;
                        }
                    }
                }
                if (lind >= 0) {
                    cs.push(new vpsc_1.Constraint(vs[lind], vs[rind], gap));
                }
            }
        }
        var solver = new vpsc_1.Solver(vs, cs);
        solver.solve();
        vs.forEach(function (v, i) {
            var s = segments[i];
            var pos = v.position();
            s[0][x] = s[1][x] = pos;
            var route = routes[s.edgeid];
            if (s.i > 0)
                route[s.i - 1][1][x] = pos;
            if (s.i < route.length - 1)
                route[s.i + 1][0][x] = pos;
        });
    };
    GridRouter.nudgeSegments = function (routes, x, y, leftOf, gap) {
        var vsegmentsets = GridRouter.getSegmentSets(routes, x, y);
        for (var i = 0; i < vsegmentsets.length; i++) {
            var ss = vsegmentsets[i];
            var events = [];
            for (var j = 0; j < ss.segments.length; j++) {
                var s = ss.segments[j];
                events.push({ type: 0, s: s, pos: Math.min(s[0][y], s[1][y]) });
                events.push({ type: 1, s: s, pos: Math.max(s[0][y], s[1][y]) });
            }
            events.sort(function (a, b) { return a.pos - b.pos + a.type - b.type; });
            var open = [];
            var openCount = 0;
            events.forEach(function (e) {
                if (e.type === 0) {
                    open.push(e.s);
                    openCount++;
                }
                else {
                    openCount--;
                }
                if (openCount == 0) {
                    GridRouter.nudgeSegs(x, y, routes, open, leftOf, gap);
                    open = [];
                }
            });
        }
    };
    GridRouter.prototype.routeEdges = function (edges, nudgeGap, source, target) {
        var _this = this;
        var routePaths = edges.map(function (e) { return _this.route(source(e), target(e)); });
        var order = GridRouter.orderEdges(routePaths);
        var routes = routePaths.map(function (e) { return GridRouter.makeSegments(e); });
        GridRouter.nudgeSegments(routes, 'x', 'y', order, nudgeGap);
        GridRouter.nudgeSegments(routes, 'y', 'x', order, nudgeGap);
        GridRouter.unreverseEdges(routes, routePaths);
        return routes;
    };
    GridRouter.unreverseEdges = function (routes, routePaths) {
        routes.forEach(function (segments, i) {
            var path = routePaths[i];
            if (path.reversed) {
                segments.reverse();
                segments.forEach(function (segment) {
                    segment.reverse();
                });
            }
        });
    };
    GridRouter.angleBetween2Lines = function (line1, line2) {
        var angle1 = Math.atan2(line1[0].y - line1[1].y, line1[0].x - line1[1].x);
        var angle2 = Math.atan2(line2[0].y - line2[1].y, line2[0].x - line2[1].x);
        var diff = angle1 - angle2;
        if (diff > Math.PI || diff < -Math.PI) {
            diff = angle2 - angle1;
        }
        return diff;
    };
    GridRouter.isLeft = function (a, b, c) {
        return ((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) <= 0;
    };
    GridRouter.getOrder = function (pairs) {
        var outgoing = {};
        for (var i = 0; i < pairs.length; i++) {
            var p = pairs[i];
            if (typeof outgoing[p.l] === 'undefined')
                outgoing[p.l] = {};
            outgoing[p.l][p.r] = true;
        }
        return function (l, r) { return typeof outgoing[l] !== 'undefined' && outgoing[l][r]; };
    };
    GridRouter.orderEdges = function (edges) {
        var edgeOrder = [];
        for (var i = 0; i < edges.length - 1; i++) {
            for (var j = i + 1; j < edges.length; j++) {
                var e = edges[i], f = edges[j], lcs = new LongestCommonSubsequence(e, f);
                var u, vi, vj;
                if (lcs.length === 0)
                    continue;
                if (lcs.reversed) {
                    f.reverse();
                    f.reversed = true;
                    lcs = new LongestCommonSubsequence(e, f);
                }
                if ((lcs.si <= 0 || lcs.ti <= 0) &&
                    (lcs.si + lcs.length >= e.length || lcs.ti + lcs.length >= f.length)) {
                    edgeOrder.push({ l: i, r: j });
                    continue;
                }
                if (lcs.si + lcs.length >= e.length || lcs.ti + lcs.length >= f.length) {
                    u = e[lcs.si + 1];
                    vj = e[lcs.si - 1];
                    vi = f[lcs.ti - 1];
                }
                else {
                    u = e[lcs.si + lcs.length - 2];
                    vi = e[lcs.si + lcs.length];
                    vj = f[lcs.ti + lcs.length];
                }
                if (GridRouter.isLeft(u, vi, vj)) {
                    edgeOrder.push({ l: j, r: i });
                }
                else {
                    edgeOrder.push({ l: i, r: j });
                }
            }
        }
        return GridRouter.getOrder(edgeOrder);
    };
    GridRouter.makeSegments = function (path) {
        function copyPoint(p) {
            return { x: p.x, y: p.y };
        }
        var isStraight = function (a, b, c) { return Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) < 0.001; };
        var segments = [];
        var a = copyPoint(path[0]);
        for (var i = 1; i < path.length; i++) {
            var b = copyPoint(path[i]), c = i < path.length - 1 ? path[i + 1] : null;
            if (!c || !isStraight(a, b, c)) {
                segments.push([a, b]);
                a = b;
            }
        }
        return segments;
    };
    GridRouter.prototype.route = function (s, t) {
        var _this = this;
        var source = this.nodes[s], target = this.nodes[t];
        this.obstacles = this.siblingObstacles(source, target);
        var obstacleLookup = {};
        this.obstacles.forEach(function (o) { return obstacleLookup[o.id] = o; });
        this.passableEdges = this.edges.filter(function (e) {
            var u = _this.verts[e.source], v = _this.verts[e.target];
            return !(u.node && u.node.id in obstacleLookup
                || v.node && v.node.id in obstacleLookup);
        });
        for (var i = 1; i < source.ports.length; i++) {
            var u = source.ports[0].id;
            var v = source.ports[i].id;
            this.passableEdges.push({
                source: u,
                target: v,
                length: 0
            });
        }
        for (var i = 1; i < target.ports.length; i++) {
            var u = target.ports[0].id;
            var v = target.ports[i].id;
            this.passableEdges.push({
                source: u,
                target: v,
                length: 0
            });
        }
        var getSource = function (e) { return e.source; }, getTarget = function (e) { return e.target; }, getLength = function (e) { return e.length; };
        var shortestPathCalculator = new shortestpaths_1.Calculator(this.verts.length, this.passableEdges, getSource, getTarget, getLength);
        var bendPenalty = function (u, v, w) {
            var a = _this.verts[u], b = _this.verts[v], c = _this.verts[w];
            var dx = Math.abs(c.x - a.x), dy = Math.abs(c.y - a.y);
            if (a.node === source && a.node === b.node || b.node === target && b.node === c.node)
                return 0;
            return dx > 1 && dy > 1 ? 1000 : 0;
        };
        var shortestPath = shortestPathCalculator.PathFromNodeToNodeWithPrevCost(source.ports[0].id, target.ports[0].id, bendPenalty);
        var pathPoints = shortestPath.reverse().map(function (vi) { return _this.verts[vi]; });
        pathPoints.push(this.nodes[target.id].ports[0]);
        return pathPoints.filter(function (v, i) {
            return !(i < pathPoints.length - 1 && pathPoints[i + 1].node === source && v.node === source
                || i > 0 && v.node === target && pathPoints[i - 1].node === target);
        });
    };
    GridRouter.getRoutePath = function (route, cornerradius, arrowwidth, arrowheight) {
        var result = {
            routepath: 'M ' + route[0][0].x + ' ' + route[0][0].y + ' ',
            arrowpath: ''
        };
        if (route.length > 1) {
            for (var i = 0; i < route.length; i++) {
                var li = route[i];
                var x = li[1].x, y = li[1].y;
                var dx = x - li[0].x;
                var dy = y - li[0].y;
                if (i < route.length - 1) {
                    if (Math.abs(dx) > 0) {
                        x -= dx / Math.abs(dx) * cornerradius;
                    }
                    else {
                        y -= dy / Math.abs(dy) * cornerradius;
                    }
                    result.routepath += 'L ' + x + ' ' + y + ' ';
                    var l = route[i + 1];
                    var x0 = l[0].x, y0 = l[0].y;
                    var x1 = l[1].x;
                    var y1 = l[1].y;
                    dx = x1 - x0;
                    dy = y1 - y0;
                    var angle = GridRouter.angleBetween2Lines(li, l) < 0 ? 1 : 0;
                    var x2, y2;
                    if (Math.abs(dx) > 0) {
                        x2 = x0 + dx / Math.abs(dx) * cornerradius;
                        y2 = y0;
                    }
                    else {
                        x2 = x0;
                        y2 = y0 + dy / Math.abs(dy) * cornerradius;
                    }
                    var cx = Math.abs(x2 - x);
                    var cy = Math.abs(y2 - y);
                    result.routepath += 'A ' + cx + ' ' + cy + ' 0 0 ' + angle + ' ' + x2 + ' ' + y2 + ' ';
                }
                else {
                    var arrowtip = [x, y];
                    var arrowcorner1, arrowcorner2;
                    if (Math.abs(dx) > 0) {
                        x -= dx / Math.abs(dx) * arrowheight;
                        arrowcorner1 = [x, y + arrowwidth];
                        arrowcorner2 = [x, y - arrowwidth];
                    }
                    else {
                        y -= dy / Math.abs(dy) * arrowheight;
                        arrowcorner1 = [x + arrowwidth, y];
                        arrowcorner2 = [x - arrowwidth, y];
                    }
                    result.routepath += 'L ' + x + ' ' + y + ' ';
                    if (arrowheight > 0) {
                        result.arrowpath = 'M ' + arrowtip[0] + ' ' + arrowtip[1] + ' L ' + arrowcorner1[0] + ' ' + arrowcorner1[1]
                            + ' L ' + arrowcorner2[0] + ' ' + arrowcorner2[1];
                    }
                }
            }
        }
        else {
            var li = route[0];
            var x = li[1].x, y = li[1].y;
            var dx = x - li[0].x;
            var dy = y - li[0].y;
            var arrowtip = [x, y];
            var arrowcorner1, arrowcorner2;
            if (Math.abs(dx) > 0) {
                x -= dx / Math.abs(dx) * arrowheight;
                arrowcorner1 = [x, y + arrowwidth];
                arrowcorner2 = [x, y - arrowwidth];
            }
            else {
                y -= dy / Math.abs(dy) * arrowheight;
                arrowcorner1 = [x + arrowwidth, y];
                arrowcorner2 = [x - arrowwidth, y];
            }
            result.routepath += 'L ' + x + ' ' + y + ' ';
            if (arrowheight > 0) {
                result.arrowpath = 'M ' + arrowtip[0] + ' ' + arrowtip[1] + ' L ' + arrowcorner1[0] + ' ' + arrowcorner1[1]
                    + ' L ' + arrowcorner2[0] + ' ' + arrowcorner2[1];
            }
        }
        return result;
    };
    return GridRouter;
}());
exports.GridRouter = GridRouter;
//# sourceMappingURL=gridrouter.js.map

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__etc_Networking__ = __webpack_require__(34);

class S2SApi {
    static translate({ input }) {
        const request = __WEBPACK_IMPORTED_MODULE_0__etc_Networking__["a" /* Networking */].ajax_request('/api/translate');
        const payload = new Map([['in', input]]);
        return request.get(payload);
    }
    static closeWords({ input, limit = 50, loc = 'src' }) {
        const request = __WEBPACK_IMPORTED_MODULE_0__etc_Networking__["a" /* Networking */].ajax_request('/api/close_words');
        const payload = new Map([
            ['in', input],
            ['loc', loc],
            ['limit', limit]
        ]);
        return request
            .get(payload);
    }
    static compareTranslation({ pivot, compare }) {
        const request = __WEBPACK_IMPORTED_MODULE_0__etc_Networking__["a" /* Networking */].ajax_request('/api/compare_translation');
        const payload = new Map([
            ['in', pivot],
            ['compare', compare]
        ]);
        return request
            .get(payload);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = S2SApi;

class Translation {
    constructor(result, current) {
        this._result = null;
        this._result = result;
        this._current = current;
    }
    get result() {
        return this._result;
    }
    get attn() {
        return this._result.attn;
    }
    get attnFiltered() {
        return this._result.attnFiltered;
    }
    get encoder() {
        return this._result.encoder;
    }
    get decoder() {
        return this._result.decoder;
    }
    get scores() {
        return this._result.scores;
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = Translation;



/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_d3__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__controller_PanelController__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__api_S2SApi__ = __webpack_require__(17);




window.onload = () => {
    // let svg = d3.selectAll('#vis');
    //
    //
    // const globalEvents = new SimpleEventHandler(svg.node());
    // const sv = new S2SAttention({parent: svg, eventHandler: globalEvents});
    const panelCtrl = new __WEBPACK_IMPORTED_MODULE_2__controller_PanelController__["a" /* PanelController */]();
    //    --- EVENTS ---
    const updateAllVis = () => {
        $('#spinner').show();
        const value = __WEBPACK_IMPORTED_MODULE_0_d3__["select"]('#query_input').node().value;
        __WEBPACK_IMPORTED_MODULE_3__api_S2SApi__["a" /* S2SApi */].translate({ input: value.trim() })
            .then((data) => {
            // console.log(data, "--- data");
            const raw_data = JSON.parse(data);
            panelCtrl.update(raw_data);
            $('#spinner').hide();
        })
            .catch((error) => console.log(error, "--- error"));
    };
    const updateDebounced = __WEBPACK_IMPORTED_MODULE_1_lodash__["debounce"](updateAllVis, 1000);
    __WEBPACK_IMPORTED_MODULE_0_d3__["select"]('#query_button').on('click', updateAllVis);
    __WEBPACK_IMPORTED_MODULE_0_d3__["select"]('#query_input').on('keypress', () => {
        const keycode = __WEBPACK_IMPORTED_MODULE_0_d3__["event"].keyCode;
        if (__WEBPACK_IMPORTED_MODULE_0_d3__["event"] instanceof KeyboardEvent) {
            updateDebounced();
            // updateAllVis();
        }
    });
    // little eventHandling
    // globalEvents.bind('svg-resize', ({width, height}) => svg.attrs({width, height}));
    function windowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight - $("#title").height() - $("#ui").height() - 5;
        // globalEvents.trigger('svg-resize', {width, height})
    }
    $(window).resize(windowResize);
    windowResize();
};


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_d3__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__etc_SimpleEventHandler__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__vis_WordLine__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__vis_BarList__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__vis_StateVis__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__vis_AttentionVis__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__vis_WordProjector__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__vis_CloseWordList__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__api_S2SApi__ = __webpack_require__(17);










class PanelController {
    constructor() {
        this._columns = {
            zero: __WEBPACK_IMPORTED_MODULE_0_d3__["select"]('.col0'),
            left: __WEBPACK_IMPORTED_MODULE_0_d3__["select"]('.col1'),
            middle: __WEBPACK_IMPORTED_MODULE_0_d3__["select"]('.col3'),
            right: __WEBPACK_IMPORTED_MODULE_0_d3__["select"]('.col5'),
            setup_left: __WEBPACK_IMPORTED_MODULE_0_d3__["select"]('.col2'),
            setup_right: __WEBPACK_IMPORTED_MODULE_0_d3__["select"]('.col4'),
        };
        const initPanel = () => ({
            encoder_extra: [],
            encoder_words: null,
            attention: null,
            decoder_words: null,
            decoder_extra: []
        });
        this._vis = {
            zero: initPanel(),
            left: initPanel(),
            middle: initPanel(),
            right: initPanel(),
            setup_left: initPanel(),
            setup_right: initPanel()
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
        this.eventHandler = new __WEBPACK_IMPORTED_MODULE_2__etc_SimpleEventHandler__["a" /* SimpleEventHandler */](__WEBPACK_IMPORTED_MODULE_0_d3__["select"]('body').node());
        this._init();
        this._bindEvents();
    }
    _init() {
        this._vis.left.encoder_extra.push(this._createStatesVis({
            col: this._columns.left,
            className: 'states_encoder',
            divStyles: { 'padding-top': '5px' },
            options: {
                data_access: d => d.encoder.map(e => __WEBPACK_IMPORTED_MODULE_1_lodash__["isArray"](e.state) ? e.state : []),
                hidden: this._current.hideStates,
                height: 100,
                cell_width: this._current.box_width
            }
        }));
        this._vis.left.encoder_words = this._createWordLine({
            col: this._columns.left,
            className: 'encoder_words',
            divStyles: { 'padding-top': '5px' },
            options: {
                box_type: this._current.hideStates ? __WEBPACK_IMPORTED_MODULE_3__vis_WordLine__["a" /* WordLine */].BoxType.flow : __WEBPACK_IMPORTED_MODULE_3__vis_WordLine__["a" /* WordLine */].BoxType.fixed,
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
            divStyles: { 'padding-bottom': '5px' },
            options: {
                box_width: this._current.box_width,
                box_type: this._current.hideStates ? __WEBPACK_IMPORTED_MODULE_3__vis_WordLine__["a" /* WordLine */].BoxType.flow : __WEBPACK_IMPORTED_MODULE_3__vis_WordLine__["a" /* WordLine */].BoxType.fixed,
                css_class_main: 'outWord',
                data_access: d => d.decoder.length ? [d.decoder[this._current.topN]] : []
            }
        });
        this._vis.left.decoder_extra.push(this._createStatesVis({
            col: this._columns.left,
            className: 'states_decoder',
            divStyles: { 'padding-bottom': '5px' },
            options: {
                data_access: d => (d.decoder.length > this._current.topN) ?
                    d.decoder[this._current.topN].map(e => __WEBPACK_IMPORTED_MODULE_1_lodash__["isArray"](e.state) ? e.state : []) : [[]],
                hidden: this._current.hideStates,
                height: 100,
                cell_width: this._current.box_width
            }
        }));
        this._vis.left.decoder_extra.push(this._createWordLine({
            col: this._columns.left,
            className: 'decoder_topK',
            divStyles: { 'padding-top': '5px' },
            options: {
                css_class_main: 'topKWord',
                data_access: d => d.decoder.filter((_, i) => i !== this._current.topN)
            }
        }));
        // Zero
        this._vis.zero.encoder_extra.push(PanelController._setupPanel({
            col: this._columns.zero,
            className: "encoder_states_setup",
            addSVG: false,
            title: 'Enc states: ',
            divStyles: { height: '100px', width: '100px', 'padding-top': '5px' }
        }));
        this._vis.zero.encoder_words = PanelController._setupPanel({
            col: this._columns.zero,
            className: "encoder_words_setup",
            addSVG: false,
            title: 'Enc words: ',
            divStyles: { height: '21px', width: '100px', 'padding-top': '5px' }
        });
        this._vis.zero.attention = PanelController._setupPanel({
            col: this._columns.zero,
            className: "attn_setup",
            addSVG: false,
            title: 'Attention: ',
            divStyles: { height: '50px', width: '100px' }
        });
        // noinspection JSUnresolvedVariable
        this._vis.zero.decoder_words = this._createScoreVis({
            col: this._columns.zero,
            className: "decoder_words_setup",
            divStyles: { height: '21px', width: '100px', 'padding-bottom': '5px' },
            options: {
                bar_height: 20,
                data_access: d => [d.scores[this._current.topN]],
                data_access_all: d => d.scores
            }
        });
        this._vis.zero.decoder_extra.push(PanelController._setupPanel({
            col: this._columns.zero,
            className: "decoder_states_setup",
            addSVG: false,
            title: 'Dec states: ',
            divStyles: { height: '100px', width: '100px', 'padding-bottom': '5px' }
        }));
        this._vis.zero.decoder_extra.push(this._createScoreVis({
            col: this._columns.zero,
            className: "decoder_words_setup",
            divStyles: { width: '100px', 'padding-top': '5px' },
            options: {
                bar_height: 23,
                data_access: d => d.scores.filter((_, i) => i !== this._current.topN),
                data_access_all: null
            }
        }));
    }
    update(raw_data) {
        const cur = this._current;
        const data = new __WEBPACK_IMPORTED_MODULE_9__api_S2SApi__["b" /* Translation */](raw_data, cur);
        console.log(data, "--- data");
        const enc = this._vis.left.encoder_words;
        const dec = this._vis.left.decoder_words;
        console.log(this._vis, "--- this._vis");
        enc.update(data);
        dec.update(data);
        cur.inWordPos = enc.positions[0];
        cur.inWords = enc.rows[0];
        cur.outWordPos = dec.positions[0];
        cur.outWords = dec.rows[0];
        data._current = cur;
        const attn = this._vis.left.attention;
        attn.update(data);
        this._vis.left.encoder_extra.forEach(e => e.update(data));
        this._vis.left.decoder_extra.forEach(e => e.update(data));
        //==== setup column
        this._vis.zero.decoder_words.update(data);
        console.log(this._vis.zero.decoder_words.xScale, "--- this._vis.zero.decoder_words.xScale");
        this._vis.zero.decoder_extra.forEach(d => {
            if ('updateOptions' in d) {
                d.updateOptions({ options: { xScale: this._vis.zero.decoder_words.xScale } });
                d.update(data);
            }
        });
    }
    static _setupPanel({ col, className, divStyles, addSVG = true, title = null }) {
        const div = col
            .append('div').attr('class', 'setup ' + className).styles(divStyles);
        // .style('background', 'lightgray');
        if (title) {
            div.html(title);
        }
        if (addSVG)
            return div.append('svg').attrs({ width: 100, height: 30 })
                .styles({
                display: 'inline-block'
            });
        else
            return div;
    }
    _createScoreVis({ col, className, options, divStyles }) {
        const svg = PanelController._setupPanel({ col, className, divStyles, addSVG: true });
        return new __WEBPACK_IMPORTED_MODULE_4__vis_BarList__["a" /* BarList */](svg, this.eventHandler, options);
    }
    static _standardSVGPanel({ col, className, divStyles }) {
        return col
            .append('div').attr('class', className).styles(divStyles)
            .append('svg').attrs({ width: 500, height: 30 });
    }
    _createStatesVis({ col, className, options, divStyles }) {
        const svg = PanelController._standardSVGPanel({ col, className, divStyles });
        return new __WEBPACK_IMPORTED_MODULE_5__vis_StateVis__["a" /* StateVis */](svg, this.eventHandler, options);
    }
    _createAttention({ col, className, options, divStyles = null }) {
        const svg = PanelController._standardSVGPanel({ col, className, divStyles });
        return new __WEBPACK_IMPORTED_MODULE_6__vis_AttentionVis__["a" /* AttentionVis */](svg, this.eventHandler, options);
    }
    _createWordLine({ col, className, options, divStyles }) {
        const svg = PanelController._standardSVGPanel({ col, className, divStyles });
        return new __WEBPACK_IMPORTED_MODULE_3__vis_WordLine__["a" /* WordLine */](svg, this.eventHandler, options);
    }
    _createWordProjector({ col, className, options, divStyles }) {
        const svg = PanelController._standardSVGPanel({ col, className, divStyles });
        return new __WEBPACK_IMPORTED_MODULE_7__vis_WordProjector__["a" /* WordProjector */](svg, this.eventHandler, options);
    }
    _createCloseWordList({ col, className, options, divStyles }) {
        const svg = PanelController._standardSVGPanel({ col, className, divStyles });
        return new __WEBPACK_IMPORTED_MODULE_8__vis_CloseWordList__["a" /* CloseWordList */](svg, this.eventHandler, options);
    }
    updateAndShowWordProjector(data) {
        if (this._current.wordProjector === null) {
            this._current.wordProjector = this._createWordProjector({
                col: this._columns.middle,
                className: "word_projector",
                divStyles: { 'padding-top': '105px' },
                options: {}
            });
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
                divStyles: { 'padding-top': '10px' },
                options: {}
            });
        }
        console.log(this._current, "--- this._current");
        this._current.closeWordsList.update(data);
    }
    _bindEvents() {
        const determinePanelType = caller => {
            if ((caller === this._vis.left.encoder_words) || __WEBPACK_IMPORTED_MODULE_1_lodash__["includes"](this._vis.left.encoder_extra, caller))
                return { vType: __WEBPACK_IMPORTED_MODULE_6__vis_AttentionVis__["a" /* AttentionVis */].VERTEX_TYPE.Encoder, col: this._vis.left };
            else
                return { vType: __WEBPACK_IMPORTED_MODULE_6__vis_AttentionVis__["a" /* AttentionVis */].VERTEX_TYPE.Decoder, col: this._vis.left };
        };
        this.eventHandler.bind(__WEBPACK_IMPORTED_MODULE_3__vis_WordLine__["a" /* WordLine */].events.wordSelected, (d, e) => {
            if (d.caller === this._vis.left.encoder_words
                || d.caller === this._vis.left.decoder_words) {
                let loc = 'src';
                if (d.caller === this._vis.left.decoder_words) {
                    loc = 'tgt';
                }
                const allWords = d.caller.firstRowPlainWords;
                __WEBPACK_IMPORTED_MODULE_9__api_S2SApi__["a" /* S2SApi */].closeWords({ input: d.word.word.text, loc, limit: 20 })
                    .then(data => {
                    // console.log(JSON.parse(data), "--- data");
                    const word_data = JSON.parse(data);
                    // this.updateAndShowWordProjector(word_data);
                    const replaceIndex = d.index;
                    if (loc === 'src') {
                        const pivot = allWords.join(' ');
                        const compare = word_data.word.map(wd => {
                            return allWords.map((aw, wi) => (wi === replaceIndex) ? wd : aw).join(' ');
                        });
                        console.log(pivot, compare, "--- pivot, compare");
                        __WEBPACK_IMPORTED_MODULE_9__api_S2SApi__["a" /* S2SApi */].compareTranslation({ pivot, compare })
                            .then(data => {
                            word_data["compare"] = JSON.parse(data)["compare"];
                            // this.updateAndShowWordList(word_data);
                            this.updateAndShowWordProjector(word_data);
                        });
                    }
                    else {
                        // this.updateAndShowWordList(word_data);
                        this.updateAndShowWordProjector(word_data);
                    }
                })
                    .catch(error => console.log(error, "--- error"));
                console.log(d.word.word.text, d, " enc--- ");
            }
        });
        this.eventHandler.bind(__WEBPACK_IMPORTED_MODULE_3__vis_WordLine__["a" /* WordLine */].events.wordHovered, (d) => {
            d.caller.highlightWord(d.row, d.index, d.hovered);
            const { vType, col } = determinePanelType(d.caller);
            col.attention.highlightAllEdges(d.index, vType, d.hovered);
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PanelController;



/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_d3__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__VisualComponent__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__etc_SVGplus__ = __webpack_require__(5);



var BoxType;
(function (BoxType) {
    BoxType[BoxType["fixed"] = 0] = "fixed";
    BoxType[BoxType["flow"] = 1] = "flow";
})(BoxType || (BoxType = {}));
class WordLine extends __WEBPACK_IMPORTED_MODULE_1__VisualComponent__["a" /* VComponent */] {
    //-- default constructor --
    constructor(d3Parent, eventHandler, options = {}) {
        super(d3Parent, eventHandler);
        this.defaultOptions = {
            text_measurer: null,
            box_height: 23,
            box_width: 100,
            box_type: WordLine.BoxType.flow,
            data_access: (d) => [d.encoder],
            css_class_main: 'inWord',
            css_class_add: '',
            x_offset: 3
        };
        /**
         * @inheritDoc
         * @override
         * @return {Array}
         */
        this.layout = [];
        this.superInit(options);
    }
    _init() {
        this.options.text_measurer = this.options.text_measurer
            || new __WEBPACK_IMPORTED_MODULE_2__etc_SVGplus__["b" /* SVGMeasurements */](this.parent, 'measureWord');
        this._positions = [];
    }
    _wrangle(data) {
        const op = this.options;
        console.log(op, this, "--- op");
        const renderData = {
            rows: []
        };
        this._current.selectedWord = null;
        // calculate distances
        const toWordFlow = token => ({
            text: token,
            width: Math.max(op.text_measurer.textLength(token), 20)
        });
        const toWordFixed = token => ({
            text: token,
            width: op.box_width - 10,
            realWidth: op.text_measurer.textLength(token)
        });
        if (op.box_type === WordLine.BoxType.fixed) {
            renderData.rows = op.data_access(data).map(row => row.map(w => toWordFixed(w.token)));
        }
        else {
            renderData.rows = op.data_access(data).map(row => row.map(w => toWordFlow(w.token)));
        }
        const allLengths = [];
        const calcPos = words => {
            let inc = 0;
            const rr = [...words.map(w => {
                    const res = inc;
                    inc += +w.width + 10;
                    return res;
                })];
            allLengths.push(inc);
            return rr;
        };
        this._positions = renderData.rows.map(row => calcPos(row));
        // noinspection JSUnresolvedFunction
        this.parent.attrs({
            width: __WEBPACK_IMPORTED_MODULE_0_d3__["max"](allLengths) + 6,
            height: renderData.rows.length * (op.box_height) - 2
        });
        // todo: update SVG (parent) size
        return renderData;
    }
    actionWordHovered({ d, i, hovered }) {
        this.eventHandler.trigger(WordLine.events.wordHovered, {
            hovered,
            caller: this,
            word: d,
            row: d.row,
            index: i,
            css_class_main: this.options.css_class_main
        });
    }
    highlightWord(row, index, highlight, exclusive = false) {
        this.base.selectAll(`.${this.options.css_class_main}`)
            .classed('highlight', function (d, i) {
            if ((d.row === row) && (i === index)) {
                return highlight;
            }
            else {
                if (exclusive)
                    return false;
                else
                    return __WEBPACK_IMPORTED_MODULE_0_d3__["select"](this).classed('highlight');
            }
        });
    }
    // noinspection JSUnusedGlobalSymbols
    _render(renderData) {
        const op = this.options;
        const that = this;
        // [rows of [words of {wordRect, wordText}]]
        let rows = this.base.selectAll('.word_row').data(renderData.rows);
        rows.exit().remove();
        rows = rows.enter()
            .append('g').attr('class', 'word_row')
            .merge(rows)
            .attr('transform', (_, i) => `translate(${op.x_offset},${(i) * (op.box_height)})`);
        let words = rows.selectAll(`.${op.css_class_main}`)
            .data((row, rowID) => row.map(word => ({ row: rowID, word })));
        words.exit().remove();
        const wordsEnter = words.enter()
            .append('g').attr('class', `${op.css_class_main} ${op.css_class_add}`);
        wordsEnter.append('rect').attrs({
            x: -3,
            y: 0,
            height: op.box_height - 2,
            rx: 3,
            ry: 3
        });
        wordsEnter.append('text');
        /**** UPDATE ***/
        const allWords = wordsEnter.merge(words)
            .attrs({ 'transform': (w, i) => `translate(${this.positions[w.row][i]},0)`, })
            .on('mouseenter', (d, i) => {
            this.actionWordHovered({ d, i, hovered: true });
            // this.layers.main.selectAll(`.${hoverPrefix + i}`).raise().classed('highlight', true);
        })
            .on('mouseout', (d, i) => {
            this.actionWordHovered({ d, i, hovered: false });
            // this.layers.main.selectAll(`.${hoverPrefix + i}`).classed('highlight', null);
        })
            .on('click', (d, i) => this.actionWordClicked({ d, i }));
        allWords.select('rect').attr('width', (d) => d.word.width + 6);
        allWords.select('text').attr('transform', (d) => {
            const w = d.word;
            if (op.box_type === WordLine.BoxType.fixed
                && w.width < w.realWidth && w.realWidth > 0)
                return `translate(${d.word.width * .5},${Math.floor(op.box_height / 2)})scale(${w.width / w.realWidth},1)`;
            else
                return `translate(${d.word.width * .5},${Math.floor(op.box_height / 2)})`;
        }).text((d) => d.word.text);
    }
    get positions() {
        return this._positions;
    }
    get rows() {
        return this.renderData.rows;
    }
    get firstRowPlainWords() {
        return this.renderData.rows[0].map(word => word.text);
    }
    actionWordClicked({ d, i }) {
        let selected = !(this._current.selectedWord === i);
        this._current.selectedWord = selected ? i : null;
        this.eventHandler.trigger(WordLine.events.wordSelected, {
            selected,
            caller: this,
            word: d,
            index: i
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = WordLine;

WordLine.events = {
    wordHovered: 'wordline_word_hovered',
    wordSelected: 'wordline_word_selected'
};
WordLine.BoxType = BoxType;


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Created by hen on 5/15/17.
 */
let the_unique_id_counter = 0;
class Util {
    static simpleUId({ prefix = '' }) {
        the_unique_id_counter += 1;
        return prefix + the_unique_id_counter;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Util;



/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__VisualComponent__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_d3__);


class BarList extends __WEBPACK_IMPORTED_MODULE_0__VisualComponent__["a" /* VComponent */] {
    constructor(d3Parent, eventHandler, options = {}) {
        super(d3Parent, eventHandler);
        this.defaultOptions = {
            width: 90,
            bar_height: 20,
            css_class_main: 'bar_list_vis',
            css_bar: 'bar',
            xScale: __WEBPACK_IMPORTED_MODULE_1_d3__["scaleLinear"](),
            data_access: d => d.encoder.map(e => e.state),
            data_access_all: null
        };
        // noinspection JSUnusedGlobalSymbols
        this.layout = [
            // {name: 'axis', pos: [0, 0]},
            { name: 'main', pos: [0, 0] },
        ];
        this.superInit(options);
    }
    _init() {
        return this;
    }
    _wrangle(data) {
        const op = this.options;
        if (op.data_access_all) {
            const ex = __WEBPACK_IMPORTED_MODULE_1_d3__["extent"](op.data_access_all(data));
            if (ex[0] * ex[1] > 0) {
                if (ex[0] > 0)
                    ex[0] = ex[1];
                ex[1] = 0;
            }
            op.xScale =
                __WEBPACK_IMPORTED_MODULE_1_d3__["scaleLinear"]()
                    .domain(ex)
                    .range([op.width, 0]);
        }
        const barValues = op.data_access(data);
        this.parent.attrs({
            width: op.width,
            height: barValues.length * op.bar_height
        });
        return { barValues };
    }
    _render({ barValues }) {
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
        });
    }
    get xScale() {
        return this.options.xScale;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BarList;

BarList.events = {};


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__VisualComponent__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_d3__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash__);



class StateVis extends __WEBPACK_IMPORTED_MODULE_0__VisualComponent__["a" /* VComponent */] {
    constructor(d3Parent, eventHandler, options = {}) {
        super(d3Parent, eventHandler);
        this.defaultOptions = {
            cell_width: 100,
            height: 50,
            css_class_main: 'state_vis',
            css_line: 'state_line',
            x_offset: 3,
            hidden: true,
            data_access: d => d.encoder.map(e => e.state)
        };
        this.layout = [
            { name: 'axis', pos: [0, 0] },
            { name: 'main', pos: [0, 0] },
        ];
        this.superInit(options);
    }
    _init() {
        if (this.options.hidden)
            this.hideView();
    }
    _wrangle(data) {
        const op = this.options;
        const orig_states = op.data_access(data);
        const states = __WEBPACK_IMPORTED_MODULE_1_d3__["transpose"](orig_states);
        const yDomain = __WEBPACK_IMPORTED_MODULE_1_d3__["extent"](__WEBPACK_IMPORTED_MODULE_2_lodash__["flattenDeep"](states));
        this.parent.attrs({
            width: (orig_states.length * op.cell_width + (op.x_offset + 5 + 20)),
            height: op.height
        });
        console.log(states, op.data_access(data), "--- states,op.data_access(data)");
        return { states, yDomain };
    }
    _render(renderData) {
        const op = this.options;
        const x = (i) => op.x_offset + Math.round((i + .5) * op.cell_width);
        const y = __WEBPACK_IMPORTED_MODULE_1_d3__["scalePow"]().exponent(.5).domain(renderData.yDomain).range([op.height, 0]);
        const line = __WEBPACK_IMPORTED_MODULE_1_d3__["line"]()
            .x((_, i) => x(i))
            .y(d => y(d));
        const stateLine = this.layers.main.selectAll(`.${op.css_line}`).data(renderData.states);
        stateLine.exit().remove();
        const stateLineEnter = stateLine.enter().append('path').attr('class', op.css_line);
        stateLineEnter.merge(stateLine).attrs({
            'd': line
        });
        if (renderData.states.length > 0) {
            const yAxis = __WEBPACK_IMPORTED_MODULE_1_d3__["axisLeft"](y).ticks(7);
            this.layers.axis.classed("axis state_axis", true)
                .call(yAxis).selectAll('*');
            this.layers.axis.attrs({
                // transform: `translate(${x(renderData.states[0].length - 1) + 3},0)`
                transform: `translate(${op.x_offset + op.cell_width * .5 - 3},0)`
            });
        }
        else {
            this.layers.axis.selectAll("*").remove();
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StateVis;

StateVis.events = {};


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__VisualComponent__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_d3__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash__);



var VertexType;
(function (VertexType) {
    VertexType[VertexType["Encoder"] = 0] = "Encoder";
    VertexType[VertexType["Decoder"] = 1] = "Decoder";
})(VertexType || (VertexType = {}));
class AttentionVis extends __WEBPACK_IMPORTED_MODULE_0__VisualComponent__["a" /* VComponent */] {
    constructor(d3Parent, eventHandler, options = {}) {
        super(d3Parent, eventHandler);
        this.defaultOptions = {
            max_bundle_width: 15,
            height: 50,
            css_class_main: 'attn_graph',
            css_edge: 'attn_edge',
            x_offset: 3
        };
        this.layout = [];
        this.superInit(options);
    }
    _init() {
    }
    _createGraph(attnWeights, maxBundleWidth, inWords, outWords, inPos, outPos) {
        const attnPerInWord = __WEBPACK_IMPORTED_MODULE_2_lodash__["unzip"](attnWeights);
        const attnPerInWordSum = attnPerInWord.map(a => __WEBPACK_IMPORTED_MODULE_2_lodash__["sum"](a));
        const maxAttnPerAllWords = Math.max(1, __WEBPACK_IMPORTED_MODULE_2_lodash__["max"](attnPerInWordSum));
        const lineWidthScale = __WEBPACK_IMPORTED_MODULE_1_d3__["scaleLinear"]()
            .domain([0, maxAttnPerAllWords]).range([0, maxBundleWidth]);
        let maxPos = 0;
        const inPositionGraph = inWords.map((inWord, inIndex) => {
            let inc = inPos[inIndex] + (inWord.width - lineWidthScale(attnPerInWordSum[inIndex])) * .5;
            return outWords.map((_, outIndex) => {
                const lw = lineWidthScale(attnPerInWord[inIndex][outIndex]);
                const res = inc + lw * .5;
                inc += lineWidthScale(attnPerInWord[inIndex][outIndex]);
                maxPos = inc > maxPos ? inc : maxPos;
                return { inPos: res, width: lw, edge: [inIndex, outIndex], classes: `in${inIndex} out${outIndex}` };
            });
        });
        outWords.forEach((outWord, outIndex) => {
            let inc = outPos[outIndex] + (outWord.width - lineWidthScale(1)) * .5;
            inWords.forEach((_, inIndex) => {
                const line = inPositionGraph[inIndex][outIndex];
                line['outPos'] = inc + line.width * .5;
                inc += line.width;
                maxPos = inc > maxPos ? inc : maxPos;
            });
        });
        return { edges: __WEBPACK_IMPORTED_MODULE_2_lodash__["flatten"](inPositionGraph), maxPos };
    }
    _wrangle(data) {
        const { edges, maxPos } = this._createGraph(data.attnFiltered[data._current.topN], this.options.max_bundle_width, data._current.inWords, data._current.outWords, data._current.inWordPos, data._current.outWordPos);
        this.parent.attrs({
            width: maxPos + 5 + this.options.x_offset,
            height: this.options.height
        });
        return { edges, maxPos };
    }
    _render(renderData) {
        console.log(renderData, "--- renderData");
        const op = this.options;
        const graph = this.base.selectAll(`.${op.css_class_main}`)
            .data(renderData.edges);
        graph.exit().remove();
        const linkGen = __WEBPACK_IMPORTED_MODULE_1_d3__["linkVertical"]();
        const graphEnter = graph.enter().append('g').attr('class', op.css_class_main);
        graphEnter.append('path');
        graphEnter.merge(graph).select('path').attrs({
            'd': d => {
                return linkGen({
                    source: [d.inPos + op.x_offset, 0],
                    target: [d.outPos + op.x_offset, op.height]
                });
            },
            'class': d => `${this.options.css_edge} ${d.classes}`
        }).style('stroke-width', d => d.width);
    }
    _bindLocalEvents() {
    }
    highlightAllEdges(index, type, highlight) {
        if (highlight) {
            this.base.selectAll(`.${this.options.css_class_main}`)
                .classed('highlight', d => {
                return d.edge[type] === index;
            });
        }
        else {
            this.base.selectAll(`.${this.options.css_class_main}`)
                .classed('highlight', false);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AttentionVis;

AttentionVis.VERTEX_TYPE = VertexType;
AttentionVis.events = {};


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__VisualComponent__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_d3__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_d3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_d3__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_modules_webcola_dist_index__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_modules_webcola_dist_index___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__node_modules_webcola_dist_index__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__etc_SVGplus__ = __webpack_require__(5);





class WordProjector extends __WEBPACK_IMPORTED_MODULE_0__VisualComponent__["a" /* VComponent */] {
    //-- default constructor --
    constructor(d3Parent, eventHandler, options = {}) {
        super(d3Parent, eventHandler);
        this.defaultOptions = {
            height: 400,
            width: 500,
            css_class_main: 'wp_vis',
            hidden: false,
            data_access: {
                pos: d => d.pos,
                scores: d => d.score,
                words: d => d.word,
                compare: d => d.compare
            }
        };
        this.layout = [
            { name: 'bg', pos: [0, 0] },
            { name: 'main', pos: [0, 0] },
        ];
        this.superInit(options);
    }
    _init() {
        const op = this.options;
        this.options.text_measurer = this.options.text_measurer
            || new __WEBPACK_IMPORTED_MODULE_4__etc_SVGplus__["b" /* SVGMeasurements */](this.parent, 'measureWord');
        this.parent.attrs({
            width: op.width,
            height: op.height
        });
        if (this.options.hidden)
            this.hideView();
    }
    _wrangle(data) {
        console.log("wrnagle--- ");
        const op = this.options;
        const raw_pos = op.data_access.pos(data);
        const x_values = raw_pos.map(d => d[0]);
        const y_values = raw_pos.map(d => d[1]);
        const p0_min = __WEBPACK_IMPORTED_MODULE_1_lodash__["min"](x_values);
        const p1_min = __WEBPACK_IMPORTED_MODULE_1_lodash__["min"](y_values);
        const diff0 = __WEBPACK_IMPORTED_MODULE_1_lodash__["max"](x_values) - p0_min;
        const diff1 = __WEBPACK_IMPORTED_MODULE_1_lodash__["max"](y_values) - p1_min;
        let norm_pos = [];
        if (diff0 > diff1) {
            norm_pos = raw_pos.map(d => [(d[0] - p0_min) / diff0, (d[1] - p1_min) / diff0]);
        }
        else {
            norm_pos = raw_pos.map(d => [(d[0] - p0_min) / diff1, (d[1] - p1_min) / diff1]);
        }
        const words = op.data_access.words(data);
        const scores = op.data_access.scores(data);
        const compare = op.data_access.compare(data);
        this._current.has_compare = compare !== null;
        return __WEBPACK_IMPORTED_MODULE_1_lodash__["sortBy"](__WEBPACK_IMPORTED_MODULE_1_lodash__["zipWith"](words, scores, norm_pos, compare, (word, score, pos, compare) => ({ word, score, pos, compare })), (d) => -d.score);
        // return _.zipWith(words, scores, norm_pos,
        //   (word, score, pos) => ({word, score, pos}));
    }
    _render(renderData) {
        console.log(renderData, "--- renderData");
        const op = this.options;
        const word = this.layers.main.selectAll(".word").data(renderData);
        word.exit().remove();
        const wordEnter = word.enter().append('g').attr('class', 'word');
        wordEnter.append('rect');
        wordEnter.append('text');
        const xscale = __WEBPACK_IMPORTED_MODULE_2_d3__["scaleLinear"]().range([30, op.width - 30]);
        const yscale = __WEBPACK_IMPORTED_MODULE_2_d3__["scaleLinear"]().range([10, op.height - 10]);
        const scoreExtent = __WEBPACK_IMPORTED_MODULE_2_d3__["extent"](renderData.map(d => d.score));
        const wordScale = __WEBPACK_IMPORTED_MODULE_2_d3__["scaleLinear"]().domain(scoreExtent).range([6, 14]);
        const ofree = [];
        for (const rd of renderData) {
            const w = rd.word;
            const height = wordScale(rd.score);
            const x = xscale(rd.pos[0]);
            const y = yscale(rd.pos[1]);
            const width = op.text_measurer.textLength(w, 'font-size:' + height + 'px;');
            // console.log(w,height,x,y,width,"--- w,height,x,y,width");
            ofree.push(new __WEBPACK_IMPORTED_MODULE_3__node_modules_webcola_dist_index__["Rectangle"](x - width / 2 - 4, x + width / 2 + 4, y - height / 2 - 3, y + height / 2 + 3));
        }
        __WEBPACK_IMPORTED_MODULE_3__node_modules_webcola_dist_index__["removeOverlaps"](ofree);
        const newPos = {};
        ofree.forEach((d, i) => {
            newPos[renderData[i].word] = {
                cx: (d.X + d.x) * .5,
                cy: (d.Y + d.y) * .5,
                w: (d.X - d.x),
                h: (d.Y - d.y)
            };
        });
        // console.log(ofree,"--- ofree");
        //TODO: BAD HACK - -should not be using indices
        const allWords = wordEnter.merge(word);
        allWords.attr('transform', (d, i) => `translate(${newPos[d.word].cx}, ${newPos[d.word].cy})`);
        allWords.select('rect').attrs({
            width: (d, i) => newPos[d.word].w,
            height: (d, i) => newPos[d.word].h - 2,
            x: (d, i) => -newPos[d.word].w * .5,
            y: (d, i) => -newPos[d.word].h * .5 + 1,
        });
        allWords.select('text')
            .text(d => d.word)
            .style('font-size', d => wordScale(d.score) + 'px');
        if (this._current.has_compare) {
            const bd_max = __WEBPACK_IMPORTED_MODULE_1_lodash__["max"](renderData.map(d => d.compare.dist));
            const bd_scale = __WEBPACK_IMPORTED_MODULE_2_d3__["scaleLinear"]().domain([0, bd_max])
                .range(['#ffffff', '#3f6f9e']);
            allWords.select('rect').style('fill', d => {
                // console.log(d,"--- d");
                return bd_scale(d.compare.dist);
            });
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = WordProjector;



/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(27));
__export(__webpack_require__(28));
__export(__webpack_require__(8));
__export(__webpack_require__(14));
__export(__webpack_require__(16));
__export(__webpack_require__(15));
__export(__webpack_require__(3));
__export(__webpack_require__(31));
__export(__webpack_require__(7));
__export(__webpack_require__(11));
__export(__webpack_require__(13));
__export(__webpack_require__(12));
__export(__webpack_require__(4));
__export(__webpack_require__(6));
__export(__webpack_require__(9));
__export(__webpack_require__(32));
//# sourceMappingURL=index.js.map

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var layout_1 = __webpack_require__(3);
var LayoutAdaptor = (function (_super) {
    __extends(LayoutAdaptor, _super);
    function LayoutAdaptor(options) {
        var _this = _super.call(this) || this;
        var self = _this;
        var o = options;
        if (o.trigger) {
            _this.trigger = o.trigger;
        }
        if (o.kick) {
            _this.kick = o.kick;
        }
        if (o.drag) {
            _this.drag = o.drag;
        }
        if (o.on) {
            _this.on = o.on;
        }
        _this.dragstart = _this.dragStart = layout_1.Layout.dragStart;
        _this.dragend = _this.dragEnd = layout_1.Layout.dragEnd;
        return _this;
    }
    LayoutAdaptor.prototype.trigger = function (e) { };
    ;
    LayoutAdaptor.prototype.kick = function () { };
    ;
    LayoutAdaptor.prototype.drag = function () { };
    ;
    LayoutAdaptor.prototype.on = function (eventType, listener) { return this; };
    ;
    return LayoutAdaptor;
}(layout_1.Layout));
exports.LayoutAdaptor = LayoutAdaptor;
function adaptor(options) {
    return new LayoutAdaptor(options);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var d3v3 = __webpack_require__(29);
var d3v4 = __webpack_require__(30);
;
function d3adaptor(d3Context) {
    if (!d3Context || isD3V3(d3Context)) {
        return new d3v3.D3StyleLayoutAdaptor();
    }
    return new d3v4.D3StyleLayoutAdaptor(d3Context);
}
exports.d3adaptor = d3adaptor;
function isD3V3(d3Context) {
    var v3exp = /^3\./;
    return d3Context.version && d3Context.version.match(v3exp) !== null;
}
//# sourceMappingURL=d3adaptor.js.map

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var layout_1 = __webpack_require__(3);
var D3StyleLayoutAdaptor = (function (_super) {
    __extends(D3StyleLayoutAdaptor, _super);
    function D3StyleLayoutAdaptor() {
        var _this = _super.call(this) || this;
        _this.event = d3.dispatch(layout_1.EventType[layout_1.EventType.start], layout_1.EventType[layout_1.EventType.tick], layout_1.EventType[layout_1.EventType.end]);
        var d3layout = _this;
        var drag;
        _this.drag = function () {
            if (!drag) {
                var drag = d3.behavior.drag()
                    .origin(layout_1.Layout.dragOrigin)
                    .on("dragstart.d3adaptor", layout_1.Layout.dragStart)
                    .on("drag.d3adaptor", function (d) {
                    layout_1.Layout.drag(d, d3.event);
                    d3layout.resume();
                })
                    .on("dragend.d3adaptor", layout_1.Layout.dragEnd);
            }
            if (!arguments.length)
                return drag;
            this
                .call(drag);
        };
        return _this;
    }
    D3StyleLayoutAdaptor.prototype.trigger = function (e) {
        var d3event = { type: layout_1.EventType[e.type], alpha: e.alpha, stress: e.stress };
        this.event[d3event.type](d3event);
    };
    D3StyleLayoutAdaptor.prototype.kick = function () {
        var _this = this;
        d3.timer(function () { return _super.prototype.tick.call(_this); });
    };
    D3StyleLayoutAdaptor.prototype.on = function (eventType, listener) {
        if (typeof eventType === 'string') {
            this.event.on(eventType, listener);
        }
        else {
            this.event.on(layout_1.EventType[eventType], listener);
        }
        return this;
    };
    return D3StyleLayoutAdaptor;
}(layout_1.Layout));
exports.D3StyleLayoutAdaptor = D3StyleLayoutAdaptor;
function d3adaptor() {
    return new D3StyleLayoutAdaptor();
}
exports.d3adaptor = d3adaptor;
//# sourceMappingURL=d3v3adaptor.js.map

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var layout_1 = __webpack_require__(3);
var D3StyleLayoutAdaptor = (function (_super) {
    __extends(D3StyleLayoutAdaptor, _super);
    function D3StyleLayoutAdaptor(d3Context) {
        var _this = _super.call(this) || this;
        _this.d3Context = d3Context;
        _this.event = d3Context.dispatch(layout_1.EventType[layout_1.EventType.start], layout_1.EventType[layout_1.EventType.tick], layout_1.EventType[layout_1.EventType.end]);
        var d3layout = _this;
        var drag;
        _this.drag = function () {
            if (!drag) {
                var drag = d3Context.drag()
                    .subject(layout_1.Layout.dragOrigin)
                    .on("start.d3adaptor", layout_1.Layout.dragStart)
                    .on("drag.d3adaptor", function (d) {
                    layout_1.Layout.drag(d, d3Context.event);
                    d3layout.resume();
                })
                    .on("end.d3adaptor", layout_1.Layout.dragEnd);
            }
            if (!arguments.length)
                return drag;
            arguments[0].call(drag);
        };
        return _this;
    }
    D3StyleLayoutAdaptor.prototype.trigger = function (e) {
        var d3event = { type: layout_1.EventType[e.type], alpha: e.alpha, stress: e.stress };
        this.event.call(d3event.type, d3event);
    };
    D3StyleLayoutAdaptor.prototype.kick = function () {
        var _this = this;
        var t = this.d3Context.timer(function () { return _super.prototype.tick.call(_this) && t.stop(); });
    };
    D3StyleLayoutAdaptor.prototype.on = function (eventType, listener) {
        if (typeof eventType === 'string') {
            this.event.on(eventType, listener);
        }
        else {
            this.event.on(layout_1.EventType[eventType], listener);
        }
        return this;
    };
    return D3StyleLayoutAdaptor;
}(layout_1.Layout));
exports.D3StyleLayoutAdaptor = D3StyleLayoutAdaptor;
//# sourceMappingURL=d3v4adaptor.js.map

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var shortestpaths_1 = __webpack_require__(6);
var descent_1 = __webpack_require__(8);
var rectangle_1 = __webpack_require__(4);
var linklengths_1 = __webpack_require__(7);
var Link3D = (function () {
    function Link3D(source, target) {
        this.source = source;
        this.target = target;
    }
    Link3D.prototype.actualLength = function (x) {
        var _this = this;
        return Math.sqrt(x.reduce(function (c, v) {
            var dx = v[_this.target] - v[_this.source];
            return c + dx * dx;
        }, 0));
    };
    return Link3D;
}());
exports.Link3D = Link3D;
var Node3D = (function () {
    function Node3D(x, y, z) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        this.x = x;
        this.y = y;
        this.z = z;
    }
    return Node3D;
}());
exports.Node3D = Node3D;
var Layout3D = (function () {
    function Layout3D(nodes, links, idealLinkLength) {
        if (idealLinkLength === void 0) { idealLinkLength = 1; }
        var _this = this;
        this.nodes = nodes;
        this.links = links;
        this.idealLinkLength = idealLinkLength;
        this.constraints = null;
        this.useJaccardLinkLengths = true;
        this.result = new Array(Layout3D.k);
        for (var i = 0; i < Layout3D.k; ++i) {
            this.result[i] = new Array(nodes.length);
        }
        nodes.forEach(function (v, i) {
            for (var _i = 0, _a = Layout3D.dims; _i < _a.length; _i++) {
                var dim = _a[_i];
                if (typeof v[dim] == 'undefined')
                    v[dim] = Math.random();
            }
            _this.result[0][i] = v.x;
            _this.result[1][i] = v.y;
            _this.result[2][i] = v.z;
        });
    }
    ;
    Layout3D.prototype.linkLength = function (l) {
        return l.actualLength(this.result);
    };
    Layout3D.prototype.start = function (iterations) {
        var _this = this;
        if (iterations === void 0) { iterations = 100; }
        var n = this.nodes.length;
        var linkAccessor = new LinkAccessor();
        if (this.useJaccardLinkLengths)
            linklengths_1.jaccardLinkLengths(this.links, linkAccessor, 1.5);
        this.links.forEach(function (e) { return e.length *= _this.idealLinkLength; });
        var distanceMatrix = (new shortestpaths_1.Calculator(n, this.links, function (e) { return e.source; }, function (e) { return e.target; }, function (e) { return e.length; })).DistanceMatrix();
        var D = descent_1.Descent.createSquareMatrix(n, function (i, j) { return distanceMatrix[i][j]; });
        var G = descent_1.Descent.createSquareMatrix(n, function () { return 2; });
        this.links.forEach(function (_a) {
            var source = _a.source, target = _a.target;
            return G[source][target] = G[target][source] = 1;
        });
        this.descent = new descent_1.Descent(this.result, D);
        this.descent.threshold = 1e-3;
        this.descent.G = G;
        if (this.constraints)
            this.descent.project = new rectangle_1.Projection(this.nodes, null, null, this.constraints).projectFunctions();
        for (var i = 0; i < this.nodes.length; i++) {
            var v = this.nodes[i];
            if (v.fixed) {
                this.descent.locks.add(i, [v.x, v.y, v.z]);
            }
        }
        this.descent.run(iterations);
        return this;
    };
    Layout3D.prototype.tick = function () {
        this.descent.locks.clear();
        for (var i = 0; i < this.nodes.length; i++) {
            var v = this.nodes[i];
            if (v.fixed) {
                this.descent.locks.add(i, [v.x, v.y, v.z]);
            }
        }
        return this.descent.rungeKutta();
    };
    Layout3D.dims = ['x', 'y', 'z'];
    Layout3D.k = Layout3D.dims.length;
    return Layout3D;
}());
exports.Layout3D = Layout3D;
var LinkAccessor = (function () {
    function LinkAccessor() {
    }
    LinkAccessor.prototype.getSourceIndex = function (e) { return e.source; };
    LinkAccessor.prototype.getTargetIndex = function (e) { return e.target; };
    LinkAccessor.prototype.getLength = function (e) { return e.length; };
    LinkAccessor.prototype.setLength = function (e, l) { e.length = l; };
    return LinkAccessor;
}());
//# sourceMappingURL=layout3d.js.map

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var layout_1 = __webpack_require__(3);
var gridrouter_1 = __webpack_require__(16);
function gridify(pgLayout, nudgeGap, margin, groupMargin) {
    pgLayout.cola.start(0, 0, 0, 10, false);
    var gridrouter = route(pgLayout.cola.nodes(), pgLayout.cola.groups(), margin, groupMargin);
    return gridrouter.routeEdges(pgLayout.powerGraph.powerEdges, nudgeGap, function (e) { return e.source.routerNode.id; }, function (e) { return e.target.routerNode.id; });
}
exports.gridify = gridify;
function route(nodes, groups, margin, groupMargin) {
    nodes.forEach(function (d) {
        d.routerNode = {
            name: d.name,
            bounds: d.bounds.inflate(-margin)
        };
    });
    groups.forEach(function (d) {
        d.routerNode = {
            bounds: d.bounds.inflate(-groupMargin),
            children: (typeof d.groups !== 'undefined' ? d.groups.map(function (c) { return nodes.length + c.id; }) : [])
                .concat(typeof d.leaves !== 'undefined' ? d.leaves.map(function (c) { return c.index; }) : [])
        };
    });
    var gridRouterNodes = nodes.concat(groups).map(function (d, i) {
        d.routerNode.id = i;
        return d.routerNode;
    });
    return new gridrouter_1.GridRouter(gridRouterNodes, {
        getChildren: function (v) { return v.children; },
        getBounds: function (v) { return v.bounds; }
    }, margin - groupMargin);
}
function powerGraphGridLayout(graph, size, grouppadding) {
    var powerGraph;
    graph.nodes.forEach(function (v, i) { return v.index = i; });
    new layout_1.Layout()
        .avoidOverlaps(false)
        .nodes(graph.nodes)
        .links(graph.links)
        .powerGraphGroups(function (d) {
        powerGraph = d;
        powerGraph.groups.forEach(function (v) { return v.padding = grouppadding; });
    });
    var n = graph.nodes.length;
    var edges = [];
    var vs = graph.nodes.slice(0);
    vs.forEach(function (v, i) { return v.index = i; });
    powerGraph.groups.forEach(function (g) {
        var sourceInd = g.index = g.id + n;
        vs.push(g);
        if (typeof g.leaves !== 'undefined')
            g.leaves.forEach(function (v) { return edges.push({ source: sourceInd, target: v.index }); });
        if (typeof g.groups !== 'undefined')
            g.groups.forEach(function (gg) { return edges.push({ source: sourceInd, target: gg.id + n }); });
    });
    powerGraph.powerEdges.forEach(function (e) {
        edges.push({ source: e.source.index, target: e.target.index });
    });
    new layout_1.Layout()
        .size(size)
        .nodes(vs)
        .links(edges)
        .avoidOverlaps(false)
        .linkDistance(30)
        .symmetricDiffLinkLengths(5)
        .convergenceThreshold(1e-4)
        .start(100, 0, 0, 0, false);
    return {
        cola: new layout_1.Layout()
            .convergenceThreshold(1e-3)
            .size(size)
            .avoidOverlaps(true)
            .nodes(graph.nodes)
            .links(graph.links)
            .groupCompactness(1e-4)
            .linkDistance(30)
            .symmetricDiffLinkLengths(5)
            .powerGraphGroups(function (d) {
            powerGraph = d;
            powerGraph.groups.forEach(function (v) {
                v.padding = grouppadding;
            });
        }).start(50, 0, 100, 0, false),
        powerGraph: powerGraph
    };
}
exports.powerGraphGridLayout = powerGraphGridLayout;
//# sourceMappingURL=batch.js.map

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__VisualComponent__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_d3__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__etc_SVGplus__ = __webpack_require__(5);




class CloseWordList extends __WEBPACK_IMPORTED_MODULE_0__VisualComponent__["a" /* VComponent */] {
    constructor(d3Parent, eventHandler, options = {}) {
        super(d3Parent, eventHandler);
        this.defaultOptions = {
            height: 400,
            width: 1000,
            lineSpacing: 20,
            scoreWidth: 100,
            css_class_main: 'close_words',
            hidden: false,
            data_access: {
                pos: d => d.pos,
                scores: d => d.score,
                words: d => d.word,
                compare: d => d.compare
            }
        };
        this.layout = [
            { name: 'bg', pos: [0, 0] },
            { name: 'main', pos: [0, 0] },
        ];
        this.superInit(options);
    }
    _init() {
        const op = this.options;
        this.options.text_measurer = this.options.text_measurer
            || new __WEBPACK_IMPORTED_MODULE_3__etc_SVGplus__["b" /* SVGMeasurements */](this.parent, 'close_word_list');
        this.parent.attrs({
            width: op.width,
            height: op.height
        });
        if (this.options.hidden)
            this.hideView();
    }
    _wrangle(data) {
        console.log("wrnagle--- ");
        const op = this.options;
        // const raw_pos = op.data_access.pos(data);
        // const x_values = raw_pos.map(d => d[0]);
        // const y_values = raw_pos.map(d => d[1]);
        //
        // const p0_min = _.minBy(x_values);
        // const p1_min = _.minBy(y_values);
        //
        // const diff0 = _.maxBy(x_values) - p0_min;
        // const diff1 = _.maxBy(y_values) - p1_min;
        //
        //
        // let norm_pos = [];
        //
        // if (diff0 > diff1) {
        //     norm_pos = raw_pos.map(d => [(d[0] - p0_min) / diff0, (d[1] - p1_min) / diff0]);
        // } else {
        //     norm_pos = raw_pos.map(d => [(d[0] - p0_min) / diff1, (d[1] - p1_min) / diff1])
        // }
        const words = op.data_access.words(data);
        const wordWidth = words.map(w => op.text_measurer.textLength(w));
        const scores = op.data_access.scores(data);
        const compare = op.data_access.compare(data);
        this._current.has_compare = compare !== null;
        // if (this._states.has_compare) {
        return __WEBPACK_IMPORTED_MODULE_2_lodash__["sortBy"](__WEBPACK_IMPORTED_MODULE_2_lodash__["zipWith"](words, scores, wordWidth, compare, (word, score, width, compare) => ({ word, score, width, compare })), d => -d.score);
        // } else {
        //     return _.sortBy(_.zipWith(words, scores, wordWidth,
        //       (word, score, width) => ({word, score, width})), d => -d.score);
        // }
    }
    _render(renderData) {
        const op = this.options;
        const noItems = renderData.length;
        const ls = op.lineSpacing;
        const f2f = __WEBPACK_IMPORTED_MODULE_1_d3__["format"](".2f");
        this.parent.attr('height', noItems * ls);
        const word = this.layers.main.selectAll(".word").data(renderData);
        word.exit().remove();
        const wordEnter = word.enter().append('text').attr('class', 'word');
        const yscale = __WEBPACK_IMPORTED_MODULE_1_d3__["scaleLinear"]().domain([0, noItems - 1])
            .range([ls / 2, (noItems - .5) * ls]);
        //TODO: BAD HACK - -should not be using indices
        wordEnter.merge(word).attrs({
            x: () => 10,
            y: (d, i) => yscale(i),
        }).text(d => d.word);
        // .style('font-size', d => wordScale(d.score) + 'px')
        const wordEnd = __WEBPACK_IMPORTED_MODULE_2_lodash__["maxBy"](renderData, 'width').width;
        const maxScore = __WEBPACK_IMPORTED_MODULE_2_lodash__["maxBy"](renderData, 'score').score;
        const barScale = __WEBPACK_IMPORTED_MODULE_1_d3__["scaleLinear"]().domain([0, maxScore])
            .range([0, op.scoreWidth]);
        const scoreBars = this.layers.main.selectAll(".scoreBar").data(renderData);
        scoreBars.exit().remove();
        const scoreBarsEnter = scoreBars.enter().append('g').attr('class', 'scoreBar');
        scoreBarsEnter.append('rect');
        scoreBarsEnter.append('text').attrs({ x: 2, y: ls / 2 - 2, 'class': 'barText' });
        const allScoreBars = scoreBarsEnter.merge(scoreBars).attrs({
            transform: (d, i) => `translate(${wordEnd + 10 + 10},${yscale(i) - ls / 2})`
        });
        allScoreBars.select('rect').attrs({
            width: d => barScale(d.score),
            height: ls - 4
        });
        allScoreBars.select('text').text(d => f2f(d.score));
        if (this._current.has_compare) {
            const bd_max = __WEBPACK_IMPORTED_MODULE_2_lodash__["max"](renderData.map(d => d.compare.dist));
            const bd_scale = __WEBPACK_IMPORTED_MODULE_1_d3__["scaleLinear"]().domain([0, bd_max])
                .range([1, 100]);
            const barDist = this.layers.main.selectAll(".distBar").data(renderData);
            barDist.exit().remove();
            const barDistEnter = barDist.enter().append('g').attr('class', 'distBar');
            barDistEnter.append('rect');
            barDistEnter.append('text').attrs({ x: 2, y: ls / 2 - 2, 'class': 'barText' });
            const all_barDist = barDistEnter.merge(barDist).attrs({
                transform: (d, i) => `translate(${wordEnd + 10 + 10 + op.scoreWidth + 10},${yscale(i) - ls / 2})`
            });
            all_barDist.select('rect')
                .attrs({
                width: d => bd_scale(d.compare.dist),
                height: ls - 4
            });
            all_barDist.select('text').text(d => f2f(d.compare.dist));
            const wordComp = this.layers.main.selectAll(".wordComp").data(renderData);
            wordComp.exit().remove();
            const wordCompEnter = wordComp.enter().append('text').attr('class', 'wordComp');
            wordCompEnter.merge(wordComp).attrs({
                transform: (d, i) => `translate(${wordEnd + 10 + 10 + op.scoreWidth + 120},${yscale(i)})`
            }).text(d => d.compare.sentence);
        }
        else {
            this.layers.main.selectAll(".wordComp").remove();
        }
        // console.log(wordEnd, [wordEnd], "--- wordEnd,[wordEnd]");
        // const dLine = this.layers.bg.selectAll('.dividerLine').data([wordEnd])
        // dLine.enter().append('line').attr('class', 'dividerLine')
        //   .merge(dLine).attrs({
        //     x1: d => d + 10,
        //     x2: d => d + 10,
        //     y1: 0,
        //     y2: noItems * ls
        // })
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CloseWordList;



/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Created by hen on 5/15/17.
 */
class Networking {
    /**
     * Generates a Ajax Request object.
     * @param {string} url - the base url
     * @returns {{get: (function(*=)), post: (function(*=)), put: (function(*=)), delete: (function(*=))}}
     *  the ajax object that can call get, post, put, delete on the url
     */
    static ajax_request(url) {
        /* Adapted from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
         * EXAMPLE:

         var mdnAPI = 'https://developer.mozilla.org/en-US/search.json';
         var payload = {
         'topic' : 'js',
         'q'     : 'Promise'
         };

         var callback = {
         success: function(data) {
         console.log(1, 'success', JSON.parse(data));
         },
         error: function(data) {
         console.log(2, 'error', JSON.parse(data));
         }
         };

         // Executes the method call
         $http(mdnAPI)
         .get(payload)
         .then(callback.success)
         .catch(callback.error);

         // Executes the method call but an alternative way (1) to handle Promise Reject case
         $http(mdnAPI)
         .get(payload)
         .then(callback.success, callback.error);

         */
        // Method that performs the ajax request
        const ajax = (method, _url, args) => {
            // Creating a promise
            return new Promise((resolve, reject) => {
                // Instantiates the XMLHttpRequest
                const client = new XMLHttpRequest();
                let uri = _url;
                if (args && (method === 'POST' || method === 'GET' || method === 'PUT')) {
                    uri += '?';
                    args.forEach((value, key) => {
                        uri += '&';
                        uri += encodeURIComponent(key) + '=' + encodeURIComponent(value);
                    });
                }
                // Debug: console.log('URI', uri, args);
                client.open(method, uri);
                client.send();
                client.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        // Performs the function "resolve" when this.status is equal to 2xx
                        resolve(this.response);
                    }
                    else {
                        // Performs the function "reject" when this.status is different than 2xx
                        reject(this.statusText);
                    }
                };
                client.onerror = function () {
                    reject(this.statusText);
                };
            });
        };
        // Adapter pattern
        return {
            'get': args => ajax('GET', url, args),
            'post': args => ajax('POST', url, args),
            'put': args => ajax('PUT', url, args),
            'delete': args => ajax('DELETE', url, args)
        };
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Networking;



/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOGU3YjlkY2FiMGMyMDAzNTY1MTAiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZDNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJfXCIiLCJ3ZWJwYWNrOi8vLy4vdHMvdmlzL1Zpc3VhbENvbXBvbmVudC50cyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvd2ViY29sYS9kaXN0L3NyYy9sYXlvdXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3dlYmNvbGEvZGlzdC9zcmMvcmVjdGFuZ2xlLmpzIiwid2VicGFjazovLy8uL3RzL2V0Yy9TVkdwbHVzLnRzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy93ZWJjb2xhL2Rpc3Qvc3JjL3Nob3J0ZXN0cGF0aHMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3dlYmNvbGEvZGlzdC9zcmMvbGlua2xlbmd0aHMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3dlYmNvbGEvZGlzdC9zcmMvZGVzY2VudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvd2ViY29sYS9kaXN0L3NyYy92cHNjLmpzIiwid2VicGFjazovLy8uL3RzL2V0Yy9TaW1wbGVFdmVudEhhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3dlYmNvbGEvZGlzdC9zcmMvcG93ZXJncmFwaC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvd2ViY29sYS9kaXN0L3NyYy9yYnRyZWUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3dlYmNvbGEvZGlzdC9zcmMvcHF1ZXVlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy93ZWJjb2xhL2Rpc3Qvc3JjL2dlb20uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3dlYmNvbGEvZGlzdC9zcmMvaGFuZGxlZGlzY29ubmVjdGVkLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy93ZWJjb2xhL2Rpc3Qvc3JjL2dyaWRyb3V0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vdHMvYXBpL1MyU0FwaS50cyIsIndlYnBhY2s6Ly8vLi90cy9tYWluLnRzIiwid2VicGFjazovLy8uL3RzL2NvbnRyb2xsZXIvUGFuZWxDb250cm9sbGVyLnRzIiwid2VicGFjazovLy8uL3RzL3Zpcy9Xb3JkTGluZS50cyIsIndlYnBhY2s6Ly8vLi90cy9ldGMvVXRpbC50cyIsIndlYnBhY2s6Ly8vLi90cy92aXMvQmFyTGlzdC50cyIsIndlYnBhY2s6Ly8vLi90cy92aXMvU3RhdGVWaXMudHMiLCJ3ZWJwYWNrOi8vLy4vdHMvdmlzL0F0dGVudGlvblZpcy50cyIsIndlYnBhY2s6Ly8vLi90cy92aXMvV29yZFByb2plY3Rvci50cyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvd2ViY29sYS9kaXN0L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy93ZWJjb2xhL2Rpc3Qvc3JjL2FkYXB0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3dlYmNvbGEvZGlzdC9zcmMvZDNhZGFwdG9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy93ZWJjb2xhL2Rpc3Qvc3JjL2QzdjNhZGFwdG9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy93ZWJjb2xhL2Rpc3Qvc3JjL2QzdjRhZGFwdG9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy93ZWJjb2xhL2Rpc3Qvc3JjL2xheW91dDNkLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy93ZWJjb2xhL2Rpc3Qvc3JjL2JhdGNoLmpzIiwid2VicGFjazovLy8uL3RzL3Zpcy9DbG9zZVdvcmRMaXN0LnRzIiwid2VicGFjazovLy8uL3RzL2V0Yy9OZXR3b3JraW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQzdEQSxvQjs7Ozs7O0FDQUEsbUI7Ozs7Ozs7OztBQ0FBO0FBQUE7O0dBRUc7QUFDOEI7QUFFNEI7QUFDMUI7QUFLN0I7SUFzQ0YsMkVBQTJFO0lBRzNFOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSCxZQUFZLFFBQWUsRUFBRSxZQUFpQztRQTVDOUQ7O1dBRUc7UUFDeUIsbUJBQWMsR0FBTztZQUM3QyxHQUFHLEVBQUUsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUM7WUFDbkIsaURBQWlEO1lBQ2pELHFCQUFxQixFQUFFLEVBQUU7U0FDNUIsQ0FBQztRQUdGOztXQUVHO1FBQ3lCLFdBQU0sR0FBc0MsQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQWdDbEcsSUFBSSxDQUFDLEVBQUUsR0FBRyx1REFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU3QixJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztRQUV2QixtRkFBbUY7UUFDbkYsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZO1lBQzVCLElBQUksbUZBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRTdDLG1EQUFtRDtRQUNuRCxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDO0lBRXBDLENBQUM7SUFFRDs7OztPQUlHO0lBQ08sU0FBUyxDQUFDLFVBQWMsRUFBRSxFQUFFLE9BQU8sR0FBRyxJQUFJO1FBQ2hELDJEQUEyRDtRQUMzRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFekYsZ0NBQWdDO1FBQ2hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbEQsY0FBYztRQUNkLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRXhCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBR0QscUZBQXFGO0lBRXJGOzs7OztPQUtHO0lBQ0gsa0JBQWtCLENBQUMsTUFBTTtRQUNyQixtREFBbUQ7UUFDbkQsMkRBQTJEO1FBQzNELE1BQU0sQ0FBQyx5REFBRyxDQUFDLEtBQUssQ0FDWixNQUFNLEVBQ04sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQ3JELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQ25DLENBQUM7SUFDTixDQUFDO0lBRUQsbUJBQW1CLENBQUMsSUFBSTtRQUNwQixNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDZixHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMzQixHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLHlEQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQzFFLENBQUM7UUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQVVELG9GQUFvRjtJQUVwRixxQ0FBcUM7SUFDckM7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSTtRQUNQLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBc0JELDhFQUE4RTtJQUM5RTs7Ozs7T0FLRztJQUNILGFBQWEsQ0FBQyxFQUFDLE9BQU8sRUFBRSxRQUFRLEdBQUcsS0FBSyxFQUFDO1FBQ3JDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUM7WUFBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsaUZBQWlGO0lBQ2pGLFVBQVUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUk7UUFDL0IsMkNBQTJDO1FBQzNDLE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNqRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztRQUNqQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0gsZ0JBQWdCO1FBQ1oscURBQXFEO0lBQ3pELENBQUM7SUFFRCxRQUFRO1FBQ0osRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ2IsU0FBUyxFQUFFLENBQUM7Z0JBQ1osZ0JBQWdCLEVBQUUsTUFBTTthQUMzQixDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDaEMsQ0FBQztJQUNMLENBQUM7SUFFRCxVQUFVO1FBQ04sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUNiLFNBQVMsRUFBRSxDQUFDO2dCQUNaLGdCQUFnQixFQUFFLElBQUk7YUFDekIsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTNCLENBQUM7SUFDTCxDQUFDO0lBRUQsT0FBTztRQUNILElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDdkIsQ0FBQzs7OztBQXJORCw2RUFBNkU7QUFFN0U7OztHQUdHO0FBRUksaUJBQU0sR0FBTyxFQUFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBQyxDQUFDOzs7Ozs7OztBQ3BCeEQ7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLDBEQUEwRDtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyx1RUFBdUU7QUFDMUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsd0VBQXdFO0FBQ2xHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsT0FBTztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixxRUFBcUU7QUFDM0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLCtCQUErQixPQUFPO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsU0FBUztBQUNULGtFQUFrRSx3Q0FBd0MsRUFBRTtBQUM1RyxtRUFBbUUsd0NBQXdDLEVBQUU7QUFDN0c7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrRUFBK0Usc0JBQXNCLEVBQUU7QUFDdkc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxnREFBZ0Q7QUFDbEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixPQUFPO0FBQ2xDLHdDQUF3QywrQkFBK0IsRUFBRTtBQUN6RSxrREFBa0Qsb0ZBQW9GO0FBQ3RJO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLE9BQU87QUFDbEMsd0NBQXdDLCtCQUErQixFQUFFO0FBQ3pFLGtEQUFrRCw4RUFBOEU7QUFDaEk7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0Qsb0NBQW9DO0FBQzVGLHlEQUF5RCxxQ0FBcUM7QUFDOUYseURBQXlELHFDQUFxQztBQUM5Riw0Q0FBNEMsd0JBQXdCO0FBQ3BFLHFDQUFxQyxvQkFBb0I7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvSUFBb0ksK0JBQStCLEVBQUU7QUFDcksscUVBQXFFLFVBQVUsRUFBRTtBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLE9BQU87QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQsd0JBQXdCLEVBQUU7QUFDM0U7QUFDQSxpREFBaUQsd0JBQXdCLEVBQUU7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNELFVBQVUsaURBQWlELEVBQUUsRUFBRTtBQUNySCxtREFBbUQsVUFBVSxpQkFBaUIsRUFBRSxFQUFFO0FBQ2xGO0FBQ0EseUJBQXlCLHlCQUF5QjtBQUNsRCxhQUFhO0FBQ2I7QUFDQTtBQUNBLG1EQUFtRCxvQkFBb0IsbUNBQW1DLEVBQUUsRUFBRTtBQUM5RztBQUNBLG9EQUFvRCxvQkFBb0Isb0NBQW9DLEVBQUUsRUFBRTtBQUNoSCxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCw0QkFBNEIsRUFBRTtBQUMvRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxnQkFBZ0I7QUFDcEQ7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSw4RUFBOEUseURBQXlELFlBQVkscUNBQXFDLFdBQVcscUNBQXFDO0FBQ3hPO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLG9CQUFvQixFQUFFLDRCQUE0QixvQkFBb0IsRUFBRSx5QkFBeUIsbUJBQW1CLEVBQUU7QUFDNUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLFFBQVE7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLDJDQUEyQyxzQ0FBc0MsRUFBRTtBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLCtDQUErQyxpQ0FBaUMsRUFBRTtBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxrQzs7Ozs7OztBQ3ppQkE7QUFDQTtBQUNBO0FBQ0EsVUFBVSxnQkFBZ0Isc0NBQXNDLGlCQUFpQixFQUFFO0FBQ25GLHlCQUF5Qix1REFBdUQ7QUFDaEY7QUFDQTtBQUNBLHVCQUF1QixzQkFBc0I7QUFDN0M7QUFDQTtBQUNBLENBQUM7QUFDRCw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QywwQkFBMEIsRUFBRTtBQUNyRTtBQUNBO0FBQ0Esb0RBQW9ELHVDQUF1QyxFQUFFO0FBQzdGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsOEhBQThIO0FBQ2pLLDBDQUEwQyw4QkFBOEI7QUFDeEUsMENBQTBDLDhCQUE4QjtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLE9BQU87QUFDOUI7QUFDQTtBQUNBLG9DQUFvQyxpQkFBaUI7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSx1QkFBdUI7QUFDcEMsYUFBYSx1QkFBdUI7QUFDcEMsYUFBYSx1QkFBdUI7QUFDcEMsYUFBYSx1QkFBdUI7QUFDcEMsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxrRUFBa0UsaUNBQWlDLDREQUE0RCxpQ0FBaUM7QUFDaE07QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELHNCQUFzQixFQUFFO0FBQ3hFO0FBQ0E7QUFDQSw2QkFBNkIsZUFBZSxFQUFFO0FBQzlDLDJCQUEyQixZQUFZLEVBQUU7QUFDekMsNEJBQTRCLFlBQVksRUFBRTtBQUMxQywyQkFBMkIsa0JBQWtCLEVBQUU7QUFDL0Msb0RBQW9ELHlFQUF5RSxFQUFFO0FBQy9IO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixlQUFlLEVBQUU7QUFDOUMsMkJBQTJCLFlBQVksRUFBRTtBQUN6Qyw0QkFBNEIsWUFBWSxFQUFFO0FBQzFDLDJCQUEyQixtQkFBbUIsRUFBRTtBQUNoRCxvREFBb0QseUVBQXlFLEVBQUU7QUFDL0g7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLHFCQUFxQjtBQUN0RDtBQUNBLGdEQUFnRCxpRUFBaUUsRUFBRSxnSEFBZ0gsV0FBVyxhQUFhO0FBQzNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsa0NBQWtDLEVBQUU7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLGlDQUFpQyx5QkFBeUIsRUFBRTtBQUM1RCxpQ0FBaUMsMENBQTBDLEVBQUU7QUFDN0U7QUFDQTtBQUNBLCtDQUErQywrQkFBK0IsRUFBRTtBQUNoRixnREFBZ0QsbUJBQW1CLHdCQUF3QixFQUFFO0FBQzdGLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2REFBNkQsNkJBQTZCLEVBQUU7QUFDNUYsNkRBQTZELDZCQUE2QixFQUFFO0FBQzVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxvQ0FBb0MsRUFBRTtBQUN4RTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsdUNBQXVDLEVBQUU7QUFDekUsOEJBQThCLG9DQUFvQyxFQUFFO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyx1Q0FBdUMsRUFBRTtBQUN6RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsa0JBQWtCO0FBQ3JELHFDQUFxQyxvQkFBb0I7QUFDekQsdUNBQXVDLHVCQUF1QjtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2Qyw0QkFBNEIsRUFBRSx3QkFBd0IsMEJBQTBCLEVBQUU7QUFDL0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsaUVBQWlFO0FBQ25HO0FBQ0Esa0NBQWtDLG1DQUFtQyxFQUFFO0FBQ3ZFLCtCQUErQixrQ0FBa0MsRUFBRTtBQUNuRTtBQUNBLGtDQUFrQyxtQ0FBbUMsRUFBRTtBQUN2RSwrQkFBK0Isa0NBQWtDLEVBQUU7QUFDbkU7QUFDQSxrQ0FBa0MsK0JBQStCLEVBQUU7QUFDbkUsbUNBQW1DLGlDQUFpQyxFQUFFO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELGFBQWEsRUFBRSw4REFBOEQseUVBQXlFLEVBQUU7QUFDMU07QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRCxhQUFhLEVBQUUsOERBQThELHlFQUF5RSxFQUFFO0FBQzFNO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxrQ0FBa0MsRUFBRTtBQUN0RSxrQ0FBa0Msa0NBQWtDO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0EscUM7Ozs7Ozs7QUMvY0E7O0dBRUc7QUFDRztJQUNGLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDO1FBQ25CLE1BQU0sQ0FBQyxZQUFZLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRztJQUMzQyxDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUc7UUFDN0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQzVCLEtBQUssRUFBRSxPQUFPO1lBQ2QsV0FBVyxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDO1NBQ2xDLENBQUM7SUFDTixDQUFDO0NBRUo7QUFBQTtBQUFBO0FBRUs7SUFJRixZQUFZLFdBQVcsRUFBRSxPQUFPLEdBQUcsRUFBRTtRQUNqQyxJQUFJLENBQUMsY0FBYyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO2FBQzNDLEtBQUssQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUMsQ0FBQztJQUU5QyxDQUFDO0lBRUQsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsSUFBSTtRQUN6QixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsTUFBTSxFQUFFLEdBQXFCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFHLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUNqRixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU3QixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztDQUNKO0FBQUE7QUFBQTs7Ozs7Ozs7QUNyQ0Q7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsWUFBWTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNERBQTRELG1CQUFtQixFQUFFO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLFdBQVc7QUFDekMsNERBQTRELG1CQUFtQixFQUFFO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlELGdCQUFnQixFQUFFO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLHlDOzs7Ozs7O0FDekhBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSx1QkFBdUIsT0FBTztBQUM5QixrREFBa0QsOERBQThELEVBQUU7QUFDbEg7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLE9BQU87QUFDOUI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMscUJBQXFCLEVBQUU7QUFDOUQsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsZ0JBQWdCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdEQUF3RCxhQUFhLEVBQUU7QUFDdkU7QUFDQTtBQUNBLG1CQUFtQixpQkFBaUI7QUFDcEMsb0JBQW9CLGlCQUFpQjtBQUNyQztBQUNBLHFDQUFxQyxxQkFBcUI7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMscUJBQXFCO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUM7Ozs7Ozs7QUN2SEE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLFVBQVU7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsT0FBTztBQUM5QjtBQUNBLDJCQUEyQixPQUFPO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixZQUFZO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLDRCQUE0QixFQUFFO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsT0FBTztBQUM5Qix1QkFBdUIsWUFBWTtBQUNuQztBQUNBLDJCQUEyQixPQUFPO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsWUFBWTtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsWUFBWTtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsWUFBWTtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsWUFBWTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixZQUFZO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGNBQWM7QUFDckMsdUJBQXVCLFlBQVk7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGFBQWE7QUFDeEM7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixZQUFZO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsWUFBWTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsT0FBTztBQUM5QiwyQkFBMkIsT0FBTztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsWUFBWTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QywyQ0FBMkMsRUFBRTtBQUMzRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsdUJBQXVCLFlBQVk7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QyxhQUFhO0FBQzFELDJDQUEyQyxPQUFPO0FBQ2xEO0FBQ0EsK0JBQStCLFlBQVk7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLFVBQVU7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLG1DOzs7Ozs7O0FDeFZBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLGtCQUFrQjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxZQUFZO0FBQzVDLCtCQUErQixXQUFXO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxnREFBZ0Q7QUFDckYsd0NBQXdDLHVCQUF1QixFQUFFO0FBQ2pFLHVDQUF1QyxzQkFBc0IsRUFBRTtBQUMvRDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLE9BQU87QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixrQkFBa0I7QUFDN0MsOEJBQThCLGFBQWE7QUFDM0M7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsRUFBRTtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsT0FBTztBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxtQ0FBbUMsRUFBRTtBQUM3RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNELHlCQUF5QixFQUFFO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsNkNBQTZDLGtCQUFrQixVQUFVLEVBQUU7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELGtCQUFrQixVQUFVLEVBQUU7QUFDaEY7QUFDQSx5Q0FBeUMsdUJBQXVCLEVBQUU7QUFDbEU7QUFDQTtBQUNBLHlDQUF5QyxrQ0FBa0MsRUFBRTtBQUM3RTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsT0FBTztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxxQ0FBcUMsc0NBQXNDLEVBQUU7QUFDN0U7QUFDQTtBQUNBLG1CQUFtQixXQUFXO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdFQUFnRSxxQkFBcUIsRUFBRTtBQUN2RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0M7Ozs7Ozs7QUN0WUE7O0dBRUc7QUFDRztJQU1GLFlBQVksT0FBZ0I7UUFDeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFO0lBQzVCLENBQUM7SUFHRCxJQUFJLENBQUMsVUFBa0IsRUFBRSxhQUF1QjtRQUM1QyxHQUFHLENBQUMsQ0FBQyxNQUFNLFNBQVMsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUMsQ0FBQyxDQUFDO1lBQ3JELE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN2RSxDQUFDO0lBQ0wsQ0FBQztJQUVELFlBQVk7UUFDUixNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUMvQixDQUFDO0lBRUQsT0FBTyxDQUFDLFNBQWlCLEVBQUUsTUFBYztRQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxTQUFTLEVBQUUsRUFBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckUsQ0FBQztDQUVKO0FBQUE7QUFBQTs7Ozs7Ozs7QUMvQkQ7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsT0FBTztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix5QkFBeUI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLHlCQUF5QjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLE9BQU87QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixPQUFPO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLFFBQVE7QUFDM0MsK0JBQStCLE9BQU87QUFDdEM7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHVCQUF1QjtBQUM5QztBQUNBO0FBQ0EsOERBQThELGlFQUFpRSxFQUFFO0FBQ2pJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQywyQkFBMkI7QUFDN0Qsa0NBQWtDLDJCQUEyQjtBQUM3RCxrQ0FBa0MsNEJBQTRCO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLHFCQUFxQixFQUFFO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxZQUFZO0FBQ1o7QUFDQTtBQUNBLHNDOzs7Ozs7O0FDNVRBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsZ0JBQWdCLHNDQUFzQyxpQkFBaUIsRUFBRTtBQUNuRix5QkFBeUIsdURBQXVEO0FBQ2hGO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELFFBQVE7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLDRFQUE0RSxFQUFFO0FBQ25IO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLE9BQU87QUFDbEM7QUFDQSwrQkFBK0IsY0FBYztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsV0FBVztBQUN0QztBQUNBLG1DQUFtQyxPQUFPO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixPQUFPO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxPQUFPO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxPQUFPO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixPQUFPO0FBQzFCLHVCQUF1QixPQUFPO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLE9BQU87QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxpQ0FBaUMsRUFBRTtBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsT0FBTztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDOzs7Ozs7O0FDaGFBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsbUJBQW1CO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyw0QkFBNEIsRUFBRTtBQUNqRTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsaUJBQWlCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGlCQUFpQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLGtEQUFrRCxFQUFFO0FBQ3ZGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixrQkFBa0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGtCQUFrQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixZQUFZO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixxQkFBcUI7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEM7Ozs7Ozs7QUN2TUE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixhQUFhO0FBQzNDLDhCQUE4QixhQUFhO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBLHVCQUF1QixPQUFPO0FBQzlCO0FBQ0EsMkJBQTJCLE9BQU87QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyxtQkFBbUI7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0QsMkVBQTJFLEVBQUU7QUFDckksc0RBQXNELGVBQWUsRUFBRTtBQUN2RSxzREFBc0QsZ0JBQWdCLEVBQUU7QUFDeEU7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELGtDQUFrQyxFQUFFO0FBQ3hGLFNBQVM7QUFDVCxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsK0NBQStDLDhDQUE4QyxFQUFFO0FBQy9GLHlGQUF5RixnQkFBZ0IsRUFBRTtBQUMzRztBQUNBO0FBQ0EsNkNBQTZDLHlDQUF5QyxFQUFFO0FBQ3hGO0FBQ0EsU0FBUztBQUNULGlFQUFpRSxjQUFjLEVBQUU7QUFDakYsaUVBQWlFLGNBQWMsRUFBRTtBQUNqRjtBQUNBO0FBQ0EsaURBQWlELFVBQVUsMkNBQTJDLEVBQUUsRUFBRTtBQUMxRyw4Q0FBOEMsVUFBVSxtQ0FBbUMsRUFBRSxFQUFFO0FBQy9GLGlEQUFpRCxVQUFVLDJDQUEyQyxFQUFFLEVBQUU7QUFDMUcsOENBQThDLFVBQVUsbUNBQW1DLEVBQUUsRUFBRTtBQUMvRjtBQUNBLG9DQUFvQyxxQkFBcUIsRUFBRTtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQSx5Q0FBeUMsd0NBQXdDO0FBQ2pGO0FBQ0EsMkJBQTJCLG9CQUFvQjtBQUMvQztBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsNERBQTREO0FBQzlGO0FBQ0EsU0FBUztBQUNUO0FBQ0EsNkNBQTZDLGtDQUFrQyxjQUFjLEVBQUUsYUFBYTtBQUM1RztBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRCwyREFBMkQsRUFBRTtBQUNuSDtBQUNBO0FBQ0EsNERBQTRELDZCQUE2QixFQUFFO0FBQzNGO0FBQ0E7QUFDQSw0Q0FBNEMsb0NBQW9DLEVBQUU7QUFDbEY7QUFDQSxzQ0FBc0Msc0JBQXNCLEVBQUU7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsY0FBYztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxpQ0FBaUMsRUFBRTtBQUMvRSwwRUFBMEUsOEJBQThCLEVBQUU7QUFDMUc7QUFDQSxrQ0FBa0MseUNBQXlDLEVBQUU7QUFDN0UsbUNBQW1DLDRFQUE0RSxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7QUFDekksMkNBQTJDLHVCQUF1QixFQUFFO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixvQkFBb0I7QUFDNUM7QUFDQSw0QkFBNEIsbUJBQW1CO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QywwQkFBMEIsRUFBRTtBQUNwRTtBQUNBO0FBQ0EsdUJBQXVCLHNCQUFzQjtBQUM3QztBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDLHFDQUFxQyxFQUFFO0FBQ25GO0FBQ0EsdUJBQXVCLE9BQU87QUFDOUIsMkJBQTJCLE9BQU87QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix5QkFBeUI7QUFDaEQ7QUFDQTtBQUNBLDJCQUEyQix3QkFBd0I7QUFDbkQ7QUFDQSw2QkFBNkIsaURBQWlEO0FBQzlFLDZCQUE2QixpREFBaUQ7QUFDOUU7QUFDQSx5Q0FBeUMsd0NBQXdDLEVBQUU7QUFDbkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCwwQ0FBMEMsRUFBRTtBQUM3RjtBQUNBLGtEQUFrRCxtQ0FBbUMsRUFBRTtBQUN2RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGtCQUFrQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLDZEQUE2RDtBQUM3RjtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDLCtCQUErQixrQkFBa0I7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxhQUFhO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLGFBQWE7QUFDakQ7QUFDQTtBQUNBLG9DQUFvQyxhQUFhO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0EsNkNBQTZDLGdGQUFnRjtBQUM3SDtBQUNBO0FBQ0EsdUJBQXVCLGlCQUFpQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QyxpQ0FBaUMsRUFBRTtBQUNoRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCx1QkFBdUIseUJBQXlCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLHVCQUF1Qix5QkFBeUI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0Esc0NBQXNDLGlCQUFpQixFQUFFLDRCQUE0QixpQkFBaUIsRUFBRSw0QkFBNEIsaUJBQWlCO0FBQ3JKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1FQUFtRSx3QkFBd0IsRUFBRTtBQUM3RjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixrQkFBa0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxzQzs7Ozs7Ozs7QUNyaUI2QztBQUd2QztJQUdGLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBQyxLQUFLLEVBQUM7UUFDcEIsTUFBTSxPQUFPLEdBQUcsbUVBQVUsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUMxRCxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV6QyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7SUFDL0IsQ0FBQztJQUdELE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBQyxLQUFLLEVBQUUsS0FBSyxHQUFHLEVBQUUsRUFBRSxHQUFHLEdBQUcsS0FBSyxFQUFDO1FBQzlDLE1BQU0sT0FBTyxHQUFHLG1FQUFVLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDNUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUM7WUFDcEIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO1lBQ2IsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDO1lBQ1osQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDO1NBQUMsQ0FBQyxDQUFDO1FBRXZCLE1BQU0sQ0FBQyxPQUFPO2FBQ1QsR0FBRyxDQUFDLE9BQU8sQ0FBQztJQUNyQixDQUFDO0lBRUQsTUFBTSxDQUFDLGtCQUFrQixDQUFDLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQztRQUN0QyxNQUFNLE9BQU8sR0FBRyxtRUFBVSxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1FBQ3BFLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDO1lBQ3BCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQztZQUNiLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQztTQUFDLENBQUMsQ0FBQztRQUUzQixNQUFNLENBQUMsT0FBTzthQUNULEdBQUcsQ0FBQyxPQUFPLENBQUM7SUFDckIsQ0FBQztDQUdKO0FBQUE7QUFBQTtBQUdLO0lBYUYsWUFBWSxNQUFNLEVBQUUsT0FBTztRQVhWLFlBQU8sR0FPcEIsSUFBSSxDQUFDO1FBS0wsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDNUIsQ0FBQztJQUVELElBQUksTUFBTTtRQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFJLElBQUk7UUFDSixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDN0IsQ0FBQztJQUVELElBQUksWUFBWTtRQUNaLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztJQUNyQyxDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1AsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxJQUFJLE9BQU87UUFDUCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7SUFDaEMsQ0FBQztJQUVELElBQUksTUFBTTtRQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUMvQixDQUFDO0NBRUo7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNqRnVCO0FBQ0k7QUFFaUM7QUFDWjtBQUVqRCxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRTtJQUNqQixrQ0FBa0M7SUFDbEMsRUFBRTtJQUNGLEVBQUU7SUFDRiwyREFBMkQ7SUFDM0QsMEVBQTBFO0lBRTFFLE1BQU0sU0FBUyxHQUFHLElBQUksb0ZBQWUsRUFBRSxDQUFDO0lBR3hDLG9CQUFvQjtJQUVwQixNQUFNLFlBQVksR0FBRyxHQUFHLEVBQUU7UUFDdEIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3JCLE1BQU0sS0FBSyxHQUF1QiwwQ0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksRUFBRyxDQUFDLEtBQUssQ0FBQztRQUcxRSwyREFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQUMsQ0FBQzthQUNsQyxJQUFJLENBQUMsQ0FBQyxJQUFZLEVBQUUsRUFBRTtZQUNuQixpQ0FBaUM7WUFDakMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRzNCLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN6QixDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsQ0FBQyxLQUFZLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDbEUsQ0FBQyxDQUFDO0lBRUYsTUFBTSxlQUFlLEdBQUcsZ0RBQVUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFdkQsMENBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBRXJELDBDQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUU7UUFDMUMsTUFBTSxPQUFPLEdBQUcseUNBQVEsQ0FBQyxPQUFPLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMseUNBQVEsWUFBWSxhQUV4QixDQUFDLENBQUMsQ0FBQztZQUVDLGVBQWUsRUFBRSxDQUFDO1lBQ2xCLGtCQUFrQjtRQUN0QixDQUFDO0lBQ0wsQ0FBQyxDQUFDO0lBR0YsdUJBQXVCO0lBQ3ZCLG9GQUFvRjtJQUVwRjtRQUNJLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDaEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNqRixzREFBc0Q7SUFDMUQsQ0FBQztJQUdELENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7SUFFL0IsWUFBWSxFQUFFLENBQUM7QUFHbkIsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xFc0I7QUFDSTtBQUVpQztBQUNEO0FBQ3JCO0FBQ0U7QUFDUTtBQUNFO0FBQ0E7QUFDRDtBQXVCNUM7SUFNRjtRQUNJLElBQUksQ0FBQyxRQUFRLEdBQUc7WUFDWixJQUFJLEVBQUUsMENBQVMsQ0FBQyxPQUFPLENBQUM7WUFDeEIsSUFBSSxFQUFFLDBDQUFTLENBQUMsT0FBTyxDQUFDO1lBQ3hCLE1BQU0sRUFBRSwwQ0FBUyxDQUFDLE9BQU8sQ0FBQztZQUMxQixLQUFLLEVBQUUsMENBQVMsQ0FBQyxPQUFPLENBQUM7WUFDekIsVUFBVSxFQUFFLDBDQUFTLENBQUMsT0FBTyxDQUFDO1lBQzlCLFdBQVcsRUFBRSwwQ0FBUyxDQUFDLE9BQU8sQ0FBQztTQUNsQyxDQUFDO1FBRUYsTUFBTSxTQUFTLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUNyQixhQUFhLEVBQUUsRUFBRTtZQUNqQixhQUFhLEVBQUUsSUFBSTtZQUNuQixTQUFTLEVBQUUsSUFBSTtZQUNmLGFBQWEsRUFBRSxJQUFJO1lBQ25CLGFBQWEsRUFBRSxFQUFFO1NBQ3BCLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxJQUFJLEdBQUc7WUFDUixJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQ2pCLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDakIsTUFBTSxFQUFFLFNBQVMsRUFBRTtZQUNuQixLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2xCLFVBQVUsRUFBRSxTQUFTLEVBQUU7WUFDdkIsV0FBVyxFQUFFLFNBQVMsRUFBRTtTQUMzQixDQUFDO1FBRUYsSUFBSSxDQUFDLFFBQVEsR0FBRztZQUNaLElBQUksRUFBRSxDQUFDO1lBQ1AsU0FBUyxFQUFFLEVBQUU7WUFDYixVQUFVLEVBQUUsRUFBRTtZQUNkLE9BQU8sRUFBRSxFQUFFO1lBQ1gsUUFBUSxFQUFFLEVBQUU7WUFDWixVQUFVLEVBQUUsS0FBSztZQUNqQixTQUFTLEVBQUUsRUFBRTtZQUNiLGFBQWEsRUFBRSxJQUFJO1lBQ25CLGNBQWMsRUFBRSxJQUFJO1NBQ3ZCLENBQUM7UUFHRixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksbUZBQWtCLENBQVcsMENBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRS9FLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFFWixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFFdkIsQ0FBQztJQUVELEtBQUs7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztZQUNwRCxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJO1lBQ3ZCLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsU0FBUyxFQUFFLEVBQUMsYUFBYSxFQUFFLEtBQUssRUFBQztZQUNqQyxPQUFPLEVBQUU7Z0JBQ0wsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQywrQ0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUN2RSxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVO2dCQUNoQyxNQUFNLEVBQUUsR0FBRztnQkFDWCxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTO2FBQ3RDO1NBQ0osQ0FBQyxDQUFDLENBQUM7UUFFSixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztZQUNoRCxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJO1lBQ3ZCLFNBQVMsRUFBRSxlQUFlO1lBQzFCLFNBQVMsRUFBRSxFQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUM7WUFDakMsT0FBTyxFQUFFO2dCQUNMLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsK0RBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQywrREFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLO2dCQUNuRixTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTO2FBQ3JDO1NBQ0osQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztZQUM3QyxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJO1lBQ3ZCLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLE9BQU8sRUFBRSxFQUFFO1NBQ2QsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7WUFDaEQsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSTtZQUN2QixTQUFTLEVBQUUsZUFBZTtZQUMxQixTQUFTLEVBQUUsRUFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUM7WUFDcEMsT0FBTyxFQUFFO2dCQUNMLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVM7Z0JBQ2xDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsK0RBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQywrREFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLO2dCQUNuRixjQUFjLEVBQUUsU0FBUztnQkFDekIsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7YUFDNUU7U0FDSixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztZQUNwRCxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJO1lBQ3ZCLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsU0FBUyxFQUFFLEVBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFDO1lBQ3BDLE9BQU8sRUFBRTtnQkFDTCxXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FDYixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDckMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLCtDQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ3hGLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVU7Z0JBQ2hDLE1BQU0sRUFBRSxHQUFHO2dCQUNYLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVM7YUFDdEM7U0FDSixDQUFDLENBQUMsQ0FBQztRQUVKLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztZQUNuRCxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJO1lBQ3ZCLFNBQVMsRUFBRSxjQUFjO1lBQ3pCLFNBQVMsRUFBRSxFQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUM7WUFDakMsT0FBTyxFQUFFO2dCQUNMLGNBQWMsRUFBRSxVQUFVO2dCQUMxQixXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQzthQUN6RTtTQUNKLENBQUMsQ0FBQztRQUdILE9BQU87UUFHUCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUM7WUFDMUQsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSTtZQUN2QixTQUFTLEVBQUUsc0JBQXNCO1lBQ2pDLE1BQU0sRUFBRSxLQUFLO1lBQ2IsS0FBSyxFQUFFLGNBQWM7WUFDckIsU0FBUyxFQUFFLEVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUM7U0FDckUsQ0FBQyxDQUFDLENBQUM7UUFFSixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsZUFBZSxDQUFDLFdBQVcsQ0FBQztZQUN2RCxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJO1lBQ3ZCLFNBQVMsRUFBRSxxQkFBcUI7WUFDaEMsTUFBTSxFQUFFLEtBQUs7WUFDYixLQUFLLEVBQUUsYUFBYTtZQUNwQixTQUFTLEVBQUUsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBQztTQUNwRSxDQUFDO1FBRUYsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLGVBQWUsQ0FBQyxXQUFXLENBQUM7WUFDbkQsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSTtZQUN2QixTQUFTLEVBQUUsWUFBWTtZQUN2QixNQUFNLEVBQUUsS0FBSztZQUNiLEtBQUssRUFBRSxhQUFhO1lBQ3BCLFNBQVMsRUFBRSxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBQztTQUM5QyxDQUFDO1FBRUYsb0NBQW9DO1FBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO1lBQ2hELEdBQUcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUk7WUFDdkIsU0FBUyxFQUFFLHFCQUFxQjtZQUNoQyxTQUFTLEVBQUUsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFDO1lBQ3BFLE9BQU8sRUFBRTtnQkFDTCxVQUFVLEVBQUUsRUFBRTtnQkFDZCxXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEQsZUFBZSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU07YUFDakM7U0FDSixDQUFDO1FBRUYsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDO1lBQzFELEdBQUcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUk7WUFDdkIsU0FBUyxFQUFFLHNCQUFzQjtZQUNqQyxNQUFNLEVBQUUsS0FBSztZQUNiLEtBQUssRUFBRSxjQUFjO1lBQ3JCLFNBQVMsRUFBRSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUM7U0FDeEUsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO1lBQ25ELEdBQUcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUk7WUFDdkIsU0FBUyxFQUFFLHFCQUFxQjtZQUNoQyxTQUFTLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUM7WUFDakQsT0FBTyxFQUFFO2dCQUNMLFVBQVUsRUFBRSxFQUFFO2dCQUNkLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO2dCQUNyRSxlQUFlLEVBQUUsSUFBSTthQUN4QjtTQUNKLENBQUMsQ0FBQztJQUVQLENBQUM7SUFFRCxNQUFNLENBQUMsUUFBUTtRQUVYLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxnRUFBVyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUU1QyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUc5QixNQUFNLEdBQUcsR0FBYyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDcEQsTUFBTSxHQUFHLEdBQWMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBRXBELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQztRQUN4QyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFakIsR0FBRyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEMsR0FBRyxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO1FBRXBCLE1BQU0sSUFBSSxHQUFrQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDckQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVsQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFHMUQsbUJBQW1CO1FBRW5CLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLHlDQUF5QyxDQUFDLENBQUM7UUFFNUYsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNyQyxFQUFFLENBQUMsQ0FBQyxlQUFlLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkIsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFDLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUMxRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25CLENBQUM7UUFFTCxDQUFDLENBQUM7SUFHTixDQUFDO0lBR0QsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sR0FBRyxJQUFJLEVBQUUsS0FBSyxHQUFZLElBQUksRUFBQztRQUNoRixNQUFNLEdBQUcsR0FBRyxHQUFHO2FBQ1YsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxHQUFHLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDeEUscUNBQXFDO1FBQ3JDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDUixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BCLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUMsQ0FBQztpQkFDL0QsTUFBTSxDQUFDO2dCQUNKLE9BQU8sRUFBRSxjQUFjO2FBQzFCLENBQUMsQ0FBQztRQUNQLElBQUk7WUFBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxlQUFlLENBQUMsRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUM7UUFDaEQsTUFBTSxHQUFHLEdBQUcsZUFBZSxDQUFDLFdBQVcsQ0FBQyxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBRW5GLE1BQU0sQ0FBQyxJQUFJLDZEQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDO0lBQ3ZELENBQUM7SUFHRCxNQUFNLENBQUMsaUJBQWlCLENBQUMsRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBQztRQUNoRCxNQUFNLENBQUMsR0FBRzthQUNMLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7YUFDeEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUdELGdCQUFnQixDQUFDLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFDO1FBQ2pELE1BQU0sR0FBRyxHQUFHLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUUzRSxNQUFNLENBQUMsSUFBSSwrREFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFHRCxnQkFBZ0IsQ0FBQyxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFNBQVMsR0FBRyxJQUFJLEVBQUM7UUFDeEQsTUFBTSxHQUFHLEdBQUcsZUFBZSxDQUFDLGlCQUFpQixDQUFDLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO1FBRTNFLE1BQU0sQ0FBQyxJQUFJLHVFQUFZLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDO0lBQzVELENBQUM7SUFFRCxlQUFlLENBQUMsRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUM7UUFDaEQsTUFBTSxHQUFHLEdBQUcsZUFBZSxDQUFDLGlCQUFpQixDQUFDLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO1FBRTNFLE1BQU0sQ0FBQyxJQUFJLCtEQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDO0lBQ3hELENBQUM7SUFFRCxvQkFBb0IsQ0FBQyxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBQztRQUNyRCxNQUFNLEdBQUcsR0FBRyxlQUFlLENBQUMsaUJBQWlCLENBQUMsRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7UUFFM0UsTUFBTSxDQUFDLElBQUkseUVBQWEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUM7SUFDN0QsQ0FBQztJQUVELG9CQUFvQixDQUFDLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFDO1FBQ3JELE1BQU0sR0FBRyxHQUFHLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUUzRSxNQUFNLENBQUMsSUFBSSx5RUFBYSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQztJQUM3RCxDQUFDO0lBR0QsMEJBQTBCLENBQUMsSUFBSTtRQUMzQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztnQkFDcEQsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTTtnQkFDekIsU0FBUyxFQUFFLGdCQUFnQjtnQkFDM0IsU0FBUyxFQUFFLEVBQUMsYUFBYSxFQUFFLE9BQU8sRUFBQztnQkFDbkMsT0FBTyxFQUFFLEVBQUU7YUFDZCxDQUFDO1FBQ04sQ0FBQztRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsaUNBQWlDLENBQUMsQ0FBQztRQUM1RSxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELGtCQUFrQjtRQUNkLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDdkMsQ0FBQztJQUNMLENBQUM7SUFHRCxxQkFBcUIsQ0FBQyxJQUFJO1FBQ3RCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDO2dCQUNyRCxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNO2dCQUN6QixTQUFTLEVBQUUsaUJBQWlCO2dCQUM1QixTQUFTLEVBQUUsRUFBQyxhQUFhLEVBQUUsTUFBTSxFQUFDO2dCQUNsQyxPQUFPLEVBQUUsRUFBRTthQUNkLENBQUM7UUFDTixDQUFDO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFHRCxXQUFXO1FBQ1AsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsRUFBRTtZQUNoQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxnREFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDOUYsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLHVFQUFZLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUMsQ0FBQztZQUMxRSxJQUFJO2dCQUFDLE1BQU0sQ0FBQyxFQUFDLEtBQUssRUFBRSx1RUFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDLENBQUM7UUFDL0UsQ0FBQyxDQUFDO1FBR0YsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsK0RBQVEsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzFELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYTttQkFDdEMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUUvQyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUM7Z0JBQ2hCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFDNUMsR0FBRyxHQUFHLEtBQUs7Z0JBQ2YsQ0FBQztnQkFFRCxNQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDO2dCQUU3QywyREFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUMsQ0FBQztxQkFDdkQsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNULDZDQUE2QztvQkFFN0MsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDbkMsOENBQThDO29CQUM5QyxNQUFNLFlBQVksR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO29CQUM3QixFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQzt3QkFDaEIsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFFakMsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7NEJBQ3BDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQzNCLENBQUMsRUFBRSxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDbkQsQ0FBQyxDQUFDO3dCQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO3dCQUNsRCwyREFBTSxDQUFDLGtCQUFrQixDQUFDLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQyxDQUFDOzZCQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7NEJBQ1QsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7NEJBQ25ELHlDQUF5Qzs0QkFDekMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUMvQyxDQUFDLENBQUM7b0JBRVYsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSix5Q0FBeUM7d0JBQ3pDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDL0MsQ0FBQztnQkFHTCxDQUFDLENBQUM7cUJBQ0QsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFHckQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ2pELENBQUM7UUFHTCxDQUFDLENBQUM7UUFFRixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQywrREFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFxQixFQUFFLEVBQUU7WUFDMUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVsRCxNQUFNLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQyxHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsRCxHQUFHLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUcvRCxDQUFDLENBQUM7SUFHTixDQUFDO0NBQ0o7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7QUNyYXdCO0FBQ29CO0FBQ0U7QUFLL0MsSUFBSyxPQUFxQjtBQUExQixXQUFLLE9BQU87SUFBRSx1Q0FBSztJQUFFLHFDQUFJO0FBQUEsQ0FBQyxFQUFyQixPQUFPLEtBQVAsT0FBTyxRQUFjO0FBV3BCLGNBQWdCLFNBQVEsb0VBQVU7SUE0QnBDLDJCQUEyQjtJQUMzQixZQUFZLFFBQWUsRUFBRSxZQUFpQyxFQUFFLFVBQWMsRUFBRTtRQUM1RSxLQUFLLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBckJ6QixtQkFBYyxHQUFHO1lBQ3RCLGFBQWEsRUFBRSxJQUFJO1lBQ25CLFVBQVUsRUFBRSxFQUFFO1lBQ2QsU0FBUyxFQUFFLEdBQUc7WUFDZCxRQUFRLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJO1lBQy9CLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQy9CLGNBQWMsRUFBRSxRQUFRO1lBQ3hCLGFBQWEsRUFBRSxFQUFFO1lBQ2pCLFFBQVEsRUFBRSxDQUFDO1NBQ2QsQ0FBQztRQUVGOzs7O1dBSUc7UUFDTSxXQUFNLEdBQUcsRUFBRSxDQUFDO1FBTWpCLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELEtBQUs7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWE7ZUFDaEQsSUFBSSxxRUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFFdkQsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUdELFFBQVEsQ0FBQyxJQUFpQjtRQUN0QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVoQyxNQUFNLFVBQVUsR0FBRztZQUNmLElBQUksRUFBRSxFQUFFO1NBQ1gsQ0FBQztRQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztRQUNsQyxzQkFBc0I7UUFHdEIsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3pCLElBQUksRUFBRSxLQUFLO1lBQ1gsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDO1NBQzFELENBQUMsQ0FBQztRQUNILE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMxQixJQUFJLEVBQUUsS0FBSztZQUNYLEtBQUssRUFBRSxFQUFFLENBQUMsU0FBUyxHQUFHLEVBQUU7WUFDeEIsU0FBUyxFQUFFLEVBQUUsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztTQUNoRCxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxLQUFLLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN6QyxVQUFVLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN6RixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixVQUFVLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN4RixDQUFDO1FBR0QsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxFQUFFO1lBQ3BCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNaLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUN6QixNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUM7b0JBQ2hCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO29CQUNyQixNQUFNLENBQUMsR0FBRztnQkFDZCxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ0osVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNyQixNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ2QsQ0FBQyxDQUFDO1FBRUYsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRzNELG9DQUFvQztRQUNwQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNkLEtBQUssRUFBRSx1Q0FBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUM7WUFDN0IsTUFBTSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUM7U0FDdkQsQ0FBQyxDQUFDO1FBQ0gsaUNBQWlDO1FBRWpDLE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFFdEIsQ0FBQztJQUVELGlCQUFpQixDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUM7UUFDN0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQ3JCLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUMzQjtZQUNJLE9BQU87WUFDUCxNQUFNLEVBQUUsSUFBSTtZQUNaLElBQUksRUFBRSxDQUFDO1lBQ1AsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHO1lBQ1YsS0FBSyxFQUFFLENBQUM7WUFDUixjQUFjLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjO1NBQzlDLENBQUM7SUFDVixDQUFDO0lBR0QsYUFBYSxDQUFDLEdBQVcsRUFBRSxLQUFhLEVBQUUsU0FBa0IsRUFBRSxTQUFTLEdBQUcsS0FBSztRQUUzRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7YUFDakQsT0FBTyxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQWMsRUFBRSxDQUFTO1lBQ3JELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDckIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQztvQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUM1QixJQUFJO29CQUFDLE1BQU0sQ0FBQywwQ0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7WUFDcEQsQ0FBQztRQUNMLENBQUMsQ0FBQztJQUVWLENBQUM7SUFFRCxxQ0FBcUM7SUFDckMsT0FBTyxDQUFDLFVBQVU7UUFDZCxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3hCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQztRQUVsQiw0Q0FBNEM7UUFFNUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFTLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDckIsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUU7YUFDZCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUM7YUFDckMsS0FBSyxDQUFDLElBQUksQ0FBQzthQUNYLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFdkYsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUM5QyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakUsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRXRCLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUU7YUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsY0FBYyxJQUFJLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMxRSxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUM1QixDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxFQUFFLENBQUM7WUFDSixNQUFNLEVBQUUsRUFBRSxDQUFDLFVBQVUsR0FBRyxDQUFDO1lBQ3pCLEVBQUUsRUFBRSxDQUFDO1lBQ0wsRUFBRSxFQUFFLENBQUM7U0FDUixDQUFDLENBQUM7UUFDSCxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRzFCLGlCQUFpQjtRQUNqQixNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQzthQUNuQyxLQUFLLENBQUMsRUFBQyxXQUFXLEVBQUUsQ0FBQyxDQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxhQUFhLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUUsQ0FBQzthQUNoRixFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDO1lBQzdDLHdGQUF3RjtRQUM1RixDQUFDLENBQUM7YUFDRCxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQyxDQUFDO1lBQzlDLGdGQUFnRjtRQUNwRixDQUFDLENBQUM7YUFDRCxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7UUFHMUQsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUVwRSxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFNLEVBQUUsRUFBRTtZQUNqRCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ2pCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLO21CQUNuQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7Z0JBQzVDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsU0FBUyxLQUFLO1lBQzlHLElBQUk7Z0JBQ0EsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRztRQUNqRixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFHckMsQ0FBQztJQUdELElBQUksU0FBUztRQUNULE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzNCLENBQUM7SUFFRCxJQUFJLElBQUk7UUFDSixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7SUFDaEMsQ0FBQztJQUVELElBQUksa0JBQWtCO1FBQ2xCLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3pELENBQUM7SUFHRCxpQkFBaUIsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUM7UUFDcEIsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFFakQsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQ3JCLFFBQVEsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUM1QjtZQUNJLFFBQVE7WUFDUixNQUFNLEVBQUUsSUFBSTtZQUNaLElBQUksRUFBRSxDQUFDO1lBQ1AsS0FBSyxFQUFFLENBQUM7U0FDWCxDQUFDO0lBRVYsQ0FBQzs7OztBQS9NTSxlQUFNLEdBQUc7SUFDWixXQUFXLEVBQUUsdUJBQXVCO0lBQ3BDLFlBQVksRUFBRSx3QkFBd0I7Q0FDekMsQ0FBQztBQUVLLGdCQUFPLEdBQUcsT0FBTyxDQUFDOzs7Ozs7OztBQ3pCN0I7O0dBRUc7QUFDSCxJQUFJLHFCQUFxQixHQUFHLENBQUMsQ0FBQztBQUN4QjtJQUNGLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBQyxNQUFNLEdBQUcsRUFBRSxFQUFDO1FBQzFCLHFCQUFxQixJQUFJLENBQUMsQ0FBQztRQUUzQixNQUFNLENBQUMsTUFBTSxHQUFHLHFCQUFxQixDQUFDO0lBQzFDLENBQUM7Q0FDSjtBQUFBO0FBQUE7Ozs7Ozs7Ozs7O0FDVjRDO0FBQ3BCO0FBRW5CLGFBQWUsU0FBUSxvRUFBVTtJQXFCbkMsWUFBWSxRQUFRLEVBQUUsWUFBWSxFQUFFLFVBQWMsRUFBRTtRQUNoRCxLQUFLLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBakJ6QixtQkFBYyxHQUFHO1lBQ3RCLEtBQUssRUFBRSxFQUFFO1lBQ1QsVUFBVSxFQUFFLEVBQUU7WUFDZCxjQUFjLEVBQUUsY0FBYztZQUM5QixPQUFPLEVBQUUsS0FBSztZQUNkLE1BQU0sRUFBRSwrQ0FBYyxFQUFFO1lBQ3hCLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUM3QyxlQUFlLEVBQUUsSUFBSTtTQUN4QixDQUFDO1FBRUYscUNBQXFDO1FBQzVCLFdBQU0sR0FBRztZQUNkLCtCQUErQjtZQUMvQixFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDO1NBQzlCLENBQUM7UUFJRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztJQUMzQixDQUFDO0lBRUQsS0FBSztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFJO1FBQ1QsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUV4QixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUNyQixNQUFNLEVBQUUsR0FBYSwwQ0FBUyxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUV6RCxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNkLENBQUM7WUFHRCxFQUFFLENBQUMsTUFBTTtnQkFDTCwrQ0FBYyxFQUFFO3FCQUNYLE1BQU0sQ0FBQyxFQUFFLENBQUM7cUJBQ1YsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqQyxDQUFDO1FBRUQsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV2QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNkLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSztZQUNmLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxVQUFVO1NBQzNDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxFQUFDLFNBQVMsRUFBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxPQUFPLENBQUMsRUFBQyxTQUFTLEVBQUM7UUFFZixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBRXhCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMxRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFckIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV4RSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSwrQkFBK0IsQ0FBQyxDQUFDO1FBRy9FLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ3hCLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDL0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVO1lBQzlCLE1BQU0sRUFBRSxFQUFFLENBQUMsVUFBVSxHQUFHLENBQUM7WUFDekIsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FDM0IsQ0FBQztJQUVOLENBQUM7SUFHRCxJQUFJLE1BQU07UUFDTixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDL0IsQ0FBQzs7OztBQS9FTSxjQUFNLEdBQUcsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7O0FDTnNCO0FBQ3BCO0FBQ0c7QUFJdEIsY0FBZ0IsU0FBUSxvRUFBVTtJQW1CcEMsWUFBWSxRQUFjLEVBQUUsWUFBZ0MsRUFBRSxPQUFPLEdBQUcsRUFBRTtRQUN0RSxLQUFLLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBaEJ6QixtQkFBYyxHQUFHO1lBQ3RCLFVBQVUsRUFBRSxHQUFHO1lBQ2YsTUFBTSxFQUFFLEVBQUU7WUFDVixjQUFjLEVBQUUsV0FBVztZQUMzQixRQUFRLEVBQUUsWUFBWTtZQUN0QixRQUFRLEVBQUUsQ0FBQztZQUNYLE1BQU0sRUFBRSxJQUFJO1lBQ1osV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1NBQ2hELENBQUM7UUFFTyxXQUFNLEdBQUc7WUFDZCxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDO1lBQzNCLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUM7U0FDOUIsQ0FBQztRQUlFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO0lBQzNCLENBQUM7SUFFRCxLQUFLO1FBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDN0MsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFJO1FBRVQsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUV4QixNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sTUFBTSxHQUFHLDZDQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDekMsTUFBTSxPQUFPLEdBQUcsMENBQVMsQ0FBWSxtREFBYSxDQUFXLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFdEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDZCxLQUFLLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUNwRSxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU07U0FDcEIsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxpQ0FBaUMsQ0FBQyxDQUFDO1FBRTdFLE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUM7SUFDNUIsQ0FBQztJQUVELE9BQU8sQ0FBQyxVQUFVO1FBR2QsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUV4QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVwRSxNQUFNLENBQUMsR0FBRyw0Q0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXRGLE1BQU0sSUFBSSxHQUFHLHdDQUFPLEVBQVU7YUFDekIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2pCLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBR2xCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEYsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRTFCLE1BQU0sY0FBYyxHQUFHLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFbkYsY0FBYyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDbEMsR0FBRyxFQUFFLElBQUk7U0FDWixDQUFDLENBQUM7UUFHSCxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9CLE1BQU0sS0FBSyxHQUFHLDRDQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUM7aUJBQzVDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUNuQixzRUFBc0U7Z0JBQ3RFLFNBQVMsRUFBRSxhQUFhLEVBQUUsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLFVBQVUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLO2FBQ3BFLENBQUM7UUFDTixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDN0MsQ0FBQztJQUdMLENBQUM7Ozs7QUFqRk0sZUFBTSxHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7OztBQ1JzQjtBQUNwQjtBQUNHO0FBZTVCLElBQUssVUFBcUM7QUFBMUMsV0FBSyxVQUFVO0lBQUUsaURBQVc7SUFBRSxpREFBVztBQUFBLENBQUMsRUFBckMsVUFBVSxLQUFWLFVBQVUsUUFBMkI7QUFFcEMsa0JBQW9CLFNBQVEsb0VBQVU7SUFnQnhDLFlBQVksUUFBZSxFQUFFLFlBQWlDLEVBQUUsVUFBYyxFQUFFO1FBQzVFLEtBQUssQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFYbEMsbUJBQWMsR0FBRztZQUNiLGdCQUFnQixFQUFFLEVBQUU7WUFDcEIsTUFBTSxFQUFFLEVBQUU7WUFDVixjQUFjLEVBQUUsWUFBWTtZQUM1QixRQUFRLEVBQUUsV0FBVztZQUNyQixRQUFRLEVBQUUsQ0FBQztTQUNkLENBQUM7UUFFRixXQUFNLEdBQUcsRUFBRSxDQUFDO1FBSVIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsS0FBSztJQUNMLENBQUM7SUFFRCxZQUFZLENBQUMsV0FBdUIsRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsTUFBTTtRQUVsRixNQUFNLGFBQWEsR0FBRyw2Q0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sZ0JBQWdCLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLDJDQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRCxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLDJDQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sY0FBYyxHQUFHLCtDQUFjLEVBQUU7YUFDbEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUVoRSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFFZixNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQ3BELElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsY0FBYyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDM0YsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUU7Z0JBQ2hDLE1BQU0sRUFBRSxHQUFHLGNBQWMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDNUQsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7Z0JBQzFCLEdBQUcsSUFBSSxjQUFjLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELE1BQU0sR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztnQkFDckMsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxPQUFPLE9BQU8sUUFBUSxFQUFFLEVBQUM7WUFDckcsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUU7WUFDbkMsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDdEUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRTtnQkFDM0IsTUFBTSxJQUFJLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUN2QyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDbEIsTUFBTSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQ3pDLENBQUMsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLCtDQUFTLENBQUMsZUFBZSxDQUFDLEVBQUUsTUFBTSxFQUFDLENBQUM7SUFFdkQsQ0FBQztJQUdELFFBQVEsQ0FBQyxJQUFpQjtRQUd0QixNQUFNLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUMzRSxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUM3QixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFDN0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUV2RCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNkLEtBQUssRUFBRSxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUTtZQUN6QyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNO1NBQzlCLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUM7SUFFMUIsQ0FBQztJQUVELE9BQU8sQ0FBQyxVQUE2QztRQUVqRCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBRTFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFFeEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7YUFDckQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QixLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFdEIsTUFBTSxPQUFPLEdBQUcsZ0RBQWUsRUFBRSxDQUFDO1FBRWxDLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDOUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQixVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDekMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFO2dCQUNMLE1BQU0sQ0FBQyxPQUFPLENBQUM7b0JBQ1gsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztvQkFDbEMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUM7aUJBQzlDLENBQUM7WUFDTixDQUFDO1lBQ0QsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFO1NBQ3hELENBQUMsQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRTNDLENBQUM7SUFFRCxnQkFBZ0I7SUFFaEIsQ0FBQztJQUdELGlCQUFpQixDQUFDLEtBQWEsRUFBRSxJQUFnQixFQUFFLFNBQWtCO1FBRWpFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7aUJBQ2pELE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3RCLE1BQU0sQ0FBUSxDQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQztZQUMxQyxDQUFDLENBQUM7UUFDVixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7aUJBQ2pELE9BQU8sQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDO1FBRXBDLENBQUM7SUFFTCxDQUFDOzs7O0FBdkhNLHdCQUFXLEdBQUcsVUFBVSxDQUFDO0FBRXpCLG1CQUFNLEdBQUcsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDdkJzQjtBQUNqQjtBQUNKO0FBQ3FDO0FBRWQ7QUFHekMsbUJBQXFCLFNBQVEsb0VBQVU7SUFxQnpDLDJCQUEyQjtJQUMzQixZQUFZLFFBQWUsRUFBRSxZQUFpQyxFQUFFLFVBQWMsRUFBRTtRQUM1RSxLQUFLLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBckJsQyxtQkFBYyxHQUFHO1lBQ2IsTUFBTSxFQUFFLEdBQUc7WUFDWCxLQUFLLEVBQUUsR0FBRztZQUNWLGNBQWMsRUFBRSxRQUFRO1lBQ3hCLE1BQU0sRUFBRSxLQUFLO1lBQ2IsV0FBVyxFQUFFO2dCQUNULEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHO2dCQUNmLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLO2dCQUNwQixLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSTtnQkFDbEIsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU87YUFDMUI7U0FDSixDQUFDO1FBR0YsV0FBTSxHQUFHO1lBQ0wsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQztZQUN6QixFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDO1NBQzlCLENBQUM7UUFLRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxLQUFLO1FBQ0QsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN4QixJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWE7ZUFDaEQsSUFBSSxxRUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFFdkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDZCxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUs7WUFDZixNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU07U0FDcEIsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDN0MsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFJO1FBRVQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUUzQixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBRXhCLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sUUFBUSxHQUFhLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxNQUFNLFFBQVEsR0FBYSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbEQsTUFBTSxNQUFNLEdBQUcsMkNBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQixNQUFNLE1BQU0sR0FBRywyQ0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRS9CLE1BQU0sS0FBSyxHQUFHLDJDQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3ZDLE1BQU0sS0FBSyxHQUFHLDJDQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBR3ZDLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUVsQixFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNoQixRQUFRLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDcEYsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUNuRixDQUFDO1FBRUQsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsT0FBTyxLQUFLLElBQUksQ0FBQztRQUU3QyxNQUFNLENBQUMsOENBQVEsQ0FBQywrQ0FBUyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFDdEQsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLEVBQzdELENBQUMsQ0FBNkIsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFHakQsNENBQTRDO1FBQzVDLGlEQUFpRDtJQUNyRCxDQUFDO0lBRUQsT0FBTyxDQUFDLFVBQVU7UUFFZCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFFeEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFckIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2pFLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekIsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV6QixNQUFNLE1BQU0sR0FBRywrQ0FBYyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMzRCxNQUFNLE1BQU0sR0FBRywrQ0FBYyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RCxNQUFNLFdBQVcsR0FBRywwQ0FBUyxDQUFXLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckUsTUFBTSxTQUFTLEdBQUcsK0NBQWMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUd0RSxNQUFNLEtBQUssR0FBRyxFQUFFO1FBRWhCLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDMUIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQztZQUNsQixNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25DLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTNCLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxZQUFZLEdBQUcsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUMzRSw0REFBNEQ7WUFFNUQsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLDJFQUFjLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFaEgsQ0FBQztRQUdELGdGQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTNCLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNsQixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25CLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUc7Z0JBQ3pCLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3BCLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3BCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDZCxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDakI7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUdILGtDQUFrQztRQUdsQywrQ0FBK0M7UUFFL0MsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFDckIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxhQUFhLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUM7UUFDdEUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDMUIsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFDdEMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFO1lBQ25DLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7U0FDMUMsQ0FBQyxDQUFDO1FBQ0gsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7YUFDbEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzthQUNqQixLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFdkQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQzVCLE1BQU0sTUFBTSxHQUFHLDJDQUFLLENBQVcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNwRSxNQUFNLFFBQVEsR0FBRywrQ0FBYyxFQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztpQkFDL0QsS0FBSyxDQUFDLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDbkMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFO2dCQUN0QywwQkFBMEI7Z0JBQzFCLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDbkMsQ0FBQyxDQUFDO1FBRU4sQ0FBQztJQUdMLENBQUM7Q0FFSjtBQUFBO0FBQUE7Ozs7Ozs7O0FDcktEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQzs7Ozs7OztBQ3JCQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLGdCQUFnQixzQ0FBc0MsaUJBQWlCLEVBQUU7QUFDbkYseUJBQXlCLHVEQUF1RDtBQUNoRjtBQUNBO0FBQ0EsdUJBQXVCLHNCQUFzQjtBQUM3QztBQUNBO0FBQ0EsQ0FBQztBQUNELDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0Q7QUFDcEQ7QUFDQSxnREFBZ0Q7QUFDaEQ7QUFDQSxnREFBZ0Q7QUFDaEQ7QUFDQSxpRUFBaUUsYUFBYTtBQUM5RTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQzs7Ozs7OztBQ2xEQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQzs7Ozs7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLGdCQUFnQixzQ0FBc0MsaUJBQWlCLEVBQUU7QUFDbkYseUJBQXlCLHVEQUF1RDtBQUNoRjtBQUNBO0FBQ0EsdUJBQXVCLHNCQUFzQjtBQUM3QztBQUNBO0FBQ0EsQ0FBQztBQUNELDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLDBDQUEwQyxFQUFFO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDOzs7Ozs7O0FDOURBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsZ0JBQWdCLHNDQUFzQyxpQkFBaUIsRUFBRTtBQUNuRix5QkFBeUIsdURBQXVEO0FBQ2hGO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Qsc0RBQXNELEVBQUU7QUFDMUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLHVDOzs7Ozs7O0FDMURBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixPQUFPO0FBQ2xDLDJCQUEyQixPQUFPO0FBQ2xDLDJCQUEyQixPQUFPO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLHFCQUFxQjtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixnQkFBZ0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELGdCQUFnQjtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxrQkFBa0I7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsMENBQTBDLEVBQUU7QUFDckYsMEZBQTBGLGlCQUFpQixFQUFFLGdCQUFnQixpQkFBaUIsRUFBRSxnQkFBZ0IsaUJBQWlCLEVBQUU7QUFDbkwseUVBQXlFLDZCQUE2QixFQUFFO0FBQ3hHLHFFQUFxRSxVQUFVLEVBQUU7QUFDakY7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsdUJBQXVCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHVCQUF1QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEQUEwRCxpQkFBaUI7QUFDM0UsMERBQTBELGlCQUFpQjtBQUMzRSxxREFBcUQsaUJBQWlCO0FBQ3RFLHdEQUF3RCxjQUFjO0FBQ3RFO0FBQ0EsQ0FBQztBQUNELG9DOzs7Ozs7O0FDbEhBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlGQUF5RiwrQkFBK0IsRUFBRSxnQkFBZ0IsK0JBQStCLEVBQUU7QUFDM0s7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxvRkFBb0YsNEJBQTRCLEVBQUU7QUFDbEgscUZBQXFGLGdCQUFnQixFQUFFO0FBQ3ZHO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLG1DQUFtQyxtQkFBbUIsRUFBRTtBQUN4RCxpQ0FBaUMsaUJBQWlCO0FBQ2xELEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsb0JBQW9CLEVBQUU7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELGlDQUFpQyxFQUFFO0FBQ25GLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0Msb0JBQW9CLEVBQUU7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsb0JBQW9CLHFDQUFxQyxFQUFFLEVBQUU7QUFDeEc7QUFDQSw0Q0FBNEMsb0JBQW9CLHVDQUF1QyxFQUFFLEVBQUU7QUFDM0csS0FBSztBQUNMO0FBQ0Esb0JBQW9CLGlEQUFpRDtBQUNyRSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQzs7Ozs7Ozs7Ozs7OztBQ3hGNkM7QUFDcEI7QUFDRztBQUVtQjtBQUl6QyxtQkFBcUIsU0FBUSxvRUFBVTtJQXdCekMsWUFBWSxRQUFlLEVBQUUsWUFBaUMsRUFBRSxVQUFjLEVBQUU7UUFDNUUsS0FBSyxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztRQXZCekIsbUJBQWMsR0FBRztZQUN0QixNQUFNLEVBQUUsR0FBRztZQUNYLEtBQUssRUFBRSxJQUFJO1lBQ1gsV0FBVyxFQUFFLEVBQUU7WUFDZixVQUFVLEVBQUUsR0FBRztZQUNmLGNBQWMsRUFBRSxhQUFhO1lBQzdCLE1BQU0sRUFBRSxLQUFLO1lBQ2IsV0FBVyxFQUFFO2dCQUNULEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHO2dCQUNmLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLO2dCQUNwQixLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSTtnQkFDbEIsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU87YUFDMUI7U0FDSixDQUFDO1FBR08sV0FBTSxHQUFHO1lBQ2QsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQztZQUN6QixFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDO1NBQzlCLENBQUM7UUFLRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFHRCxLQUFLO1FBQ0QsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN4QixJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWE7ZUFDaEQsSUFBSSxxRUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUUzRCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNkLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSztZQUNmLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTTtTQUNwQixDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztZQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM3QyxDQUFDO0lBRUQsUUFBUSxDQUFDLElBQUk7UUFFVCxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRTNCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFFeEIsNENBQTRDO1FBQzVDLDJDQUEyQztRQUMzQywyQ0FBMkM7UUFDM0MsRUFBRTtRQUNGLG9DQUFvQztRQUNwQyxvQ0FBb0M7UUFDcEMsRUFBRTtRQUNGLDRDQUE0QztRQUM1Qyw0Q0FBNEM7UUFDNUMsRUFBRTtRQUNGLEVBQUU7UUFDRixxQkFBcUI7UUFDckIsRUFBRTtRQUNGLHVCQUF1QjtRQUN2Qix1RkFBdUY7UUFDdkYsV0FBVztRQUNYLHNGQUFzRjtRQUN0RixJQUFJO1FBRUosTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakUsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsT0FBTyxLQUFLLElBQUksQ0FBQztRQUU3QyxrQ0FBa0M7UUFDbEMsTUFBTSxDQUFDLDhDQUFRLENBQUMsK0NBQVMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQ3ZELENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEYsV0FBVztRQUNYLDBEQUEwRDtRQUMxRCx5RUFBeUU7UUFDekUsSUFBSTtJQUVSLENBQUM7SUFFRCxPQUFPLENBQUMsVUFBeUI7UUFFN0IsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN4QixNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBQ2xDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUM7UUFDMUIsTUFBTSxHQUFHLEdBQUcsMENBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUc3QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBR3pDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRXJCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVwRSxNQUFNLE1BQU0sR0FBRywrQ0FBYyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQzthQUNuRCxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFHMUMsK0NBQStDO1FBRS9DLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ3hCLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFO1lBQ1gsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUN6QixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JCLHNEQUFzRDtRQUd0RCxNQUFNLE9BQU8sR0FBRyw2Q0FBTyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDbkQsTUFBTSxRQUFRLEdBQUcsNkNBQU8sQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBRXBELE1BQU0sUUFBUSxHQUFHLCtDQUFjLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDbEQsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBRS9CLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDM0UsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRTFCLE1BQU0sY0FBYyxHQUFHLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMvRSxjQUFjLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlCLGNBQWMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7UUFFL0UsTUFBTSxZQUFZLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDdkQsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsYUFBYSxPQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUUsR0FBRztTQUNoRixDQUFDLENBQUM7UUFFSCxZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUM5QixLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUM3QixNQUFNLEVBQUUsRUFBRSxHQUFHLENBQUM7U0FDakIsQ0FBQyxDQUFDO1FBQ0gsWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFHcEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBRTVCLE1BQU0sTUFBTSxHQUFHLDJDQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMxRCxNQUFNLFFBQVEsR0FBRywrQ0FBYyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2lCQUNoRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUdyQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUN4QixNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDMUUsWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM1QixZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO1lBRzdFLE1BQU0sV0FBVyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUNsRCxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxhQUFhLE9BQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxVQUFVLEdBQUcsRUFBRSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBRSxHQUFHO2FBQ3JHLENBQUMsQ0FBQztZQUNILFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO2lCQUNyQixLQUFLLENBQUM7Z0JBQ0gsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO2dCQUNwQyxNQUFNLEVBQUUsRUFBRSxHQUFHLENBQUM7YUFDakIsQ0FBQyxDQUFDO1lBRVAsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRzFELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDMUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBRXpCLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztZQUVoRixhQUFhLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQztnQkFDaEMsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsYUFBYSxPQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsVUFBVSxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUc7YUFDNUYsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBQ3BDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLEVBQUU7UUFDcEQsQ0FBQztRQUdELDREQUE0RDtRQUM1RCx5RUFBeUU7UUFDekUsNERBQTREO1FBQzVELDBCQUEwQjtRQUMxQix1QkFBdUI7UUFDdkIsdUJBQXVCO1FBQ3ZCLGFBQWE7UUFDYix1QkFBdUI7UUFDdkIsS0FBSztJQUdULENBQUM7Q0FFSjtBQUFBO0FBQUE7Ozs7Ozs7O0FDcE1EOztHQUVHO0FBQ0c7SUFFRjs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRztRQUVuQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7V0E2Qkc7UUFFSCx3Q0FBd0M7UUFDeEMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFO1lBRWhDLHFCQUFxQjtZQUNyQixNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBRW5DLGtDQUFrQztnQkFDbEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztnQkFDcEMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDO2dCQUVmLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxNQUFNLElBQUksTUFBTSxLQUFLLEtBQUssSUFBSSxNQUFNLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0RSxHQUFHLElBQUksR0FBRyxDQUFDO29CQUNYLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUU7d0JBQ3BCLEdBQUcsSUFBSSxHQUFHLENBQUM7d0JBQ1gsR0FBRyxJQUFJLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDckUsQ0FBQyxDQUNKO2dCQUNMLENBQUM7Z0JBRUQsd0NBQXdDO2dCQUN4QyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDekIsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNkLE1BQU0sQ0FBQyxNQUFNLEdBQUc7b0JBQ1osRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUMxQyxtRUFBbUU7d0JBQ25FLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQzNCLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osd0VBQXdFO3dCQUN4RSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUM1QixDQUFDO2dCQUNMLENBQUMsQ0FBQztnQkFDRixNQUFNLENBQUMsT0FBTyxHQUFHO29CQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzVCLENBQUMsQ0FBQztZQUNOLENBQUMsQ0FBQyxDQUFDO1FBRVAsQ0FBQyxDQUFDO1FBRUYsa0JBQWtCO1FBQ2xCLE1BQU0sQ0FBQztZQUNILEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztZQUNyQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUM7WUFDdkMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDO1lBQ3JDLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztTQUM5QyxDQUFDO0lBR04sQ0FBQztDQUNKO0FBQUE7QUFBQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxOCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgOGU3YjlkY2FiMGMyMDAzNTY1MTAiLCJtb2R1bGUuZXhwb3J0cyA9IGQzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZDNcIlxuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF87XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJfXCJcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IEhlbmRyaWsgU3Ryb2JlbHQgKGhlbmRyaWsuc3Ryb2JlbHQuY29tKSBvbiAxMi8zLzE2LlxuICovXG5pbXBvcnQge1V0aWx9IGZyb20gXCIuLi9ldGMvVXRpbFwiO1xuaW1wb3J0ICogYXMgZDMgZnJvbSAnZDMnXG5pbXBvcnQge1NpbXBsZUV2ZW50SGFuZGxlcn0gZnJvbSBcIi4uL2V0Yy9TaW1wbGVFdmVudEhhbmRsZXJcIjtcbmltcG9ydCB7U1ZHfSBmcm9tIFwiLi4vZXRjL1NWR3BsdXNcIjtcbmltcG9ydCB7RDNTZWwsIExvb3NlT2JqZWN0fSBmcm9tIFwiLi4vZXRjL0xvY2FsVHlwZXNcIjtcblxuXG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWQ29tcG9uZW50IHtcblxuICAgIC8vIFNUQVRJQyBGSUVMRFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAvKipcbiAgICAgKiBUaGUgc3RhdGljIHByb3BlcnR5IHRoYXQgY29udGFpbnMgYWxsIGNsYXNzIHJlbGF0ZWQgZXZlbnRzLlxuICAgICAqIFNob3VsZCBiZSBvdmVyd3JpdHRlbiBhbmQgZXZlbnQgc3RyaW5ncyBoYXZlIHRvIGJlIHVuaXF1ZSEhXG4gICAgICovXG5cbiAgICBzdGF0aWMgZXZlbnRzOiB7fSA9IHtub0V2ZW50OiAnVkNvbXBvbmVudF9ub0V2ZW50J307XG5cbiAgICAvKipcbiAgICAgKiBzZXQgb2YgQUxMIG9wdGlvbnMgYW5kIHRoZWlyIGRlZmF1bHRzXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IGRlZmF1bHRPcHRpb25zOiB7fSA9IHtcbiAgICAgICAgcG9zOiB7eDogMTAsIHk6IDEwfSxcbiAgICAgICAgLy8gTGlzdCBvZiBFdmVudHMgdGhhdCBhcmUgT05MWSBoYW5kbGVkIGdsb2JhbGx5OlxuICAgICAgICBnbG9iYWxFeGNsdXNpdmVFdmVudHM6IFtdXG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyB0aGUgbGF5ZXJzIGluIFNWRyAgZm9yIGJnLG1haW4sZmcsLi4uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IGxheW91dDogeyBuYW1lOiBzdHJpbmcsIHBvczogbnVtYmVyW10gfVtdID0gW3tuYW1lOiAnbWFpbicsIHBvczogWzAsIDBdfV07XG5cblxuICAgIHByb3RlY3RlZCBpZDogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBwYXJlbnQ6IGFueTtcbiAgICBwcm90ZWN0ZWQgb3B0aW9uczogTG9vc2VPYmplY3Q7XG4gICAgcHJvdGVjdGVkIGJhc2U6IEQzU2VsO1xuICAgIHByb3RlY3RlZCBsYXllcnM6IExvb3NlT2JqZWN0O1xuICAgIHByb3RlY3RlZCBldmVudEhhbmRsZXI6IFNpbXBsZUV2ZW50SGFuZGxlcjtcbiAgICBwcm90ZWN0ZWQgX2N1cnJlbnQ6IExvb3NlT2JqZWN0O1xuICAgIHByb3RlY3RlZCBkYXRhOiBhbnk7XG4gICAgcHJvdGVjdGVkIHJlbmRlckRhdGE6IGFueTtcblxuXG4gICAgLy8gQ09OU1RSVUNUT1IgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblxuICAgIC8qKlxuICAgICAqIFNpbXBsZSBjb25zdHJ1Y3Rvci4gU3ViY2xhc3NlcyBzaG91bGQgY2FsbCBAc3VwZXJJbml0KG9wdGlvbnMpIGFzIHdlbGwuXG4gICAgICogc2VlIHdoeSBoZXJlOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80MzU5NTk0My93aHktYXJlLWRlcml2ZWQtY2xhc3MtcHJvcGVydHktdmFsdWVzLW5vdC1zZWVuLWluLXRoZS1iYXNlLWNsYXNzLWNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiB0ZW1wbGF0ZTpcbiAgICAgY29uc3RydWN0b3IoZDNQYXJlbnQ6IEQzU2VsLCBldmVudEhhbmRsZXI/OiBTaW1wbGVFdmVudEhhbmRsZXIsIG9wdGlvbnM6IHt9ID0ge30pIHtcbiAgICAgICAgc3VwZXIoZDNQYXJlbnQsIGV2ZW50SGFuZGxlcik7XG4gICAgICAgIC8vIC0tIGFjY2VzcyB0byBzdWJjbGFzcyBwYXJhbXM6XG4gICAgICAgIHRoaXMuc3VwZXJJbml0KG9wdGlvbnMpO1xuICAgICB9XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0QzU2VsfSBkM3BhcmVudCAgRDMgc2VsZWN0aW9uIG9mIHBhcmVudCBTVkcgRE9NIEVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge1NpbXBsZUV2ZW50SGFuZGxlcn0gZXZlbnRIYW5kbGVyIGEgZ2xvYmFsIGV2ZW50IGhhbmRsZXIgb2JqZWN0IG9yICdudWxsJyBmb3IgbG9jYWwgZXZlbnQgaGFuZGxlclxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGQzcGFyZW50OiBEM1NlbCwgZXZlbnRIYW5kbGVyPzogU2ltcGxlRXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIHRoaXMuaWQgPSBVdGlsLnNpbXBsZVVJZCh7fSk7XG5cbiAgICAgICAgdGhpcy5wYXJlbnQgPSBkM3BhcmVudDtcblxuICAgICAgICAvLyBJZiBub3QgZnVydGhlciBzcGVjaWZpZWQgLSBjcmVhdGUgYSBsb2NhbCBldmVudCBoYW5kbGVyIGJvdW5kIHRvIHRoZSBiYXMgZWxlbWVudFxuICAgICAgICB0aGlzLmV2ZW50SGFuZGxlciA9IGV2ZW50SGFuZGxlciB8fFxuICAgICAgICAgICAgbmV3IFNpbXBsZUV2ZW50SGFuZGxlcih0aGlzLmJhc2Uubm9kZSgpKTtcblxuICAgICAgICAvLyBPYmplY3QgZm9yIHN0b3JpbmcgaW50ZXJuYWwgc3RhdGVzIGFuZCB2YXJpYWJsZXNcbiAgICAgICAgdGhpcy5fY3VycmVudCA9IHtoaWRkZW46IGZhbHNlfTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhcyB0byBiZSBjYWxsZWQgYXMgbGFzdCBjYWxsIGluIHN1YmNsYXNzIGNvbnN0cnVjdG9yLlxuICAgICAqIEBwYXJhbSB7e319IG9wdGlvbnNcbiAgICAgKiBAcGFyYW0gcnVuSW5pdCAtLSBydW4gdGhpcy5faW5pdCgpIG9yIG5vdFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBzdXBlckluaXQob3B0aW9uczoge30gPSB7fSwgcnVuSW5pdCA9IHRydWUpIHtcbiAgICAgICAgLy8gU2V0IGRlZmF1bHQgb3B0aW9ucyBpZiBub3Qgc3BlY2lmaWVkIGluIGNvbnN0cnVjdG9yIGNhbGxcbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB0aGlzLmRlZmF1bHRPcHRpb25zO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICAgICAgY29uc3Qga2V5cyA9IG5ldyBTZXQoWy4uLk9iamVjdC5rZXlzKGRlZmF1bHRzKSwgLi4uT2JqZWN0LmtleXMob3B0aW9ucyldKTtcbiAgICAgICAga2V5cy5mb3JFYWNoKGtleSA9PiB0aGlzLm9wdGlvbnNba2V5XSA9IChrZXkgaW4gb3B0aW9ucykgPyBvcHRpb25zW2tleV0gOiBkZWZhdWx0c1trZXldKTtcblxuICAgICAgICAvLyBDcmVhdGUgdGhlIGJhc2UgZ3JvdXAgZWxlbWVudFxuICAgICAgICB0aGlzLmJhc2UgPSB0aGlzLl9jcmVhdGVCYXNlRWxlbWVudCh0aGlzLnBhcmVudCk7XG4gICAgICAgIHRoaXMubGF5ZXJzID0gdGhpcy5fY3JlYXRlTGF5b3V0TGF5ZXJzKHRoaXMuYmFzZSk7XG5cbiAgICAgICAgLy8gYmluZCBldmVudHNcbiAgICAgICAgdGhpcy5fYmluZExvY2FsRXZlbnRzKCk7XG5cbiAgICAgICAgaWYgKHJ1bkluaXQpIHRoaXMuX2luaXQoKTtcbiAgICB9XG5cblxuICAgIC8vIENSRUFURSBCQVNJQyBFTEVNRU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgdGhlIGJhc2UgZWxlbWVudCAoPGc+KSB0aGF0IGhvc3RzIHRoZSB2aXNcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IHBhcmVudCB0aGUgcGFyZW50IEVsZW1lbnRcbiAgICAgKiBAcmV0dXJucyB7Kn0gRDMgc2VsZWN0aW9uIG9mIHRoZSBiYXNlIGVsZW1lbnRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9jcmVhdGVCYXNlRWxlbWVudChwYXJlbnQpIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgZ3JvdXAgZWxlbWVudCB0byBob3N0IHRoZSB2aXN1YWxpemF0aW9uXG4gICAgICAgIC8vIDxnPiBDU1MgQ2xhc3MgaXMgamF2YXNjcmlwdCBjbGFzcyBuYW1lIGluIGxvd2VyY2FzZSArIElEXG4gICAgICAgIHJldHVybiBTVkcuZ3JvdXAoXG4gICAgICAgICAgICBwYXJlbnQsXG4gICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLm5hbWUudG9Mb3dlckNhc2UoKSArICcgSUQnICsgdGhpcy5pZCxcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5wb3MgfHwge3g6IDAsIHk6IDB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUxheW91dExheWVycyhiYXNlKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IGxFIG9mIHRoaXMubGF5b3V0KSB7XG4gICAgICAgICAgICByZXNbbEUubmFtZV0gPSBTVkcuZ3JvdXAoYmFzZSwgbEUubmFtZSwge3g6IGxFLnBvc1swXSwgeTogbEUucG9zWzFdfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogU2hvdWxkIGJlIG92ZXJ3cml0dGVuIHRvIGNyZWF0ZSB0aGUgc3RhdGljIERPTSBlbGVtZW50c1xuICAgICAqIEBhYnN0cmFjdFxuICAgICAqIEByZXR1cm4geyp9IC0tLVxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBfaW5pdCgpO1xuXG4gICAgLy8gREFUQSBVUERBVEUgJiBSRU5ERVIgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAvLyBub2luc3BlY3Rpb24gSlNVbnVzZWRHbG9iYWxTeW1ib2xzXG4gICAgLyoqXG4gICAgICogRXZlcnkgdGltZSBkYXRhIGhhcyBjaGFuZ2VkLCB1cGRhdGUgaXMgY2FsbGVkIGFuZFxuICAgICAqIHRyaWdnZXJzIHdyYW5nbGluZyBhbmQgcmUtcmVuZGVyaW5nXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgZGF0YSBvYmplY3RcbiAgICAgKiBAcmV0dXJuIHsqfSAtLS1cbiAgICAgKi9cbiAgICB1cGRhdGUoZGF0YSkge1xuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICBpZiAodGhpcy5fY3VycmVudC5oaWRkZW4pIHJldHVybjtcbiAgICAgICAgdGhpcy5yZW5kZXJEYXRhID0gdGhpcy5fd3JhbmdsZShkYXRhKTtcbiAgICAgICAgdGhpcy5fcmVuZGVyKHRoaXMucmVuZGVyRGF0YSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBEYXRhIHdyYW5nbGluZyBtZXRob2QgLS0gaW1wbGVtZW50IGluIHN1YmNsYXNzLiBSZXR1cm5zIHRoaXMucmVuZGVyRGF0YS5cbiAgICAgKiBTaW1wbGVzdCBpbXBsZW1lbnRhdGlvbjogYHJldHVybiBkYXRhO2BcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBkYXRhXG4gICAgICogQHJldHVybnMgeyp9IC0tLVxuICAgICAqIEBhYnN0cmFjdFxuICAgICAqL1xuICAgIGFic3RyYWN0IF93cmFuZ2xlKGRhdGEpOiBhbnk7XG5cblxuICAgIC8qKlxuICAgICAqIElzIHJlc3BvbnNpYmxlIGZvciBtYXBwaW5nIGRhdGEgdG8gRE9NIGVsZW1lbnRzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlbmRlckRhdGEgcHJlLXByb2Nlc3NlZCAod3JhbmdsZWQpIGRhdGFcbiAgICAgKiBAYWJzdHJhY3RcbiAgICAgKiBAcmV0dXJucyB7Kn0gLS0tXG4gICAgICovXG4gICAgYWJzdHJhY3QgX3JlbmRlcihyZW5kZXJEYXRhKTogdm9pZDtcblxuXG4gICAgLy8gVVBEQVRFIE9QVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLyoqXG4gICAgICogVXBkYXRlcyBpbnN0YW5jZSBvcHRpb25zXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgb25seSB0aGUgb3B0aW9ucyB0aGF0IHNob3VsZCBiZSB1cGRhdGVkXG4gICAgICogQHBhcmFtIHtCb29sZWFufSByZVJlbmRlciBpZiBvcHRpb24gY2hhbmdlIHJlcXVpcmVzIGEgcmUtcmVuZGVyaW5nIChkZWZhdWx0OmZhbHNlKVxuICAgICAqIEByZXR1cm5zIHsqfSAtLS1cbiAgICAgKi9cbiAgICB1cGRhdGVPcHRpb25zKHtvcHRpb25zLCByZVJlbmRlciA9IGZhbHNlfSkge1xuICAgICAgICBPYmplY3Qua2V5cyhvcHRpb25zKS5mb3JFYWNoKGsgPT4gdGhpcy5vcHRpb25zW2tdID0gb3B0aW9uc1trXSk7XG4gICAgICAgIGlmIChyZVJlbmRlcikgdGhpcy5fcmVuZGVyKHRoaXMucmVuZGVyRGF0YSk7XG4gICAgfVxuXG4gICAgLy8gQklORCBMT0NBTCBFVkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgX2JpbmRFdmVudChldmVudEhhbmRsZXIsIG5hbWUsIGZ1bmMpIHtcbiAgICAgICAgLy8gV3JhcCBpbiBTZXQgdG8gaGFuZGxlICd1bmRlZmluZGVkJyBldGMuLlxuICAgICAgICBjb25zdCBnbG9iYWxFdmVudHMgPSBuZXcgU2V0KHRoaXMub3B0aW9ucy5nbG9iYWxFeGNsdXNpdmVFdmVudHMpO1xuICAgICAgICBpZiAoIWdsb2JhbEV2ZW50cy5oYXMobmFtZSkpIHtcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlci5iaW5kKG5hbWUsIGZ1bmMpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb3VsZCBiZSB1c2VkIHRvIGJpbmQgbG9jYWwgZXZlbnQgaGFuZGxpbmdcbiAgICAgKi9cbiAgICBfYmluZExvY2FsRXZlbnRzKCkge1xuICAgICAgICAvL2NvbnNvbGUud2FybignX2JpbmRMb2NhbEV2ZW50cygpIG5vdCBpbXBsZW1lbnRlZC4nKVxuICAgIH1cblxuICAgIGhpZGVWaWV3KCkge1xuICAgICAgICBpZiAoIXRoaXMuX2N1cnJlbnQuaGlkZGVuKSB7XG4gICAgICAgICAgICB0aGlzLmJhc2Uuc3R5bGVzKHtcbiAgICAgICAgICAgICAgICAnb3BhY2l0eSc6IDAsXG4gICAgICAgICAgICAgICAgJ3BvaW50ZXItZXZlbnRzJzogJ25vbmUnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnQuaGlkZGVuID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuaGlkZVZpZXcoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50LmhpZGRlbikge1xuICAgICAgICAgICAgdGhpcy5iYXNlLnN0eWxlcyh7XG4gICAgICAgICAgICAgICAgJ29wYWNpdHknOiAxLFxuICAgICAgICAgICAgICAgICdwb2ludGVyLWV2ZW50cyc6IG51bGxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudC5oaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKHRoaXMuZGF0YSk7XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuYmFzZS5yZW1vdmUoKTtcbiAgICB9XG5cbn1cblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vdHMvdmlzL1Zpc3VhbENvbXBvbmVudC50cyIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBwb3dlcmdyYXBoID0gcmVxdWlyZShcIi4vcG93ZXJncmFwaFwiKTtcclxudmFyIGxpbmtsZW5ndGhzXzEgPSByZXF1aXJlKFwiLi9saW5rbGVuZ3Roc1wiKTtcclxudmFyIGRlc2NlbnRfMSA9IHJlcXVpcmUoXCIuL2Rlc2NlbnRcIik7XHJcbnZhciByZWN0YW5nbGVfMSA9IHJlcXVpcmUoXCIuL3JlY3RhbmdsZVwiKTtcclxudmFyIHNob3J0ZXN0cGF0aHNfMSA9IHJlcXVpcmUoXCIuL3Nob3J0ZXN0cGF0aHNcIik7XHJcbnZhciBnZW9tXzEgPSByZXF1aXJlKFwiLi9nZW9tXCIpO1xyXG52YXIgaGFuZGxlZGlzY29ubmVjdGVkXzEgPSByZXF1aXJlKFwiLi9oYW5kbGVkaXNjb25uZWN0ZWRcIik7XHJcbnZhciBFdmVudFR5cGU7XHJcbihmdW5jdGlvbiAoRXZlbnRUeXBlKSB7XHJcbiAgICBFdmVudFR5cGVbRXZlbnRUeXBlW1wic3RhcnRcIl0gPSAwXSA9IFwic3RhcnRcIjtcclxuICAgIEV2ZW50VHlwZVtFdmVudFR5cGVbXCJ0aWNrXCJdID0gMV0gPSBcInRpY2tcIjtcclxuICAgIEV2ZW50VHlwZVtFdmVudFR5cGVbXCJlbmRcIl0gPSAyXSA9IFwiZW5kXCI7XHJcbn0pKEV2ZW50VHlwZSA9IGV4cG9ydHMuRXZlbnRUeXBlIHx8IChleHBvcnRzLkV2ZW50VHlwZSA9IHt9KSk7XHJcbjtcclxuZnVuY3Rpb24gaXNHcm91cChnKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIGcubGVhdmVzICE9PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgZy5ncm91cHMgIT09ICd1bmRlZmluZWQnO1xyXG59XHJcbnZhciBMYXlvdXQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTGF5b3V0KCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5fY2FudmFzU2l6ZSA9IFsxLCAxXTtcclxuICAgICAgICB0aGlzLl9saW5rRGlzdGFuY2UgPSAyMDtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0Tm9kZVNpemUgPSAxMDtcclxuICAgICAgICB0aGlzLl9saW5rTGVuZ3RoQ2FsY3VsYXRvciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fbGlua1R5cGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2F2b2lkT3ZlcmxhcHMgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9oYW5kbGVEaXNjb25uZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3J1bm5pbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9ub2RlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuX2dyb3VwcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuX3Jvb3RHcm91cCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fbGlua3MgPSBbXTtcclxuICAgICAgICB0aGlzLl9jb25zdHJhaW50cyA9IFtdO1xyXG4gICAgICAgIHRoaXMuX2Rpc3RhbmNlTWF0cml4ID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9kZXNjZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9kaXJlY3RlZExpbmtDb25zdHJhaW50cyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fdGhyZXNob2xkID0gMC4wMTtcclxuICAgICAgICB0aGlzLl92aXNpYmlsaXR5R3JhcGggPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2dyb3VwQ29tcGFjdG5lc3MgPSAxZS02O1xyXG4gICAgICAgIHRoaXMuZXZlbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMubGlua0FjY2Vzc29yID0ge1xyXG4gICAgICAgICAgICBnZXRTb3VyY2VJbmRleDogTGF5b3V0LmdldFNvdXJjZUluZGV4LFxyXG4gICAgICAgICAgICBnZXRUYXJnZXRJbmRleDogTGF5b3V0LmdldFRhcmdldEluZGV4LFxyXG4gICAgICAgICAgICBzZXRMZW5ndGg6IExheW91dC5zZXRMaW5rTGVuZ3RoLFxyXG4gICAgICAgICAgICBnZXRUeXBlOiBmdW5jdGlvbiAobCkgeyByZXR1cm4gdHlwZW9mIF90aGlzLl9saW5rVHlwZSA9PT0gXCJmdW5jdGlvblwiID8gX3RoaXMuX2xpbmtUeXBlKGwpIDogMDsgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBMYXlvdXQucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGUsIGxpc3RlbmVyKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmV2ZW50KVxyXG4gICAgICAgICAgICB0aGlzLmV2ZW50ID0ge307XHJcbiAgICAgICAgaWYgKHR5cGVvZiBlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50W0V2ZW50VHlwZVtlXV0gPSBsaXN0ZW5lcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRbZV0gPSBsaXN0ZW5lcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGF5b3V0LnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBpZiAodGhpcy5ldmVudCAmJiB0eXBlb2YgdGhpcy5ldmVudFtlLnR5cGVdICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50W2UudHlwZV0oZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIExheW91dC5wcm90b3R5cGUua2ljayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB3aGlsZSAoIXRoaXMudGljaygpKVxyXG4gICAgICAgICAgICA7XHJcbiAgICB9O1xyXG4gICAgTGF5b3V0LnByb3RvdHlwZS50aWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9hbHBoYSA8IHRoaXMuX3RocmVzaG9sZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9ydW5uaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcih7IHR5cGU6IEV2ZW50VHlwZS5lbmQsIGFscGhhOiB0aGlzLl9hbHBoYSA9IDAsIHN0cmVzczogdGhpcy5fbGFzdFN0cmVzcyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBuID0gdGhpcy5fbm9kZXMubGVuZ3RoLCBtID0gdGhpcy5fbGlua3MubGVuZ3RoO1xyXG4gICAgICAgIHZhciBvLCBpO1xyXG4gICAgICAgIHRoaXMuX2Rlc2NlbnQubG9ja3MuY2xlYXIoKTtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XHJcbiAgICAgICAgICAgIG8gPSB0aGlzLl9ub2Rlc1tpXTtcclxuICAgICAgICAgICAgaWYgKG8uZml4ZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygby5weCA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIG8ucHkgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgby5weCA9IG8ueDtcclxuICAgICAgICAgICAgICAgICAgICBvLnB5ID0gby55O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHAgPSBbby5weCwgby5weV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kZXNjZW50LmxvY2tzLmFkZChpLCBwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgczEgPSB0aGlzLl9kZXNjZW50LnJ1bmdlS3V0dGEoKTtcclxuICAgICAgICBpZiAoczEgPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fYWxwaGEgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgdGhpcy5fbGFzdFN0cmVzcyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgdGhpcy5fYWxwaGEgPSBzMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fbGFzdFN0cmVzcyA9IHMxO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTm9kZVBvc2l0aW9ucygpO1xyXG4gICAgICAgIHRoaXMudHJpZ2dlcih7IHR5cGU6IEV2ZW50VHlwZS50aWNrLCBhbHBoYTogdGhpcy5fYWxwaGEsIHN0cmVzczogdGhpcy5fbGFzdFN0cmVzcyB9KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgTGF5b3V0LnByb3RvdHlwZS51cGRhdGVOb2RlUG9zaXRpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB4ID0gdGhpcy5fZGVzY2VudC54WzBdLCB5ID0gdGhpcy5fZGVzY2VudC54WzFdO1xyXG4gICAgICAgIHZhciBvLCBpID0gdGhpcy5fbm9kZXMubGVuZ3RoO1xyXG4gICAgICAgIHdoaWxlIChpLS0pIHtcclxuICAgICAgICAgICAgbyA9IHRoaXMuX25vZGVzW2ldO1xyXG4gICAgICAgICAgICBvLnggPSB4W2ldO1xyXG4gICAgICAgICAgICBvLnkgPSB5W2ldO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBMYXlvdXQucHJvdG90eXBlLm5vZGVzID0gZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICBpZiAoIXYpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX25vZGVzLmxlbmd0aCA9PT0gMCAmJiB0aGlzLl9saW5rcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbiA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9saW5rcy5mb3JFYWNoKGZ1bmN0aW9uIChsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbiA9IE1hdGgubWF4KG4sIGwuc291cmNlLCBsLnRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX25vZGVzID0gbmV3IEFycmF5KCsrbik7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25vZGVzW2ldID0ge307XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25vZGVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9ub2RlcyA9IHY7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGF5b3V0LnByb3RvdHlwZS5ncm91cHMgPSBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgaWYgKCF4KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ3JvdXBzO1xyXG4gICAgICAgIHRoaXMuX2dyb3VwcyA9IHg7XHJcbiAgICAgICAgdGhpcy5fcm9vdEdyb3VwID0ge307XHJcbiAgICAgICAgdGhpcy5fZ3JvdXBzLmZvckVhY2goZnVuY3Rpb24gKGcpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBnLnBhZGRpbmcgPT09IFwidW5kZWZpbmVkXCIpXHJcbiAgICAgICAgICAgICAgICBnLnBhZGRpbmcgPSAxO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGcubGVhdmVzICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICBnLmxlYXZlcy5mb3JFYWNoKGZ1bmN0aW9uICh2LCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2ID09PSAnbnVtYmVyJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGcubGVhdmVzW2ldID0gX3RoaXMuX25vZGVzW3ZdKS5wYXJlbnQgPSBnO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBnLmdyb3VwcyAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgZy5ncm91cHMuZm9yRWFjaChmdW5jdGlvbiAoZ2ksIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGdpID09PSAnbnVtYmVyJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGcuZ3JvdXBzW2ldID0gX3RoaXMuX2dyb3Vwc1tnaV0pLnBhcmVudCA9IGc7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX3Jvb3RHcm91cC5sZWF2ZXMgPSB0aGlzLl9ub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHR5cGVvZiB2LnBhcmVudCA9PT0gJ3VuZGVmaW5lZCc7IH0pO1xyXG4gICAgICAgIHRoaXMuX3Jvb3RHcm91cC5ncm91cHMgPSB0aGlzLl9ncm91cHMuZmlsdGVyKGZ1bmN0aW9uIChnKSB7IHJldHVybiB0eXBlb2YgZy5wYXJlbnQgPT09ICd1bmRlZmluZWQnOyB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMYXlvdXQucHJvdG90eXBlLnBvd2VyR3JhcGhHcm91cHMgPSBmdW5jdGlvbiAoZikge1xyXG4gICAgICAgIHZhciBnID0gcG93ZXJncmFwaC5nZXRHcm91cHModGhpcy5fbm9kZXMsIHRoaXMuX2xpbmtzLCB0aGlzLmxpbmtBY2Nlc3NvciwgdGhpcy5fcm9vdEdyb3VwKTtcclxuICAgICAgICB0aGlzLmdyb3VwcyhnLmdyb3Vwcyk7XHJcbiAgICAgICAgZihnKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMYXlvdXQucHJvdG90eXBlLmF2b2lkT3ZlcmxhcHMgPSBmdW5jdGlvbiAodikge1xyXG4gICAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2F2b2lkT3ZlcmxhcHM7XHJcbiAgICAgICAgdGhpcy5fYXZvaWRPdmVybGFwcyA9IHY7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGF5b3V0LnByb3RvdHlwZS5oYW5kbGVEaXNjb25uZWN0ZWQgPSBmdW5jdGlvbiAodikge1xyXG4gICAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hhbmRsZURpc2Nvbm5lY3RlZDtcclxuICAgICAgICB0aGlzLl9oYW5kbGVEaXNjb25uZWN0ZWQgPSB2O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExheW91dC5wcm90b3R5cGUuZmxvd0xheW91dCA9IGZ1bmN0aW9uIChheGlzLCBtaW5TZXBhcmF0aW9uKSB7XHJcbiAgICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKVxyXG4gICAgICAgICAgICBheGlzID0gJ3knO1xyXG4gICAgICAgIHRoaXMuX2RpcmVjdGVkTGlua0NvbnN0cmFpbnRzID0ge1xyXG4gICAgICAgICAgICBheGlzOiBheGlzLFxyXG4gICAgICAgICAgICBnZXRNaW5TZXBhcmF0aW9uOiB0eXBlb2YgbWluU2VwYXJhdGlvbiA9PT0gJ251bWJlcicgPyBmdW5jdGlvbiAoKSB7IHJldHVybiBtaW5TZXBhcmF0aW9uOyB9IDogbWluU2VwYXJhdGlvblxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGF5b3V0LnByb3RvdHlwZS5saW5rcyA9IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGlua3M7XHJcbiAgICAgICAgdGhpcy5fbGlua3MgPSB4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExheW91dC5wcm90b3R5cGUuY29uc3RyYWludHMgPSBmdW5jdGlvbiAoYykge1xyXG4gICAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnN0cmFpbnRzO1xyXG4gICAgICAgIHRoaXMuX2NvbnN0cmFpbnRzID0gYztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMYXlvdXQucHJvdG90eXBlLmRpc3RhbmNlTWF0cml4ID0gZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kaXN0YW5jZU1hdHJpeDtcclxuICAgICAgICB0aGlzLl9kaXN0YW5jZU1hdHJpeCA9IGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGF5b3V0LnByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICBpZiAoIXgpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jYW52YXNTaXplO1xyXG4gICAgICAgIHRoaXMuX2NhbnZhc1NpemUgPSB4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExheW91dC5wcm90b3R5cGUuZGVmYXVsdE5vZGVTaXplID0gZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICBpZiAoIXgpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kZWZhdWx0Tm9kZVNpemU7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdE5vZGVTaXplID0geDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMYXlvdXQucHJvdG90eXBlLmdyb3VwQ29tcGFjdG5lc3MgPSBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIGlmICgheClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dyb3VwQ29tcGFjdG5lc3M7XHJcbiAgICAgICAgdGhpcy5fZ3JvdXBDb21wYWN0bmVzcyA9IHg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGF5b3V0LnByb3RvdHlwZS5saW5rRGlzdGFuY2UgPSBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIGlmICgheCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGlua0Rpc3RhbmNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9saW5rRGlzdGFuY2UgPSB0eXBlb2YgeCA9PT0gXCJmdW5jdGlvblwiID8geCA6ICt4O1xyXG4gICAgICAgIHRoaXMuX2xpbmtMZW5ndGhDYWxjdWxhdG9yID0gbnVsbDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMYXlvdXQucHJvdG90eXBlLmxpbmtUeXBlID0gZnVuY3Rpb24gKGYpIHtcclxuICAgICAgICB0aGlzLl9saW5rVHlwZSA9IGY7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGF5b3V0LnByb3RvdHlwZS5jb252ZXJnZW5jZVRocmVzaG9sZCA9IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgaWYgKCF4KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGhyZXNob2xkO1xyXG4gICAgICAgIHRoaXMuX3RocmVzaG9sZCA9IHR5cGVvZiB4ID09PSBcImZ1bmN0aW9uXCIgPyB4IDogK3g7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGF5b3V0LnByb3RvdHlwZS5hbHBoYSA9IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYWxwaGE7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHggPSAreDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FscGhhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoeCA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWxwaGEgPSB4O1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FscGhhID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh4ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9ydW5uaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcnVubmluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKHsgdHlwZTogRXZlbnRUeXBlLnN0YXJ0LCBhbHBoYTogdGhpcy5fYWxwaGEgPSB4IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMua2ljaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBMYXlvdXQucHJvdG90eXBlLmdldExpbmtMZW5ndGggPSBmdW5jdGlvbiAobGluaykge1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgdGhpcy5fbGlua0Rpc3RhbmNlID09PSBcImZ1bmN0aW9uXCIgPyArKHRoaXMuX2xpbmtEaXN0YW5jZShsaW5rKSkgOiB0aGlzLl9saW5rRGlzdGFuY2U7XHJcbiAgICB9O1xyXG4gICAgTGF5b3V0LnNldExpbmtMZW5ndGggPSBmdW5jdGlvbiAobGluaywgbGVuZ3RoKSB7XHJcbiAgICAgICAgbGluay5sZW5ndGggPSBsZW5ndGg7XHJcbiAgICB9O1xyXG4gICAgTGF5b3V0LnByb3RvdHlwZS5nZXRMaW5rVHlwZSA9IGZ1bmN0aW9uIChsaW5rKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLl9saW5rVHlwZSA9PT0gXCJmdW5jdGlvblwiID8gdGhpcy5fbGlua1R5cGUobGluaykgOiAwO1xyXG4gICAgfTtcclxuICAgIExheW91dC5wcm90b3R5cGUuc3ltbWV0cmljRGlmZkxpbmtMZW5ndGhzID0gZnVuY3Rpb24gKGlkZWFsTGVuZ3RoLCB3KSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAodyA9PT0gdm9pZCAwKSB7IHcgPSAxOyB9XHJcbiAgICAgICAgdGhpcy5saW5rRGlzdGFuY2UoZnVuY3Rpb24gKGwpIHsgcmV0dXJuIGlkZWFsTGVuZ3RoICogbC5sZW5ndGg7IH0pO1xyXG4gICAgICAgIHRoaXMuX2xpbmtMZW5ndGhDYWxjdWxhdG9yID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gbGlua2xlbmd0aHNfMS5zeW1tZXRyaWNEaWZmTGlua0xlbmd0aHMoX3RoaXMuX2xpbmtzLCBfdGhpcy5saW5rQWNjZXNzb3IsIHcpOyB9O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExheW91dC5wcm90b3R5cGUuamFjY2FyZExpbmtMZW5ndGhzID0gZnVuY3Rpb24gKGlkZWFsTGVuZ3RoLCB3KSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAodyA9PT0gdm9pZCAwKSB7IHcgPSAxOyB9XHJcbiAgICAgICAgdGhpcy5saW5rRGlzdGFuY2UoZnVuY3Rpb24gKGwpIHsgcmV0dXJuIGlkZWFsTGVuZ3RoICogbC5sZW5ndGg7IH0pO1xyXG4gICAgICAgIHRoaXMuX2xpbmtMZW5ndGhDYWxjdWxhdG9yID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gbGlua2xlbmd0aHNfMS5qYWNjYXJkTGlua0xlbmd0aHMoX3RoaXMuX2xpbmtzLCBfdGhpcy5saW5rQWNjZXNzb3IsIHcpOyB9O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExheW91dC5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoaW5pdGlhbFVuY29uc3RyYWluZWRJdGVyYXRpb25zLCBpbml0aWFsVXNlckNvbnN0cmFpbnRJdGVyYXRpb25zLCBpbml0aWFsQWxsQ29uc3RyYWludHNJdGVyYXRpb25zLCBncmlkU25hcEl0ZXJhdGlvbnMsIGtlZXBSdW5uaW5nKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAoaW5pdGlhbFVuY29uc3RyYWluZWRJdGVyYXRpb25zID09PSB2b2lkIDApIHsgaW5pdGlhbFVuY29uc3RyYWluZWRJdGVyYXRpb25zID0gMDsgfVxyXG4gICAgICAgIGlmIChpbml0aWFsVXNlckNvbnN0cmFpbnRJdGVyYXRpb25zID09PSB2b2lkIDApIHsgaW5pdGlhbFVzZXJDb25zdHJhaW50SXRlcmF0aW9ucyA9IDA7IH1cclxuICAgICAgICBpZiAoaW5pdGlhbEFsbENvbnN0cmFpbnRzSXRlcmF0aW9ucyA9PT0gdm9pZCAwKSB7IGluaXRpYWxBbGxDb25zdHJhaW50c0l0ZXJhdGlvbnMgPSAwOyB9XHJcbiAgICAgICAgaWYgKGdyaWRTbmFwSXRlcmF0aW9ucyA9PT0gdm9pZCAwKSB7IGdyaWRTbmFwSXRlcmF0aW9ucyA9IDA7IH1cclxuICAgICAgICBpZiAoa2VlcFJ1bm5pbmcgPT09IHZvaWQgMCkgeyBrZWVwUnVubmluZyA9IHRydWU7IH1cclxuICAgICAgICB2YXIgaSwgaiwgbiA9IHRoaXMubm9kZXMoKS5sZW5ndGgsIE4gPSBuICsgMiAqIHRoaXMuX2dyb3Vwcy5sZW5ndGgsIG0gPSB0aGlzLl9saW5rcy5sZW5ndGgsIHcgPSB0aGlzLl9jYW52YXNTaXplWzBdLCBoID0gdGhpcy5fY2FudmFzU2l6ZVsxXTtcclxuICAgICAgICB2YXIgeCA9IG5ldyBBcnJheShOKSwgeSA9IG5ldyBBcnJheShOKTtcclxuICAgICAgICB2YXIgRyA9IG51bGw7XHJcbiAgICAgICAgdmFyIGFvID0gdGhpcy5fYXZvaWRPdmVybGFwcztcclxuICAgICAgICB0aGlzLl9ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uICh2LCBpKSB7XHJcbiAgICAgICAgICAgIHYuaW5kZXggPSBpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHYueCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHYueCA9IHcgLyAyLCB2LnkgPSBoIC8gMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB4W2ldID0gdi54LCB5W2ldID0gdi55O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmICh0aGlzLl9saW5rTGVuZ3RoQ2FsY3VsYXRvcilcclxuICAgICAgICAgICAgdGhpcy5fbGlua0xlbmd0aENhbGN1bGF0b3IoKTtcclxuICAgICAgICB2YXIgZGlzdGFuY2VzO1xyXG4gICAgICAgIGlmICh0aGlzLl9kaXN0YW5jZU1hdHJpeCkge1xyXG4gICAgICAgICAgICBkaXN0YW5jZXMgPSB0aGlzLl9kaXN0YW5jZU1hdHJpeDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGRpc3RhbmNlcyA9IChuZXcgc2hvcnRlc3RwYXRoc18xLkNhbGN1bGF0b3IoTiwgdGhpcy5fbGlua3MsIExheW91dC5nZXRTb3VyY2VJbmRleCwgTGF5b3V0LmdldFRhcmdldEluZGV4LCBmdW5jdGlvbiAobCkgeyByZXR1cm4gX3RoaXMuZ2V0TGlua0xlbmd0aChsKTsgfSkpLkRpc3RhbmNlTWF0cml4KCk7XHJcbiAgICAgICAgICAgIEcgPSBkZXNjZW50XzEuRGVzY2VudC5jcmVhdGVTcXVhcmVNYXRyaXgoTiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gMjsgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2xpbmtzLmZvckVhY2goZnVuY3Rpb24gKGwpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbC5zb3VyY2UgPT0gXCJudW1iZXJcIilcclxuICAgICAgICAgICAgICAgICAgICBsLnNvdXJjZSA9IF90aGlzLl9ub2Rlc1tsLnNvdXJjZV07XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGwudGFyZ2V0ID09IFwibnVtYmVyXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgbC50YXJnZXQgPSBfdGhpcy5fbm9kZXNbbC50YXJnZXRdO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fbGlua3MuZm9yRWFjaChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHUgPSBMYXlvdXQuZ2V0U291cmNlSW5kZXgoZSksIHYgPSBMYXlvdXQuZ2V0VGFyZ2V0SW5kZXgoZSk7XHJcbiAgICAgICAgICAgICAgICBHW3VdW3ZdID0gR1t2XVt1XSA9IGUud2VpZ2h0IHx8IDE7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgRCA9IGRlc2NlbnRfMS5EZXNjZW50LmNyZWF0ZVNxdWFyZU1hdHJpeChOLCBmdW5jdGlvbiAoaSwgaikge1xyXG4gICAgICAgICAgICByZXR1cm4gZGlzdGFuY2VzW2ldW2pdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmICh0aGlzLl9yb290R3JvdXAgJiYgdHlwZW9mIHRoaXMuX3Jvb3RHcm91cC5ncm91cHMgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHZhciBpID0gbjtcclxuICAgICAgICAgICAgdmFyIGFkZEF0dHJhY3Rpb24gPSBmdW5jdGlvbiAoaSwgaiwgc3RyZW5ndGgsIGlkZWFsRGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgIEdbaV1bal0gPSBHW2pdW2ldID0gc3RyZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBEW2ldW2pdID0gRFtqXVtpXSA9IGlkZWFsRGlzdGFuY2U7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMuX2dyb3Vwcy5mb3JFYWNoKGZ1bmN0aW9uIChnKSB7XHJcbiAgICAgICAgICAgICAgICBhZGRBdHRyYWN0aW9uKGksIGkgKyAxLCBfdGhpcy5fZ3JvdXBDb21wYWN0bmVzcywgMC4xKTtcclxuICAgICAgICAgICAgICAgIHhbaV0gPSAwLCB5W2krK10gPSAwO1xyXG4gICAgICAgICAgICAgICAgeFtpXSA9IDAsIHlbaSsrXSA9IDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuX3Jvb3RHcm91cCA9IHsgbGVhdmVzOiB0aGlzLl9ub2RlcywgZ3JvdXBzOiBbXSB9O1xyXG4gICAgICAgIHZhciBjdXJDb25zdHJhaW50cyA9IHRoaXMuX2NvbnN0cmFpbnRzIHx8IFtdO1xyXG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3RlZExpbmtDb25zdHJhaW50cykge1xyXG4gICAgICAgICAgICB0aGlzLmxpbmtBY2Nlc3Nvci5nZXRNaW5TZXBhcmF0aW9uID0gdGhpcy5fZGlyZWN0ZWRMaW5rQ29uc3RyYWludHMuZ2V0TWluU2VwYXJhdGlvbjtcclxuICAgICAgICAgICAgY3VyQ29uc3RyYWludHMgPSBjdXJDb25zdHJhaW50cy5jb25jYXQobGlua2xlbmd0aHNfMS5nZW5lcmF0ZURpcmVjdGVkRWRnZUNvbnN0cmFpbnRzKG4sIHRoaXMuX2xpbmtzLCB0aGlzLl9kaXJlY3RlZExpbmtDb25zdHJhaW50cy5heGlzLCAodGhpcy5saW5rQWNjZXNzb3IpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYXZvaWRPdmVybGFwcyhmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5fZGVzY2VudCA9IG5ldyBkZXNjZW50XzEuRGVzY2VudChbeCwgeV0sIEQpO1xyXG4gICAgICAgIHRoaXMuX2Rlc2NlbnQubG9ja3MuY2xlYXIoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47ICsraSkge1xyXG4gICAgICAgICAgICB2YXIgbyA9IHRoaXMuX25vZGVzW2ldO1xyXG4gICAgICAgICAgICBpZiAoby5maXhlZCkge1xyXG4gICAgICAgICAgICAgICAgby5weCA9IG8ueDtcclxuICAgICAgICAgICAgICAgIG8ucHkgPSBvLnk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcCA9IFtvLngsIG8ueV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kZXNjZW50LmxvY2tzLmFkZChpLCBwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9kZXNjZW50LnRocmVzaG9sZCA9IHRoaXMuX3RocmVzaG9sZDtcclxuICAgICAgICB0aGlzLmluaXRpYWxMYXlvdXQoaW5pdGlhbFVuY29uc3RyYWluZWRJdGVyYXRpb25zLCB4LCB5KTtcclxuICAgICAgICBpZiAoY3VyQ29uc3RyYWludHMubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgdGhpcy5fZGVzY2VudC5wcm9qZWN0ID0gbmV3IHJlY3RhbmdsZV8xLlByb2plY3Rpb24odGhpcy5fbm9kZXMsIHRoaXMuX2dyb3VwcywgdGhpcy5fcm9vdEdyb3VwLCBjdXJDb25zdHJhaW50cykucHJvamVjdEZ1bmN0aW9ucygpO1xyXG4gICAgICAgIHRoaXMuX2Rlc2NlbnQucnVuKGluaXRpYWxVc2VyQ29uc3RyYWludEl0ZXJhdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuc2VwYXJhdGVPdmVybGFwcGluZ0NvbXBvbmVudHModywgaCk7XHJcbiAgICAgICAgdGhpcy5hdm9pZE92ZXJsYXBzKGFvKTtcclxuICAgICAgICBpZiAoYW8pIHtcclxuICAgICAgICAgICAgdGhpcy5fbm9kZXMuZm9yRWFjaChmdW5jdGlvbiAodiwgaSkgeyB2LnggPSB4W2ldLCB2LnkgPSB5W2ldOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5fZGVzY2VudC5wcm9qZWN0ID0gbmV3IHJlY3RhbmdsZV8xLlByb2plY3Rpb24odGhpcy5fbm9kZXMsIHRoaXMuX2dyb3VwcywgdGhpcy5fcm9vdEdyb3VwLCBjdXJDb25zdHJhaW50cywgdHJ1ZSkucHJvamVjdEZ1bmN0aW9ucygpO1xyXG4gICAgICAgICAgICB0aGlzLl9ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uICh2LCBpKSB7IHhbaV0gPSB2LngsIHlbaV0gPSB2Lnk7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9kZXNjZW50LkcgPSBHO1xyXG4gICAgICAgIHRoaXMuX2Rlc2NlbnQucnVuKGluaXRpYWxBbGxDb25zdHJhaW50c0l0ZXJhdGlvbnMpO1xyXG4gICAgICAgIGlmIChncmlkU25hcEl0ZXJhdGlvbnMpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGVzY2VudC5zbmFwU3RyZW5ndGggPSAxMDAwO1xyXG4gICAgICAgICAgICB0aGlzLl9kZXNjZW50LnNuYXBHcmlkU2l6ZSA9IHRoaXMuX25vZGVzWzBdLndpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLl9kZXNjZW50Lm51bUdyaWRTbmFwTm9kZXMgPSBuO1xyXG4gICAgICAgICAgICB0aGlzLl9kZXNjZW50LnNjYWxlU25hcEJ5TWF4SCA9IG4gIT0gTjtcclxuICAgICAgICAgICAgdmFyIEcwID0gZGVzY2VudF8xLkRlc2NlbnQuY3JlYXRlU3F1YXJlTWF0cml4KE4sIGZ1bmN0aW9uIChpLCBqKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA+PSBuIHx8IGogPj0gbilcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gR1tpXVtqXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fZGVzY2VudC5HID0gRzA7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rlc2NlbnQucnVuKGdyaWRTbmFwSXRlcmF0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudXBkYXRlTm9kZVBvc2l0aW9ucygpO1xyXG4gICAgICAgIHRoaXMuc2VwYXJhdGVPdmVybGFwcGluZ0NvbXBvbmVudHModywgaCk7XHJcbiAgICAgICAgcmV0dXJuIGtlZXBSdW5uaW5nID8gdGhpcy5yZXN1bWUoKSA6IHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGF5b3V0LnByb3RvdHlwZS5pbml0aWFsTGF5b3V0ID0gZnVuY3Rpb24gKGl0ZXJhdGlvbnMsIHgsIHkpIHtcclxuICAgICAgICBpZiAodGhpcy5fZ3JvdXBzLmxlbmd0aCA+IDAgJiYgaXRlcmF0aW9ucyA+IDApIHtcclxuICAgICAgICAgICAgdmFyIG4gPSB0aGlzLl9ub2Rlcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHZhciBlZGdlcyA9IHRoaXMuX2xpbmtzLm1hcChmdW5jdGlvbiAoZSkgeyByZXR1cm4gKHsgc291cmNlOiBlLnNvdXJjZS5pbmRleCwgdGFyZ2V0OiBlLnRhcmdldC5pbmRleCB9KTsgfSk7XHJcbiAgICAgICAgICAgIHZhciB2cyA9IHRoaXMuX25vZGVzLm1hcChmdW5jdGlvbiAodikgeyByZXR1cm4gKHsgaW5kZXg6IHYuaW5kZXggfSk7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9ncm91cHMuZm9yRWFjaChmdW5jdGlvbiAoZywgaSkge1xyXG4gICAgICAgICAgICAgICAgdnMucHVzaCh7IGluZGV4OiBnLmluZGV4ID0gbiArIGkgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9ncm91cHMuZm9yRWFjaChmdW5jdGlvbiAoZywgaSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBnLmxlYXZlcyAhPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgICAgICAgICAgZy5sZWF2ZXMuZm9yRWFjaChmdW5jdGlvbiAodikgeyByZXR1cm4gZWRnZXMucHVzaCh7IHNvdXJjZTogZy5pbmRleCwgdGFyZ2V0OiB2LmluZGV4IH0pOyB9KTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZy5ncm91cHMgIT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgICAgIGcuZ3JvdXBzLmZvckVhY2goZnVuY3Rpb24gKGdnKSB7IHJldHVybiBlZGdlcy5wdXNoKHsgc291cmNlOiBnLmluZGV4LCB0YXJnZXQ6IGdnLmluZGV4IH0pOyB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIG5ldyBMYXlvdXQoKVxyXG4gICAgICAgICAgICAgICAgLnNpemUodGhpcy5zaXplKCkpXHJcbiAgICAgICAgICAgICAgICAubm9kZXModnMpXHJcbiAgICAgICAgICAgICAgICAubGlua3MoZWRnZXMpXHJcbiAgICAgICAgICAgICAgICAuYXZvaWRPdmVybGFwcyhmYWxzZSlcclxuICAgICAgICAgICAgICAgIC5saW5rRGlzdGFuY2UodGhpcy5saW5rRGlzdGFuY2UoKSlcclxuICAgICAgICAgICAgICAgIC5zeW1tZXRyaWNEaWZmTGlua0xlbmd0aHMoNSlcclxuICAgICAgICAgICAgICAgIC5jb252ZXJnZW5jZVRocmVzaG9sZCgxZS00KVxyXG4gICAgICAgICAgICAgICAgLnN0YXJ0KGl0ZXJhdGlvbnMsIDAsIDAsIDAsIGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5fbm9kZXMuZm9yRWFjaChmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICAgICAgeFt2LmluZGV4XSA9IHZzW3YuaW5kZXhdLng7XHJcbiAgICAgICAgICAgICAgICB5W3YuaW5kZXhdID0gdnNbdi5pbmRleF0ueTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9kZXNjZW50LnJ1bihpdGVyYXRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgTGF5b3V0LnByb3RvdHlwZS5zZXBhcmF0ZU92ZXJsYXBwaW5nQ29tcG9uZW50cyA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAoIXRoaXMuX2Rpc3RhbmNlTWF0cml4ICYmIHRoaXMuX2hhbmRsZURpc2Nvbm5lY3RlZCkge1xyXG4gICAgICAgICAgICB2YXIgeF8xID0gdGhpcy5fZGVzY2VudC54WzBdLCB5XzEgPSB0aGlzLl9kZXNjZW50LnhbMV07XHJcbiAgICAgICAgICAgIHRoaXMuX25vZGVzLmZvckVhY2goZnVuY3Rpb24gKHYsIGkpIHsgdi54ID0geF8xW2ldLCB2LnkgPSB5XzFbaV07IH0pO1xyXG4gICAgICAgICAgICB2YXIgZ3JhcGhzID0gaGFuZGxlZGlzY29ubmVjdGVkXzEuc2VwYXJhdGVHcmFwaHModGhpcy5fbm9kZXMsIHRoaXMuX2xpbmtzKTtcclxuICAgICAgICAgICAgaGFuZGxlZGlzY29ubmVjdGVkXzEuYXBwbHlQYWNraW5nKGdyYXBocywgd2lkdGgsIGhlaWdodCwgdGhpcy5fZGVmYXVsdE5vZGVTaXplKTtcclxuICAgICAgICAgICAgdGhpcy5fbm9kZXMuZm9yRWFjaChmdW5jdGlvbiAodiwgaSkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX2Rlc2NlbnQueFswXVtpXSA9IHYueCwgX3RoaXMuX2Rlc2NlbnQueFsxXVtpXSA9IHYueTtcclxuICAgICAgICAgICAgICAgIGlmICh2LmJvdW5kcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHYuYm91bmRzLnNldFhDZW50cmUodi54KTtcclxuICAgICAgICAgICAgICAgICAgICB2LmJvdW5kcy5zZXRZQ2VudHJlKHYueSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBMYXlvdXQucHJvdG90eXBlLnJlc3VtZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hbHBoYSgwLjEpO1xyXG4gICAgfTtcclxuICAgIExheW91dC5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hbHBoYSgwKTtcclxuICAgIH07XHJcbiAgICBMYXlvdXQucHJvdG90eXBlLnByZXBhcmVFZGdlUm91dGluZyA9IGZ1bmN0aW9uIChub2RlTWFyZ2luKSB7XHJcbiAgICAgICAgaWYgKG5vZGVNYXJnaW4gPT09IHZvaWQgMCkgeyBub2RlTWFyZ2luID0gMDsgfVxyXG4gICAgICAgIHRoaXMuX3Zpc2liaWxpdHlHcmFwaCA9IG5ldyBnZW9tXzEuVGFuZ2VudFZpc2liaWxpdHlHcmFwaCh0aGlzLl9ub2Rlcy5tYXAoZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHYuYm91bmRzLmluZmxhdGUoLW5vZGVNYXJnaW4pLnZlcnRpY2VzKCk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfTtcclxuICAgIExheW91dC5wcm90b3R5cGUucm91dGVFZGdlID0gZnVuY3Rpb24gKGVkZ2UsIGRyYXcpIHtcclxuICAgICAgICB2YXIgbGluZURhdGEgPSBbXTtcclxuICAgICAgICB2YXIgdmcyID0gbmV3IGdlb21fMS5UYW5nZW50VmlzaWJpbGl0eUdyYXBoKHRoaXMuX3Zpc2liaWxpdHlHcmFwaC5QLCB7IFY6IHRoaXMuX3Zpc2liaWxpdHlHcmFwaC5WLCBFOiB0aGlzLl92aXNpYmlsaXR5R3JhcGguRSB9KSwgcG9ydDEgPSB7IHg6IGVkZ2Uuc291cmNlLngsIHk6IGVkZ2Uuc291cmNlLnkgfSwgcG9ydDIgPSB7IHg6IGVkZ2UudGFyZ2V0LngsIHk6IGVkZ2UudGFyZ2V0LnkgfSwgc3RhcnQgPSB2ZzIuYWRkUG9pbnQocG9ydDEsIGVkZ2Uuc291cmNlLmluZGV4KSwgZW5kID0gdmcyLmFkZFBvaW50KHBvcnQyLCBlZGdlLnRhcmdldC5pbmRleCk7XHJcbiAgICAgICAgdmcyLmFkZEVkZ2VJZlZpc2libGUocG9ydDEsIHBvcnQyLCBlZGdlLnNvdXJjZS5pbmRleCwgZWRnZS50YXJnZXQuaW5kZXgpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgZHJhdyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgZHJhdyh2ZzIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc291cmNlSW5kID0gZnVuY3Rpb24gKGUpIHsgcmV0dXJuIGUuc291cmNlLmlkOyB9LCB0YXJnZXRJbmQgPSBmdW5jdGlvbiAoZSkgeyByZXR1cm4gZS50YXJnZXQuaWQ7IH0sIGxlbmd0aCA9IGZ1bmN0aW9uIChlKSB7IHJldHVybiBlLmxlbmd0aCgpOyB9LCBzcENhbGMgPSBuZXcgc2hvcnRlc3RwYXRoc18xLkNhbGN1bGF0b3IodmcyLlYubGVuZ3RoLCB2ZzIuRSwgc291cmNlSW5kLCB0YXJnZXRJbmQsIGxlbmd0aCksIHNob3J0ZXN0UGF0aCA9IHNwQ2FsYy5QYXRoRnJvbU5vZGVUb05vZGUoc3RhcnQuaWQsIGVuZC5pZCk7XHJcbiAgICAgICAgaWYgKHNob3J0ZXN0UGF0aC5sZW5ndGggPT09IDEgfHwgc2hvcnRlc3RQYXRoLmxlbmd0aCA9PT0gdmcyLlYubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHZhciByb3V0ZSA9IHJlY3RhbmdsZV8xLm1ha2VFZGdlQmV0d2VlbihlZGdlLnNvdXJjZS5pbm5lckJvdW5kcywgZWRnZS50YXJnZXQuaW5uZXJCb3VuZHMsIDUpO1xyXG4gICAgICAgICAgICBsaW5lRGF0YSA9IFtyb3V0ZS5zb3VyY2VJbnRlcnNlY3Rpb24sIHJvdXRlLmFycm93U3RhcnRdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIG4gPSBzaG9ydGVzdFBhdGgubGVuZ3RoIC0gMiwgcCA9IHZnMi5WW3Nob3J0ZXN0UGF0aFtuXV0ucCwgcSA9IHZnMi5WW3Nob3J0ZXN0UGF0aFswXV0ucCwgbGluZURhdGEgPSBbZWRnZS5zb3VyY2UuaW5uZXJCb3VuZHMucmF5SW50ZXJzZWN0aW9uKHAueCwgcC55KV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBuOyBpID49IDA7IC0taSlcclxuICAgICAgICAgICAgICAgIGxpbmVEYXRhLnB1c2godmcyLlZbc2hvcnRlc3RQYXRoW2ldXS5wKTtcclxuICAgICAgICAgICAgbGluZURhdGEucHVzaChyZWN0YW5nbGVfMS5tYWtlRWRnZVRvKHEsIGVkZ2UudGFyZ2V0LmlubmVyQm91bmRzLCA1KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaW5lRGF0YTtcclxuICAgIH07XHJcbiAgICBMYXlvdXQuZ2V0U291cmNlSW5kZXggPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgZS5zb3VyY2UgPT09ICdudW1iZXInID8gZS5zb3VyY2UgOiBlLnNvdXJjZS5pbmRleDtcclxuICAgIH07XHJcbiAgICBMYXlvdXQuZ2V0VGFyZ2V0SW5kZXggPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgZS50YXJnZXQgPT09ICdudW1iZXInID8gZS50YXJnZXQgOiBlLnRhcmdldC5pbmRleDtcclxuICAgIH07XHJcbiAgICBMYXlvdXQubGlua0lkID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICByZXR1cm4gTGF5b3V0LmdldFNvdXJjZUluZGV4KGUpICsgXCItXCIgKyBMYXlvdXQuZ2V0VGFyZ2V0SW5kZXgoZSk7XHJcbiAgICB9O1xyXG4gICAgTGF5b3V0LmRyYWdTdGFydCA9IGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgaWYgKGlzR3JvdXAoZCkpIHtcclxuICAgICAgICAgICAgTGF5b3V0LnN0b3JlT2Zmc2V0KGQsIExheW91dC5kcmFnT3JpZ2luKGQpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIExheW91dC5zdG9wTm9kZShkKTtcclxuICAgICAgICAgICAgZC5maXhlZCB8PSAyO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBMYXlvdXQuc3RvcE5vZGUgPSBmdW5jdGlvbiAodikge1xyXG4gICAgICAgIHYucHggPSB2Lng7XHJcbiAgICAgICAgdi5weSA9IHYueTtcclxuICAgIH07XHJcbiAgICBMYXlvdXQuc3RvcmVPZmZzZXQgPSBmdW5jdGlvbiAoZCwgb3JpZ2luKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBkLmxlYXZlcyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgZC5sZWF2ZXMuZm9yRWFjaChmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICAgICAgdi5maXhlZCB8PSAyO1xyXG4gICAgICAgICAgICAgICAgTGF5b3V0LnN0b3BOb2RlKHYpO1xyXG4gICAgICAgICAgICAgICAgdi5fZHJhZ0dyb3VwT2Zmc2V0WCA9IHYueCAtIG9yaWdpbi54O1xyXG4gICAgICAgICAgICAgICAgdi5fZHJhZ0dyb3VwT2Zmc2V0WSA9IHYueSAtIG9yaWdpbi55O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiBkLmdyb3VwcyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgZC5ncm91cHMuZm9yRWFjaChmdW5jdGlvbiAoZykgeyByZXR1cm4gTGF5b3V0LnN0b3JlT2Zmc2V0KGcsIG9yaWdpbik7IH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBMYXlvdXQuZHJhZ09yaWdpbiA9IGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgaWYgKGlzR3JvdXAoZCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHg6IGQuYm91bmRzLmN4KCksXHJcbiAgICAgICAgICAgICAgICB5OiBkLmJvdW5kcy5jeSgpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgTGF5b3V0LmRyYWcgPSBmdW5jdGlvbiAoZCwgcG9zaXRpb24pIHtcclxuICAgICAgICBpZiAoaXNHcm91cChkKSkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGQubGVhdmVzICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgZC5sZWF2ZXMuZm9yRWFjaChmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICAgICAgICAgIGQuYm91bmRzLnNldFhDZW50cmUocG9zaXRpb24ueCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZC5ib3VuZHMuc2V0WUNlbnRyZShwb3NpdGlvbi55KTtcclxuICAgICAgICAgICAgICAgICAgICB2LnB4ID0gdi5fZHJhZ0dyb3VwT2Zmc2V0WCArIHBvc2l0aW9uLng7XHJcbiAgICAgICAgICAgICAgICAgICAgdi5weSA9IHYuX2RyYWdHcm91cE9mZnNldFkgKyBwb3NpdGlvbi55O1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBkLmdyb3VwcyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIGQuZ3JvdXBzLmZvckVhY2goZnVuY3Rpb24gKGcpIHsgcmV0dXJuIExheW91dC5kcmFnKGcsIHBvc2l0aW9uKTsgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGQucHggPSBwb3NpdGlvbi54O1xyXG4gICAgICAgICAgICBkLnB5ID0gcG9zaXRpb24ueTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgTGF5b3V0LmRyYWdFbmQgPSBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgIGlmIChpc0dyb3VwKGQpKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZC5sZWF2ZXMgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICBkLmxlYXZlcy5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTGF5b3V0LmRyYWdFbmQodik7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHYuX2RyYWdHcm91cE9mZnNldFg7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHYuX2RyYWdHcm91cE9mZnNldFk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGQuZ3JvdXBzICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgZC5ncm91cHMuZm9yRWFjaChMYXlvdXQuZHJhZ0VuZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGQuZml4ZWQgJj0gfjY7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIExheW91dC5tb3VzZU92ZXIgPSBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgIGQuZml4ZWQgfD0gNDtcclxuICAgICAgICBkLnB4ID0gZC54LCBkLnB5ID0gZC55O1xyXG4gICAgfTtcclxuICAgIExheW91dC5tb3VzZU91dCA9IGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgZC5maXhlZCAmPSB+NDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTGF5b3V0O1xyXG59KCkpO1xyXG5leHBvcnRzLkxheW91dCA9IExheW91dDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGF5b3V0LmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3dlYmNvbGEvZGlzdC9zcmMvbGF5b3V0LmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdnBzY18xID0gcmVxdWlyZShcIi4vdnBzY1wiKTtcclxudmFyIHJidHJlZV8xID0gcmVxdWlyZShcIi4vcmJ0cmVlXCIpO1xyXG5mdW5jdGlvbiBjb21wdXRlR3JvdXBCb3VuZHMoZykge1xyXG4gICAgZy5ib3VuZHMgPSB0eXBlb2YgZy5sZWF2ZXMgIT09IFwidW5kZWZpbmVkXCIgP1xyXG4gICAgICAgIGcubGVhdmVzLnJlZHVjZShmdW5jdGlvbiAociwgYykgeyByZXR1cm4gYy5ib3VuZHMudW5pb24ocik7IH0sIFJlY3RhbmdsZS5lbXB0eSgpKSA6XHJcbiAgICAgICAgUmVjdGFuZ2xlLmVtcHR5KCk7XHJcbiAgICBpZiAodHlwZW9mIGcuZ3JvdXBzICE9PSBcInVuZGVmaW5lZFwiKVxyXG4gICAgICAgIGcuYm91bmRzID0gZy5ncm91cHMucmVkdWNlKGZ1bmN0aW9uIChyLCBjKSB7IHJldHVybiBjb21wdXRlR3JvdXBCb3VuZHMoYykudW5pb24ocik7IH0sIGcuYm91bmRzKTtcclxuICAgIGcuYm91bmRzID0gZy5ib3VuZHMuaW5mbGF0ZShnLnBhZGRpbmcpO1xyXG4gICAgcmV0dXJuIGcuYm91bmRzO1xyXG59XHJcbmV4cG9ydHMuY29tcHV0ZUdyb3VwQm91bmRzID0gY29tcHV0ZUdyb3VwQm91bmRzO1xyXG52YXIgUmVjdGFuZ2xlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFJlY3RhbmdsZSh4LCBYLCB5LCBZKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLlggPSBYO1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy5ZID0gWTtcclxuICAgIH1cclxuICAgIFJlY3RhbmdsZS5lbXB0eSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBSZWN0YW5nbGUoTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLCBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFksIE51bWJlci5QT1NJVElWRV9JTkZJTklUWSwgTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZKTsgfTtcclxuICAgIFJlY3RhbmdsZS5wcm90b3R5cGUuY3ggPSBmdW5jdGlvbiAoKSB7IHJldHVybiAodGhpcy54ICsgdGhpcy5YKSAvIDI7IH07XHJcbiAgICBSZWN0YW5nbGUucHJvdG90eXBlLmN5ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gKHRoaXMueSArIHRoaXMuWSkgLyAyOyB9O1xyXG4gICAgUmVjdGFuZ2xlLnByb3RvdHlwZS5vdmVybGFwWCA9IGZ1bmN0aW9uIChyKSB7XHJcbiAgICAgICAgdmFyIHV4ID0gdGhpcy5jeCgpLCB2eCA9IHIuY3goKTtcclxuICAgICAgICBpZiAodXggPD0gdnggJiYgci54IDwgdGhpcy5YKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5YIC0gci54O1xyXG4gICAgICAgIGlmICh2eCA8PSB1eCAmJiB0aGlzLnggPCByLlgpXHJcbiAgICAgICAgICAgIHJldHVybiByLlggLSB0aGlzLng7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9O1xyXG4gICAgUmVjdGFuZ2xlLnByb3RvdHlwZS5vdmVybGFwWSA9IGZ1bmN0aW9uIChyKSB7XHJcbiAgICAgICAgdmFyIHV5ID0gdGhpcy5jeSgpLCB2eSA9IHIuY3koKTtcclxuICAgICAgICBpZiAodXkgPD0gdnkgJiYgci55IDwgdGhpcy5ZKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ZIC0gci55O1xyXG4gICAgICAgIGlmICh2eSA8PSB1eSAmJiB0aGlzLnkgPCByLlkpXHJcbiAgICAgICAgICAgIHJldHVybiByLlkgLSB0aGlzLnk7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9O1xyXG4gICAgUmVjdGFuZ2xlLnByb3RvdHlwZS5zZXRYQ2VudHJlID0gZnVuY3Rpb24gKGN4KSB7XHJcbiAgICAgICAgdmFyIGR4ID0gY3ggLSB0aGlzLmN4KCk7XHJcbiAgICAgICAgdGhpcy54ICs9IGR4O1xyXG4gICAgICAgIHRoaXMuWCArPSBkeDtcclxuICAgIH07XHJcbiAgICBSZWN0YW5nbGUucHJvdG90eXBlLnNldFlDZW50cmUgPSBmdW5jdGlvbiAoY3kpIHtcclxuICAgICAgICB2YXIgZHkgPSBjeSAtIHRoaXMuY3koKTtcclxuICAgICAgICB0aGlzLnkgKz0gZHk7XHJcbiAgICAgICAgdGhpcy5ZICs9IGR5O1xyXG4gICAgfTtcclxuICAgIFJlY3RhbmdsZS5wcm90b3R5cGUud2lkdGggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuWCAtIHRoaXMueDtcclxuICAgIH07XHJcbiAgICBSZWN0YW5nbGUucHJvdG90eXBlLmhlaWdodCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ZIC0gdGhpcy55O1xyXG4gICAgfTtcclxuICAgIFJlY3RhbmdsZS5wcm90b3R5cGUudW5pb24gPSBmdW5jdGlvbiAocikge1xyXG4gICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKE1hdGgubWluKHRoaXMueCwgci54KSwgTWF0aC5tYXgodGhpcy5YLCByLlgpLCBNYXRoLm1pbih0aGlzLnksIHIueSksIE1hdGgubWF4KHRoaXMuWSwgci5ZKSk7XHJcbiAgICB9O1xyXG4gICAgUmVjdGFuZ2xlLnByb3RvdHlwZS5saW5lSW50ZXJzZWN0aW9ucyA9IGZ1bmN0aW9uICh4MSwgeTEsIHgyLCB5Mikge1xyXG4gICAgICAgIHZhciBzaWRlcyA9IFtbdGhpcy54LCB0aGlzLnksIHRoaXMuWCwgdGhpcy55XSxcclxuICAgICAgICAgICAgW3RoaXMuWCwgdGhpcy55LCB0aGlzLlgsIHRoaXMuWV0sXHJcbiAgICAgICAgICAgIFt0aGlzLlgsIHRoaXMuWSwgdGhpcy54LCB0aGlzLlldLFxyXG4gICAgICAgICAgICBbdGhpcy54LCB0aGlzLlksIHRoaXMueCwgdGhpcy55XV07XHJcbiAgICAgICAgdmFyIGludGVyc2VjdGlvbnMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDQ7ICsraSkge1xyXG4gICAgICAgICAgICB2YXIgciA9IFJlY3RhbmdsZS5saW5lSW50ZXJzZWN0aW9uKHgxLCB5MSwgeDIsIHkyLCBzaWRlc1tpXVswXSwgc2lkZXNbaV1bMV0sIHNpZGVzW2ldWzJdLCBzaWRlc1tpXVszXSk7XHJcbiAgICAgICAgICAgIGlmIChyICE9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgaW50ZXJzZWN0aW9ucy5wdXNoKHsgeDogci54LCB5OiByLnkgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbnRlcnNlY3Rpb25zO1xyXG4gICAgfTtcclxuICAgIFJlY3RhbmdsZS5wcm90b3R5cGUucmF5SW50ZXJzZWN0aW9uID0gZnVuY3Rpb24gKHgyLCB5Mikge1xyXG4gICAgICAgIHZhciBpbnRzID0gdGhpcy5saW5lSW50ZXJzZWN0aW9ucyh0aGlzLmN4KCksIHRoaXMuY3koKSwgeDIsIHkyKTtcclxuICAgICAgICByZXR1cm4gaW50cy5sZW5ndGggPiAwID8gaW50c1swXSA6IG51bGw7XHJcbiAgICB9O1xyXG4gICAgUmVjdGFuZ2xlLnByb3RvdHlwZS52ZXJ0aWNlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB7IHg6IHRoaXMueCwgeTogdGhpcy55IH0sXHJcbiAgICAgICAgICAgIHsgeDogdGhpcy5YLCB5OiB0aGlzLnkgfSxcclxuICAgICAgICAgICAgeyB4OiB0aGlzLlgsIHk6IHRoaXMuWSB9LFxyXG4gICAgICAgICAgICB7IHg6IHRoaXMueCwgeTogdGhpcy5ZIH0sXHJcbiAgICAgICAgICAgIHsgeDogdGhpcy54LCB5OiB0aGlzLnkgfVxyXG4gICAgICAgIF07XHJcbiAgICB9O1xyXG4gICAgUmVjdGFuZ2xlLmxpbmVJbnRlcnNlY3Rpb24gPSBmdW5jdGlvbiAoeDEsIHkxLCB4MiwgeTIsIHgzLCB5MywgeDQsIHk0KSB7XHJcbiAgICAgICAgdmFyIGR4MTIgPSB4MiAtIHgxLCBkeDM0ID0geDQgLSB4MywgZHkxMiA9IHkyIC0geTEsIGR5MzQgPSB5NCAtIHkzLCBkZW5vbWluYXRvciA9IGR5MzQgKiBkeDEyIC0gZHgzNCAqIGR5MTI7XHJcbiAgICAgICAgaWYgKGRlbm9taW5hdG9yID09IDApXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBkeDMxID0geDEgLSB4MywgZHkzMSA9IHkxIC0geTMsIG51bWEgPSBkeDM0ICogZHkzMSAtIGR5MzQgKiBkeDMxLCBhID0gbnVtYSAvIGRlbm9taW5hdG9yLCBudW1iID0gZHgxMiAqIGR5MzEgLSBkeTEyICogZHgzMSwgYiA9IG51bWIgLyBkZW5vbWluYXRvcjtcclxuICAgICAgICBpZiAoYSA+PSAwICYmIGEgPD0gMSAmJiBiID49IDAgJiYgYiA8PSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB4OiB4MSArIGEgKiBkeDEyLFxyXG4gICAgICAgICAgICAgICAgeTogeTEgKyBhICogZHkxMlxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH07XHJcbiAgICBSZWN0YW5nbGUucHJvdG90eXBlLmluZmxhdGUgPSBmdW5jdGlvbiAocGFkKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSZWN0YW5nbGUodGhpcy54IC0gcGFkLCB0aGlzLlggKyBwYWQsIHRoaXMueSAtIHBhZCwgdGhpcy5ZICsgcGFkKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gUmVjdGFuZ2xlO1xyXG59KCkpO1xyXG5leHBvcnRzLlJlY3RhbmdsZSA9IFJlY3RhbmdsZTtcclxuZnVuY3Rpb24gbWFrZUVkZ2VCZXR3ZWVuKHNvdXJjZSwgdGFyZ2V0LCBhaCkge1xyXG4gICAgdmFyIHNpID0gc291cmNlLnJheUludGVyc2VjdGlvbih0YXJnZXQuY3goKSwgdGFyZ2V0LmN5KCkpIHx8IHsgeDogc291cmNlLmN4KCksIHk6IHNvdXJjZS5jeSgpIH0sIHRpID0gdGFyZ2V0LnJheUludGVyc2VjdGlvbihzb3VyY2UuY3goKSwgc291cmNlLmN5KCkpIHx8IHsgeDogdGFyZ2V0LmN4KCksIHk6IHRhcmdldC5jeSgpIH0sIGR4ID0gdGkueCAtIHNpLngsIGR5ID0gdGkueSAtIHNpLnksIGwgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpLCBhbCA9IGwgLSBhaDtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc291cmNlSW50ZXJzZWN0aW9uOiBzaSxcclxuICAgICAgICB0YXJnZXRJbnRlcnNlY3Rpb246IHRpLFxyXG4gICAgICAgIGFycm93U3RhcnQ6IHsgeDogc2kueCArIGFsICogZHggLyBsLCB5OiBzaS55ICsgYWwgKiBkeSAvIGwgfVxyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLm1ha2VFZGdlQmV0d2VlbiA9IG1ha2VFZGdlQmV0d2VlbjtcclxuZnVuY3Rpb24gbWFrZUVkZ2VUbyhzLCB0YXJnZXQsIGFoKSB7XHJcbiAgICB2YXIgdGkgPSB0YXJnZXQucmF5SW50ZXJzZWN0aW9uKHMueCwgcy55KTtcclxuICAgIGlmICghdGkpXHJcbiAgICAgICAgdGkgPSB7IHg6IHRhcmdldC5jeCgpLCB5OiB0YXJnZXQuY3koKSB9O1xyXG4gICAgdmFyIGR4ID0gdGkueCAtIHMueCwgZHkgPSB0aS55IC0gcy55LCBsID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuICAgIHJldHVybiB7IHg6IHRpLnggLSBhaCAqIGR4IC8gbCwgeTogdGkueSAtIGFoICogZHkgLyBsIH07XHJcbn1cclxuZXhwb3J0cy5tYWtlRWRnZVRvID0gbWFrZUVkZ2VUbztcclxudmFyIE5vZGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTm9kZSh2LCByLCBwb3MpIHtcclxuICAgICAgICB0aGlzLnYgPSB2O1xyXG4gICAgICAgIHRoaXMuciA9IHI7XHJcbiAgICAgICAgdGhpcy5wb3MgPSBwb3M7XHJcbiAgICAgICAgdGhpcy5wcmV2ID0gbWFrZVJCVHJlZSgpO1xyXG4gICAgICAgIHRoaXMubmV4dCA9IG1ha2VSQlRyZWUoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBOb2RlO1xyXG59KCkpO1xyXG52YXIgRXZlbnQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gRXZlbnQoaXNPcGVuLCB2LCBwb3MpIHtcclxuICAgICAgICB0aGlzLmlzT3BlbiA9IGlzT3BlbjtcclxuICAgICAgICB0aGlzLnYgPSB2O1xyXG4gICAgICAgIHRoaXMucG9zID0gcG9zO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIEV2ZW50O1xyXG59KCkpO1xyXG5mdW5jdGlvbiBjb21wYXJlRXZlbnRzKGEsIGIpIHtcclxuICAgIGlmIChhLnBvcyA+IGIucG9zKSB7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICB9XHJcbiAgICBpZiAoYS5wb3MgPCBiLnBvcykge1xyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxuICAgIGlmIChhLmlzT3Blbikge1xyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxuICAgIGlmIChiLmlzT3Blbikge1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIDA7XHJcbn1cclxuZnVuY3Rpb24gbWFrZVJCVHJlZSgpIHtcclxuICAgIHJldHVybiBuZXcgcmJ0cmVlXzEuUkJUcmVlKGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhLnBvcyAtIGIucG9zOyB9KTtcclxufVxyXG52YXIgeFJlY3QgPSB7XHJcbiAgICBnZXRDZW50cmU6IGZ1bmN0aW9uIChyKSB7IHJldHVybiByLmN4KCk7IH0sXHJcbiAgICBnZXRPcGVuOiBmdW5jdGlvbiAocikgeyByZXR1cm4gci55OyB9LFxyXG4gICAgZ2V0Q2xvc2U6IGZ1bmN0aW9uIChyKSB7IHJldHVybiByLlk7IH0sXHJcbiAgICBnZXRTaXplOiBmdW5jdGlvbiAocikgeyByZXR1cm4gci53aWR0aCgpOyB9LFxyXG4gICAgbWFrZVJlY3Q6IGZ1bmN0aW9uIChvcGVuLCBjbG9zZSwgY2VudGVyLCBzaXplKSB7IHJldHVybiBuZXcgUmVjdGFuZ2xlKGNlbnRlciAtIHNpemUgLyAyLCBjZW50ZXIgKyBzaXplIC8gMiwgb3BlbiwgY2xvc2UpOyB9LFxyXG4gICAgZmluZE5laWdoYm91cnM6IGZpbmRYTmVpZ2hib3Vyc1xyXG59O1xyXG52YXIgeVJlY3QgPSB7XHJcbiAgICBnZXRDZW50cmU6IGZ1bmN0aW9uIChyKSB7IHJldHVybiByLmN5KCk7IH0sXHJcbiAgICBnZXRPcGVuOiBmdW5jdGlvbiAocikgeyByZXR1cm4gci54OyB9LFxyXG4gICAgZ2V0Q2xvc2U6IGZ1bmN0aW9uIChyKSB7IHJldHVybiByLlg7IH0sXHJcbiAgICBnZXRTaXplOiBmdW5jdGlvbiAocikgeyByZXR1cm4gci5oZWlnaHQoKTsgfSxcclxuICAgIG1ha2VSZWN0OiBmdW5jdGlvbiAob3BlbiwgY2xvc2UsIGNlbnRlciwgc2l6ZSkgeyByZXR1cm4gbmV3IFJlY3RhbmdsZShvcGVuLCBjbG9zZSwgY2VudGVyIC0gc2l6ZSAvIDIsIGNlbnRlciArIHNpemUgLyAyKTsgfSxcclxuICAgIGZpbmROZWlnaGJvdXJzOiBmaW5kWU5laWdoYm91cnNcclxufTtcclxuZnVuY3Rpb24gZ2VuZXJhdGVHcm91cENvbnN0cmFpbnRzKHJvb3QsIGYsIG1pblNlcCwgaXNDb250YWluZWQpIHtcclxuICAgIGlmIChpc0NvbnRhaW5lZCA9PT0gdm9pZCAwKSB7IGlzQ29udGFpbmVkID0gZmFsc2U7IH1cclxuICAgIHZhciBwYWRkaW5nID0gcm9vdC5wYWRkaW5nLCBnbiA9IHR5cGVvZiByb290Lmdyb3VwcyAhPT0gJ3VuZGVmaW5lZCcgPyByb290Lmdyb3Vwcy5sZW5ndGggOiAwLCBsbiA9IHR5cGVvZiByb290LmxlYXZlcyAhPT0gJ3VuZGVmaW5lZCcgPyByb290LmxlYXZlcy5sZW5ndGggOiAwLCBjaGlsZENvbnN0cmFpbnRzID0gIWduID8gW11cclxuICAgICAgICA6IHJvb3QuZ3JvdXBzLnJlZHVjZShmdW5jdGlvbiAoY2NzLCBnKSB7IHJldHVybiBjY3MuY29uY2F0KGdlbmVyYXRlR3JvdXBDb25zdHJhaW50cyhnLCBmLCBtaW5TZXAsIHRydWUpKTsgfSwgW10pLCBuID0gKGlzQ29udGFpbmVkID8gMiA6IDApICsgbG4gKyBnbiwgdnMgPSBuZXcgQXJyYXkobiksIHJzID0gbmV3IEFycmF5KG4pLCBpID0gMCwgYWRkID0gZnVuY3Rpb24gKHIsIHYpIHsgcnNbaV0gPSByOyB2c1tpKytdID0gdjsgfTtcclxuICAgIGlmIChpc0NvbnRhaW5lZCkge1xyXG4gICAgICAgIHZhciBiID0gcm9vdC5ib3VuZHMsIGMgPSBmLmdldENlbnRyZShiKSwgcyA9IGYuZ2V0U2l6ZShiKSAvIDIsIG9wZW4gPSBmLmdldE9wZW4oYiksIGNsb3NlID0gZi5nZXRDbG9zZShiKSwgbWluID0gYyAtIHMgKyBwYWRkaW5nIC8gMiwgbWF4ID0gYyArIHMgLSBwYWRkaW5nIC8gMjtcclxuICAgICAgICByb290Lm1pblZhci5kZXNpcmVkUG9zaXRpb24gPSBtaW47XHJcbiAgICAgICAgYWRkKGYubWFrZVJlY3Qob3BlbiwgY2xvc2UsIG1pbiwgcGFkZGluZyksIHJvb3QubWluVmFyKTtcclxuICAgICAgICByb290Lm1heFZhci5kZXNpcmVkUG9zaXRpb24gPSBtYXg7XHJcbiAgICAgICAgYWRkKGYubWFrZVJlY3Qob3BlbiwgY2xvc2UsIG1heCwgcGFkZGluZyksIHJvb3QubWF4VmFyKTtcclxuICAgIH1cclxuICAgIGlmIChsbilcclxuICAgICAgICByb290LmxlYXZlcy5mb3JFYWNoKGZ1bmN0aW9uIChsKSB7IHJldHVybiBhZGQobC5ib3VuZHMsIGwudmFyaWFibGUpOyB9KTtcclxuICAgIGlmIChnbilcclxuICAgICAgICByb290Lmdyb3Vwcy5mb3JFYWNoKGZ1bmN0aW9uIChnKSB7XHJcbiAgICAgICAgICAgIHZhciBiID0gZy5ib3VuZHM7XHJcbiAgICAgICAgICAgIGFkZChmLm1ha2VSZWN0KGYuZ2V0T3BlbihiKSwgZi5nZXRDbG9zZShiKSwgZi5nZXRDZW50cmUoYiksIGYuZ2V0U2l6ZShiKSksIGcubWluVmFyKTtcclxuICAgICAgICB9KTtcclxuICAgIHZhciBjcyA9IGdlbmVyYXRlQ29uc3RyYWludHMocnMsIHZzLCBmLCBtaW5TZXApO1xyXG4gICAgaWYgKGduKSB7XHJcbiAgICAgICAgdnMuZm9yRWFjaChmdW5jdGlvbiAodikgeyB2LmNPdXQgPSBbXSwgdi5jSW4gPSBbXTsgfSk7XHJcbiAgICAgICAgY3MuZm9yRWFjaChmdW5jdGlvbiAoYykgeyBjLmxlZnQuY091dC5wdXNoKGMpLCBjLnJpZ2h0LmNJbi5wdXNoKGMpOyB9KTtcclxuICAgICAgICByb290Lmdyb3Vwcy5mb3JFYWNoKGZ1bmN0aW9uIChnKSB7XHJcbiAgICAgICAgICAgIHZhciBnYXBBZGp1c3RtZW50ID0gKGcucGFkZGluZyAtIGYuZ2V0U2l6ZShnLmJvdW5kcykpIC8gMjtcclxuICAgICAgICAgICAgZy5taW5WYXIuY0luLmZvckVhY2goZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMuZ2FwICs9IGdhcEFkanVzdG1lbnQ7IH0pO1xyXG4gICAgICAgICAgICBnLm1pblZhci5jT3V0LmZvckVhY2goZnVuY3Rpb24gKGMpIHsgYy5sZWZ0ID0gZy5tYXhWYXI7IGMuZ2FwICs9IGdhcEFkanVzdG1lbnQ7IH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNoaWxkQ29uc3RyYWludHMuY29uY2F0KGNzKTtcclxufVxyXG5mdW5jdGlvbiBnZW5lcmF0ZUNvbnN0cmFpbnRzKHJzLCB2YXJzLCByZWN0LCBtaW5TZXApIHtcclxuICAgIHZhciBpLCBuID0gcnMubGVuZ3RoO1xyXG4gICAgdmFyIE4gPSAyICogbjtcclxuICAgIGNvbnNvbGUuYXNzZXJ0KHZhcnMubGVuZ3RoID49IG4pO1xyXG4gICAgdmFyIGV2ZW50cyA9IG5ldyBBcnJheShOKTtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcclxuICAgICAgICB2YXIgciA9IHJzW2ldO1xyXG4gICAgICAgIHZhciB2ID0gbmV3IE5vZGUodmFyc1tpXSwgciwgcmVjdC5nZXRDZW50cmUocikpO1xyXG4gICAgICAgIGV2ZW50c1tpXSA9IG5ldyBFdmVudCh0cnVlLCB2LCByZWN0LmdldE9wZW4ocikpO1xyXG4gICAgICAgIGV2ZW50c1tpICsgbl0gPSBuZXcgRXZlbnQoZmFsc2UsIHYsIHJlY3QuZ2V0Q2xvc2UocikpO1xyXG4gICAgfVxyXG4gICAgZXZlbnRzLnNvcnQoY29tcGFyZUV2ZW50cyk7XHJcbiAgICB2YXIgY3MgPSBuZXcgQXJyYXkoKTtcclxuICAgIHZhciBzY2FubGluZSA9IG1ha2VSQlRyZWUoKTtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBOOyArK2kpIHtcclxuICAgICAgICB2YXIgZSA9IGV2ZW50c1tpXTtcclxuICAgICAgICB2YXIgdiA9IGUudjtcclxuICAgICAgICBpZiAoZS5pc09wZW4pIHtcclxuICAgICAgICAgICAgc2NhbmxpbmUuaW5zZXJ0KHYpO1xyXG4gICAgICAgICAgICByZWN0LmZpbmROZWlnaGJvdXJzKHYsIHNjYW5saW5lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHNjYW5saW5lLnJlbW92ZSh2KTtcclxuICAgICAgICAgICAgdmFyIG1ha2VDb25zdHJhaW50ID0gZnVuY3Rpb24gKGwsIHIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzZXAgPSAocmVjdC5nZXRTaXplKGwucikgKyByZWN0LmdldFNpemUoci5yKSkgLyAyICsgbWluU2VwO1xyXG4gICAgICAgICAgICAgICAgY3MucHVzaChuZXcgdnBzY18xLkNvbnN0cmFpbnQobC52LCByLnYsIHNlcCkpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB2YXIgdmlzaXROZWlnaGJvdXJzID0gZnVuY3Rpb24gKGZvcndhcmQsIHJldmVyc2UsIG1rY29uKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdSwgaXQgPSB2W2ZvcndhcmRdLml0ZXJhdG9yKCk7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoKHUgPSBpdFtmb3J3YXJkXSgpKSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1rY29uKHUsIHYpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVbcmV2ZXJzZV0ucmVtb3ZlKHYpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB2aXNpdE5laWdoYm91cnMoXCJwcmV2XCIsIFwibmV4dFwiLCBmdW5jdGlvbiAodSwgdikgeyByZXR1cm4gbWFrZUNvbnN0cmFpbnQodSwgdik7IH0pO1xyXG4gICAgICAgICAgICB2aXNpdE5laWdoYm91cnMoXCJuZXh0XCIsIFwicHJldlwiLCBmdW5jdGlvbiAodSwgdikgeyByZXR1cm4gbWFrZUNvbnN0cmFpbnQodiwgdSk7IH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnNvbGUuYXNzZXJ0KHNjYW5saW5lLnNpemUgPT09IDApO1xyXG4gICAgcmV0dXJuIGNzO1xyXG59XHJcbmZ1bmN0aW9uIGZpbmRYTmVpZ2hib3Vycyh2LCBzY2FubGluZSkge1xyXG4gICAgdmFyIGYgPSBmdW5jdGlvbiAoZm9yd2FyZCwgcmV2ZXJzZSkge1xyXG4gICAgICAgIHZhciBpdCA9IHNjYW5saW5lLmZpbmRJdGVyKHYpO1xyXG4gICAgICAgIHZhciB1O1xyXG4gICAgICAgIHdoaWxlICgodSA9IGl0W2ZvcndhcmRdKCkpICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHZhciB1b3ZlcnZYID0gdS5yLm92ZXJsYXBYKHYucik7XHJcbiAgICAgICAgICAgIGlmICh1b3ZlcnZYIDw9IDAgfHwgdW92ZXJ2WCA8PSB1LnIub3ZlcmxhcFkodi5yKSkge1xyXG4gICAgICAgICAgICAgICAgdltmb3J3YXJkXS5pbnNlcnQodSk7XHJcbiAgICAgICAgICAgICAgICB1W3JldmVyc2VdLmluc2VydCh2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodW92ZXJ2WCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBmKFwibmV4dFwiLCBcInByZXZcIik7XHJcbiAgICBmKFwicHJldlwiLCBcIm5leHRcIik7XHJcbn1cclxuZnVuY3Rpb24gZmluZFlOZWlnaGJvdXJzKHYsIHNjYW5saW5lKSB7XHJcbiAgICB2YXIgZiA9IGZ1bmN0aW9uIChmb3J3YXJkLCByZXZlcnNlKSB7XHJcbiAgICAgICAgdmFyIHUgPSBzY2FubGluZS5maW5kSXRlcih2KVtmb3J3YXJkXSgpO1xyXG4gICAgICAgIGlmICh1ICE9PSBudWxsICYmIHUuci5vdmVybGFwWCh2LnIpID4gMCkge1xyXG4gICAgICAgICAgICB2W2ZvcndhcmRdLmluc2VydCh1KTtcclxuICAgICAgICAgICAgdVtyZXZlcnNlXS5pbnNlcnQodik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGYoXCJuZXh0XCIsIFwicHJldlwiKTtcclxuICAgIGYoXCJwcmV2XCIsIFwibmV4dFwiKTtcclxufVxyXG5mdW5jdGlvbiBnZW5lcmF0ZVhDb25zdHJhaW50cyhycywgdmFycykge1xyXG4gICAgcmV0dXJuIGdlbmVyYXRlQ29uc3RyYWludHMocnMsIHZhcnMsIHhSZWN0LCAxZS02KTtcclxufVxyXG5leHBvcnRzLmdlbmVyYXRlWENvbnN0cmFpbnRzID0gZ2VuZXJhdGVYQ29uc3RyYWludHM7XHJcbmZ1bmN0aW9uIGdlbmVyYXRlWUNvbnN0cmFpbnRzKHJzLCB2YXJzKSB7XHJcbiAgICByZXR1cm4gZ2VuZXJhdGVDb25zdHJhaW50cyhycywgdmFycywgeVJlY3QsIDFlLTYpO1xyXG59XHJcbmV4cG9ydHMuZ2VuZXJhdGVZQ29uc3RyYWludHMgPSBnZW5lcmF0ZVlDb25zdHJhaW50cztcclxuZnVuY3Rpb24gZ2VuZXJhdGVYR3JvdXBDb25zdHJhaW50cyhyb290KSB7XHJcbiAgICByZXR1cm4gZ2VuZXJhdGVHcm91cENvbnN0cmFpbnRzKHJvb3QsIHhSZWN0LCAxZS02KTtcclxufVxyXG5leHBvcnRzLmdlbmVyYXRlWEdyb3VwQ29uc3RyYWludHMgPSBnZW5lcmF0ZVhHcm91cENvbnN0cmFpbnRzO1xyXG5mdW5jdGlvbiBnZW5lcmF0ZVlHcm91cENvbnN0cmFpbnRzKHJvb3QpIHtcclxuICAgIHJldHVybiBnZW5lcmF0ZUdyb3VwQ29uc3RyYWludHMocm9vdCwgeVJlY3QsIDFlLTYpO1xyXG59XHJcbmV4cG9ydHMuZ2VuZXJhdGVZR3JvdXBDb25zdHJhaW50cyA9IGdlbmVyYXRlWUdyb3VwQ29uc3RyYWludHM7XHJcbmZ1bmN0aW9uIHJlbW92ZU92ZXJsYXBzKHJzKSB7XHJcbiAgICB2YXIgdnMgPSBycy5tYXAoZnVuY3Rpb24gKHIpIHsgcmV0dXJuIG5ldyB2cHNjXzEuVmFyaWFibGUoci5jeCgpKTsgfSk7XHJcbiAgICB2YXIgY3MgPSBnZW5lcmF0ZVhDb25zdHJhaW50cyhycywgdnMpO1xyXG4gICAgdmFyIHNvbHZlciA9IG5ldyB2cHNjXzEuU29sdmVyKHZzLCBjcyk7XHJcbiAgICBzb2x2ZXIuc29sdmUoKTtcclxuICAgIHZzLmZvckVhY2goZnVuY3Rpb24gKHYsIGkpIHsgcmV0dXJuIHJzW2ldLnNldFhDZW50cmUodi5wb3NpdGlvbigpKTsgfSk7XHJcbiAgICB2cyA9IHJzLm1hcChmdW5jdGlvbiAocikgeyByZXR1cm4gbmV3IHZwc2NfMS5WYXJpYWJsZShyLmN5KCkpOyB9KTtcclxuICAgIGNzID0gZ2VuZXJhdGVZQ29uc3RyYWludHMocnMsIHZzKTtcclxuICAgIHNvbHZlciA9IG5ldyB2cHNjXzEuU29sdmVyKHZzLCBjcyk7XHJcbiAgICBzb2x2ZXIuc29sdmUoKTtcclxuICAgIHZzLmZvckVhY2goZnVuY3Rpb24gKHYsIGkpIHsgcmV0dXJuIHJzW2ldLnNldFlDZW50cmUodi5wb3NpdGlvbigpKTsgfSk7XHJcbn1cclxuZXhwb3J0cy5yZW1vdmVPdmVybGFwcyA9IHJlbW92ZU92ZXJsYXBzO1xyXG52YXIgSW5kZXhlZFZhcmlhYmxlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhJbmRleGVkVmFyaWFibGUsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBJbmRleGVkVmFyaWFibGUoaW5kZXgsIHcpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCAwLCB3KSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLmluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIEluZGV4ZWRWYXJpYWJsZTtcclxufSh2cHNjXzEuVmFyaWFibGUpKTtcclxuZXhwb3J0cy5JbmRleGVkVmFyaWFibGUgPSBJbmRleGVkVmFyaWFibGU7XHJcbnZhciBQcm9qZWN0aW9uID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFByb2plY3Rpb24obm9kZXMsIGdyb3Vwcywgcm9vdEdyb3VwLCBjb25zdHJhaW50cywgYXZvaWRPdmVybGFwcykge1xyXG4gICAgICAgIGlmIChyb290R3JvdXAgPT09IHZvaWQgMCkgeyByb290R3JvdXAgPSBudWxsOyB9XHJcbiAgICAgICAgaWYgKGNvbnN0cmFpbnRzID09PSB2b2lkIDApIHsgY29uc3RyYWludHMgPSBudWxsOyB9XHJcbiAgICAgICAgaWYgKGF2b2lkT3ZlcmxhcHMgPT09IHZvaWQgMCkgeyBhdm9pZE92ZXJsYXBzID0gZmFsc2U7IH1cclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMubm9kZXMgPSBub2RlcztcclxuICAgICAgICB0aGlzLmdyb3VwcyA9IGdyb3VwcztcclxuICAgICAgICB0aGlzLnJvb3RHcm91cCA9IHJvb3RHcm91cDtcclxuICAgICAgICB0aGlzLmF2b2lkT3ZlcmxhcHMgPSBhdm9pZE92ZXJsYXBzO1xyXG4gICAgICAgIHRoaXMudmFyaWFibGVzID0gbm9kZXMubWFwKGZ1bmN0aW9uICh2LCBpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2LnZhcmlhYmxlID0gbmV3IEluZGV4ZWRWYXJpYWJsZShpLCAxKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoY29uc3RyYWludHMpXHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlQ29uc3RyYWludHMoY29uc3RyYWludHMpO1xyXG4gICAgICAgIGlmIChhdm9pZE92ZXJsYXBzICYmIHJvb3RHcm91cCAmJiB0eXBlb2Ygcm9vdEdyb3VwLmdyb3VwcyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgbm9kZXMuZm9yRWFjaChmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF2LndpZHRoIHx8ICF2LmhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHYuYm91bmRzID0gbmV3IFJlY3RhbmdsZSh2LngsIHYueCwgdi55LCB2LnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciB3MiA9IHYud2lkdGggLyAyLCBoMiA9IHYuaGVpZ2h0IC8gMjtcclxuICAgICAgICAgICAgICAgIHYuYm91bmRzID0gbmV3IFJlY3RhbmdsZSh2LnggLSB3Miwgdi54ICsgdzIsIHYueSAtIGgyLCB2LnkgKyBoMik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb21wdXRlR3JvdXBCb3VuZHMocm9vdEdyb3VwKTtcclxuICAgICAgICAgICAgdmFyIGkgPSBub2Rlcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGdyb3Vwcy5mb3JFYWNoKGZ1bmN0aW9uIChnKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52YXJpYWJsZXNbaV0gPSBnLm1pblZhciA9IG5ldyBJbmRleGVkVmFyaWFibGUoaSsrLCB0eXBlb2YgZy5zdGlmZm5lc3MgIT09IFwidW5kZWZpbmVkXCIgPyBnLnN0aWZmbmVzcyA6IDAuMDEpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmFyaWFibGVzW2ldID0gZy5tYXhWYXIgPSBuZXcgSW5kZXhlZFZhcmlhYmxlKGkrKywgdHlwZW9mIGcuc3RpZmZuZXNzICE9PSBcInVuZGVmaW5lZFwiID8gZy5zdGlmZm5lc3MgOiAwLjAxKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgUHJvamVjdGlvbi5wcm90b3R5cGUuY3JlYXRlU2VwYXJhdGlvbiA9IGZ1bmN0aW9uIChjKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyB2cHNjXzEuQ29uc3RyYWludCh0aGlzLm5vZGVzW2MubGVmdF0udmFyaWFibGUsIHRoaXMubm9kZXNbYy5yaWdodF0udmFyaWFibGUsIGMuZ2FwLCB0eXBlb2YgYy5lcXVhbGl0eSAhPT0gXCJ1bmRlZmluZWRcIiA/IGMuZXF1YWxpdHkgOiBmYWxzZSk7XHJcbiAgICB9O1xyXG4gICAgUHJvamVjdGlvbi5wcm90b3R5cGUubWFrZUZlYXNpYmxlID0gZnVuY3Rpb24gKGMpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmICghdGhpcy5hdm9pZE92ZXJsYXBzKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdmFyIGF4aXMgPSAneCcsIGRpbSA9ICd3aWR0aCc7XHJcbiAgICAgICAgaWYgKGMuYXhpcyA9PT0gJ3gnKVxyXG4gICAgICAgICAgICBheGlzID0gJ3knLCBkaW0gPSAnaGVpZ2h0JztcclxuICAgICAgICB2YXIgdnMgPSBjLm9mZnNldHMubWFwKGZ1bmN0aW9uIChvKSB7IHJldHVybiBfdGhpcy5ub2Rlc1tvLm5vZGVdOyB9KS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhW2F4aXNdIC0gYltheGlzXTsgfSk7XHJcbiAgICAgICAgdmFyIHAgPSBudWxsO1xyXG4gICAgICAgIHZzLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgaWYgKHApIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXh0UG9zID0gcFtheGlzXSArIHBbZGltXTtcclxuICAgICAgICAgICAgICAgIGlmIChuZXh0UG9zID4gdltheGlzXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZbYXhpc10gPSBuZXh0UG9zO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHAgPSB2O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFByb2plY3Rpb24ucHJvdG90eXBlLmNyZWF0ZUFsaWdubWVudCA9IGZ1bmN0aW9uIChjKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgdSA9IHRoaXMubm9kZXNbYy5vZmZzZXRzWzBdLm5vZGVdLnZhcmlhYmxlO1xyXG4gICAgICAgIHRoaXMubWFrZUZlYXNpYmxlKGMpO1xyXG4gICAgICAgIHZhciBjcyA9IGMuYXhpcyA9PT0gJ3gnID8gdGhpcy54Q29uc3RyYWludHMgOiB0aGlzLnlDb25zdHJhaW50cztcclxuICAgICAgICBjLm9mZnNldHMuc2xpY2UoMSkuZm9yRWFjaChmdW5jdGlvbiAobykge1xyXG4gICAgICAgICAgICB2YXIgdiA9IF90aGlzLm5vZGVzW28ubm9kZV0udmFyaWFibGU7XHJcbiAgICAgICAgICAgIGNzLnB1c2gobmV3IHZwc2NfMS5Db25zdHJhaW50KHUsIHYsIG8ub2Zmc2V0LCB0cnVlKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUHJvamVjdGlvbi5wcm90b3R5cGUuY3JlYXRlQ29uc3RyYWludHMgPSBmdW5jdGlvbiAoY29uc3RyYWludHMpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBpc1NlcCA9IGZ1bmN0aW9uIChjKSB7IHJldHVybiB0eXBlb2YgYy50eXBlID09PSAndW5kZWZpbmVkJyB8fCBjLnR5cGUgPT09ICdzZXBhcmF0aW9uJzsgfTtcclxuICAgICAgICB0aGlzLnhDb25zdHJhaW50cyA9IGNvbnN0cmFpbnRzXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMuYXhpcyA9PT0gXCJ4XCIgJiYgaXNTZXAoYyk7IH0pXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIF90aGlzLmNyZWF0ZVNlcGFyYXRpb24oYyk7IH0pO1xyXG4gICAgICAgIHRoaXMueUNvbnN0cmFpbnRzID0gY29uc3RyYWludHNcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoYykgeyByZXR1cm4gYy5heGlzID09PSBcInlcIiAmJiBpc1NlcChjKTsgfSlcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoYykgeyByZXR1cm4gX3RoaXMuY3JlYXRlU2VwYXJhdGlvbihjKTsgfSk7XHJcbiAgICAgICAgY29uc3RyYWludHNcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoYykgeyByZXR1cm4gYy50eXBlID09PSAnYWxpZ25tZW50JzsgfSlcclxuICAgICAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKGMpIHsgcmV0dXJuIF90aGlzLmNyZWF0ZUFsaWdubWVudChjKTsgfSk7XHJcbiAgICB9O1xyXG4gICAgUHJvamVjdGlvbi5wcm90b3R5cGUuc2V0dXBWYXJpYWJsZXNBbmRCb3VuZHMgPSBmdW5jdGlvbiAoeDAsIHkwLCBkZXNpcmVkLCBnZXREZXNpcmVkKSB7XHJcbiAgICAgICAgdGhpcy5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uICh2LCBpKSB7XHJcbiAgICAgICAgICAgIGlmICh2LmZpeGVkKSB7XHJcbiAgICAgICAgICAgICAgICB2LnZhcmlhYmxlLndlaWdodCA9IHYuZml4ZWRXZWlnaHQgPyB2LmZpeGVkV2VpZ2h0IDogMTAwMDtcclxuICAgICAgICAgICAgICAgIGRlc2lyZWRbaV0gPSBnZXREZXNpcmVkKHYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdi52YXJpYWJsZS53ZWlnaHQgPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciB3ID0gKHYud2lkdGggfHwgMCkgLyAyLCBoID0gKHYuaGVpZ2h0IHx8IDApIC8gMjtcclxuICAgICAgICAgICAgdmFyIGl4ID0geDBbaV0sIGl5ID0geTBbaV07XHJcbiAgICAgICAgICAgIHYuYm91bmRzID0gbmV3IFJlY3RhbmdsZShpeCAtIHcsIGl4ICsgdywgaXkgLSBoLCBpeSArIGgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFByb2plY3Rpb24ucHJvdG90eXBlLnhQcm9qZWN0ID0gZnVuY3Rpb24gKHgwLCB5MCwgeCkge1xyXG4gICAgICAgIGlmICghdGhpcy5yb290R3JvdXAgJiYgISh0aGlzLmF2b2lkT3ZlcmxhcHMgfHwgdGhpcy54Q29uc3RyYWludHMpKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0KHgwLCB5MCwgeDAsIHgsIGZ1bmN0aW9uICh2KSB7IHJldHVybiB2LnB4OyB9LCB0aGlzLnhDb25zdHJhaW50cywgZ2VuZXJhdGVYR3JvdXBDb25zdHJhaW50cywgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHYuYm91bmRzLnNldFhDZW50cmUoeFt2LnZhcmlhYmxlLmluZGV4XSA9IHYudmFyaWFibGUucG9zaXRpb24oKSk7IH0sIGZ1bmN0aW9uIChnKSB7XHJcbiAgICAgICAgICAgIHZhciB4bWluID0geFtnLm1pblZhci5pbmRleF0gPSBnLm1pblZhci5wb3NpdGlvbigpO1xyXG4gICAgICAgICAgICB2YXIgeG1heCA9IHhbZy5tYXhWYXIuaW5kZXhdID0gZy5tYXhWYXIucG9zaXRpb24oKTtcclxuICAgICAgICAgICAgdmFyIHAyID0gZy5wYWRkaW5nIC8gMjtcclxuICAgICAgICAgICAgZy5ib3VuZHMueCA9IHhtaW4gLSBwMjtcclxuICAgICAgICAgICAgZy5ib3VuZHMuWCA9IHhtYXggKyBwMjtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQcm9qZWN0aW9uLnByb3RvdHlwZS55UHJvamVjdCA9IGZ1bmN0aW9uICh4MCwgeTAsIHkpIHtcclxuICAgICAgICBpZiAoIXRoaXMucm9vdEdyb3VwICYmICF0aGlzLnlDb25zdHJhaW50cylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucHJvamVjdCh4MCwgeTAsIHkwLCB5LCBmdW5jdGlvbiAodikgeyByZXR1cm4gdi5weTsgfSwgdGhpcy55Q29uc3RyYWludHMsIGdlbmVyYXRlWUdyb3VwQ29uc3RyYWludHMsIGZ1bmN0aW9uICh2KSB7IHJldHVybiB2LmJvdW5kcy5zZXRZQ2VudHJlKHlbdi52YXJpYWJsZS5pbmRleF0gPSB2LnZhcmlhYmxlLnBvc2l0aW9uKCkpOyB9LCBmdW5jdGlvbiAoZykge1xyXG4gICAgICAgICAgICB2YXIgeW1pbiA9IHlbZy5taW5WYXIuaW5kZXhdID0gZy5taW5WYXIucG9zaXRpb24oKTtcclxuICAgICAgICAgICAgdmFyIHltYXggPSB5W2cubWF4VmFyLmluZGV4XSA9IGcubWF4VmFyLnBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgIHZhciBwMiA9IGcucGFkZGluZyAvIDI7XHJcbiAgICAgICAgICAgIGcuYm91bmRzLnkgPSB5bWluIC0gcDI7XHJcbiAgICAgICAgICAgIDtcclxuICAgICAgICAgICAgZy5ib3VuZHMuWSA9IHltYXggKyBwMjtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQcm9qZWN0aW9uLnByb3RvdHlwZS5wcm9qZWN0RnVuY3Rpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHgwLCB5MCwgeCkgeyByZXR1cm4gX3RoaXMueFByb2plY3QoeDAsIHkwLCB4KTsgfSxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHgwLCB5MCwgeSkgeyByZXR1cm4gX3RoaXMueVByb2plY3QoeDAsIHkwLCB5KTsgfVxyXG4gICAgICAgIF07XHJcbiAgICB9O1xyXG4gICAgUHJvamVjdGlvbi5wcm90b3R5cGUucHJvamVjdCA9IGZ1bmN0aW9uICh4MCwgeTAsIHN0YXJ0LCBkZXNpcmVkLCBnZXREZXNpcmVkLCBjcywgZ2VuZXJhdGVDb25zdHJhaW50cywgdXBkYXRlTm9kZUJvdW5kcywgdXBkYXRlR3JvdXBCb3VuZHMpIHtcclxuICAgICAgICB0aGlzLnNldHVwVmFyaWFibGVzQW5kQm91bmRzKHgwLCB5MCwgZGVzaXJlZCwgZ2V0RGVzaXJlZCk7XHJcbiAgICAgICAgaWYgKHRoaXMucm9vdEdyb3VwICYmIHRoaXMuYXZvaWRPdmVybGFwcykge1xyXG4gICAgICAgICAgICBjb21wdXRlR3JvdXBCb3VuZHModGhpcy5yb290R3JvdXApO1xyXG4gICAgICAgICAgICBjcyA9IGNzLmNvbmNhdChnZW5lcmF0ZUNvbnN0cmFpbnRzKHRoaXMucm9vdEdyb3VwKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc29sdmUodGhpcy52YXJpYWJsZXMsIGNzLCBzdGFydCwgZGVzaXJlZCk7XHJcbiAgICAgICAgdGhpcy5ub2Rlcy5mb3JFYWNoKHVwZGF0ZU5vZGVCb3VuZHMpO1xyXG4gICAgICAgIGlmICh0aGlzLnJvb3RHcm91cCAmJiB0aGlzLmF2b2lkT3ZlcmxhcHMpIHtcclxuICAgICAgICAgICAgdGhpcy5ncm91cHMuZm9yRWFjaCh1cGRhdGVHcm91cEJvdW5kcyk7XHJcbiAgICAgICAgICAgIGNvbXB1dGVHcm91cEJvdW5kcyh0aGlzLnJvb3RHcm91cCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFByb2plY3Rpb24ucHJvdG90eXBlLnNvbHZlID0gZnVuY3Rpb24gKHZzLCBjcywgc3RhcnRpbmcsIGRlc2lyZWQpIHtcclxuICAgICAgICB2YXIgc29sdmVyID0gbmV3IHZwc2NfMS5Tb2x2ZXIodnMsIGNzKTtcclxuICAgICAgICBzb2x2ZXIuc2V0U3RhcnRpbmdQb3NpdGlvbnMoc3RhcnRpbmcpO1xyXG4gICAgICAgIHNvbHZlci5zZXREZXNpcmVkUG9zaXRpb25zKGRlc2lyZWQpO1xyXG4gICAgICAgIHNvbHZlci5zb2x2ZSgpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBQcm9qZWN0aW9uO1xyXG59KCkpO1xyXG5leHBvcnRzLlByb2plY3Rpb24gPSBQcm9qZWN0aW9uO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZWN0YW5nbGUuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvd2ViY29sYS9kaXN0L3NyYy9yZWN0YW5nbGUuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0ICogYXMgZDMgZnJvbSBcImQzXCJcblxuLyoqXG4gKiBDcmVhdGVkIGJ5IGhlbiBvbiA1LzE1LzE3LlxuICovXG5leHBvcnQgY2xhc3MgU1ZHIHtcbiAgICBzdGF0aWMgdHJhbnNsYXRlKHt4LCB5fSkge1xuICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsXCIgKyB5ICsgXCIpXCJcbiAgICB9XG5cbiAgICBzdGF0aWMgZ3JvdXAocGFyZW50LCBjbGFzc2VzLCBwb3MpIHtcbiAgICAgICAgcmV0dXJuIHBhcmVudC5hcHBlbmQoJ2cnKS5hdHRycyh7XG4gICAgICAgICAgICBjbGFzczogY2xhc3NlcyxcbiAgICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFNWRy50cmFuc2xhdGUocG9zKVxuICAgICAgICB9KVxuICAgIH1cblxufVxuXG5leHBvcnQgY2xhc3MgU1ZHTWVhc3VyZW1lbnRzIHtcblxuICAgIHByaXZhdGUgbWVhc3VyZUVsZW1lbnQ6IGQzLlNlbGVjdGlvbjxhbnksIGFueSwgYW55LCBhbnk+O1xuXG4gICAgY29uc3RydWN0b3IoYmFzZUVsZW1lbnQsIGNsYXNzZXMgPSAnJykge1xuICAgICAgICB0aGlzLm1lYXN1cmVFbGVtZW50ID0gYmFzZUVsZW1lbnQuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAgIC5hdHRycyh7eDogMCwgeTogLTIwLCBjbGFzczogY2xhc3Nlc30pXG5cbiAgICB9XG5cbiAgICB0ZXh0TGVuZ3RoKHRleHQsIHN0eWxlID0gbnVsbCkge1xuICAgICAgICB0aGlzLm1lYXN1cmVFbGVtZW50LmF0dHIoJ3N0eWxlJywgc3R5bGUpO1xuICAgICAgICB0aGlzLm1lYXN1cmVFbGVtZW50LnRleHQodGV4dCk7XG4gICAgICAgIGNvbnN0IHRsID0gKDxTVkdUZXh0RWxlbWVudD4gdGhpcy5tZWFzdXJlRWxlbWVudC5ub2RlKCkpLmdldENvbXB1dGVkVGV4dExlbmd0aCgpO1xuICAgICAgICB0aGlzLm1lYXN1cmVFbGVtZW50LnRleHQoJycpO1xuXG4gICAgICAgIHJldHVybiB0bDtcbiAgICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vdHMvZXRjL1NWR3BsdXMudHMiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgcHF1ZXVlXzEgPSByZXF1aXJlKFwiLi9wcXVldWVcIik7XHJcbnZhciBOZWlnaGJvdXIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTmVpZ2hib3VyKGlkLCBkaXN0YW5jZSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLmRpc3RhbmNlID0gZGlzdGFuY2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gTmVpZ2hib3VyO1xyXG59KCkpO1xyXG52YXIgTm9kZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBOb2RlKGlkKSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMubmVpZ2hib3VycyA9IFtdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIE5vZGU7XHJcbn0oKSk7XHJcbnZhciBRdWV1ZUVudHJ5ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFF1ZXVlRW50cnkobm9kZSwgcHJldiwgZCkge1xyXG4gICAgICAgIHRoaXMubm9kZSA9IG5vZGU7XHJcbiAgICAgICAgdGhpcy5wcmV2ID0gcHJldjtcclxuICAgICAgICB0aGlzLmQgPSBkO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFF1ZXVlRW50cnk7XHJcbn0oKSk7XHJcbnZhciBDYWxjdWxhdG9yID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIENhbGN1bGF0b3IobiwgZXMsIGdldFNvdXJjZUluZGV4LCBnZXRUYXJnZXRJbmRleCwgZ2V0TGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy5uID0gbjtcclxuICAgICAgICB0aGlzLmVzID0gZXM7XHJcbiAgICAgICAgdGhpcy5uZWlnaGJvdXJzID0gbmV3IEFycmF5KHRoaXMubik7XHJcbiAgICAgICAgdmFyIGkgPSB0aGlzLm47XHJcbiAgICAgICAgd2hpbGUgKGktLSlcclxuICAgICAgICAgICAgdGhpcy5uZWlnaGJvdXJzW2ldID0gbmV3IE5vZGUoaSk7XHJcbiAgICAgICAgaSA9IHRoaXMuZXMubGVuZ3RoO1xyXG4gICAgICAgIHdoaWxlIChpLS0pIHtcclxuICAgICAgICAgICAgdmFyIGUgPSB0aGlzLmVzW2ldO1xyXG4gICAgICAgICAgICB2YXIgdSA9IGdldFNvdXJjZUluZGV4KGUpLCB2ID0gZ2V0VGFyZ2V0SW5kZXgoZSk7XHJcbiAgICAgICAgICAgIHZhciBkID0gZ2V0TGVuZ3RoKGUpO1xyXG4gICAgICAgICAgICB0aGlzLm5laWdoYm91cnNbdV0ubmVpZ2hib3Vycy5wdXNoKG5ldyBOZWlnaGJvdXIodiwgZCkpO1xyXG4gICAgICAgICAgICB0aGlzLm5laWdoYm91cnNbdl0ubmVpZ2hib3Vycy5wdXNoKG5ldyBOZWlnaGJvdXIodSwgZCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIENhbGN1bGF0b3IucHJvdG90eXBlLkRpc3RhbmNlTWF0cml4ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBEID0gbmV3IEFycmF5KHRoaXMubik7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm47ICsraSkge1xyXG4gICAgICAgICAgICBEW2ldID0gdGhpcy5kaWprc3RyYU5laWdoYm91cnMoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBEO1xyXG4gICAgfTtcclxuICAgIENhbGN1bGF0b3IucHJvdG90eXBlLkRpc3RhbmNlc0Zyb21Ob2RlID0gZnVuY3Rpb24gKHN0YXJ0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlqa3N0cmFOZWlnaGJvdXJzKHN0YXJ0KTtcclxuICAgIH07XHJcbiAgICBDYWxjdWxhdG9yLnByb3RvdHlwZS5QYXRoRnJvbU5vZGVUb05vZGUgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpamtzdHJhTmVpZ2hib3VycyhzdGFydCwgZW5kKTtcclxuICAgIH07XHJcbiAgICBDYWxjdWxhdG9yLnByb3RvdHlwZS5QYXRoRnJvbU5vZGVUb05vZGVXaXRoUHJldkNvc3QgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCwgcHJldkNvc3QpIHtcclxuICAgICAgICB2YXIgcSA9IG5ldyBwcXVldWVfMS5Qcmlvcml0eVF1ZXVlKGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhLmQgPD0gYi5kOyB9KSwgdSA9IHRoaXMubmVpZ2hib3Vyc1tzdGFydF0sIHF1ID0gbmV3IFF1ZXVlRW50cnkodSwgbnVsbCwgMCksIHZpc2l0ZWRGcm9tID0ge307XHJcbiAgICAgICAgcS5wdXNoKHF1KTtcclxuICAgICAgICB3aGlsZSAoIXEuZW1wdHkoKSkge1xyXG4gICAgICAgICAgICBxdSA9IHEucG9wKCk7XHJcbiAgICAgICAgICAgIHUgPSBxdS5ub2RlO1xyXG4gICAgICAgICAgICBpZiAodS5pZCA9PT0gZW5kKSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgaSA9IHUubmVpZ2hib3Vycy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHdoaWxlIChpLS0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZWlnaGJvdXIgPSB1Lm5laWdoYm91cnNbaV0sIHYgPSB0aGlzLm5laWdoYm91cnNbbmVpZ2hib3VyLmlkXTtcclxuICAgICAgICAgICAgICAgIGlmIChxdS5wcmV2ICYmIHYuaWQgPT09IHF1LnByZXYubm9kZS5pZClcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHZhciB2aWR1aWQgPSB2LmlkICsgJywnICsgdS5pZDtcclxuICAgICAgICAgICAgICAgIGlmICh2aWR1aWQgaW4gdmlzaXRlZEZyb20gJiYgdmlzaXRlZEZyb21bdmlkdWlkXSA8PSBxdS5kKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNjID0gcXUucHJldiA/IHByZXZDb3N0KHF1LnByZXYubm9kZS5pZCwgdS5pZCwgdi5pZCkgOiAwLCB0ID0gcXUuZCArIG5laWdoYm91ci5kaXN0YW5jZSArIGNjO1xyXG4gICAgICAgICAgICAgICAgdmlzaXRlZEZyb21bdmlkdWlkXSA9IHQ7XHJcbiAgICAgICAgICAgICAgICBxLnB1c2gobmV3IFF1ZXVlRW50cnkodiwgcXUsIHQpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcGF0aCA9IFtdO1xyXG4gICAgICAgIHdoaWxlIChxdS5wcmV2KSB7XHJcbiAgICAgICAgICAgIHF1ID0gcXUucHJldjtcclxuICAgICAgICAgICAgcGF0aC5wdXNoKHF1Lm5vZGUuaWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgIH07XHJcbiAgICBDYWxjdWxhdG9yLnByb3RvdHlwZS5kaWprc3RyYU5laWdoYm91cnMgPSBmdW5jdGlvbiAoc3RhcnQsIGRlc3QpIHtcclxuICAgICAgICBpZiAoZGVzdCA9PT0gdm9pZCAwKSB7IGRlc3QgPSAtMTsgfVxyXG4gICAgICAgIHZhciBxID0gbmV3IHBxdWV1ZV8xLlByaW9yaXR5UXVldWUoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGEuZCA8PSBiLmQ7IH0pLCBpID0gdGhpcy5uZWlnaGJvdXJzLmxlbmd0aCwgZCA9IG5ldyBBcnJheShpKTtcclxuICAgICAgICB3aGlsZSAoaS0tKSB7XHJcbiAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5uZWlnaGJvdXJzW2ldO1xyXG4gICAgICAgICAgICBub2RlLmQgPSBpID09PSBzdGFydCA/IDAgOiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XHJcbiAgICAgICAgICAgIG5vZGUucSA9IHEucHVzaChub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2hpbGUgKCFxLmVtcHR5KCkpIHtcclxuICAgICAgICAgICAgdmFyIHUgPSBxLnBvcCgpO1xyXG4gICAgICAgICAgICBkW3UuaWRdID0gdS5kO1xyXG4gICAgICAgICAgICBpZiAodS5pZCA9PT0gZGVzdCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhdGggPSBbXTtcclxuICAgICAgICAgICAgICAgIHZhciB2ID0gdTtcclxuICAgICAgICAgICAgICAgIHdoaWxlICh0eXBlb2Ygdi5wcmV2ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhdGgucHVzaCh2LnByZXYuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHYgPSB2LnByZXY7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpID0gdS5uZWlnaGJvdXJzLmxlbmd0aDtcclxuICAgICAgICAgICAgd2hpbGUgKGktLSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5laWdoYm91ciA9IHUubmVpZ2hib3Vyc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciB2ID0gdGhpcy5uZWlnaGJvdXJzW25laWdoYm91ci5pZF07XHJcbiAgICAgICAgICAgICAgICB2YXIgdCA9IHUuZCArIG5laWdoYm91ci5kaXN0YW5jZTtcclxuICAgICAgICAgICAgICAgIGlmICh1LmQgIT09IE51bWJlci5NQVhfVkFMVUUgJiYgdi5kID4gdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHYuZCA9IHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdi5wcmV2ID0gdTtcclxuICAgICAgICAgICAgICAgICAgICBxLnJlZHVjZUtleSh2LnEsIHYsIGZ1bmN0aW9uIChlLCBxKSB7IHJldHVybiBlLnEgPSBxOyB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gQ2FsY3VsYXRvcjtcclxufSgpKTtcclxuZXhwb3J0cy5DYWxjdWxhdG9yID0gQ2FsY3VsYXRvcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2hvcnRlc3RwYXRocy5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy93ZWJjb2xhL2Rpc3Qvc3JjL3Nob3J0ZXN0cGF0aHMuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZnVuY3Rpb24gdW5pb25Db3VudChhLCBiKSB7XHJcbiAgICB2YXIgdSA9IHt9O1xyXG4gICAgZm9yICh2YXIgaSBpbiBhKVxyXG4gICAgICAgIHVbaV0gPSB7fTtcclxuICAgIGZvciAodmFyIGkgaW4gYilcclxuICAgICAgICB1W2ldID0ge307XHJcbiAgICByZXR1cm4gT2JqZWN0LmtleXModSkubGVuZ3RoO1xyXG59XHJcbmZ1bmN0aW9uIGludGVyc2VjdGlvbkNvdW50KGEsIGIpIHtcclxuICAgIHZhciBuID0gMDtcclxuICAgIGZvciAodmFyIGkgaW4gYSlcclxuICAgICAgICBpZiAodHlwZW9mIGJbaV0gIT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICArK247XHJcbiAgICByZXR1cm4gbjtcclxufVxyXG5mdW5jdGlvbiBnZXROZWlnaGJvdXJzKGxpbmtzLCBsYSkge1xyXG4gICAgdmFyIG5laWdoYm91cnMgPSB7fTtcclxuICAgIHZhciBhZGROZWlnaGJvdXJzID0gZnVuY3Rpb24gKHUsIHYpIHtcclxuICAgICAgICBpZiAodHlwZW9mIG5laWdoYm91cnNbdV0gPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICBuZWlnaGJvdXJzW3VdID0ge307XHJcbiAgICAgICAgbmVpZ2hib3Vyc1t1XVt2XSA9IHt9O1xyXG4gICAgfTtcclxuICAgIGxpbmtzLmZvckVhY2goZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2YXIgdSA9IGxhLmdldFNvdXJjZUluZGV4KGUpLCB2ID0gbGEuZ2V0VGFyZ2V0SW5kZXgoZSk7XHJcbiAgICAgICAgYWRkTmVpZ2hib3Vycyh1LCB2KTtcclxuICAgICAgICBhZGROZWlnaGJvdXJzKHYsIHUpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gbmVpZ2hib3VycztcclxufVxyXG5mdW5jdGlvbiBjb21wdXRlTGlua0xlbmd0aHMobGlua3MsIHcsIGYsIGxhKSB7XHJcbiAgICB2YXIgbmVpZ2hib3VycyA9IGdldE5laWdoYm91cnMobGlua3MsIGxhKTtcclxuICAgIGxpbmtzLmZvckVhY2goZnVuY3Rpb24gKGwpIHtcclxuICAgICAgICB2YXIgYSA9IG5laWdoYm91cnNbbGEuZ2V0U291cmNlSW5kZXgobCldO1xyXG4gICAgICAgIHZhciBiID0gbmVpZ2hib3Vyc1tsYS5nZXRUYXJnZXRJbmRleChsKV07XHJcbiAgICAgICAgbGEuc2V0TGVuZ3RoKGwsIDEgKyB3ICogZihhLCBiKSk7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBzeW1tZXRyaWNEaWZmTGlua0xlbmd0aHMobGlua3MsIGxhLCB3KSB7XHJcbiAgICBpZiAodyA9PT0gdm9pZCAwKSB7IHcgPSAxOyB9XHJcbiAgICBjb21wdXRlTGlua0xlbmd0aHMobGlua3MsIHcsIGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBNYXRoLnNxcnQodW5pb25Db3VudChhLCBiKSAtIGludGVyc2VjdGlvbkNvdW50KGEsIGIpKTsgfSwgbGEpO1xyXG59XHJcbmV4cG9ydHMuc3ltbWV0cmljRGlmZkxpbmtMZW5ndGhzID0gc3ltbWV0cmljRGlmZkxpbmtMZW5ndGhzO1xyXG5mdW5jdGlvbiBqYWNjYXJkTGlua0xlbmd0aHMobGlua3MsIGxhLCB3KSB7XHJcbiAgICBpZiAodyA9PT0gdm9pZCAwKSB7IHcgPSAxOyB9XHJcbiAgICBjb21wdXRlTGlua0xlbmd0aHMobGlua3MsIHcsIGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKE9iamVjdC5rZXlzKGEpLmxlbmd0aCwgT2JqZWN0LmtleXMoYikubGVuZ3RoKSA8IDEuMSA/IDAgOiBpbnRlcnNlY3Rpb25Db3VudChhLCBiKSAvIHVuaW9uQ291bnQoYSwgYik7XHJcbiAgICB9LCBsYSk7XHJcbn1cclxuZXhwb3J0cy5qYWNjYXJkTGlua0xlbmd0aHMgPSBqYWNjYXJkTGlua0xlbmd0aHM7XHJcbmZ1bmN0aW9uIGdlbmVyYXRlRGlyZWN0ZWRFZGdlQ29uc3RyYWludHMobiwgbGlua3MsIGF4aXMsIGxhKSB7XHJcbiAgICB2YXIgY29tcG9uZW50cyA9IHN0cm9uZ2x5Q29ubmVjdGVkQ29tcG9uZW50cyhuLCBsaW5rcywgbGEpO1xyXG4gICAgdmFyIG5vZGVzID0ge307XHJcbiAgICBjb21wb25lbnRzLmZvckVhY2goZnVuY3Rpb24gKGMsIGkpIHtcclxuICAgICAgICByZXR1cm4gYy5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7IHJldHVybiBub2Rlc1t2XSA9IGk7IH0pO1xyXG4gICAgfSk7XHJcbiAgICB2YXIgY29uc3RyYWludHMgPSBbXTtcclxuICAgIGxpbmtzLmZvckVhY2goZnVuY3Rpb24gKGwpIHtcclxuICAgICAgICB2YXIgdWkgPSBsYS5nZXRTb3VyY2VJbmRleChsKSwgdmkgPSBsYS5nZXRUYXJnZXRJbmRleChsKSwgdSA9IG5vZGVzW3VpXSwgdiA9IG5vZGVzW3ZpXTtcclxuICAgICAgICBpZiAodSAhPT0gdikge1xyXG4gICAgICAgICAgICBjb25zdHJhaW50cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGF4aXM6IGF4aXMsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiB1aSxcclxuICAgICAgICAgICAgICAgIHJpZ2h0OiB2aSxcclxuICAgICAgICAgICAgICAgIGdhcDogbGEuZ2V0TWluU2VwYXJhdGlvbihsKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBjb25zdHJhaW50cztcclxufVxyXG5leHBvcnRzLmdlbmVyYXRlRGlyZWN0ZWRFZGdlQ29uc3RyYWludHMgPSBnZW5lcmF0ZURpcmVjdGVkRWRnZUNvbnN0cmFpbnRzO1xyXG5mdW5jdGlvbiBzdHJvbmdseUNvbm5lY3RlZENvbXBvbmVudHMobnVtVmVydGljZXMsIGVkZ2VzLCBsYSkge1xyXG4gICAgdmFyIG5vZGVzID0gW107XHJcbiAgICB2YXIgaW5kZXggPSAwO1xyXG4gICAgdmFyIHN0YWNrID0gW107XHJcbiAgICB2YXIgY29tcG9uZW50cyA9IFtdO1xyXG4gICAgZnVuY3Rpb24gc3Ryb25nQ29ubmVjdCh2KSB7XHJcbiAgICAgICAgdi5pbmRleCA9IHYubG93bGluayA9IGluZGV4Kys7XHJcbiAgICAgICAgc3RhY2sucHVzaCh2KTtcclxuICAgICAgICB2Lm9uU3RhY2sgPSB0cnVlO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB2Lm91dDsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgdmFyIHcgPSBfYVtfaV07XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygdy5pbmRleCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHN0cm9uZ0Nvbm5lY3Qodyk7XHJcbiAgICAgICAgICAgICAgICB2Lmxvd2xpbmsgPSBNYXRoLm1pbih2Lmxvd2xpbmssIHcubG93bGluayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAody5vblN0YWNrKSB7XHJcbiAgICAgICAgICAgICAgICB2Lmxvd2xpbmsgPSBNYXRoLm1pbih2Lmxvd2xpbmssIHcuaW5kZXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2Lmxvd2xpbmsgPT09IHYuaW5kZXgpIHtcclxuICAgICAgICAgICAgdmFyIGNvbXBvbmVudCA9IFtdO1xyXG4gICAgICAgICAgICB3aGlsZSAoc3RhY2subGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB3ID0gc3RhY2sucG9wKCk7XHJcbiAgICAgICAgICAgICAgICB3Lm9uU3RhY2sgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5wdXNoKHcpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHcgPT09IHYpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudC5tYXAoZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHYuaWQ7IH0pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bVZlcnRpY2VzOyBpKyspIHtcclxuICAgICAgICBub2Rlcy5wdXNoKHsgaWQ6IGksIG91dDogW10gfSk7XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBfaSA9IDAsIGVkZ2VzXzEgPSBlZGdlczsgX2kgPCBlZGdlc18xLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgIHZhciBlID0gZWRnZXNfMVtfaV07XHJcbiAgICAgICAgdmFyIHZfMSA9IG5vZGVzW2xhLmdldFNvdXJjZUluZGV4KGUpXSwgdyA9IG5vZGVzW2xhLmdldFRhcmdldEluZGV4KGUpXTtcclxuICAgICAgICB2XzEub3V0LnB1c2godyk7XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBfYSA9IDAsIG5vZGVzXzEgPSBub2RlczsgX2EgPCBub2Rlc18xLmxlbmd0aDsgX2ErKykge1xyXG4gICAgICAgIHZhciB2ID0gbm9kZXNfMVtfYV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2LmluZGV4ID09PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgc3Ryb25nQ29ubmVjdCh2KTtcclxuICAgIH1cclxuICAgIHJldHVybiBjb21wb25lbnRzO1xyXG59XHJcbmV4cG9ydHMuc3Ryb25nbHlDb25uZWN0ZWRDb21wb25lbnRzID0gc3Ryb25nbHlDb25uZWN0ZWRDb21wb25lbnRzO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1saW5rbGVuZ3Rocy5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy93ZWJjb2xhL2Rpc3Qvc3JjL2xpbmtsZW5ndGhzLmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBMb2NrcyA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBMb2NrcygpIHtcclxuICAgICAgICB0aGlzLmxvY2tzID0ge307XHJcbiAgICB9XHJcbiAgICBMb2Nrcy5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGlkLCB4KSB7XHJcbiAgICAgICAgdGhpcy5sb2Nrc1tpZF0gPSB4O1xyXG4gICAgfTtcclxuICAgIExvY2tzLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmxvY2tzID0ge307XHJcbiAgICB9O1xyXG4gICAgTG9ja3MucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZm9yICh2YXIgbCBpbiB0aGlzLmxvY2tzKVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9O1xyXG4gICAgTG9ja3MucHJvdG90eXBlLmFwcGx5ID0gZnVuY3Rpb24gKGYpIHtcclxuICAgICAgICBmb3IgKHZhciBsIGluIHRoaXMubG9ja3MpIHtcclxuICAgICAgICAgICAgZihOdW1iZXIobCksIHRoaXMubG9ja3NbbF0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gTG9ja3M7XHJcbn0oKSk7XHJcbmV4cG9ydHMuTG9ja3MgPSBMb2NrcztcclxudmFyIERlc2NlbnQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gRGVzY2VudCh4LCBELCBHKSB7XHJcbiAgICAgICAgaWYgKEcgPT09IHZvaWQgMCkgeyBHID0gbnVsbDsgfVxyXG4gICAgICAgIHRoaXMuRCA9IEQ7XHJcbiAgICAgICAgdGhpcy5HID0gRztcclxuICAgICAgICB0aGlzLnRocmVzaG9sZCA9IDAuMDAwMTtcclxuICAgICAgICB0aGlzLm51bUdyaWRTbmFwTm9kZXMgPSAwO1xyXG4gICAgICAgIHRoaXMuc25hcEdyaWRTaXplID0gMTAwO1xyXG4gICAgICAgIHRoaXMuc25hcFN0cmVuZ3RoID0gMTAwMDtcclxuICAgICAgICB0aGlzLnNjYWxlU25hcEJ5TWF4SCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmFuZG9tID0gbmV3IFBzZXVkb1JhbmRvbSgpO1xyXG4gICAgICAgIHRoaXMucHJvamVjdCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLmsgPSB4Lmxlbmd0aDtcclxuICAgICAgICB2YXIgbiA9IHRoaXMubiA9IHhbMF0ubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMuSCA9IG5ldyBBcnJheSh0aGlzLmspO1xyXG4gICAgICAgIHRoaXMuZyA9IG5ldyBBcnJheSh0aGlzLmspO1xyXG4gICAgICAgIHRoaXMuSGQgPSBuZXcgQXJyYXkodGhpcy5rKTtcclxuICAgICAgICB0aGlzLmEgPSBuZXcgQXJyYXkodGhpcy5rKTtcclxuICAgICAgICB0aGlzLmIgPSBuZXcgQXJyYXkodGhpcy5rKTtcclxuICAgICAgICB0aGlzLmMgPSBuZXcgQXJyYXkodGhpcy5rKTtcclxuICAgICAgICB0aGlzLmQgPSBuZXcgQXJyYXkodGhpcy5rKTtcclxuICAgICAgICB0aGlzLmUgPSBuZXcgQXJyYXkodGhpcy5rKTtcclxuICAgICAgICB0aGlzLmlhID0gbmV3IEFycmF5KHRoaXMuayk7XHJcbiAgICAgICAgdGhpcy5pYiA9IG5ldyBBcnJheSh0aGlzLmspO1xyXG4gICAgICAgIHRoaXMueHRtcCA9IG5ldyBBcnJheSh0aGlzLmspO1xyXG4gICAgICAgIHRoaXMubG9ja3MgPSBuZXcgTG9ja3MoKTtcclxuICAgICAgICB0aGlzLm1pbkQgPSBOdW1iZXIuTUFYX1ZBTFVFO1xyXG4gICAgICAgIHZhciBpID0gbiwgajtcclxuICAgICAgICB3aGlsZSAoaS0tKSB7XHJcbiAgICAgICAgICAgIGogPSBuO1xyXG4gICAgICAgICAgICB3aGlsZSAoLS1qID4gaSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGQgPSBEW2ldW2pdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGQgPiAwICYmIGQgPCB0aGlzLm1pbkQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1pbkQgPSBkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm1pbkQgPT09IE51bWJlci5NQVhfVkFMVUUpXHJcbiAgICAgICAgICAgIHRoaXMubWluRCA9IDE7XHJcbiAgICAgICAgaSA9IHRoaXMuaztcclxuICAgICAgICB3aGlsZSAoaS0tKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ1tpXSA9IG5ldyBBcnJheShuKTtcclxuICAgICAgICAgICAgdGhpcy5IW2ldID0gbmV3IEFycmF5KG4pO1xyXG4gICAgICAgICAgICBqID0gbjtcclxuICAgICAgICAgICAgd2hpbGUgKGotLSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5IW2ldW2pdID0gbmV3IEFycmF5KG4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuSGRbaV0gPSBuZXcgQXJyYXkobik7XHJcbiAgICAgICAgICAgIHRoaXMuYVtpXSA9IG5ldyBBcnJheShuKTtcclxuICAgICAgICAgICAgdGhpcy5iW2ldID0gbmV3IEFycmF5KG4pO1xyXG4gICAgICAgICAgICB0aGlzLmNbaV0gPSBuZXcgQXJyYXkobik7XHJcbiAgICAgICAgICAgIHRoaXMuZFtpXSA9IG5ldyBBcnJheShuKTtcclxuICAgICAgICAgICAgdGhpcy5lW2ldID0gbmV3IEFycmF5KG4pO1xyXG4gICAgICAgICAgICB0aGlzLmlhW2ldID0gbmV3IEFycmF5KG4pO1xyXG4gICAgICAgICAgICB0aGlzLmliW2ldID0gbmV3IEFycmF5KG4pO1xyXG4gICAgICAgICAgICB0aGlzLnh0bXBbaV0gPSBuZXcgQXJyYXkobik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgRGVzY2VudC5jcmVhdGVTcXVhcmVNYXRyaXggPSBmdW5jdGlvbiAobiwgZikge1xyXG4gICAgICAgIHZhciBNID0gbmV3IEFycmF5KG4pO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgKytpKSB7XHJcbiAgICAgICAgICAgIE1baV0gPSBuZXcgQXJyYXkobik7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbjsgKytqKSB7XHJcbiAgICAgICAgICAgICAgICBNW2ldW2pdID0gZihpLCBqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gTTtcclxuICAgIH07XHJcbiAgICBEZXNjZW50LnByb3RvdHlwZS5vZmZzZXREaXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgdSA9IG5ldyBBcnJheSh0aGlzLmspO1xyXG4gICAgICAgIHZhciBsID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuazsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhciB4ID0gdVtpXSA9IHRoaXMucmFuZG9tLmdldE5leHRCZXR3ZWVuKDAuMDEsIDEpIC0gMC41O1xyXG4gICAgICAgICAgICBsICs9IHggKiB4O1xyXG4gICAgICAgIH1cclxuICAgICAgICBsID0gTWF0aC5zcXJ0KGwpO1xyXG4gICAgICAgIHJldHVybiB1Lm1hcChmdW5jdGlvbiAoeCkgeyByZXR1cm4geCAqPSBfdGhpcy5taW5EIC8gbDsgfSk7XHJcbiAgICB9O1xyXG4gICAgRGVzY2VudC5wcm90b3R5cGUuY29tcHV0ZURlcml2YXRpdmVzID0gZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBuID0gdGhpcy5uO1xyXG4gICAgICAgIGlmIChuIDwgMSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHZhciBpO1xyXG4gICAgICAgIHZhciBkID0gbmV3IEFycmF5KHRoaXMuayk7XHJcbiAgICAgICAgdmFyIGQyID0gbmV3IEFycmF5KHRoaXMuayk7XHJcbiAgICAgICAgdmFyIEh1dSA9IG5ldyBBcnJheSh0aGlzLmspO1xyXG4gICAgICAgIHZhciBtYXhIID0gMDtcclxuICAgICAgICBmb3IgKHZhciB1ID0gMDsgdSA8IG47ICsrdSkge1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5rOyArK2kpXHJcbiAgICAgICAgICAgICAgICBIdXVbaV0gPSB0aGlzLmdbaV1bdV0gPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciB2ID0gMDsgdiA8IG47ICsrdikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHUgPT09IHYpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWF4RGlzcGxhY2VzID0gbjtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChtYXhEaXNwbGFjZXMtLSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzZDIgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLms7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZHggPSBkW2ldID0geFtpXVt1XSAtIHhbaV1bdl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNkMiArPSBkMltpXSA9IGR4ICogZHg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZDIgPiAxZS05KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmQgPSB0aGlzLm9mZnNldERpcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLms7ICsraSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgeFtpXVt2XSArPSByZFtpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBsID0gTWF0aC5zcXJ0KHNkMik7XHJcbiAgICAgICAgICAgICAgICB2YXIgRCA9IHRoaXMuRFt1XVt2XTtcclxuICAgICAgICAgICAgICAgIHZhciB3ZWlnaHQgPSB0aGlzLkcgIT0gbnVsbCA/IHRoaXMuR1t1XVt2XSA6IDE7XHJcbiAgICAgICAgICAgICAgICBpZiAod2VpZ2h0ID4gMSAmJiBsID4gRCB8fCAhaXNGaW5pdGUoRCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5rOyArK2kpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuSFtpXVt1XVt2XSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAod2VpZ2h0ID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdlaWdodCA9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgRDIgPSBEICogRDtcclxuICAgICAgICAgICAgICAgIHZhciBncyA9IDIgKiB3ZWlnaHQgKiAobCAtIEQpIC8gKEQyICogbCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbDMgPSBsICogbCAqIGw7XHJcbiAgICAgICAgICAgICAgICB2YXIgaHMgPSAyICogLXdlaWdodCAvIChEMiAqIGwzKTtcclxuICAgICAgICAgICAgICAgIGlmICghaXNGaW5pdGUoZ3MpKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGdzKTtcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLms7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ1tpXVt1XSArPSBkW2ldICogZ3M7XHJcbiAgICAgICAgICAgICAgICAgICAgSHV1W2ldIC09IHRoaXMuSFtpXVt1XVt2XSA9IGhzICogKGwzICsgRCAqIChkMltpXSAtIHNkMikgKyBsICogc2QyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5rOyArK2kpXHJcbiAgICAgICAgICAgICAgICBtYXhIID0gTWF0aC5tYXgobWF4SCwgdGhpcy5IW2ldW3VdW3VdID0gSHV1W2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHIgPSB0aGlzLnNuYXBHcmlkU2l6ZSAvIDI7XHJcbiAgICAgICAgdmFyIGcgPSB0aGlzLnNuYXBHcmlkU2l6ZTtcclxuICAgICAgICB2YXIgdyA9IHRoaXMuc25hcFN0cmVuZ3RoO1xyXG4gICAgICAgIHZhciBrID0gdyAvIChyICogcik7XHJcbiAgICAgICAgdmFyIG51bU5vZGVzID0gdGhpcy5udW1HcmlkU25hcE5vZGVzO1xyXG4gICAgICAgIGZvciAodmFyIHUgPSAwOyB1IDwgbnVtTm9kZXM7ICsrdSkge1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5rOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIHZhciB4aXUgPSB0aGlzLnhbaV1bdV07XHJcbiAgICAgICAgICAgICAgICB2YXIgbSA9IHhpdSAvIGc7XHJcbiAgICAgICAgICAgICAgICB2YXIgZiA9IG0gJSAxO1xyXG4gICAgICAgICAgICAgICAgdmFyIHEgPSBtIC0gZjtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gTWF0aC5hYnMoZik7XHJcbiAgICAgICAgICAgICAgICB2YXIgZHggPSAoYSA8PSAwLjUpID8geGl1IC0gcSAqIGcgOlxyXG4gICAgICAgICAgICAgICAgICAgICh4aXUgPiAwKSA/IHhpdSAtIChxICsgMSkgKiBnIDogeGl1IC0gKHEgLSAxKSAqIGc7XHJcbiAgICAgICAgICAgICAgICBpZiAoLXIgPCBkeCAmJiBkeCA8PSByKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2NhbGVTbmFwQnlNYXhIKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ1tpXVt1XSArPSBtYXhIICogayAqIGR4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkhbaV1bdV1bdV0gKz0gbWF4SCAqIGs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdbaV1bdV0gKz0gayAqIGR4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkhbaV1bdV1bdV0gKz0gaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLmxvY2tzLmlzRW1wdHkoKSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvY2tzLmFwcGx5KGZ1bmN0aW9uICh1LCBwKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgX3RoaXMuazsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuSFtpXVt1XVt1XSArPSBtYXhIO1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmdbaV1bdV0gLT0gbWF4SCAqIChwW2ldIC0geFtpXVt1XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBEZXNjZW50LmRvdFByb2QgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHZhciB4ID0gMCwgaSA9IGEubGVuZ3RoO1xyXG4gICAgICAgIHdoaWxlIChpLS0pXHJcbiAgICAgICAgICAgIHggKz0gYVtpXSAqIGJbaV07XHJcbiAgICAgICAgcmV0dXJuIHg7XHJcbiAgICB9O1xyXG4gICAgRGVzY2VudC5yaWdodE11bHRpcGx5ID0gZnVuY3Rpb24gKG0sIHYsIHIpIHtcclxuICAgICAgICB2YXIgaSA9IG0ubGVuZ3RoO1xyXG4gICAgICAgIHdoaWxlIChpLS0pXHJcbiAgICAgICAgICAgIHJbaV0gPSBEZXNjZW50LmRvdFByb2QobVtpXSwgdik7XHJcbiAgICB9O1xyXG4gICAgRGVzY2VudC5wcm90b3R5cGUuY29tcHV0ZVN0ZXBTaXplID0gZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICB2YXIgbnVtZXJhdG9yID0gMCwgZGVub21pbmF0b3IgPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5rOyArK2kpIHtcclxuICAgICAgICAgICAgbnVtZXJhdG9yICs9IERlc2NlbnQuZG90UHJvZCh0aGlzLmdbaV0sIGRbaV0pO1xyXG4gICAgICAgICAgICBEZXNjZW50LnJpZ2h0TXVsdGlwbHkodGhpcy5IW2ldLCBkW2ldLCB0aGlzLkhkW2ldKTtcclxuICAgICAgICAgICAgZGVub21pbmF0b3IgKz0gRGVzY2VudC5kb3RQcm9kKGRbaV0sIHRoaXMuSGRbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGVub21pbmF0b3IgPT09IDAgfHwgIWlzRmluaXRlKGRlbm9taW5hdG9yKSlcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgcmV0dXJuIDEgKiBudW1lcmF0b3IgLyBkZW5vbWluYXRvcjtcclxuICAgIH07XHJcbiAgICBEZXNjZW50LnByb3RvdHlwZS5yZWR1Y2VTdHJlc3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jb21wdXRlRGVyaXZhdGl2ZXModGhpcy54KTtcclxuICAgICAgICB2YXIgYWxwaGEgPSB0aGlzLmNvbXB1dGVTdGVwU2l6ZSh0aGlzLmcpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5rOyArK2kpIHtcclxuICAgICAgICAgICAgdGhpcy50YWtlRGVzY2VudFN0ZXAodGhpcy54W2ldLCB0aGlzLmdbaV0sIGFscGhhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcHV0ZVN0cmVzcygpO1xyXG4gICAgfTtcclxuICAgIERlc2NlbnQuY29weSA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgdmFyIG0gPSBhLmxlbmd0aCwgbiA9IGJbMF0ubGVuZ3RoO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbTsgKytpKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbjsgKytqKSB7XHJcbiAgICAgICAgICAgICAgICBiW2ldW2pdID0gYVtpXVtqXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBEZXNjZW50LnByb3RvdHlwZS5zdGVwQW5kUHJvamVjdCA9IGZ1bmN0aW9uICh4MCwgciwgZCwgc3RlcFNpemUpIHtcclxuICAgICAgICBEZXNjZW50LmNvcHkoeDAsIHIpO1xyXG4gICAgICAgIHRoaXMudGFrZURlc2NlbnRTdGVwKHJbMF0sIGRbMF0sIHN0ZXBTaXplKTtcclxuICAgICAgICBpZiAodGhpcy5wcm9qZWN0KVxyXG4gICAgICAgICAgICB0aGlzLnByb2plY3RbMF0oeDBbMF0sIHgwWzFdLCByWzBdKTtcclxuICAgICAgICB0aGlzLnRha2VEZXNjZW50U3RlcChyWzFdLCBkWzFdLCBzdGVwU2l6ZSk7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvamVjdClcclxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0WzFdKHJbMF0sIHgwWzFdLCByWzFdKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMjsgaSA8IHRoaXMuazsgaSsrKVxyXG4gICAgICAgICAgICB0aGlzLnRha2VEZXNjZW50U3RlcChyW2ldLCBkW2ldLCBzdGVwU2l6ZSk7XHJcbiAgICB9O1xyXG4gICAgRGVzY2VudC5tQXBwbHkgPSBmdW5jdGlvbiAobSwgbiwgZikge1xyXG4gICAgICAgIHZhciBpID0gbTtcclxuICAgICAgICB3aGlsZSAoaS0tID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgaiA9IG47XHJcbiAgICAgICAgICAgIHdoaWxlIChqLS0gPiAwKVxyXG4gICAgICAgICAgICAgICAgZihpLCBqKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgRGVzY2VudC5wcm90b3R5cGUubWF0cml4QXBwbHkgPSBmdW5jdGlvbiAoZikge1xyXG4gICAgICAgIERlc2NlbnQubUFwcGx5KHRoaXMuaywgdGhpcy5uLCBmKTtcclxuICAgIH07XHJcbiAgICBEZXNjZW50LnByb3RvdHlwZS5jb21wdXRlTmV4dFBvc2l0aW9uID0gZnVuY3Rpb24gKHgwLCByKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmNvbXB1dGVEZXJpdmF0aXZlcyh4MCk7XHJcbiAgICAgICAgdmFyIGFscGhhID0gdGhpcy5jb21wdXRlU3RlcFNpemUodGhpcy5nKTtcclxuICAgICAgICB0aGlzLnN0ZXBBbmRQcm9qZWN0KHgwLCByLCB0aGlzLmcsIGFscGhhKTtcclxuICAgICAgICBpZiAodGhpcy5wcm9qZWN0KSB7XHJcbiAgICAgICAgICAgIHRoaXMubWF0cml4QXBwbHkoZnVuY3Rpb24gKGksIGopIHsgcmV0dXJuIF90aGlzLmVbaV1bal0gPSB4MFtpXVtqXSAtIHJbaV1bal07IH0pO1xyXG4gICAgICAgICAgICB2YXIgYmV0YSA9IHRoaXMuY29tcHV0ZVN0ZXBTaXplKHRoaXMuZSk7XHJcbiAgICAgICAgICAgIGJldGEgPSBNYXRoLm1heCgwLjIsIE1hdGgubWluKGJldGEsIDEpKTtcclxuICAgICAgICAgICAgdGhpcy5zdGVwQW5kUHJvamVjdCh4MCwgciwgdGhpcy5lLCBiZXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgRGVzY2VudC5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKGl0ZXJhdGlvbnMpIHtcclxuICAgICAgICB2YXIgc3RyZXNzID0gTnVtYmVyLk1BWF9WQUxVRSwgY29udmVyZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgd2hpbGUgKCFjb252ZXJnZWQgJiYgaXRlcmF0aW9ucy0tID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgcyA9IHRoaXMucnVuZ2VLdXR0YSgpO1xyXG4gICAgICAgICAgICBjb252ZXJnZWQgPSBNYXRoLmFicyhzdHJlc3MgLyBzIC0gMSkgPCB0aGlzLnRocmVzaG9sZDtcclxuICAgICAgICAgICAgc3RyZXNzID0gcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0cmVzcztcclxuICAgIH07XHJcbiAgICBEZXNjZW50LnByb3RvdHlwZS5ydW5nZUt1dHRhID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5jb21wdXRlTmV4dFBvc2l0aW9uKHRoaXMueCwgdGhpcy5hKTtcclxuICAgICAgICBEZXNjZW50Lm1pZCh0aGlzLngsIHRoaXMuYSwgdGhpcy5pYSk7XHJcbiAgICAgICAgdGhpcy5jb21wdXRlTmV4dFBvc2l0aW9uKHRoaXMuaWEsIHRoaXMuYik7XHJcbiAgICAgICAgRGVzY2VudC5taWQodGhpcy54LCB0aGlzLmIsIHRoaXMuaWIpO1xyXG4gICAgICAgIHRoaXMuY29tcHV0ZU5leHRQb3NpdGlvbih0aGlzLmliLCB0aGlzLmMpO1xyXG4gICAgICAgIHRoaXMuY29tcHV0ZU5leHRQb3NpdGlvbih0aGlzLmMsIHRoaXMuZCk7XHJcbiAgICAgICAgdmFyIGRpc3AgPSAwO1xyXG4gICAgICAgIHRoaXMubWF0cml4QXBwbHkoZnVuY3Rpb24gKGksIGopIHtcclxuICAgICAgICAgICAgdmFyIHggPSAoX3RoaXMuYVtpXVtqXSArIDIuMCAqIF90aGlzLmJbaV1bal0gKyAyLjAgKiBfdGhpcy5jW2ldW2pdICsgX3RoaXMuZFtpXVtqXSkgLyA2LjAsIGQgPSBfdGhpcy54W2ldW2pdIC0geDtcclxuICAgICAgICAgICAgZGlzcCArPSBkICogZDtcclxuICAgICAgICAgICAgX3RoaXMueFtpXVtqXSA9IHg7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGRpc3A7XHJcbiAgICB9O1xyXG4gICAgRGVzY2VudC5taWQgPSBmdW5jdGlvbiAoYSwgYiwgbSkge1xyXG4gICAgICAgIERlc2NlbnQubUFwcGx5KGEubGVuZ3RoLCBhWzBdLmxlbmd0aCwgZnVuY3Rpb24gKGksIGopIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1baV1bal0gPSBhW2ldW2pdICsgKGJbaV1bal0gLSBhW2ldW2pdKSAvIDIuMDtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBEZXNjZW50LnByb3RvdHlwZS50YWtlRGVzY2VudFN0ZXAgPSBmdW5jdGlvbiAoeCwgZCwgc3RlcFNpemUpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubjsgKytpKSB7XHJcbiAgICAgICAgICAgIHhbaV0gPSB4W2ldIC0gc3RlcFNpemUgKiBkW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBEZXNjZW50LnByb3RvdHlwZS5jb21wdXRlU3RyZXNzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzdHJlc3MgPSAwO1xyXG4gICAgICAgIGZvciAodmFyIHUgPSAwLCBuTWludXMxID0gdGhpcy5uIC0gMTsgdSA8IG5NaW51czE7ICsrdSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB2ID0gdSArIDEsIG4gPSB0aGlzLm47IHYgPCBuOyArK3YpIHtcclxuICAgICAgICAgICAgICAgIHZhciBsID0gMDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5rOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZHggPSB0aGlzLnhbaV1bdV0gLSB0aGlzLnhbaV1bdl07XHJcbiAgICAgICAgICAgICAgICAgICAgbCArPSBkeCAqIGR4O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbCA9IE1hdGguc3FydChsKTtcclxuICAgICAgICAgICAgICAgIHZhciBkID0gdGhpcy5EW3VdW3ZdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpc0Zpbml0ZShkKSlcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHZhciBybCA9IGQgLSBsO1xyXG4gICAgICAgICAgICAgICAgdmFyIGQyID0gZCAqIGQ7XHJcbiAgICAgICAgICAgICAgICBzdHJlc3MgKz0gcmwgKiBybCAvIGQyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdHJlc3M7XHJcbiAgICB9O1xyXG4gICAgRGVzY2VudC56ZXJvRGlzdGFuY2UgPSAxZS0xMDtcclxuICAgIHJldHVybiBEZXNjZW50O1xyXG59KCkpO1xyXG5leHBvcnRzLkRlc2NlbnQgPSBEZXNjZW50O1xyXG52YXIgUHNldWRvUmFuZG9tID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFBzZXVkb1JhbmRvbShzZWVkKSB7XHJcbiAgICAgICAgaWYgKHNlZWQgPT09IHZvaWQgMCkgeyBzZWVkID0gMTsgfVxyXG4gICAgICAgIHRoaXMuc2VlZCA9IHNlZWQ7XHJcbiAgICAgICAgdGhpcy5hID0gMjE0MDEzO1xyXG4gICAgICAgIHRoaXMuYyA9IDI1MzEwMTE7XHJcbiAgICAgICAgdGhpcy5tID0gMjE0NzQ4MzY0ODtcclxuICAgICAgICB0aGlzLnJhbmdlID0gMzI3Njc7XHJcbiAgICB9XHJcbiAgICBQc2V1ZG9SYW5kb20ucHJvdG90eXBlLmdldE5leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5zZWVkID0gKHRoaXMuc2VlZCAqIHRoaXMuYSArIHRoaXMuYykgJSB0aGlzLm07XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLnNlZWQgPj4gMTYpIC8gdGhpcy5yYW5nZTtcclxuICAgIH07XHJcbiAgICBQc2V1ZG9SYW5kb20ucHJvdG90eXBlLmdldE5leHRCZXR3ZWVuID0gZnVuY3Rpb24gKG1pbiwgbWF4KSB7XHJcbiAgICAgICAgcmV0dXJuIG1pbiArIHRoaXMuZ2V0TmV4dCgpICogKG1heCAtIG1pbik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFBzZXVkb1JhbmRvbTtcclxufSgpKTtcclxuZXhwb3J0cy5Qc2V1ZG9SYW5kb20gPSBQc2V1ZG9SYW5kb207XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlc2NlbnQuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvd2ViY29sYS9kaXN0L3NyYy9kZXNjZW50LmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBQb3NpdGlvblN0YXRzID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFBvc2l0aW9uU3RhdHMoc2NhbGUpIHtcclxuICAgICAgICB0aGlzLnNjYWxlID0gc2NhbGU7XHJcbiAgICAgICAgdGhpcy5BQiA9IDA7XHJcbiAgICAgICAgdGhpcy5BRCA9IDA7XHJcbiAgICAgICAgdGhpcy5BMiA9IDA7XHJcbiAgICB9XHJcbiAgICBQb3NpdGlvblN0YXRzLnByb3RvdHlwZS5hZGRWYXJpYWJsZSA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgdmFyIGFpID0gdGhpcy5zY2FsZSAvIHYuc2NhbGU7XHJcbiAgICAgICAgdmFyIGJpID0gdi5vZmZzZXQgLyB2LnNjYWxlO1xyXG4gICAgICAgIHZhciB3aSA9IHYud2VpZ2h0O1xyXG4gICAgICAgIHRoaXMuQUIgKz0gd2kgKiBhaSAqIGJpO1xyXG4gICAgICAgIHRoaXMuQUQgKz0gd2kgKiBhaSAqIHYuZGVzaXJlZFBvc2l0aW9uO1xyXG4gICAgICAgIHRoaXMuQTIgKz0gd2kgKiBhaSAqIGFpO1xyXG4gICAgfTtcclxuICAgIFBvc2l0aW9uU3RhdHMucHJvdG90eXBlLmdldFBvc24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLkFEIC0gdGhpcy5BQikgLyB0aGlzLkEyO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBQb3NpdGlvblN0YXRzO1xyXG59KCkpO1xyXG5leHBvcnRzLlBvc2l0aW9uU3RhdHMgPSBQb3NpdGlvblN0YXRzO1xyXG52YXIgQ29uc3RyYWludCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBDb25zdHJhaW50KGxlZnQsIHJpZ2h0LCBnYXAsIGVxdWFsaXR5KSB7XHJcbiAgICAgICAgaWYgKGVxdWFsaXR5ID09PSB2b2lkIDApIHsgZXF1YWxpdHkgPSBmYWxzZTsgfVxyXG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XHJcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xyXG4gICAgICAgIHRoaXMuZ2FwID0gZ2FwO1xyXG4gICAgICAgIHRoaXMuZXF1YWxpdHkgPSBlcXVhbGl0eTtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudW5zYXRpc2ZpYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XHJcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xyXG4gICAgICAgIHRoaXMuZ2FwID0gZ2FwO1xyXG4gICAgICAgIHRoaXMuZXF1YWxpdHkgPSBlcXVhbGl0eTtcclxuICAgIH1cclxuICAgIENvbnN0cmFpbnQucHJvdG90eXBlLnNsYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVuc2F0aXNmaWFibGUgPyBOdW1iZXIuTUFYX1ZBTFVFXHJcbiAgICAgICAgICAgIDogdGhpcy5yaWdodC5zY2FsZSAqIHRoaXMucmlnaHQucG9zaXRpb24oKSAtIHRoaXMuZ2FwXHJcbiAgICAgICAgICAgICAgICAtIHRoaXMubGVmdC5zY2FsZSAqIHRoaXMubGVmdC5wb3NpdGlvbigpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBDb25zdHJhaW50O1xyXG59KCkpO1xyXG5leHBvcnRzLkNvbnN0cmFpbnQgPSBDb25zdHJhaW50O1xyXG52YXIgVmFyaWFibGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gVmFyaWFibGUoZGVzaXJlZFBvc2l0aW9uLCB3ZWlnaHQsIHNjYWxlKSB7XHJcbiAgICAgICAgaWYgKHdlaWdodCA9PT0gdm9pZCAwKSB7IHdlaWdodCA9IDE7IH1cclxuICAgICAgICBpZiAoc2NhbGUgPT09IHZvaWQgMCkgeyBzY2FsZSA9IDE7IH1cclxuICAgICAgICB0aGlzLmRlc2lyZWRQb3NpdGlvbiA9IGRlc2lyZWRQb3NpdGlvbjtcclxuICAgICAgICB0aGlzLndlaWdodCA9IHdlaWdodDtcclxuICAgICAgICB0aGlzLnNjYWxlID0gc2NhbGU7XHJcbiAgICAgICAgdGhpcy5vZmZzZXQgPSAwO1xyXG4gICAgfVxyXG4gICAgVmFyaWFibGUucHJvdG90eXBlLmRmZHYgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIDIuMCAqIHRoaXMud2VpZ2h0ICogKHRoaXMucG9zaXRpb24oKSAtIHRoaXMuZGVzaXJlZFBvc2l0aW9uKTtcclxuICAgIH07XHJcbiAgICBWYXJpYWJsZS5wcm90b3R5cGUucG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmJsb2NrLnBzLnNjYWxlICogdGhpcy5ibG9jay5wb3NuICsgdGhpcy5vZmZzZXQpIC8gdGhpcy5zY2FsZTtcclxuICAgIH07XHJcbiAgICBWYXJpYWJsZS5wcm90b3R5cGUudmlzaXROZWlnaGJvdXJzID0gZnVuY3Rpb24gKHByZXYsIGYpIHtcclxuICAgICAgICB2YXIgZmYgPSBmdW5jdGlvbiAoYywgbmV4dCkgeyByZXR1cm4gYy5hY3RpdmUgJiYgcHJldiAhPT0gbmV4dCAmJiBmKGMsIG5leHQpOyB9O1xyXG4gICAgICAgIHRoaXMuY091dC5mb3JFYWNoKGZ1bmN0aW9uIChjKSB7IHJldHVybiBmZihjLCBjLnJpZ2h0KTsgfSk7XHJcbiAgICAgICAgdGhpcy5jSW4uZm9yRWFjaChmdW5jdGlvbiAoYykgeyByZXR1cm4gZmYoYywgYy5sZWZ0KTsgfSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFZhcmlhYmxlO1xyXG59KCkpO1xyXG5leHBvcnRzLlZhcmlhYmxlID0gVmFyaWFibGU7XHJcbnZhciBCbG9jayA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBCbG9jayh2KSB7XHJcbiAgICAgICAgdGhpcy52YXJzID0gW107XHJcbiAgICAgICAgdi5vZmZzZXQgPSAwO1xyXG4gICAgICAgIHRoaXMucHMgPSBuZXcgUG9zaXRpb25TdGF0cyh2LnNjYWxlKTtcclxuICAgICAgICB0aGlzLmFkZFZhcmlhYmxlKHYpO1xyXG4gICAgfVxyXG4gICAgQmxvY2sucHJvdG90eXBlLmFkZFZhcmlhYmxlID0gZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICB2LmJsb2NrID0gdGhpcztcclxuICAgICAgICB0aGlzLnZhcnMucHVzaCh2KTtcclxuICAgICAgICB0aGlzLnBzLmFkZFZhcmlhYmxlKHYpO1xyXG4gICAgICAgIHRoaXMucG9zbiA9IHRoaXMucHMuZ2V0UG9zbigpO1xyXG4gICAgfTtcclxuICAgIEJsb2NrLnByb3RvdHlwZS51cGRhdGVXZWlnaHRlZFBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucHMuQUIgPSB0aGlzLnBzLkFEID0gdGhpcy5wcy5BMiA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSB0aGlzLnZhcnMubGVuZ3RoOyBpIDwgbjsgKytpKVxyXG4gICAgICAgICAgICB0aGlzLnBzLmFkZFZhcmlhYmxlKHRoaXMudmFyc1tpXSk7XHJcbiAgICAgICAgdGhpcy5wb3NuID0gdGhpcy5wcy5nZXRQb3NuKCk7XHJcbiAgICB9O1xyXG4gICAgQmxvY2sucHJvdG90eXBlLmNvbXB1dGVfbG0gPSBmdW5jdGlvbiAodiwgdSwgcG9zdEFjdGlvbikge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGRmZHYgPSB2LmRmZHYoKTtcclxuICAgICAgICB2LnZpc2l0TmVpZ2hib3Vycyh1LCBmdW5jdGlvbiAoYywgbmV4dCkge1xyXG4gICAgICAgICAgICB2YXIgX2RmZHYgPSBfdGhpcy5jb21wdXRlX2xtKG5leHQsIHYsIHBvc3RBY3Rpb24pO1xyXG4gICAgICAgICAgICBpZiAobmV4dCA9PT0gYy5yaWdodCkge1xyXG4gICAgICAgICAgICAgICAgZGZkdiArPSBfZGZkdiAqIGMubGVmdC5zY2FsZTtcclxuICAgICAgICAgICAgICAgIGMubG0gPSBfZGZkdjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRmZHYgKz0gX2RmZHYgKiBjLnJpZ2h0LnNjYWxlO1xyXG4gICAgICAgICAgICAgICAgYy5sbSA9IC1fZGZkdjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwb3N0QWN0aW9uKGMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBkZmR2IC8gdi5zY2FsZTtcclxuICAgIH07XHJcbiAgICBCbG9jay5wcm90b3R5cGUucG9wdWxhdGVTcGxpdEJsb2NrID0gZnVuY3Rpb24gKHYsIHByZXYpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHYudmlzaXROZWlnaGJvdXJzKHByZXYsIGZ1bmN0aW9uIChjLCBuZXh0KSB7XHJcbiAgICAgICAgICAgIG5leHQub2Zmc2V0ID0gdi5vZmZzZXQgKyAobmV4dCA9PT0gYy5yaWdodCA/IGMuZ2FwIDogLWMuZ2FwKTtcclxuICAgICAgICAgICAgX3RoaXMuYWRkVmFyaWFibGUobmV4dCk7XHJcbiAgICAgICAgICAgIF90aGlzLnBvcHVsYXRlU3BsaXRCbG9jayhuZXh0LCB2KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBCbG9jay5wcm90b3R5cGUudHJhdmVyc2UgPSBmdW5jdGlvbiAodmlzaXQsIGFjYywgdiwgcHJldikge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgaWYgKHYgPT09IHZvaWQgMCkgeyB2ID0gdGhpcy52YXJzWzBdOyB9XHJcbiAgICAgICAgaWYgKHByZXYgPT09IHZvaWQgMCkgeyBwcmV2ID0gbnVsbDsgfVxyXG4gICAgICAgIHYudmlzaXROZWlnaGJvdXJzKHByZXYsIGZ1bmN0aW9uIChjLCBuZXh0KSB7XHJcbiAgICAgICAgICAgIGFjYy5wdXNoKHZpc2l0KGMpKTtcclxuICAgICAgICAgICAgX3RoaXMudHJhdmVyc2UodmlzaXQsIGFjYywgbmV4dCwgdik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgQmxvY2sucHJvdG90eXBlLmZpbmRNaW5MTSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jb21wdXRlX2xtKHRoaXMudmFyc1swXSwgbnVsbCwgZnVuY3Rpb24gKGMpIHtcclxuICAgICAgICAgICAgaWYgKCFjLmVxdWFsaXR5ICYmIChtID09PSBudWxsIHx8IGMubG0gPCBtLmxtKSlcclxuICAgICAgICAgICAgICAgIG0gPSBjO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBtO1xyXG4gICAgfTtcclxuICAgIEJsb2NrLnByb3RvdHlwZS5maW5kTWluTE1CZXR3ZWVuID0gZnVuY3Rpb24gKGx2LCBydikge1xyXG4gICAgICAgIHRoaXMuY29tcHV0ZV9sbShsdiwgbnVsbCwgZnVuY3Rpb24gKCkgeyB9KTtcclxuICAgICAgICB2YXIgbSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5maW5kUGF0aChsdiwgbnVsbCwgcnYsIGZ1bmN0aW9uIChjLCBuZXh0KSB7XHJcbiAgICAgICAgICAgIGlmICghYy5lcXVhbGl0eSAmJiBjLnJpZ2h0ID09PSBuZXh0ICYmIChtID09PSBudWxsIHx8IGMubG0gPCBtLmxtKSlcclxuICAgICAgICAgICAgICAgIG0gPSBjO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBtO1xyXG4gICAgfTtcclxuICAgIEJsb2NrLnByb3RvdHlwZS5maW5kUGF0aCA9IGZ1bmN0aW9uICh2LCBwcmV2LCB0bywgdmlzaXQpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBlbmRGb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgIHYudmlzaXROZWlnaGJvdXJzKHByZXYsIGZ1bmN0aW9uIChjLCBuZXh0KSB7XHJcbiAgICAgICAgICAgIGlmICghZW5kRm91bmQgJiYgKG5leHQgPT09IHRvIHx8IF90aGlzLmZpbmRQYXRoKG5leHQsIHYsIHRvLCB2aXNpdCkpKSB7XHJcbiAgICAgICAgICAgICAgICBlbmRGb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB2aXNpdChjLCBuZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBlbmRGb3VuZDtcclxuICAgIH07XHJcbiAgICBCbG9jay5wcm90b3R5cGUuaXNBY3RpdmVEaXJlY3RlZFBhdGhCZXR3ZWVuID0gZnVuY3Rpb24gKHUsIHYpIHtcclxuICAgICAgICBpZiAodSA9PT0gdilcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgdmFyIGkgPSB1LmNPdXQubGVuZ3RoO1xyXG4gICAgICAgIHdoaWxlIChpLS0pIHtcclxuICAgICAgICAgICAgdmFyIGMgPSB1LmNPdXRbaV07XHJcbiAgICAgICAgICAgIGlmIChjLmFjdGl2ZSAmJiB0aGlzLmlzQWN0aXZlRGlyZWN0ZWRQYXRoQmV0d2VlbihjLnJpZ2h0LCB2KSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgQmxvY2suc3BsaXQgPSBmdW5jdGlvbiAoYykge1xyXG4gICAgICAgIGMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIFtCbG9jay5jcmVhdGVTcGxpdEJsb2NrKGMubGVmdCksIEJsb2NrLmNyZWF0ZVNwbGl0QmxvY2soYy5yaWdodCldO1xyXG4gICAgfTtcclxuICAgIEJsb2NrLmNyZWF0ZVNwbGl0QmxvY2sgPSBmdW5jdGlvbiAoc3RhcnRWYXIpIHtcclxuICAgICAgICB2YXIgYiA9IG5ldyBCbG9jayhzdGFydFZhcik7XHJcbiAgICAgICAgYi5wb3B1bGF0ZVNwbGl0QmxvY2soc3RhcnRWYXIsIG51bGwpO1xyXG4gICAgICAgIHJldHVybiBiO1xyXG4gICAgfTtcclxuICAgIEJsb2NrLnByb3RvdHlwZS5zcGxpdEJldHdlZW4gPSBmdW5jdGlvbiAodmwsIHZyKSB7XHJcbiAgICAgICAgdmFyIGMgPSB0aGlzLmZpbmRNaW5MTUJldHdlZW4odmwsIHZyKTtcclxuICAgICAgICBpZiAoYyAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB2YXIgYnMgPSBCbG9jay5zcGxpdChjKTtcclxuICAgICAgICAgICAgcmV0dXJuIHsgY29uc3RyYWludDogYywgbGI6IGJzWzBdLCByYjogYnNbMV0gfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9O1xyXG4gICAgQmxvY2sucHJvdG90eXBlLm1lcmdlQWNyb3NzID0gZnVuY3Rpb24gKGIsIGMsIGRpc3QpIHtcclxuICAgICAgICBjLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBiLnZhcnMubGVuZ3RoOyBpIDwgbjsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhciB2ID0gYi52YXJzW2ldO1xyXG4gICAgICAgICAgICB2Lm9mZnNldCArPSBkaXN0O1xyXG4gICAgICAgICAgICB0aGlzLmFkZFZhcmlhYmxlKHYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBvc24gPSB0aGlzLnBzLmdldFBvc24oKTtcclxuICAgIH07XHJcbiAgICBCbG9jay5wcm90b3R5cGUuY29zdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc3VtID0gMCwgaSA9IHRoaXMudmFycy5sZW5ndGg7XHJcbiAgICAgICAgd2hpbGUgKGktLSkge1xyXG4gICAgICAgICAgICB2YXIgdiA9IHRoaXMudmFyc1tpXSwgZCA9IHYucG9zaXRpb24oKSAtIHYuZGVzaXJlZFBvc2l0aW9uO1xyXG4gICAgICAgICAgICBzdW0gKz0gZCAqIGQgKiB2LndlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN1bTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gQmxvY2s7XHJcbn0oKSk7XHJcbmV4cG9ydHMuQmxvY2sgPSBCbG9jaztcclxudmFyIEJsb2NrcyA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBCbG9ja3ModnMpIHtcclxuICAgICAgICB0aGlzLnZzID0gdnM7XHJcbiAgICAgICAgdmFyIG4gPSB2cy5sZW5ndGg7XHJcbiAgICAgICAgdGhpcy5saXN0ID0gbmV3IEFycmF5KG4pO1xyXG4gICAgICAgIHdoaWxlIChuLS0pIHtcclxuICAgICAgICAgICAgdmFyIGIgPSBuZXcgQmxvY2sodnNbbl0pO1xyXG4gICAgICAgICAgICB0aGlzLmxpc3Rbbl0gPSBiO1xyXG4gICAgICAgICAgICBiLmJsb2NrSW5kID0gbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBCbG9ja3MucHJvdG90eXBlLmNvc3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHN1bSA9IDAsIGkgPSB0aGlzLmxpc3QubGVuZ3RoO1xyXG4gICAgICAgIHdoaWxlIChpLS0pXHJcbiAgICAgICAgICAgIHN1bSArPSB0aGlzLmxpc3RbaV0uY29zdCgpO1xyXG4gICAgICAgIHJldHVybiBzdW07XHJcbiAgICB9O1xyXG4gICAgQmxvY2tzLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAoYikge1xyXG4gICAgICAgIGIuYmxvY2tJbmQgPSB0aGlzLmxpc3QubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMubGlzdC5wdXNoKGIpO1xyXG4gICAgfTtcclxuICAgIEJsb2Nrcy5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGIpIHtcclxuICAgICAgICB2YXIgbGFzdCA9IHRoaXMubGlzdC5sZW5ndGggLSAxO1xyXG4gICAgICAgIHZhciBzd2FwQmxvY2sgPSB0aGlzLmxpc3RbbGFzdF07XHJcbiAgICAgICAgdGhpcy5saXN0Lmxlbmd0aCA9IGxhc3Q7XHJcbiAgICAgICAgaWYgKGIgIT09IHN3YXBCbG9jaykge1xyXG4gICAgICAgICAgICB0aGlzLmxpc3RbYi5ibG9ja0luZF0gPSBzd2FwQmxvY2s7XHJcbiAgICAgICAgICAgIHN3YXBCbG9jay5ibG9ja0luZCA9IGIuYmxvY2tJbmQ7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIEJsb2Nrcy5wcm90b3R5cGUubWVyZ2UgPSBmdW5jdGlvbiAoYykge1xyXG4gICAgICAgIHZhciBsID0gYy5sZWZ0LmJsb2NrLCByID0gYy5yaWdodC5ibG9jaztcclxuICAgICAgICB2YXIgZGlzdCA9IGMucmlnaHQub2Zmc2V0IC0gYy5sZWZ0Lm9mZnNldCAtIGMuZ2FwO1xyXG4gICAgICAgIGlmIChsLnZhcnMubGVuZ3RoIDwgci52YXJzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByLm1lcmdlQWNyb3NzKGwsIGMsIGRpc3QpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZShsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGwubWVyZ2VBY3Jvc3MociwgYywgLWRpc3QpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZShyKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgQmxvY2tzLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGYpIHtcclxuICAgICAgICB0aGlzLmxpc3QuZm9yRWFjaChmKTtcclxuICAgIH07XHJcbiAgICBCbG9ja3MucHJvdG90eXBlLnVwZGF0ZUJsb2NrUG9zaXRpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMubGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChiKSB7IHJldHVybiBiLnVwZGF0ZVdlaWdodGVkUG9zaXRpb24oKTsgfSk7XHJcbiAgICB9O1xyXG4gICAgQmxvY2tzLnByb3RvdHlwZS5zcGxpdCA9IGZ1bmN0aW9uIChpbmFjdGl2ZSkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy51cGRhdGVCbG9ja1Bvc2l0aW9ucygpO1xyXG4gICAgICAgIHRoaXMubGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChiKSB7XHJcbiAgICAgICAgICAgIHZhciB2ID0gYi5maW5kTWluTE0oKTtcclxuICAgICAgICAgICAgaWYgKHYgIT09IG51bGwgJiYgdi5sbSA8IFNvbHZlci5MQUdSQU5HSUFOX1RPTEVSQU5DRSkge1xyXG4gICAgICAgICAgICAgICAgYiA9IHYubGVmdC5ibG9jaztcclxuICAgICAgICAgICAgICAgIEJsb2NrLnNwbGl0KHYpLmZvckVhY2goZnVuY3Rpb24gKG5iKSB7IHJldHVybiBfdGhpcy5pbnNlcnQobmIpOyB9KTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnJlbW92ZShiKTtcclxuICAgICAgICAgICAgICAgIGluYWN0aXZlLnB1c2godik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gQmxvY2tzO1xyXG59KCkpO1xyXG5leHBvcnRzLkJsb2NrcyA9IEJsb2NrcztcclxudmFyIFNvbHZlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBTb2x2ZXIodnMsIGNzKSB7XHJcbiAgICAgICAgdGhpcy52cyA9IHZzO1xyXG4gICAgICAgIHRoaXMuY3MgPSBjcztcclxuICAgICAgICB0aGlzLnZzID0gdnM7XHJcbiAgICAgICAgdnMuZm9yRWFjaChmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB2LmNJbiA9IFtdLCB2LmNPdXQgPSBbXTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmNzID0gY3M7XHJcbiAgICAgICAgY3MuZm9yRWFjaChmdW5jdGlvbiAoYykge1xyXG4gICAgICAgICAgICBjLmxlZnQuY091dC5wdXNoKGMpO1xyXG4gICAgICAgICAgICBjLnJpZ2h0LmNJbi5wdXNoKGMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaW5hY3RpdmUgPSBjcy5tYXAoZnVuY3Rpb24gKGMpIHsgYy5hY3RpdmUgPSBmYWxzZTsgcmV0dXJuIGM7IH0pO1xyXG4gICAgICAgIHRoaXMuYnMgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgU29sdmVyLnByb3RvdHlwZS5jb3N0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmJzLmNvc3QoKTtcclxuICAgIH07XHJcbiAgICBTb2x2ZXIucHJvdG90eXBlLnNldFN0YXJ0aW5nUG9zaXRpb25zID0gZnVuY3Rpb24gKHBzKSB7XHJcbiAgICAgICAgdGhpcy5pbmFjdGl2ZSA9IHRoaXMuY3MubWFwKGZ1bmN0aW9uIChjKSB7IGMuYWN0aXZlID0gZmFsc2U7IHJldHVybiBjOyB9KTtcclxuICAgICAgICB0aGlzLmJzID0gbmV3IEJsb2Nrcyh0aGlzLnZzKTtcclxuICAgICAgICB0aGlzLmJzLmZvckVhY2goZnVuY3Rpb24gKGIsIGkpIHsgcmV0dXJuIGIucG9zbiA9IHBzW2ldOyB9KTtcclxuICAgIH07XHJcbiAgICBTb2x2ZXIucHJvdG90eXBlLnNldERlc2lyZWRQb3NpdGlvbnMgPSBmdW5jdGlvbiAocHMpIHtcclxuICAgICAgICB0aGlzLnZzLmZvckVhY2goZnVuY3Rpb24gKHYsIGkpIHsgcmV0dXJuIHYuZGVzaXJlZFBvc2l0aW9uID0gcHNbaV07IH0pO1xyXG4gICAgfTtcclxuICAgIFNvbHZlci5wcm90b3R5cGUubW9zdFZpb2xhdGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtaW5TbGFjayA9IE51bWJlci5NQVhfVkFMVUUsIHYgPSBudWxsLCBsID0gdGhpcy5pbmFjdGl2ZSwgbiA9IGwubGVuZ3RoLCBkZWxldGVQb2ludCA9IG47XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIGMgPSBsW2ldO1xyXG4gICAgICAgICAgICBpZiAoYy51bnNhdGlzZmlhYmxlKVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIHZhciBzbGFjayA9IGMuc2xhY2soKTtcclxuICAgICAgICAgICAgaWYgKGMuZXF1YWxpdHkgfHwgc2xhY2sgPCBtaW5TbGFjaykge1xyXG4gICAgICAgICAgICAgICAgbWluU2xhY2sgPSBzbGFjaztcclxuICAgICAgICAgICAgICAgIHYgPSBjO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlUG9pbnQgPSBpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGMuZXF1YWxpdHkpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRlbGV0ZVBvaW50ICE9PSBuICYmXHJcbiAgICAgICAgICAgIChtaW5TbGFjayA8IFNvbHZlci5aRVJPX1VQUEVSQk9VTkQgJiYgIXYuYWN0aXZlIHx8IHYuZXF1YWxpdHkpKSB7XHJcbiAgICAgICAgICAgIGxbZGVsZXRlUG9pbnRdID0gbFtuIC0gMV07XHJcbiAgICAgICAgICAgIGwubGVuZ3RoID0gbiAtIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2O1xyXG4gICAgfTtcclxuICAgIFNvbHZlci5wcm90b3R5cGUuc2F0aXNmeSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5icyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnMgPSBuZXcgQmxvY2tzKHRoaXMudnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmJzLnNwbGl0KHRoaXMuaW5hY3RpdmUpO1xyXG4gICAgICAgIHZhciB2ID0gbnVsbDtcclxuICAgICAgICB3aGlsZSAoKHYgPSB0aGlzLm1vc3RWaW9sYXRlZCgpKSAmJiAodi5lcXVhbGl0eSB8fCB2LnNsYWNrKCkgPCBTb2x2ZXIuWkVST19VUFBFUkJPVU5EICYmICF2LmFjdGl2ZSkpIHtcclxuICAgICAgICAgICAgdmFyIGxiID0gdi5sZWZ0LmJsb2NrLCByYiA9IHYucmlnaHQuYmxvY2s7XHJcbiAgICAgICAgICAgIGlmIChsYiAhPT0gcmIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnMubWVyZ2Uodik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGIuaXNBY3RpdmVEaXJlY3RlZFBhdGhCZXR3ZWVuKHYucmlnaHQsIHYubGVmdCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2LnVuc2F0aXNmaWFibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHNwbGl0ID0gbGIuc3BsaXRCZXR3ZWVuKHYubGVmdCwgdi5yaWdodCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3BsaXQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJzLmluc2VydChzcGxpdC5sYik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5icy5pbnNlcnQoc3BsaXQucmIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnMucmVtb3ZlKGxiKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluYWN0aXZlLnB1c2goc3BsaXQuY29uc3RyYWludCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2LnVuc2F0aXNmaWFibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHYuc2xhY2soKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmFjdGl2ZS5wdXNoKHYpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5icy5tZXJnZSh2KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBTb2x2ZXIucHJvdG90eXBlLnNvbHZlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuc2F0aXNmeSgpO1xyXG4gICAgICAgIHZhciBsYXN0Y29zdCA9IE51bWJlci5NQVhfVkFMVUUsIGNvc3QgPSB0aGlzLmJzLmNvc3QoKTtcclxuICAgICAgICB3aGlsZSAoTWF0aC5hYnMobGFzdGNvc3QgLSBjb3N0KSA+IDAuMDAwMSkge1xyXG4gICAgICAgICAgICB0aGlzLnNhdGlzZnkoKTtcclxuICAgICAgICAgICAgbGFzdGNvc3QgPSBjb3N0O1xyXG4gICAgICAgICAgICBjb3N0ID0gdGhpcy5icy5jb3N0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb3N0O1xyXG4gICAgfTtcclxuICAgIFNvbHZlci5MQUdSQU5HSUFOX1RPTEVSQU5DRSA9IC0xZS00O1xyXG4gICAgU29sdmVyLlpFUk9fVVBQRVJCT1VORCA9IC0xZS0xMDtcclxuICAgIHJldHVybiBTb2x2ZXI7XHJcbn0oKSk7XHJcbmV4cG9ydHMuU29sdmVyID0gU29sdmVyO1xyXG5mdW5jdGlvbiByZW1vdmVPdmVybGFwSW5PbmVEaW1lbnNpb24oc3BhbnMsIGxvd2VyQm91bmQsIHVwcGVyQm91bmQpIHtcclxuICAgIHZhciB2cyA9IHNwYW5zLm1hcChmdW5jdGlvbiAocykgeyByZXR1cm4gbmV3IFZhcmlhYmxlKHMuZGVzaXJlZENlbnRlcik7IH0pO1xyXG4gICAgdmFyIGNzID0gW107XHJcbiAgICB2YXIgbiA9IHNwYW5zLmxlbmd0aDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbiAtIDE7IGkrKykge1xyXG4gICAgICAgIHZhciBsZWZ0ID0gc3BhbnNbaV0sIHJpZ2h0ID0gc3BhbnNbaSArIDFdO1xyXG4gICAgICAgIGNzLnB1c2gobmV3IENvbnN0cmFpbnQodnNbaV0sIHZzW2kgKyAxXSwgKGxlZnQuc2l6ZSArIHJpZ2h0LnNpemUpIC8gMikpO1xyXG4gICAgfVxyXG4gICAgdmFyIGxlZnRNb3N0ID0gdnNbMF0sIHJpZ2h0TW9zdCA9IHZzW24gLSAxXSwgbGVmdE1vc3RTaXplID0gc3BhbnNbMF0uc2l6ZSAvIDIsIHJpZ2h0TW9zdFNpemUgPSBzcGFuc1tuIC0gMV0uc2l6ZSAvIDI7XHJcbiAgICB2YXIgdkxvd2VyID0gbnVsbCwgdlVwcGVyID0gbnVsbDtcclxuICAgIGlmIChsb3dlckJvdW5kKSB7XHJcbiAgICAgICAgdkxvd2VyID0gbmV3IFZhcmlhYmxlKGxvd2VyQm91bmQsIGxlZnRNb3N0LndlaWdodCAqIDEwMDApO1xyXG4gICAgICAgIHZzLnB1c2godkxvd2VyKTtcclxuICAgICAgICBjcy5wdXNoKG5ldyBDb25zdHJhaW50KHZMb3dlciwgbGVmdE1vc3QsIGxlZnRNb3N0U2l6ZSkpO1xyXG4gICAgfVxyXG4gICAgaWYgKHVwcGVyQm91bmQpIHtcclxuICAgICAgICB2VXBwZXIgPSBuZXcgVmFyaWFibGUodXBwZXJCb3VuZCwgcmlnaHRNb3N0LndlaWdodCAqIDEwMDApO1xyXG4gICAgICAgIHZzLnB1c2godlVwcGVyKTtcclxuICAgICAgICBjcy5wdXNoKG5ldyBDb25zdHJhaW50KHJpZ2h0TW9zdCwgdlVwcGVyLCByaWdodE1vc3RTaXplKSk7XHJcbiAgICB9XHJcbiAgICB2YXIgc29sdmVyID0gbmV3IFNvbHZlcih2cywgY3MpO1xyXG4gICAgc29sdmVyLnNvbHZlKCk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5ld0NlbnRlcnM6IHZzLnNsaWNlKDAsIHNwYW5zLmxlbmd0aCkubWFwKGZ1bmN0aW9uICh2KSB7IHJldHVybiB2LnBvc2l0aW9uKCk7IH0pLFxyXG4gICAgICAgIGxvd2VyQm91bmQ6IHZMb3dlciA/IHZMb3dlci5wb3NpdGlvbigpIDogbGVmdE1vc3QucG9zaXRpb24oKSAtIGxlZnRNb3N0U2l6ZSxcclxuICAgICAgICB1cHBlckJvdW5kOiB2VXBwZXIgPyB2VXBwZXIucG9zaXRpb24oKSA6IHJpZ2h0TW9zdC5wb3NpdGlvbigpICsgcmlnaHRNb3N0U2l6ZVxyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLnJlbW92ZU92ZXJsYXBJbk9uZURpbWVuc2lvbiA9IHJlbW92ZU92ZXJsYXBJbk9uZURpbWVuc2lvbjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dnBzYy5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy93ZWJjb2xhL2Rpc3Qvc3JjL3Zwc2MuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGhlbiBvbiA1LzE1LzE3LlxuICovXG5leHBvcnQgY2xhc3MgU2ltcGxlRXZlbnRIYW5kbGVyIHtcblxuICAgIGVsZW1lbnQ6IEVsZW1lbnQ7XG4gICAgZXZlbnRMaXN0ZW5lcnM6IG9iamVjdFtdO1xuXG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMgPSBbXVxuICAgIH1cblxuXG4gICAgYmluZChldmVudE5hbWVzOiBzdHJpbmcsIGV2ZW50RnVuY3Rpb246IEZ1bmN0aW9uKSB7XG4gICAgICAgIGZvciAoY29uc3QgZXZlbnROYW1lIG9mIGV2ZW50TmFtZXMuc3BsaXQoJyAnKSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudExpc3RlbmVycy5wdXNoKHtldmVudE5hbWUsIGV2ZW50RnVuY3Rpb259KTtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50RnVuY3Rpb25XcmFwID0gZSA9PiBldmVudEZ1bmN0aW9uKGUuZGV0YWlsLCBlKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZXZlbnRGdW5jdGlvbldyYXAsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldExpc3RlbmVycygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgdHJpZ2dlcihldmVudE5hbWU6IHN0cmluZywgZGV0YWlsOiBvYmplY3QpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwge2RldGFpbH0pKTtcbiAgICB9XG5cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi90cy9ldGMvU2ltcGxlRXZlbnRIYW5kbGVyLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFBvd2VyRWRnZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBQb3dlckVkZ2Uoc291cmNlLCB0YXJnZXQsIHR5cGUpIHtcclxuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFBvd2VyRWRnZTtcclxufSgpKTtcclxuZXhwb3J0cy5Qb3dlckVkZ2UgPSBQb3dlckVkZ2U7XHJcbnZhciBDb25maWd1cmF0aW9uID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIENvbmZpZ3VyYXRpb24obiwgZWRnZXMsIGxpbmtBY2Nlc3Nvciwgcm9vdEdyb3VwKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmxpbmtBY2Nlc3NvciA9IGxpbmtBY2Nlc3NvcjtcclxuICAgICAgICB0aGlzLm1vZHVsZXMgPSBuZXcgQXJyYXkobik7XHJcbiAgICAgICAgdGhpcy5yb290cyA9IFtdO1xyXG4gICAgICAgIGlmIChyb290R3JvdXApIHtcclxuICAgICAgICAgICAgdGhpcy5pbml0TW9kdWxlc0Zyb21Hcm91cChyb290R3JvdXApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5yb290cy5wdXNoKG5ldyBNb2R1bGVTZXQoKSk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgKytpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5yb290c1swXS5hZGQodGhpcy5tb2R1bGVzW2ldID0gbmV3IE1vZHVsZShpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuUiA9IGVkZ2VzLmxlbmd0aDtcclxuICAgICAgICBlZGdlcy5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIHZhciBzID0gX3RoaXMubW9kdWxlc1tsaW5rQWNjZXNzb3IuZ2V0U291cmNlSW5kZXgoZSldLCB0ID0gX3RoaXMubW9kdWxlc1tsaW5rQWNjZXNzb3IuZ2V0VGFyZ2V0SW5kZXgoZSldLCB0eXBlID0gbGlua0FjY2Vzc29yLmdldFR5cGUoZSk7XHJcbiAgICAgICAgICAgIHMub3V0Z29pbmcuYWRkKHR5cGUsIHQpO1xyXG4gICAgICAgICAgICB0LmluY29taW5nLmFkZCh0eXBlLCBzKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIENvbmZpZ3VyYXRpb24ucHJvdG90eXBlLmluaXRNb2R1bGVzRnJvbUdyb3VwID0gZnVuY3Rpb24gKGdyb3VwKSB7XHJcbiAgICAgICAgdmFyIG1vZHVsZVNldCA9IG5ldyBNb2R1bGVTZXQoKTtcclxuICAgICAgICB0aGlzLnJvb3RzLnB1c2gobW9kdWxlU2V0KTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGdyb3VwLmxlYXZlcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IGdyb3VwLmxlYXZlc1tpXTtcclxuICAgICAgICAgICAgdmFyIG1vZHVsZSA9IG5ldyBNb2R1bGUobm9kZS5pZCk7XHJcbiAgICAgICAgICAgIHRoaXMubW9kdWxlc1tub2RlLmlkXSA9IG1vZHVsZTtcclxuICAgICAgICAgICAgbW9kdWxlU2V0LmFkZChtb2R1bGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZ3JvdXAuZ3JvdXBzKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZ3JvdXAuZ3JvdXBzLmxlbmd0aDsgKytqKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBncm91cC5ncm91cHNbal07XHJcbiAgICAgICAgICAgICAgICB2YXIgZGVmaW5pdGlvbiA9IHt9O1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBjaGlsZClcclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcCAhPT0gXCJsZWF2ZXNcIiAmJiBwcm9wICE9PSBcImdyb3Vwc1wiICYmIGNoaWxkLmhhc093blByb3BlcnR5KHByb3ApKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZpbml0aW9uW3Byb3BdID0gY2hpbGRbcHJvcF07XHJcbiAgICAgICAgICAgICAgICBtb2R1bGVTZXQuYWRkKG5ldyBNb2R1bGUoLTEgLSBqLCBuZXcgTGlua1NldHMoKSwgbmV3IExpbmtTZXRzKCksIHRoaXMuaW5pdE1vZHVsZXNGcm9tR3JvdXAoY2hpbGQpLCBkZWZpbml0aW9uKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1vZHVsZVNldDtcclxuICAgIH07XHJcbiAgICBDb25maWd1cmF0aW9uLnByb3RvdHlwZS5tZXJnZSA9IGZ1bmN0aW9uIChhLCBiLCBrKSB7XHJcbiAgICAgICAgaWYgKGsgPT09IHZvaWQgMCkgeyBrID0gMDsgfVxyXG4gICAgICAgIHZhciBpbkludCA9IGEuaW5jb21pbmcuaW50ZXJzZWN0aW9uKGIuaW5jb21pbmcpLCBvdXRJbnQgPSBhLm91dGdvaW5nLmludGVyc2VjdGlvbihiLm91dGdvaW5nKTtcclxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBuZXcgTW9kdWxlU2V0KCk7XHJcbiAgICAgICAgY2hpbGRyZW4uYWRkKGEpO1xyXG4gICAgICAgIGNoaWxkcmVuLmFkZChiKTtcclxuICAgICAgICB2YXIgbSA9IG5ldyBNb2R1bGUodGhpcy5tb2R1bGVzLmxlbmd0aCwgb3V0SW50LCBpbkludCwgY2hpbGRyZW4pO1xyXG4gICAgICAgIHRoaXMubW9kdWxlcy5wdXNoKG0pO1xyXG4gICAgICAgIHZhciB1cGRhdGUgPSBmdW5jdGlvbiAocywgaSwgbykge1xyXG4gICAgICAgICAgICBzLmZvckFsbChmdW5jdGlvbiAobXMsIGxpbmt0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBtcy5mb3JBbGwoZnVuY3Rpb24gKG4pIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmxzID0gbltpXTtcclxuICAgICAgICAgICAgICAgICAgICBubHMuYWRkKGxpbmt0eXBlLCBtKTtcclxuICAgICAgICAgICAgICAgICAgICBubHMucmVtb3ZlKGxpbmt0eXBlLCBhKTtcclxuICAgICAgICAgICAgICAgICAgICBubHMucmVtb3ZlKGxpbmt0eXBlLCBiKTtcclxuICAgICAgICAgICAgICAgICAgICBhW29dLnJlbW92ZShsaW5rdHlwZSwgbik7XHJcbiAgICAgICAgICAgICAgICAgICAgYltvXS5yZW1vdmUobGlua3R5cGUsIG4pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdXBkYXRlKG91dEludCwgXCJpbmNvbWluZ1wiLCBcIm91dGdvaW5nXCIpO1xyXG4gICAgICAgIHVwZGF0ZShpbkludCwgXCJvdXRnb2luZ1wiLCBcImluY29taW5nXCIpO1xyXG4gICAgICAgIHRoaXMuUiAtPSBpbkludC5jb3VudCgpICsgb3V0SW50LmNvdW50KCk7XHJcbiAgICAgICAgdGhpcy5yb290c1trXS5yZW1vdmUoYSk7XHJcbiAgICAgICAgdGhpcy5yb290c1trXS5yZW1vdmUoYik7XHJcbiAgICAgICAgdGhpcy5yb290c1trXS5hZGQobSk7XHJcbiAgICAgICAgcmV0dXJuIG07XHJcbiAgICB9O1xyXG4gICAgQ29uZmlndXJhdGlvbi5wcm90b3R5cGUucm9vdE1lcmdlcyA9IGZ1bmN0aW9uIChrKSB7XHJcbiAgICAgICAgaWYgKGsgPT09IHZvaWQgMCkgeyBrID0gMDsgfVxyXG4gICAgICAgIHZhciBycyA9IHRoaXMucm9vdHNba10ubW9kdWxlcygpO1xyXG4gICAgICAgIHZhciBuID0gcnMubGVuZ3RoO1xyXG4gICAgICAgIHZhciBtZXJnZXMgPSBuZXcgQXJyYXkobiAqIChuIC0gMSkpO1xyXG4gICAgICAgIHZhciBjdHIgPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpXyA9IG4gLSAxOyBpIDwgaV87ICsraSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gaSArIDE7IGogPCBuOyArK2opIHtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gcnNbaV0sIGIgPSByc1tqXTtcclxuICAgICAgICAgICAgICAgIG1lcmdlc1tjdHJdID0geyBpZDogY3RyLCBuRWRnZXM6IHRoaXMubkVkZ2VzKGEsIGIpLCBhOiBhLCBiOiBiIH07XHJcbiAgICAgICAgICAgICAgICBjdHIrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWVyZ2VzO1xyXG4gICAgfTtcclxuICAgIENvbmZpZ3VyYXRpb24ucHJvdG90eXBlLmdyZWVkeU1lcmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yb290cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yb290c1tpXS5tb2R1bGVzKCkubGVuZ3RoIDwgMilcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB2YXIgbXMgPSB0aGlzLnJvb3RNZXJnZXMoaSkuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYS5uRWRnZXMgPT0gYi5uRWRnZXMgPyBhLmlkIC0gYi5pZCA6IGEubkVkZ2VzIC0gYi5uRWRnZXM7IH0pO1xyXG4gICAgICAgICAgICB2YXIgbSA9IG1zWzBdO1xyXG4gICAgICAgICAgICBpZiAobS5uRWRnZXMgPj0gdGhpcy5SKVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIHRoaXMubWVyZ2UobS5hLCBtLmIsIGkpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgQ29uZmlndXJhdGlvbi5wcm90b3R5cGUubkVkZ2VzID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICB2YXIgaW5JbnQgPSBhLmluY29taW5nLmludGVyc2VjdGlvbihiLmluY29taW5nKSwgb3V0SW50ID0gYS5vdXRnb2luZy5pbnRlcnNlY3Rpb24oYi5vdXRnb2luZyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuUiAtIGluSW50LmNvdW50KCkgLSBvdXRJbnQuY291bnQoKTtcclxuICAgIH07XHJcbiAgICBDb25maWd1cmF0aW9uLnByb3RvdHlwZS5nZXRHcm91cEhpZXJhcmNoeSA9IGZ1bmN0aW9uIChyZXRhcmdldGVkRWRnZXMpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBncm91cHMgPSBbXTtcclxuICAgICAgICB2YXIgcm9vdCA9IHt9O1xyXG4gICAgICAgIHRvR3JvdXBzKHRoaXMucm9vdHNbMF0sIHJvb3QsIGdyb3Vwcyk7XHJcbiAgICAgICAgdmFyIGVzID0gdGhpcy5hbGxFZGdlcygpO1xyXG4gICAgICAgIGVzLmZvckVhY2goZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgdmFyIGEgPSBfdGhpcy5tb2R1bGVzW2Uuc291cmNlXTtcclxuICAgICAgICAgICAgdmFyIGIgPSBfdGhpcy5tb2R1bGVzW2UudGFyZ2V0XTtcclxuICAgICAgICAgICAgcmV0YXJnZXRlZEVkZ2VzLnB1c2gobmV3IFBvd2VyRWRnZSh0eXBlb2YgYS5naWQgPT09IFwidW5kZWZpbmVkXCIgPyBlLnNvdXJjZSA6IGdyb3Vwc1thLmdpZF0sIHR5cGVvZiBiLmdpZCA9PT0gXCJ1bmRlZmluZWRcIiA/IGUudGFyZ2V0IDogZ3JvdXBzW2IuZ2lkXSwgZS50eXBlKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGdyb3VwcztcclxuICAgIH07XHJcbiAgICBDb25maWd1cmF0aW9uLnByb3RvdHlwZS5hbGxFZGdlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZXMgPSBbXTtcclxuICAgICAgICBDb25maWd1cmF0aW9uLmdldEVkZ2VzKHRoaXMucm9vdHNbMF0sIGVzKTtcclxuICAgICAgICByZXR1cm4gZXM7XHJcbiAgICB9O1xyXG4gICAgQ29uZmlndXJhdGlvbi5nZXRFZGdlcyA9IGZ1bmN0aW9uIChtb2R1bGVzLCBlcykge1xyXG4gICAgICAgIG1vZHVsZXMuZm9yQWxsKGZ1bmN0aW9uIChtKSB7XHJcbiAgICAgICAgICAgIG0uZ2V0RWRnZXMoZXMpO1xyXG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLmdldEVkZ2VzKG0uY2hpbGRyZW4sIGVzKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gQ29uZmlndXJhdGlvbjtcclxufSgpKTtcclxuZXhwb3J0cy5Db25maWd1cmF0aW9uID0gQ29uZmlndXJhdGlvbjtcclxuZnVuY3Rpb24gdG9Hcm91cHMobW9kdWxlcywgZ3JvdXAsIGdyb3Vwcykge1xyXG4gICAgbW9kdWxlcy5mb3JBbGwoZnVuY3Rpb24gKG0pIHtcclxuICAgICAgICBpZiAobS5pc0xlYWYoKSkge1xyXG4gICAgICAgICAgICBpZiAoIWdyb3VwLmxlYXZlcylcclxuICAgICAgICAgICAgICAgIGdyb3VwLmxlYXZlcyA9IFtdO1xyXG4gICAgICAgICAgICBncm91cC5sZWF2ZXMucHVzaChtLmlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBnID0gZ3JvdXA7XHJcbiAgICAgICAgICAgIG0uZ2lkID0gZ3JvdXBzLmxlbmd0aDtcclxuICAgICAgICAgICAgaWYgKCFtLmlzSXNsYW5kKCkgfHwgbS5pc1ByZWRlZmluZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgZyA9IHsgaWQ6IG0uZ2lkIH07XHJcbiAgICAgICAgICAgICAgICBpZiAobS5pc1ByZWRlZmluZWQoKSlcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIG0uZGVmaW5pdGlvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ1twcm9wXSA9IG0uZGVmaW5pdGlvbltwcm9wXTtcclxuICAgICAgICAgICAgICAgIGlmICghZ3JvdXAuZ3JvdXBzKVxyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwLmdyb3VwcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAuZ3JvdXBzLnB1c2gobS5naWQpO1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBzLnB1c2goZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdG9Hcm91cHMobS5jaGlsZHJlbiwgZywgZ3JvdXBzKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG52YXIgTW9kdWxlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIE1vZHVsZShpZCwgb3V0Z29pbmcsIGluY29taW5nLCBjaGlsZHJlbiwgZGVmaW5pdGlvbikge1xyXG4gICAgICAgIGlmIChvdXRnb2luZyA9PT0gdm9pZCAwKSB7IG91dGdvaW5nID0gbmV3IExpbmtTZXRzKCk7IH1cclxuICAgICAgICBpZiAoaW5jb21pbmcgPT09IHZvaWQgMCkgeyBpbmNvbWluZyA9IG5ldyBMaW5rU2V0cygpOyB9XHJcbiAgICAgICAgaWYgKGNoaWxkcmVuID09PSB2b2lkIDApIHsgY2hpbGRyZW4gPSBuZXcgTW9kdWxlU2V0KCk7IH1cclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5vdXRnb2luZyA9IG91dGdvaW5nO1xyXG4gICAgICAgIHRoaXMuaW5jb21pbmcgPSBpbmNvbWluZztcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XHJcbiAgICAgICAgdGhpcy5kZWZpbml0aW9uID0gZGVmaW5pdGlvbjtcclxuICAgIH1cclxuICAgIE1vZHVsZS5wcm90b3R5cGUuZ2V0RWRnZXMgPSBmdW5jdGlvbiAoZXMpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMub3V0Z29pbmcuZm9yQWxsKGZ1bmN0aW9uIChtcywgZWRnZXR5cGUpIHtcclxuICAgICAgICAgICAgbXMuZm9yQWxsKGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIGVzLnB1c2gobmV3IFBvd2VyRWRnZShfdGhpcy5pZCwgdGFyZ2V0LmlkLCBlZGdldHlwZSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBNb2R1bGUucHJvdG90eXBlLmlzTGVhZiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5jb3VudCgpID09PSAwO1xyXG4gICAgfTtcclxuICAgIE1vZHVsZS5wcm90b3R5cGUuaXNJc2xhbmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3V0Z29pbmcuY291bnQoKSA9PT0gMCAmJiB0aGlzLmluY29taW5nLmNvdW50KCkgPT09IDA7XHJcbiAgICB9O1xyXG4gICAgTW9kdWxlLnByb3RvdHlwZS5pc1ByZWRlZmluZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLmRlZmluaXRpb24gIT09IFwidW5kZWZpbmVkXCI7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIE1vZHVsZTtcclxufSgpKTtcclxuZXhwb3J0cy5Nb2R1bGUgPSBNb2R1bGU7XHJcbmZ1bmN0aW9uIGludGVyc2VjdGlvbihtLCBuKSB7XHJcbiAgICB2YXIgaSA9IHt9O1xyXG4gICAgZm9yICh2YXIgdiBpbiBtKVxyXG4gICAgICAgIGlmICh2IGluIG4pXHJcbiAgICAgICAgICAgIGlbdl0gPSBtW3ZdO1xyXG4gICAgcmV0dXJuIGk7XHJcbn1cclxudmFyIE1vZHVsZVNldCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBNb2R1bGVTZXQoKSB7XHJcbiAgICAgICAgdGhpcy50YWJsZSA9IHt9O1xyXG4gICAgfVxyXG4gICAgTW9kdWxlU2V0LnByb3RvdHlwZS5jb3VudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy50YWJsZSkubGVuZ3RoO1xyXG4gICAgfTtcclxuICAgIE1vZHVsZVNldC5wcm90b3R5cGUuaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24gKG90aGVyKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBNb2R1bGVTZXQoKTtcclxuICAgICAgICByZXN1bHQudGFibGUgPSBpbnRlcnNlY3Rpb24odGhpcy50YWJsZSwgb3RoZXIudGFibGUpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgTW9kdWxlU2V0LnByb3RvdHlwZS5pbnRlcnNlY3Rpb25Db3VudCA9IGZ1bmN0aW9uIChvdGhlcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmludGVyc2VjdGlvbihvdGhlcikuY291bnQoKTtcclxuICAgIH07XHJcbiAgICBNb2R1bGVTZXQucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgcmV0dXJuIGlkIGluIHRoaXMudGFibGU7XHJcbiAgICB9O1xyXG4gICAgTW9kdWxlU2V0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAobSkge1xyXG4gICAgICAgIHRoaXMudGFibGVbbS5pZF0gPSBtO1xyXG4gICAgfTtcclxuICAgIE1vZHVsZVNldC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKG0pIHtcclxuICAgICAgICBkZWxldGUgdGhpcy50YWJsZVttLmlkXTtcclxuICAgIH07XHJcbiAgICBNb2R1bGVTZXQucHJvdG90eXBlLmZvckFsbCA9IGZ1bmN0aW9uIChmKSB7XHJcbiAgICAgICAgZm9yICh2YXIgbWlkIGluIHRoaXMudGFibGUpIHtcclxuICAgICAgICAgICAgZih0aGlzLnRhYmxlW21pZF0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBNb2R1bGVTZXQucHJvdG90eXBlLm1vZHVsZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHZzID0gW107XHJcbiAgICAgICAgdGhpcy5mb3JBbGwoZnVuY3Rpb24gKG0pIHtcclxuICAgICAgICAgICAgaWYgKCFtLmlzUHJlZGVmaW5lZCgpKVxyXG4gICAgICAgICAgICAgICAgdnMucHVzaChtKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdnM7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIE1vZHVsZVNldDtcclxufSgpKTtcclxuZXhwb3J0cy5Nb2R1bGVTZXQgPSBNb2R1bGVTZXQ7XHJcbnZhciBMaW5rU2V0cyA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBMaW5rU2V0cygpIHtcclxuICAgICAgICB0aGlzLnNldHMgPSB7fTtcclxuICAgICAgICB0aGlzLm4gPSAwO1xyXG4gICAgfVxyXG4gICAgTGlua1NldHMucHJvdG90eXBlLmNvdW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm47XHJcbiAgICB9O1xyXG4gICAgTGlua1NldHMucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZm9yQWxsTW9kdWxlcyhmdW5jdGlvbiAobSkge1xyXG4gICAgICAgICAgICBpZiAoIXJlc3VsdCAmJiBtLmlkID09IGlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBMaW5rU2V0cy5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGxpbmt0eXBlLCBtKSB7XHJcbiAgICAgICAgdmFyIHMgPSBsaW5rdHlwZSBpbiB0aGlzLnNldHMgPyB0aGlzLnNldHNbbGlua3R5cGVdIDogdGhpcy5zZXRzW2xpbmt0eXBlXSA9IG5ldyBNb2R1bGVTZXQoKTtcclxuICAgICAgICBzLmFkZChtKTtcclxuICAgICAgICArK3RoaXMubjtcclxuICAgIH07XHJcbiAgICBMaW5rU2V0cy5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGxpbmt0eXBlLCBtKSB7XHJcbiAgICAgICAgdmFyIG1zID0gdGhpcy5zZXRzW2xpbmt0eXBlXTtcclxuICAgICAgICBtcy5yZW1vdmUobSk7XHJcbiAgICAgICAgaWYgKG1zLmNvdW50KCkgPT09IDApIHtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuc2V0c1tsaW5rdHlwZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC0tdGhpcy5uO1xyXG4gICAgfTtcclxuICAgIExpbmtTZXRzLnByb3RvdHlwZS5mb3JBbGwgPSBmdW5jdGlvbiAoZikge1xyXG4gICAgICAgIGZvciAodmFyIGxpbmt0eXBlIGluIHRoaXMuc2V0cykge1xyXG4gICAgICAgICAgICBmKHRoaXMuc2V0c1tsaW5rdHlwZV0sIE51bWJlcihsaW5rdHlwZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBMaW5rU2V0cy5wcm90b3R5cGUuZm9yQWxsTW9kdWxlcyA9IGZ1bmN0aW9uIChmKSB7XHJcbiAgICAgICAgdGhpcy5mb3JBbGwoZnVuY3Rpb24gKG1zLCBsdCkgeyByZXR1cm4gbXMuZm9yQWxsKGYpOyB9KTtcclxuICAgIH07XHJcbiAgICBMaW5rU2V0cy5wcm90b3R5cGUuaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24gKG90aGVyKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBMaW5rU2V0cygpO1xyXG4gICAgICAgIHRoaXMuZm9yQWxsKGZ1bmN0aW9uIChtcywgbHQpIHtcclxuICAgICAgICAgICAgaWYgKGx0IGluIG90aGVyLnNldHMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpID0gbXMuaW50ZXJzZWN0aW9uKG90aGVyLnNldHNbbHRdKSwgbiA9IGkuY291bnQoKTtcclxuICAgICAgICAgICAgICAgIGlmIChuID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5zZXRzW2x0XSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0Lm4gKz0gbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIExpbmtTZXRzO1xyXG59KCkpO1xyXG5leHBvcnRzLkxpbmtTZXRzID0gTGlua1NldHM7XHJcbmZ1bmN0aW9uIGludGVyc2VjdGlvbkNvdW50KG0sIG4pIHtcclxuICAgIHJldHVybiBPYmplY3Qua2V5cyhpbnRlcnNlY3Rpb24obSwgbikpLmxlbmd0aDtcclxufVxyXG5mdW5jdGlvbiBnZXRHcm91cHMobm9kZXMsIGxpbmtzLCBsYSwgcm9vdEdyb3VwKSB7XHJcbiAgICB2YXIgbiA9IG5vZGVzLmxlbmd0aCwgYyA9IG5ldyBDb25maWd1cmF0aW9uKG4sIGxpbmtzLCBsYSwgcm9vdEdyb3VwKTtcclxuICAgIHdoaWxlIChjLmdyZWVkeU1lcmdlKCkpXHJcbiAgICAgICAgO1xyXG4gICAgdmFyIHBvd2VyRWRnZXMgPSBbXTtcclxuICAgIHZhciBnID0gYy5nZXRHcm91cEhpZXJhcmNoeShwb3dlckVkZ2VzKTtcclxuICAgIHBvd2VyRWRnZXMuZm9yRWFjaChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciBmID0gZnVuY3Rpb24gKGVuZCkge1xyXG4gICAgICAgICAgICB2YXIgZyA9IGVbZW5kXTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBnID09IFwibnVtYmVyXCIpXHJcbiAgICAgICAgICAgICAgICBlW2VuZF0gPSBub2Rlc1tnXTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGYoXCJzb3VyY2VcIik7XHJcbiAgICAgICAgZihcInRhcmdldFwiKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHsgZ3JvdXBzOiBnLCBwb3dlckVkZ2VzOiBwb3dlckVkZ2VzIH07XHJcbn1cclxuZXhwb3J0cy5nZXRHcm91cHMgPSBnZXRHcm91cHM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBvd2VyZ3JhcGguanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvd2ViY29sYS9kaXN0L3NyYy9wb3dlcmdyYXBoLmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFRyZWVCYXNlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFRyZWVCYXNlKCkge1xyXG4gICAgICAgIHRoaXMuZmluZEl0ZXIgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICB2YXIgcmVzID0gdGhpcy5fcm9vdDtcclxuICAgICAgICAgICAgdmFyIGl0ZXIgPSB0aGlzLml0ZXJhdG9yKCk7XHJcbiAgICAgICAgICAgIHdoaWxlIChyZXMgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjID0gdGhpcy5fY29tcGFyYXRvcihkYXRhLCByZXMuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYyA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZXIuX2N1cnNvciA9IHJlcztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZXIuX2FuY2VzdG9ycy5wdXNoKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzID0gcmVzLmdldF9jaGlsZChjID4gMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIFRyZWVCYXNlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLl9yb290ID0gbnVsbDtcclxuICAgICAgICB0aGlzLnNpemUgPSAwO1xyXG4gICAgfTtcclxuICAgIDtcclxuICAgIFRyZWVCYXNlLnByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICB2YXIgcmVzID0gdGhpcy5fcm9vdDtcclxuICAgICAgICB3aGlsZSAocmVzICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHZhciBjID0gdGhpcy5fY29tcGFyYXRvcihkYXRhLCByZXMuZGF0YSk7XHJcbiAgICAgICAgICAgIGlmIChjID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXMgPSByZXMuZ2V0X2NoaWxkKGMgPiAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH07XHJcbiAgICA7XHJcbiAgICBUcmVlQmFzZS5wcm90b3R5cGUubG93ZXJCb3VuZCA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kKGRhdGEsIHRoaXMuX2NvbXBhcmF0b3IpO1xyXG4gICAgfTtcclxuICAgIDtcclxuICAgIFRyZWVCYXNlLnByb3RvdHlwZS51cHBlckJvdW5kID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICB2YXIgY21wID0gdGhpcy5fY29tcGFyYXRvcjtcclxuICAgICAgICBmdW5jdGlvbiByZXZlcnNlX2NtcChhLCBiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjbXAoYiwgYSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9ib3VuZChkYXRhLCByZXZlcnNlX2NtcCk7XHJcbiAgICB9O1xyXG4gICAgO1xyXG4gICAgVHJlZUJhc2UucHJvdG90eXBlLm1pbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmVzID0gdGhpcy5fcm9vdDtcclxuICAgICAgICBpZiAocmVzID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aGlsZSAocmVzLmxlZnQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmVzID0gcmVzLmxlZnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXMuZGF0YTtcclxuICAgIH07XHJcbiAgICA7XHJcbiAgICBUcmVlQmFzZS5wcm90b3R5cGUubWF4ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciByZXMgPSB0aGlzLl9yb290O1xyXG4gICAgICAgIGlmIChyZXMgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdoaWxlIChyZXMucmlnaHQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmVzID0gcmVzLnJpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICB9O1xyXG4gICAgO1xyXG4gICAgVHJlZUJhc2UucHJvdG90eXBlLml0ZXJhdG9yID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgSXRlcmF0b3IodGhpcyk7XHJcbiAgICB9O1xyXG4gICAgO1xyXG4gICAgVHJlZUJhc2UucHJvdG90eXBlLmVhY2ggPSBmdW5jdGlvbiAoY2IpIHtcclxuICAgICAgICB2YXIgaXQgPSB0aGlzLml0ZXJhdG9yKCksIGRhdGE7XHJcbiAgICAgICAgd2hpbGUgKChkYXRhID0gaXQubmV4dCgpKSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjYihkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgO1xyXG4gICAgVHJlZUJhc2UucHJvdG90eXBlLnJlYWNoID0gZnVuY3Rpb24gKGNiKSB7XHJcbiAgICAgICAgdmFyIGl0ID0gdGhpcy5pdGVyYXRvcigpLCBkYXRhO1xyXG4gICAgICAgIHdoaWxlICgoZGF0YSA9IGl0LnByZXYoKSkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgY2IoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIDtcclxuICAgIFRyZWVCYXNlLnByb3RvdHlwZS5fYm91bmQgPSBmdW5jdGlvbiAoZGF0YSwgY21wKSB7XHJcbiAgICAgICAgdmFyIGN1ciA9IHRoaXMuX3Jvb3Q7XHJcbiAgICAgICAgdmFyIGl0ZXIgPSB0aGlzLml0ZXJhdG9yKCk7XHJcbiAgICAgICAgd2hpbGUgKGN1ciAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB2YXIgYyA9IHRoaXMuX2NvbXBhcmF0b3IoZGF0YSwgY3VyLmRhdGEpO1xyXG4gICAgICAgICAgICBpZiAoYyA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgaXRlci5fY3Vyc29yID0gY3VyO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaXRlci5fYW5jZXN0b3JzLnB1c2goY3VyKTtcclxuICAgICAgICAgICAgY3VyID0gY3VyLmdldF9jaGlsZChjID4gMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSBpdGVyLl9hbmNlc3RvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcclxuICAgICAgICAgICAgY3VyID0gaXRlci5fYW5jZXN0b3JzW2ldO1xyXG4gICAgICAgICAgICBpZiAoY21wKGRhdGEsIGN1ci5kYXRhKSA+IDApIHtcclxuICAgICAgICAgICAgICAgIGl0ZXIuX2N1cnNvciA9IGN1cjtcclxuICAgICAgICAgICAgICAgIGl0ZXIuX2FuY2VzdG9ycy5sZW5ndGggPSBpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaXRlci5fYW5jZXN0b3JzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgcmV0dXJuIGl0ZXI7XHJcbiAgICB9O1xyXG4gICAgO1xyXG4gICAgcmV0dXJuIFRyZWVCYXNlO1xyXG59KCkpO1xyXG5leHBvcnRzLlRyZWVCYXNlID0gVHJlZUJhc2U7XHJcbnZhciBJdGVyYXRvciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBJdGVyYXRvcih0cmVlKSB7XHJcbiAgICAgICAgdGhpcy5fdHJlZSA9IHRyZWU7XHJcbiAgICAgICAgdGhpcy5fYW5jZXN0b3JzID0gW107XHJcbiAgICAgICAgdGhpcy5fY3Vyc29yID0gbnVsbDtcclxuICAgIH1cclxuICAgIEl0ZXJhdG9yLnByb3RvdHlwZS5kYXRhID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJzb3IgIT09IG51bGwgPyB0aGlzLl9jdXJzb3IuZGF0YSA6IG51bGw7XHJcbiAgICB9O1xyXG4gICAgO1xyXG4gICAgSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2N1cnNvciA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB2YXIgcm9vdCA9IHRoaXMuX3RyZWUuX3Jvb3Q7XHJcbiAgICAgICAgICAgIGlmIChyb290ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9taW5Ob2RlKHJvb3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY3Vyc29yLnJpZ2h0ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2F2ZTtcclxuICAgICAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgICAgICBzYXZlID0gdGhpcy5fY3Vyc29yO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hbmNlc3RvcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1cnNvciA9IHRoaXMuX2FuY2VzdG9ycy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1cnNvciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gd2hpbGUgKHRoaXMuX2N1cnNvci5yaWdodCA9PT0gc2F2ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hbmNlc3RvcnMucHVzaCh0aGlzLl9jdXJzb3IpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWluTm9kZSh0aGlzLl9jdXJzb3IucmlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJzb3IgIT09IG51bGwgPyB0aGlzLl9jdXJzb3IuZGF0YSA6IG51bGw7XHJcbiAgICB9O1xyXG4gICAgO1xyXG4gICAgSXRlcmF0b3IucHJvdG90eXBlLnByZXYgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2N1cnNvciA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB2YXIgcm9vdCA9IHRoaXMuX3RyZWUuX3Jvb3Q7XHJcbiAgICAgICAgICAgIGlmIChyb290ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXhOb2RlKHJvb3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY3Vyc29yLmxlZnQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzYXZlO1xyXG4gICAgICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNhdmUgPSB0aGlzLl9jdXJzb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2FuY2VzdG9ycy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3Vyc29yID0gdGhpcy5fYW5jZXN0b3JzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3Vyc29yID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSB3aGlsZSAodGhpcy5fY3Vyc29yLmxlZnQgPT09IHNhdmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYW5jZXN0b3JzLnB1c2godGhpcy5fY3Vyc29yKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21heE5vZGUodGhpcy5fY3Vyc29yLmxlZnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJzb3IgIT09IG51bGwgPyB0aGlzLl9jdXJzb3IuZGF0YSA6IG51bGw7XHJcbiAgICB9O1xyXG4gICAgO1xyXG4gICAgSXRlcmF0b3IucHJvdG90eXBlLl9taW5Ob2RlID0gZnVuY3Rpb24gKHN0YXJ0KSB7XHJcbiAgICAgICAgd2hpbGUgKHN0YXJ0LmxlZnQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5fYW5jZXN0b3JzLnB1c2goc3RhcnQpO1xyXG4gICAgICAgICAgICBzdGFydCA9IHN0YXJ0LmxlZnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2N1cnNvciA9IHN0YXJ0O1xyXG4gICAgfTtcclxuICAgIDtcclxuICAgIEl0ZXJhdG9yLnByb3RvdHlwZS5fbWF4Tm9kZSA9IGZ1bmN0aW9uIChzdGFydCkge1xyXG4gICAgICAgIHdoaWxlIChzdGFydC5yaWdodCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9hbmNlc3RvcnMucHVzaChzdGFydCk7XHJcbiAgICAgICAgICAgIHN0YXJ0ID0gc3RhcnQucmlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2N1cnNvciA9IHN0YXJ0O1xyXG4gICAgfTtcclxuICAgIDtcclxuICAgIHJldHVybiBJdGVyYXRvcjtcclxufSgpKTtcclxuZXhwb3J0cy5JdGVyYXRvciA9IEl0ZXJhdG9yO1xyXG52YXIgTm9kZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBOb2RlKGRhdGEpIHtcclxuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIHRoaXMubGVmdCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5yaWdodCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5yZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgTm9kZS5wcm90b3R5cGUuZ2V0X2NoaWxkID0gZnVuY3Rpb24gKGRpcikge1xyXG4gICAgICAgIHJldHVybiBkaXIgPyB0aGlzLnJpZ2h0IDogdGhpcy5sZWZ0O1xyXG4gICAgfTtcclxuICAgIDtcclxuICAgIE5vZGUucHJvdG90eXBlLnNldF9jaGlsZCA9IGZ1bmN0aW9uIChkaXIsIHZhbCkge1xyXG4gICAgICAgIGlmIChkaXIpIHtcclxuICAgICAgICAgICAgdGhpcy5yaWdodCA9IHZhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubGVmdCA9IHZhbDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgO1xyXG4gICAgcmV0dXJuIE5vZGU7XHJcbn0oKSk7XHJcbnZhciBSQlRyZWUgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKFJCVHJlZSwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIFJCVHJlZShjb21wYXJhdG9yKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5fcm9vdCA9IG51bGw7XHJcbiAgICAgICAgX3RoaXMuX2NvbXBhcmF0b3IgPSBjb21wYXJhdG9yO1xyXG4gICAgICAgIF90aGlzLnNpemUgPSAwO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIFJCVHJlZS5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICB2YXIgcmV0ID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Jvb3QgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5fcm9vdCA9IG5ldyBOb2RlKGRhdGEpO1xyXG4gICAgICAgICAgICByZXQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnNpemUrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBoZWFkID0gbmV3IE5vZGUodW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgdmFyIGRpciA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgbGFzdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgZ3AgPSBudWxsO1xyXG4gICAgICAgICAgICB2YXIgZ2dwID0gaGVhZDtcclxuICAgICAgICAgICAgdmFyIHAgPSBudWxsO1xyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XHJcbiAgICAgICAgICAgIGdncC5yaWdodCA9IHRoaXMuX3Jvb3Q7XHJcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUgPSBuZXcgTm9kZShkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBwLnNldF9jaGlsZChkaXIsIG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaXplKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChSQlRyZWUuaXNfcmVkKG5vZGUubGVmdCkgJiYgUkJUcmVlLmlzX3JlZChub2RlLnJpZ2h0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUucmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBub2RlLmxlZnQucmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5yaWdodC5yZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChSQlRyZWUuaXNfcmVkKG5vZGUpICYmIFJCVHJlZS5pc19yZWQocCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGlyMiA9IGdncC5yaWdodCA9PT0gZ3A7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUgPT09IHAuZ2V0X2NoaWxkKGxhc3QpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdncC5zZXRfY2hpbGQoZGlyMiwgUkJUcmVlLnNpbmdsZV9yb3RhdGUoZ3AsICFsYXN0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnZ3Auc2V0X2NoaWxkKGRpcjIsIFJCVHJlZS5kb3VibGVfcm90YXRlKGdwLCAhbGFzdCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBjbXAgPSB0aGlzLl9jb21wYXJhdG9yKG5vZGUuZGF0YSwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY21wID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsYXN0ID0gZGlyO1xyXG4gICAgICAgICAgICAgICAgZGlyID0gY21wIDwgMDtcclxuICAgICAgICAgICAgICAgIGlmIChncCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGdncCA9IGdwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZ3AgPSBwO1xyXG4gICAgICAgICAgICAgICAgcCA9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICBub2RlID0gbm9kZS5nZXRfY2hpbGQoZGlyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9yb290ID0gaGVhZC5yaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcm9vdC5yZWQgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfTtcclxuICAgIDtcclxuICAgIFJCVHJlZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICBpZiAodGhpcy5fcm9vdCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBoZWFkID0gbmV3IE5vZGUodW5kZWZpbmVkKTtcclxuICAgICAgICB2YXIgbm9kZSA9IGhlYWQ7XHJcbiAgICAgICAgbm9kZS5yaWdodCA9IHRoaXMuX3Jvb3Q7XHJcbiAgICAgICAgdmFyIHAgPSBudWxsO1xyXG4gICAgICAgIHZhciBncCA9IG51bGw7XHJcbiAgICAgICAgdmFyIGZvdW5kID0gbnVsbDtcclxuICAgICAgICB2YXIgZGlyID0gdHJ1ZTtcclxuICAgICAgICB3aGlsZSAobm9kZS5nZXRfY2hpbGQoZGlyKSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB2YXIgbGFzdCA9IGRpcjtcclxuICAgICAgICAgICAgZ3AgPSBwO1xyXG4gICAgICAgICAgICBwID0gbm9kZTtcclxuICAgICAgICAgICAgbm9kZSA9IG5vZGUuZ2V0X2NoaWxkKGRpcik7XHJcbiAgICAgICAgICAgIHZhciBjbXAgPSB0aGlzLl9jb21wYXJhdG9yKGRhdGEsIG5vZGUuZGF0YSk7XHJcbiAgICAgICAgICAgIGRpciA9IGNtcCA+IDA7XHJcbiAgICAgICAgICAgIGlmIChjbXAgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGZvdW5kID0gbm9kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIVJCVHJlZS5pc19yZWQobm9kZSkgJiYgIVJCVHJlZS5pc19yZWQobm9kZS5nZXRfY2hpbGQoZGlyKSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChSQlRyZWUuaXNfcmVkKG5vZGUuZ2V0X2NoaWxkKCFkaXIpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzciA9IFJCVHJlZS5zaW5nbGVfcm90YXRlKG5vZGUsIGRpcik7XHJcbiAgICAgICAgICAgICAgICAgICAgcC5zZXRfY2hpbGQobGFzdCwgc3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHAgPSBzcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFSQlRyZWUuaXNfcmVkKG5vZGUuZ2V0X2NoaWxkKCFkaXIpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzaWJsaW5nID0gcC5nZXRfY2hpbGQoIWxhc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaWJsaW5nICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghUkJUcmVlLmlzX3JlZChzaWJsaW5nLmdldF9jaGlsZCghbGFzdCkpICYmICFSQlRyZWUuaXNfcmVkKHNpYmxpbmcuZ2V0X2NoaWxkKGxhc3QpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcC5yZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpYmxpbmcucmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUucmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkaXIyID0gZ3AucmlnaHQgPT09IHA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoUkJUcmVlLmlzX3JlZChzaWJsaW5nLmdldF9jaGlsZChsYXN0KSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncC5zZXRfY2hpbGQoZGlyMiwgUkJUcmVlLmRvdWJsZV9yb3RhdGUocCwgbGFzdCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoUkJUcmVlLmlzX3JlZChzaWJsaW5nLmdldF9jaGlsZCghbGFzdCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3Auc2V0X2NoaWxkKGRpcjIsIFJCVHJlZS5zaW5nbGVfcm90YXRlKHAsIGxhc3QpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBncGMgPSBncC5nZXRfY2hpbGQoZGlyMik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncGMucmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUucmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdwYy5sZWZ0LnJlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3BjLnJpZ2h0LnJlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChmb3VuZCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBmb3VuZC5kYXRhID0gbm9kZS5kYXRhO1xyXG4gICAgICAgICAgICBwLnNldF9jaGlsZChwLnJpZ2h0ID09PSBub2RlLCBub2RlLmdldF9jaGlsZChub2RlLmxlZnQgPT09IG51bGwpKTtcclxuICAgICAgICAgICAgdGhpcy5zaXplLS07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3Jvb3QgPSBoZWFkLnJpZ2h0O1xyXG4gICAgICAgIGlmICh0aGlzLl9yb290ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jvb3QucmVkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmb3VuZCAhPT0gbnVsbDtcclxuICAgIH07XHJcbiAgICA7XHJcbiAgICBSQlRyZWUuaXNfcmVkID0gZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgICAgICByZXR1cm4gbm9kZSAhPT0gbnVsbCAmJiBub2RlLnJlZDtcclxuICAgIH07XHJcbiAgICBSQlRyZWUuc2luZ2xlX3JvdGF0ZSA9IGZ1bmN0aW9uIChyb290LCBkaXIpIHtcclxuICAgICAgICB2YXIgc2F2ZSA9IHJvb3QuZ2V0X2NoaWxkKCFkaXIpO1xyXG4gICAgICAgIHJvb3Quc2V0X2NoaWxkKCFkaXIsIHNhdmUuZ2V0X2NoaWxkKGRpcikpO1xyXG4gICAgICAgIHNhdmUuc2V0X2NoaWxkKGRpciwgcm9vdCk7XHJcbiAgICAgICAgcm9vdC5yZWQgPSB0cnVlO1xyXG4gICAgICAgIHNhdmUucmVkID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHNhdmU7XHJcbiAgICB9O1xyXG4gICAgUkJUcmVlLmRvdWJsZV9yb3RhdGUgPSBmdW5jdGlvbiAocm9vdCwgZGlyKSB7XHJcbiAgICAgICAgcm9vdC5zZXRfY2hpbGQoIWRpciwgUkJUcmVlLnNpbmdsZV9yb3RhdGUocm9vdC5nZXRfY2hpbGQoIWRpciksICFkaXIpKTtcclxuICAgICAgICByZXR1cm4gUkJUcmVlLnNpbmdsZV9yb3RhdGUocm9vdCwgZGlyKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gUkJUcmVlO1xyXG59KFRyZWVCYXNlKSk7XHJcbmV4cG9ydHMuUkJUcmVlID0gUkJUcmVlO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1yYnRyZWUuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvd2ViY29sYS9kaXN0L3NyYy9yYnRyZWUuanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBQYWlyaW5nSGVhcCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBQYWlyaW5nSGVhcChlbGVtKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtID0gZWxlbTtcclxuICAgICAgICB0aGlzLnN1YmhlYXBzID0gW107XHJcbiAgICB9XHJcbiAgICBQYWlyaW5nSGVhcC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcclxuICAgICAgICB2YXIgc3RyID0gXCJcIiwgbmVlZENvbW1hID0gZmFsc2U7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN1YmhlYXBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhciBzdWJoZWFwID0gdGhpcy5zdWJoZWFwc1tpXTtcclxuICAgICAgICAgICAgaWYgKCFzdWJoZWFwLmVsZW0pIHtcclxuICAgICAgICAgICAgICAgIG5lZWRDb21tYSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5lZWRDb21tYSkge1xyXG4gICAgICAgICAgICAgICAgc3RyID0gc3RyICsgXCIsXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3RyID0gc3RyICsgc3ViaGVhcC50b1N0cmluZyhzZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIG5lZWRDb21tYSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzdHIgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgc3RyID0gXCIoXCIgKyBzdHIgKyBcIilcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmVsZW0gPyBzZWxlY3Rvcih0aGlzLmVsZW0pIDogXCJcIikgKyBzdHI7XHJcbiAgICB9O1xyXG4gICAgUGFpcmluZ0hlYXAucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoZikge1xyXG4gICAgICAgIGlmICghdGhpcy5lbXB0eSgpKSB7XHJcbiAgICAgICAgICAgIGYodGhpcy5lbGVtLCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5zdWJoZWFwcy5mb3JFYWNoKGZ1bmN0aW9uIChzKSB7IHJldHVybiBzLmZvckVhY2goZik7IH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQYWlyaW5nSGVhcC5wcm90b3R5cGUuY291bnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW1wdHkoKSA/IDAgOiAxICsgdGhpcy5zdWJoZWFwcy5yZWR1Y2UoZnVuY3Rpb24gKG4sIGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG4gKyBoLmNvdW50KCk7XHJcbiAgICAgICAgfSwgMCk7XHJcbiAgICB9O1xyXG4gICAgUGFpcmluZ0hlYXAucHJvdG90eXBlLm1pbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbGVtO1xyXG4gICAgfTtcclxuICAgIFBhaXJpbmdIZWFwLnByb3RvdHlwZS5lbXB0eSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbGVtID09IG51bGw7XHJcbiAgICB9O1xyXG4gICAgUGFpcmluZ0hlYXAucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGgpIHtcclxuICAgICAgICBpZiAodGhpcyA9PT0gaClcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN1YmhlYXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1YmhlYXBzW2ldLmNvbnRhaW5zKGgpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgICBQYWlyaW5nSGVhcC5wcm90b3R5cGUuaXNIZWFwID0gZnVuY3Rpb24gKGxlc3NUaGFuKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICByZXR1cm4gdGhpcy5zdWJoZWFwcy5ldmVyeShmdW5jdGlvbiAoaCkgeyByZXR1cm4gbGVzc1RoYW4oX3RoaXMuZWxlbSwgaC5lbGVtKSAmJiBoLmlzSGVhcChsZXNzVGhhbik7IH0pO1xyXG4gICAgfTtcclxuICAgIFBhaXJpbmdIZWFwLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAob2JqLCBsZXNzVGhhbikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1lcmdlKG5ldyBQYWlyaW5nSGVhcChvYmopLCBsZXNzVGhhbik7XHJcbiAgICB9O1xyXG4gICAgUGFpcmluZ0hlYXAucHJvdG90eXBlLm1lcmdlID0gZnVuY3Rpb24gKGhlYXAyLCBsZXNzVGhhbikge1xyXG4gICAgICAgIGlmICh0aGlzLmVtcHR5KCkpXHJcbiAgICAgICAgICAgIHJldHVybiBoZWFwMjtcclxuICAgICAgICBlbHNlIGlmIChoZWFwMi5lbXB0eSgpKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICBlbHNlIGlmIChsZXNzVGhhbih0aGlzLmVsZW0sIGhlYXAyLmVsZW0pKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3ViaGVhcHMucHVzaChoZWFwMik7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaGVhcDIuc3ViaGVhcHMucHVzaCh0aGlzKTtcclxuICAgICAgICAgICAgcmV0dXJuIGhlYXAyO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQYWlyaW5nSGVhcC5wcm90b3R5cGUucmVtb3ZlTWluID0gZnVuY3Rpb24gKGxlc3NUaGFuKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZW1wdHkoKSlcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tZXJnZVBhaXJzKGxlc3NUaGFuKTtcclxuICAgIH07XHJcbiAgICBQYWlyaW5nSGVhcC5wcm90b3R5cGUubWVyZ2VQYWlycyA9IGZ1bmN0aW9uIChsZXNzVGhhbikge1xyXG4gICAgICAgIGlmICh0aGlzLnN1YmhlYXBzLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFBhaXJpbmdIZWFwKG51bGwpO1xyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc3ViaGVhcHMubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ViaGVhcHNbMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgZmlyc3RQYWlyID0gdGhpcy5zdWJoZWFwcy5wb3AoKS5tZXJnZSh0aGlzLnN1YmhlYXBzLnBvcCgpLCBsZXNzVGhhbik7XHJcbiAgICAgICAgICAgIHZhciByZW1haW5pbmcgPSB0aGlzLm1lcmdlUGFpcnMobGVzc1RoYW4pO1xyXG4gICAgICAgICAgICByZXR1cm4gZmlyc3RQYWlyLm1lcmdlKHJlbWFpbmluZywgbGVzc1RoYW4pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQYWlyaW5nSGVhcC5wcm90b3R5cGUuZGVjcmVhc2VLZXkgPSBmdW5jdGlvbiAoc3ViaGVhcCwgbmV3VmFsdWUsIHNldEhlYXBOb2RlLCBsZXNzVGhhbikge1xyXG4gICAgICAgIHZhciBuZXdIZWFwID0gc3ViaGVhcC5yZW1vdmVNaW4obGVzc1RoYW4pO1xyXG4gICAgICAgIHN1YmhlYXAuZWxlbSA9IG5ld0hlYXAuZWxlbTtcclxuICAgICAgICBzdWJoZWFwLnN1YmhlYXBzID0gbmV3SGVhcC5zdWJoZWFwcztcclxuICAgICAgICBpZiAoc2V0SGVhcE5vZGUgIT09IG51bGwgJiYgbmV3SGVhcC5lbGVtICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHNldEhlYXBOb2RlKHN1YmhlYXAuZWxlbSwgc3ViaGVhcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwYWlyaW5nTm9kZSA9IG5ldyBQYWlyaW5nSGVhcChuZXdWYWx1ZSk7XHJcbiAgICAgICAgaWYgKHNldEhlYXBOb2RlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHNldEhlYXBOb2RlKG5ld1ZhbHVlLCBwYWlyaW5nTm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLm1lcmdlKHBhaXJpbmdOb2RlLCBsZXNzVGhhbik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFBhaXJpbmdIZWFwO1xyXG59KCkpO1xyXG5leHBvcnRzLlBhaXJpbmdIZWFwID0gUGFpcmluZ0hlYXA7XHJcbnZhciBQcmlvcml0eVF1ZXVlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFByaW9yaXR5UXVldWUobGVzc1RoYW4pIHtcclxuICAgICAgICB0aGlzLmxlc3NUaGFuID0gbGVzc1RoYW47XHJcbiAgICB9XHJcbiAgICBQcmlvcml0eVF1ZXVlLnByb3RvdHlwZS50b3AgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZW1wdHkoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm9vdC5lbGVtO1xyXG4gICAgfTtcclxuICAgIFByaW9yaXR5UXVldWUucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwYWlyaW5nTm9kZTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgYXJnOyBhcmcgPSBhcmdzW2ldOyArK2kpIHtcclxuICAgICAgICAgICAgcGFpcmluZ05vZGUgPSBuZXcgUGFpcmluZ0hlYXAoYXJnKTtcclxuICAgICAgICAgICAgdGhpcy5yb290ID0gdGhpcy5lbXB0eSgpID9cclxuICAgICAgICAgICAgICAgIHBhaXJpbmdOb2RlIDogdGhpcy5yb290Lm1lcmdlKHBhaXJpbmdOb2RlLCB0aGlzLmxlc3NUaGFuKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhaXJpbmdOb2RlO1xyXG4gICAgfTtcclxuICAgIFByaW9yaXR5UXVldWUucHJvdG90eXBlLmVtcHR5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAhdGhpcy5yb290IHx8ICF0aGlzLnJvb3QuZWxlbTtcclxuICAgIH07XHJcbiAgICBQcmlvcml0eVF1ZXVlLnByb3RvdHlwZS5pc0hlYXAgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm9vdC5pc0hlYXAodGhpcy5sZXNzVGhhbik7XHJcbiAgICB9O1xyXG4gICAgUHJpb3JpdHlRdWV1ZS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChmKSB7XHJcbiAgICAgICAgdGhpcy5yb290LmZvckVhY2goZik7XHJcbiAgICB9O1xyXG4gICAgUHJpb3JpdHlRdWV1ZS5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmVtcHR5KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBvYmogPSB0aGlzLnJvb3QubWluKCk7XHJcbiAgICAgICAgdGhpcy5yb290ID0gdGhpcy5yb290LnJlbW92ZU1pbih0aGlzLmxlc3NUaGFuKTtcclxuICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgfTtcclxuICAgIFByaW9yaXR5UXVldWUucHJvdG90eXBlLnJlZHVjZUtleSA9IGZ1bmN0aW9uIChoZWFwTm9kZSwgbmV3S2V5LCBzZXRIZWFwTm9kZSkge1xyXG4gICAgICAgIGlmIChzZXRIZWFwTm9kZSA9PT0gdm9pZCAwKSB7IHNldEhlYXBOb2RlID0gbnVsbDsgfVxyXG4gICAgICAgIHRoaXMucm9vdCA9IHRoaXMucm9vdC5kZWNyZWFzZUtleShoZWFwTm9kZSwgbmV3S2V5LCBzZXRIZWFwTm9kZSwgdGhpcy5sZXNzVGhhbik7XHJcbiAgICB9O1xyXG4gICAgUHJpb3JpdHlRdWV1ZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb290LnRvU3RyaW5nKHNlbGVjdG9yKTtcclxuICAgIH07XHJcbiAgICBQcmlvcml0eVF1ZXVlLnByb3RvdHlwZS5jb3VudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb290LmNvdW50KCk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFByaW9yaXR5UXVldWU7XHJcbn0oKSk7XHJcbmV4cG9ydHMuUHJpb3JpdHlRdWV1ZSA9IFByaW9yaXR5UXVldWU7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBxdWV1ZS5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy93ZWJjb2xhL2Rpc3Qvc3JjL3BxdWV1ZS5qc1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciByZWN0YW5nbGVfMSA9IHJlcXVpcmUoXCIuL3JlY3RhbmdsZVwiKTtcclxudmFyIFBvaW50ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFBvaW50KCkge1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFBvaW50O1xyXG59KCkpO1xyXG5leHBvcnRzLlBvaW50ID0gUG9pbnQ7XHJcbnZhciBMaW5lU2VnbWVudCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBMaW5lU2VnbWVudCh4MSwgeTEsIHgyLCB5Mikge1xyXG4gICAgICAgIHRoaXMueDEgPSB4MTtcclxuICAgICAgICB0aGlzLnkxID0geTE7XHJcbiAgICAgICAgdGhpcy54MiA9IHgyO1xyXG4gICAgICAgIHRoaXMueTIgPSB5MjtcclxuICAgIH1cclxuICAgIHJldHVybiBMaW5lU2VnbWVudDtcclxufSgpKTtcclxuZXhwb3J0cy5MaW5lU2VnbWVudCA9IExpbmVTZWdtZW50O1xyXG52YXIgUG9seVBvaW50ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhQb2x5UG9pbnQsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBQb2x5UG9pbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFBvbHlQb2ludDtcclxufShQb2ludCkpO1xyXG5leHBvcnRzLlBvbHlQb2ludCA9IFBvbHlQb2ludDtcclxuZnVuY3Rpb24gaXNMZWZ0KFAwLCBQMSwgUDIpIHtcclxuICAgIHJldHVybiAoUDEueCAtIFAwLngpICogKFAyLnkgLSBQMC55KSAtIChQMi54IC0gUDAueCkgKiAoUDEueSAtIFAwLnkpO1xyXG59XHJcbmV4cG9ydHMuaXNMZWZ0ID0gaXNMZWZ0O1xyXG5mdW5jdGlvbiBhYm92ZShwLCB2aSwgdmopIHtcclxuICAgIHJldHVybiBpc0xlZnQocCwgdmksIHZqKSA+IDA7XHJcbn1cclxuZnVuY3Rpb24gYmVsb3cocCwgdmksIHZqKSB7XHJcbiAgICByZXR1cm4gaXNMZWZ0KHAsIHZpLCB2aikgPCAwO1xyXG59XHJcbmZ1bmN0aW9uIENvbnZleEh1bGwoUykge1xyXG4gICAgdmFyIFAgPSBTLnNsaWNlKDApLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGEueCAhPT0gYi54ID8gYi54IC0gYS54IDogYi55IC0gYS55OyB9KTtcclxuICAgIHZhciBuID0gUy5sZW5ndGgsIGk7XHJcbiAgICB2YXIgbWlubWluID0gMDtcclxuICAgIHZhciB4bWluID0gUFswXS54O1xyXG4gICAgZm9yIChpID0gMTsgaSA8IG47ICsraSkge1xyXG4gICAgICAgIGlmIChQW2ldLnggIT09IHhtaW4pXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgdmFyIG1pbm1heCA9IGkgLSAxO1xyXG4gICAgdmFyIEggPSBbXTtcclxuICAgIEgucHVzaChQW21pbm1pbl0pO1xyXG4gICAgaWYgKG1pbm1heCA9PT0gbiAtIDEpIHtcclxuICAgICAgICBpZiAoUFttaW5tYXhdLnkgIT09IFBbbWlubWluXS55KVxyXG4gICAgICAgICAgICBILnB1c2goUFttaW5tYXhdKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHZhciBtYXhtaW4sIG1heG1heCA9IG4gLSAxO1xyXG4gICAgICAgIHZhciB4bWF4ID0gUFtuIC0gMV0ueDtcclxuICAgICAgICBmb3IgKGkgPSBuIC0gMjsgaSA+PSAwOyBpLS0pXHJcbiAgICAgICAgICAgIGlmIChQW2ldLnggIT09IHhtYXgpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICBtYXhtaW4gPSBpICsgMTtcclxuICAgICAgICBpID0gbWlubWF4O1xyXG4gICAgICAgIHdoaWxlICgrK2kgPD0gbWF4bWluKSB7XHJcbiAgICAgICAgICAgIGlmIChpc0xlZnQoUFttaW5taW5dLCBQW21heG1pbl0sIFBbaV0pID49IDAgJiYgaSA8IG1heG1pbilcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB3aGlsZSAoSC5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNMZWZ0KEhbSC5sZW5ndGggLSAyXSwgSFtILmxlbmd0aCAtIDFdLCBQW2ldKSA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgSC5sZW5ndGggLT0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaSAhPSBtaW5taW4pXHJcbiAgICAgICAgICAgICAgICBILnB1c2goUFtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtYXhtYXggIT0gbWF4bWluKVxyXG4gICAgICAgICAgICBILnB1c2goUFttYXhtYXhdKTtcclxuICAgICAgICB2YXIgYm90ID0gSC5sZW5ndGg7XHJcbiAgICAgICAgaSA9IG1heG1pbjtcclxuICAgICAgICB3aGlsZSAoLS1pID49IG1pbm1heCkge1xyXG4gICAgICAgICAgICBpZiAoaXNMZWZ0KFBbbWF4bWF4XSwgUFttaW5tYXhdLCBQW2ldKSA+PSAwICYmIGkgPiBtaW5tYXgpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgd2hpbGUgKEgubGVuZ3RoID4gYm90KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNMZWZ0KEhbSC5sZW5ndGggLSAyXSwgSFtILmxlbmd0aCAtIDFdLCBQW2ldKSA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgSC5sZW5ndGggLT0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaSAhPSBtaW5taW4pXHJcbiAgICAgICAgICAgICAgICBILnB1c2goUFtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIEg7XHJcbn1cclxuZXhwb3J0cy5Db252ZXhIdWxsID0gQ29udmV4SHVsbDtcclxuZnVuY3Rpb24gY2xvY2t3aXNlUmFkaWFsU3dlZXAocCwgUCwgZikge1xyXG4gICAgUC5zbGljZSgwKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBNYXRoLmF0YW4yKGEueSAtIHAueSwgYS54IC0gcC54KSAtIE1hdGguYXRhbjIoYi55IC0gcC55LCBiLnggLSBwLngpOyB9KS5mb3JFYWNoKGYpO1xyXG59XHJcbmV4cG9ydHMuY2xvY2t3aXNlUmFkaWFsU3dlZXAgPSBjbG9ja3dpc2VSYWRpYWxTd2VlcDtcclxuZnVuY3Rpb24gbmV4dFBvbHlQb2ludChwLCBwcykge1xyXG4gICAgaWYgKHAucG9seUluZGV4ID09PSBwcy5sZW5ndGggLSAxKVxyXG4gICAgICAgIHJldHVybiBwc1swXTtcclxuICAgIHJldHVybiBwc1twLnBvbHlJbmRleCArIDFdO1xyXG59XHJcbmZ1bmN0aW9uIHByZXZQb2x5UG9pbnQocCwgcHMpIHtcclxuICAgIGlmIChwLnBvbHlJbmRleCA9PT0gMClcclxuICAgICAgICByZXR1cm4gcHNbcHMubGVuZ3RoIC0gMV07XHJcbiAgICByZXR1cm4gcHNbcC5wb2x5SW5kZXggLSAxXTtcclxufVxyXG5mdW5jdGlvbiB0YW5nZW50X1BvaW50UG9seUMoUCwgVikge1xyXG4gICAgcmV0dXJuIHsgcnRhbjogUnRhbmdlbnRfUG9pbnRQb2x5QyhQLCBWKSwgbHRhbjogTHRhbmdlbnRfUG9pbnRQb2x5QyhQLCBWKSB9O1xyXG59XHJcbmZ1bmN0aW9uIFJ0YW5nZW50X1BvaW50UG9seUMoUCwgVikge1xyXG4gICAgdmFyIG4gPSBWLmxlbmd0aCAtIDE7XHJcbiAgICB2YXIgYSwgYiwgYztcclxuICAgIHZhciB1cEEsIGRuQztcclxuICAgIGlmIChiZWxvdyhQLCBWWzFdLCBWWzBdKSAmJiAhYWJvdmUoUCwgVltuIC0gMV0sIFZbMF0pKVxyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgZm9yIChhID0gMCwgYiA9IG47Oykge1xyXG4gICAgICAgIGlmIChiIC0gYSA9PT0gMSlcclxuICAgICAgICAgICAgaWYgKGFib3ZlKFAsIFZbYV0sIFZbYl0pKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJldHVybiBiO1xyXG4gICAgICAgIGMgPSBNYXRoLmZsb29yKChhICsgYikgLyAyKTtcclxuICAgICAgICBkbkMgPSBiZWxvdyhQLCBWW2MgKyAxXSwgVltjXSk7XHJcbiAgICAgICAgaWYgKGRuQyAmJiAhYWJvdmUoUCwgVltjIC0gMV0sIFZbY10pKVxyXG4gICAgICAgICAgICByZXR1cm4gYztcclxuICAgICAgICB1cEEgPSBhYm92ZShQLCBWW2EgKyAxXSwgVlthXSk7XHJcbiAgICAgICAgaWYgKHVwQSkge1xyXG4gICAgICAgICAgICBpZiAoZG5DKVxyXG4gICAgICAgICAgICAgICAgYiA9IGM7XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFib3ZlKFAsIFZbYV0sIFZbY10pKVxyXG4gICAgICAgICAgICAgICAgICAgIGIgPSBjO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGEgPSBjO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIWRuQylcclxuICAgICAgICAgICAgICAgIGEgPSBjO1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChiZWxvdyhQLCBWW2FdLCBWW2NdKSlcclxuICAgICAgICAgICAgICAgICAgICBiID0gYztcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBhID0gYztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBMdGFuZ2VudF9Qb2ludFBvbHlDKFAsIFYpIHtcclxuICAgIHZhciBuID0gVi5sZW5ndGggLSAxO1xyXG4gICAgdmFyIGEsIGIsIGM7XHJcbiAgICB2YXIgZG5BLCBkbkM7XHJcbiAgICBpZiAoYWJvdmUoUCwgVltuIC0gMV0sIFZbMF0pICYmICFiZWxvdyhQLCBWWzFdLCBWWzBdKSlcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIGZvciAoYSA9IDAsIGIgPSBuOzspIHtcclxuICAgICAgICBpZiAoYiAtIGEgPT09IDEpXHJcbiAgICAgICAgICAgIGlmIChiZWxvdyhQLCBWW2FdLCBWW2JdKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYjtcclxuICAgICAgICBjID0gTWF0aC5mbG9vcigoYSArIGIpIC8gMik7XHJcbiAgICAgICAgZG5DID0gYmVsb3coUCwgVltjICsgMV0sIFZbY10pO1xyXG4gICAgICAgIGlmIChhYm92ZShQLCBWW2MgLSAxXSwgVltjXSkgJiYgIWRuQylcclxuICAgICAgICAgICAgcmV0dXJuIGM7XHJcbiAgICAgICAgZG5BID0gYmVsb3coUCwgVlthICsgMV0sIFZbYV0pO1xyXG4gICAgICAgIGlmIChkbkEpIHtcclxuICAgICAgICAgICAgaWYgKCFkbkMpXHJcbiAgICAgICAgICAgICAgICBiID0gYztcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmVsb3coUCwgVlthXSwgVltjXSkpXHJcbiAgICAgICAgICAgICAgICAgICAgYiA9IGM7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgYSA9IGM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChkbkMpXHJcbiAgICAgICAgICAgICAgICBhID0gYztcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWJvdmUoUCwgVlthXSwgVltjXSkpXHJcbiAgICAgICAgICAgICAgICAgICAgYiA9IGM7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgYSA9IGM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdGFuZ2VudF9Qb2x5UG9seUMoViwgVywgdDEsIHQyLCBjbXAxLCBjbXAyKSB7XHJcbiAgICB2YXIgaXgxLCBpeDI7XHJcbiAgICBpeDEgPSB0MShXWzBdLCBWKTtcclxuICAgIGl4MiA9IHQyKFZbaXgxXSwgVyk7XHJcbiAgICB2YXIgZG9uZSA9IGZhbHNlO1xyXG4gICAgd2hpbGUgKCFkb25lKSB7XHJcbiAgICAgICAgZG9uZSA9IHRydWU7XHJcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICAgICAgaWYgKGl4MSA9PT0gVi5sZW5ndGggLSAxKVxyXG4gICAgICAgICAgICAgICAgaXgxID0gMDtcclxuICAgICAgICAgICAgaWYgKGNtcDEoV1tpeDJdLCBWW2l4MV0sIFZbaXgxICsgMV0pKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICsraXgxO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgICAgICBpZiAoaXgyID09PSAwKVxyXG4gICAgICAgICAgICAgICAgaXgyID0gVy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICBpZiAoY21wMihWW2l4MV0sIFdbaXgyXSwgV1tpeDIgLSAxXSkpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgLS1peDI7XHJcbiAgICAgICAgICAgIGRvbmUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4geyB0MTogaXgxLCB0MjogaXgyIH07XHJcbn1cclxuZXhwb3J0cy50YW5nZW50X1BvbHlQb2x5QyA9IHRhbmdlbnRfUG9seVBvbHlDO1xyXG5mdW5jdGlvbiBMUnRhbmdlbnRfUG9seVBvbHlDKFYsIFcpIHtcclxuICAgIHZhciBybCA9IFJMdGFuZ2VudF9Qb2x5UG9seUMoVywgVik7XHJcbiAgICByZXR1cm4geyB0MTogcmwudDIsIHQyOiBybC50MSB9O1xyXG59XHJcbmV4cG9ydHMuTFJ0YW5nZW50X1BvbHlQb2x5QyA9IExSdGFuZ2VudF9Qb2x5UG9seUM7XHJcbmZ1bmN0aW9uIFJMdGFuZ2VudF9Qb2x5UG9seUMoViwgVykge1xyXG4gICAgcmV0dXJuIHRhbmdlbnRfUG9seVBvbHlDKFYsIFcsIFJ0YW5nZW50X1BvaW50UG9seUMsIEx0YW5nZW50X1BvaW50UG9seUMsIGFib3ZlLCBiZWxvdyk7XHJcbn1cclxuZXhwb3J0cy5STHRhbmdlbnRfUG9seVBvbHlDID0gUkx0YW5nZW50X1BvbHlQb2x5QztcclxuZnVuY3Rpb24gTEx0YW5nZW50X1BvbHlQb2x5QyhWLCBXKSB7XHJcbiAgICByZXR1cm4gdGFuZ2VudF9Qb2x5UG9seUMoViwgVywgTHRhbmdlbnRfUG9pbnRQb2x5QywgTHRhbmdlbnRfUG9pbnRQb2x5QywgYmVsb3csIGJlbG93KTtcclxufVxyXG5leHBvcnRzLkxMdGFuZ2VudF9Qb2x5UG9seUMgPSBMTHRhbmdlbnRfUG9seVBvbHlDO1xyXG5mdW5jdGlvbiBSUnRhbmdlbnRfUG9seVBvbHlDKFYsIFcpIHtcclxuICAgIHJldHVybiB0YW5nZW50X1BvbHlQb2x5QyhWLCBXLCBSdGFuZ2VudF9Qb2ludFBvbHlDLCBSdGFuZ2VudF9Qb2ludFBvbHlDLCBhYm92ZSwgYWJvdmUpO1xyXG59XHJcbmV4cG9ydHMuUlJ0YW5nZW50X1BvbHlQb2x5QyA9IFJSdGFuZ2VudF9Qb2x5UG9seUM7XHJcbnZhciBCaVRhbmdlbnQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gQmlUYW5nZW50KHQxLCB0Mikge1xyXG4gICAgICAgIHRoaXMudDEgPSB0MTtcclxuICAgICAgICB0aGlzLnQyID0gdDI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gQmlUYW5nZW50O1xyXG59KCkpO1xyXG5leHBvcnRzLkJpVGFuZ2VudCA9IEJpVGFuZ2VudDtcclxudmFyIEJpVGFuZ2VudHMgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gQmlUYW5nZW50cygpIHtcclxuICAgIH1cclxuICAgIHJldHVybiBCaVRhbmdlbnRzO1xyXG59KCkpO1xyXG5leHBvcnRzLkJpVGFuZ2VudHMgPSBCaVRhbmdlbnRzO1xyXG52YXIgVFZHUG9pbnQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKFRWR1BvaW50LCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gVFZHUG9pbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFRWR1BvaW50O1xyXG59KFBvaW50KSk7XHJcbmV4cG9ydHMuVFZHUG9pbnQgPSBUVkdQb2ludDtcclxudmFyIFZpc2liaWxpdHlWZXJ0ZXggPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gVmlzaWJpbGl0eVZlcnRleChpZCwgcG9seWlkLCBwb2x5dmVydGlkLCBwKSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMucG9seWlkID0gcG9seWlkO1xyXG4gICAgICAgIHRoaXMucG9seXZlcnRpZCA9IHBvbHl2ZXJ0aWQ7XHJcbiAgICAgICAgdGhpcy5wID0gcDtcclxuICAgICAgICBwLnZ2ID0gdGhpcztcclxuICAgIH1cclxuICAgIHJldHVybiBWaXNpYmlsaXR5VmVydGV4O1xyXG59KCkpO1xyXG5leHBvcnRzLlZpc2liaWxpdHlWZXJ0ZXggPSBWaXNpYmlsaXR5VmVydGV4O1xyXG52YXIgVmlzaWJpbGl0eUVkZ2UgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gVmlzaWJpbGl0eUVkZ2Uoc291cmNlLCB0YXJnZXQpIHtcclxuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuICAgIH1cclxuICAgIFZpc2liaWxpdHlFZGdlLnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGR4ID0gdGhpcy5zb3VyY2UucC54IC0gdGhpcy50YXJnZXQucC54O1xyXG4gICAgICAgIHZhciBkeSA9IHRoaXMuc291cmNlLnAueSAtIHRoaXMudGFyZ2V0LnAueTtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gVmlzaWJpbGl0eUVkZ2U7XHJcbn0oKSk7XHJcbmV4cG9ydHMuVmlzaWJpbGl0eUVkZ2UgPSBWaXNpYmlsaXR5RWRnZTtcclxudmFyIFRhbmdlbnRWaXNpYmlsaXR5R3JhcGggPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gVGFuZ2VudFZpc2liaWxpdHlHcmFwaChQLCBnMCkge1xyXG4gICAgICAgIHRoaXMuUCA9IFA7XHJcbiAgICAgICAgdGhpcy5WID0gW107XHJcbiAgICAgICAgdGhpcy5FID0gW107XHJcbiAgICAgICAgaWYgKCFnMCkge1xyXG4gICAgICAgICAgICB2YXIgbiA9IFAubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHAgPSBQW2ldO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwLmxlbmd0aDsgKytqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBqID0gcFtqXSwgdnYgPSBuZXcgVmlzaWJpbGl0eVZlcnRleCh0aGlzLlYubGVuZ3RoLCBpLCBqLCBwaik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5WLnB1c2godnYpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChqID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5FLnB1c2gobmV3IFZpc2liaWxpdHlFZGdlKHBbaiAtIDFdLnZ2LCB2dikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbiAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIFBpID0gUFtpXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSBpICsgMTsgaiA8IG47IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBQaiA9IFBbal0sIHQgPSB0YW5nZW50cyhQaSwgUGopO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHEgaW4gdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYyA9IHRbcV0sIHNvdXJjZSA9IFBpW2MudDFdLCB0YXJnZXQgPSBQaltjLnQyXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRFZGdlSWZWaXNpYmxlKHNvdXJjZSwgdGFyZ2V0LCBpLCBqKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuViA9IGcwLlYuc2xpY2UoMCk7XHJcbiAgICAgICAgICAgIHRoaXMuRSA9IGcwLkUuc2xpY2UoMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgVGFuZ2VudFZpc2liaWxpdHlHcmFwaC5wcm90b3R5cGUuYWRkRWRnZUlmVmlzaWJsZSA9IGZ1bmN0aW9uICh1LCB2LCBpMSwgaTIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW50ZXJzZWN0c1BvbHlzKG5ldyBMaW5lU2VnbWVudCh1LngsIHUueSwgdi54LCB2LnkpLCBpMSwgaTIpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuRS5wdXNoKG5ldyBWaXNpYmlsaXR5RWRnZSh1LnZ2LCB2LnZ2KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFRhbmdlbnRWaXNpYmlsaXR5R3JhcGgucHJvdG90eXBlLmFkZFBvaW50ID0gZnVuY3Rpb24gKHAsIGkxKSB7XHJcbiAgICAgICAgdmFyIG4gPSB0aGlzLlAubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMuVi5wdXNoKG5ldyBWaXNpYmlsaXR5VmVydGV4KHRoaXMuVi5sZW5ndGgsIG4sIDAsIHApKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47ICsraSkge1xyXG4gICAgICAgICAgICBpZiAoaSA9PT0gaTEpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgdmFyIHBvbHkgPSB0aGlzLlBbaV0sIHQgPSB0YW5nZW50X1BvaW50UG9seUMocCwgcG9seSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkRWRnZUlmVmlzaWJsZShwLCBwb2x5W3QubHRhbl0sIGkxLCBpKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRFZGdlSWZWaXNpYmxlKHAsIHBvbHlbdC5ydGFuXSwgaTEsIGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcC52djtcclxuICAgIH07XHJcbiAgICBUYW5nZW50VmlzaWJpbGl0eUdyYXBoLnByb3RvdHlwZS5pbnRlcnNlY3RzUG9seXMgPSBmdW5jdGlvbiAobCwgaTEsIGkyKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSB0aGlzLlAubGVuZ3RoOyBpIDwgbjsgKytpKSB7XHJcbiAgICAgICAgICAgIGlmIChpICE9IGkxICYmIGkgIT0gaTIgJiYgaW50ZXJzZWN0cyhsLCB0aGlzLlBbaV0pLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gVGFuZ2VudFZpc2liaWxpdHlHcmFwaDtcclxufSgpKTtcclxuZXhwb3J0cy5UYW5nZW50VmlzaWJpbGl0eUdyYXBoID0gVGFuZ2VudFZpc2liaWxpdHlHcmFwaDtcclxuZnVuY3Rpb24gaW50ZXJzZWN0cyhsLCBQKSB7XHJcbiAgICB2YXIgaW50cyA9IFtdO1xyXG4gICAgZm9yICh2YXIgaSA9IDEsIG4gPSBQLmxlbmd0aDsgaSA8IG47ICsraSkge1xyXG4gICAgICAgIHZhciBpbnQgPSByZWN0YW5nbGVfMS5SZWN0YW5nbGUubGluZUludGVyc2VjdGlvbihsLngxLCBsLnkxLCBsLngyLCBsLnkyLCBQW2kgLSAxXS54LCBQW2kgLSAxXS55LCBQW2ldLngsIFBbaV0ueSk7XHJcbiAgICAgICAgaWYgKGludClcclxuICAgICAgICAgICAgaW50cy5wdXNoKGludCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaW50cztcclxufVxyXG5mdW5jdGlvbiB0YW5nZW50cyhWLCBXKSB7XHJcbiAgICB2YXIgbSA9IFYubGVuZ3RoIC0gMSwgbiA9IFcubGVuZ3RoIC0gMTtcclxuICAgIHZhciBidCA9IG5ldyBCaVRhbmdlbnRzKCk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG07ICsraSkge1xyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbjsgKytqKSB7XHJcbiAgICAgICAgICAgIHZhciB2MSA9IFZbaSA9PSAwID8gbSAtIDEgOiBpIC0gMV07XHJcbiAgICAgICAgICAgIHZhciB2MiA9IFZbaV07XHJcbiAgICAgICAgICAgIHZhciB2MyA9IFZbaSArIDFdO1xyXG4gICAgICAgICAgICB2YXIgdzEgPSBXW2ogPT0gMCA/IG4gLSAxIDogaiAtIDFdO1xyXG4gICAgICAgICAgICB2YXIgdzIgPSBXW2pdO1xyXG4gICAgICAgICAgICB2YXIgdzMgPSBXW2ogKyAxXTtcclxuICAgICAgICAgICAgdmFyIHYxdjJ3MiA9IGlzTGVmdCh2MSwgdjIsIHcyKTtcclxuICAgICAgICAgICAgdmFyIHYydzF3MiA9IGlzTGVmdCh2MiwgdzEsIHcyKTtcclxuICAgICAgICAgICAgdmFyIHYydzJ3MyA9IGlzTGVmdCh2MiwgdzIsIHczKTtcclxuICAgICAgICAgICAgdmFyIHcxdzJ2MiA9IGlzTGVmdCh3MSwgdzIsIHYyKTtcclxuICAgICAgICAgICAgdmFyIHcydjF2MiA9IGlzTGVmdCh3MiwgdjEsIHYyKTtcclxuICAgICAgICAgICAgdmFyIHcydjJ2MyA9IGlzTGVmdCh3MiwgdjIsIHYzKTtcclxuICAgICAgICAgICAgaWYgKHYxdjJ3MiA+PSAwICYmIHYydzF3MiA+PSAwICYmIHYydzJ3MyA8IDBcclxuICAgICAgICAgICAgICAgICYmIHcxdzJ2MiA+PSAwICYmIHcydjF2MiA+PSAwICYmIHcydjJ2MyA8IDApIHtcclxuICAgICAgICAgICAgICAgIGJ0LmxsID0gbmV3IEJpVGFuZ2VudChpLCBqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh2MXYydzIgPD0gMCAmJiB2MncxdzIgPD0gMCAmJiB2MncydzMgPiAwXHJcbiAgICAgICAgICAgICAgICAmJiB3MXcydjIgPD0gMCAmJiB3MnYxdjIgPD0gMCAmJiB3MnYydjMgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBidC5yciA9IG5ldyBCaVRhbmdlbnQoaSwgaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodjF2MncyIDw9IDAgJiYgdjJ3MXcyID4gMCAmJiB2MncydzMgPD0gMFxyXG4gICAgICAgICAgICAgICAgJiYgdzF3MnYyID49IDAgJiYgdzJ2MXYyIDwgMCAmJiB3MnYydjMgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgYnQucmwgPSBuZXcgQmlUYW5nZW50KGksIGopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHYxdjJ3MiA+PSAwICYmIHYydzF3MiA8IDAgJiYgdjJ3MnczID49IDBcclxuICAgICAgICAgICAgICAgICYmIHcxdzJ2MiA8PSAwICYmIHcydjF2MiA+IDAgJiYgdzJ2MnYzIDw9IDApIHtcclxuICAgICAgICAgICAgICAgIGJ0LmxyID0gbmV3IEJpVGFuZ2VudChpLCBqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBidDtcclxufVxyXG5leHBvcnRzLnRhbmdlbnRzID0gdGFuZ2VudHM7XHJcbmZ1bmN0aW9uIGlzUG9pbnRJbnNpZGVQb2x5KHAsIHBvbHkpIHtcclxuICAgIGZvciAodmFyIGkgPSAxLCBuID0gcG9seS5sZW5ndGg7IGkgPCBuOyArK2kpXHJcbiAgICAgICAgaWYgKGJlbG93KHBvbHlbaSAtIDFdLCBwb2x5W2ldLCBwKSlcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuZnVuY3Rpb24gaXNBbnlQSW5RKHAsIHEpIHtcclxuICAgIHJldHVybiAhcC5ldmVyeShmdW5jdGlvbiAodikgeyByZXR1cm4gIWlzUG9pbnRJbnNpZGVQb2x5KHYsIHEpOyB9KTtcclxufVxyXG5mdW5jdGlvbiBwb2x5c092ZXJsYXAocCwgcSkge1xyXG4gICAgaWYgKGlzQW55UEluUShwLCBxKSlcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGlmIChpc0FueVBJblEocSwgcCkpXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBmb3IgKHZhciBpID0gMSwgbiA9IHAubGVuZ3RoOyBpIDwgbjsgKytpKSB7XHJcbiAgICAgICAgdmFyIHYgPSBwW2ldLCB1ID0gcFtpIC0gMV07XHJcbiAgICAgICAgaWYgKGludGVyc2VjdHMobmV3IExpbmVTZWdtZW50KHUueCwgdS55LCB2LngsIHYueSksIHEpLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcbmV4cG9ydHMucG9seXNPdmVybGFwID0gcG9seXNPdmVybGFwO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1nZW9tLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3dlYmNvbGEvZGlzdC9zcmMvZ2VvbS5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHBhY2tpbmdPcHRpb25zID0ge1xyXG4gICAgUEFERElORzogMTAsXHJcbiAgICBHT0xERU5fU0VDVElPTjogKDEgKyBNYXRoLnNxcnQoNSkpIC8gMixcclxuICAgIEZMT0FUX0VQU0lMT046IDAuMDAwMSxcclxuICAgIE1BWF9JTkVSQVRJT05TOiAxMDBcclxufTtcclxuZnVuY3Rpb24gYXBwbHlQYWNraW5nKGdyYXBocywgdywgaCwgbm9kZV9zaXplLCBkZXNpcmVkX3JhdGlvKSB7XHJcbiAgICBpZiAoZGVzaXJlZF9yYXRpbyA9PT0gdm9pZCAwKSB7IGRlc2lyZWRfcmF0aW8gPSAxOyB9XHJcbiAgICB2YXIgaW5pdF94ID0gMCwgaW5pdF95ID0gMCwgc3ZnX3dpZHRoID0gdywgc3ZnX2hlaWdodCA9IGgsIGRlc2lyZWRfcmF0aW8gPSB0eXBlb2YgZGVzaXJlZF9yYXRpbyAhPT0gJ3VuZGVmaW5lZCcgPyBkZXNpcmVkX3JhdGlvIDogMSwgbm9kZV9zaXplID0gdHlwZW9mIG5vZGVfc2l6ZSAhPT0gJ3VuZGVmaW5lZCcgPyBub2RlX3NpemUgOiAwLCByZWFsX3dpZHRoID0gMCwgcmVhbF9oZWlnaHQgPSAwLCBtaW5fd2lkdGggPSAwLCBnbG9iYWxfYm90dG9tID0gMCwgbGluZSA9IFtdO1xyXG4gICAgaWYgKGdyYXBocy5sZW5ndGggPT0gMClcclxuICAgICAgICByZXR1cm47XHJcbiAgICBjYWxjdWxhdGVfYmIoZ3JhcGhzKTtcclxuICAgIGFwcGx5KGdyYXBocywgZGVzaXJlZF9yYXRpbyk7XHJcbiAgICBwdXRfbm9kZXNfdG9fcmlnaHRfcG9zaXRpb25zKGdyYXBocyk7XHJcbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVfYmIoZ3JhcGhzKSB7XHJcbiAgICAgICAgZ3JhcGhzLmZvckVhY2goZnVuY3Rpb24gKGcpIHtcclxuICAgICAgICAgICAgY2FsY3VsYXRlX3NpbmdsZV9iYihnKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBmdW5jdGlvbiBjYWxjdWxhdGVfc2luZ2xlX2JiKGdyYXBoKSB7XHJcbiAgICAgICAgICAgIHZhciBtaW5feCA9IE51bWJlci5NQVhfVkFMVUUsIG1pbl95ID0gTnVtYmVyLk1BWF9WQUxVRSwgbWF4X3ggPSAwLCBtYXhfeSA9IDA7XHJcbiAgICAgICAgICAgIGdyYXBoLmFycmF5LmZvckVhY2goZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgICAgIHZhciB3ID0gdHlwZW9mIHYud2lkdGggIT09ICd1bmRlZmluZWQnID8gdi53aWR0aCA6IG5vZGVfc2l6ZTtcclxuICAgICAgICAgICAgICAgIHZhciBoID0gdHlwZW9mIHYuaGVpZ2h0ICE9PSAndW5kZWZpbmVkJyA/IHYuaGVpZ2h0IDogbm9kZV9zaXplO1xyXG4gICAgICAgICAgICAgICAgdyAvPSAyO1xyXG4gICAgICAgICAgICAgICAgaCAvPSAyO1xyXG4gICAgICAgICAgICAgICAgbWF4X3ggPSBNYXRoLm1heCh2LnggKyB3LCBtYXhfeCk7XHJcbiAgICAgICAgICAgICAgICBtaW5feCA9IE1hdGgubWluKHYueCAtIHcsIG1pbl94KTtcclxuICAgICAgICAgICAgICAgIG1heF95ID0gTWF0aC5tYXgodi55ICsgaCwgbWF4X3kpO1xyXG4gICAgICAgICAgICAgICAgbWluX3kgPSBNYXRoLm1pbih2LnkgLSBoLCBtaW5feSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBncmFwaC53aWR0aCA9IG1heF94IC0gbWluX3g7XHJcbiAgICAgICAgICAgIGdyYXBoLmhlaWdodCA9IG1heF95IC0gbWluX3k7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcHV0X25vZGVzX3RvX3JpZ2h0X3Bvc2l0aW9ucyhncmFwaHMpIHtcclxuICAgICAgICBncmFwaHMuZm9yRWFjaChmdW5jdGlvbiAoZykge1xyXG4gICAgICAgICAgICB2YXIgY2VudGVyID0geyB4OiAwLCB5OiAwIH07XHJcbiAgICAgICAgICAgIGcuYXJyYXkuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgY2VudGVyLnggKz0gbm9kZS54O1xyXG4gICAgICAgICAgICAgICAgY2VudGVyLnkgKz0gbm9kZS55O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY2VudGVyLnggLz0gZy5hcnJheS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGNlbnRlci55IC89IGcuYXJyYXkubGVuZ3RoO1xyXG4gICAgICAgICAgICB2YXIgY29ybmVyID0geyB4OiBjZW50ZXIueCAtIGcud2lkdGggLyAyLCB5OiBjZW50ZXIueSAtIGcuaGVpZ2h0IC8gMiB9O1xyXG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0geyB4OiBnLnggLSBjb3JuZXIueCArIHN2Z193aWR0aCAvIDIgLSByZWFsX3dpZHRoIC8gMiwgeTogZy55IC0gY29ybmVyLnkgKyBzdmdfaGVpZ2h0IC8gMiAtIHJlYWxfaGVpZ2h0IC8gMiB9O1xyXG4gICAgICAgICAgICBnLmFycmF5LmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIG5vZGUueCArPSBvZmZzZXQueDtcclxuICAgICAgICAgICAgICAgIG5vZGUueSArPSBvZmZzZXQueTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBhcHBseShkYXRhLCBkZXNpcmVkX3JhdGlvKSB7XHJcbiAgICAgICAgdmFyIGN1cnJfYmVzdF9mID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xyXG4gICAgICAgIHZhciBjdXJyX2Jlc3QgPSAwO1xyXG4gICAgICAgIGRhdGEuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYi5oZWlnaHQgLSBhLmhlaWdodDsgfSk7XHJcbiAgICAgICAgbWluX3dpZHRoID0gZGF0YS5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGEud2lkdGggPCBiLndpZHRoID8gYS53aWR0aCA6IGIud2lkdGg7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIGxlZnQgPSB4MSA9IG1pbl93aWR0aDtcclxuICAgICAgICB2YXIgcmlnaHQgPSB4MiA9IGdldF9lbnRpcmVfd2lkdGgoZGF0YSk7XHJcbiAgICAgICAgdmFyIGl0ZXJhdGlvbkNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHZhciBmX3gxID0gTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgICAgICB2YXIgZl94MiA9IE51bWJlci5NQVhfVkFMVUU7XHJcbiAgICAgICAgdmFyIGZsYWcgPSAtMTtcclxuICAgICAgICB2YXIgZHggPSBOdW1iZXIuTUFYX1ZBTFVFO1xyXG4gICAgICAgIHZhciBkZiA9IE51bWJlci5NQVhfVkFMVUU7XHJcbiAgICAgICAgd2hpbGUgKChkeCA+IG1pbl93aWR0aCkgfHwgZGYgPiBwYWNraW5nT3B0aW9ucy5GTE9BVF9FUFNJTE9OKSB7XHJcbiAgICAgICAgICAgIGlmIChmbGFnICE9IDEpIHtcclxuICAgICAgICAgICAgICAgIHZhciB4MSA9IHJpZ2h0IC0gKHJpZ2h0IC0gbGVmdCkgLyBwYWNraW5nT3B0aW9ucy5HT0xERU5fU0VDVElPTjtcclxuICAgICAgICAgICAgICAgIHZhciBmX3gxID0gc3RlcChkYXRhLCB4MSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGZsYWcgIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHgyID0gbGVmdCArIChyaWdodCAtIGxlZnQpIC8gcGFja2luZ09wdGlvbnMuR09MREVOX1NFQ1RJT047XHJcbiAgICAgICAgICAgICAgICB2YXIgZl94MiA9IHN0ZXAoZGF0YSwgeDIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGR4ID0gTWF0aC5hYnMoeDEgLSB4Mik7XHJcbiAgICAgICAgICAgIGRmID0gTWF0aC5hYnMoZl94MSAtIGZfeDIpO1xyXG4gICAgICAgICAgICBpZiAoZl94MSA8IGN1cnJfYmVzdF9mKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyX2Jlc3RfZiA9IGZfeDE7XHJcbiAgICAgICAgICAgICAgICBjdXJyX2Jlc3QgPSB4MTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZl94MiA8IGN1cnJfYmVzdF9mKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyX2Jlc3RfZiA9IGZfeDI7XHJcbiAgICAgICAgICAgICAgICBjdXJyX2Jlc3QgPSB4MjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZl94MSA+IGZfeDIpIHtcclxuICAgICAgICAgICAgICAgIGxlZnQgPSB4MTtcclxuICAgICAgICAgICAgICAgIHgxID0geDI7XHJcbiAgICAgICAgICAgICAgICBmX3gxID0gZl94MjtcclxuICAgICAgICAgICAgICAgIGZsYWcgPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmlnaHQgPSB4MjtcclxuICAgICAgICAgICAgICAgIHgyID0geDE7XHJcbiAgICAgICAgICAgICAgICBmX3gyID0gZl94MTtcclxuICAgICAgICAgICAgICAgIGZsYWcgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpdGVyYXRpb25Db3VudGVyKysgPiAxMDApIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN0ZXAoZGF0YSwgY3Vycl9iZXN0KTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAoZGF0YSwgbWF4X3dpZHRoKSB7XHJcbiAgICAgICAgbGluZSA9IFtdO1xyXG4gICAgICAgIHJlYWxfd2lkdGggPSAwO1xyXG4gICAgICAgIHJlYWxfaGVpZ2h0ID0gMDtcclxuICAgICAgICBnbG9iYWxfYm90dG9tID0gaW5pdF95O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbyA9IGRhdGFbaV07XHJcbiAgICAgICAgICAgIHB1dF9yZWN0KG8sIG1heF93aWR0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBNYXRoLmFicyhnZXRfcmVhbF9yYXRpbygpIC0gZGVzaXJlZF9yYXRpbyk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBwdXRfcmVjdChyZWN0LCBtYXhfd2lkdGgpIHtcclxuICAgICAgICB2YXIgcGFyZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoKGxpbmVbaV0uc3BhY2VfbGVmdCA+PSByZWN0LmhlaWdodCkgJiYgKGxpbmVbaV0ueCArIGxpbmVbaV0ud2lkdGggKyByZWN0LndpZHRoICsgcGFja2luZ09wdGlvbnMuUEFERElORyAtIG1heF93aWR0aCkgPD0gcGFja2luZ09wdGlvbnMuRkxPQVRfRVBTSUxPTikge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50ID0gbGluZVtpXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxpbmUucHVzaChyZWN0KTtcclxuICAgICAgICBpZiAocGFyZW50ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmVjdC54ID0gcGFyZW50LnggKyBwYXJlbnQud2lkdGggKyBwYWNraW5nT3B0aW9ucy5QQURESU5HO1xyXG4gICAgICAgICAgICByZWN0LnkgPSBwYXJlbnQuYm90dG9tO1xyXG4gICAgICAgICAgICByZWN0LnNwYWNlX2xlZnQgPSByZWN0LmhlaWdodDtcclxuICAgICAgICAgICAgcmVjdC5ib3R0b20gPSByZWN0Lnk7XHJcbiAgICAgICAgICAgIHBhcmVudC5zcGFjZV9sZWZ0IC09IHJlY3QuaGVpZ2h0ICsgcGFja2luZ09wdGlvbnMuUEFERElORztcclxuICAgICAgICAgICAgcGFyZW50LmJvdHRvbSArPSByZWN0LmhlaWdodCArIHBhY2tpbmdPcHRpb25zLlBBRERJTkc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZWN0LnkgPSBnbG9iYWxfYm90dG9tO1xyXG4gICAgICAgICAgICBnbG9iYWxfYm90dG9tICs9IHJlY3QuaGVpZ2h0ICsgcGFja2luZ09wdGlvbnMuUEFERElORztcclxuICAgICAgICAgICAgcmVjdC54ID0gaW5pdF94O1xyXG4gICAgICAgICAgICByZWN0LmJvdHRvbSA9IHJlY3QueTtcclxuICAgICAgICAgICAgcmVjdC5zcGFjZV9sZWZ0ID0gcmVjdC5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZWN0LnkgKyByZWN0LmhlaWdodCAtIHJlYWxfaGVpZ2h0ID4gLXBhY2tpbmdPcHRpb25zLkZMT0FUX0VQU0lMT04pXHJcbiAgICAgICAgICAgIHJlYWxfaGVpZ2h0ID0gcmVjdC55ICsgcmVjdC5oZWlnaHQgLSBpbml0X3k7XHJcbiAgICAgICAgaWYgKHJlY3QueCArIHJlY3Qud2lkdGggLSByZWFsX3dpZHRoID4gLXBhY2tpbmdPcHRpb25zLkZMT0FUX0VQU0lMT04pXHJcbiAgICAgICAgICAgIHJlYWxfd2lkdGggPSByZWN0LnggKyByZWN0LndpZHRoIC0gaW5pdF94O1xyXG4gICAgfVxyXG4gICAgO1xyXG4gICAgZnVuY3Rpb24gZ2V0X2VudGlyZV93aWR0aChkYXRhKSB7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gMDtcclxuICAgICAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24gKGQpIHsgcmV0dXJuIHdpZHRoICs9IGQud2lkdGggKyBwYWNraW5nT3B0aW9ucy5QQURESU5HOyB9KTtcclxuICAgICAgICByZXR1cm4gd2lkdGg7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBnZXRfcmVhbF9yYXRpbygpIHtcclxuICAgICAgICByZXR1cm4gKHJlYWxfd2lkdGggLyByZWFsX2hlaWdodCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5hcHBseVBhY2tpbmcgPSBhcHBseVBhY2tpbmc7XHJcbmZ1bmN0aW9uIHNlcGFyYXRlR3JhcGhzKG5vZGVzLCBsaW5rcykge1xyXG4gICAgdmFyIG1hcmtzID0ge307XHJcbiAgICB2YXIgd2F5cyA9IHt9O1xyXG4gICAgdmFyIGdyYXBocyA9IFtdO1xyXG4gICAgdmFyIGNsdXN0ZXJzID0gMDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlua3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgbGluayA9IGxpbmtzW2ldO1xyXG4gICAgICAgIHZhciBuMSA9IGxpbmsuc291cmNlO1xyXG4gICAgICAgIHZhciBuMiA9IGxpbmsudGFyZ2V0O1xyXG4gICAgICAgIGlmICh3YXlzW24xLmluZGV4XSlcclxuICAgICAgICAgICAgd2F5c1tuMS5pbmRleF0ucHVzaChuMik7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB3YXlzW24xLmluZGV4XSA9IFtuMl07XHJcbiAgICAgICAgaWYgKHdheXNbbjIuaW5kZXhdKVxyXG4gICAgICAgICAgICB3YXlzW24yLmluZGV4XS5wdXNoKG4xKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHdheXNbbjIuaW5kZXhdID0gW24xXTtcclxuICAgIH1cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgICAgIGlmIChtYXJrc1tub2RlLmluZGV4XSlcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgZXhwbG9yZV9ub2RlKG5vZGUsIHRydWUpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gZXhwbG9yZV9ub2RlKG4sIGlzX25ldykge1xyXG4gICAgICAgIGlmIChtYXJrc1tuLmluZGV4XSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYgKGlzX25ldykge1xyXG4gICAgICAgICAgICBjbHVzdGVycysrO1xyXG4gICAgICAgICAgICBncmFwaHMucHVzaCh7IGFycmF5OiBbXSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFya3Nbbi5pbmRleF0gPSBjbHVzdGVycztcclxuICAgICAgICBncmFwaHNbY2x1c3RlcnMgLSAxXS5hcnJheS5wdXNoKG4pO1xyXG4gICAgICAgIHZhciBhZGphY2VudCA9IHdheXNbbi5pbmRleF07XHJcbiAgICAgICAgaWYgKCFhZGphY2VudClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWRqYWNlbnQubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgZXhwbG9yZV9ub2RlKGFkamFjZW50W2pdLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGdyYXBocztcclxufVxyXG5leHBvcnRzLnNlcGFyYXRlR3JhcGhzID0gc2VwYXJhdGVHcmFwaHM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhhbmRsZWRpc2Nvbm5lY3RlZC5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy93ZWJjb2xhL2Rpc3Qvc3JjL2hhbmRsZWRpc2Nvbm5lY3RlZC5qc1xuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHJlY3RhbmdsZV8xID0gcmVxdWlyZShcIi4vcmVjdGFuZ2xlXCIpO1xyXG52YXIgdnBzY18xID0gcmVxdWlyZShcIi4vdnBzY1wiKTtcclxudmFyIHNob3J0ZXN0cGF0aHNfMSA9IHJlcXVpcmUoXCIuL3Nob3J0ZXN0cGF0aHNcIik7XHJcbnZhciBOb2RlV3JhcHBlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBOb2RlV3JhcHBlcihpZCwgcmVjdCwgY2hpbGRyZW4pIHtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5yZWN0ID0gcmVjdDtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XHJcbiAgICAgICAgdGhpcy5sZWFmID0gdHlwZW9mIGNoaWxkcmVuID09PSAndW5kZWZpbmVkJyB8fCBjaGlsZHJlbi5sZW5ndGggPT09IDA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gTm9kZVdyYXBwZXI7XHJcbn0oKSk7XHJcbmV4cG9ydHMuTm9kZVdyYXBwZXIgPSBOb2RlV3JhcHBlcjtcclxudmFyIFZlcnQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gVmVydChpZCwgeCwgeSwgbm9kZSwgbGluZSkge1xyXG4gICAgICAgIGlmIChub2RlID09PSB2b2lkIDApIHsgbm9kZSA9IG51bGw7IH1cclxuICAgICAgICBpZiAobGluZSA9PT0gdm9pZCAwKSB7IGxpbmUgPSBudWxsOyB9XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLm5vZGUgPSBub2RlO1xyXG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gVmVydDtcclxufSgpKTtcclxuZXhwb3J0cy5WZXJ0ID0gVmVydDtcclxudmFyIExvbmdlc3RDb21tb25TdWJzZXF1ZW5jZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBMb25nZXN0Q29tbW9uU3Vic2VxdWVuY2UocywgdCkge1xyXG4gICAgICAgIHRoaXMucyA9IHM7XHJcbiAgICAgICAgdGhpcy50ID0gdDtcclxuICAgICAgICB2YXIgbWYgPSBMb25nZXN0Q29tbW9uU3Vic2VxdWVuY2UuZmluZE1hdGNoKHMsIHQpO1xyXG4gICAgICAgIHZhciB0ciA9IHQuc2xpY2UoMCkucmV2ZXJzZSgpO1xyXG4gICAgICAgIHZhciBtciA9IExvbmdlc3RDb21tb25TdWJzZXF1ZW5jZS5maW5kTWF0Y2gocywgdHIpO1xyXG4gICAgICAgIGlmIChtZi5sZW5ndGggPj0gbXIubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGVuZ3RoID0gbWYubGVuZ3RoO1xyXG4gICAgICAgICAgICB0aGlzLnNpID0gbWYuc2k7XHJcbiAgICAgICAgICAgIHRoaXMudGkgPSBtZi50aTtcclxuICAgICAgICAgICAgdGhpcy5yZXZlcnNlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5sZW5ndGggPSBtci5sZW5ndGg7XHJcbiAgICAgICAgICAgIHRoaXMuc2kgPSBtci5zaTtcclxuICAgICAgICAgICAgdGhpcy50aSA9IHQubGVuZ3RoIC0gbXIudGkgLSBtci5sZW5ndGg7XHJcbiAgICAgICAgICAgIHRoaXMucmV2ZXJzZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIExvbmdlc3RDb21tb25TdWJzZXF1ZW5jZS5maW5kTWF0Y2ggPSBmdW5jdGlvbiAocywgdCkge1xyXG4gICAgICAgIHZhciBtID0gcy5sZW5ndGg7XHJcbiAgICAgICAgdmFyIG4gPSB0Lmxlbmd0aDtcclxuICAgICAgICB2YXIgbWF0Y2ggPSB7IGxlbmd0aDogMCwgc2k6IC0xLCB0aTogLTEgfTtcclxuICAgICAgICB2YXIgbCA9IG5ldyBBcnJheShtKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG07IGkrKykge1xyXG4gICAgICAgICAgICBsW2ldID0gbmV3IEFycmF5KG4pO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG47IGorKylcclxuICAgICAgICAgICAgICAgIGlmIChzW2ldID09PSB0W2pdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHYgPSBsW2ldW2pdID0gKGkgPT09IDAgfHwgaiA9PT0gMCkgPyAxIDogbFtpIC0gMV1baiAtIDFdICsgMTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodiA+IG1hdGNoLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaC5sZW5ndGggPSB2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaC5zaSA9IGkgLSB2ICsgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2gudGkgPSBqIC0gdiArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBsW2ldW2pdID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1hdGNoO1xyXG4gICAgfTtcclxuICAgIExvbmdlc3RDb21tb25TdWJzZXF1ZW5jZS5wcm90b3R5cGUuZ2V0U2VxdWVuY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGVuZ3RoID49IDAgPyB0aGlzLnMuc2xpY2UodGhpcy5zaSwgdGhpcy5zaSArIHRoaXMubGVuZ3RoKSA6IFtdO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBMb25nZXN0Q29tbW9uU3Vic2VxdWVuY2U7XHJcbn0oKSk7XHJcbmV4cG9ydHMuTG9uZ2VzdENvbW1vblN1YnNlcXVlbmNlID0gTG9uZ2VzdENvbW1vblN1YnNlcXVlbmNlO1xyXG52YXIgR3JpZFJvdXRlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBHcmlkUm91dGVyKG9yaWdpbmFsbm9kZXMsIGFjY2Vzc29yLCBncm91cFBhZGRpbmcpIHtcclxuICAgICAgICBpZiAoZ3JvdXBQYWRkaW5nID09PSB2b2lkIDApIHsgZ3JvdXBQYWRkaW5nID0gMTI7IH1cclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxub2RlcyA9IG9yaWdpbmFsbm9kZXM7XHJcbiAgICAgICAgdGhpcy5ncm91cFBhZGRpbmcgPSBncm91cFBhZGRpbmc7XHJcbiAgICAgICAgdGhpcy5sZWF2ZXMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMubm9kZXMgPSBvcmlnaW5hbG5vZGVzLm1hcChmdW5jdGlvbiAodiwgaSkgeyByZXR1cm4gbmV3IE5vZGVXcmFwcGVyKGksIGFjY2Vzc29yLmdldEJvdW5kcyh2KSwgYWNjZXNzb3IuZ2V0Q2hpbGRyZW4odikpOyB9KTtcclxuICAgICAgICB0aGlzLmxlYXZlcyA9IHRoaXMubm9kZXMuZmlsdGVyKGZ1bmN0aW9uICh2KSB7IHJldHVybiB2LmxlYWY7IH0pO1xyXG4gICAgICAgIHRoaXMuZ3JvdXBzID0gdGhpcy5ub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGcpIHsgcmV0dXJuICFnLmxlYWY7IH0pO1xyXG4gICAgICAgIHRoaXMuY29scyA9IHRoaXMuZ2V0R3JpZExpbmVzKCd4Jyk7XHJcbiAgICAgICAgdGhpcy5yb3dzID0gdGhpcy5nZXRHcmlkTGluZXMoJ3knKTtcclxuICAgICAgICB0aGlzLmdyb3Vwcy5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2LmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGMpIHsgcmV0dXJuIF90aGlzLm5vZGVzW2NdLnBhcmVudCA9IHY7IH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucm9vdCA9IHsgY2hpbGRyZW46IFtdIH07XHJcbiAgICAgICAgdGhpcy5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygdi5wYXJlbnQgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICB2LnBhcmVudCA9IF90aGlzLnJvb3Q7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5yb290LmNoaWxkcmVuLnB1c2godi5pZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdi5wb3J0cyA9IFtdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuYmFja1RvRnJvbnQgPSB0aGlzLm5vZGVzLnNsaWNlKDApO1xyXG4gICAgICAgIHRoaXMuYmFja1RvRnJvbnQuc29ydChmdW5jdGlvbiAoeCwgeSkgeyByZXR1cm4gX3RoaXMuZ2V0RGVwdGgoeCkgLSBfdGhpcy5nZXREZXB0aCh5KTsgfSk7XHJcbiAgICAgICAgdmFyIGZyb250VG9CYWNrR3JvdXBzID0gdGhpcy5iYWNrVG9Gcm9udC5zbGljZSgwKS5yZXZlcnNlKCkuZmlsdGVyKGZ1bmN0aW9uIChnKSB7IHJldHVybiAhZy5sZWFmOyB9KTtcclxuICAgICAgICBmcm9udFRvQmFja0dyb3Vwcy5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHZhciByID0gcmVjdGFuZ2xlXzEuUmVjdGFuZ2xlLmVtcHR5KCk7XHJcbiAgICAgICAgICAgIHYuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoYykgeyByZXR1cm4gciA9IHIudW5pb24oX3RoaXMubm9kZXNbY10ucmVjdCk7IH0pO1xyXG4gICAgICAgICAgICB2LnJlY3QgPSByLmluZmxhdGUoX3RoaXMuZ3JvdXBQYWRkaW5nKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgY29sTWlkcyA9IHRoaXMubWlkUG9pbnRzKHRoaXMuY29scy5tYXAoZnVuY3Rpb24gKHIpIHsgcmV0dXJuIHIucG9zOyB9KSk7XHJcbiAgICAgICAgdmFyIHJvd01pZHMgPSB0aGlzLm1pZFBvaW50cyh0aGlzLnJvd3MubWFwKGZ1bmN0aW9uIChyKSB7IHJldHVybiByLnBvczsgfSkpO1xyXG4gICAgICAgIHZhciByb3d4ID0gY29sTWlkc1swXSwgcm93WCA9IGNvbE1pZHNbY29sTWlkcy5sZW5ndGggLSAxXTtcclxuICAgICAgICB2YXIgY29seSA9IHJvd01pZHNbMF0sIGNvbFkgPSByb3dNaWRzW3Jvd01pZHMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgdmFyIGhsaW5lcyA9IHRoaXMucm93cy5tYXAoZnVuY3Rpb24gKHIpIHsgcmV0dXJuICh7IHgxOiByb3d4LCB4Mjogcm93WCwgeTE6IHIucG9zLCB5Mjogci5wb3MgfSk7IH0pXHJcbiAgICAgICAgICAgIC5jb25jYXQocm93TWlkcy5tYXAoZnVuY3Rpb24gKG0pIHsgcmV0dXJuICh7IHgxOiByb3d4LCB4Mjogcm93WCwgeTE6IG0sIHkyOiBtIH0pOyB9KSk7XHJcbiAgICAgICAgdmFyIHZsaW5lcyA9IHRoaXMuY29scy5tYXAoZnVuY3Rpb24gKGMpIHsgcmV0dXJuICh7IHgxOiBjLnBvcywgeDI6IGMucG9zLCB5MTogY29seSwgeTI6IGNvbFkgfSk7IH0pXHJcbiAgICAgICAgICAgIC5jb25jYXQoY29sTWlkcy5tYXAoZnVuY3Rpb24gKG0pIHsgcmV0dXJuICh7IHgxOiBtLCB4MjogbSwgeTE6IGNvbHksIHkyOiBjb2xZIH0pOyB9KSk7XHJcbiAgICAgICAgdmFyIGxpbmVzID0gaGxpbmVzLmNvbmNhdCh2bGluZXMpO1xyXG4gICAgICAgIGxpbmVzLmZvckVhY2goZnVuY3Rpb24gKGwpIHsgcmV0dXJuIGwudmVydHMgPSBbXTsgfSk7XHJcbiAgICAgICAgdGhpcy52ZXJ0cyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZWRnZXMgPSBbXTtcclxuICAgICAgICBobGluZXMuZm9yRWFjaChmdW5jdGlvbiAoaCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdmxpbmVzLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwID0gbmV3IFZlcnQoX3RoaXMudmVydHMubGVuZ3RoLCB2LngxLCBoLnkxKTtcclxuICAgICAgICAgICAgICAgIGgudmVydHMucHVzaChwKTtcclxuICAgICAgICAgICAgICAgIHYudmVydHMucHVzaChwKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZlcnRzLnB1c2gocCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaSA9IF90aGlzLmJhY2tUb0Zyb250Lmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChpLS0gPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGUgPSBfdGhpcy5iYWNrVG9Gcm9udFtpXSwgciA9IG5vZGUucmVjdDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZHggPSBNYXRoLmFicyhwLnggLSByLmN4KCkpLCBkeSA9IE1hdGguYWJzKHAueSAtIHIuY3koKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGR4IDwgci53aWR0aCgpIC8gMiAmJiBkeSA8IHIuaGVpZ2h0KCkgLyAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHAubm9kZSA9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGluZXMuZm9yRWFjaChmdW5jdGlvbiAobCwgbGkpIHtcclxuICAgICAgICAgICAgX3RoaXMubm9kZXMuZm9yRWFjaChmdW5jdGlvbiAodiwgaSkge1xyXG4gICAgICAgICAgICAgICAgdi5yZWN0LmxpbmVJbnRlcnNlY3Rpb25zKGwueDEsIGwueTEsIGwueDIsIGwueTIpLmZvckVhY2goZnVuY3Rpb24gKGludGVyc2VjdCwgaikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwID0gbmV3IFZlcnQoX3RoaXMudmVydHMubGVuZ3RoLCBpbnRlcnNlY3QueCwgaW50ZXJzZWN0LnksIHYsIGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnZlcnRzLnB1c2gocCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbC52ZXJ0cy5wdXNoKHApO1xyXG4gICAgICAgICAgICAgICAgICAgIHYucG9ydHMucHVzaChwKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdmFyIGlzSG9yaXogPSBNYXRoLmFicyhsLnkxIC0gbC55MikgPCAwLjE7XHJcbiAgICAgICAgICAgIHZhciBkZWx0YSA9IGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBpc0hvcml6ID8gYi54IC0gYS54IDogYi55IC0gYS55OyB9O1xyXG4gICAgICAgICAgICBsLnZlcnRzLnNvcnQoZGVsdGEpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGwudmVydHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB1ID0gbC52ZXJ0c1tpIC0gMV0sIHYgPSBsLnZlcnRzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHUubm9kZSAmJiB1Lm5vZGUgPT09IHYubm9kZSAmJiB1Lm5vZGUubGVhZilcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmVkZ2VzLnB1c2goeyBzb3VyY2U6IHUuaWQsIHRhcmdldDogdi5pZCwgbGVuZ3RoOiBNYXRoLmFicyhkZWx0YSh1LCB2KSkgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIEdyaWRSb3V0ZXIucHJvdG90eXBlLmF2ZyA9IGZ1bmN0aW9uIChhKSB7IHJldHVybiBhLnJlZHVjZShmdW5jdGlvbiAoeCwgeSkgeyByZXR1cm4geCArIHk7IH0pIC8gYS5sZW5ndGg7IH07XHJcbiAgICBHcmlkUm91dGVyLnByb3RvdHlwZS5nZXRHcmlkTGluZXMgPSBmdW5jdGlvbiAoYXhpcykge1xyXG4gICAgICAgIHZhciBjb2x1bW5zID0gW107XHJcbiAgICAgICAgdmFyIGxzID0gdGhpcy5sZWF2ZXMuc2xpY2UoMCwgdGhpcy5sZWF2ZXMubGVuZ3RoKTtcclxuICAgICAgICB3aGlsZSAobHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgb3ZlcmxhcHBpbmcgPSBscy5maWx0ZXIoZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHYucmVjdFsnb3ZlcmxhcCcgKyBheGlzLnRvVXBwZXJDYXNlKCldKGxzWzBdLnJlY3QpOyB9KTtcclxuICAgICAgICAgICAgdmFyIGNvbCA9IHtcclxuICAgICAgICAgICAgICAgIG5vZGVzOiBvdmVybGFwcGluZyxcclxuICAgICAgICAgICAgICAgIHBvczogdGhpcy5hdmcob3ZlcmxhcHBpbmcubWFwKGZ1bmN0aW9uICh2KSB7IHJldHVybiB2LnJlY3RbJ2MnICsgYXhpc10oKTsgfSkpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNvbHVtbnMucHVzaChjb2wpO1xyXG4gICAgICAgICAgICBjb2wubm9kZXMuZm9yRWFjaChmdW5jdGlvbiAodikgeyByZXR1cm4gbHMuc3BsaWNlKGxzLmluZGV4T2YodiksIDEpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29sdW1ucy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhLnBvcyAtIGIucG9zOyB9KTtcclxuICAgICAgICByZXR1cm4gY29sdW1ucztcclxuICAgIH07XHJcbiAgICBHcmlkUm91dGVyLnByb3RvdHlwZS5nZXREZXB0aCA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgdmFyIGRlcHRoID0gMDtcclxuICAgICAgICB3aGlsZSAodi5wYXJlbnQgIT09IHRoaXMucm9vdCkge1xyXG4gICAgICAgICAgICBkZXB0aCsrO1xyXG4gICAgICAgICAgICB2ID0gdi5wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZXB0aDtcclxuICAgIH07XHJcbiAgICBHcmlkUm91dGVyLnByb3RvdHlwZS5taWRQb2ludHMgPSBmdW5jdGlvbiAoYSkge1xyXG4gICAgICAgIHZhciBnYXAgPSBhWzFdIC0gYVswXTtcclxuICAgICAgICB2YXIgbWlkcyA9IFthWzBdIC0gZ2FwIC8gMl07XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIG1pZHMucHVzaCgoYVtpXSArIGFbaSAtIDFdKSAvIDIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtaWRzLnB1c2goYVthLmxlbmd0aCAtIDFdICsgZ2FwIC8gMik7XHJcbiAgICAgICAgcmV0dXJuIG1pZHM7XHJcbiAgICB9O1xyXG4gICAgR3JpZFJvdXRlci5wcm90b3R5cGUuZmluZExpbmVhZ2UgPSBmdW5jdGlvbiAodikge1xyXG4gICAgICAgIHZhciBsaW5lYWdlID0gW3ZdO1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgdiA9IHYucGFyZW50O1xyXG4gICAgICAgICAgICBsaW5lYWdlLnB1c2godik7XHJcbiAgICAgICAgfSB3aGlsZSAodiAhPT0gdGhpcy5yb290KTtcclxuICAgICAgICByZXR1cm4gbGluZWFnZS5yZXZlcnNlKCk7XHJcbiAgICB9O1xyXG4gICAgR3JpZFJvdXRlci5wcm90b3R5cGUuZmluZEFuY2VzdG9yUGF0aEJldHdlZW4gPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHZhciBhYSA9IHRoaXMuZmluZExpbmVhZ2UoYSksIGJhID0gdGhpcy5maW5kTGluZWFnZShiKSwgaSA9IDA7XHJcbiAgICAgICAgd2hpbGUgKGFhW2ldID09PSBiYVtpXSlcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIHJldHVybiB7IGNvbW1vbkFuY2VzdG9yOiBhYVtpIC0gMV0sIGxpbmVhZ2VzOiBhYS5zbGljZShpKS5jb25jYXQoYmEuc2xpY2UoaSkpIH07XHJcbiAgICB9O1xyXG4gICAgR3JpZFJvdXRlci5wcm90b3R5cGUuc2libGluZ09ic3RhY2xlcyA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgcGF0aCA9IHRoaXMuZmluZEFuY2VzdG9yUGF0aEJldHdlZW4oYSwgYik7XHJcbiAgICAgICAgdmFyIGxpbmVhZ2VMb29rdXAgPSB7fTtcclxuICAgICAgICBwYXRoLmxpbmVhZ2VzLmZvckVhY2goZnVuY3Rpb24gKHYpIHsgcmV0dXJuIGxpbmVhZ2VMb29rdXBbdi5pZF0gPSB7fTsgfSk7XHJcbiAgICAgICAgdmFyIG9ic3RhY2xlcyA9IHBhdGguY29tbW9uQW5jZXN0b3IuY2hpbGRyZW4uZmlsdGVyKGZ1bmN0aW9uICh2KSB7IHJldHVybiAhKHYgaW4gbGluZWFnZUxvb2t1cCk7IH0pO1xyXG4gICAgICAgIHBhdGgubGluZWFnZXNcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAodikgeyByZXR1cm4gdi5wYXJlbnQgIT09IHBhdGguY29tbW9uQW5jZXN0b3I7IH0pXHJcbiAgICAgICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7IHJldHVybiBvYnN0YWNsZXMgPSBvYnN0YWNsZXMuY29uY2F0KHYucGFyZW50LmNoaWxkcmVuLmZpbHRlcihmdW5jdGlvbiAoYykgeyByZXR1cm4gYyAhPT0gdi5pZDsgfSkpOyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzdGFjbGVzLm1hcChmdW5jdGlvbiAodikgeyByZXR1cm4gX3RoaXMubm9kZXNbdl07IH0pO1xyXG4gICAgfTtcclxuICAgIEdyaWRSb3V0ZXIuZ2V0U2VnbWVudFNldHMgPSBmdW5jdGlvbiAocm91dGVzLCB4LCB5KSB7XHJcbiAgICAgICAgdmFyIHZzZWdtZW50cyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGVpID0gMDsgZWkgPCByb3V0ZXMubGVuZ3RoOyBlaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciByb3V0ZSA9IHJvdXRlc1tlaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHNpID0gMDsgc2kgPCByb3V0ZS5sZW5ndGg7IHNpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBzID0gcm91dGVbc2ldO1xyXG4gICAgICAgICAgICAgICAgcy5lZGdlaWQgPSBlaTtcclxuICAgICAgICAgICAgICAgIHMuaSA9IHNpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNkeCA9IHNbMV1beF0gLSBzWzBdW3hdO1xyXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHNkeCkgPCAwLjEpIHtcclxuICAgICAgICAgICAgICAgICAgICB2c2VnbWVudHMucHVzaChzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2c2VnbWVudHMuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYVswXVt4XSAtIGJbMF1beF07IH0pO1xyXG4gICAgICAgIHZhciB2c2VnbWVudHNldHMgPSBbXTtcclxuICAgICAgICB2YXIgc2VnbWVudHNldCA9IG51bGw7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2c2VnbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHMgPSB2c2VnbWVudHNbaV07XHJcbiAgICAgICAgICAgIGlmICghc2VnbWVudHNldCB8fCBNYXRoLmFicyhzWzBdW3hdIC0gc2VnbWVudHNldC5wb3MpID4gMC4xKSB7XHJcbiAgICAgICAgICAgICAgICBzZWdtZW50c2V0ID0geyBwb3M6IHNbMF1beF0sIHNlZ21lbnRzOiBbXSB9O1xyXG4gICAgICAgICAgICAgICAgdnNlZ21lbnRzZXRzLnB1c2goc2VnbWVudHNldCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2VnbWVudHNldC5zZWdtZW50cy5wdXNoKHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdnNlZ21lbnRzZXRzO1xyXG4gICAgfTtcclxuICAgIEdyaWRSb3V0ZXIubnVkZ2VTZWdzID0gZnVuY3Rpb24gKHgsIHksIHJvdXRlcywgc2VnbWVudHMsIGxlZnRPZiwgZ2FwKSB7XHJcbiAgICAgICAgdmFyIG4gPSBzZWdtZW50cy5sZW5ndGg7XHJcbiAgICAgICAgaWYgKG4gPD0gMSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHZhciB2cyA9IHNlZ21lbnRzLm1hcChmdW5jdGlvbiAocykgeyByZXR1cm4gbmV3IHZwc2NfMS5WYXJpYWJsZShzWzBdW3hdKTsgfSk7XHJcbiAgICAgICAgdmFyIGNzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBuOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID09PSBqKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIHMxID0gc2VnbWVudHNbaV0sIHMyID0gc2VnbWVudHNbal0sIGUxID0gczEuZWRnZWlkLCBlMiA9IHMyLmVkZ2VpZCwgbGluZCA9IC0xLCByaW5kID0gLTE7XHJcbiAgICAgICAgICAgICAgICBpZiAoeCA9PSAneCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGVmdE9mKGUxLCBlMikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHMxWzBdW3ldIDwgczFbMV1beV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmQgPSBqLCByaW5kID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmQgPSBpLCByaW5kID0gajtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsZWZ0T2YoZTEsIGUyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoczFbMF1beV0gPCBzMVsxXVt5XSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZCA9IGksIHJpbmQgPSBqO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZCA9IGosIHJpbmQgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGxpbmQgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNzLnB1c2gobmV3IHZwc2NfMS5Db25zdHJhaW50KHZzW2xpbmRdLCB2c1tyaW5kXSwgZ2FwKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHNvbHZlciA9IG5ldyB2cHNjXzEuU29sdmVyKHZzLCBjcyk7XHJcbiAgICAgICAgc29sdmVyLnNvbHZlKCk7XHJcbiAgICAgICAgdnMuZm9yRWFjaChmdW5jdGlvbiAodiwgaSkge1xyXG4gICAgICAgICAgICB2YXIgcyA9IHNlZ21lbnRzW2ldO1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gdi5wb3NpdGlvbigpO1xyXG4gICAgICAgICAgICBzWzBdW3hdID0gc1sxXVt4XSA9IHBvcztcclxuICAgICAgICAgICAgdmFyIHJvdXRlID0gcm91dGVzW3MuZWRnZWlkXTtcclxuICAgICAgICAgICAgaWYgKHMuaSA+IDApXHJcbiAgICAgICAgICAgICAgICByb3V0ZVtzLmkgLSAxXVsxXVt4XSA9IHBvcztcclxuICAgICAgICAgICAgaWYgKHMuaSA8IHJvdXRlLmxlbmd0aCAtIDEpXHJcbiAgICAgICAgICAgICAgICByb3V0ZVtzLmkgKyAxXVswXVt4XSA9IHBvcztcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBHcmlkUm91dGVyLm51ZGdlU2VnbWVudHMgPSBmdW5jdGlvbiAocm91dGVzLCB4LCB5LCBsZWZ0T2YsIGdhcCkge1xyXG4gICAgICAgIHZhciB2c2VnbWVudHNldHMgPSBHcmlkUm91dGVyLmdldFNlZ21lbnRTZXRzKHJvdXRlcywgeCwgeSk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2c2VnbWVudHNldHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHNzID0gdnNlZ21lbnRzZXRzW2ldO1xyXG4gICAgICAgICAgICB2YXIgZXZlbnRzID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc3Muc2VnbWVudHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBzID0gc3Muc2VnbWVudHNbal07XHJcbiAgICAgICAgICAgICAgICBldmVudHMucHVzaCh7IHR5cGU6IDAsIHM6IHMsIHBvczogTWF0aC5taW4oc1swXVt5XSwgc1sxXVt5XSkgfSk7XHJcbiAgICAgICAgICAgICAgICBldmVudHMucHVzaCh7IHR5cGU6IDEsIHM6IHMsIHBvczogTWF0aC5tYXgoc1swXVt5XSwgc1sxXVt5XSkgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZXZlbnRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGEucG9zIC0gYi5wb3MgKyBhLnR5cGUgLSBiLnR5cGU7IH0pO1xyXG4gICAgICAgICAgICB2YXIgb3BlbiA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgb3BlbkNvdW50ID0gMDtcclxuICAgICAgICAgICAgZXZlbnRzLmZvckVhY2goZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlLnR5cGUgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBvcGVuLnB1c2goZS5zKTtcclxuICAgICAgICAgICAgICAgICAgICBvcGVuQ291bnQrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wZW5Db3VudC0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG9wZW5Db3VudCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgR3JpZFJvdXRlci5udWRnZVNlZ3MoeCwgeSwgcm91dGVzLCBvcGVuLCBsZWZ0T2YsIGdhcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgb3BlbiA9IFtdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgR3JpZFJvdXRlci5wcm90b3R5cGUucm91dGVFZGdlcyA9IGZ1bmN0aW9uIChlZGdlcywgbnVkZ2VHYXAsIHNvdXJjZSwgdGFyZ2V0KSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgcm91dGVQYXRocyA9IGVkZ2VzLm1hcChmdW5jdGlvbiAoZSkgeyByZXR1cm4gX3RoaXMucm91dGUoc291cmNlKGUpLCB0YXJnZXQoZSkpOyB9KTtcclxuICAgICAgICB2YXIgb3JkZXIgPSBHcmlkUm91dGVyLm9yZGVyRWRnZXMocm91dGVQYXRocyk7XHJcbiAgICAgICAgdmFyIHJvdXRlcyA9IHJvdXRlUGF0aHMubWFwKGZ1bmN0aW9uIChlKSB7IHJldHVybiBHcmlkUm91dGVyLm1ha2VTZWdtZW50cyhlKTsgfSk7XHJcbiAgICAgICAgR3JpZFJvdXRlci5udWRnZVNlZ21lbnRzKHJvdXRlcywgJ3gnLCAneScsIG9yZGVyLCBudWRnZUdhcCk7XHJcbiAgICAgICAgR3JpZFJvdXRlci5udWRnZVNlZ21lbnRzKHJvdXRlcywgJ3knLCAneCcsIG9yZGVyLCBudWRnZUdhcCk7XHJcbiAgICAgICAgR3JpZFJvdXRlci51bnJldmVyc2VFZGdlcyhyb3V0ZXMsIHJvdXRlUGF0aHMpO1xyXG4gICAgICAgIHJldHVybiByb3V0ZXM7XHJcbiAgICB9O1xyXG4gICAgR3JpZFJvdXRlci51bnJldmVyc2VFZGdlcyA9IGZ1bmN0aW9uIChyb3V0ZXMsIHJvdXRlUGF0aHMpIHtcclxuICAgICAgICByb3V0ZXMuZm9yRWFjaChmdW5jdGlvbiAoc2VnbWVudHMsIGkpIHtcclxuICAgICAgICAgICAgdmFyIHBhdGggPSByb3V0ZVBhdGhzW2ldO1xyXG4gICAgICAgICAgICBpZiAocGF0aC5yZXZlcnNlZCkge1xyXG4gICAgICAgICAgICAgICAgc2VnbWVudHMucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICAgICAgc2VnbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoc2VnbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlZ21lbnQucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBHcmlkUm91dGVyLmFuZ2xlQmV0d2VlbjJMaW5lcyA9IGZ1bmN0aW9uIChsaW5lMSwgbGluZTIpIHtcclxuICAgICAgICB2YXIgYW5nbGUxID0gTWF0aC5hdGFuMihsaW5lMVswXS55IC0gbGluZTFbMV0ueSwgbGluZTFbMF0ueCAtIGxpbmUxWzFdLngpO1xyXG4gICAgICAgIHZhciBhbmdsZTIgPSBNYXRoLmF0YW4yKGxpbmUyWzBdLnkgLSBsaW5lMlsxXS55LCBsaW5lMlswXS54IC0gbGluZTJbMV0ueCk7XHJcbiAgICAgICAgdmFyIGRpZmYgPSBhbmdsZTEgLSBhbmdsZTI7XHJcbiAgICAgICAgaWYgKGRpZmYgPiBNYXRoLlBJIHx8IGRpZmYgPCAtTWF0aC5QSSkge1xyXG4gICAgICAgICAgICBkaWZmID0gYW5nbGUyIC0gYW5nbGUxO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGlmZjtcclxuICAgIH07XHJcbiAgICBHcmlkUm91dGVyLmlzTGVmdCA9IGZ1bmN0aW9uIChhLCBiLCBjKSB7XHJcbiAgICAgICAgcmV0dXJuICgoYi54IC0gYS54KSAqIChjLnkgLSBhLnkpIC0gKGIueSAtIGEueSkgKiAoYy54IC0gYS54KSkgPD0gMDtcclxuICAgIH07XHJcbiAgICBHcmlkUm91dGVyLmdldE9yZGVyID0gZnVuY3Rpb24gKHBhaXJzKSB7XHJcbiAgICAgICAgdmFyIG91dGdvaW5nID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWlycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcCA9IHBhaXJzW2ldO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG91dGdvaW5nW3AubF0gPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgb3V0Z29pbmdbcC5sXSA9IHt9O1xyXG4gICAgICAgICAgICBvdXRnb2luZ1twLmxdW3Aucl0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGwsIHIpIHsgcmV0dXJuIHR5cGVvZiBvdXRnb2luZ1tsXSAhPT0gJ3VuZGVmaW5lZCcgJiYgb3V0Z29pbmdbbF1bcl07IH07XHJcbiAgICB9O1xyXG4gICAgR3JpZFJvdXRlci5vcmRlckVkZ2VzID0gZnVuY3Rpb24gKGVkZ2VzKSB7XHJcbiAgICAgICAgdmFyIGVkZ2VPcmRlciA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWRnZXMubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSBpICsgMTsgaiA8IGVkZ2VzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZSA9IGVkZ2VzW2ldLCBmID0gZWRnZXNbal0sIGxjcyA9IG5ldyBMb25nZXN0Q29tbW9uU3Vic2VxdWVuY2UoZSwgZik7XHJcbiAgICAgICAgICAgICAgICB2YXIgdSwgdmksIHZqO1xyXG4gICAgICAgICAgICAgICAgaWYgKGxjcy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBpZiAobGNzLnJldmVyc2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZi5yZXZlcnNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZi5yZXZlcnNlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgbGNzID0gbmV3IExvbmdlc3RDb21tb25TdWJzZXF1ZW5jZShlLCBmKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICgobGNzLnNpIDw9IDAgfHwgbGNzLnRpIDw9IDApICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKGxjcy5zaSArIGxjcy5sZW5ndGggPj0gZS5sZW5ndGggfHwgbGNzLnRpICsgbGNzLmxlbmd0aCA+PSBmLmxlbmd0aCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBlZGdlT3JkZXIucHVzaCh7IGw6IGksIHI6IGogfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobGNzLnNpICsgbGNzLmxlbmd0aCA+PSBlLmxlbmd0aCB8fCBsY3MudGkgKyBsY3MubGVuZ3RoID49IGYubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdSA9IGVbbGNzLnNpICsgMV07XHJcbiAgICAgICAgICAgICAgICAgICAgdmogPSBlW2xjcy5zaSAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpID0gZltsY3MudGkgLSAxXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHUgPSBlW2xjcy5zaSArIGxjcy5sZW5ndGggLSAyXTtcclxuICAgICAgICAgICAgICAgICAgICB2aSA9IGVbbGNzLnNpICsgbGNzLmxlbmd0aF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmogPSBmW2xjcy50aSArIGxjcy5sZW5ndGhdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKEdyaWRSb3V0ZXIuaXNMZWZ0KHUsIHZpLCB2aikpIHtcclxuICAgICAgICAgICAgICAgICAgICBlZGdlT3JkZXIucHVzaCh7IGw6IGosIHI6IGkgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBlZGdlT3JkZXIucHVzaCh7IGw6IGksIHI6IGogfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIEdyaWRSb3V0ZXIuZ2V0T3JkZXIoZWRnZU9yZGVyKTtcclxuICAgIH07XHJcbiAgICBHcmlkUm91dGVyLm1ha2VTZWdtZW50cyA9IGZ1bmN0aW9uIChwYXRoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gY29weVBvaW50KHApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgeDogcC54LCB5OiBwLnkgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGlzU3RyYWlnaHQgPSBmdW5jdGlvbiAoYSwgYiwgYykgeyByZXR1cm4gTWF0aC5hYnMoKGIueCAtIGEueCkgKiAoYy55IC0gYS55KSAtIChiLnkgLSBhLnkpICogKGMueCAtIGEueCkpIDwgMC4wMDE7IH07XHJcbiAgICAgICAgdmFyIHNlZ21lbnRzID0gW107XHJcbiAgICAgICAgdmFyIGEgPSBjb3B5UG9pbnQocGF0aFswXSk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBwYXRoLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBiID0gY29weVBvaW50KHBhdGhbaV0pLCBjID0gaSA8IHBhdGgubGVuZ3RoIC0gMSA/IHBhdGhbaSArIDFdIDogbnVsbDtcclxuICAgICAgICAgICAgaWYgKCFjIHx8ICFpc1N0cmFpZ2h0KGEsIGIsIGMpKSB7XHJcbiAgICAgICAgICAgICAgICBzZWdtZW50cy5wdXNoKFthLCBiXSk7XHJcbiAgICAgICAgICAgICAgICBhID0gYjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2VnbWVudHM7XHJcbiAgICB9O1xyXG4gICAgR3JpZFJvdXRlci5wcm90b3R5cGUucm91dGUgPSBmdW5jdGlvbiAocywgdCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHNvdXJjZSA9IHRoaXMubm9kZXNbc10sIHRhcmdldCA9IHRoaXMubm9kZXNbdF07XHJcbiAgICAgICAgdGhpcy5vYnN0YWNsZXMgPSB0aGlzLnNpYmxpbmdPYnN0YWNsZXMoc291cmNlLCB0YXJnZXQpO1xyXG4gICAgICAgIHZhciBvYnN0YWNsZUxvb2t1cCA9IHt9O1xyXG4gICAgICAgIHRoaXMub2JzdGFjbGVzLmZvckVhY2goZnVuY3Rpb24gKG8pIHsgcmV0dXJuIG9ic3RhY2xlTG9va3VwW28uaWRdID0gbzsgfSk7XHJcbiAgICAgICAgdGhpcy5wYXNzYWJsZUVkZ2VzID0gdGhpcy5lZGdlcy5maWx0ZXIoZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgdmFyIHUgPSBfdGhpcy52ZXJ0c1tlLnNvdXJjZV0sIHYgPSBfdGhpcy52ZXJ0c1tlLnRhcmdldF07XHJcbiAgICAgICAgICAgIHJldHVybiAhKHUubm9kZSAmJiB1Lm5vZGUuaWQgaW4gb2JzdGFjbGVMb29rdXBcclxuICAgICAgICAgICAgICAgIHx8IHYubm9kZSAmJiB2Lm5vZGUuaWQgaW4gb2JzdGFjbGVMb29rdXApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgc291cmNlLnBvcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB1ID0gc291cmNlLnBvcnRzWzBdLmlkO1xyXG4gICAgICAgICAgICB2YXIgdiA9IHNvdXJjZS5wb3J0c1tpXS5pZDtcclxuICAgICAgICAgICAgdGhpcy5wYXNzYWJsZUVkZ2VzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgc291cmNlOiB1LFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiB2LFxyXG4gICAgICAgICAgICAgICAgbGVuZ3RoOiAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHRhcmdldC5wb3J0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgdSA9IHRhcmdldC5wb3J0c1swXS5pZDtcclxuICAgICAgICAgICAgdmFyIHYgPSB0YXJnZXQucG9ydHNbaV0uaWQ7XHJcbiAgICAgICAgICAgIHRoaXMucGFzc2FibGVFZGdlcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogdSxcclxuICAgICAgICAgICAgICAgIHRhcmdldDogdixcclxuICAgICAgICAgICAgICAgIGxlbmd0aDogMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGdldFNvdXJjZSA9IGZ1bmN0aW9uIChlKSB7IHJldHVybiBlLnNvdXJjZTsgfSwgZ2V0VGFyZ2V0ID0gZnVuY3Rpb24gKGUpIHsgcmV0dXJuIGUudGFyZ2V0OyB9LCBnZXRMZW5ndGggPSBmdW5jdGlvbiAoZSkgeyByZXR1cm4gZS5sZW5ndGg7IH07XHJcbiAgICAgICAgdmFyIHNob3J0ZXN0UGF0aENhbGN1bGF0b3IgPSBuZXcgc2hvcnRlc3RwYXRoc18xLkNhbGN1bGF0b3IodGhpcy52ZXJ0cy5sZW5ndGgsIHRoaXMucGFzc2FibGVFZGdlcywgZ2V0U291cmNlLCBnZXRUYXJnZXQsIGdldExlbmd0aCk7XHJcbiAgICAgICAgdmFyIGJlbmRQZW5hbHR5ID0gZnVuY3Rpb24gKHUsIHYsIHcpIHtcclxuICAgICAgICAgICAgdmFyIGEgPSBfdGhpcy52ZXJ0c1t1XSwgYiA9IF90aGlzLnZlcnRzW3ZdLCBjID0gX3RoaXMudmVydHNbd107XHJcbiAgICAgICAgICAgIHZhciBkeCA9IE1hdGguYWJzKGMueCAtIGEueCksIGR5ID0gTWF0aC5hYnMoYy55IC0gYS55KTtcclxuICAgICAgICAgICAgaWYgKGEubm9kZSA9PT0gc291cmNlICYmIGEubm9kZSA9PT0gYi5ub2RlIHx8IGIubm9kZSA9PT0gdGFyZ2V0ICYmIGIubm9kZSA9PT0gYy5ub2RlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIHJldHVybiBkeCA+IDEgJiYgZHkgPiAxID8gMTAwMCA6IDA7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgc2hvcnRlc3RQYXRoID0gc2hvcnRlc3RQYXRoQ2FsY3VsYXRvci5QYXRoRnJvbU5vZGVUb05vZGVXaXRoUHJldkNvc3Qoc291cmNlLnBvcnRzWzBdLmlkLCB0YXJnZXQucG9ydHNbMF0uaWQsIGJlbmRQZW5hbHR5KTtcclxuICAgICAgICB2YXIgcGF0aFBvaW50cyA9IHNob3J0ZXN0UGF0aC5yZXZlcnNlKCkubWFwKGZ1bmN0aW9uICh2aSkgeyByZXR1cm4gX3RoaXMudmVydHNbdmldOyB9KTtcclxuICAgICAgICBwYXRoUG9pbnRzLnB1c2godGhpcy5ub2Rlc1t0YXJnZXQuaWRdLnBvcnRzWzBdKTtcclxuICAgICAgICByZXR1cm4gcGF0aFBvaW50cy5maWx0ZXIoZnVuY3Rpb24gKHYsIGkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICEoaSA8IHBhdGhQb2ludHMubGVuZ3RoIC0gMSAmJiBwYXRoUG9pbnRzW2kgKyAxXS5ub2RlID09PSBzb3VyY2UgJiYgdi5ub2RlID09PSBzb3VyY2VcclxuICAgICAgICAgICAgICAgIHx8IGkgPiAwICYmIHYubm9kZSA9PT0gdGFyZ2V0ICYmIHBhdGhQb2ludHNbaSAtIDFdLm5vZGUgPT09IHRhcmdldCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgR3JpZFJvdXRlci5nZXRSb3V0ZVBhdGggPSBmdW5jdGlvbiAocm91dGUsIGNvcm5lcnJhZGl1cywgYXJyb3d3aWR0aCwgYXJyb3doZWlnaHQpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgICAgICAgICByb3V0ZXBhdGg6ICdNICcgKyByb3V0ZVswXVswXS54ICsgJyAnICsgcm91dGVbMF1bMF0ueSArICcgJyxcclxuICAgICAgICAgICAgYXJyb3dwYXRoOiAnJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKHJvdXRlLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByb3V0ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxpID0gcm91dGVbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgeCA9IGxpWzFdLngsIHkgPSBsaVsxXS55O1xyXG4gICAgICAgICAgICAgICAgdmFyIGR4ID0geCAtIGxpWzBdLng7XHJcbiAgICAgICAgICAgICAgICB2YXIgZHkgPSB5IC0gbGlbMF0ueTtcclxuICAgICAgICAgICAgICAgIGlmIChpIDwgcm91dGUubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhkeCkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHggLT0gZHggLyBNYXRoLmFicyhkeCkgKiBjb3JuZXJyYWRpdXM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB5IC09IGR5IC8gTWF0aC5hYnMoZHkpICogY29ybmVycmFkaXVzO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucm91dGVwYXRoICs9ICdMICcgKyB4ICsgJyAnICsgeSArICcgJztcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbCA9IHJvdXRlW2kgKyAxXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgeDAgPSBsWzBdLngsIHkwID0gbFswXS55O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB4MSA9IGxbMV0ueDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgeTEgPSBsWzFdLnk7XHJcbiAgICAgICAgICAgICAgICAgICAgZHggPSB4MSAtIHgwO1xyXG4gICAgICAgICAgICAgICAgICAgIGR5ID0geTEgLSB5MDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYW5nbGUgPSBHcmlkUm91dGVyLmFuZ2xlQmV0d2VlbjJMaW5lcyhsaSwgbCkgPCAwID8gMSA6IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHgyLCB5MjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZHgpID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4MiA9IHgwICsgZHggLyBNYXRoLmFicyhkeCkgKiBjb3JuZXJyYWRpdXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHkyID0geTA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4MiA9IHgwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB5MiA9IHkwICsgZHkgLyBNYXRoLmFicyhkeSkgKiBjb3JuZXJyYWRpdXM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjeCA9IE1hdGguYWJzKHgyIC0geCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN5ID0gTWF0aC5hYnMoeTIgLSB5KTtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucm91dGVwYXRoICs9ICdBICcgKyBjeCArICcgJyArIGN5ICsgJyAwIDAgJyArIGFuZ2xlICsgJyAnICsgeDIgKyAnICcgKyB5MiArICcgJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhcnJvd3RpcCA9IFt4LCB5XTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYXJyb3djb3JuZXIxLCBhcnJvd2Nvcm5lcjI7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGR4KSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeCAtPSBkeCAvIE1hdGguYWJzKGR4KSAqIGFycm93aGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJvd2Nvcm5lcjEgPSBbeCwgeSArIGFycm93d2lkdGhdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJvd2Nvcm5lcjIgPSBbeCwgeSAtIGFycm93d2lkdGhdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeSAtPSBkeSAvIE1hdGguYWJzKGR5KSAqIGFycm93aGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJvd2Nvcm5lcjEgPSBbeCArIGFycm93d2lkdGgsIHldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJvd2Nvcm5lcjIgPSBbeCAtIGFycm93d2lkdGgsIHldO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucm91dGVwYXRoICs9ICdMICcgKyB4ICsgJyAnICsgeSArICcgJztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXJyb3doZWlnaHQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5hcnJvd3BhdGggPSAnTSAnICsgYXJyb3d0aXBbMF0gKyAnICcgKyBhcnJvd3RpcFsxXSArICcgTCAnICsgYXJyb3djb3JuZXIxWzBdICsgJyAnICsgYXJyb3djb3JuZXIxWzFdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArICcgTCAnICsgYXJyb3djb3JuZXIyWzBdICsgJyAnICsgYXJyb3djb3JuZXIyWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGxpID0gcm91dGVbMF07XHJcbiAgICAgICAgICAgIHZhciB4ID0gbGlbMV0ueCwgeSA9IGxpWzFdLnk7XHJcbiAgICAgICAgICAgIHZhciBkeCA9IHggLSBsaVswXS54O1xyXG4gICAgICAgICAgICB2YXIgZHkgPSB5IC0gbGlbMF0ueTtcclxuICAgICAgICAgICAgdmFyIGFycm93dGlwID0gW3gsIHldO1xyXG4gICAgICAgICAgICB2YXIgYXJyb3djb3JuZXIxLCBhcnJvd2Nvcm5lcjI7XHJcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhkeCkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB4IC09IGR4IC8gTWF0aC5hYnMoZHgpICogYXJyb3doZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBhcnJvd2Nvcm5lcjEgPSBbeCwgeSArIGFycm93d2lkdGhdO1xyXG4gICAgICAgICAgICAgICAgYXJyb3djb3JuZXIyID0gW3gsIHkgLSBhcnJvd3dpZHRoXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHkgLT0gZHkgLyBNYXRoLmFicyhkeSkgKiBhcnJvd2hlaWdodDtcclxuICAgICAgICAgICAgICAgIGFycm93Y29ybmVyMSA9IFt4ICsgYXJyb3d3aWR0aCwgeV07XHJcbiAgICAgICAgICAgICAgICBhcnJvd2Nvcm5lcjIgPSBbeCAtIGFycm93d2lkdGgsIHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc3VsdC5yb3V0ZXBhdGggKz0gJ0wgJyArIHggKyAnICcgKyB5ICsgJyAnO1xyXG4gICAgICAgICAgICBpZiAoYXJyb3doZWlnaHQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQuYXJyb3dwYXRoID0gJ00gJyArIGFycm93dGlwWzBdICsgJyAnICsgYXJyb3d0aXBbMV0gKyAnIEwgJyArIGFycm93Y29ybmVyMVswXSArICcgJyArIGFycm93Y29ybmVyMVsxXVxyXG4gICAgICAgICAgICAgICAgICAgICsgJyBMICcgKyBhcnJvd2Nvcm5lcjJbMF0gKyAnICcgKyBhcnJvd2Nvcm5lcjJbMV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gR3JpZFJvdXRlcjtcclxufSgpKTtcclxuZXhwb3J0cy5HcmlkUm91dGVyID0gR3JpZFJvdXRlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z3JpZHJvdXRlci5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy93ZWJjb2xhL2Rpc3Qvc3JjL2dyaWRyb3V0ZXIuanNcbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7TmV0d29ya2luZ30gZnJvbSBcIi4uL2V0Yy9OZXR3b3JraW5nXCI7XG5pbXBvcnQge0xvb3NlT2JqZWN0fSBmcm9tIFwiLi4vZXRjL0xvY2FsVHlwZXNcIjtcblxuZXhwb3J0IGNsYXNzIFMyU0FwaSB7XG5cblxuICAgIHN0YXRpYyB0cmFuc2xhdGUoe2lucHV0fSkge1xuICAgICAgICBjb25zdCByZXF1ZXN0ID0gTmV0d29ya2luZy5hamF4X3JlcXVlc3QoJy9hcGkvdHJhbnNsYXRlJyk7XG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBuZXcgTWFwKFtbJ2luJywgaW5wdXRdXSk7XG5cbiAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHBheWxvYWQpXG4gICAgfVxuXG5cbiAgICBzdGF0aWMgY2xvc2VXb3Jkcyh7aW5wdXQsIGxpbWl0ID0gNTAsIGxvYyA9ICdzcmMnfSkge1xuICAgICAgICBjb25zdCByZXF1ZXN0ID0gTmV0d29ya2luZy5hamF4X3JlcXVlc3QoJy9hcGkvY2xvc2Vfd29yZHMnKTtcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IG5ldyBNYXAoW1xuICAgICAgICAgICAgWydpbicsIGlucHV0XSxcbiAgICAgICAgICAgIFsnbG9jJywgbG9jXSxcbiAgICAgICAgICAgIFsnbGltaXQnLCBsaW1pdF1dKTtcblxuICAgICAgICByZXR1cm4gcmVxdWVzdFxuICAgICAgICAgICAgLmdldChwYXlsb2FkKVxuICAgIH1cblxuICAgIHN0YXRpYyBjb21wYXJlVHJhbnNsYXRpb24oe3Bpdm90LCBjb21wYXJlfSkge1xuICAgICAgICBjb25zdCByZXF1ZXN0ID0gTmV0d29ya2luZy5hamF4X3JlcXVlc3QoJy9hcGkvY29tcGFyZV90cmFuc2xhdGlvbicpO1xuICAgICAgICBjb25zdCBwYXlsb2FkID0gbmV3IE1hcChbXG4gICAgICAgICAgICBbJ2luJywgcGl2b3RdLFxuICAgICAgICAgICAgWydjb21wYXJlJywgY29tcGFyZV1dKTtcblxuICAgICAgICByZXR1cm4gcmVxdWVzdFxuICAgICAgICAgICAgLmdldChwYXlsb2FkKVxuICAgIH1cblxuXG59XG5cblxuZXhwb3J0IGNsYXNzIFRyYW5zbGF0aW9uIHtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3Jlc3VsdDoge1xuICAgICAgICBhdHRuOm51bWJlcltdW11bXSxcbiAgICAgICAgYXR0bkZpbHRlcmVkOm51bWJlcltdW11bXSxcbiAgICAgICAgc2NvcmVzOm51bWJlcltdLFxuICAgICAgICBkZWNvZGVyOiB7c3RhdGU6bnVtYmVyW10sIHRva2VuOnN0cmluZ31bXVtdLFxuICAgICAgICBlbmNvZGVyOiB7c3RhdGU6bnVtYmVyW10sIHRva2VuOnN0cmluZ31bXSxcbiAgICAgICAgW2tleTogc3RyaW5nXTogYW55XG4gICAgfSA9IG51bGw7XG5cbiAgICBwdWJsaWMgX2N1cnJlbnQ6TG9vc2VPYmplY3Q7XG5cbiAgICBjb25zdHJ1Y3RvcihyZXN1bHQsIGN1cnJlbnQpIHtcbiAgICAgICAgdGhpcy5fcmVzdWx0ID0gcmVzdWx0O1xuICAgICAgICB0aGlzLl9jdXJyZW50ID0gY3VycmVudDtcbiAgICB9XG5cbiAgICBnZXQgcmVzdWx0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzdWx0O1xuICAgIH1cblxuICAgIGdldCBhdHRuKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXN1bHQuYXR0bjtcbiAgICB9XG5cbiAgICBnZXQgYXR0bkZpbHRlcmVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzdWx0LmF0dG5GaWx0ZXJlZDtcbiAgICB9XG5cbiAgICBnZXQgZW5jb2RlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3VsdC5lbmNvZGVyO1xuICAgIH1cblxuICAgIGdldCBkZWNvZGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzdWx0LmRlY29kZXI7XG4gICAgfVxuXG4gICAgZ2V0IHNjb3Jlcygpe1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzdWx0LnNjb3JlcztcbiAgICB9XG5cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi90cy9hcGkvUzJTQXBpLnRzIiwiaW1wb3J0ICogYXMgZDMgZnJvbSBcImQzXCJcbmltcG9ydCAqIGFzIF8gZnJvbSBcImxvZGFzaFwiO1xuXG5pbXBvcnQge1BhbmVsQ29udHJvbGxlcn0gZnJvbSBcIi4vY29udHJvbGxlci9QYW5lbENvbnRyb2xsZXJcIjtcbmltcG9ydCB7UzJTQXBpLCBUcmFuc2xhdGlvbn0gZnJvbSBcIi4vYXBpL1MyU0FwaVwiO1xuXG53aW5kb3cub25sb2FkID0gKCkgPT4ge1xuICAgIC8vIGxldCBzdmcgPSBkMy5zZWxlY3RBbGwoJyN2aXMnKTtcbiAgICAvL1xuICAgIC8vXG4gICAgLy8gY29uc3QgZ2xvYmFsRXZlbnRzID0gbmV3IFNpbXBsZUV2ZW50SGFuZGxlcihzdmcubm9kZSgpKTtcbiAgICAvLyBjb25zdCBzdiA9IG5ldyBTMlNBdHRlbnRpb24oe3BhcmVudDogc3ZnLCBldmVudEhhbmRsZXI6IGdsb2JhbEV2ZW50c30pO1xuXG4gICAgY29uc3QgcGFuZWxDdHJsID0gbmV3IFBhbmVsQ29udHJvbGxlcigpO1xuXG5cbiAgICAvLyAgICAtLS0gRVZFTlRTIC0tLVxuXG4gICAgY29uc3QgdXBkYXRlQWxsVmlzID0gKCkgPT4ge1xuICAgICAgICAkKCcjc3Bpbm5lcicpLnNob3coKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+IGQzLnNlbGVjdCgnI3F1ZXJ5X2lucHV0Jykubm9kZSgpKS52YWx1ZTtcblxuXG4gICAgICAgIFMyU0FwaS50cmFuc2xhdGUoe2lucHV0OiB2YWx1ZS50cmltKCl9KVxuICAgICAgICAgICAgLnRoZW4oKGRhdGE6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEsIFwiLS0tIGRhdGFcIik7XG4gICAgICAgICAgICAgICAgY29uc3QgcmF3X2RhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgICAgIHBhbmVsQ3RybC51cGRhdGUocmF3X2RhdGEpO1xuXG5cbiAgICAgICAgICAgICAgICAkKCcjc3Bpbm5lcicpLmhpZGUoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGVycm9yOiBFcnJvcikgPT4gY29uc29sZS5sb2coZXJyb3IsIFwiLS0tIGVycm9yXCIpKTtcbiAgICB9O1xuXG4gICAgY29uc3QgdXBkYXRlRGVib3VuY2VkID0gXy5kZWJvdW5jZSh1cGRhdGVBbGxWaXMsIDEwMDApO1xuXG4gICAgZDMuc2VsZWN0KCcjcXVlcnlfYnV0dG9uJykub24oJ2NsaWNrJywgdXBkYXRlQWxsVmlzKTtcblxuICAgIGQzLnNlbGVjdCgnI3F1ZXJ5X2lucHV0Jykub24oJ2tleXByZXNzJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBrZXljb2RlID0gZDMuZXZlbnQua2V5Q29kZTtcbiAgICAgICAgaWYgKGQzLmV2ZW50IGluc3RhbmNlb2YgS2V5Ym9hcmRFdmVudFxuICAgICAgICAvLyYmIChrZXljb2RlID09PSAxMyB8fCBrZXljb2RlID09PSAzMilcbiAgICAgICAgKSB7XG5cbiAgICAgICAgICAgIHVwZGF0ZURlYm91bmNlZCgpO1xuICAgICAgICAgICAgLy8gdXBkYXRlQWxsVmlzKCk7XG4gICAgICAgIH1cbiAgICB9KVxuXG5cbiAgICAvLyBsaXR0bGUgZXZlbnRIYW5kbGluZ1xuICAgIC8vIGdsb2JhbEV2ZW50cy5iaW5kKCdzdmctcmVzaXplJywgKHt3aWR0aCwgaGVpZ2h0fSkgPT4gc3ZnLmF0dHJzKHt3aWR0aCwgaGVpZ2h0fSkpO1xuXG4gICAgZnVuY3Rpb24gd2luZG93UmVzaXplKCkge1xuICAgICAgICBjb25zdCB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICBjb25zdCBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSAkKFwiI3RpdGxlXCIpLmhlaWdodCgpIC0gJChcIiN1aVwiKS5oZWlnaHQoKSAtIDU7XG4gICAgICAgIC8vIGdsb2JhbEV2ZW50cy50cmlnZ2VyKCdzdmctcmVzaXplJywge3dpZHRoLCBoZWlnaHR9KVxuICAgIH1cblxuXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSh3aW5kb3dSZXNpemUpO1xuXG4gICAgd2luZG93UmVzaXplKCk7XG5cblxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi90cy9tYWluLnRzIiwiaW1wb3J0ICogYXMgZDMgZnJvbSAnZDMnXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB7U2ltcGxlRXZlbnRIYW5kbGVyfSBmcm9tIFwiLi4vZXRjL1NpbXBsZUV2ZW50SGFuZGxlclwiO1xuaW1wb3J0IHtXb3JkTGluZSwgV29yZExpbmVIb3ZlckV2ZW50fSBmcm9tIFwiLi4vdmlzL1dvcmRMaW5lXCJcbmltcG9ydCB7QmFyTGlzdH0gZnJvbSBcIi4uL3Zpcy9CYXJMaXN0XCI7XG5pbXBvcnQge1N0YXRlVmlzfSBmcm9tIFwiLi4vdmlzL1N0YXRlVmlzXCI7XG5pbXBvcnQge0F0dGVudGlvblZpc30gZnJvbSBcIi4uL3Zpcy9BdHRlbnRpb25WaXNcIjtcbmltcG9ydCB7V29yZFByb2plY3Rvcn0gZnJvbSBcIi4uL3Zpcy9Xb3JkUHJvamVjdG9yXCI7XG5pbXBvcnQge0Nsb3NlV29yZExpc3R9IGZyb20gXCIuLi92aXMvQ2xvc2VXb3JkTGlzdFwiO1xuaW1wb3J0IHtTMlNBcGksIFRyYW5zbGF0aW9ufSBmcm9tIFwiLi4vYXBpL1MyU0FwaVwiO1xuaW1wb3J0IHtMb29zZU9iamVjdH0gZnJvbSBcIi4uL2V0Yy9Mb2NhbFR5cGVzXCI7XG5pbXBvcnQge1ZDb21wb25lbnR9IGZyb20gXCIuLi92aXMvVmlzdWFsQ29tcG9uZW50XCI7XG5cblxudHlwZSBWaXNDb2x1bW48RFc9V29yZExpbmU+ID0ge1xuICAgIGVuY29kZXJfZXh0cmE6IFZDb21wb25lbnRbXSxcbiAgICBlbmNvZGVyX3dvcmRzOiBXb3JkTGluZSxcbiAgICBhdHRlbnRpb246IEF0dGVudGlvblZpcyxcbiAgICBkZWNvZGVyX3dvcmRzOiBEVyxcbiAgICBkZWNvZGVyX2V4dHJhOiBWQ29tcG9uZW50W11cbn1cblxudHlwZSBWaXNBbGwgPSB7XG4gICAgemVybzogVmlzQ29sdW1uPEJhckxpc3Q+LFxuICAgIGxlZnQ6IFZpc0NvbHVtbixcbiAgICBtaWRkbGU6IFZpc0NvbHVtbixcbiAgICByaWdodDogVmlzQ29sdW1uLFxuICAgIHNldHVwX2xlZnQ6IFZpc0NvbHVtbixcbiAgICBzZXR1cF9yaWdodDogVmlzQ29sdW1uLFxufVxuXG5cbmV4cG9ydCBjbGFzcyBQYW5lbENvbnRyb2xsZXIge1xuICAgIHByaXZhdGUgX2NvbHVtbnM6IExvb3NlT2JqZWN0O1xuICAgIHByaXZhdGUgX3ZpczogVmlzQWxsO1xuICAgIHByaXZhdGUgX2N1cnJlbnQ6IExvb3NlT2JqZWN0O1xuICAgIHByaXZhdGUgZXZlbnRIYW5kbGVyOiBTaW1wbGVFdmVudEhhbmRsZXI7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fY29sdW1ucyA9IHtcbiAgICAgICAgICAgIHplcm86IGQzLnNlbGVjdCgnLmNvbDAnKSxcbiAgICAgICAgICAgIGxlZnQ6IGQzLnNlbGVjdCgnLmNvbDEnKSxcbiAgICAgICAgICAgIG1pZGRsZTogZDMuc2VsZWN0KCcuY29sMycpLFxuICAgICAgICAgICAgcmlnaHQ6IGQzLnNlbGVjdCgnLmNvbDUnKSxcbiAgICAgICAgICAgIHNldHVwX2xlZnQ6IGQzLnNlbGVjdCgnLmNvbDInKSxcbiAgICAgICAgICAgIHNldHVwX3JpZ2h0OiBkMy5zZWxlY3QoJy5jb2w0JyksXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaW5pdFBhbmVsID0gKCkgPT4gKHtcbiAgICAgICAgICAgIGVuY29kZXJfZXh0cmE6IFtdLFxuICAgICAgICAgICAgZW5jb2Rlcl93b3JkczogbnVsbCxcbiAgICAgICAgICAgIGF0dGVudGlvbjogbnVsbCxcbiAgICAgICAgICAgIGRlY29kZXJfd29yZHM6IG51bGwsXG4gICAgICAgICAgICBkZWNvZGVyX2V4dHJhOiBbXVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fdmlzID0ge1xuICAgICAgICAgICAgemVybzogaW5pdFBhbmVsKCksXG4gICAgICAgICAgICBsZWZ0OiBpbml0UGFuZWwoKSxcbiAgICAgICAgICAgIG1pZGRsZTogaW5pdFBhbmVsKCksXG4gICAgICAgICAgICByaWdodDogaW5pdFBhbmVsKCksXG4gICAgICAgICAgICBzZXR1cF9sZWZ0OiBpbml0UGFuZWwoKSxcbiAgICAgICAgICAgIHNldHVwX3JpZ2h0OiBpbml0UGFuZWwoKVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX2N1cnJlbnQgPSB7XG4gICAgICAgICAgICB0b3BOOiAwLFxuICAgICAgICAgICAgaW5Xb3JkUG9zOiBbXSxcbiAgICAgICAgICAgIG91dFdvcmRQb3M6IFtdLFxuICAgICAgICAgICAgaW5Xb3JkczogW10sXG4gICAgICAgICAgICBvdXRXb3JkczogW10sXG4gICAgICAgICAgICBoaWRlU3RhdGVzOiBmYWxzZSxcbiAgICAgICAgICAgIGJveF93aWR0aDogNTAsXG4gICAgICAgICAgICB3b3JkUHJvamVjdG9yOiBudWxsLFxuICAgICAgICAgICAgY2xvc2VXb3Jkc0xpc3Q6IG51bGxcbiAgICAgICAgfTtcblxuXG4gICAgICAgIHRoaXMuZXZlbnRIYW5kbGVyID0gbmV3IFNpbXBsZUV2ZW50SGFuZGxlcig8RWxlbWVudD4gZDMuc2VsZWN0KCdib2R5Jykubm9kZSgpKTtcblxuICAgICAgICB0aGlzLl9pbml0KClcblxuICAgICAgICB0aGlzLl9iaW5kRXZlbnRzKCk7XG5cbiAgICB9XG5cbiAgICBfaW5pdCgpIHtcblxuICAgICAgICB0aGlzLl92aXMubGVmdC5lbmNvZGVyX2V4dHJhLnB1c2godGhpcy5fY3JlYXRlU3RhdGVzVmlzKHtcbiAgICAgICAgICAgIGNvbDogdGhpcy5fY29sdW1ucy5sZWZ0LFxuICAgICAgICAgICAgY2xhc3NOYW1lOiAnc3RhdGVzX2VuY29kZXInLFxuICAgICAgICAgICAgZGl2U3R5bGVzOiB7J3BhZGRpbmctdG9wJzogJzVweCd9LFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGRhdGFfYWNjZXNzOiBkID0+IGQuZW5jb2Rlci5tYXAoZSA9PiBfLmlzQXJyYXkoZS5zdGF0ZSkgPyBlLnN0YXRlIDogW10pLC8vIFRPRE86IGZpeCBoYWNrICEhIVxuICAgICAgICAgICAgICAgIGhpZGRlbjogdGhpcy5fY3VycmVudC5oaWRlU3RhdGVzLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMTAwLFxuICAgICAgICAgICAgICAgIGNlbGxfd2lkdGg6IHRoaXMuX2N1cnJlbnQuYm94X3dpZHRoXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcblxuICAgICAgICB0aGlzLl92aXMubGVmdC5lbmNvZGVyX3dvcmRzID0gdGhpcy5fY3JlYXRlV29yZExpbmUoe1xuICAgICAgICAgICAgY29sOiB0aGlzLl9jb2x1bW5zLmxlZnQsXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdlbmNvZGVyX3dvcmRzJyxcbiAgICAgICAgICAgIGRpdlN0eWxlczogeydwYWRkaW5nLXRvcCc6ICc1cHgnfSxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBib3hfdHlwZTogdGhpcy5fY3VycmVudC5oaWRlU3RhdGVzID8gV29yZExpbmUuQm94VHlwZS5mbG93IDogV29yZExpbmUuQm94VHlwZS5maXhlZCxcbiAgICAgICAgICAgICAgICBib3hfd2lkdGg6IHRoaXMuX2N1cnJlbnQuYm94X3dpZHRoXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX3Zpcy5sZWZ0LmF0dGVudGlvbiA9IHRoaXMuX2NyZWF0ZUF0dGVudGlvbih7XG4gICAgICAgICAgICBjb2w6IHRoaXMuX2NvbHVtbnMubGVmdCxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2F0dG5fdmlzJyxcbiAgICAgICAgICAgIG9wdGlvbnM6IHt9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX3Zpcy5sZWZ0LmRlY29kZXJfd29yZHMgPSB0aGlzLl9jcmVhdGVXb3JkTGluZSh7XG4gICAgICAgICAgICBjb2w6IHRoaXMuX2NvbHVtbnMubGVmdCxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2RlY29kZXJfd29yZHMnLFxuICAgICAgICAgICAgZGl2U3R5bGVzOiB7J3BhZGRpbmctYm90dG9tJzogJzVweCd9LFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGJveF93aWR0aDogdGhpcy5fY3VycmVudC5ib3hfd2lkdGgsXG4gICAgICAgICAgICAgICAgYm94X3R5cGU6IHRoaXMuX2N1cnJlbnQuaGlkZVN0YXRlcyA/IFdvcmRMaW5lLkJveFR5cGUuZmxvdyA6IFdvcmRMaW5lLkJveFR5cGUuZml4ZWQsXG4gICAgICAgICAgICAgICAgY3NzX2NsYXNzX21haW46ICdvdXRXb3JkJyxcbiAgICAgICAgICAgICAgICBkYXRhX2FjY2VzczogZCA9PiBkLmRlY29kZXIubGVuZ3RoID8gW2QuZGVjb2Rlclt0aGlzLl9jdXJyZW50LnRvcE5dXSA6IFtdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX3Zpcy5sZWZ0LmRlY29kZXJfZXh0cmEucHVzaCh0aGlzLl9jcmVhdGVTdGF0ZXNWaXMoe1xuICAgICAgICAgICAgY29sOiB0aGlzLl9jb2x1bW5zLmxlZnQsXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdzdGF0ZXNfZGVjb2RlcicsXG4gICAgICAgICAgICBkaXZTdHlsZXM6IHsncGFkZGluZy1ib3R0b20nOiAnNXB4J30sXG4gICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgZGF0YV9hY2Nlc3M6IGQgPT5cbiAgICAgICAgICAgICAgICAgICAgKGQuZGVjb2Rlci5sZW5ndGggPiB0aGlzLl9jdXJyZW50LnRvcE4pID9cbiAgICAgICAgICAgICAgICAgICAgICAgIGQuZGVjb2Rlclt0aGlzLl9jdXJyZW50LnRvcE5dLm1hcChlID0+IF8uaXNBcnJheShlLnN0YXRlKSA/IGUuc3RhdGUgOiBbXSkgOiBbW11dLCAvLyBUT0RPOiBmaXggaGFjayAhISFcbiAgICAgICAgICAgICAgICBoaWRkZW46IHRoaXMuX2N1cnJlbnQuaGlkZVN0YXRlcyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDEwMCxcbiAgICAgICAgICAgICAgICBjZWxsX3dpZHRoOiB0aGlzLl9jdXJyZW50LmJveF93aWR0aFxuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgdGhpcy5fdmlzLmxlZnQuZGVjb2Rlcl9leHRyYS5wdXNoKHRoaXMuX2NyZWF0ZVdvcmRMaW5lKHtcbiAgICAgICAgICAgIGNvbDogdGhpcy5fY29sdW1ucy5sZWZ0LFxuICAgICAgICAgICAgY2xhc3NOYW1lOiAnZGVjb2Rlcl90b3BLJyxcbiAgICAgICAgICAgIGRpdlN0eWxlczogeydwYWRkaW5nLXRvcCc6ICc1cHgnfSxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBjc3NfY2xhc3NfbWFpbjogJ3RvcEtXb3JkJyxcbiAgICAgICAgICAgICAgICBkYXRhX2FjY2VzczogZCA9PiBkLmRlY29kZXIuZmlsdGVyKChfLCBpKSA9PiBpICE9PSB0aGlzLl9jdXJyZW50LnRvcE4pXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKVxuXG5cbiAgICAgICAgLy8gWmVyb1xuXG5cbiAgICAgICAgdGhpcy5fdmlzLnplcm8uZW5jb2Rlcl9leHRyYS5wdXNoKFBhbmVsQ29udHJvbGxlci5fc2V0dXBQYW5lbCh7XG4gICAgICAgICAgICBjb2w6IHRoaXMuX2NvbHVtbnMuemVybyxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJlbmNvZGVyX3N0YXRlc19zZXR1cFwiLFxuICAgICAgICAgICAgYWRkU1ZHOiBmYWxzZSxcbiAgICAgICAgICAgIHRpdGxlOiAnRW5jIHN0YXRlczogJyxcbiAgICAgICAgICAgIGRpdlN0eWxlczoge2hlaWdodDogJzEwMHB4Jywgd2lkdGg6ICcxMDBweCcsICdwYWRkaW5nLXRvcCc6ICc1cHgnfVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgdGhpcy5fdmlzLnplcm8uZW5jb2Rlcl93b3JkcyA9IFBhbmVsQ29udHJvbGxlci5fc2V0dXBQYW5lbCh7XG4gICAgICAgICAgICBjb2w6IHRoaXMuX2NvbHVtbnMuemVybyxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJlbmNvZGVyX3dvcmRzX3NldHVwXCIsXG4gICAgICAgICAgICBhZGRTVkc6IGZhbHNlLFxuICAgICAgICAgICAgdGl0bGU6ICdFbmMgd29yZHM6ICcsXG4gICAgICAgICAgICBkaXZTdHlsZXM6IHtoZWlnaHQ6ICcyMXB4Jywgd2lkdGg6ICcxMDBweCcsICdwYWRkaW5nLXRvcCc6ICc1cHgnfVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuX3Zpcy56ZXJvLmF0dGVudGlvbiA9IFBhbmVsQ29udHJvbGxlci5fc2V0dXBQYW5lbCh7XG4gICAgICAgICAgICBjb2w6IHRoaXMuX2NvbHVtbnMuemVybyxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJhdHRuX3NldHVwXCIsXG4gICAgICAgICAgICBhZGRTVkc6IGZhbHNlLFxuICAgICAgICAgICAgdGl0bGU6ICdBdHRlbnRpb246ICcsXG4gICAgICAgICAgICBkaXZTdHlsZXM6IHtoZWlnaHQ6ICc1MHB4Jywgd2lkdGg6ICcxMDBweCd9XG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZFZhcmlhYmxlXG4gICAgICAgIHRoaXMuX3Zpcy56ZXJvLmRlY29kZXJfd29yZHMgPSB0aGlzLl9jcmVhdGVTY29yZVZpcyh7XG4gICAgICAgICAgICBjb2w6IHRoaXMuX2NvbHVtbnMuemVybyxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkZWNvZGVyX3dvcmRzX3NldHVwXCIsXG4gICAgICAgICAgICBkaXZTdHlsZXM6IHtoZWlnaHQ6ICcyMXB4Jywgd2lkdGg6ICcxMDBweCcsICdwYWRkaW5nLWJvdHRvbSc6ICc1cHgnfSxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBiYXJfaGVpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICBkYXRhX2FjY2VzczogZCA9PiBbZC5zY29yZXNbdGhpcy5fY3VycmVudC50b3BOXV0sXG4gICAgICAgICAgICAgICAgZGF0YV9hY2Nlc3NfYWxsOiBkID0+IGQuc2NvcmVzXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5fdmlzLnplcm8uZGVjb2Rlcl9leHRyYS5wdXNoKFBhbmVsQ29udHJvbGxlci5fc2V0dXBQYW5lbCh7XG4gICAgICAgICAgICBjb2w6IHRoaXMuX2NvbHVtbnMuemVybyxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkZWNvZGVyX3N0YXRlc19zZXR1cFwiLFxuICAgICAgICAgICAgYWRkU1ZHOiBmYWxzZSxcbiAgICAgICAgICAgIHRpdGxlOiAnRGVjIHN0YXRlczogJyxcbiAgICAgICAgICAgIGRpdlN0eWxlczoge2hlaWdodDogJzEwMHB4Jywgd2lkdGg6ICcxMDBweCcsICdwYWRkaW5nLWJvdHRvbSc6ICc1cHgnfVxuICAgICAgICB9KSlcblxuICAgICAgICB0aGlzLl92aXMuemVyby5kZWNvZGVyX2V4dHJhLnB1c2godGhpcy5fY3JlYXRlU2NvcmVWaXMoe1xuICAgICAgICAgICAgY29sOiB0aGlzLl9jb2x1bW5zLnplcm8sXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGVjb2Rlcl93b3Jkc19zZXR1cFwiLFxuICAgICAgICAgICAgZGl2U3R5bGVzOiB7d2lkdGg6ICcxMDBweCcsICdwYWRkaW5nLXRvcCc6ICc1cHgnfSxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBiYXJfaGVpZ2h0OiAyMyxcbiAgICAgICAgICAgICAgICBkYXRhX2FjY2VzczogZCA9PiBkLnNjb3Jlcy5maWx0ZXIoKF8sIGkpID0+IGkgIT09IHRoaXMuX2N1cnJlbnQudG9wTiksXG4gICAgICAgICAgICAgICAgZGF0YV9hY2Nlc3NfYWxsOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKVxuXG4gICAgfVxuXG4gICAgdXBkYXRlKHJhd19kYXRhKSB7XG5cbiAgICAgICAgY29uc3QgY3VyID0gdGhpcy5fY3VycmVudDtcbiAgICAgICAgY29uc3QgZGF0YSA9IG5ldyBUcmFuc2xhdGlvbihyYXdfZGF0YSwgY3VyKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhLCBcIi0tLSBkYXRhXCIpO1xuXG5cbiAgICAgICAgY29uc3QgZW5jID0gPFdvcmRMaW5lPiB0aGlzLl92aXMubGVmdC5lbmNvZGVyX3dvcmRzO1xuICAgICAgICBjb25zdCBkZWMgPSA8V29yZExpbmU+IHRoaXMuX3Zpcy5sZWZ0LmRlY29kZXJfd29yZHM7XG5cbiAgICAgICAgY29uc29sZS5sb2codGhpcy5fdmlzLCBcIi0tLSB0aGlzLl92aXNcIik7XG4gICAgICAgIGVuYy51cGRhdGUoZGF0YSk7XG4gICAgICAgIGRlYy51cGRhdGUoZGF0YSk7XG5cbiAgICAgICAgY3VyLmluV29yZFBvcyA9IGVuYy5wb3NpdGlvbnNbMF07XG4gICAgICAgIGN1ci5pbldvcmRzID0gZW5jLnJvd3NbMF07XG4gICAgICAgIGN1ci5vdXRXb3JkUG9zID0gZGVjLnBvc2l0aW9uc1swXTtcbiAgICAgICAgY3VyLm91dFdvcmRzID0gZGVjLnJvd3NbMF07XG4gICAgICAgIGRhdGEuX2N1cnJlbnQgPSBjdXI7XG5cbiAgICAgICAgY29uc3QgYXR0biA9IDxBdHRlbnRpb25WaXM+IHRoaXMuX3Zpcy5sZWZ0LmF0dGVudGlvbjtcbiAgICAgICAgYXR0bi51cGRhdGUoZGF0YSk7XG5cbiAgICAgICAgdGhpcy5fdmlzLmxlZnQuZW5jb2Rlcl9leHRyYS5mb3JFYWNoKGUgPT4gZS51cGRhdGUoZGF0YSkpO1xuICAgICAgICB0aGlzLl92aXMubGVmdC5kZWNvZGVyX2V4dHJhLmZvckVhY2goZSA9PiBlLnVwZGF0ZShkYXRhKSk7XG5cblxuICAgICAgICAvLz09PT0gc2V0dXAgY29sdW1uXG5cbiAgICAgICAgdGhpcy5fdmlzLnplcm8uZGVjb2Rlcl93b3Jkcy51cGRhdGUoZGF0YSk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuX3Zpcy56ZXJvLmRlY29kZXJfd29yZHMueFNjYWxlLCBcIi0tLSB0aGlzLl92aXMuemVyby5kZWNvZGVyX3dvcmRzLnhTY2FsZVwiKTtcblxuICAgICAgICB0aGlzLl92aXMuemVyby5kZWNvZGVyX2V4dHJhLmZvckVhY2goZCA9PiB7XG4gICAgICAgICAgICBpZiAoJ3VwZGF0ZU9wdGlvbnMnIGluIGQpIHtcbiAgICAgICAgICAgICAgICBkLnVwZGF0ZU9wdGlvbnMoe29wdGlvbnM6IHt4U2NhbGU6IHRoaXMuX3Zpcy56ZXJvLmRlY29kZXJfd29yZHMueFNjYWxlfX0pO1xuICAgICAgICAgICAgICAgIGQudXBkYXRlKGRhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cblxuICAgIH1cblxuXG4gICAgc3RhdGljIF9zZXR1cFBhbmVsKHtjb2wsIGNsYXNzTmFtZSwgZGl2U3R5bGVzLCBhZGRTVkcgPSB0cnVlLCB0aXRsZSA9IDxzdHJpbmc+IG51bGx9KSB7XG4gICAgICAgIGNvbnN0IGRpdiA9IGNvbFxuICAgICAgICAgICAgLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnc2V0dXAgJyArIGNsYXNzTmFtZSkuc3R5bGVzKGRpdlN0eWxlcylcbiAgICAgICAgLy8gLnN0eWxlKCdiYWNrZ3JvdW5kJywgJ2xpZ2h0Z3JheScpO1xuICAgICAgICBpZiAodGl0bGUpIHtcbiAgICAgICAgICAgIGRpdi5odG1sKHRpdGxlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWRkU1ZHKSByZXR1cm4gZGl2LmFwcGVuZCgnc3ZnJykuYXR0cnMoe3dpZHRoOiAxMDAsIGhlaWdodDogMzB9KVxuICAgICAgICAgICAgLnN0eWxlcyh7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaydcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBlbHNlIHJldHVybiBkaXY7XG4gICAgfVxuXG4gICAgX2NyZWF0ZVNjb3JlVmlzKHtjb2wsIGNsYXNzTmFtZSwgb3B0aW9ucywgZGl2U3R5bGVzfSkge1xuICAgICAgICBjb25zdCBzdmcgPSBQYW5lbENvbnRyb2xsZXIuX3NldHVwUGFuZWwoe2NvbCwgY2xhc3NOYW1lLCBkaXZTdHlsZXMsIGFkZFNWRzogdHJ1ZX0pO1xuXG4gICAgICAgIHJldHVybiBuZXcgQmFyTGlzdChzdmcsIHRoaXMuZXZlbnRIYW5kbGVyLCBvcHRpb25zKVxuICAgIH1cblxuXG4gICAgc3RhdGljIF9zdGFuZGFyZFNWR1BhbmVsKHtjb2wsIGNsYXNzTmFtZSwgZGl2U3R5bGVzfSkge1xuICAgICAgICByZXR1cm4gY29sXG4gICAgICAgICAgICAuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsIGNsYXNzTmFtZSkuc3R5bGVzKGRpdlN0eWxlcylcbiAgICAgICAgICAgIC5hcHBlbmQoJ3N2ZycpLmF0dHJzKHt3aWR0aDogNTAwLCBoZWlnaHQ6IDMwfSk7XG4gICAgfVxuXG5cbiAgICBfY3JlYXRlU3RhdGVzVmlzKHtjb2wsIGNsYXNzTmFtZSwgb3B0aW9ucywgZGl2U3R5bGVzfSkge1xuICAgICAgICBjb25zdCBzdmcgPSBQYW5lbENvbnRyb2xsZXIuX3N0YW5kYXJkU1ZHUGFuZWwoe2NvbCwgY2xhc3NOYW1lLCBkaXZTdHlsZXN9KTtcblxuICAgICAgICByZXR1cm4gbmV3IFN0YXRlVmlzKHN2ZywgdGhpcy5ldmVudEhhbmRsZXIsIG9wdGlvbnMpO1xuICAgIH1cblxuXG4gICAgX2NyZWF0ZUF0dGVudGlvbih7Y29sLCBjbGFzc05hbWUsIG9wdGlvbnMsIGRpdlN0eWxlcyA9IG51bGx9KSB7XG4gICAgICAgIGNvbnN0IHN2ZyA9IFBhbmVsQ29udHJvbGxlci5fc3RhbmRhcmRTVkdQYW5lbCh7Y29sLCBjbGFzc05hbWUsIGRpdlN0eWxlc30pO1xuXG4gICAgICAgIHJldHVybiBuZXcgQXR0ZW50aW9uVmlzKHN2ZywgdGhpcy5ldmVudEhhbmRsZXIsIG9wdGlvbnMpXG4gICAgfVxuXG4gICAgX2NyZWF0ZVdvcmRMaW5lKHtjb2wsIGNsYXNzTmFtZSwgb3B0aW9ucywgZGl2U3R5bGVzfSkge1xuICAgICAgICBjb25zdCBzdmcgPSBQYW5lbENvbnRyb2xsZXIuX3N0YW5kYXJkU1ZHUGFuZWwoe2NvbCwgY2xhc3NOYW1lLCBkaXZTdHlsZXN9KTtcblxuICAgICAgICByZXR1cm4gbmV3IFdvcmRMaW5lKHN2ZywgdGhpcy5ldmVudEhhbmRsZXIsIG9wdGlvbnMpXG4gICAgfVxuXG4gICAgX2NyZWF0ZVdvcmRQcm9qZWN0b3Ioe2NvbCwgY2xhc3NOYW1lLCBvcHRpb25zLCBkaXZTdHlsZXN9KSB7XG4gICAgICAgIGNvbnN0IHN2ZyA9IFBhbmVsQ29udHJvbGxlci5fc3RhbmRhcmRTVkdQYW5lbCh7Y29sLCBjbGFzc05hbWUsIGRpdlN0eWxlc30pO1xuXG4gICAgICAgIHJldHVybiBuZXcgV29yZFByb2plY3RvcihzdmcsIHRoaXMuZXZlbnRIYW5kbGVyLCBvcHRpb25zKVxuICAgIH1cblxuICAgIF9jcmVhdGVDbG9zZVdvcmRMaXN0KHtjb2wsIGNsYXNzTmFtZSwgb3B0aW9ucywgZGl2U3R5bGVzfSkge1xuICAgICAgICBjb25zdCBzdmcgPSBQYW5lbENvbnRyb2xsZXIuX3N0YW5kYXJkU1ZHUGFuZWwoe2NvbCwgY2xhc3NOYW1lLCBkaXZTdHlsZXN9KTtcblxuICAgICAgICByZXR1cm4gbmV3IENsb3NlV29yZExpc3Qoc3ZnLCB0aGlzLmV2ZW50SGFuZGxlciwgb3B0aW9ucylcbiAgICB9XG5cblxuICAgIHVwZGF0ZUFuZFNob3dXb3JkUHJvamVjdG9yKGRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnQud29yZFByb2plY3RvciA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudC53b3JkUHJvamVjdG9yID0gdGhpcy5fY3JlYXRlV29yZFByb2plY3Rvcih7XG4gICAgICAgICAgICAgICAgY29sOiB0aGlzLl9jb2x1bW5zLm1pZGRsZSxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwid29yZF9wcm9qZWN0b3JcIixcbiAgICAgICAgICAgICAgICBkaXZTdHlsZXM6IHsncGFkZGluZy10b3AnOiAnMTA1cHgnfSxcbiAgICAgICAgICAgICAgICBvcHRpb25zOiB7fVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLl9jdXJyZW50LndvcmRQcm9qZWN0b3IsIFwiLS0tIHRoaXMuX2N1cnJlbnQud29yZFByb2plY3RvclwiKTtcbiAgICAgICAgdGhpcy5fY3VycmVudC53b3JkUHJvamVjdG9yLnVwZGF0ZShkYXRhKTtcbiAgICB9XG5cbiAgICBjbG9zZVdvcmRQcm9qZWN0b3IoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50LndvcmRQcm9qZWN0b3IpIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnQud29yZFByb2plY3Rvci5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50LndvcmRQcm9qZWN0b3IgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICB1cGRhdGVBbmRTaG93V29yZExpc3QoZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5fY3VycmVudC5jbG9zZVdvcmRzTGlzdCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudC5jbG9zZVdvcmRzTGlzdCA9IHRoaXMuX2NyZWF0ZUNsb3NlV29yZExpc3Qoe1xuICAgICAgICAgICAgICAgIGNvbDogdGhpcy5fY29sdW1ucy5taWRkbGUsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImNsb3NlX3dvcmRfbGlzdFwiLFxuICAgICAgICAgICAgICAgIGRpdlN0eWxlczogeydwYWRkaW5nLXRvcCc6ICcxMHB4J30sXG4gICAgICAgICAgICAgICAgb3B0aW9uczoge31cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2codGhpcy5fY3VycmVudCwgXCItLS0gdGhpcy5fY3VycmVudFwiKTtcbiAgICAgICAgdGhpcy5fY3VycmVudC5jbG9zZVdvcmRzTGlzdC51cGRhdGUoZGF0YSk7XG4gICAgfVxuXG5cbiAgICBfYmluZEV2ZW50cygpIHtcbiAgICAgICAgY29uc3QgZGV0ZXJtaW5lUGFuZWxUeXBlID0gY2FsbGVyID0+IHtcbiAgICAgICAgICAgIGlmICgoY2FsbGVyID09PSB0aGlzLl92aXMubGVmdC5lbmNvZGVyX3dvcmRzKSB8fCBfLmluY2x1ZGVzKHRoaXMuX3Zpcy5sZWZ0LmVuY29kZXJfZXh0cmEsIGNhbGxlcikpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHt2VHlwZTogQXR0ZW50aW9uVmlzLlZFUlRFWF9UWVBFLkVuY29kZXIsIGNvbDogdGhpcy5fdmlzLmxlZnR9O1xuICAgICAgICAgICAgZWxzZSByZXR1cm4ge3ZUeXBlOiBBdHRlbnRpb25WaXMuVkVSVEVYX1RZUEUuRGVjb2RlciwgY29sOiB0aGlzLl92aXMubGVmdH07XG4gICAgICAgIH07XG5cblxuICAgICAgICB0aGlzLmV2ZW50SGFuZGxlci5iaW5kKFdvcmRMaW5lLmV2ZW50cy53b3JkU2VsZWN0ZWQsIChkLCBlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZC5jYWxsZXIgPT09IHRoaXMuX3Zpcy5sZWZ0LmVuY29kZXJfd29yZHNcbiAgICAgICAgICAgICAgICB8fCBkLmNhbGxlciA9PT0gdGhpcy5fdmlzLmxlZnQuZGVjb2Rlcl93b3Jkcykge1xuXG4gICAgICAgICAgICAgICAgbGV0IGxvYyA9ICdzcmMnO1xuICAgICAgICAgICAgICAgIGlmIChkLmNhbGxlciA9PT0gdGhpcy5fdmlzLmxlZnQuZGVjb2Rlcl93b3Jkcykge1xuICAgICAgICAgICAgICAgICAgICBsb2MgPSAndGd0J1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGFsbFdvcmRzID0gZC5jYWxsZXIuZmlyc3RSb3dQbGFpbldvcmRzO1xuXG4gICAgICAgICAgICAgICAgUzJTQXBpLmNsb3NlV29yZHMoe2lucHV0OiBkLndvcmQud29yZC50ZXh0LCBsb2MsIGxpbWl0OiAyMH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coSlNPTi5wYXJzZShkYXRhKSwgXCItLS0gZGF0YVwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd29yZF9kYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMudXBkYXRlQW5kU2hvd1dvcmRQcm9qZWN0b3Iod29yZF9kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlcGxhY2VJbmRleCA9IGQuaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9jID09PSAnc3JjJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBpdm90ID0gYWxsV29yZHMuam9pbignICcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29tcGFyZSA9IHdvcmRfZGF0YS53b3JkLm1hcCh3ZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhbGxXb3Jkcy5tYXAoKGF3LCB3aSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh3aSA9PT0gcmVwbGFjZUluZGV4KSA/IHdkIDogYXcpLmpvaW4oJyAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHBpdm90LCBjb21wYXJlLCBcIi0tLSBwaXZvdCwgY29tcGFyZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTMlNBcGkuY29tcGFyZVRyYW5zbGF0aW9uKHtwaXZvdCwgY29tcGFyZX0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29yZF9kYXRhW1wiY29tcGFyZVwiXSA9IEpTT04ucGFyc2UoZGF0YSlbXCJjb21wYXJlXCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy51cGRhdGVBbmRTaG93V29yZExpc3Qod29yZF9kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQW5kU2hvd1dvcmRQcm9qZWN0b3Iod29yZF9kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLnVwZGF0ZUFuZFNob3dXb3JkTGlzdCh3b3JkX2RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQW5kU2hvd1dvcmRQcm9qZWN0b3Iod29yZF9kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmxvZyhlcnJvciwgXCItLS0gZXJyb3JcIikpO1xuXG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkLndvcmQud29yZC50ZXh0LCBkLCBcIiBlbmMtLS0gXCIpO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLmV2ZW50SGFuZGxlci5iaW5kKFdvcmRMaW5lLmV2ZW50cy53b3JkSG92ZXJlZCwgKGQ6IFdvcmRMaW5lSG92ZXJFdmVudCkgPT4ge1xuICAgICAgICAgICAgZC5jYWxsZXIuaGlnaGxpZ2h0V29yZChkLnJvdywgZC5pbmRleCwgZC5ob3ZlcmVkKTtcblxuICAgICAgICAgICAgY29uc3Qge3ZUeXBlLCBjb2x9ID0gZGV0ZXJtaW5lUGFuZWxUeXBlKGQuY2FsbGVyKTtcbiAgICAgICAgICAgIGNvbC5hdHRlbnRpb24uaGlnaGxpZ2h0QWxsRWRnZXMoZC5pbmRleCwgdlR5cGUsIGQuaG92ZXJlZCk7XG5cblxuICAgICAgICB9KVxuXG5cbiAgICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vdHMvY29udHJvbGxlci9QYW5lbENvbnRyb2xsZXIudHMiLCJpbXBvcnQgKiBhcyBkMyBmcm9tICdkMyc7XG5pbXBvcnQge1ZDb21wb25lbnR9IGZyb20gXCIuL1Zpc3VhbENvbXBvbmVudFwiO1xuaW1wb3J0IHtTVkdNZWFzdXJlbWVudHN9IGZyb20gXCIuLi9ldGMvU1ZHcGx1c1wiO1xuaW1wb3J0IHtTaW1wbGVFdmVudEhhbmRsZXJ9IGZyb20gXCIuLi9ldGMvU2ltcGxlRXZlbnRIYW5kbGVyXCI7XG5pbXBvcnQge0QzU2VsLCBMb29zZU9iamVjdH0gZnJvbSBcIi4uL2V0Yy9Mb2NhbFR5cGVzXCI7XG5pbXBvcnQge1RyYW5zbGF0aW9ufSBmcm9tIFwiLi4vYXBpL1MyU0FwaVwiO1xuXG5lbnVtIEJveFR5cGUge2ZpeGVkLCBmbG93fVxuXG5leHBvcnQgdHlwZSAgV29yZExpbmVIb3ZlckV2ZW50ID0ge1xuICAgIGhvdmVyZWQ6IGJvb2xlYW4sXG4gICAgY2FsbGVyOiBXb3JkTGluZSxcbiAgICB3b3JkOiBMb29zZU9iamVjdCxcbiAgICByb3c6IG51bWJlcixcbiAgICBpbmRleDogbnVtYmVyLFxuICAgIGNzc19jbGFzc19tYWluOiBzdHJpbmdcbn1cblxuZXhwb3J0IGNsYXNzIFdvcmRMaW5lIGV4dGVuZHMgVkNvbXBvbmVudCB7XG5cbiAgICBzdGF0aWMgZXZlbnRzID0ge1xuICAgICAgICB3b3JkSG92ZXJlZDogJ3dvcmRsaW5lX3dvcmRfaG92ZXJlZCcsXG4gICAgICAgIHdvcmRTZWxlY3RlZDogJ3dvcmRsaW5lX3dvcmRfc2VsZWN0ZWQnXG4gICAgfTtcblxuICAgIHN0YXRpYyBCb3hUeXBlID0gQm94VHlwZTtcblxuICAgIHJlYWRvbmx5IGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICB0ZXh0X21lYXN1cmVyOiBudWxsLFxuICAgICAgICBib3hfaGVpZ2h0OiAyMyxcbiAgICAgICAgYm94X3dpZHRoOiAxMDAsIC8vIGlnbm9yZWQgd2hlbiBmbG93ICEhXG4gICAgICAgIGJveF90eXBlOiBXb3JkTGluZS5Cb3hUeXBlLmZsb3csXG4gICAgICAgIGRhdGFfYWNjZXNzOiAoZCkgPT4gW2QuZW5jb2Rlcl0sIC8vIFtsaXN0IG9mIFtsaXN0cyBvZiB3b3Jkc11dXG4gICAgICAgIGNzc19jbGFzc19tYWluOiAnaW5Xb3JkJyxcbiAgICAgICAgY3NzX2NsYXNzX2FkZDogJycsXG4gICAgICAgIHhfb2Zmc2V0OiAzXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBpbmhlcml0RG9jXG4gICAgICogQG92ZXJyaWRlXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG4gICAgcmVhZG9ubHkgbGF5b3V0ID0gW107XG4gICAgcHJpdmF0ZSBfcG9zaXRpb25zOiBhbnlbXTtcblxuICAgIC8vLS0gZGVmYXVsdCBjb25zdHJ1Y3RvciAtLVxuICAgIGNvbnN0cnVjdG9yKGQzUGFyZW50OiBEM1NlbCwgZXZlbnRIYW5kbGVyPzogU2ltcGxlRXZlbnRIYW5kbGVyLCBvcHRpb25zOiB7fSA9IHt9KSB7XG4gICAgICAgIHN1cGVyKGQzUGFyZW50LCBldmVudEhhbmRsZXIpO1xuICAgICAgICB0aGlzLnN1cGVySW5pdChvcHRpb25zKTtcbiAgICB9XG5cbiAgICBfaW5pdCgpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnRleHRfbWVhc3VyZXIgPSB0aGlzLm9wdGlvbnMudGV4dF9tZWFzdXJlclxuICAgICAgICAgICAgfHwgbmV3IFNWR01lYXN1cmVtZW50cyh0aGlzLnBhcmVudCwgJ21lYXN1cmVXb3JkJyk7XG5cbiAgICAgICAgdGhpcy5fcG9zaXRpb25zID0gW107XG4gICAgfVxuXG5cbiAgICBfd3JhbmdsZShkYXRhOiBUcmFuc2xhdGlvbikge1xuICAgICAgICBjb25zdCBvcCA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgY29uc29sZS5sb2cob3AsIHRoaXMsIFwiLS0tIG9wXCIpO1xuXG4gICAgICAgIGNvbnN0IHJlbmRlckRhdGEgPSB7XG4gICAgICAgICAgICByb3dzOiBbXVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9jdXJyZW50LnNlbGVjdGVkV29yZCA9IG51bGw7XG4gICAgICAgIC8vIGNhbGN1bGF0ZSBkaXN0YW5jZXNcblxuXG4gICAgICAgIGNvbnN0IHRvV29yZEZsb3cgPSB0b2tlbiA9PiAoe1xuICAgICAgICAgICAgdGV4dDogdG9rZW4sXG4gICAgICAgICAgICB3aWR0aDogTWF0aC5tYXgob3AudGV4dF9tZWFzdXJlci50ZXh0TGVuZ3RoKHRva2VuKSwgMjApXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB0b1dvcmRGaXhlZCA9IHRva2VuID0+ICh7XG4gICAgICAgICAgICB0ZXh0OiB0b2tlbixcbiAgICAgICAgICAgIHdpZHRoOiBvcC5ib3hfd2lkdGggLSAxMCxcbiAgICAgICAgICAgIHJlYWxXaWR0aDogb3AudGV4dF9tZWFzdXJlci50ZXh0TGVuZ3RoKHRva2VuKVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAob3AuYm94X3R5cGUgPT09IFdvcmRMaW5lLkJveFR5cGUuZml4ZWQpIHtcbiAgICAgICAgICAgIHJlbmRlckRhdGEucm93cyA9IG9wLmRhdGFfYWNjZXNzKGRhdGEpLm1hcChyb3cgPT4gcm93Lm1hcCh3ID0+IHRvV29yZEZpeGVkKHcudG9rZW4pKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlbmRlckRhdGEucm93cyA9IG9wLmRhdGFfYWNjZXNzKGRhdGEpLm1hcChyb3cgPT4gcm93Lm1hcCh3ID0+IHRvV29yZEZsb3cody50b2tlbikpKVxuICAgICAgICB9XG5cblxuICAgICAgICBjb25zdCBhbGxMZW5ndGhzID0gW107XG4gICAgICAgIGNvbnN0IGNhbGNQb3MgPSB3b3JkcyA9PiB7XG4gICAgICAgICAgICBsZXQgaW5jID0gMDtcbiAgICAgICAgICAgIGNvbnN0IHJyID0gWy4uLndvcmRzLm1hcCh3ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSBpbmM7XG4gICAgICAgICAgICAgICAgaW5jICs9ICt3LndpZHRoICsgMTA7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc1xuICAgICAgICAgICAgfSldO1xuICAgICAgICAgICAgYWxsTGVuZ3Rocy5wdXNoKGluYyk7XG4gICAgICAgICAgICByZXR1cm4gcnI7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fcG9zaXRpb25zID0gcmVuZGVyRGF0YS5yb3dzLm1hcChyb3cgPT4gY2FsY1Bvcyhyb3cpKTtcblxuXG4gICAgICAgIC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvblxuICAgICAgICB0aGlzLnBhcmVudC5hdHRycyh7XG4gICAgICAgICAgICB3aWR0aDogZDMubWF4KGFsbExlbmd0aHMpICsgNixcbiAgICAgICAgICAgIGhlaWdodDogcmVuZGVyRGF0YS5yb3dzLmxlbmd0aCAqIChvcC5ib3hfaGVpZ2h0KSAtIDJcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHRvZG86IHVwZGF0ZSBTVkcgKHBhcmVudCkgc2l6ZVxuXG4gICAgICAgIHJldHVybiByZW5kZXJEYXRhO1xuXG4gICAgfVxuXG4gICAgYWN0aW9uV29yZEhvdmVyZWQoe2QsIGksIGhvdmVyZWR9KSB7XG4gICAgICAgIHRoaXMuZXZlbnRIYW5kbGVyLnRyaWdnZXIoXG4gICAgICAgICAgICBXb3JkTGluZS5ldmVudHMud29yZEhvdmVyZWQsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaG92ZXJlZCxcbiAgICAgICAgICAgICAgICBjYWxsZXI6IHRoaXMsXG4gICAgICAgICAgICAgICAgd29yZDogZCxcbiAgICAgICAgICAgICAgICByb3c6IGQucm93LFxuICAgICAgICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgICAgICAgIGNzc19jbGFzc19tYWluOiB0aGlzLm9wdGlvbnMuY3NzX2NsYXNzX21haW5cbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICBoaWdobGlnaHRXb3JkKHJvdzogbnVtYmVyLCBpbmRleDogbnVtYmVyLCBoaWdobGlnaHQ6IGJvb2xlYW4sIGV4Y2x1c2l2ZSA9IGZhbHNlKTogdm9pZCB7XG5cbiAgICAgICAgdGhpcy5iYXNlLnNlbGVjdEFsbChgLiR7dGhpcy5vcHRpb25zLmNzc19jbGFzc19tYWlufWApXG4gICAgICAgICAgICAuY2xhc3NlZCgnaGlnaGxpZ2h0JywgZnVuY3Rpb24gKGQ6IExvb3NlT2JqZWN0LCBpOiBudW1iZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoKGQucm93ID09PSByb3cpICYmIChpID09PSBpbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhpZ2hsaWdodDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhjbHVzaXZlKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKCdoaWdobGlnaHQnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICAvLyBub2luc3BlY3Rpb24gSlNVbnVzZWRHbG9iYWxTeW1ib2xzXG4gICAgX3JlbmRlcihyZW5kZXJEYXRhKSB7XG4gICAgICAgIGNvbnN0IG9wID0gdGhpcy5vcHRpb25zO1xuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcblxuICAgICAgICAvLyBbcm93cyBvZiBbd29yZHMgb2Yge3dvcmRSZWN0LCB3b3JkVGV4dH1dXVxuXG4gICAgICAgIGxldCByb3dzID0gdGhpcy5iYXNlLnNlbGVjdEFsbCgnLndvcmRfcm93JykuZGF0YSg8YW55W10+IHJlbmRlckRhdGEucm93cyk7XG4gICAgICAgIHJvd3MuZXhpdCgpLnJlbW92ZSgpO1xuICAgICAgICByb3dzID0gcm93cy5lbnRlcigpXG4gICAgICAgICAgICAuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd29yZF9yb3cnKVxuICAgICAgICAgICAgLm1lcmdlKHJvd3MpXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKF8sIGkpID0+IGB0cmFuc2xhdGUoJHtvcC54X29mZnNldH0sJHsoaSkgKiAob3AuYm94X2hlaWdodCl9KWApO1xuXG4gICAgICAgIGxldCB3b3JkcyA9IHJvd3Muc2VsZWN0QWxsKGAuJHtvcC5jc3NfY2xhc3NfbWFpbn1gKVxuICAgICAgICAgICAgLmRhdGEoKHJvdywgcm93SUQpID0+IHJvdy5tYXAod29yZCA9PiAoe3Jvdzogcm93SUQsIHdvcmR9KSkpO1xuICAgICAgICB3b3Jkcy5leGl0KCkucmVtb3ZlKCk7XG5cbiAgICAgICAgY29uc3Qgd29yZHNFbnRlciA9IHdvcmRzLmVudGVyKClcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsIGAke29wLmNzc19jbGFzc19tYWlufSAke29wLmNzc19jbGFzc19hZGR9YClcbiAgICAgICAgd29yZHNFbnRlci5hcHBlbmQoJ3JlY3QnKS5hdHRycyh7XG4gICAgICAgICAgICB4OiAtMyxcbiAgICAgICAgICAgIHk6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6IG9wLmJveF9oZWlnaHQgLSAyLFxuICAgICAgICAgICAgcng6IDMsXG4gICAgICAgICAgICByeTogM1xuICAgICAgICB9KTtcbiAgICAgICAgd29yZHNFbnRlci5hcHBlbmQoJ3RleHQnKTtcblxuXG4gICAgICAgIC8qKioqIFVQREFURSAqKiovXG4gICAgICAgIGNvbnN0IGFsbFdvcmRzID0gd29yZHNFbnRlci5tZXJnZSh3b3JkcylcbiAgICAgICAgICAgIC5hdHRycyh7J3RyYW5zZm9ybSc6ICh3OiBhbnksIGkpID0+IGB0cmFuc2xhdGUoJHt0aGlzLnBvc2l0aW9uc1t3LnJvd11baV19LDApYCx9KVxuICAgICAgICAgICAgLm9uKCdtb3VzZWVudGVyJywgKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbldvcmRIb3ZlcmVkKHtkLCBpLCBob3ZlcmVkOiB0cnVlfSlcbiAgICAgICAgICAgICAgICAvLyB0aGlzLmxheWVycy5tYWluLnNlbGVjdEFsbChgLiR7aG92ZXJQcmVmaXggKyBpfWApLnJhaXNlKCkuY2xhc3NlZCgnaGlnaGxpZ2h0JywgdHJ1ZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm9uKCdtb3VzZW91dCcsIChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb25Xb3JkSG92ZXJlZCh7ZCwgaSwgaG92ZXJlZDogZmFsc2V9KVxuICAgICAgICAgICAgICAgIC8vIHRoaXMubGF5ZXJzLm1haW4uc2VsZWN0QWxsKGAuJHtob3ZlclByZWZpeCArIGl9YCkuY2xhc3NlZCgnaGlnaGxpZ2h0JywgbnVsbCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm9uKCdjbGljaycsIChkLCBpKSA9PiB0aGlzLmFjdGlvbldvcmRDbGlja2VkKHtkLCBpfSkpXG5cblxuICAgICAgICBhbGxXb3Jkcy5zZWxlY3QoJ3JlY3QnKS5hdHRyKCd3aWR0aCcsIChkOiBhbnkpID0+IGQud29yZC53aWR0aCArIDYpO1xuXG4gICAgICAgIGFsbFdvcmRzLnNlbGVjdCgndGV4dCcpLmF0dHIoJ3RyYW5zZm9ybScsIChkOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHcgPSBkLndvcmQ7XG4gICAgICAgICAgICBpZiAob3AuYm94X3R5cGUgPT09IFdvcmRMaW5lLkJveFR5cGUuZml4ZWRcbiAgICAgICAgICAgICAgICAmJiB3LndpZHRoIDwgdy5yZWFsV2lkdGggJiYgdy5yZWFsV2lkdGggPiAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBgdHJhbnNsYXRlKCR7ZC53b3JkLndpZHRoICogLjV9LCR7TWF0aC5mbG9vcihvcC5ib3hfaGVpZ2h0IC8gMil9KXNjYWxlKCR7dy53aWR0aCAvIHcucmVhbFdpZHRofSwxKWBcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gYHRyYW5zbGF0ZSgke2Qud29yZC53aWR0aCAqIC41fSwke01hdGguZmxvb3Iob3AuYm94X2hlaWdodCAvIDIpfSlgXG4gICAgICAgIH0pLnRleHQoKGQ6IGFueSkgPT4gZC53b3JkLnRleHQpO1xuXG5cbiAgICB9XG5cblxuICAgIGdldCBwb3NpdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbnM7XG4gICAgfVxuXG4gICAgZ2V0IHJvd3MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlckRhdGEucm93cztcbiAgICB9XG5cbiAgICBnZXQgZmlyc3RSb3dQbGFpbldvcmRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJEYXRhLnJvd3NbMF0ubWFwKHdvcmQgPT4gd29yZC50ZXh0KVxuICAgIH1cblxuXG4gICAgYWN0aW9uV29yZENsaWNrZWQoe2QsIGl9KSB7XG4gICAgICAgIGxldCBzZWxlY3RlZCA9ICEodGhpcy5fY3VycmVudC5zZWxlY3RlZFdvcmQgPT09IGkpO1xuICAgICAgICB0aGlzLl9jdXJyZW50LnNlbGVjdGVkV29yZCA9IHNlbGVjdGVkID8gaSA6IG51bGw7XG5cbiAgICAgICAgdGhpcy5ldmVudEhhbmRsZXIudHJpZ2dlcihcbiAgICAgICAgICAgIFdvcmRMaW5lLmV2ZW50cy53b3JkU2VsZWN0ZWQsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQsXG4gICAgICAgICAgICAgICAgY2FsbGVyOiB0aGlzLFxuICAgICAgICAgICAgICAgIHdvcmQ6IGQsXG4gICAgICAgICAgICAgICAgaW5kZXg6IGlcbiAgICAgICAgICAgIH0pXG5cbiAgICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vdHMvdmlzL1dvcmRMaW5lLnRzIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGhlbiBvbiA1LzE1LzE3LlxuICovXG5sZXQgdGhlX3VuaXF1ZV9pZF9jb3VudGVyID0gMDtcbmV4cG9ydCBjbGFzcyBVdGlsIHtcbiAgICBzdGF0aWMgc2ltcGxlVUlkKHtwcmVmaXggPSAnJ30pOnN0cmluZyB7XG4gICAgICAgIHRoZV91bmlxdWVfaWRfY291bnRlciArPSAxO1xuXG4gICAgICAgIHJldHVybiBwcmVmaXggKyB0aGVfdW5pcXVlX2lkX2NvdW50ZXI7XG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3RzL2V0Yy9VdGlsLnRzIiwiaW1wb3J0IHtWQ29tcG9uZW50fSBmcm9tIFwiLi9WaXN1YWxDb21wb25lbnRcIjtcbmltcG9ydCAqIGFzIGQzIGZyb20gXCJkM1wiO1xuXG5leHBvcnQgY2xhc3MgQmFyTGlzdCBleHRlbmRzIFZDb21wb25lbnQge1xuXG5cbiAgICBzdGF0aWMgZXZlbnRzID0ge307XG5cbiAgICByZWFkb25seSBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgd2lkdGg6IDkwLFxuICAgICAgICBiYXJfaGVpZ2h0OiAyMCxcbiAgICAgICAgY3NzX2NsYXNzX21haW46ICdiYXJfbGlzdF92aXMnLFxuICAgICAgICBjc3NfYmFyOiAnYmFyJyxcbiAgICAgICAgeFNjYWxlOiBkMy5zY2FsZUxpbmVhcigpLFxuICAgICAgICBkYXRhX2FjY2VzczogZCA9PiBkLmVuY29kZXIubWFwKGUgPT4gZS5zdGF0ZSksXG4gICAgICAgIGRhdGFfYWNjZXNzX2FsbDogbnVsbFxuICAgIH07XG5cbiAgICAvLyBub2luc3BlY3Rpb24gSlNVbnVzZWRHbG9iYWxTeW1ib2xzXG4gICAgcmVhZG9ubHkgbGF5b3V0ID0gW1xuICAgICAgICAvLyB7bmFtZTogJ2F4aXMnLCBwb3M6IFswLCAwXX0sXG4gICAgICAgIHtuYW1lOiAnbWFpbicsIHBvczogWzAsIDBdfSxcbiAgICBdO1xuXG4gICAgY29uc3RydWN0b3IoZDNQYXJlbnQsIGV2ZW50SGFuZGxlciwgb3B0aW9uczoge30gPSB7fSkge1xuICAgICAgICBzdXBlcihkM1BhcmVudCwgZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgdGhpcy5zdXBlckluaXQob3B0aW9ucylcbiAgICB9XG5cbiAgICBfaW5pdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgX3dyYW5nbGUoZGF0YSkge1xuICAgICAgICBjb25zdCBvcCA9IHRoaXMub3B0aW9ucztcblxuICAgICAgICBpZiAob3AuZGF0YV9hY2Nlc3NfYWxsKSB7XG4gICAgICAgICAgICBjb25zdCBleCA9IDxudW1iZXJbXT5kMy5leHRlbnQob3AuZGF0YV9hY2Nlc3NfYWxsKGRhdGEpKTtcblxuICAgICAgICAgICAgaWYgKGV4WzBdICogZXhbMV0gPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV4WzBdID4gMCkgZXhbMF0gPSBleFsxXTtcbiAgICAgICAgICAgICAgICBleFsxXSA9IDA7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgb3AueFNjYWxlID1cbiAgICAgICAgICAgICAgICBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAgICAgICAgICAgICAgIC5kb21haW4oZXgpXG4gICAgICAgICAgICAgICAgICAgIC5yYW5nZShbb3Aud2lkdGgsIDBdKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYmFyVmFsdWVzID0gb3AuZGF0YV9hY2Nlc3MoZGF0YSk7XG5cbiAgICAgICAgdGhpcy5wYXJlbnQuYXR0cnMoe1xuICAgICAgICAgICAgd2lkdGg6IG9wLndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBiYXJWYWx1ZXMubGVuZ3RoICogb3AuYmFyX2hlaWdodFxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ge2JhclZhbHVlc307XG4gICAgfVxuXG4gICAgX3JlbmRlcih7YmFyVmFsdWVzfSkge1xuXG4gICAgICAgIGNvbnN0IG9wID0gdGhpcy5vcHRpb25zO1xuXG4gICAgICAgIGNvbnN0IGJhcnMgPSB0aGlzLmxheWVycy5tYWluLnNlbGVjdEFsbChgLiR7b3AuY3NzX2Jhcn1gKS5kYXRhKGJhclZhbHVlcyk7XG4gICAgICAgIGJhcnMuZXhpdCgpLnJlbW92ZSgpO1xuXG4gICAgICAgIGNvbnN0IGJhcnNFbnRlciA9IGJhcnMuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKS5hdHRyKCdjbGFzcycsIG9wLmNzc19iYXIpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKG9wLnhTY2FsZS5kb21haW4oKSwgdGhpcy5vcHRpb25zLCBcIi0tLSB0aGlzLnhTY2FsZSwgdGhpcy5vcHRpb25zXCIpO1xuXG5cbiAgICAgICAgYmFyc0VudGVyLm1lcmdlKGJhcnMpLmF0dHJzKHtcbiAgICAgICAgICAgIHg6IGQgPT4gb3Aud2lkdGggLSBvcC54U2NhbGUoZCksXG4gICAgICAgICAgICB5OiAoXywgaSkgPT4gaSAqIG9wLmJhcl9oZWlnaHQsXG4gICAgICAgICAgICBoZWlnaHQ6IG9wLmJhcl9oZWlnaHQgLSAyLFxuICAgICAgICAgICAgd2lkdGg6IGQgPT4gb3AueFNjYWxlKGQpXG4gICAgICAgIH0pXG5cbiAgICB9XG5cblxuICAgIGdldCB4U2NhbGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMueFNjYWxlO1xuICAgIH1cblxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3RzL3Zpcy9CYXJMaXN0LnRzIiwiaW1wb3J0IHtWQ29tcG9uZW50fSBmcm9tIFwiLi9WaXN1YWxDb21wb25lbnRcIjtcbmltcG9ydCAqIGFzIGQzIGZyb20gXCJkM1wiO1xuaW1wb3J0ICogYXMgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQge1NpbXBsZUV2ZW50SGFuZGxlcn0gZnJvbSBcIi4uL2V0Yy9TaW1wbGVFdmVudEhhbmRsZXJcIjtcbmltcG9ydCB7RDNTZWx9IGZyb20gXCIuLi9ldGMvTG9jYWxUeXBlc1wiO1xuXG5leHBvcnQgY2xhc3MgU3RhdGVWaXMgZXh0ZW5kcyBWQ29tcG9uZW50IHtcblxuICAgIHN0YXRpYyBldmVudHMgPSB7fTtcblxuICAgIHJlYWRvbmx5IGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICBjZWxsX3dpZHRoOiAxMDAsXG4gICAgICAgIGhlaWdodDogNTAsXG4gICAgICAgIGNzc19jbGFzc19tYWluOiAnc3RhdGVfdmlzJyxcbiAgICAgICAgY3NzX2xpbmU6ICdzdGF0ZV9saW5lJyxcbiAgICAgICAgeF9vZmZzZXQ6IDMsXG4gICAgICAgIGhpZGRlbjogdHJ1ZSxcbiAgICAgICAgZGF0YV9hY2Nlc3M6IGQgPT4gZC5lbmNvZGVyLm1hcChlID0+IGUuc3RhdGUpXG4gICAgfTtcblxuICAgIHJlYWRvbmx5IGxheW91dCA9IFtcbiAgICAgICAge25hbWU6ICdheGlzJywgcG9zOiBbMCwgMF19LFxuICAgICAgICB7bmFtZTogJ21haW4nLCBwb3M6IFswLCAwXX0sXG4gICAgXTtcblxuICAgIGNvbnN0cnVjdG9yKGQzUGFyZW50OkQzU2VsLCBldmVudEhhbmRsZXI6IFNpbXBsZUV2ZW50SGFuZGxlciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKGQzUGFyZW50LCBldmVudEhhbmRsZXIpO1xuICAgICAgICB0aGlzLnN1cGVySW5pdChvcHRpb25zKVxuICAgIH1cblxuICAgIF9pbml0KCkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmhpZGRlbikgdGhpcy5oaWRlVmlldygpO1xuICAgIH1cblxuICAgIF93cmFuZ2xlKGRhdGEpIHtcblxuICAgICAgICBjb25zdCBvcCA9IHRoaXMub3B0aW9ucztcblxuICAgICAgICBjb25zdCBvcmlnX3N0YXRlcyA9IG9wLmRhdGFfYWNjZXNzKGRhdGEpO1xuICAgICAgICBjb25zdCBzdGF0ZXMgPSBkMy50cmFuc3Bvc2Uob3JpZ19zdGF0ZXMpO1xuICAgICAgICBjb25zdCB5RG9tYWluID0gZDMuZXh0ZW50KDxudW1iZXJbXT4gXy5mbGF0dGVuRGVlcCg8YW55W11bXT4gc3RhdGVzKSk7XG5cbiAgICAgICAgdGhpcy5wYXJlbnQuYXR0cnMoe1xuICAgICAgICAgICAgd2lkdGg6IChvcmlnX3N0YXRlcy5sZW5ndGggKiBvcC5jZWxsX3dpZHRoICsgKG9wLnhfb2Zmc2V0ICsgNSArIDIwKSksXG4gICAgICAgICAgICBoZWlnaHQ6IG9wLmhlaWdodFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zb2xlLmxvZyhzdGF0ZXMsIG9wLmRhdGFfYWNjZXNzKGRhdGEpLCBcIi0tLSBzdGF0ZXMsb3AuZGF0YV9hY2Nlc3MoZGF0YSlcIik7XG5cbiAgICAgICAgcmV0dXJuIHtzdGF0ZXMsIHlEb21haW59XG4gICAgfVxuXG4gICAgX3JlbmRlcihyZW5kZXJEYXRhKSB7XG5cblxuICAgICAgICBjb25zdCBvcCA9IHRoaXMub3B0aW9ucztcblxuICAgICAgICBjb25zdCB4ID0gKGkpID0+IG9wLnhfb2Zmc2V0ICsgTWF0aC5yb3VuZCgoaSArIC41KSAqIG9wLmNlbGxfd2lkdGgpO1xuXG4gICAgICAgIGNvbnN0IHkgPSBkMy5zY2FsZVBvdygpLmV4cG9uZW50KC41KS5kb21haW4ocmVuZGVyRGF0YS55RG9tYWluKS5yYW5nZShbb3AuaGVpZ2h0LCAwXSk7XG5cbiAgICAgICAgY29uc3QgbGluZSA9IGQzLmxpbmU8bnVtYmVyPigpXG4gICAgICAgICAgICAueCgoXywgaSkgPT4geChpKSlcbiAgICAgICAgICAgIC55KGQgPT4geShkKSk7XG5cblxuICAgICAgICBjb25zdCBzdGF0ZUxpbmUgPSB0aGlzLmxheWVycy5tYWluLnNlbGVjdEFsbChgLiR7b3AuY3NzX2xpbmV9YCkuZGF0YShyZW5kZXJEYXRhLnN0YXRlcyk7XG4gICAgICAgIHN0YXRlTGluZS5leGl0KCkucmVtb3ZlKCk7XG5cbiAgICAgICAgY29uc3Qgc3RhdGVMaW5lRW50ZXIgPSBzdGF0ZUxpbmUuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsIG9wLmNzc19saW5lKTtcblxuICAgICAgICBzdGF0ZUxpbmVFbnRlci5tZXJnZShzdGF0ZUxpbmUpLmF0dHJzKHtcbiAgICAgICAgICAgICdkJzogbGluZVxuICAgICAgICB9KTtcblxuXG4gICAgICAgIGlmIChyZW5kZXJEYXRhLnN0YXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCB5QXhpcyA9IGQzLmF4aXNMZWZ0KHkpLnRpY2tzKDcpO1xuICAgICAgICAgICAgdGhpcy5sYXllcnMuYXhpcy5jbGFzc2VkKFwiYXhpcyBzdGF0ZV9heGlzXCIsIHRydWUpXG4gICAgICAgICAgICAgICAgLmNhbGwoeUF4aXMpLnNlbGVjdEFsbCgnKicpO1xuICAgICAgICAgICAgdGhpcy5sYXllcnMuYXhpcy5hdHRycyh7XG4gICAgICAgICAgICAgICAgLy8gdHJhbnNmb3JtOiBgdHJhbnNsYXRlKCR7eChyZW5kZXJEYXRhLnN0YXRlc1swXS5sZW5ndGggLSAxKSArIDN9LDApYFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgke29wLnhfb2Zmc2V0ICsgb3AuY2VsbF93aWR0aCAqIC41IC0gM30sMClgXG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sYXllcnMuYXhpcy5zZWxlY3RBbGwoXCIqXCIpLnJlbW92ZSgpO1xuICAgICAgICB9XG5cblxuICAgIH1cblxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3RzL3Zpcy9TdGF0ZVZpcy50cyIsImltcG9ydCB7VkNvbXBvbmVudH0gZnJvbSBcIi4vVmlzdWFsQ29tcG9uZW50XCI7XG5pbXBvcnQgKiBhcyBkMyBmcm9tIFwiZDNcIjtcbmltcG9ydCAqIGFzIF8gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IHtTaW1wbGVFdmVudEhhbmRsZXJ9IGZyb20gXCIuLi9ldGMvU2ltcGxlRXZlbnRIYW5kbGVyXCI7XG5pbXBvcnQge0QzU2VsfSBmcm9tIFwiLi4vZXRjL0xvY2FsVHlwZXNcIjtcbmltcG9ydCB7VHJhbnNsYXRpb259IGZyb20gXCIuLi9hcGkvUzJTQXBpXCI7XG5cblxudHlwZSBFZGdlID0ge1xuICAgIGNsYXNzZXM6IHN0cmluZyxcbiAgICBpblBvczogbnVtYmVyLFxuICAgIG91dFBvczogbnVtYmVyLFxuICAgIHdpZHRoOiBudW1iZXIsXG4gICAgZWRnZTogW251bWJlciwgbnVtYmVyXVxufVxuXG5cbmVudW0gVmVydGV4VHlwZSB7RW5jb2RlciA9IDAsIERlY29kZXIgPSAxfVxuXG5leHBvcnQgY2xhc3MgQXR0ZW50aW9uVmlzIGV4dGVuZHMgVkNvbXBvbmVudCB7XG5cbiAgICBzdGF0aWMgVkVSVEVYX1RZUEUgPSBWZXJ0ZXhUeXBlO1xuXG4gICAgc3RhdGljIGV2ZW50cyA9IHt9O1xuXG4gICAgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgIG1heF9idW5kbGVfd2lkdGg6IDE1LFxuICAgICAgICBoZWlnaHQ6IDUwLFxuICAgICAgICBjc3NfY2xhc3NfbWFpbjogJ2F0dG5fZ3JhcGgnLFxuICAgICAgICBjc3NfZWRnZTogJ2F0dG5fZWRnZScsXG4gICAgICAgIHhfb2Zmc2V0OiAzXG4gICAgfTtcblxuICAgIGxheW91dCA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoZDNQYXJlbnQ6IEQzU2VsLCBldmVudEhhbmRsZXI/OiBTaW1wbGVFdmVudEhhbmRsZXIsIG9wdGlvbnM6IHt9ID0ge30pIHtcbiAgICAgICAgc3VwZXIoZDNQYXJlbnQsIGV2ZW50SGFuZGxlcik7XG4gICAgICAgIHRoaXMuc3VwZXJJbml0KG9wdGlvbnMpO1xuICAgIH1cblxuICAgIF9pbml0KCkge1xuICAgIH1cblxuICAgIF9jcmVhdGVHcmFwaChhdHRuV2VpZ2h0czogbnVtYmVyW11bXSwgbWF4QnVuZGxlV2lkdGgsIGluV29yZHMsIG91dFdvcmRzLCBpblBvcywgb3V0UG9zKSB7XG5cbiAgICAgICAgY29uc3QgYXR0blBlckluV29yZCA9IF8udW56aXAoYXR0bldlaWdodHMpO1xuICAgICAgICBjb25zdCBhdHRuUGVySW5Xb3JkU3VtID0gYXR0blBlckluV29yZC5tYXAoYSA9PiBfLnN1bShhKSk7XG4gICAgICAgIGNvbnN0IG1heEF0dG5QZXJBbGxXb3JkcyA9IE1hdGgubWF4KDEsIF8ubWF4KGF0dG5QZXJJbldvcmRTdW0pKTtcbiAgICAgICAgY29uc3QgbGluZVdpZHRoU2NhbGUgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAgICAgICAuZG9tYWluKFswLCBtYXhBdHRuUGVyQWxsV29yZHNdKS5yYW5nZShbMCwgbWF4QnVuZGxlV2lkdGhdKTtcblxuICAgICAgICBsZXQgbWF4UG9zID0gMDtcblxuICAgICAgICBjb25zdCBpblBvc2l0aW9uR3JhcGggPSBpbldvcmRzLm1hcCgoaW5Xb3JkLCBpbkluZGV4KSA9PiB7XG4gICAgICAgICAgICBsZXQgaW5jID0gaW5Qb3NbaW5JbmRleF0gKyAoaW5Xb3JkLndpZHRoIC0gbGluZVdpZHRoU2NhbGUoYXR0blBlckluV29yZFN1bVtpbkluZGV4XSkpICogLjU7XG4gICAgICAgICAgICByZXR1cm4gb3V0V29yZHMubWFwKChfLCBvdXRJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGx3ID0gbGluZVdpZHRoU2NhbGUoYXR0blBlckluV29yZFtpbkluZGV4XVtvdXRJbmRleF0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IGluYyArIGx3ICogLjU7XG4gICAgICAgICAgICAgICAgaW5jICs9IGxpbmVXaWR0aFNjYWxlKGF0dG5QZXJJbldvcmRbaW5JbmRleF1bb3V0SW5kZXhdKTtcbiAgICAgICAgICAgICAgICBtYXhQb3MgPSBpbmMgPiBtYXhQb3MgPyBpbmMgOiBtYXhQb3M7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtpblBvczogcmVzLCB3aWR0aDogbHcsIGVkZ2U6IFtpbkluZGV4LCBvdXRJbmRleF0sIGNsYXNzZXM6IGBpbiR7aW5JbmRleH0gb3V0JHtvdXRJbmRleH1gfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG91dFdvcmRzLmZvckVhY2goKG91dFdvcmQsIG91dEluZGV4KSA9PiB7XG4gICAgICAgICAgICBsZXQgaW5jID0gb3V0UG9zW291dEluZGV4XSArIChvdXRXb3JkLndpZHRoIC0gbGluZVdpZHRoU2NhbGUoMSkpICogLjU7XG4gICAgICAgICAgICBpbldvcmRzLmZvckVhY2goKF8sIGluSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5lID0gaW5Qb3NpdGlvbkdyYXBoW2luSW5kZXhdW291dEluZGV4XTtcbiAgICAgICAgICAgICAgICBsaW5lWydvdXRQb3MnXSA9IGluYyArIGxpbmUud2lkdGggKiAuNTtcbiAgICAgICAgICAgICAgICBpbmMgKz0gbGluZS53aWR0aDtcbiAgICAgICAgICAgICAgICBtYXhQb3MgPSBpbmMgPiBtYXhQb3MgPyBpbmMgOiBtYXhQb3M7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ge2VkZ2VzOiBfLmZsYXR0ZW4oaW5Qb3NpdGlvbkdyYXBoKSwgbWF4UG9zfTtcblxuICAgIH1cblxuXG4gICAgX3dyYW5nbGUoZGF0YTogVHJhbnNsYXRpb24pIHtcblxuXG4gICAgICAgIGNvbnN0IHtlZGdlcywgbWF4UG9zfSA9IHRoaXMuX2NyZWF0ZUdyYXBoKGRhdGEuYXR0bkZpbHRlcmVkW2RhdGEuX2N1cnJlbnQudG9wTl0sXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMubWF4X2J1bmRsZV93aWR0aCxcbiAgICAgICAgICAgIGRhdGEuX2N1cnJlbnQuaW5Xb3JkcywgZGF0YS5fY3VycmVudC5vdXRXb3JkcyxcbiAgICAgICAgICAgIGRhdGEuX2N1cnJlbnQuaW5Xb3JkUG9zLCBkYXRhLl9jdXJyZW50Lm91dFdvcmRQb3MpO1xuXG4gICAgICAgIHRoaXMucGFyZW50LmF0dHJzKHtcbiAgICAgICAgICAgIHdpZHRoOiBtYXhQb3MgKyA1ICsgdGhpcy5vcHRpb25zLnhfb2Zmc2V0LCAvL3Jlc2VydmVcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5vcHRpb25zLmhlaWdodFxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ge2VkZ2VzLCBtYXhQb3N9XG5cbiAgICB9XG5cbiAgICBfcmVuZGVyKHJlbmRlckRhdGE6IHsgZWRnZXM6IEVkZ2VbXSwgbWF4UG9zOiBudW1iZXIgfSkge1xuXG4gICAgICAgIGNvbnNvbGUubG9nKHJlbmRlckRhdGEsIFwiLS0tIHJlbmRlckRhdGFcIik7XG5cbiAgICAgICAgY29uc3Qgb3AgPSB0aGlzLm9wdGlvbnM7XG5cbiAgICAgICAgY29uc3QgZ3JhcGggPSB0aGlzLmJhc2Uuc2VsZWN0QWxsKGAuJHtvcC5jc3NfY2xhc3NfbWFpbn1gKVxuICAgICAgICAgICAgLmRhdGEocmVuZGVyRGF0YS5lZGdlcyk7XG4gICAgICAgIGdyYXBoLmV4aXQoKS5yZW1vdmUoKTtcblxuICAgICAgICBjb25zdCBsaW5rR2VuID0gZDMubGlua1ZlcnRpY2FsKCk7XG5cbiAgICAgICAgY29uc3QgZ3JhcGhFbnRlciA9IGdyYXBoLmVudGVyKCkuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCBvcC5jc3NfY2xhc3NfbWFpbik7XG4gICAgICAgIGdyYXBoRW50ZXIuYXBwZW5kKCdwYXRoJyk7XG4gICAgICAgIGdyYXBoRW50ZXIubWVyZ2UoZ3JhcGgpLnNlbGVjdCgncGF0aCcpLmF0dHJzKHtcbiAgICAgICAgICAgICdkJzogZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpbmtHZW4oe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IFtkLmluUG9zICsgb3AueF9vZmZzZXQsIDBdLFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IFtkLm91dFBvcyArIG9wLnhfb2Zmc2V0LCBvcC5oZWlnaHRdXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnY2xhc3MnOiBkID0+IGAke3RoaXMub3B0aW9ucy5jc3NfZWRnZX0gJHtkLmNsYXNzZXN9YFxuICAgICAgICB9KS5zdHlsZSgnc3Ryb2tlLXdpZHRoJywgZCA9PiBkLndpZHRoKTtcblxuICAgIH1cblxuICAgIF9iaW5kTG9jYWxFdmVudHMoKSB7XG5cbiAgICB9XG5cblxuICAgIGhpZ2hsaWdodEFsbEVkZ2VzKGluZGV4OiBudW1iZXIsIHR5cGU6IFZlcnRleFR5cGUsIGhpZ2hsaWdodDogYm9vbGVhbikge1xuXG4gICAgICAgIGlmIChoaWdobGlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMuYmFzZS5zZWxlY3RBbGwoYC4ke3RoaXMub3B0aW9ucy5jc3NfY2xhc3NfbWFpbn1gKVxuICAgICAgICAgICAgICAgIC5jbGFzc2VkKCdoaWdobGlnaHQnLCBkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICg8RWRnZT5kKS5lZGdlW3R5cGVdID09PSBpbmRleDtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5iYXNlLnNlbGVjdEFsbChgLiR7dGhpcy5vcHRpb25zLmNzc19jbGFzc19tYWlufWApXG4gICAgICAgICAgICAgICAgLmNsYXNzZWQoJ2hpZ2hsaWdodCcsIGZhbHNlKVxuXG4gICAgICAgIH1cblxuICAgIH1cblxuXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vdHMvdmlzL0F0dGVudGlvblZpcy50cyIsImltcG9ydCB7VkNvbXBvbmVudH0gZnJvbSBcIi4vVmlzdWFsQ29tcG9uZW50XCI7XG5pbXBvcnQgKiBhcyBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCAqIGFzIGQzIGZyb20gXCJkM1wiXG5pbXBvcnQgKiBhcyBjb2xhIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvd2ViY29sYS9kaXN0L2luZGV4XCJcbmltcG9ydCB7U2ltcGxlRXZlbnRIYW5kbGVyfSBmcm9tIFwiLi4vZXRjL1NpbXBsZUV2ZW50SGFuZGxlclwiO1xuaW1wb3J0IHtTVkdNZWFzdXJlbWVudHN9IGZyb20gXCIuLi9ldGMvU1ZHcGx1c1wiO1xuaW1wb3J0IHtEM1NlbH0gZnJvbSBcIi4uL2V0Yy9Mb2NhbFR5cGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBXb3JkUHJvamVjdG9yIGV4dGVuZHMgVkNvbXBvbmVudCB7XG5cbiAgICBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgaGVpZ2h0OiA0MDAsXG4gICAgICAgIHdpZHRoOiA1MDAsXG4gICAgICAgIGNzc19jbGFzc19tYWluOiAnd3BfdmlzJyxcbiAgICAgICAgaGlkZGVuOiBmYWxzZSxcbiAgICAgICAgZGF0YV9hY2Nlc3M6IHtcbiAgICAgICAgICAgIHBvczogZCA9PiBkLnBvcyxcbiAgICAgICAgICAgIHNjb3JlczogZCA9PiBkLnNjb3JlLFxuICAgICAgICAgICAgd29yZHM6IGQgPT4gZC53b3JkLFxuICAgICAgICAgICAgY29tcGFyZTogZCA9PiBkLmNvbXBhcmVcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIGxheW91dCA9IFtcbiAgICAgICAge25hbWU6ICdiZycsIHBvczogWzAsIDBdfSxcbiAgICAgICAge25hbWU6ICdtYWluJywgcG9zOiBbMCwgMF19LFxuICAgIF07XG5cbiAgICAvLy0tIGRlZmF1bHQgY29uc3RydWN0b3IgLS1cbiAgICBjb25zdHJ1Y3RvcihkM1BhcmVudDogRDNTZWwsIGV2ZW50SGFuZGxlcj86IFNpbXBsZUV2ZW50SGFuZGxlciwgb3B0aW9uczoge30gPSB7fSkge1xuICAgICAgICBzdXBlcihkM1BhcmVudCwgZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgdGhpcy5zdXBlckluaXQob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgX2luaXQoKSB7XG4gICAgICAgIGNvbnN0IG9wID0gdGhpcy5vcHRpb25zO1xuICAgICAgICB0aGlzLm9wdGlvbnMudGV4dF9tZWFzdXJlciA9IHRoaXMub3B0aW9ucy50ZXh0X21lYXN1cmVyXG4gICAgICAgICAgICB8fCBuZXcgU1ZHTWVhc3VyZW1lbnRzKHRoaXMucGFyZW50LCAnbWVhc3VyZVdvcmQnKTtcblxuICAgICAgICB0aGlzLnBhcmVudC5hdHRycyh7XG4gICAgICAgICAgICB3aWR0aDogb3Aud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IG9wLmhlaWdodFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5oaWRkZW4pIHRoaXMuaGlkZVZpZXcoKTtcbiAgICB9XG5cbiAgICBfd3JhbmdsZShkYXRhKSB7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJ3cm5hZ2xlLS0tIFwiKTtcblxuICAgICAgICBjb25zdCBvcCA9IHRoaXMub3B0aW9ucztcblxuICAgICAgICBjb25zdCByYXdfcG9zID0gb3AuZGF0YV9hY2Nlc3MucG9zKGRhdGEpO1xuICAgICAgICBjb25zdCB4X3ZhbHVlcyA9IDxudW1iZXJbXT5yYXdfcG9zLm1hcChkID0+IGRbMF0pO1xuICAgICAgICBjb25zdCB5X3ZhbHVlcyA9IDxudW1iZXJbXT5yYXdfcG9zLm1hcChkID0+IGRbMV0pO1xuXG4gICAgICAgIGNvbnN0IHAwX21pbiA9IF8ubWluKHhfdmFsdWVzKTtcbiAgICAgICAgY29uc3QgcDFfbWluID0gXy5taW4oeV92YWx1ZXMpO1xuXG4gICAgICAgIGNvbnN0IGRpZmYwID0gXy5tYXgoeF92YWx1ZXMpIC0gcDBfbWluO1xuICAgICAgICBjb25zdCBkaWZmMSA9IF8ubWF4KHlfdmFsdWVzKSAtIHAxX21pbjtcblxuXG4gICAgICAgIGxldCBub3JtX3BvcyA9IFtdO1xuXG4gICAgICAgIGlmIChkaWZmMCA+IGRpZmYxKSB7XG4gICAgICAgICAgICBub3JtX3BvcyA9IHJhd19wb3MubWFwKGQgPT4gWyhkWzBdIC0gcDBfbWluKSAvIGRpZmYwLCAoZFsxXSAtIHAxX21pbikgLyBkaWZmMF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9ybV9wb3MgPSByYXdfcG9zLm1hcChkID0+IFsoZFswXSAtIHAwX21pbikgLyBkaWZmMSwgKGRbMV0gLSBwMV9taW4pIC8gZGlmZjFdKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgd29yZHMgPSBvcC5kYXRhX2FjY2Vzcy53b3JkcyhkYXRhKTtcbiAgICAgICAgY29uc3Qgc2NvcmVzID0gb3AuZGF0YV9hY2Nlc3Muc2NvcmVzKGRhdGEpO1xuICAgICAgICBjb25zdCBjb21wYXJlID0gb3AuZGF0YV9hY2Nlc3MuY29tcGFyZShkYXRhKTtcbiAgICAgICAgdGhpcy5fY3VycmVudC5oYXNfY29tcGFyZSA9IGNvbXBhcmUgIT09IG51bGw7XG5cbiAgICAgICAgcmV0dXJuIF8uc29ydEJ5KF8uemlwV2l0aCh3b3Jkcywgc2NvcmVzLCBub3JtX3BvcywgY29tcGFyZSxcbiAgICAgICAgICAgICh3b3JkLCBzY29yZSwgcG9zLCBjb21wYXJlKSA9PiAoe3dvcmQsIHNjb3JlLCBwb3MsIGNvbXBhcmV9KSksXG4gICAgICAgICAgICAoZDp7d29yZCwgc2NvcmUsIHBvcywgY29tcGFyZX0pID0+IC1kLnNjb3JlKTtcblxuXG4gICAgICAgIC8vIHJldHVybiBfLnppcFdpdGgod29yZHMsIHNjb3Jlcywgbm9ybV9wb3MsXG4gICAgICAgIC8vICAgKHdvcmQsIHNjb3JlLCBwb3MpID0+ICh7d29yZCwgc2NvcmUsIHBvc30pKTtcbiAgICB9XG5cbiAgICBfcmVuZGVyKHJlbmRlckRhdGEpIHtcblxuICAgICAgICBjb25zb2xlLmxvZyhyZW5kZXJEYXRhLCBcIi0tLSByZW5kZXJEYXRhXCIpO1xuICAgICAgICBjb25zdCBvcCA9IHRoaXMub3B0aW9ucztcblxuICAgICAgICBjb25zdCB3b3JkID0gdGhpcy5sYXllcnMubWFpbi5zZWxlY3RBbGwoXCIud29yZFwiKS5kYXRhKHJlbmRlckRhdGEpO1xuICAgICAgICB3b3JkLmV4aXQoKS5yZW1vdmUoKTtcblxuICAgICAgICBjb25zdCB3b3JkRW50ZXIgPSB3b3JkLmVudGVyKCkuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd29yZCcpO1xuICAgICAgICB3b3JkRW50ZXIuYXBwZW5kKCdyZWN0Jyk7XG4gICAgICAgIHdvcmRFbnRlci5hcHBlbmQoJ3RleHQnKTtcblxuICAgICAgICBjb25zdCB4c2NhbGUgPSBkMy5zY2FsZUxpbmVhcigpLnJhbmdlKFszMCwgb3Aud2lkdGggLSAzMF0pO1xuICAgICAgICBjb25zdCB5c2NhbGUgPSBkMy5zY2FsZUxpbmVhcigpLnJhbmdlKFsxMCwgb3AuaGVpZ2h0IC0gMTBdKTtcbiAgICAgICAgY29uc3Qgc2NvcmVFeHRlbnQgPSBkMy5leHRlbnQoPG51bWJlcltdPnJlbmRlckRhdGEubWFwKGQgPT4gZC5zY29yZSkpXG4gICAgICAgIGNvbnN0IHdvcmRTY2FsZSA9IGQzLnNjYWxlTGluZWFyKCkuZG9tYWluKHNjb3JlRXh0ZW50KS5yYW5nZShbNiwgMTRdKTtcblxuXG4gICAgICAgIGNvbnN0IG9mcmVlID0gW11cblxuICAgICAgICBmb3IgKGNvbnN0IHJkIG9mIHJlbmRlckRhdGEpIHtcbiAgICAgICAgICAgIGNvbnN0IHcgPSByZC53b3JkO1xuICAgICAgICAgICAgY29uc3QgaGVpZ2h0ID0gd29yZFNjYWxlKHJkLnNjb3JlKTtcbiAgICAgICAgICAgIGNvbnN0IHggPSB4c2NhbGUocmQucG9zWzBdKVxuICAgICAgICAgICAgY29uc3QgeSA9IHlzY2FsZShyZC5wb3NbMV0pXG5cbiAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gb3AudGV4dF9tZWFzdXJlci50ZXh0TGVuZ3RoKHcsICdmb250LXNpemU6JyArIGhlaWdodCArICdweDsnKVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codyxoZWlnaHQseCx5LHdpZHRoLFwiLS0tIHcsaGVpZ2h0LHgseSx3aWR0aFwiKTtcblxuICAgICAgICAgICAgb2ZyZWUucHVzaChuZXcgY29sYS5SZWN0YW5nbGUoeCAtIHdpZHRoIC8gMiAtIDQsIHggKyB3aWR0aCAvIDIgKyA0LCB5IC0gaGVpZ2h0IC8gMiAtIDMsIHkgKyBoZWlnaHQgLyAyICsgMykpXG5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgY29sYS5yZW1vdmVPdmVybGFwcyhvZnJlZSk7XG5cbiAgICAgICAgY29uc3QgbmV3UG9zID0ge307XG4gICAgICAgIG9mcmVlLmZvckVhY2goKGQsIGkpID0+IHtcbiAgICAgICAgICAgIG5ld1Bvc1tyZW5kZXJEYXRhW2ldLndvcmRdID0ge1xuICAgICAgICAgICAgICAgIGN4OiAoZC5YICsgZC54KSAqIC41LFxuICAgICAgICAgICAgICAgIGN5OiAoZC5ZICsgZC55KSAqIC41LFxuICAgICAgICAgICAgICAgIHc6IChkLlggLSBkLngpLFxuICAgICAgICAgICAgICAgIGg6IChkLlkgLSBkLnkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgLy8gY29uc29sZS5sb2cob2ZyZWUsXCItLS0gb2ZyZWVcIik7XG5cblxuICAgICAgICAvL1RPRE86IEJBRCBIQUNLIC0gLXNob3VsZCBub3QgYmUgdXNpbmcgaW5kaWNlc1xuXG4gICAgICAgIGNvbnN0IGFsbFdvcmRzID0gd29yZEVudGVyLm1lcmdlKHdvcmQpO1xuICAgICAgICBhbGxXb3Jkcy5hdHRyKCd0cmFuc2Zvcm0nLFxuICAgICAgICAgICAgKGQsIGkpID0+IGB0cmFuc2xhdGUoJHtuZXdQb3NbZC53b3JkXS5jeH0sICR7bmV3UG9zW2Qud29yZF0uY3l9KWApXG4gICAgICAgIGFsbFdvcmRzLnNlbGVjdCgncmVjdCcpLmF0dHJzKHtcbiAgICAgICAgICAgIHdpZHRoOiAoZCwgaSkgPT4gbmV3UG9zW2Qud29yZF0udyxcbiAgICAgICAgICAgIGhlaWdodDogKGQsIGkpID0+IG5ld1Bvc1tkLndvcmRdLmggLSAyLFxuICAgICAgICAgICAgeDogKGQsIGkpID0+IC1uZXdQb3NbZC53b3JkXS53ICogLjUsXG4gICAgICAgICAgICB5OiAoZCwgaSkgPT4gLW5ld1Bvc1tkLndvcmRdLmggKiAuNSArIDEsXG4gICAgICAgIH0pO1xuICAgICAgICBhbGxXb3Jkcy5zZWxlY3QoJ3RleHQnKVxuICAgICAgICAgICAgLnRleHQoZCA9PiBkLndvcmQpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsIGQgPT4gd29yZFNjYWxlKGQuc2NvcmUpICsgJ3B4JylcblxuICAgICAgICBpZiAodGhpcy5fY3VycmVudC5oYXNfY29tcGFyZSkge1xuICAgICAgICAgICAgY29uc3QgYmRfbWF4ID0gXy5tYXgoPG51bWJlcltdPnJlbmRlckRhdGEubWFwKGQgPT4gZC5jb21wYXJlLmRpc3QpKTtcbiAgICAgICAgICAgIGNvbnN0IGJkX3NjYWxlID0gZDMuc2NhbGVMaW5lYXI8c3RyaW5nLHN0cmluZz4oKS5kb21haW4oWzAsIGJkX21heF0pXG4gICAgICAgICAgICAgICAgLnJhbmdlKFsnI2ZmZmZmZicsICcjM2Y2ZjllJ10pO1xuICAgICAgICAgICAgYWxsV29yZHMuc2VsZWN0KCdyZWN0Jykuc3R5bGUoJ2ZpbGwnLCBkID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkLFwiLS0tIGRcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJkX3NjYWxlKGQuY29tcGFyZS5kaXN0KVxuICAgICAgICAgICAgfSlcblxuICAgICAgICB9XG5cblxuICAgIH1cblxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3RzL3Zpcy9Xb3JkUHJvamVjdG9yLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmZ1bmN0aW9uIF9fZXhwb3J0KG0pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3NyYy9hZGFwdG9yXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vc3JjL2QzYWRhcHRvclwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3NyYy9kZXNjZW50XCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vc3JjL2dlb21cIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9zcmMvZ3JpZHJvdXRlclwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3NyYy9oYW5kbGVkaXNjb25uZWN0ZWRcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9zcmMvbGF5b3V0XCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vc3JjL2xheW91dDNkXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vc3JjL2xpbmtsZW5ndGhzXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vc3JjL3Bvd2VyZ3JhcGhcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9zcmMvcHF1ZXVlXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vc3JjL3JidHJlZVwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3NyYy9yZWN0YW5nbGVcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9zcmMvc2hvcnRlc3RwYXRoc1wiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3NyYy92cHNjXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vc3JjL2JhdGNoXCIpKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvd2ViY29sYS9kaXN0L2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAyNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGxheW91dF8xID0gcmVxdWlyZShcIi4vbGF5b3V0XCIpO1xyXG52YXIgTGF5b3V0QWRhcHRvciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoTGF5b3V0QWRhcHRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIExheW91dEFkYXB0b3Iob3B0aW9ucykge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgdmFyIHNlbGYgPSBfdGhpcztcclxuICAgICAgICB2YXIgbyA9IG9wdGlvbnM7XHJcbiAgICAgICAgaWYgKG8udHJpZ2dlcikge1xyXG4gICAgICAgICAgICBfdGhpcy50cmlnZ2VyID0gby50cmlnZ2VyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoby5raWNrKSB7XHJcbiAgICAgICAgICAgIF90aGlzLmtpY2sgPSBvLmtpY2s7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvLmRyYWcpIHtcclxuICAgICAgICAgICAgX3RoaXMuZHJhZyA9IG8uZHJhZztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG8ub24pIHtcclxuICAgICAgICAgICAgX3RoaXMub24gPSBvLm9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICBfdGhpcy5kcmFnc3RhcnQgPSBfdGhpcy5kcmFnU3RhcnQgPSBsYXlvdXRfMS5MYXlvdXQuZHJhZ1N0YXJ0O1xyXG4gICAgICAgIF90aGlzLmRyYWdlbmQgPSBfdGhpcy5kcmFnRW5kID0gbGF5b3V0XzEuTGF5b3V0LmRyYWdFbmQ7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgTGF5b3V0QWRhcHRvci5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uIChlKSB7IH07XHJcbiAgICA7XHJcbiAgICBMYXlvdXRBZGFwdG9yLnByb3RvdHlwZS5raWNrID0gZnVuY3Rpb24gKCkgeyB9O1xyXG4gICAgO1xyXG4gICAgTGF5b3V0QWRhcHRvci5wcm90b3R5cGUuZHJhZyA9IGZ1bmN0aW9uICgpIHsgfTtcclxuICAgIDtcclxuICAgIExheW91dEFkYXB0b3IucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGV2ZW50VHlwZSwgbGlzdGVuZXIpIHsgcmV0dXJuIHRoaXM7IH07XHJcbiAgICA7XHJcbiAgICByZXR1cm4gTGF5b3V0QWRhcHRvcjtcclxufShsYXlvdXRfMS5MYXlvdXQpKTtcclxuZXhwb3J0cy5MYXlvdXRBZGFwdG9yID0gTGF5b3V0QWRhcHRvcjtcclxuZnVuY3Rpb24gYWRhcHRvcihvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gbmV3IExheW91dEFkYXB0b3Iob3B0aW9ucyk7XHJcbn1cclxuZXhwb3J0cy5hZGFwdG9yID0gYWRhcHRvcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YWRhcHRvci5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy93ZWJjb2xhL2Rpc3Qvc3JjL2FkYXB0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDI3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBkM3YzID0gcmVxdWlyZShcIi4vZDN2M2FkYXB0b3JcIik7XHJcbnZhciBkM3Y0ID0gcmVxdWlyZShcIi4vZDN2NGFkYXB0b3JcIik7XHJcbjtcclxuZnVuY3Rpb24gZDNhZGFwdG9yKGQzQ29udGV4dCkge1xyXG4gICAgaWYgKCFkM0NvbnRleHQgfHwgaXNEM1YzKGQzQ29udGV4dCkpIHtcclxuICAgICAgICByZXR1cm4gbmV3IGQzdjMuRDNTdHlsZUxheW91dEFkYXB0b3IoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgZDN2NC5EM1N0eWxlTGF5b3V0QWRhcHRvcihkM0NvbnRleHQpO1xyXG59XHJcbmV4cG9ydHMuZDNhZGFwdG9yID0gZDNhZGFwdG9yO1xyXG5mdW5jdGlvbiBpc0QzVjMoZDNDb250ZXh0KSB7XHJcbiAgICB2YXIgdjNleHAgPSAvXjNcXC4vO1xyXG4gICAgcmV0dXJuIGQzQ29udGV4dC52ZXJzaW9uICYmIGQzQ29udGV4dC52ZXJzaW9uLm1hdGNoKHYzZXhwKSAhPT0gbnVsbDtcclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kM2FkYXB0b3IuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvd2ViY29sYS9kaXN0L3NyYy9kM2FkYXB0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDI4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgbGF5b3V0XzEgPSByZXF1aXJlKFwiLi9sYXlvdXRcIik7XHJcbnZhciBEM1N0eWxlTGF5b3V0QWRhcHRvciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoRDNTdHlsZUxheW91dEFkYXB0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBEM1N0eWxlTGF5b3V0QWRhcHRvcigpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLmV2ZW50ID0gZDMuZGlzcGF0Y2gobGF5b3V0XzEuRXZlbnRUeXBlW2xheW91dF8xLkV2ZW50VHlwZS5zdGFydF0sIGxheW91dF8xLkV2ZW50VHlwZVtsYXlvdXRfMS5FdmVudFR5cGUudGlja10sIGxheW91dF8xLkV2ZW50VHlwZVtsYXlvdXRfMS5FdmVudFR5cGUuZW5kXSk7XHJcbiAgICAgICAgdmFyIGQzbGF5b3V0ID0gX3RoaXM7XHJcbiAgICAgICAgdmFyIGRyYWc7XHJcbiAgICAgICAgX3RoaXMuZHJhZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCFkcmFnKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZHJhZyA9IGQzLmJlaGF2aW9yLmRyYWcoKVxyXG4gICAgICAgICAgICAgICAgICAgIC5vcmlnaW4obGF5b3V0XzEuTGF5b3V0LmRyYWdPcmlnaW4pXHJcbiAgICAgICAgICAgICAgICAgICAgLm9uKFwiZHJhZ3N0YXJ0LmQzYWRhcHRvclwiLCBsYXlvdXRfMS5MYXlvdXQuZHJhZ1N0YXJ0KVxyXG4gICAgICAgICAgICAgICAgICAgIC5vbihcImRyYWcuZDNhZGFwdG9yXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF5b3V0XzEuTGF5b3V0LmRyYWcoZCwgZDMuZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGQzbGF5b3V0LnJlc3VtZSgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAub24oXCJkcmFnZW5kLmQzYWRhcHRvclwiLCBsYXlvdXRfMS5MYXlvdXQuZHJhZ0VuZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRyYWc7XHJcbiAgICAgICAgICAgIHRoaXNcclxuICAgICAgICAgICAgICAgIC5jYWxsKGRyYWcpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgRDNTdHlsZUxheW91dEFkYXB0b3IucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciBkM2V2ZW50ID0geyB0eXBlOiBsYXlvdXRfMS5FdmVudFR5cGVbZS50eXBlXSwgYWxwaGE6IGUuYWxwaGEsIHN0cmVzczogZS5zdHJlc3MgfTtcclxuICAgICAgICB0aGlzLmV2ZW50W2QzZXZlbnQudHlwZV0oZDNldmVudCk7XHJcbiAgICB9O1xyXG4gICAgRDNTdHlsZUxheW91dEFkYXB0b3IucHJvdG90eXBlLmtpY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBkMy50aW1lcihmdW5jdGlvbiAoKSB7IHJldHVybiBfc3VwZXIucHJvdG90eXBlLnRpY2suY2FsbChfdGhpcyk7IH0pO1xyXG4gICAgfTtcclxuICAgIEQzU3R5bGVMYXlvdXRBZGFwdG9yLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIChldmVudFR5cGUsIGxpc3RlbmVyKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBldmVudFR5cGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnQub24oZXZlbnRUeXBlLCBsaXN0ZW5lcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50Lm9uKGxheW91dF8xLkV2ZW50VHlwZVtldmVudFR5cGVdLCBsaXN0ZW5lcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBEM1N0eWxlTGF5b3V0QWRhcHRvcjtcclxufShsYXlvdXRfMS5MYXlvdXQpKTtcclxuZXhwb3J0cy5EM1N0eWxlTGF5b3V0QWRhcHRvciA9IEQzU3R5bGVMYXlvdXRBZGFwdG9yO1xyXG5mdW5jdGlvbiBkM2FkYXB0b3IoKSB7XHJcbiAgICByZXR1cm4gbmV3IEQzU3R5bGVMYXlvdXRBZGFwdG9yKCk7XHJcbn1cclxuZXhwb3J0cy5kM2FkYXB0b3IgPSBkM2FkYXB0b3I7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWQzdjNhZGFwdG9yLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3dlYmNvbGEvZGlzdC9zcmMvZDN2M2FkYXB0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDI5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgbGF5b3V0XzEgPSByZXF1aXJlKFwiLi9sYXlvdXRcIik7XHJcbnZhciBEM1N0eWxlTGF5b3V0QWRhcHRvciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoRDNTdHlsZUxheW91dEFkYXB0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBEM1N0eWxlTGF5b3V0QWRhcHRvcihkM0NvbnRleHQpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLmQzQ29udGV4dCA9IGQzQ29udGV4dDtcclxuICAgICAgICBfdGhpcy5ldmVudCA9IGQzQ29udGV4dC5kaXNwYXRjaChsYXlvdXRfMS5FdmVudFR5cGVbbGF5b3V0XzEuRXZlbnRUeXBlLnN0YXJ0XSwgbGF5b3V0XzEuRXZlbnRUeXBlW2xheW91dF8xLkV2ZW50VHlwZS50aWNrXSwgbGF5b3V0XzEuRXZlbnRUeXBlW2xheW91dF8xLkV2ZW50VHlwZS5lbmRdKTtcclxuICAgICAgICB2YXIgZDNsYXlvdXQgPSBfdGhpcztcclxuICAgICAgICB2YXIgZHJhZztcclxuICAgICAgICBfdGhpcy5kcmFnID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoIWRyYWcpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkcmFnID0gZDNDb250ZXh0LmRyYWcoKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdWJqZWN0KGxheW91dF8xLkxheW91dC5kcmFnT3JpZ2luKVxyXG4gICAgICAgICAgICAgICAgICAgIC5vbihcInN0YXJ0LmQzYWRhcHRvclwiLCBsYXlvdXRfMS5MYXlvdXQuZHJhZ1N0YXJ0KVxyXG4gICAgICAgICAgICAgICAgICAgIC5vbihcImRyYWcuZDNhZGFwdG9yXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF5b3V0XzEuTGF5b3V0LmRyYWcoZCwgZDNDb250ZXh0LmV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICBkM2xheW91dC5yZXN1bWUoKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLm9uKFwiZW5kLmQzYWRhcHRvclwiLCBsYXlvdXRfMS5MYXlvdXQuZHJhZ0VuZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRyYWc7XHJcbiAgICAgICAgICAgIGFyZ3VtZW50c1swXS5jYWxsKGRyYWcpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgRDNTdHlsZUxheW91dEFkYXB0b3IucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciBkM2V2ZW50ID0geyB0eXBlOiBsYXlvdXRfMS5FdmVudFR5cGVbZS50eXBlXSwgYWxwaGE6IGUuYWxwaGEsIHN0cmVzczogZS5zdHJlc3MgfTtcclxuICAgICAgICB0aGlzLmV2ZW50LmNhbGwoZDNldmVudC50eXBlLCBkM2V2ZW50KTtcclxuICAgIH07XHJcbiAgICBEM1N0eWxlTGF5b3V0QWRhcHRvci5wcm90b3R5cGUua2ljayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciB0ID0gdGhpcy5kM0NvbnRleHQudGltZXIoZnVuY3Rpb24gKCkgeyByZXR1cm4gX3N1cGVyLnByb3RvdHlwZS50aWNrLmNhbGwoX3RoaXMpICYmIHQuc3RvcCgpOyB9KTtcclxuICAgIH07XHJcbiAgICBEM1N0eWxlTGF5b3V0QWRhcHRvci5wcm90b3R5cGUub24gPSBmdW5jdGlvbiAoZXZlbnRUeXBlLCBsaXN0ZW5lcikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgZXZlbnRUeXBlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50Lm9uKGV2ZW50VHlwZSwgbGlzdGVuZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5ldmVudC5vbihsYXlvdXRfMS5FdmVudFR5cGVbZXZlbnRUeXBlXSwgbGlzdGVuZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICByZXR1cm4gRDNTdHlsZUxheW91dEFkYXB0b3I7XHJcbn0obGF5b3V0XzEuTGF5b3V0KSk7XHJcbmV4cG9ydHMuRDNTdHlsZUxheW91dEFkYXB0b3IgPSBEM1N0eWxlTGF5b3V0QWRhcHRvcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZDN2NGFkYXB0b3IuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvd2ViY29sYS9kaXN0L3NyYy9kM3Y0YWRhcHRvci5qc1xuLy8gbW9kdWxlIGlkID0gMzBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHNob3J0ZXN0cGF0aHNfMSA9IHJlcXVpcmUoXCIuL3Nob3J0ZXN0cGF0aHNcIik7XHJcbnZhciBkZXNjZW50XzEgPSByZXF1aXJlKFwiLi9kZXNjZW50XCIpO1xyXG52YXIgcmVjdGFuZ2xlXzEgPSByZXF1aXJlKFwiLi9yZWN0YW5nbGVcIik7XHJcbnZhciBsaW5rbGVuZ3Roc18xID0gcmVxdWlyZShcIi4vbGlua2xlbmd0aHNcIik7XHJcbnZhciBMaW5rM0QgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTGluazNEKHNvdXJjZSwgdGFyZ2V0KSB7XHJcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XHJcbiAgICB9XHJcbiAgICBMaW5rM0QucHJvdG90eXBlLmFjdHVhbExlbmd0aCA9IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHgucmVkdWNlKGZ1bmN0aW9uIChjLCB2KSB7XHJcbiAgICAgICAgICAgIHZhciBkeCA9IHZbX3RoaXMudGFyZ2V0XSAtIHZbX3RoaXMuc291cmNlXTtcclxuICAgICAgICAgICAgcmV0dXJuIGMgKyBkeCAqIGR4O1xyXG4gICAgICAgIH0sIDApKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTGluazNEO1xyXG59KCkpO1xyXG5leHBvcnRzLkxpbmszRCA9IExpbmszRDtcclxudmFyIE5vZGUzRCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBOb2RlM0QoeCwgeSwgeikge1xyXG4gICAgICAgIGlmICh4ID09PSB2b2lkIDApIHsgeCA9IDA7IH1cclxuICAgICAgICBpZiAoeSA9PT0gdm9pZCAwKSB7IHkgPSAwOyB9XHJcbiAgICAgICAgaWYgKHogPT09IHZvaWQgMCkgeyB6ID0gMDsgfVxyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLnogPSB6O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIE5vZGUzRDtcclxufSgpKTtcclxuZXhwb3J0cy5Ob2RlM0QgPSBOb2RlM0Q7XHJcbnZhciBMYXlvdXQzRCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBMYXlvdXQzRChub2RlcywgbGlua3MsIGlkZWFsTGlua0xlbmd0aCkge1xyXG4gICAgICAgIGlmIChpZGVhbExpbmtMZW5ndGggPT09IHZvaWQgMCkgeyBpZGVhbExpbmtMZW5ndGggPSAxOyB9XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLm5vZGVzID0gbm9kZXM7XHJcbiAgICAgICAgdGhpcy5saW5rcyA9IGxpbmtzO1xyXG4gICAgICAgIHRoaXMuaWRlYWxMaW5rTGVuZ3RoID0gaWRlYWxMaW5rTGVuZ3RoO1xyXG4gICAgICAgIHRoaXMuY29uc3RyYWludHMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudXNlSmFjY2FyZExpbmtMZW5ndGhzID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnJlc3VsdCA9IG5ldyBBcnJheShMYXlvdXQzRC5rKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IExheW91dDNELms7ICsraSkge1xyXG4gICAgICAgICAgICB0aGlzLnJlc3VsdFtpXSA9IG5ldyBBcnJheShub2Rlcy5sZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uICh2LCBpKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSBMYXlvdXQzRC5kaW1zOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRpbSA9IF9hW19pXTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdltkaW1dID09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgICAgIHZbZGltXSA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX3RoaXMucmVzdWx0WzBdW2ldID0gdi54O1xyXG4gICAgICAgICAgICBfdGhpcy5yZXN1bHRbMV1baV0gPSB2Lnk7XHJcbiAgICAgICAgICAgIF90aGlzLnJlc3VsdFsyXVtpXSA9IHYuejtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIDtcclxuICAgIExheW91dDNELnByb3RvdHlwZS5saW5rTGVuZ3RoID0gZnVuY3Rpb24gKGwpIHtcclxuICAgICAgICByZXR1cm4gbC5hY3R1YWxMZW5ndGgodGhpcy5yZXN1bHQpO1xyXG4gICAgfTtcclxuICAgIExheW91dDNELnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uIChpdGVyYXRpb25zKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAoaXRlcmF0aW9ucyA9PT0gdm9pZCAwKSB7IGl0ZXJhdGlvbnMgPSAxMDA7IH1cclxuICAgICAgICB2YXIgbiA9IHRoaXMubm9kZXMubGVuZ3RoO1xyXG4gICAgICAgIHZhciBsaW5rQWNjZXNzb3IgPSBuZXcgTGlua0FjY2Vzc29yKCk7XHJcbiAgICAgICAgaWYgKHRoaXMudXNlSmFjY2FyZExpbmtMZW5ndGhzKVxyXG4gICAgICAgICAgICBsaW5rbGVuZ3Roc18xLmphY2NhcmRMaW5rTGVuZ3Rocyh0aGlzLmxpbmtzLCBsaW5rQWNjZXNzb3IsIDEuNSk7XHJcbiAgICAgICAgdGhpcy5saW5rcy5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7IHJldHVybiBlLmxlbmd0aCAqPSBfdGhpcy5pZGVhbExpbmtMZW5ndGg7IH0pO1xyXG4gICAgICAgIHZhciBkaXN0YW5jZU1hdHJpeCA9IChuZXcgc2hvcnRlc3RwYXRoc18xLkNhbGN1bGF0b3IobiwgdGhpcy5saW5rcywgZnVuY3Rpb24gKGUpIHsgcmV0dXJuIGUuc291cmNlOyB9LCBmdW5jdGlvbiAoZSkgeyByZXR1cm4gZS50YXJnZXQ7IH0sIGZ1bmN0aW9uIChlKSB7IHJldHVybiBlLmxlbmd0aDsgfSkpLkRpc3RhbmNlTWF0cml4KCk7XHJcbiAgICAgICAgdmFyIEQgPSBkZXNjZW50XzEuRGVzY2VudC5jcmVhdGVTcXVhcmVNYXRyaXgobiwgZnVuY3Rpb24gKGksIGopIHsgcmV0dXJuIGRpc3RhbmNlTWF0cml4W2ldW2pdOyB9KTtcclxuICAgICAgICB2YXIgRyA9IGRlc2NlbnRfMS5EZXNjZW50LmNyZWF0ZVNxdWFyZU1hdHJpeChuLCBmdW5jdGlvbiAoKSB7IHJldHVybiAyOyB9KTtcclxuICAgICAgICB0aGlzLmxpbmtzLmZvckVhY2goZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBfYS5zb3VyY2UsIHRhcmdldCA9IF9hLnRhcmdldDtcclxuICAgICAgICAgICAgcmV0dXJuIEdbc291cmNlXVt0YXJnZXRdID0gR1t0YXJnZXRdW3NvdXJjZV0gPSAxO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZGVzY2VudCA9IG5ldyBkZXNjZW50XzEuRGVzY2VudCh0aGlzLnJlc3VsdCwgRCk7XHJcbiAgICAgICAgdGhpcy5kZXNjZW50LnRocmVzaG9sZCA9IDFlLTM7XHJcbiAgICAgICAgdGhpcy5kZXNjZW50LkcgPSBHO1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnN0cmFpbnRzKVxyXG4gICAgICAgICAgICB0aGlzLmRlc2NlbnQucHJvamVjdCA9IG5ldyByZWN0YW5nbGVfMS5Qcm9qZWN0aW9uKHRoaXMubm9kZXMsIG51bGwsIG51bGwsIHRoaXMuY29uc3RyYWludHMpLnByb2plY3RGdW5jdGlvbnMoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHYgPSB0aGlzLm5vZGVzW2ldO1xyXG4gICAgICAgICAgICBpZiAodi5maXhlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjZW50LmxvY2tzLmFkZChpLCBbdi54LCB2LnksIHYuel0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZGVzY2VudC5ydW4oaXRlcmF0aW9ucyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGF5b3V0M0QucHJvdG90eXBlLnRpY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5kZXNjZW50LmxvY2tzLmNsZWFyKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB2ID0gdGhpcy5ub2Rlc1tpXTtcclxuICAgICAgICAgICAgaWYgKHYuZml4ZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY2VudC5sb2Nrcy5hZGQoaSwgW3YueCwgdi55LCB2LnpdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5kZXNjZW50LnJ1bmdlS3V0dGEoKTtcclxuICAgIH07XHJcbiAgICBMYXlvdXQzRC5kaW1zID0gWyd4JywgJ3knLCAneiddO1xyXG4gICAgTGF5b3V0M0QuayA9IExheW91dDNELmRpbXMubGVuZ3RoO1xyXG4gICAgcmV0dXJuIExheW91dDNEO1xyXG59KCkpO1xyXG5leHBvcnRzLkxheW91dDNEID0gTGF5b3V0M0Q7XHJcbnZhciBMaW5rQWNjZXNzb3IgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTGlua0FjY2Vzc29yKCkge1xyXG4gICAgfVxyXG4gICAgTGlua0FjY2Vzc29yLnByb3RvdHlwZS5nZXRTb3VyY2VJbmRleCA9IGZ1bmN0aW9uIChlKSB7IHJldHVybiBlLnNvdXJjZTsgfTtcclxuICAgIExpbmtBY2Nlc3Nvci5wcm90b3R5cGUuZ2V0VGFyZ2V0SW5kZXggPSBmdW5jdGlvbiAoZSkgeyByZXR1cm4gZS50YXJnZXQ7IH07XHJcbiAgICBMaW5rQWNjZXNzb3IucHJvdG90eXBlLmdldExlbmd0aCA9IGZ1bmN0aW9uIChlKSB7IHJldHVybiBlLmxlbmd0aDsgfTtcclxuICAgIExpbmtBY2Nlc3Nvci5wcm90b3R5cGUuc2V0TGVuZ3RoID0gZnVuY3Rpb24gKGUsIGwpIHsgZS5sZW5ndGggPSBsOyB9O1xyXG4gICAgcmV0dXJuIExpbmtBY2Nlc3NvcjtcclxufSgpKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGF5b3V0M2QuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvd2ViY29sYS9kaXN0L3NyYy9sYXlvdXQzZC5qc1xuLy8gbW9kdWxlIGlkID0gMzFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGxheW91dF8xID0gcmVxdWlyZShcIi4vbGF5b3V0XCIpO1xyXG52YXIgZ3JpZHJvdXRlcl8xID0gcmVxdWlyZShcIi4vZ3JpZHJvdXRlclwiKTtcclxuZnVuY3Rpb24gZ3JpZGlmeShwZ0xheW91dCwgbnVkZ2VHYXAsIG1hcmdpbiwgZ3JvdXBNYXJnaW4pIHtcclxuICAgIHBnTGF5b3V0LmNvbGEuc3RhcnQoMCwgMCwgMCwgMTAsIGZhbHNlKTtcclxuICAgIHZhciBncmlkcm91dGVyID0gcm91dGUocGdMYXlvdXQuY29sYS5ub2RlcygpLCBwZ0xheW91dC5jb2xhLmdyb3VwcygpLCBtYXJnaW4sIGdyb3VwTWFyZ2luKTtcclxuICAgIHJldHVybiBncmlkcm91dGVyLnJvdXRlRWRnZXMocGdMYXlvdXQucG93ZXJHcmFwaC5wb3dlckVkZ2VzLCBudWRnZUdhcCwgZnVuY3Rpb24gKGUpIHsgcmV0dXJuIGUuc291cmNlLnJvdXRlck5vZGUuaWQ7IH0sIGZ1bmN0aW9uIChlKSB7IHJldHVybiBlLnRhcmdldC5yb3V0ZXJOb2RlLmlkOyB9KTtcclxufVxyXG5leHBvcnRzLmdyaWRpZnkgPSBncmlkaWZ5O1xyXG5mdW5jdGlvbiByb3V0ZShub2RlcywgZ3JvdXBzLCBtYXJnaW4sIGdyb3VwTWFyZ2luKSB7XHJcbiAgICBub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgZC5yb3V0ZXJOb2RlID0ge1xyXG4gICAgICAgICAgICBuYW1lOiBkLm5hbWUsXHJcbiAgICAgICAgICAgIGJvdW5kczogZC5ib3VuZHMuaW5mbGF0ZSgtbWFyZ2luKVxyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxuICAgIGdyb3Vwcy5mb3JFYWNoKGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgZC5yb3V0ZXJOb2RlID0ge1xyXG4gICAgICAgICAgICBib3VuZHM6IGQuYm91bmRzLmluZmxhdGUoLWdyb3VwTWFyZ2luKSxcclxuICAgICAgICAgICAgY2hpbGRyZW46ICh0eXBlb2YgZC5ncm91cHMgIT09ICd1bmRlZmluZWQnID8gZC5ncm91cHMubWFwKGZ1bmN0aW9uIChjKSB7IHJldHVybiBub2Rlcy5sZW5ndGggKyBjLmlkOyB9KSA6IFtdKVxyXG4gICAgICAgICAgICAgICAgLmNvbmNhdCh0eXBlb2YgZC5sZWF2ZXMgIT09ICd1bmRlZmluZWQnID8gZC5sZWF2ZXMubWFwKGZ1bmN0aW9uIChjKSB7IHJldHVybiBjLmluZGV4OyB9KSA6IFtdKVxyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxuICAgIHZhciBncmlkUm91dGVyTm9kZXMgPSBub2Rlcy5jb25jYXQoZ3JvdXBzKS5tYXAoZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICBkLnJvdXRlck5vZGUuaWQgPSBpO1xyXG4gICAgICAgIHJldHVybiBkLnJvdXRlck5vZGU7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBuZXcgZ3JpZHJvdXRlcl8xLkdyaWRSb3V0ZXIoZ3JpZFJvdXRlck5vZGVzLCB7XHJcbiAgICAgICAgZ2V0Q2hpbGRyZW46IGZ1bmN0aW9uICh2KSB7IHJldHVybiB2LmNoaWxkcmVuOyB9LFxyXG4gICAgICAgIGdldEJvdW5kczogZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHYuYm91bmRzOyB9XHJcbiAgICB9LCBtYXJnaW4gLSBncm91cE1hcmdpbik7XHJcbn1cclxuZnVuY3Rpb24gcG93ZXJHcmFwaEdyaWRMYXlvdXQoZ3JhcGgsIHNpemUsIGdyb3VwcGFkZGluZykge1xyXG4gICAgdmFyIHBvd2VyR3JhcGg7XHJcbiAgICBncmFwaC5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uICh2LCBpKSB7IHJldHVybiB2LmluZGV4ID0gaTsgfSk7XHJcbiAgICBuZXcgbGF5b3V0XzEuTGF5b3V0KClcclxuICAgICAgICAuYXZvaWRPdmVybGFwcyhmYWxzZSlcclxuICAgICAgICAubm9kZXMoZ3JhcGgubm9kZXMpXHJcbiAgICAgICAgLmxpbmtzKGdyYXBoLmxpbmtzKVxyXG4gICAgICAgIC5wb3dlckdyYXBoR3JvdXBzKGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgcG93ZXJHcmFwaCA9IGQ7XHJcbiAgICAgICAgcG93ZXJHcmFwaC5ncm91cHMuZm9yRWFjaChmdW5jdGlvbiAodikgeyByZXR1cm4gdi5wYWRkaW5nID0gZ3JvdXBwYWRkaW5nOyB9KTtcclxuICAgIH0pO1xyXG4gICAgdmFyIG4gPSBncmFwaC5ub2Rlcy5sZW5ndGg7XHJcbiAgICB2YXIgZWRnZXMgPSBbXTtcclxuICAgIHZhciB2cyA9IGdyYXBoLm5vZGVzLnNsaWNlKDApO1xyXG4gICAgdnMuZm9yRWFjaChmdW5jdGlvbiAodiwgaSkgeyByZXR1cm4gdi5pbmRleCA9IGk7IH0pO1xyXG4gICAgcG93ZXJHcmFwaC5ncm91cHMuZm9yRWFjaChmdW5jdGlvbiAoZykge1xyXG4gICAgICAgIHZhciBzb3VyY2VJbmQgPSBnLmluZGV4ID0gZy5pZCArIG47XHJcbiAgICAgICAgdnMucHVzaChnKTtcclxuICAgICAgICBpZiAodHlwZW9mIGcubGVhdmVzICE9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgZy5sZWF2ZXMuZm9yRWFjaChmdW5jdGlvbiAodikgeyByZXR1cm4gZWRnZXMucHVzaCh7IHNvdXJjZTogc291cmNlSW5kLCB0YXJnZXQ6IHYuaW5kZXggfSk7IH0pO1xyXG4gICAgICAgIGlmICh0eXBlb2YgZy5ncm91cHMgIT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICBnLmdyb3Vwcy5mb3JFYWNoKGZ1bmN0aW9uIChnZykgeyByZXR1cm4gZWRnZXMucHVzaCh7IHNvdXJjZTogc291cmNlSW5kLCB0YXJnZXQ6IGdnLmlkICsgbiB9KTsgfSk7XHJcbiAgICB9KTtcclxuICAgIHBvd2VyR3JhcGgucG93ZXJFZGdlcy5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZWRnZXMucHVzaCh7IHNvdXJjZTogZS5zb3VyY2UuaW5kZXgsIHRhcmdldDogZS50YXJnZXQuaW5kZXggfSk7XHJcbiAgICB9KTtcclxuICAgIG5ldyBsYXlvdXRfMS5MYXlvdXQoKVxyXG4gICAgICAgIC5zaXplKHNpemUpXHJcbiAgICAgICAgLm5vZGVzKHZzKVxyXG4gICAgICAgIC5saW5rcyhlZGdlcylcclxuICAgICAgICAuYXZvaWRPdmVybGFwcyhmYWxzZSlcclxuICAgICAgICAubGlua0Rpc3RhbmNlKDMwKVxyXG4gICAgICAgIC5zeW1tZXRyaWNEaWZmTGlua0xlbmd0aHMoNSlcclxuICAgICAgICAuY29udmVyZ2VuY2VUaHJlc2hvbGQoMWUtNClcclxuICAgICAgICAuc3RhcnQoMTAwLCAwLCAwLCAwLCBmYWxzZSk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvbGE6IG5ldyBsYXlvdXRfMS5MYXlvdXQoKVxyXG4gICAgICAgICAgICAuY29udmVyZ2VuY2VUaHJlc2hvbGQoMWUtMylcclxuICAgICAgICAgICAgLnNpemUoc2l6ZSlcclxuICAgICAgICAgICAgLmF2b2lkT3ZlcmxhcHModHJ1ZSlcclxuICAgICAgICAgICAgLm5vZGVzKGdyYXBoLm5vZGVzKVxyXG4gICAgICAgICAgICAubGlua3MoZ3JhcGgubGlua3MpXHJcbiAgICAgICAgICAgIC5ncm91cENvbXBhY3RuZXNzKDFlLTQpXHJcbiAgICAgICAgICAgIC5saW5rRGlzdGFuY2UoMzApXHJcbiAgICAgICAgICAgIC5zeW1tZXRyaWNEaWZmTGlua0xlbmd0aHMoNSlcclxuICAgICAgICAgICAgLnBvd2VyR3JhcGhHcm91cHMoZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgcG93ZXJHcmFwaCA9IGQ7XHJcbiAgICAgICAgICAgIHBvd2VyR3JhcGguZ3JvdXBzLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgICAgIHYucGFkZGluZyA9IGdyb3VwcGFkZGluZztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSkuc3RhcnQoNTAsIDAsIDEwMCwgMCwgZmFsc2UpLFxyXG4gICAgICAgIHBvd2VyR3JhcGg6IHBvd2VyR3JhcGhcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5wb3dlckdyYXBoR3JpZExheW91dCA9IHBvd2VyR3JhcGhHcmlkTGF5b3V0O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1iYXRjaC5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy93ZWJjb2xhL2Rpc3Qvc3JjL2JhdGNoLmpzXG4vLyBtb2R1bGUgaWQgPSAzMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQge1ZDb21wb25lbnR9IGZyb20gXCIuL1Zpc3VhbENvbXBvbmVudFwiO1xuaW1wb3J0ICogYXMgZDMgZnJvbSBcImQzXCI7XG5pbXBvcnQgKiBhcyBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCB7U2ltcGxlRXZlbnRIYW5kbGVyfSBmcm9tIFwiLi4vZXRjL1NpbXBsZUV2ZW50SGFuZGxlclwiO1xuaW1wb3J0IHtTVkdNZWFzdXJlbWVudHN9IGZyb20gXCIuLi9ldGMvU1ZHcGx1c1wiO1xuaW1wb3J0IHtEM1NlbCwgTG9vc2VPYmplY3R9IGZyb20gXCIuLi9ldGMvTG9jYWxUeXBlc1wiO1xuXG5cbmV4cG9ydCBjbGFzcyBDbG9zZVdvcmRMaXN0IGV4dGVuZHMgVkNvbXBvbmVudCB7XG5cbiAgICByZWFkb25seSBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgaGVpZ2h0OiA0MDAsXG4gICAgICAgIHdpZHRoOiAxMDAwLFxuICAgICAgICBsaW5lU3BhY2luZzogMjAsXG4gICAgICAgIHNjb3JlV2lkdGg6IDEwMCxcbiAgICAgICAgY3NzX2NsYXNzX21haW46ICdjbG9zZV93b3JkcycsXG4gICAgICAgIGhpZGRlbjogZmFsc2UsXG4gICAgICAgIGRhdGFfYWNjZXNzOiB7XG4gICAgICAgICAgICBwb3M6IGQgPT4gZC5wb3MsXG4gICAgICAgICAgICBzY29yZXM6IGQgPT4gZC5zY29yZSxcbiAgICAgICAgICAgIHdvcmRzOiBkID0+IGQud29yZCxcbiAgICAgICAgICAgIGNvbXBhcmU6IGQgPT4gZC5jb21wYXJlXG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICByZWFkb25seSBsYXlvdXQgPSBbXG4gICAgICAgIHtuYW1lOiAnYmcnLCBwb3M6IFswLCAwXX0sXG4gICAgICAgIHtuYW1lOiAnbWFpbicsIHBvczogWzAsIDBdfSxcbiAgICBdO1xuXG5cbiAgICBjb25zdHJ1Y3RvcihkM1BhcmVudDogRDNTZWwsIGV2ZW50SGFuZGxlcj86IFNpbXBsZUV2ZW50SGFuZGxlciwgb3B0aW9uczoge30gPSB7fSkge1xuICAgICAgICBzdXBlcihkM1BhcmVudCwgZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgdGhpcy5zdXBlckluaXQob3B0aW9ucyk7XG4gICAgfVxuXG5cbiAgICBfaW5pdCgpIHtcbiAgICAgICAgY29uc3Qgb3AgPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgIHRoaXMub3B0aW9ucy50ZXh0X21lYXN1cmVyID0gdGhpcy5vcHRpb25zLnRleHRfbWVhc3VyZXJcbiAgICAgICAgICAgIHx8IG5ldyBTVkdNZWFzdXJlbWVudHModGhpcy5wYXJlbnQsICdjbG9zZV93b3JkX2xpc3QnKTtcblxuICAgICAgICB0aGlzLnBhcmVudC5hdHRycyh7XG4gICAgICAgICAgICB3aWR0aDogb3Aud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IG9wLmhlaWdodFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5oaWRkZW4pIHRoaXMuaGlkZVZpZXcoKTtcbiAgICB9XG5cbiAgICBfd3JhbmdsZShkYXRhKSB7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJ3cm5hZ2xlLS0tIFwiKTtcblxuICAgICAgICBjb25zdCBvcCA9IHRoaXMub3B0aW9ucztcblxuICAgICAgICAvLyBjb25zdCByYXdfcG9zID0gb3AuZGF0YV9hY2Nlc3MucG9zKGRhdGEpO1xuICAgICAgICAvLyBjb25zdCB4X3ZhbHVlcyA9IHJhd19wb3MubWFwKGQgPT4gZFswXSk7XG4gICAgICAgIC8vIGNvbnN0IHlfdmFsdWVzID0gcmF3X3Bvcy5tYXAoZCA9PiBkWzFdKTtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gY29uc3QgcDBfbWluID0gXy5taW5CeSh4X3ZhbHVlcyk7XG4gICAgICAgIC8vIGNvbnN0IHAxX21pbiA9IF8ubWluQnkoeV92YWx1ZXMpO1xuICAgICAgICAvL1xuICAgICAgICAvLyBjb25zdCBkaWZmMCA9IF8ubWF4QnkoeF92YWx1ZXMpIC0gcDBfbWluO1xuICAgICAgICAvLyBjb25zdCBkaWZmMSA9IF8ubWF4QnkoeV92YWx1ZXMpIC0gcDFfbWluO1xuICAgICAgICAvL1xuICAgICAgICAvL1xuICAgICAgICAvLyBsZXQgbm9ybV9wb3MgPSBbXTtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gaWYgKGRpZmYwID4gZGlmZjEpIHtcbiAgICAgICAgLy8gICAgIG5vcm1fcG9zID0gcmF3X3Bvcy5tYXAoZCA9PiBbKGRbMF0gLSBwMF9taW4pIC8gZGlmZjAsIChkWzFdIC0gcDFfbWluKSAvIGRpZmYwXSk7XG4gICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICBub3JtX3BvcyA9IHJhd19wb3MubWFwKGQgPT4gWyhkWzBdIC0gcDBfbWluKSAvIGRpZmYxLCAoZFsxXSAtIHAxX21pbikgLyBkaWZmMV0pXG4gICAgICAgIC8vIH1cblxuICAgICAgICBjb25zdCB3b3JkcyA9IG9wLmRhdGFfYWNjZXNzLndvcmRzKGRhdGEpO1xuICAgICAgICBjb25zdCB3b3JkV2lkdGggPSB3b3Jkcy5tYXAodyA9PiBvcC50ZXh0X21lYXN1cmVyLnRleHRMZW5ndGgodykpO1xuICAgICAgICBjb25zdCBzY29yZXMgPSBvcC5kYXRhX2FjY2Vzcy5zY29yZXMoZGF0YSk7XG4gICAgICAgIGNvbnN0IGNvbXBhcmUgPSBvcC5kYXRhX2FjY2Vzcy5jb21wYXJlKGRhdGEpO1xuICAgICAgICB0aGlzLl9jdXJyZW50Lmhhc19jb21wYXJlID0gY29tcGFyZSAhPT0gbnVsbDtcblxuICAgICAgICAvLyBpZiAodGhpcy5fc3RhdGVzLmhhc19jb21wYXJlKSB7XG4gICAgICAgIHJldHVybiBfLnNvcnRCeShfLnppcFdpdGgod29yZHMsIHNjb3Jlcywgd29yZFdpZHRoLCBjb21wYXJlLFxuICAgICAgICAgICAgKHdvcmQsIHNjb3JlLCB3aWR0aCwgY29tcGFyZSkgPT4gKHt3b3JkLCBzY29yZSwgd2lkdGgsIGNvbXBhcmV9KSksIGQgPT4gLWQuc2NvcmUpO1xuICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgcmV0dXJuIF8uc29ydEJ5KF8uemlwV2l0aCh3b3Jkcywgc2NvcmVzLCB3b3JkV2lkdGgsXG4gICAgICAgIC8vICAgICAgICh3b3JkLCBzY29yZSwgd2lkdGgpID0+ICh7d29yZCwgc2NvcmUsIHdpZHRofSkpLCBkID0+IC1kLnNjb3JlKTtcbiAgICAgICAgLy8gfVxuXG4gICAgfVxuXG4gICAgX3JlbmRlcihyZW5kZXJEYXRhOiBMb29zZU9iamVjdFtdKSB7XG5cbiAgICAgICAgY29uc3Qgb3AgPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgIGNvbnN0IG5vSXRlbXMgPSByZW5kZXJEYXRhLmxlbmd0aDtcbiAgICAgICAgY29uc3QgbHMgPSBvcC5saW5lU3BhY2luZztcbiAgICAgICAgY29uc3QgZjJmID0gZDMuZm9ybWF0KFwiLjJmXCIpO1xuXG5cbiAgICAgICAgdGhpcy5wYXJlbnQuYXR0cignaGVpZ2h0Jywgbm9JdGVtcyAqIGxzKTtcblxuXG4gICAgICAgIGNvbnN0IHdvcmQgPSB0aGlzLmxheWVycy5tYWluLnNlbGVjdEFsbChcIi53b3JkXCIpLmRhdGEocmVuZGVyRGF0YSk7XG4gICAgICAgIHdvcmQuZXhpdCgpLnJlbW92ZSgpO1xuXG4gICAgICAgIGNvbnN0IHdvcmRFbnRlciA9IHdvcmQuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKS5hdHRyKCdjbGFzcycsICd3b3JkJyk7XG5cbiAgICAgICAgY29uc3QgeXNjYWxlID0gZDMuc2NhbGVMaW5lYXIoKS5kb21haW4oWzAsIG5vSXRlbXMgLSAxXSlcbiAgICAgICAgICAgIC5yYW5nZShbbHMgLyAyLCAobm9JdGVtcyAtIC41KSAqIGxzXSk7XG5cblxuICAgICAgICAvL1RPRE86IEJBRCBIQUNLIC0gLXNob3VsZCBub3QgYmUgdXNpbmcgaW5kaWNlc1xuXG4gICAgICAgIHdvcmRFbnRlci5tZXJnZSh3b3JkKS5hdHRycyh7XG4gICAgICAgICAgICB4OiAoKSA9PiAxMCxcbiAgICAgICAgICAgIHk6IChkLCBpKSA9PiB5c2NhbGUoaSksXG4gICAgICAgIH0pLnRleHQoZCA9PiBkLndvcmQpO1xuICAgICAgICAvLyAuc3R5bGUoJ2ZvbnQtc2l6ZScsIGQgPT4gd29yZFNjYWxlKGQuc2NvcmUpICsgJ3B4JylcblxuXG4gICAgICAgIGNvbnN0IHdvcmRFbmQgPSBfLm1heEJ5KHJlbmRlckRhdGEsICd3aWR0aCcpLndpZHRoO1xuICAgICAgICBjb25zdCBtYXhTY29yZSA9IF8ubWF4QnkocmVuZGVyRGF0YSwgJ3Njb3JlJykuc2NvcmU7XG5cbiAgICAgICAgY29uc3QgYmFyU2NhbGUgPSBkMy5zY2FsZUxpbmVhcigpLmRvbWFpbihbMCwgbWF4U2NvcmVdKVxuICAgICAgICAgICAgLnJhbmdlKFswLCBvcC5zY29yZVdpZHRoXSk7XG5cbiAgICAgICAgY29uc3Qgc2NvcmVCYXJzID0gdGhpcy5sYXllcnMubWFpbi5zZWxlY3RBbGwoXCIuc2NvcmVCYXJcIikuZGF0YShyZW5kZXJEYXRhKTtcbiAgICAgICAgc2NvcmVCYXJzLmV4aXQoKS5yZW1vdmUoKTtcblxuICAgICAgICBjb25zdCBzY29yZUJhcnNFbnRlciA9IHNjb3JlQmFycy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3Njb3JlQmFyJyk7XG4gICAgICAgIHNjb3JlQmFyc0VudGVyLmFwcGVuZCgncmVjdCcpO1xuICAgICAgICBzY29yZUJhcnNFbnRlci5hcHBlbmQoJ3RleHQnKS5hdHRycyh7eDogMiwgeTogbHMgLyAyIC0gMiwgJ2NsYXNzJzogJ2JhclRleHQnfSk7XG5cbiAgICAgICAgY29uc3QgYWxsU2NvcmVCYXJzID0gc2NvcmVCYXJzRW50ZXIubWVyZ2Uoc2NvcmVCYXJzKS5hdHRycyh7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IChkLCBpKSA9PiBgdHJhbnNsYXRlKCR7d29yZEVuZCArIDEwICsgMTB9LCR7eXNjYWxlKGkpIC0gbHMgLyAyIH0pYFxuICAgICAgICB9KTtcblxuICAgICAgICBhbGxTY29yZUJhcnMuc2VsZWN0KCdyZWN0JykuYXR0cnMoe1xuICAgICAgICAgICAgd2lkdGg6IGQgPT4gYmFyU2NhbGUoZC5zY29yZSksXG4gICAgICAgICAgICBoZWlnaHQ6IGxzIC0gNFxuICAgICAgICB9KTtcbiAgICAgICAgYWxsU2NvcmVCYXJzLnNlbGVjdCgndGV4dCcpLnRleHQoZCA9PiBmMmYoZC5zY29yZSkpO1xuXG5cbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnQuaGFzX2NvbXBhcmUpIHtcblxuICAgICAgICAgICAgY29uc3QgYmRfbWF4ID0gXy5tYXgocmVuZGVyRGF0YS5tYXAoZCA9PiBkLmNvbXBhcmUuZGlzdCkpO1xuICAgICAgICAgICAgY29uc3QgYmRfc2NhbGUgPSBkMy5zY2FsZUxpbmVhcigpLmRvbWFpbihbMCwgYmRfbWF4XSlcbiAgICAgICAgICAgICAgICAucmFuZ2UoWzEsIDEwMF0pO1xuXG5cbiAgICAgICAgICAgIGNvbnN0IGJhckRpc3QgPSB0aGlzLmxheWVycy5tYWluLnNlbGVjdEFsbChcIi5kaXN0QmFyXCIpLmRhdGEocmVuZGVyRGF0YSk7XG4gICAgICAgICAgICBiYXJEaXN0LmV4aXQoKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIGNvbnN0IGJhckRpc3RFbnRlciA9IGJhckRpc3QuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdkaXN0QmFyJyk7XG4gICAgICAgICAgICBiYXJEaXN0RW50ZXIuYXBwZW5kKCdyZWN0Jyk7XG4gICAgICAgICAgICBiYXJEaXN0RW50ZXIuYXBwZW5kKCd0ZXh0JykuYXR0cnMoe3g6IDIsIHk6IGxzIC8gMiAtIDIsICdjbGFzcyc6ICdiYXJUZXh0J30pO1xuXG5cbiAgICAgICAgICAgIGNvbnN0IGFsbF9iYXJEaXN0ID0gYmFyRGlzdEVudGVyLm1lcmdlKGJhckRpc3QpLmF0dHJzKHtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IChkLCBpKSA9PiBgdHJhbnNsYXRlKCR7d29yZEVuZCArIDEwICsgMTAgKyBvcC5zY29yZVdpZHRoICsgMTB9LCR7eXNjYWxlKGkpIC0gbHMgLyAyIH0pYFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhbGxfYmFyRGlzdC5zZWxlY3QoJ3JlY3QnKVxuICAgICAgICAgICAgICAgIC5hdHRycyh7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBkID0+IGJkX3NjYWxlKGQuY29tcGFyZS5kaXN0KSxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBscyAtIDRcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYWxsX2JhckRpc3Quc2VsZWN0KCd0ZXh0JykudGV4dChkID0+IGYyZihkLmNvbXBhcmUuZGlzdCkpO1xuXG5cbiAgICAgICAgICAgIGNvbnN0IHdvcmRDb21wID0gdGhpcy5sYXllcnMubWFpbi5zZWxlY3RBbGwoXCIud29yZENvbXBcIikuZGF0YShyZW5kZXJEYXRhKTtcbiAgICAgICAgICAgIHdvcmRDb21wLmV4aXQoKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgY29uc3Qgd29yZENvbXBFbnRlciA9IHdvcmRDb21wLmVudGVyKCkuYXBwZW5kKCd0ZXh0JykuYXR0cignY2xhc3MnLCAnd29yZENvbXAnKTtcblxuICAgICAgICAgICAgd29yZENvbXBFbnRlci5tZXJnZSh3b3JkQ29tcCkuYXR0cnMoe1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogKGQsIGkpID0+IGB0cmFuc2xhdGUoJHt3b3JkRW5kICsgMTAgKyAxMCArIG9wLnNjb3JlV2lkdGggKyAxMjB9LCR7eXNjYWxlKGkpfSlgXG4gICAgICAgICAgICB9KS50ZXh0KGQgPT4gZC5jb21wYXJlLnNlbnRlbmNlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sYXllcnMubWFpbi5zZWxlY3RBbGwoXCIud29yZENvbXBcIikucmVtb3ZlKClcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gY29uc29sZS5sb2cod29yZEVuZCwgW3dvcmRFbmRdLCBcIi0tLSB3b3JkRW5kLFt3b3JkRW5kXVwiKTtcbiAgICAgICAgLy8gY29uc3QgZExpbmUgPSB0aGlzLmxheWVycy5iZy5zZWxlY3RBbGwoJy5kaXZpZGVyTGluZScpLmRhdGEoW3dvcmRFbmRdKVxuICAgICAgICAvLyBkTGluZS5lbnRlcigpLmFwcGVuZCgnbGluZScpLmF0dHIoJ2NsYXNzJywgJ2RpdmlkZXJMaW5lJylcbiAgICAgICAgLy8gICAubWVyZ2UoZExpbmUpLmF0dHJzKHtcbiAgICAgICAgLy8gICAgIHgxOiBkID0+IGQgKyAxMCxcbiAgICAgICAgLy8gICAgIHgyOiBkID0+IGQgKyAxMCxcbiAgICAgICAgLy8gICAgIHkxOiAwLFxuICAgICAgICAvLyAgICAgeTI6IG5vSXRlbXMgKiBsc1xuICAgICAgICAvLyB9KVxuXG5cbiAgICB9XG5cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi90cy92aXMvQ2xvc2VXb3JkTGlzdC50cyIsIi8qKlxuICogQ3JlYXRlZCBieSBoZW4gb24gNS8xNS8xNy5cbiAqL1xuZXhwb3J0IGNsYXNzIE5ldHdvcmtpbmcge1xuXG4gICAgLyoqXG4gICAgICogR2VuZXJhdGVzIGEgQWpheCBSZXF1ZXN0IG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gdGhlIGJhc2UgdXJsXG4gICAgICogQHJldHVybnMge3tnZXQ6IChmdW5jdGlvbigqPSkpLCBwb3N0OiAoZnVuY3Rpb24oKj0pKSwgcHV0OiAoZnVuY3Rpb24oKj0pKSwgZGVsZXRlOiAoZnVuY3Rpb24oKj0pKX19XG4gICAgICogIHRoZSBhamF4IG9iamVjdCB0aGF0IGNhbiBjYWxsIGdldCwgcG9zdCwgcHV0LCBkZWxldGUgb24gdGhlIHVybFxuICAgICAqL1xuICAgIHN0YXRpYyBhamF4X3JlcXVlc3QodXJsKTogeyBnZXQsIHBvc3QsIHB1dCwgZGVsZXRlIH0ge1xuXG4gICAgICAgIC8qIEFkYXB0ZWQgZnJvbTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvUHJvbWlzZVxuICAgICAgICAgKiBFWEFNUExFOlxuXG4gICAgICAgICB2YXIgbWRuQVBJID0gJ2h0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL3NlYXJjaC5qc29uJztcbiAgICAgICAgIHZhciBwYXlsb2FkID0ge1xuICAgICAgICAgJ3RvcGljJyA6ICdqcycsXG4gICAgICAgICAncScgICAgIDogJ1Byb21pc2UnXG4gICAgICAgICB9O1xuXG4gICAgICAgICB2YXIgY2FsbGJhY2sgPSB7XG4gICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICBjb25zb2xlLmxvZygxLCAnc3VjY2VzcycsIEpTT04ucGFyc2UoZGF0YSkpO1xuICAgICAgICAgfSxcbiAgICAgICAgIGVycm9yOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICBjb25zb2xlLmxvZygyLCAnZXJyb3InLCBKU09OLnBhcnNlKGRhdGEpKTtcbiAgICAgICAgIH1cbiAgICAgICAgIH07XG5cbiAgICAgICAgIC8vIEV4ZWN1dGVzIHRoZSBtZXRob2QgY2FsbFxuICAgICAgICAgJGh0dHAobWRuQVBJKVxuICAgICAgICAgLmdldChwYXlsb2FkKVxuICAgICAgICAgLnRoZW4oY2FsbGJhY2suc3VjY2VzcylcbiAgICAgICAgIC5jYXRjaChjYWxsYmFjay5lcnJvcik7XG5cbiAgICAgICAgIC8vIEV4ZWN1dGVzIHRoZSBtZXRob2QgY2FsbCBidXQgYW4gYWx0ZXJuYXRpdmUgd2F5ICgxKSB0byBoYW5kbGUgUHJvbWlzZSBSZWplY3QgY2FzZVxuICAgICAgICAgJGh0dHAobWRuQVBJKVxuICAgICAgICAgLmdldChwYXlsb2FkKVxuICAgICAgICAgLnRoZW4oY2FsbGJhY2suc3VjY2VzcywgY2FsbGJhY2suZXJyb3IpO1xuXG4gICAgICAgICAqL1xuXG4gICAgICAgIC8vIE1ldGhvZCB0aGF0IHBlcmZvcm1zIHRoZSBhamF4IHJlcXVlc3RcbiAgICAgICAgY29uc3QgYWpheCA9IChtZXRob2QsIF91cmwsIGFyZ3MpID0+IHtcblxuICAgICAgICAgICAgLy8gQ3JlYXRpbmcgYSBwcm9taXNlXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgLy8gSW5zdGFudGlhdGVzIHRoZSBYTUxIdHRwUmVxdWVzdFxuICAgICAgICAgICAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgICAgIGxldCB1cmkgPSBfdXJsO1xuXG4gICAgICAgICAgICAgICAgaWYgKGFyZ3MgJiYgKG1ldGhvZCA9PT0gJ1BPU1QnIHx8IG1ldGhvZCA9PT0gJ0dFVCcgfHwgbWV0aG9kID09PSAnUFVUJykpIHtcbiAgICAgICAgICAgICAgICAgICAgdXJpICs9ICc/JztcbiAgICAgICAgICAgICAgICAgICAgYXJncy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJpICs9ICcmJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmkgKz0gZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gRGVidWc6IGNvbnNvbGUubG9nKCdVUkknLCB1cmksIGFyZ3MpO1xuICAgICAgICAgICAgICAgIGNsaWVudC5vcGVuKG1ldGhvZCwgdXJpKTtcbiAgICAgICAgICAgICAgICBjbGllbnQuc2VuZCgpO1xuICAgICAgICAgICAgICAgIGNsaWVudC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBlcmZvcm1zIHRoZSBmdW5jdGlvbiBcInJlc29sdmVcIiB3aGVuIHRoaXMuc3RhdHVzIGlzIGVxdWFsIHRvIDJ4eFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBlcmZvcm1zIHRoZSBmdW5jdGlvbiBcInJlamVjdFwiIHdoZW4gdGhpcy5zdGF0dXMgaXMgZGlmZmVyZW50IHRoYW4gMnh4XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QodGhpcy5zdGF0dXNUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY2xpZW50Lm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCh0aGlzLnN0YXR1c1RleHQpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEFkYXB0ZXIgcGF0dGVyblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ2dldCc6IGFyZ3MgPT4gYWpheCgnR0VUJywgdXJsLCBhcmdzKSxcbiAgICAgICAgICAgICdwb3N0JzogYXJncyA9PiBhamF4KCdQT1NUJywgdXJsLCBhcmdzKSxcbiAgICAgICAgICAgICdwdXQnOiBhcmdzID0+IGFqYXgoJ1BVVCcsIHVybCwgYXJncyksXG4gICAgICAgICAgICAnZGVsZXRlJzogYXJncyA9PiBhamF4KCdERUxFVEUnLCB1cmwsIGFyZ3MpXG4gICAgICAgIH07XG5cblxuICAgIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi90cy9ldGMvTmV0d29ya2luZy50cyJdLCJzb3VyY2VSb290IjoiIn0=