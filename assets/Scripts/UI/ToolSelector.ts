/**
 * @file ToolSelector.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-06
 */

import { _decorator, Component, Node } from 'cc';
import { GameContext } from '../Game/GameSM/GameContext';
import { inject } from '../Libs/Injects/inject';
import { GameTool } from '../Game/EnumGameTool';
import { PlayerInventoryService } from '../Services/PlayerInventoryService';
import { IPlayerInventoryObserver } from '../Services/Interfaces/IPlayerInventoryObserver';
import { ToolToggleButton } from './ToolToggleButton';
import { IGameToolObserver } from '../Game/GameSM/States/Observers/IGameToolObserver';
const { ccclass, property } = _decorator;

/**
 * Component that manages the tool selection interface.
 * This component handles the selection and switching between different game tools,
 * maintaining the current tool state and notifying observers of changes.
 */
@ccclass('ToolSelector')
export class ToolSelector extends Component implements IPlayerInventoryObserver, IGameToolObserver {
    private _inventory: PlayerInventoryService = inject(PlayerInventoryService);
    
    @property({ type: ToolToggleButton, tooltip: 'Bomb button', visible: true })
    private _bombToggle: ToolToggleButton | null = null;
    
    @property({ type: ToolToggleButton, tooltip: 'Big bomb button', visible: true })
    private _bigBombToggle: ToolToggleButton | null = null;

    /**
     * Called when the component starts.
     * Initializes the tool selector and sets up observers.
     */
    start() {
        this._inventory.addObserver(this);   
    }

    /**
     * Called when the player's inventory changes.
     * Updates the tool toggle buttons to reflect the new inventory state.
     * @param tool The tool that changed in the inventory
     * @param amount The new amount of the tool in the inventory
     */
    onInventoryChanged(tool: GameTool, amount: number): void {
        if (tool === GameTool.BOMB_1) {
            this._bombToggle.setText(`${amount}`);
        }

        if (tool === GameTool.BOMB_2) {
            this._bigBombToggle.setText(`${amount}`);
        }
    }

    /**
     * Called when the bomb toggle button is toggled.
     * Checks if there are enough bombs in the inventory and updates the toggle state accordingly.
     */
    public onBombToggled() {
        if (this._inventory.getAmount(GameTool.BOMB_1) <= 0) {
            console.error('Not enough bombs');
            this._bombToggle.isOn = false;
            return;
        }
    }

    /**
     * Called when the big bomb toggle button is toggled.
     * Checks if there are enough bombs in the inventory and updates the toggle state accordingly.
     */
    public onBigBombToggled() {
        if (this._inventory.getAmount(GameTool.BOMB_1) <= 0) {
            console.error('Not enough bombs');
            this._bombToggle.isOn = false;
            return;
        }
    }

    /**
     * Called when the tool changes in the game context.
     * Updates the toggle buttons to reflect the new tool state.
     * @param newTool The newly selected tool
     */
    onToolChanged(newTool: GameTool): void {
        this._bombToggle.isOn = newTool == GameTool.BOMB_1;
        this._bigBombToggle.isOn = newTool == GameTool.BOMB_2;
    }
}
