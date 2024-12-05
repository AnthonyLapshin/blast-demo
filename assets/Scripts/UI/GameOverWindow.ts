import { _decorator, Component, Label, Node } from 'cc';
import { GameContext } from '../Game/GameSM/GameContext';
import { inject } from '../Libs/Injects/inject';
const { ccclass, property } = _decorator;

@ccclass('GameOverWindow')
export class GameOverWindow extends Component {
    private _gameContext: GameContext = inject(GameContext)
    @property({type: Label, visible: true})
    private _pointsLbl: Label = null;
    @property({type: Label, visible: true})
    private _movesLbl: Label = null;

    onEnable() {
        this._pointsLbl.string = this._gameContext.gameScore.toString();
        this._movesLbl.string = this._gameContext.gameMoves.toString();
    }
}

