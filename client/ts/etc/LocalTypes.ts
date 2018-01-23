import * as d3 from "d3";

export type D3Sel = d3.Selection<any, any, any, any>;
// type dObj = { [k: string]: any };
export interface LooseObject {
    [key: string]: any
}