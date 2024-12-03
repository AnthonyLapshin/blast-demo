import { _decorator, Component, Label } from 'cc';
import { GameContext } from '../Game/GameSM/GameContext';
import { inject } from '../Libs/Injects/inject';
import { IGameStatsObserver } from '../Game/Base/IGameStatsObserver';

const { ccclass, property } = _decorator;

@ccclass('GameHUD')
export class GameHUD extends Component implements IGameStatsObserver {
    @property(Label)
    private scoreLabel: Label = null;

    @property(Label)
    private movesLabel: Label = null;

    private readonly _context: GameContext = inject(GameContext);

    protected start(): void {
        // Register as observer
        this._context.addObserver(this);
        
        // Initialize labels
        this.updateScore(this._context.gameScore);
        this.updateMoves(this._context.gameMoves);
    }

    protected onDestroy(): void {
        // Cleanup
        this._context.removeObserver(this);
    }

    public onScoreChanged(newScore: number): void {
        this.updateScore(newScore);
    }

    public onMovesChanged(newMoves: number): void {
        this.updateMoves(newMoves);
    }

    private updateScore(score: number): void {
        if (this.scoreLabel) {
            this.scoreLabel.string = `Score: ${score}`;
        }
    }

    private updateMoves(moves: number): void {
        if (this.movesLabel) {
            this.movesLabel.string = `Moves: ${moves}`;
        }
    }
}
