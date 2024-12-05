import { GameTool } from "../Game/EnumGameTool";
import { IPlayerInventoryObserver } from "./IPlayerInventoryObserver";

export interface IPlayerInventoryService {
    addObserver(observer: IPlayerInventoryObserver): void;
    removeObserver(observer: IPlayerInventoryObserver): void;
    getAmount(tool: GameTool): number;
    setAmount(tool: GameTool, amount: number): void;
    addAmount(tool: GameTool, amount: number): void;
    removeAmount(tool: GameTool, amount: number): boolean;
}