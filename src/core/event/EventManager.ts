// 绑定传入事件
import EventAPI, { CallbackFunc, Events } from "./EventAPI"
import { ShapeGraphics, LineGraphics, EditEnum, SelectEnum } from "../common/Graph"
import AppInterface from "../app/AppInterface";
import { EventFunc, EventManagerInterface } from "./EventInterface";


class EventAPIManager implements EventAPI {
    protected _events: Events;
    protected _app: AppInterface;
    protected _editState: EditEnum = EditEnum.Nomal;//state change

    onClickGraph(callback: CallbackFunc): void {
        this._events.clickGraph = callback;
        this._bindClickGraph();
    };

    onMouseEnterShape(callback: CallbackFunc): void {
        this._events.mouseEnterShape = callback;
        this._initBindShape(callback, "mouseover");
    };

    onMouseLeaveShape(callback: CallbackFunc): void {
        this._events.mouseLeaveShape = callback;
        this._initBindShape(callback, "mouseout");
    };

    onMouseDownShape(callback: CallbackFunc): void {
        this._events.mouseDownShape = callback;
        this._initBindShape(callback, "mousedown");
    };

    onMouseDownLine(callback: CallbackFunc): void {
        this._events.mouseDownLine = callback;
        // 初始化的时候没有边
    };
    // 初始化绑定shape
    private _initBindShape(callback: CallbackFunc, event: string) {
        let shapeLayer: PIXI.Container = <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("shapeLayer");
        shapeLayer.children.forEach((item: ShapeGraphics, index: number) => {
            item.on(event, this._bindShapeFunc(callback, item));
        })
    }
    // shape的绑定事件的回调
    protected _bindShapeFunc(callback: CallbackFunc, target: ShapeGraphics): Function {
        return (event: PIXI.interaction.InteractionEvent) => {
            callback([target.shapeIndex], {
                x: event.data.global.x,
                y: event.data.global.y,
                target: {
                    xMin: target.xMin,
                    xMax: target.xMax,
                    yMin: target.yMin,
                    yMax: target.yMax
                }
            }, this._editState)
        }
    }
    // line的绑定事件的回调
    protected _bindLineFunc(callback: CallbackFunc, target: LineGraphics): Function {
        let index: number = Number(target.name.substring(5));
        return (event: PIXI.interaction.InteractionEvent) => {
            callback([index], {
                x: event.data.global.x,
                y: event.data.global.y
            }, this._editState)
        }
    }
    // 绑定graph
    protected _bindClickGraph(): void {
        this._app.graphManager.graphContainer.on("click", (event: PIXI.interaction.InteractionEvent) => {
            this._events.clickGraph([], {
                x: event.data.global.x,
                y: event.data.global.y
            }, this._editState)
        })
    };
    // 绑定一个shape的所有事件
    protected _bindShapes() {
        let shapeLayer: PIXI.Container = <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("shapeLayer");
        shapeLayer.children.forEach((item: ShapeGraphics, index: number) => {
            item.on('mouseover', this._bindShapeFunc(this._events.mouseEnterShape, item))
                .on('mouseout', this._bindShapeFunc(this._events.mouseLeaveShape, item))
                .on('mousedown', this._bindShapeFunc(this._events.mouseDownShape, item));
        })
    }


}

export default class EventManager extends EventAPIManager implements EventManagerInterface {
    constructor(app: AppInterface) {
        super();
        this._app = app;
        //初始化_events
        this._events = {
            clickGraph: () => { },
            mouseEnterShape: () => { },
            mouseLeaveShape: () => { },
            mouseDownShape: () => { },
            mouseDownLine: () => { },
        }
    }

    setEditState(state: EditEnum): void {
        this._editState = state;
    }

    bindAllHandler(): void {
        this._bindClickGraph();
        this._bindShapes();
    }

    bindHandler(selectType: SelectEnum, target: PIXI.Graphics): void {
        switch (selectType) {
            case SelectEnum.Shape:
                target.on('mouseover', this._bindShapeFunc(this._events.mouseEnterShape, target))
                    .on('mouseout', this._bindShapeFunc(this._events.mouseLeaveShape, target))
                    .on('mousedown', this._bindShapeFunc(this._events.mouseDownShape, target));
                break;
            case SelectEnum.Line:
                target.on("mousedown", this._bindLineFunc(this._events.mouseDownLine, target));
                break;
            default:
                console.error("无法绑定该对象")
        }
    }


    //extraLayer： pointerdown的时候shapeLayer的时候出现extraLayer生成editShape
    // bindMouseUpShape(editType: EditEnum): void {
    //     let shapeLayer: PIXI.Container = <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("shapeLayer");
    //     shapeLayer.children.forEach((item: ShapeGraphics, index: number) => {
    //         let func: EventFunc = (event: PIXI.interaction.InteractionEvent) => {
    //             this._events.mouseUpShape([item.shapeIndex], {
    //                 x: event.data.global.x,
    //                 y: event.data.global.y
    //             }, editType)
    //         }
    //         item.off("mouseup", func).on("mouseup", func);
    //         let extraLayer: PIXI.Container = <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("extraLayer");
    //         let curGraph: ShapeGraphics = <ShapeGraphics>extraLayer.getChildByName("editShape");
    //         if (curGraph) {
    //             curGraph.off("mouseup", func).on("mouseup", func);
    //         }
    //     })
    // };

    //shapeLayer的shape pointerdown 才会有line point

}