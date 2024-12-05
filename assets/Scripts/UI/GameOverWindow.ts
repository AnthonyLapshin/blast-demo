/**
 * @file GameOverWindow.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-06
 */

import { _decorator, Component, Node, Label } from 'cc';
import { GameContext } from '../Game/GameSM/GameContext';
import { inject } from '../Libs/Injects/inject';
const { ccclass, property } = _decorator;

/**
 * Component that manages the game over window display.
 */
@ccclass('GameOverWindow')
export class GameOverWindow extends Component {
    /** Reference to the game context */
    private readonly _gameContext: GameContext = inject(GameContext);

    /** Label displaying the final points */
    @property({
        type: Label,
        visible: true,
        tooltip: 'Label component for displaying the final score'
    })
    private _pointsLbl: Label = null;

    /** Label displaying the moves used */
    @property({
        type: Label,
        visible: true,
        tooltip: 'Label component for displaying the number of moves used'
    })
    private _movesLbl: Label = null;

    /**
     * Called when the component is enabled.
     * Updates the points and moves labels with the current game score and moves.
     */
    onEnable() {
        this._pointsLbl.string = this._gameContext.gameScore.toString();
        this._movesLbl.string = this._gameContext.gameMoves.toString();
    }
}
