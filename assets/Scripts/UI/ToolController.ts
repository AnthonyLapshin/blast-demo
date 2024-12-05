import { _decorator, Component } from 'cc';
import { GameContext } from '../Game/GameSM/GameContext';
import { inject } from '../Libs/Injects/inject';
import { GameTool } from '../Game/EnumGameTool';
const { ccclass, property } = _decorator;

@ccclass('ToolController')
export class ToolController extends Component {
    private _gameContext: GameContext = inject(GameContext);
    
    onBombClick() {
        this._gameContext.currentTool = 
        this._gameContext.currentTool == GameTool.BOMB_1 ? GameTool.SELECTOR : GameTool.BOMB_1;
    }

    onBigBombClick() {
        this._gameContext.currentTool = 
        this._gameContext.currentTool == GameTool.BOMB_2 ? GameTool.SELECTOR : GameTool.BOMB_2;
    }
}