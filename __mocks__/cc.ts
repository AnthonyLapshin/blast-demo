/**
 * Mock implementation of Cocos Creator (cc) module.
 * Provides basic functionality needed for testing.
 */

import { GameFieldItem } from '../assets/Scripts/GameField/GameFieldItem';

const createEmptyNode = () => ({
    getComponent: () => null,
    on: () => {},
    off: () => {},
    parent: null,
    addChild: () => {},
    removeFromParent: () => {},
    position: { x: 0, y: 0 },
    setPosition: () => {}
});

const createNodeWithComponent = () => {
    const mockGameFieldItem = new GameFieldItem();
    const node = createEmptyNode();
    node.getComponent = () => mockGameFieldItem;
    return node;
};

// Basic component implementation
const createComponent = () => ({});

// Conditional exports based on environment
export const Component = typeof jest !== 'undefined'
    ? jest.fn().mockImplementation(createComponent)
    : createComponent;

export const Node = typeof jest !== 'undefined'
    ? jest.fn().mockImplementation(createEmptyNode)
    : createEmptyNode;

export const instantiate = typeof jest !== 'undefined'
    ? jest.fn().mockImplementation(createNodeWithComponent)
    : createNodeWithComponent;

export const director = {
    getScene: typeof jest !== 'undefined'
        ? jest.fn().mockReturnValue({
            getChildByName: jest.fn()
        })
        : () => ({
            getChildByName: () => null
        })
};

/**
 * Mock implementation of Cocos Creator decorators
 * - ccclass: Class decorator for marking a class as a Cocos component
 * - property: Property decorator for exposing properties in the editor
 */
export const _decorator = {
    ccclass: () => (target: any) => target,
    property: (options?: any) => (target: any, key: string) => target
};

/**
 * Mock implementation of UITransform component
 * Handles the size and transformation properties of UI elements
 */
export class UITransform extends Component {
    contentSize = { width: 100, height: 100 };

    /**
     * Sets the content size of the UI element
     * @param width - Width in pixels
     * @param height - Height in pixels
     */
    setContentSize(width: number, height: number) {
        this.contentSize.width = width;
        this.contentSize.height = height;
    }
}

/**
 * Mock implementation of Prefab class
 * Used for instantiating pre-configured nodes
 */
export class Prefab {
    data: any;
}

/**
 * Mock implementation of GameFieldItem component
 * Represents an item in the game field with position and type
 */
export class GameFieldItem extends Component {
    static readonly COMPONENT_NAME: string = 'GameFieldItem';
    static readonly CLICKED_EVENT: string = 'item-clicked';

    ItemType: number;
    IsBooster: boolean;
    fieldX: number;
    fieldY: number;

    constructor() {
        super();
        this.ItemType = 1;
        this.IsBooster = false;
        this.fieldX = 0;
        this.fieldY = 0;
        this.node = new Node();
    }
}

/**
 * Mock implementation of tween function
 * Creates a chainable animation sequence
 * @param target - Target object to animate
 * @returns Tween object with chainable animation methods
 */
export function tween(target: any) {
    return {
        to: (duration: number, props: any) => ({
            start: () => {}
        })
    };
}

/**
 * Mock implementation of EventTouch class
 * Represents a touch event with the target node
 */
export class EventTouch {
    constructor(public target: Node) {}
}

/**
 * Mock implementations of CCString and CCBoolean
 * Used for property decorators in Cocos Creator
 */
export class CCString {}
export class CCBoolean {}
