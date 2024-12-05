/**
 * @file IGameToolObserver.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

import { GameTool } from "../../../EnumGameTool";

/**
 * Interface for observing game tool changes.
 * Implement this interface to receive notifications when the active game tool
 * (like selector, bomb, rocket, etc.) changes during gameplay.
 */
export interface IGameToolObserver {
    /**
     * Called when the active game tool changes.
     * @param newTool The newly selected game tool
     */
    onToolChanged(newTool: GameTool): void;
}