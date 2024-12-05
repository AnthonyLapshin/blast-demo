/**
 * @file ToolToggleButton.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-06
 */

import { _decorator, Component, Node, Sprite, EventHandler, Label, CCBoolean, Enum,  } from 'cc';
import { GameTool } from '../Game/EnumGameTool';
import { GameContext } from '../Game/GameSM/GameContext';
import { inject } from '../Libs/Injects/inject';
import { IGameToolObserver } from '../Game/GameSM/States/Observers/IGameToolObserver';
import { IPlayerInventoryObserver } from '../Services/Interfaces/IPlayerInventoryObserver';
import { PlayerInventoryService } from '../Services/PlayerInventoryService';
import { IPlayerInventoryService } from '../Services/Interfaces/IPlayerInventoryService';
const { ccclass, property } = _decorator;

/**
 * A toggle button component for switching between different game tools.
 * This component provides functionality for displaying the current tool state,
 * handling toggle events, and notifying observers of state changes.
 */
@ccclass('ToggleButton')
export class ToolToggleButton extends Component implements IGameToolObserver, IPlayerInventoryObserver {

    private _gameContext: GameContext = inject(GameContext);
    private _playerInventory: IPlayerInventoryService = inject(PlayerInventoryService);

    /**
     * The sprite to display when the toggle is ON.
     */
    @property({
        type: Sprite,
        tooltip: 'Sprite to display when the toggle is in ON state'
    })
    private onSprite: Sprite | null = null;

    /**
     * The sprite to display when the toggle is OFF.
     */
    @property({
        type: Sprite,
        tooltip: 'Sprite to display when the toggle is in OFF state'
    })
    private offSprite: Sprite | null = null;

    /**
     * The current state of the toggle.
     */
    @property({
        type: CCBoolean,
        tooltip: 'Current state of the toggle button (ON/OFF)'
    })
    private _isOn: boolean = false;

    /**
     * Whether the toggle is enabled or disabled.
     */
    @property({
        type: CCBoolean,
        tooltip: 'Whether the toggle button is enabled and can be interacted with'
    })
    private _isEnabled: boolean = true;

    /**
     * The text field to display the amount of boosters.
     */
    @property({
        type: Label,
        tooltip: 'Label component for displaying the amount of available tools'
    })
    private label: Label | null = null;
    
    /**
     * The tool associated with the toggle.
     */
    @property({
        tooltip: 'The type of tool this button controls',
        visible:true
    })
    private _tool: string = '';
    
    /**
     * Event triggered when the toggle state changes.
     */
    @property({
        type: [EventHandler],
        tooltip: 'Event handlers to be called when the toggle state changes'
    })
    public onToggleChanged: EventHandler[] = [];


    /**
     * Event triggered when the button is enabled or disabled.
     */
    @property({
        type: [EventHandler],
        tooltip: 'Event handlers to be called when the enabled state changes'
    })
    public onEnabledChanged: EventHandler[] = [];


    /**
     * Sets the text displayed on the button.
     * @param text The text to display
     */
    public setText(text: string): void {
        if (this.label) {
            this.label.string = text;
        }
    }

    /**
     * Called when the game tool changes.
     * Updates the toggle state based on the new tool.
     * @param newTool The new game tool
     */
    public onToolChanged(newTool: GameTool): void {
        this._isOn = newTool == this._tool;
        this.updateVisuals();
    }
    
    /**
     * Gets the current toggle state.
     * @returns True if the button is toggled on, false otherwise
     */
    public get isOn(): boolean {
        return this._isOn;
    }

    /**
     * Sets the toggle state of the button.
     * @param value The new toggle state
     */
    public set isOn(value: boolean) {
        if (this._isOn !== value && this._isEnabled) {
            this._isOn = value;
            this.updateVisuals();
            this.notifyToggleObservers();
        }
    }

    /**
     * Gets whether the toggle is enabled or disabled.
     * @returns True if the button is enabled, false otherwise
     */
    public get isEnabled(): boolean {
        return this._isEnabled;
    }

    /**
     * Called when the component loads.
     * Initializes the toggle button and sets up event listeners.
     */
    protected onLoad(): void {
        this._gameContext.addToolObserver(this);
        this._playerInventory.addObserver(this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.updateVisuals();
    }

    /**
     * Called when the component is destroyed.
     * Removes event listeners and cleans up resources.
     */
    protected onDestroy(): void {
        this._gameContext.removeToolObserver(this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    /**
     * Called when the button is touched.
     * Toggles the button state if it is enabled.
     */
    private onTouchEnd(): void {
        if (this._isEnabled) {
            this.toggle();
        }
    }

    /**
     * Toggles the button state.
     */
    private toggle(): void {
        this.isOn = !this._isOn;
    }

    /**
     * Updates the visual state of the button based on the current toggle state.
     */
    private updateVisuals(): void {
        if (this.onSprite && this.offSprite) {
            this.onSprite.node.active = this._isOn && this._isEnabled;
            this.offSprite.node.active = !this._isOn && this._isEnabled;
        }
    }

    /**
     * Notifies observers of a toggle state change.
     */
    private notifyToggleObservers(): void {
        EventHandler.emitEvents(this.onToggleChanged, this, this._isOn);
    }

    /**
     * Called when the player's inventory changes.
     * Updates the button text if the changed tool matches the button's tool.
     * @param tool The changed tool
     * @param amount The new amount of the tool
     */
    onInventoryChanged(tool: GameTool, amount: number): void {
        if (tool == this._tool) {
            this.setText(amount.toString());
        }
    }
}
