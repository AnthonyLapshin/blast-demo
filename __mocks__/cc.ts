/**
 * Mock implementation of Cocos Creator (cc) module.
 * Provides basic functionality needed for testing.
 */

// Mock Node class with event types
export class Node {
    static EventType = {
        TOUCH_END: 'touch-end'
    };

    private _eventHandlers: Map<string, Array<{ callback: Function, target: any }>> = new Map();
    private _position = { x: 0, y: 0 };
    private _children: Node[] = [];
    parent: Node | null = null;
    
    constructor() {
        // Initialize mock methods in constructor to ensure they're spyable
        this.addChild = jest.fn((child: Node) => {
            this._children.push(child);
            child.parent = this;
        });
        this.removeFromParent = jest.fn(() => {
            if (this.parent) {
                const index = this.parent._children.indexOf(this);
                if (index !== -1) {
                    this.parent._children.splice(index, 1);
                }
                this.parent = null;
            }
        });
        this.getComponent = jest.fn().mockReturnValue(null);
    }
    
    on(eventName: string, callback: Function, target?: any): void {
        if (!this._eventHandlers.has(eventName)) {
            this._eventHandlers.set(eventName, []);
        }
        this._eventHandlers.get(eventName)?.push({ callback, target });
    }

    off(eventName: string, callback: Function, target?: any): void {
        const handlers = this._eventHandlers.get(eventName);
        if (handlers) {
            const index = handlers.findIndex(h => h.callback === callback && h.target === target);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        }
    }

    emit(eventName: string, ...args: any[]): void {
        const handlers = this._eventHandlers.get(eventName);
        if (handlers) {
            handlers.forEach(({ callback, target }) => {
                callback.apply(target, args);
            });
        }
    }

    get position() {
        return this._position;
    }

    setPosition(x: number, y: number, z: number = 0): void {
        this._position.x = x;
        this._position.y = y;
    }

    // These will be properly initialized in the constructor
    addChild!: jest.Mock;
    removeFromParent!: jest.Mock;
    getComponent!: jest.Mock;
}

// Mock Vec2 and Vec3 classes
export class Vec2 {
    constructor(public x: number = 0, public y: number = 0) {}
}

export class Vec3 {
    constructor(public x: number = 0, public y: number = 0, public z: number = 0) {}
}

// Basic component implementation
export class Component {
    protected _node: Node;

    constructor() {
        this._node = new Node();
    }

    get node(): Node {
        return this._node;
    }

    set node(value: Node) {
        this._node = value;
    }
}

// Mock instantiate function
export const instantiate = jest.fn((prefab) => {
    const node = new Node();
    if (prefab && prefab.data) {
        node.getComponent = jest.fn().mockReturnValue(prefab.data.getComponent());
    }
    return node;
});

// Mock director
export const director = {
    getScene: jest.fn().mockReturnValue({
        getChildByName: jest.fn()
    })
};

// Mock decorators
export const _decorator = {
    ccclass: (name?: string) => (constructor: any) => constructor,
    property: (options?: any) => (target: any, key: string) => {}
};

/**
 * Mock implementation of UITransform component
 */
export class UITransform extends Component {
    contentSize = { width: 100, height: 100 };
    
    setContentSize(width: number, height: number) {
        this.contentSize.width = width;
        this.contentSize.height = height;
    }
}

/**
 * Mock implementation of Prefab class
 */
export class Prefab {
    data: any;
}

/**
 * Mock implementation of tween function
 */
export const tween = (target: any) => ({
    to: jest.fn().mockReturnThis(),
    delay: jest.fn().mockReturnThis(),
    call: jest.fn().mockReturnThis(),
    start: jest.fn()
});

/**
 * Mock implementation of EventTouch class
 */
export class EventTouch {
    constructor(public target: Node) {}
    getUILocation() {
        return new Vec2();
    }
}

/**
 * Mock implementations of CCString and CCBoolean
 */
export class CCString {}
export class CCBoolean {}
