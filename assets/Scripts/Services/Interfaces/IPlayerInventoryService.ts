import { GameTool } from "../../Game/EnumGameTool";
import { IPlayerInventoryObserver } from "../IPlayerInventoryObserver";

/**
 * Interface defining the service responsible for managing the player's inventory.
 * This service handles the tracking and modification of game tools and items
 * that the player has available for use during gameplay.
 */
export interface IPlayerInventoryService {
    /**
     * Gets the current amount of a specific tool in the inventory.
     * @param tool The tool type to check
     * @returns The quantity of the specified tool
     */
    getAmount(tool: GameTool): number;

    /**
     * Adds a specified amount of a tool to the inventory.
     * @param tool The tool type to add
     * @param amount The amount to add (default is 1)
     */
    addAmount(tool: GameTool, amount?: number): void;

    /**
     * Removes a specified amount of a tool from the inventory.
     * @param tool The tool type to remove
     * @param amount The amount to remove (default is 1)
     * @returns True if the removal was successful, false if there weren't enough tools
     */
    removeAmount(tool: GameTool, amount?: number): boolean;

    /**
     * Adds an observer to be notified of inventory changes.
     * @param observer The observer to add
     */
    addObserver(observer: IPlayerInventoryObserver): void;

    /**
     * Removes an observer from being notified of inventory changes.
     * @param observer The observer to remove
     */
    removeObserver(observer: IPlayerInventoryObserver): void;
}