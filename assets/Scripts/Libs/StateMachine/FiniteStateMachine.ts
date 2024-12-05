/**
 * @file FiniteStateMachine.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

import { IGameStateObserver } from '../../Game/GameSM/States/Observers/IGameStateObserver';
import { IState } from './interfaces/IState';
import { ITransition } from './interfaces/ITransition';

/**
 * Generic implementation of a Finite State Machine.
 * Manages state transitions and notifies observers of state changes.
 * @template TContext - The type of context object used by the state machine
 */
export class FiniteStateMachine<TContext> {
    private states: Map<string, IState<TContext>> = new Map();
    private transitions: ITransition<TContext>[] = [];
    private currentState: IState<TContext> | null = null;
    protected context: TContext;

    /** Set of observers that will be notified of state changes */
    private _stateObservers: Set<IGameStateObserver> = new Set();

    /**
     * Adds an observer to be notified of state changes.
     * @param observer - The observer to add
     */
    public addStateObserver(observer: IGameStateObserver): void {
        this._stateObservers.add(observer);
    }

    /**
     * Removes an observer from state change notifications.
     * @param observer - The observer to remove
     */
    public removeStateObserver(observer: IGameStateObserver): void {
        this._stateObservers.delete(observer);
    }

    /**
     * Notifies all registered observers of a state change.
     * @param newState - The name of the new state
     */
    private notifyGameStateChanged(newState: string): void {
        this._stateObservers.forEach(observer => observer.onStateChanged(newState));
    }
    
    /**
     * Creates a new instance of the FiniteStateMachine.
     * @param context - The context object to be used by the state machine
     */
    constructor(context: TContext) {
        this.context = context;
    }

    /**
     * Adds a new state to the state machine.
     * @param state - The state to add
     */
    public addState(state: IState<TContext>): void {
        this.states.set(state.name, state);
    }

    /**
     * Adds a new transition to the state machine.
     * @param transition - The transition to add
     */
    public addTransition(transition: ITransition<TContext>): void {
        this.transitions.push(transition);
    }

    /**
     * Sets the initial state of the state machine.
     * @param stateName - The name of the initial state
     */
    public async setInitialState(stateName: string): Promise<void> {
        const state = this.states.get(stateName);
        if (!state) {
            throw new Error(`State ${stateName} not found`);
        }
        this.currentState = state;
        await this.currentState.onEnter?.(this.context);
    }

    /**
     * Updates the state machine, checking for transitions and updating the current state.
     */
    public async update(): Promise<void> {
        if (!this.currentState) {
            return;
        }

        // Update current state
        await this.currentState.update?.(this.context);

        // Check transitions
        const possibleTransitions = this.transitions.filter(t => t.from === this.currentState!.name);
        
        for (const transition of possibleTransitions) {
            if (!transition.guardCondition || transition.guardCondition(this.context)) {
                await this.transitionTo(transition.to);
                break;
            }
        }
    }

    /**
     * Transitions to a new state.
     * Handles exit and entry actions, and notifies observers.
     * @param stateName - The name of the new state
     */
    private async transitionTo(stateName: string): Promise<void> {
        const newState = this.states.get(stateName);
        if (!newState) {
            throw new Error(`State ${stateName} not found`);
        }

        // Exit current state
        await this.currentState?.onExit?.(this.context);

        // Enter new state
        this.currentState = newState;
        await this.currentState.onEnter?.(this.context);
        this.notifyGameStateChanged(stateName);
    }

    /**
     * Gets the name of the current state.
     * @returns The name of the current state, or null if no state is set
     */
    public getCurrentState(): string | null {
        return this.currentState?.name ?? null;
    }
}