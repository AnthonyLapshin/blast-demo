import { GameTool } from "../Game/EnumGameTool";

export interface IPlayerInventoryObserver {
    onInventoryChanged(tool: GameTool, amount: number): void;
}
