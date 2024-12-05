/**
 * @file ToolController.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-06
 */

import { _decorator, Component } from 'cc';
import { GameContext } from '../Game/GameSM/GameContext';
import { inject } from '../Libs/Injects/inject';
import { GameTool } from '../Game/EnumGameTool';
const { ccclass } = _decorator;

/**
 * Component responsible for managing tool selection and control in the game.
 * This class handles the interaction between UI tool buttons and the game context,
 * managing tool selection, deselection, and tool-specific actions.
 */
@ccclass('ToolController')
export class ToolController extends Component {
    /** Reference to the game context for tool state management */
    private readonly _gameContext: GameContext = inject(GameContext);
    
    /**
     * Handles the click event for the regular bomb tool.
     * Selects or deselects the bomb tool based on current state.
     */
    public onBombClick(): void {
        this._gameContext.currentTool = 
        this._gameContext.currentTool == GameTool.BOMB_1 ? GameTool.SELECTOR : GameTool.BOMB_1;
    }

    /**
     * Handles the click event for the big bomb tool.
     * Selects or deselects the big bomb tool based on current state.
     */
    public onBigBombClick(): void {
        this._gameContext.currentTool = 
        this._gameContext.currentTool == GameTool.BOMB_2 ? GameTool.SELECTOR : GameTool.BOMB_2;
    }
}