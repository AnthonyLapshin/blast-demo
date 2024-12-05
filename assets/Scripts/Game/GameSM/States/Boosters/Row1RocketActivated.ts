import { GameFieldItem } from "../../../../GameField/GameFieldItem";
import { BaseState } from "../../../../Libs/StateMachine/BaseState";
import { GameContext } from "../../GameContext";

export class Row1RocketActivated extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'Row1RocketActivated';
    constructor() {
        super(Row1RocketActivated.STATE_NAME);
    }

    public async onEnter(context: GameContext): Promise<void> {
        console.log(`[GameState] Entering ${Row1RocketActivated.STATE_NAME}`);

        const items = context.items;
        const cluster: GameFieldItem[] = [];
        
        const selectedRow = context.selectedItem.position.y;
        for (let i = 0; i < items.length; i++) {
            if (items[i][selectedRow]) {
                cluster.push(items[i][selectedRow]);
            }
        }
        
        context.currentCluster = cluster;
        console.log(`Row 1 Rocket activated: Selected ${cluster.length} items`);
    }
}   