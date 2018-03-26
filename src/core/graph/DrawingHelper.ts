import { Shape, ShapeContent, Point } from "../common/Graph";
import { defultGraphStyle } from "./constant";

export function drawShape(graphics: PIXI.Graphics, shape: Shape, content: ShapeContent = defultGraphStyle) {
    graphics.removeChildren();
    // set a fill and line style
    graphics.beginFill(content.backgroundColor, content.alpha);
    graphics.lineStyle(content.border.lineWidth, content.border.color, 1);
    graphics.alpha = content.alpha; //透明度

    let xMin: number = shape[0][0], xMax: number = shape[0][0], yMin: number = shape[0][1], yMax: number = shape[0][1];
    // draw a shape
    graphics.moveTo(shape[0][0], shape[0][1]);
    for (let i = 1; i < shape.length; i++) {
        graphics.lineTo(shape[i][0], shape[i][1]);
        //查找shape的边界
        xMin = xMin > shape[i][0] ? shape[i][0] : xMin;
        xMax = xMax < shape[i][0] ? shape[i][0] : xMax;
        yMin = yMin > shape[i][1] ? shape[i][1] : yMin;
        yMax = yMax < shape[i][1] ? shape[i][1] : yMax;
    }
    graphics.lineTo(shape[0][0], shape[0][1]);
    graphics.endFill();

    //文字
    if (content.content) {
        let textStyle = new PIXI.TextStyle({
            fontSize: content.font.fontSize,
            fill: content.font.fill,//填充颜色
            wordWrap: true,
            wordWrapWidth: xMax - xMin,
            breakWords: true
        });
        let text = new PIXI.Text(content.content, textStyle);
        text.position.x = (xMin + xMax) / 2 - text.width / 2;
        text.position.y = (yMin + yMax) / 2 - text.height / 2;
        graphics.addChild(text);
    }
    //todo 隐藏超出部分 目前没找到方法
    // text.parent = graphics;//api parent 必须是container  x,y 相对于parent定位的

    //角标
    if (content.hasMark) {
        //根据右下角的点画一个三角形
        graphics.beginFill(content.backgroundColor, 1);
        graphics.lineStyle();
        graphics.moveTo(xMax - 20, yMax);
        graphics.lineTo(xMax, yMax);
        graphics.lineTo(xMax, yMax - 20);
        graphics.lineTo(xMax - 20, yMax);
        graphics.endFill();
    }

    return graphics
}
//line
export function buildLine(graphics: PIXI.Graphics, start: Point, end: Point) {
    graphics.lineStyle(4, 0xa7acb2, 1);
    graphics.moveTo(start[0], start[1]);
    graphics.lineTo(end[0], end[1]);
    graphics.endFill();
}

//point
export function buildPoint(graphics: PIXI.Graphics, point: Point) {
    graphics.beginFill(0x548f14, 1)
    graphics.drawCircle(0, 0, 3);
    graphics.x = point[0];
    graphics.y = point[1];
    graphics.endFill();
}