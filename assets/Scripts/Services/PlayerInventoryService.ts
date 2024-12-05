import { GameTool } from "../Game/EnumGameTool";
import { singleton } from "../Libs/Injects/decorators/singleton";
import { IPlayerInventoryObserver } from "./Interfaces/IPlayerInventoryObserver";
import { IPlayerInventoryService } from "./Interfaces/IPlayerInventoryService";

/**
 * Service that manages the player's inventory of tools and items.
 * This service tracks the quantities of different tools the player has,
 * handles tool usage, and notifies observers of inventory changes.
 */
@singleton()
export class PlayerInventoryService implements IPlayerInventoryService {
    /** Map storing the quantity of each tool type */
    private readonly _items: Map<GameTool, number> = new Map();
    /** Set of observers to notify of inventory changes */
    private readonly _observers: Set<IPlayerInventoryObserver> = new Set();

    constructor() {
        this._items.set(GameTool.BOMB_1, 10);
        this._items.set(GameTool.BOMB_2, 5);
    }

    /**
     * Adds an observer to be notified of inventory changes.
     * @param observer The observer to add
     */
    public addObserver(observer: IPlayerInventoryObserver): void {
        this._observers.add(observer);
        this._items.forEach((amount, tool) => {
            observer.onInventoryChanged(tool, amount);
        });
    }

    /**
     * Removes an observer from the notification list.
     * @param observer The observer to remove
     */
    public removeObserver(observer: IPlayerInventoryObserver): void {
        this._observers.delete(observer);
    }

    /**
     * Gets the amount of a specific tool in the inventory.
     * @param tool The tool to check
     * @returns The quantity of the tool
     */
    public getAmount(tool: GameTool): number {
        return this._items.get(tool) || 0;
    }

    /**
     * Sets the amount of a specific tool in the inventory.
     * @param tool The tool to set
     * @param amount The new amount
     */
    public setAmount(tool: GameTool, amount: number): void {
        this._items.set(tool, amount);
        this.notifyObservers(tool, amount);
    }

    /**
     * Adds a specified amount of a tool to the inventory.
     * @param tool The tool to add
     * @param amount The amount to add
     */
    public addAmount(tool: GameTool, amount: number): void {
        const currentAmount = this.getAmount(tool);
        this.setAmount(tool, currentAmount + amount);
    }

    /**
     * Removes a specified amount of a tool from the inventory.
     * @param tool The tool to remove
     * @param amount The amount to remove
     * @returns True if the removal was successful, false if not enough tools
     */
    public removeAmount(tool: GameTool, amount: number): boolean {
        const currentAmount = this.getAmount(tool);
        if (currentAmount >= amount) {
            this.setAmount(tool, currentAmount - amount);
            return true;
        }
        return false;
    }

    /**
     * Notifies all observers that a tool's amount has changed.
     * @param tool The tool that changed
     * @param amount The new amount
     */
    private notifyObservers(tool: GameTool, amount: number): void {
        this._observers.forEach(observer => {
            observer.onInventoryChanged(tool, amount);
        });
    }
}