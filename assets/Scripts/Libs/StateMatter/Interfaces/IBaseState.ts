import { IBaseTransition } from "./IBaseTransition";

/**
 * Base interface for machine state
 * @TypeParameter TContext - a state machine context class.
 */
export interface IBaseState<TContext>
{
  /**
   * The method that state machine calling before entering the state
   * @constructor
   */
  BeforeEnter(): void;
  /**
   * The method that state machine calling once this state has been 
   * set but before the main execution
   * @constructor
   */
  AfterEnter(): void;
  /**
   * The method that state machine calling once this state has been set as the 
   * current state and callbacks BeforeEnter and AfterEnter finished.
   * @constructor
   */
  Execute(): void;
  /**
   * The method that state machine calling right before changing 
   * the current state
   * @constructor
   */
  BeforeExit(): void;
  /**
   * The method that state machine calling right after changing the current state
   * @constructor
   */
  AfterExit(): void;
  /**
   * Add transition to the list of transitions
   * @param pTransition - A transition object to save in the list of state transitions
   * @constructor
   */
  AddTransition(pTransition: IBaseTransition<TContext>): void;
  /**
   * Remove a transition object from the list of state transitions
   * @param pTransition - A transition object to remove from the list of state transitions
   * @constructor
   */
  RemoveTransition(pTransition: IBaseTransition<TContext>): void;
  /**
   * A list of transitions for current state
   * @constructor
   */
  get Transitions(): Array<IBaseTransition<TContext>>;
}