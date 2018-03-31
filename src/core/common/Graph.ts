// 基本数据结构，由opencv传过来的图形点阵。
// 点 x,y
export type Point = [number, number];
// 块
export type Shape = Array<Point>;
// 图
export type Graph = {
    shapes: Array<Shape>;
}

// 缓存数据结构，运行时的数据结构，用于展示。
// Shape样式
export type ShapeContent = {
    backgroundColor: number; // color
    border: {
        lineWidth: number,
        color: number,
        //alpha:number//默认为1
    }; // size, color, style
    font: {
        fontSize: number,
        fill: Array<string>,//填充颜色
    }; // size, color
    content: string; // 显示的文字内容
    hasMark?: boolean; // 是否需要角标
    alpha?: number; // 透明度
    //shapeIndex: String; //与Graph匹配
}

export interface GraphCache {
    // 每一个Shape的绘制样式
    backgroundPic: string;
    shapesContent?: Array<ShapeContent>;
}

// graph添加shapeIndex属性，用于识别graphContainer.children类型
export class ShapeGraphics extends PIXI.Graphics {
    public shapeIndex?: number; //第几个
    public xMin?: number;
    public xMax?: number;
    public yMin?: number;
    public yMax?: number;
}

export class LineGraphics extends PIXI.Graphics {
    public lineIndex?: number; // 第几个
    public startPoint?: Point; // 起点
    public endPoint?: Point; // 终点
}

export class PointGraphics extends PIXI.Graphics {
    public pointIndex?: number; // 第几个
    public point?: Point;
}

export enum EditEnum {
    Nomal = 'Nomal',
    Editing = 'Editing',
}

export enum SelectEnum {
    None = 'None',
    Shape = 'Shape',
    Line = 'Line',
    Point = 'Point',
}