import { GameTool } from "../Game/EnumGameTool";
import { singleton } from "../Libs/Injects/decorators/singleton";
import { IPlayerInventoryObserver } from "./IPlayerInventoryObserver";
import { IPlayerInventoryService } from "./IPlayerInventoryService";

@singleton()
export class PlayerInventoryService implements IPlayerInventoryService {
    private _items: Map<GameTool, number> = new Map<GameTool, number>();
    private _observers: Set<IPlayerInventoryObserver> = new Set();

    constructor() {
        this._items.set(GameTool.BOMB_1, 10);
        this._items.set(GameTool.BOMB_2, 5);
    }

    public addObserver(observer: IPlayerInventoryObserver): void {
        this._observers.add(observer);
        this._items.forEach((amount, tool) => {
            observer.onInventoryChanged(tool, amount);
        });
    }

    public removeObserver(observer: IPlayerInventoryObserver): void {
        this._observers.delete(observer);
    }

    public getAmount(tool: GameTool): number {
        return this._items.get(tool) || 0;
    }

    public setAmount(tool: GameTool, amount: number): void {
        this._items.set(tool, amount);
        this.notifyObservers(tool, amount);
    }

    public addAmount(tool: GameTool, amount: number): void {
        const currentAmount = this.getAmount(tool);
        this.setAmount(tool, currentAmount + amount);
    }

    public removeAmount(tool: GameTool, amount: number): boolean {
        const currentAmount = this.getAmount(tool);
        if (currentAmount >= amount) {
            this.setAmount(tool, currentAmount - amount);
            return true;
        }
        return false;
    }

    private notifyObservers(tool: GameTool, amount: number): void {
        this._observers.forEach(observer => {
            observer.onInventoryChanged(tool, amount);
        });
    }
}