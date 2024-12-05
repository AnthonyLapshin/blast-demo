import { _decorator, Component, Node, Sprite, EventHandler, Label, CCBoolean, Enum,  } from 'cc';
import { GameTool } from '../Game/EnumGameTool';
import { GameContext } from '../Game/GameSM/GameContext';
import { inject } from '../Libs/Injects/inject';
import { IGameToolObserver } from '../Game/GameSM/IGameToolObserver';
const { ccclass, property } = _decorator;

@ccclass('ToggleButton')
export class ToolToggleButton extends Component implements IGameToolObserver {

    private _gameContext: GameContext = inject(GameContext);

    @property({type: Sprite, tooltip: 'Sprite to display when toggle is ON'})
    private onSprite: Sprite | null = null;

    @property({type: Sprite, tooltip: 'Sprite to display when toggle is OFF'})
    private offSprite: Sprite | null = null;

    @property({type: CCBoolean, tooltip: 'Current state of the toggle'})
    private _isOn: boolean = false;

    @property({type: CCBoolean, tooltip: 'Whether the toggle is enabled or disabled'})
    private _isEnabled: boolean = true;

    @property({type: Label, tooltip: 'Text field to display amount of boosters'})
    private label: Label | null = null;
    
    @property({tooltip: 'Tool associated with the toggle', visible:true})
    private _tool: string = '';
    
    @property({
        type: [EventHandler],
        tooltip: 'Event triggered when toggle state changes'
    })
    public onToggleChanged: EventHandler[] = [];


    @property({
        type: [EventHandler],
        tooltip: 'Event triggered when button is enabled or disabled'
    })
    public onEnabledChanged: EventHandler[] = [];


    public setText(text: string): void {
        if (this.label) {
            this.label.string = text;
        }
    }

    public onToolChanged(newTool: GameTool): void {
        this._isOn = newTool == this._tool;
        this.updateVisuals();
    }

    
    public get isOn(): boolean {
        return this._isOn;
    }

    public set isOn(value: boolean) {
        if (this._isOn !== value && this._isEnabled) {
            this._isOn = value;
            this.updateVisuals();
            this.notifyToggleObservers();
        }
    }

    public get isEnabled(): boolean {
        return this._isEnabled;
    }

    protected onLoad(): void {
        this._gameContext.addToolObserver(this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.updateVisuals();
    }

    protected onDestroy(): void {
        this._gameContext.removeToolObserver(this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchEnd(): void {
        if (this._isEnabled) {
            this.toggle();
        }
    }

    private toggle(): void {
        this.isOn = !this._isOn;
    }

    private updateVisuals(): void {
        if (this.onSprite && this.offSprite) {
            this.onSprite.node.active = this._isOn && this._isEnabled;
            this.offSprite.node.active = !this._isOn && this._isEnabled;
        }
    }

    private notifyToggleObservers(): void {
        EventHandler.emitEvents(this.onToggleChanged, this, this._isOn);
    }
}
