import ActionAPI from "./ActionAPI"
import { ActionInterface, ActionManagerInterface } from "./ActionInterface";
import { Graph, ShapeContent, Shape, GraphicsWithIndex, GraphCache } from "../common/Graph";
import { CreateShapeAction, DeleteShapeAction, CopyShapeAction, UpdateShapeAction } from "./Action"
import AppInterface from "../app/AppInterface";

class Manager {
    //protected _data: Graph;
    protected _currentData: Graph; //因为还是需要删除shape的时候 清空con
    protected _actionIndex: number;
    protected _actionList: Array<ActionInterface>
    public _app: AppInterface;

    constructor(app: AppInterface) {
        this._actionIndex = -1;
        this._actionList = [];
        this._app = app;
    }
    protected addAction(action: ActionInterface) {
        try {
            this._currentData = action.do(this._currentData);
        } catch (error) {
            console.log(error);
            return;
        }
        this._actionIndex++;
        this._actionList.splice(this._actionIndex); // delete the orig actions
        this._actionList.push(action);
    }
    unDo() {
        let index = this._actionIndex;
        let list = this._actionList;
        if (index === -1) {
            return;
        }
        let action = list[index];
        //this._currentData = action.unDo(data);
        this._actionIndex--;
        this._currentData = action.unDo(this._currentData);
    }

    reDo() {
        let index = this._actionIndex;
        let list = this._actionList;
        if (index === list.length - 1) {
            return;
        }
        let action = list[index + 1];
        this._actionIndex++;
        this._currentData = action.do(this._currentData);
    }
    emptyDoingList() {
        this._actionList = [];
    }
}

export default class ActionManager extends Manager implements ActionAPI, ActionManagerInterface {
    //启用编辑模式时 执行;保存后 是否清空修改记录？？
    init(data: Graph): void {
        //this._data = data;
        this._currentData = data; //编辑的原始数据
        this._actionIndex = -1; //当前的操作步骤
        this._actionList = []; //?? 记录的应该是 操作类型（添加／删除／修改），shapeIndex和修改前、后的shapedata
    }

    getCurrentData(): Graph {
        return this._currentData;
    }

    addShape(x: number, y: number, width: number, height: number) {
        let pointArr: Shape;
        pointArr = [[x, y], [x, y + height], [x + width, y + height], [x + width, y]];
        let action: ActionInterface = new CreateShapeAction(pointArr, this._app);
        this.addAction(action)
    };

    copyShape(index: string) {
        let action: ActionInterface = new CopyShapeAction(index, this._app);
        this.addAction(action);
    };

    deleteShape(index: string) {
        let action: ActionInterface = new DeleteShapeAction(index, this._app);
        this.addAction(action);
    };
    updateShape(shape: Shape, shapeIndex: string) {
        let action: ActionInterface = new UpdateShapeAction(shape, shapeIndex, this._app);
        this.addAction(action);
    };
    // addPoint(index: Array<number>) {

    // };


}
