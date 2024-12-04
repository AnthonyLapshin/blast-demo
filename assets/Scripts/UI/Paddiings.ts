import { _decorator} from "cc";
const { ccclass, property } = _decorator;

@ccclass('Paddings')
export class Paddings {
    @property({ visible: true, serializable: true })
    private _left: number = 0;
    @property({ visible: true, serializable: true })
    private _bottom: number = 0;
    @property({ visible: true, serializable: true })
    private _right: number = 0;
    @property({ visible: true, serializable: true })
    private _top: number = 0;

    constructor() {
        this.left = 0;
        this.right = 0;
        this.top = 0;
        this.bottom = 0;
    }

    public get left(): number {
        return this._left;
    }

    public set left(value: number) {
        this._left = value;
    }
    
    public get right(): number {
        return this._right;
    }
    public set right(value: number) {
        this._right = value;
    }
    
    public get top(): number {
        return this._top;
    }
    public set top(value: number) {
        this._top = value;
    }
    
    public get bottom(): number {
        return this._bottom;
    }
    public set bottom(value: number) {
        this._bottom = value;
    }

    public clone(): Paddings {
        const paddings = new Paddings();
        paddings.left = this.left;
        paddings.right = this.right;
        paddings.top = this.top;
        paddings.bottom = this.bottom;
        return paddings;
    }
}