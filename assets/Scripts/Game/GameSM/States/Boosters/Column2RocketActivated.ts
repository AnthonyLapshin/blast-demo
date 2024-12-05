import { GameFieldItem } from "../../../../GameField/GameFieldItem";
import { BaseState } from "../../../../Libs/StateMachine/BaseState";
import { GameContext } from "../../GameContext";

export class Column2RocketActivated extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'Column2RocketActivated';
    constructor() {
        super(Column2RocketActivated.STATE_NAME);
    }

    public async onEnter(context: GameContext): Promise<void> {
        console.log(`[GameState] Entering ${Column2RocketActivated.STATE_NAME}`);

        const items = context.items;
        const cluster: GameFieldItem[] = [];
        
        const selectedColumn = context.selectedItem.position.x;
        for (let j = 0; j < items[0].length; j++) {
            for (let i = Math.max(0, selectedColumn - 1); i <= Math.min(selectedColumn + 1, items.length - 1); i++) {
                if (items[i][j]) {
                    cluster.push(items[i][j]);
                }
            }
        }
        context.currentCluster = cluster;
        
        console.log(`Column 2 Rocket activated: Selected ${cluster.length} items`);
    }
}   