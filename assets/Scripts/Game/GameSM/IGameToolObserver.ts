import { GameTool } from "../EnumGameTool";

export interface IGameToolObserver {
    onToolChanged(newTool: GameTool): void;   
}