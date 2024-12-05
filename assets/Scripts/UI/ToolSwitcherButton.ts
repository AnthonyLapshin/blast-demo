/**
 * @file ToolSwitcherButton.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

import { GameTool } from "../Game/EnumGameTool";
import { GameContext } from "../Game/GameSM/GameContext";
import { IGameToolObserver } from "../Game/GameSM/States/Observers/IGameToolObserver";
import { inject } from "../Libs/Injects/inject";
import { ToolToggleButton } from "./ToolToggleButton";
import { _decorator } from 'cc';
const { ccclass } = _decorator;

/**
 * Component that manages a button for switching between different game tools.
 * This component handles the display and interaction of tool selection buttons,
 * including updating counts and handling click events.
 */
@ccclass('ToolSwitcherButton')
export class ToolSwitcherButton extends ToolToggleButton implements IGameToolObserver {

    /**
     * The game context associated with this button.
     */
    private _context: GameContext = inject(GameContext);
    
    /**
     * Called when the component starts.
     * Initializes the button and sets up game context observer.
     */
    protected onLoad(): void {
        super.onLoad();
        this._context.addToolObserver(this);
    }

    /**
     * Called when the tool changes in the game context.
     * @param newTool The newly selected tool
     */
    onToolChanged(newTool: GameTool): void {
        this.isOn = newTool == this.toggleValue();
    }

    /**
     * Returns the tool type associated with this button.
     * @returns The tool type
     */
    public toggleValue(): GameTool{
        throw new Error('Method not implemented.');
    };
}