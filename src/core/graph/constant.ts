/*
 * @Author: xujiawen 
 * @Description: 常量
 * @Date: 2018-04-26 11:00:40 
 * @Last Modified by:   xujiawen 
 * @Last Modified time: 2018-04-26 11:00:40 
 */

import { ShapeContent, LineStyle } from "../common/Graph";

export const defultGraphStyle: ShapeContent = {
    backgroundAlpha: 0.3,
    backgroundColor: 0xD1D8DF,
    border: {
        lineWidth: 1,
        color: 0xA7ACB2,
        lineStyle: LineStyle.Solid
    },
    font: {
        fontSize: 14,
        fill: [0x000000]
    },
    content: "",
    hasMark: false,
    alpha: 1,
    interactive: true
    //shapeIndex: ""
}
