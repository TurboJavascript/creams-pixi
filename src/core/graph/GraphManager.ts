import { GraphManagerInterface, EraserInterface, EditToolInterface } from "./GraphInterface";
import { Graph, ShapeContent, Shape, ShapeGraphics, GraphCache, Point, PointGraphics, SelectEnum, } from "../common/Graph";
import DragHelper from "./DragHelper";
import AppInterface from "../app/AppInterface";
import Eraser from "./Eraser"
import GraphDrawing from './GraphDrawing'
import ShadowShape from "./ShadowShape"
import EditTool from "./EditTool";
import { addColorFilter, deleteColorFilter } from "./DrawingHelper";

export default class GraphManager extends GraphDrawing implements GraphManagerInterface {
    private _extraLayer: PIXI.Container;
    private _backgroundLayer: PIXI.Container;
    private _eraser: EraserInterface;
    private _editTool: EditToolInterface;

    constructor(app: AppInterface) {
        super(app);

        this._backgroundLayer = new PIXI.Container();
        this._extraLayer = new PIXI.Container();
        this._extraLayer.visible = false;
        this._extraLayer.name = "extraLayer";
        this._extraLayer.interactive = true;

        this.graphContainer.addChildAt(this._backgroundLayer, 0);
        this.graphContainer.addChild(this._extraLayer);

        this.graphContainer.interactive = true;
        DragHelper(this.graphContainer);
        this._editTool = new EditTool(this._extraLayer);
        this._eraser = new Eraser(
            this._app.pixiApp.renderer.plugins.interaction,
            this._extraLayer,
            this._shapeLayer,
            this._editTool.erasePoints
        );
    }

    private _buildBackground(url: string) {
        let background = PIXI.Sprite.fromImage(url);
        background.alpha = 0.2;
        background.interactive = true;
        background.on('pointerdown', () => {
            this._app.stateManager.select(SelectEnum.None, []);
        });
        this._backgroundLayer.addChild(background);
    }

    private _focus() {
        // 进入选中状态，虚化shapeLayer
        this.graphContainer.interactive = false;
        this._extraLayer.visible = true;
        addColorFilter(this._shapeLayer);
    }

    private _blur() {
        // 释放选中状态，恢复shapeLayer
        this.graphContainer.interactive = true;
        this._extraLayer.visible = false;
        deleteColorFilter(this._shapeLayer);
    }

    setGraph(graph: Graph, cache: GraphCache): void {
        this._graphCache = cache;
        this._shapeLayer.removeChildren();
        this._buildBackground(cache.backgroundPic);
        for (let i = 0; i < graph.shapes.length; i++) {
            this.buildShapes(graph.shapes[i], i, cache.shapesContent[i]);
        }
    }

    setShapeContent(index: number, content?: ShapeContent): void {
        let shape: Shape = this._app.actionManager.getCurrentShape(index);
        this.updateShapes(shape, index, content);
    }

    private _addLayer(shapeIndex: number, isDisplay: boolean) {
        const shape: Shape = this._app.actionManager.getCurrentShape(shapeIndex);
        const content: ShapeContent = this._graphCache.shapesContent[shapeIndex];
        this._editTool.init(shape, content, isDisplay);
        this._focus();
    }

    private _addHandler(shapeIndex: number) {
        this._editTool.addSelectHandler((state: SelectEnum, idx?: number) => {
            this._app.stateManager.select(state, [shapeIndex, idx]);
        });
        this._editTool.addUpdateHandler((shape: Shape) => {
            this._app.actionManager.updateShape(shape, shapeIndex);
        });
    }

    addDisplayLayer(isNeedInit: boolean, index: Array<number>): void {
        this._addLayer(index[0], true);
    }

    addEditLayer(
        isNeedInit: boolean,
        index: Array<number>,
        select: SelectEnum,
        eraser: boolean = false
    ): void {
        if (eraser) {
            this._eraser.enable();
        } else {
            this._eraser.disable();
        }
        if (isNeedInit) {
            this._addLayer(index[0], false);
            this._addHandler(index[0]);
        }
        this._editTool.select(select, index[1]);
    }

    removeLayer(): void {
        this._editTool.destroy();
        this._blur();
    }

    setEraserSize(size: number): void {
        this._eraser.setSize(size);
    }

    setShadowShape(width: number, height: number, content?: ShapeContent) {
        this._shadowShape.buildShadowShape(width, height, content);
    }

    deleteShadowShape() {
        this._shadowShape.destroyShadowShape();
    }
}
