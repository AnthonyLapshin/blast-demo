import { IBaseStateMachine } from "./IBaseStateMachine";

/**
 * An interface that defines a state machine context
 * @TContext - A context class for state machine
 */
export interface IStateMachineContext<TContext, TEvent>
{
  /**
   * A state machine reference
   */
  get StateMachine(): IBaseStateMachine<TContext, TEvent>;
  /**
   * Reset the context
   */
  Reset(): void;
}