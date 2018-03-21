import * as d3 from "d3";

import '../../css/modalDialog.scss'
import {D3Sel} from "./LocalTypes";
import {SimpleEventHandler} from "./SimpleEventHandler";


export default class ModalDialog {

    static get events() {
        return {
            modalDialogCanceled: 'modalDialogCanceled',
            modalDialogSubmitted: 'modalDialogSubmitted'
        }
    }

    static open(rootNode: D3Sel, eventHandler: SimpleEventHandler, width = 300) {

        // Bind the buttons

        rootNode.selectAll('.uiCancel')
            .on('click', () => {
                ModalDialog.close(rootNode);
                eventHandler.trigger(ModalDialog.events.modalDialogCanceled, rootNode);
            });


        rootNode.selectAll('.uiSubmit')
            .on('click', () => {
                eventHandler.trigger(ModalDialog.events.modalDialogSubmitted, rootNode);
            });

        // Make it appear nicely :)

        d3.select('body').append('div')
            .attr('class', 'inactivator')
            .styles({opacity: 0})
            .transition().style('opacity', 0.5)

        rootNode.attr('hidden', null)
        const dialogHeight = rootNode.node().clientHeight;
        rootNode
            .raise()
            .style('width', `${width}px`)
            .style('opacity', 1)
            .style('top', `${-dialogHeight}px`)
            .style('left', `${(window.innerWidth - width) / 2}px`)


        rootNode.transition()
            .style('top', '5px')


    }

    static close(rootNode: D3Sel) {
        d3.selectAll('.inactivator').remove();

        const dialogHeight = rootNode.node().clientHeight;

        rootNode.transition()
        // .duration(2000)
            .style('top', `${-dialogHeight}px`)
            .style('opacity', 0)
            .on('end', function () {
                d3.select(this).attr('hidden', true)
            })
    }


}