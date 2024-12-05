import { _decorator, Component, Label, ProgressBar, Node } from 'cc';
import { GameContext } from '../Game/GameSM/GameContext';
import { inject } from '../Libs/Injects/inject';
import { IGameStatsObserver } from '../Game/GameSM/IGameStatsObserver';
import { LevelConfigurationService } from '../Services/LevelConfiguration';
import { GameStateMachine } from '../Game/GameSM/GameSM';
import { IGameStateObserver } from '../Game/GameSM/IGameStateObserver';

const { ccclass, property } = _decorator;

@ccclass('GameHUD')
export class GameHUD extends Component implements IGameStatsObserver, IGameStateObserver {

    @property(Label)
    private scoreLabel: Label = null;
    private _targetScore: number;

    @property(Label)
    private movesLabel: Label = null;

    @property({type: Node, visible: true})
    private gamveOverWindow: Node;

    private readonly _levelConfig: LevelConfigurationService = inject(LevelConfigurationService);
    private readonly _sm: GameStateMachine = inject(GameStateMachine);
    
    private readonly _context: GameContext = inject(GameContext);

    @property(ProgressBar)
    private progressBar: ProgressBar = null;

    protected start(): void {
        // Register as observer
        this._context.addObserver(this);
        this._sm.addStateObserver(this);
        this._targetScore = this._levelConfig.targetScore;
        
        // Initialize progress to 0
        this.updateProgress(0);

        // Initialize labels
        this.updateScore(this._context.gameScore);
        this.updateMoves(this._context.gameMoves);
    }

    onGameStateChanged(newState: string): void {
       if (newState == 'GameOver') {
            this.gamveOverWindow.active = true;
       }
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
            this.scoreLabel.string = `Score: ${score} / ${this._targetScore}`;
        }
        this.updateProgress(score)
    }

    private updateMoves(moves: number): void {
        if (this.movesLabel) {
            this.movesLabel.string = `${moves} / ${this._levelConfig.maxMoves}`;
        }
    }

    private updateProgress(currentScore: number): void {
        // Calculate progress as a value between 0 and 1
        const progress = Math.min(currentScore / this._targetScore, 1);
        this.progressBar.progress = progress;
    }
}
