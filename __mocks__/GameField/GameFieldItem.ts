import { Component, Node, _decorator, Vec3, tween, UITransform, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameFieldItem')
export class GameFieldItem extends Component {
    static readonly COMPONENT_NAME: string = 'GameFieldItem';
    static readonly CLICKED_EVENT: string = 'item-clicked';
    
    ItemType: string = '1';
    IsBooster: boolean = false;
    fieldX: number = 0;
    fieldY: number = 0;
    private _isInteractable: boolean = true;

    constructor() {
        super();
        this._node = new Node();
    }

    async moveToPosition(x: number, y: number, duration: number, delay: number = 0): Promise<void> {
        return Promise.resolve();
    }

    onLoad() {
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
    }

    onClick(event: EventTouch) {
        if (!this._isInteractable) return;

        const location = event.getUILocation();
        const transform = this.node.getComponent(UITransform);
        
        if (transform) {
            const size = transform.contentSize;
            const pos = this.node.position;

            if (location.x >= pos.x - size.width / 2 &&
                location.x <= pos.x + size.width / 2 &&
                location.y >= pos.y - size.height / 2 &&
                location.y <= pos.y + size.height / 2) {
                this.node.emit(GameFieldItem.CLICKED_EVENT, this);
            }
        }
    }
}
