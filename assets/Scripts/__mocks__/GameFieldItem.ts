import { Node, Component } from 'cc';

/**
 * Mock implementation of GameFieldItem for testing purposes.
 * This class mocks the behavior of a game field item in the game grid.
 */
export class GameFieldItem {
    static COMPONENT_NAME = 'GameFieldItem';
    static CLICKED_EVENT = 'click';

    public ItemType: string;
    public IsBooster: boolean;
    public node: any;

    constructor() {
        this.ItemType = '1';
        this.IsBooster = false;
        this.node = null;
    }

    setType(type: string) {
        this.ItemType = type;
    }

    setBooster(isBooster: boolean) {
        this.IsBooster = isBooster;
    }
}
