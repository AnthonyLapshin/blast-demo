/**
 * @file BaseState.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-04
 */

import { IState } from './interfaces/IState';

/**
 * Abstract base class for implementing state pattern in the game.
 * Provides basic functionality for state management and transitions.
 * @template TContext The type of context object that contains shared state data
 */
export abstract class BaseState<TContext> implements IState<TContext> {
    /**
     * The name of the state. Used for identification and debugging.
     */
    private readonly _name: string;

    constructor(name: string) {
        this._name = name;
    }

    /**
     * The name of the state. Used for identification and debugging.
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Called when entering this state.
     * Override this method to perform initialization logic.
     * @param context The shared context object
     */
    public async onEnter?(context: TContext): Promise<void>;

    /**
     * Called when exiting this state.
     * Override this method to perform cleanup logic.
     * @param context The shared context object
     */
    public async onExit?(context: TContext): Promise<void>;

    /**
     * Called to update the state's logic.
     * Override this method to implement state-specific behavior.
     * @param context The shared context object
     */
    public async update?(context: TContext): Promise<void>;

    /**
     * Called to check if this state can transition to another state.
     * Override this method to implement custom transition logic.
     * @param context The shared context object
     * @returns True if the state can transition, false otherwise
     */
    public async canExit?(context: TContext): Promise<boolean>;
}
