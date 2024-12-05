import { GameTool } from "../../Game/EnumGameTool";

/**
 * Interface defining an observer for player inventory changes.
 * Implementers of this interface will be notified when changes occur
 * to the player's inventory of tools and items.
 */
export interface IPlayerInventoryObserver {
    /**
     * Called when the inventory changes for a specific tool.
     * @param tool The tool type that was changed
     * @param amount The new amount of the tool in the inventory
     */
    onInventoryChanged(tool: GameTool, amount: number): void;
}
