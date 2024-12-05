import { GameFieldItem } from "../../../../GameField/GameFieldItem";
import { BaseState } from "../../../../Libs/StateMachine/BaseState";
import { GameContext } from "../../GameContext";

export class Row2RocketActivated extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'Row2RocketActivated';
    constructor() {
        super(Row2RocketActivated.STATE_NAME);
    }

    public async onEnter(context: GameContext): Promise<void> {
        console.log(`[GameState] Entering ${Row2RocketActivated.STATE_NAME}`);

        const items = context.items;
        const cluster: GameFieldItem[] = [];

        const selectedRow = context.selectedItem.position.y;
        
        for (let i = 0; i < items.length; i++) {
            for (let j = Math.max(0, selectedRow - 1); j <= Math.min(selectedRow + 1, items[i].length - 1); j++) {
                if (items[i][j]) {
                    cluster.push(items[i][j]);
                }
            }
        }

        context.currentCluster = cluster;

        console.log(`Row 2 Rocket activated: Selected ${cluster.length} items`);
    }
}   