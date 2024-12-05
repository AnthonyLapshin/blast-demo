/**
 * @file IGameStatsObserver.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

/**
 * Interface for observing game statistics changes.
 * Implement this interface to receive notifications when game stats like score
 * and moves change during gameplay.
 */
export interface IGameStatsObserver {
    /**
     * Called when the game score changes.
     * @param newScore The updated score value
     */
    onScoreChanged(newScore: number): void;

    /**
     * Called when the number of moves changes.
     * @param newMoves The updated moves value
     */
    onMovesChanged(newMoves: number): void;
}