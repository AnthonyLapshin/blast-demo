import { _decorator, Component, Vec3, tween, Node, EventTouch, UITransform, CCString, CCBoolean } from "cc";
const { ccclass, property } = _decorator;

@ccclass('GameFieldItem')
export class GameFieldItem extends Component {
    public static readonly COMPONENT_NAME: string = 'GameFieldItem';
    public static readonly CLICKED_EVENT: string = 'item-clicked';
    
    @property({type: CCString})
    public ItemType: string = "";
    @property({type: CCBoolean})
    public IsBooster: boolean = false;
    
    private _isInteractable: boolean = true;

    public async moveToPosition(x: number, y: number, duration: number, delay: number = 0): Promise<void> {
        return new Promise<void>((resolve) => {
            tween(this.node)
                .delay(delay)
                .to(duration, { position: new Vec3(x, y, 0) })
                .call(() => resolve())
                .start();
        });
    }
    
    onLoad() {
        // Add click event listener
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
    }

    onClick(event: EventTouch) {
        if (!this._isInteractable) 
            return;
        // Get click position in node space
        const location = event.getUILocation();
        const transform = this.node.getComponent(UITransform);
        
        if (transform) {
            const nodePos = transform.convertToNodeSpaceAR(new Vec3(location.x, location.y, 0));
            const size = transform.contentSize;
            
            // Check if click is within sprite bounds
            if (Math.abs(nodePos.x) <= size.width/2 && Math.abs(nodePos.y) <= size.height/2) {
                console.log('Clicked item type:', this.ItemType);
                this.node.emit( GameFieldItem.CLICKED_EVENT, this); 
            }
        }
    }
}