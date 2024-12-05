/**
 * @file GameFieldItem.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

import { _decorator, Component, Vec3, tween, Node, EventTouch, UITransform, CCString, CCBoolean } from "cc";
const { ccclass, property } = _decorator;

/**
 * Represents an individual item in the game field.
 * This class handles the visual representation and behavior of game pieces
 * that can be matched, cleared, or affected by various game tools.
 */
@ccclass('GameFieldItem')
export class GameFieldItem extends Component {
    public static readonly COMPONENT_NAME: string = 'GameFieldItem';
    public static readonly CLICKED_EVENT: string = 'item-clicked';
    
    /**
     * The type of the item.
     */
    @property({
        type: CCString,
        tooltip: 'The type identifier for this game item'
    })
    public ItemType: string = "";
    /**
     * Flag indicating if the item is a booster.
     */
    @property({
        type: CCBoolean,
        tooltip: 'Indicates if this item is a booster type'
    })
    public IsBooster: boolean = false;
    
    private _isInteractable: boolean = true;

    /**
     * Moves the item to a specified position over a duration.
     * @param x The x-coordinate of the target position
     * @param y The y-coordinate of the target position
     * @param duration The time it takes to move to the target position
     * @param delay The delay before starting the movement
     */
    public async moveToPosition(x: number, y: number, duration: number, delay: number = 0): Promise<void> {
        return new Promise<void>((resolve) => {
            tween(this.node)
                .delay(delay)
                .to(duration, { position: new Vec3(x, y, 0) })
                .call(() => resolve())
                .start();
        });
    }
    
    /**
     * Called when the component is loaded.
     */
    onLoad() {
        // Add click event listener
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
    }

    /**
     * Handles the click event on the item.
     * @param event The touch event
     */
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
                this.node.emit(GameFieldItem.CLICKED_EVENT, this); 
            }
        }
    }
}