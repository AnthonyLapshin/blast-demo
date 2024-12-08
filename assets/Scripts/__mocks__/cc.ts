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
 * Base component class that all Cocos components inherit from
 * Provides basic component functionality like adding/getting components
 */
export const Component = jest.fn().mockImplementation(() => ({
    node: new Node()
}));

/**
 * Mock implementation of Cocos Creator Node class
 * Represents a node in the scene graph and handles:
 * - Component management
 * - Event system
 * - Scene graph operations (parent-child relationships)
 */
export const Node = jest.fn().mockImplementation(() => ({
    getComponent: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    parent: null,
    addChild: jest.fn(),
    removeFromParent: jest.fn(),
    _eventListeners: {},
    setPosition: jest.fn(),
    position: { x: 0, y: 0, z: 0 }
}));

/**
 * Mock implementation of instantiate function
 * Creates a new node instance from a prefab
 * @param prefab - Prefab to create instance from
 * @returns New node instance
 */
export const instantiate = jest.fn().mockImplementation((prefab) => {
    const node = new Node();
    const mockGameFieldItem = new GameFieldItem();
    mockGameFieldItem.node = node;
    node.getComponent = jest.fn().mockReturnValue(mockGameFieldItem);
    return node;
});

/**
 * Mock implementation of director
 * Provides access to the current scene and its children
 */
export const director = {
    getScene: jest.fn().mockReturnValue({
        getChildByName: jest.fn()
    })
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
