import { _decorator, Component, Vec3, tween, Node, EventTouch, UITransform, CCString } from "cc";
const { ccclass, property } = _decorator;

@ccclass('GameFieldItem')
export class GameFieldItem extends Component {
    
    public targetX: number = 0;
    public targetY: number = 0;
    
    @property({type: CCString})
    public ItemType: string = "";

    private _isInteractable: boolean = true;

    public moveToPosition(x: number, y: number, duration: number = 0.5, delay: number = 0): void {
        this.targetX = x;
        this.targetY = y;
        
        // Disable interaction during animation
        this._isInteractable = false;
        
        tween(this.node)
            .delay(delay)
            .to(duration, { position: new Vec3(this.targetX, this.targetY, 0) })
            .call(() => {
                // Re-enable interaction after animation completes
                this._isInteractable = true;
            })
            .start();
    }
    
    onLoad() {
        // Add click event listener
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
    }

    onClick(event: EventTouch) {
        if (!this._isInteractable) return;

        // Get click position in node space
        const location = event.getUILocation();
        const transform = this.node.getComponent(UITransform);
        
        if (transform) {
            const nodePos = transform.convertToNodeSpaceAR(new Vec3(location.x, location.y, 0));
            const size = transform.contentSize;
            
            // Check if click is within sprite bounds
            if (Math.abs(nodePos.x) <= size.width/2 && Math.abs(nodePos.y) <= size.height/2) {
                console.log('Clicked item type:', this.ItemType);
                this.node.emit('item-clicked', this);
            }
        }
    }
}