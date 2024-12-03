export interface IGameStatsObserver {
    onScoreChanged(newScore: number): void;
    onMovesChanged(newMoves: number): void;
}