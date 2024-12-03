import { IState } from './interfaces/IState';
import { ITransition } from './interfaces/ITransition';

export class FiniteStateMachine<TContext> {
    private states: Map<string, IState<TContext>> = new Map();
    private transitions: ITransition<TContext>[] = [];
    private currentState: IState<TContext> | null = null;
    protected context: TContext;

    constructor(context: TContext) {
        this.context = context;
    }

    public addState(state: IState<TContext>): void {
        this.states.set(state.name, state);
    }

    public addTransition(transition: ITransition<TContext>): void {
        this.transitions.push(transition);
    }

    public async setInitialState(stateName: string): Promise<void> {
        const state = this.states.get(stateName);
        if (!state) {
            throw new Error(`State ${stateName} not found`);
        }
        this.currentState = state;
        await this.currentState.onEnter?.(this.context);
    }

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
    }

    public getCurrentState(): string | null {
        return this.currentState?.name ?? null;
    }
}