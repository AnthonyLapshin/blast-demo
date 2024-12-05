/**
 * @file UserHud.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-06
 */

import { _decorator, Component, Label, ProgressBar, Node } from 'cc';
import { GameContext } from '../Game/GameSM/GameContext';
import { inject } from '../Libs/Injects/inject';
import { IGameStatsObserver } from '../Game/GameSM/States/Observers/IGameStatsObserver';
import { LevelConfigurationService } from '../Services/LevelConfiguration';
import { GameStateMachine } from '../Game/GameSM/GameSM';
import { IGameStateObserver } from '../Game/GameSM/States/Observers/IGameStateObserver';
const { ccclass, property } = _decorator;

/**
 * Component that manages the game's heads-up display (HUD).
 * This component displays and updates game information such as score,
 * remaining moves, progress bars, and game over states.
 */
@ccclass('UserHud')
/**
 * UserHud class is responsible for managing the game's heads-up display (HUD).
 * It displays and updates game information such as score, remaining moves, 
 * progress bars, and game over states.
 */
export class UserHud extends Component implements IGameStatsObserver, IGameStateObserver {
    /** Label displaying the current score */
    @property({
        type: Label,
        tooltip: 'Label component for displaying the current game score'
    })
    private scoreLabel: Label | null = null;

    /** Label displaying remaining moves */
    @property({
        type: Label,
        tooltip: 'Label component for displaying the remaining moves'
    })
    private movesLabel: Label | null = null;

    /** Progress bar showing score progress */
    @property({
        type: ProgressBar,
        tooltip: 'Progress bar component showing progress towards target score'
    })
    private scoreProgress: ProgressBar | null = null;

    /** Window shown when game is over */
    @property({
        type: Node,
        tooltip: 'Node containing the game over window UI'
    })
    private gameOverWindow: Node | null = null;

    /** Reference to the game context */
    private readonly _context: GameContext = inject(GameContext);
    /** Reference to the level configuration */
    private readonly _lvlConf: LevelConfigurationService = inject(LevelConfigurationService);
    /** Reference to the game state machine */
    private readonly _stateMachine: GameStateMachine = inject(GameStateMachine);

    /**
     * Called when the component starts.
     * Initializes the HUD and sets up observers.
     */
    start() {
        this._context.addObserver(this);
        this._stateMachine.addStateObserver(this);
        this.updateScore(0);
        this.updateMoves(0);
        if (this.gameOverWindow) {
            this.gameOverWindow.active = false;
        }
    }

    /**
     * Updates the score display.
     * @param score The new score value
     */
    private updateScore(score: number): void {
        if (this.scoreLabel) {
            this.scoreLabel.string = score.toString();
        }
        if (this.scoreProgress) {
            this.scoreProgress.progress = score / this._lvlConf.targetScore;
        }
    }

    /**
     * Updates the moves display.
     * @param moves The new moves value
     */
    private updateMoves(moves: number): void {
        if (this.movesLabel) {
            this.movesLabel.string = `${moves}/${this._lvlConf.maxMoves}`;
        }
    }

    /**
     * Called when the game score changes.
     * @param newScore The new score value
     */
    onScoreChanged(newScore: number): void {
        this.updateScore(newScore);
    }

    /**
     * Called when the number of moves changes.
     * @param newMoves The new moves value
     */
    onMovesChanged(newMoves: number): void {
        this.updateMoves(newMoves);
    }

    /**
     * Called when the game state changes.
     * Shows the game over window when appropriate.
     * @param newState The new game state
     */
    onStateChanged(newState: string): void {
        if (newState === 'GameOver' && this.gameOverWindow) {
            this.gameOverWindow.active = true;
        }
    }
}
