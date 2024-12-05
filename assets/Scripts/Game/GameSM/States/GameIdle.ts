/**
 * @file GameIdle.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { SelectedItemData } from "../../Base/SelectedItemData";
import { GameTool } from "../../EnumGameTool";
import { GameContext } from "../GameContext";

/**
 * Represents the idle state of the game where the game is waiting for player input.
 * This is the default state where players can select items on the game field.
 */
export class GameIdle extends BaseState<GameContext>{
    public static readonly STATE_NAME: string = 'GameIdle';
    private _context: GameContext = null;
    /**
     * Creates a new instance of the GameIdle state.
     */
    constructor() {
        super(GameIdle.STATE_NAME);
    }

    /**
     * Handles entering the idle state.
     * Sets up event listeners for item selection and resets the current tool to selector.
     * @param context - The game context
     */
    public async onEnter(context: GameContext): Promise<void> {
        context.currentTool = GameTool.SELECTOR
        context.skipMove = false;
        context.gameNode.on(SelectedItemData.SELECTED_EVENT, this.onItemSelected, this);
        this._context = context;
    }

    /**
     * Handles exiting the idle state.
     * Removes event listeners for item selection.
     * @param context - The game context
     */
    public async onExit(context: GameContext): Promise<void> {
        context.gameNode.off(SelectedItemData.SELECTED_EVENT, this.onItemSelected, this);
    }

    /**
     * Handles the selection of an item on the game field.
     * Updates the game context with the selected item data.
     * @param event - Data about the selected item
     */
    private onItemSelected(event: SelectedItemData): void {
        this._context.selectedItem = event;
    }
}