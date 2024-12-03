import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { SelectedItemData } from "../../Base/SelectedItemData";
import { GameContext } from "../GameContext";

export class GameIdle extends BaseState<GameContext>{
    public static readonly STATE_NAME: string = 'GameIdle';
    private _context: GameContext = null;
    constructor() {
        super(GameIdle.STATE_NAME);
    }

    public onEnter(context: GameContext): void {
        console.log(`[GameState] Entering ${GameIdle.STATE_NAME}`);
        context.gameNode.on(SelectedItemData.SELECTED_EVENT, this.onItemSelected, this);
        this._context = context;
    }

    public onExit(context: GameContext): void {
        context.gameNode.off(SelectedItemData.SELECTED_EVENT, this.onItemSelected, this);
    }

    private onItemSelected(event: SelectedItemData): void {
        console.log(`[GameState] Selected item at position [${event.position.x}, ${event.position.y}]`);
        this._context.selectedItem = event;
    }
}