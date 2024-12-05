import { _decorator} from "cc";
const { ccclass, property } = _decorator;

/**
 * Class representing padding values for UI elements.
 * This class provides a structured way to define and manage padding values
 * for top, bottom, left, and right sides of UI components.
 */
@ccclass('Paddings')
export class Paddings {
    /** Padding value for the left side */
    @property({ 
        visible: true, 
        serializable: true,
        tooltip: 'Padding value for the left side of the UI element'
    })
    private _left: number = 0;
    /** Padding value for the bottom side */
    @property({ 
        visible: true, 
        serializable: true,
        tooltip: 'Padding value for the bottom side of the UI element'
    })
    private _bottom: number = 0;
    /** Padding value for the right side */
    @property({ 
        visible: true, 
        serializable: true,
        tooltip: 'Padding value for the right side of the UI element'
    })
    private _right: number = 0;
    /** Padding value for the top side */
    @property({ 
        visible: true, 
        serializable: true,
        tooltip: 'Padding value for the top side of the UI element'
    })
    private _top: number = 0;

    /**
     * Creates a new Paddings instance.
     */
    constructor() {
        this.left = 0;
        this.right = 0;
        this.top = 0;
        this.bottom = 0;
    }

    /**
     * Gets the left padding value.
     * @returns The left padding value
     */
    public get left(): number {
        return this._left;
    }

    /**
     * Sets the left padding value.
     * @param value The new left padding value
     */
    public set left(value: number) {
        this._left = value;
    }
    
    /**
     * Gets the right padding value.
     * @returns The right padding value
     */
    public get right(): number {
        return this._right;
    }
    /**
     * Sets the right padding value.
     * @param value The new right padding value
     */
    public set right(value: number) {
        this._right = value;
    }
    
    /**
     * Gets the top padding value.
     * @returns The top padding value
     */
    public get top(): number {
        return this._top;
    }
    /**
     * Sets the top padding value.
     * @param value The new top padding value
     */
    public set top(value: number) {
        this._top = value;
    }
    
    /**
     * Gets the bottom padding value.
     * @returns The bottom padding value
     */
    public get bottom(): number {
        return this._bottom;
    }
    /**
     * Sets the bottom padding value.
     * @param value The new bottom padding value
     */
    public set bottom(value: number) {
        this._bottom = value;
    }

    /**
     * Creates a copy of the current Paddings instance.
     * @returns A new Paddings instance with the same values
     */
    public clone(): Paddings {
        const paddings = new Paddings();
        paddings.left = this.left;
        paddings.right = this.right;
        paddings.top = this.top;
        paddings.bottom = this.bottom;
        return paddings;
    }
}