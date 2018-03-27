import {VComponent} from "./VisualComponent";
import * as d3 from "d3";
import {HierarchyPointNode} from "d3-hierarchy";
import {DefaultLinkObject} from "d3-shape";
import {SVGMeasurements} from "../etc/SVGplus";


export interface BeamTreeData {
    root: BeamTree,
    maxDepth: number
}

export interface BeamTree {
    children: BeamTree[]
    name: string
    topBeam?: boolean

}

type NodeType = HierarchyPointNode<BeamTree>;

export class BeamTreeVis extends VComponent<BeamTreeData> {
    protected options = {
        pos: {x: 0, y: 0},
        width: 600,
        height: 600
    };
    private textMeasure: SVGMeasurements;


    constructor(d3Parent, eventHandler?, options: {} = {}) {
        super(d3Parent, eventHandler);
        this.superInit(options, true)

    }

    protected _init() {

        this.textMeasure = new SVGMeasurements(this.base, 'node')

    }

    protected _render(renderData: BeamTree): void {
        const op = this.options;

        const root = d3.hierarchy(renderData, d => d.children);
        console.log(root, "--- root");

        const treeGen = d3.tree().size([op.height - 10, op.width - 100])


        const nodes = <NodeType[]> treeGen(root).descendants();
        const links = <NodeType[]> treeGen(root).descendants().slice(1);

        console.log(nodes, "--- nodes");
        const wordWidth = <{ [key: string]: number }>{};
        nodes.forEach(node => {
            const n = node.data.name;
            wordWidth[n] = this.textMeasure.textLength(n);
        })


        // bad habbit, but todo:
        this.layers.main.selectAll('g.node').remove();
        this.layers.bg.selectAll('.link').remove();


        let i = 0;
        let nodeEls = this.layers.main.selectAll('g.node')
            .data(nodes, function (d: any) {
                return d.id || (d.id = ++i);
            });

        // Enter any new modes at the parent's previous position.
        const nodeEnter = nodeEls.enter().append('g')
            .attr('class', 'node')
            .attr("transform", function (d) {
                return "translate(" + (d.y + 5) + "," + (d.x + 5) + ")";
            }).classed('topBeam', d => d.data.topBeam);


        // // Add Circle for the nodes
        // nodeEnter.append('circle')
        //     .attr('class', 'node')
        //     .attr('r', 3)
        //     .style("fill", function (d) {
        //         return "blue"; //d._children ? "lightsteelblue" : "#fff";
        //     }).append('title').text((d) => d.data.name);

        nodeEnter.append('rect').style('fill', 'white');
        nodeEnter.append('text')
            .attr('class', 'node_text')
            .styles({
                // 'text-anchor': 'middle',
                'dominant-baseline': "middle"
            });
        nodeEls = nodeEnter.merge(nodeEls);

        nodeEls.select('rect').attrs({
            x: -2,//d => -wordWidth[d.data.name] / 2 - 2,
            width: d => wordWidth[d.data.name] + 4,
            height: 6,
            y: -3
        });

        nodeEls.select('text')
            .text((d) => d.data.name);


        const linkGen = d3.linkHorizontal<any, { source: NodeType, target: NodeType }, NodeType>()
            .x(d => d.y + 5)
            .y(d => d.x + 5);


        let link = this.layers.bg.selectAll('.link')
            .data(links, (d: any) => d.id)

        const linkEnter = link.enter().append('path').attr('class', 'link')

        linkEnter.merge(link).attr('d', d => linkGen({
            source: d,
            target: d.parent
        })).classed('topBeam', d => d.data.topBeam)


    }

    protected _wrangle(data: BeamTreeData) {

        if (data.maxDepth>0){
            this.parent.attr('width', data.maxDepth * 90);
            this.options.width = data.maxDepth * 90;
        }

        return data.root;
    }

}