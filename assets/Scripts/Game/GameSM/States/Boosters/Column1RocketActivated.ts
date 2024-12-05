import { GameFieldItem } from "../../../../GameField/GameFieldItem";
import { BaseState } from "../../../../Libs/StateMachine/BaseState";
import { GameContext } from "../../GameContext";

export class Column1RocketActivated extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'Column1RocketActivated';
    constructor() {
        super(Column1RocketActivated.STATE_NAME);
    }

    public async onEnter(context: GameContext): Promise<void> {
        console.log(`[GameState] Entering ${Column1RocketActivated.STATE_NAME}`);
        
        const items = context.items;
        const cluster: GameFieldItem[] = [];
        
        const selectedColumn = context.selectedItem.position.x;
        for (let j = 0; j < items[0].length; j++) {
            if (items[selectedColumn][j]) {
                cluster.push(items[selectedColumn][j]);
            }
        }
        
        context.currentCluster = cluster;
        console.log(`Column 1 Rocket activated: Selected ${cluster.length} items`);
    }
}   