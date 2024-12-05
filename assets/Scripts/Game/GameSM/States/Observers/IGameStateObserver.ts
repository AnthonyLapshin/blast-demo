/**
 * @file IGameStateObserver.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

/**
 * Interface for observing game state changes.
 * Implement this interface to receive notifications when the game state changes.
 */
export interface IGameStateObserver {
    /**
     * Called when the game state changes.
     * @param stateName The name of the new state
     */
    onStateChanged(stateName: string): void;
}