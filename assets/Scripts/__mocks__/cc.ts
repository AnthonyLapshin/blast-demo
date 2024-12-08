/**
 * Mock implementation of Cocos Creator (cc) module for testing purposes.
 * This file provides mock implementations of essential Cocos Creator classes and utilities
 * to enable testing without the actual Cocos Creator engine.
 */

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
export class Component {
    /** Reference to the Node this component is attached to */
    node: Node;

    /**
     * Adds a component to the node this component is attached to
     * @param type - Component type to add (class or string identifier)
     * @returns The newly created component instance
     */
    addComponent<T extends Component>(type: { new(): T } | string): T {
        const component = typeof type === 'string' ? new GameFieldItem() : new type();
        component.node = this.node;
        return component as T;
    }

    /**
     * Gets a component of the specified type from the node
     * @param type - Component type to get (class or string identifier)
     * @returns The found component instance or null if not found
     */
    getComponent<T extends Component>(type: { new(): T } | string): T {
        if (typeof type === 'string') {
            if (type === GameFieldItem.COMPONENT_NAME) {
                const component = new GameFieldItem();
                component.node = this.node;
                return component as unknown as T;
            }
            return null;
        }
        return new type();
    }
}

/**
 * Mock implementation of Cocos Creator Node class
 * Represents a node in the scene graph and handles:
 * - Component management
 * - Event system
 * - Scene graph operations (parent-child relationships)
 */
export class Node extends Component {
    /** List of components attached to this node */
    private _components: Component[] = [];
    /** Map of event listeners registered to this node */
    private _eventListeners: { [key: string]: { callback: Function; target: any }[] } = {};
    /** Node's position in 3D space */
    position = { x: 0, y: 0, z: 0 };

    constructor() {
        super();
        this.node = this;
    }

    /**
     * Adds a component to this node
     * @param type - Component type to add (class or string identifier)
     * @returns The newly created component instance
     */
    addComponent<T extends Component>(type: { new(): T } | string): T {
        const component = typeof type === 'string' ? new GameFieldItem() : new type();
        component.node = this;
        this._components.push(component);
        return component as T;
    }

    /**
     * Gets a component of the specified type from this node
     * @param type - Component type to get (class or string identifier)
     * @returns The found component instance or null if not found
     */
    getComponent<T extends Component>(type: { new(): T } | string): T {
        if (typeof type === 'string') {
            if (type === GameFieldItem.COMPONENT_NAME) {
                const existingComponent = this._components.find(c => c instanceof GameFieldItem);
                if (existingComponent) {
                    return existingComponent as unknown as T;
                }
                const component = new GameFieldItem();
                component.node = this;
                this._components.push(component);
                return component as unknown as T;
            }
            return null;
        }
        const component = this._components.find(c => c instanceof type);
        return component as T || null;
    }

    /**
     * Sets the node's position in 3D space
     * @param x - X coordinate
     * @param y - Y coordinate
     * @param z - Z coordinate (optional, defaults to 0)
     */
    setPosition(x: number, y: number, z: number = 0) {
        this.position = { x, y, z };
    }

    /**
     * Adds a child node to this node
     * @param child - Node to add as a child
     */
    addChild(child: Node) {
        // Mock implementation
    }

    /**
     * Registers an event listener
     * @param event - Event name to listen for
     * @param callback - Function to call when event is emitted
     * @param target - Object to use as 'this' when calling the callback
     */
    on(event: string, callback: Function, target: any) {
        if (!this._eventListeners[event]) {
            this._eventListeners[event] = [];
        }
        this._eventListeners[event].push({ callback, target });
    }

    /**
     * Removes an event listener
     * @param event - Event name
     * @param callback - Function to remove
     * @param target - Target object used when registering the listener
     */
    off(event: string, callback: Function, target: any) {
        if (this._eventListeners[event]) {
            const index = this._eventListeners[event].findIndex(
                listener => listener.callback === callback && listener.target === target
            );
            if (index !== -1) {
                this._eventListeners[event].splice(index, 1);
            }
        }
    }

    /**
     * Emits an event to all registered listeners
     * @param event - Event name to emit
     * @param data - Data to pass to the listeners
     */
    emit(event: string, data: any) {
        if (this._eventListeners[event]) {
            this._eventListeners[event].forEach(({ callback, target }) => {
                callback.call(target, data);
            });
        }
    }
}

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
        this.contentSize = { width, height };
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
    
    node: Node;
    type: number;
    fieldX: number;
    fieldY: number;
    
    constructor() {
        super();
        this.type = 1;
        this.fieldX = 0;
        this.fieldY = 0;
    }
}

/**
 * Mock implementation of instantiate function
 * Creates a new node instance from a prefab
 */
export const instantiate = jest.fn().mockImplementation((original: Prefab): Node => {
    const node = new Node();
    const gameFieldItem = node.addComponent(GameFieldItem.COMPONENT_NAME) as GameFieldItem;
    gameFieldItem.node = node;
    node.addComponent(UITransform);
    return node;
});

/**
 * Mock implementation of Vec3 utility
 * Provides common vector operations and constants
 */
export const Vec3 = {
    ZERO: { x: 0, y: 0, z: 0 }
};

/**
 * Mock implementation of tween function
 * Creates a chainable animation sequence
 */
export function tween(target: any) {
    return ({
        to: jest.fn().mockReturnThis(),
        delay: jest.fn().mockReturnThis(),
        call: jest.fn().mockReturnThis()
    });
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
