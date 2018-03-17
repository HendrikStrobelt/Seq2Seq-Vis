import {VComponent} from "./VisualComponent";
import * as d3 from "d3";
import {HierarchyPointNode} from "d3-hierarchy";
import {DefaultLinkObject} from "d3-shape";


export interface BeamTreeData {
    children: BeamTreeData[]
    name: string

}

type NodeType = HierarchyPointNode<BeamTreeData>;

export class BeamTreeVis extends VComponent<BeamTreeData> {
    protected options = {
        pos: {x: 0, y: 0},
        width: 600,
        height: 600
    };

    constructor(d3Parent, eventHandler?, options: {} = {}) {
        super(d3Parent, eventHandler);
        this.superInit(options, true)
    }

    protected _init() {
    }

    protected _render(renderData: BeamTreeData): void {
        const op = this.options;

        const root = d3.hierarchy(renderData, d => d.children);
        const treeGen = d3.tree().size([op.height - 10, op.width - 100])


        const nodes = <NodeType[]> treeGen(root).descendants();
        const links = <NodeType[]> treeGen(root).descendants().slice(1);


        // bad habbit, but todo:
        this.layers.main.selectAll('g.node').remove();
        this.layers.bg.selectAll('.link').remove();
        

        let i = 0;
        var node = this.layers.main.selectAll('g.node')
            .data(nodes, function (d: any) {
                return d.id || (d.id = ++i);
            });

        // Enter any new modes at the parent's previous position.
        var nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr("transform", function (d) {
                return "translate(" + (d.y + 5) + "," + (d.x + 5) + ")";
            })


        // // Add Circle for the nodes
        // nodeEnter.append('circle')
        //     .attr('class', 'node')
        //     .attr('r', 3)
        //     .style("fill", function (d) {
        //         return "blue"; //d._children ? "lightsteelblue" : "#fff";
        //     }).append('title').text((d) => d.data.name);

        nodeEnter.append('text')
            .attr('class', 'node_text')
            .styles({
                // 'text-anchor': 'middle',
                'dominant-baseline': "middle"
            })
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
        }))


    }

    protected _wrangle(data: BeamTreeData) {


        return data;
    }

}