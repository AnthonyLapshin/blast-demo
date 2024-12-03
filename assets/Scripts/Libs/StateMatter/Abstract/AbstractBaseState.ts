import { IBaseState } from "../Interfaces/IBaseState";
import { IBaseTransition } from "../Interfaces/IBaseTransition";
import { AbstractStateMachineContext } from "./AbstractStateMachineContext";

/**
 * Abstract class that define the basic behavior of machine state
 * @TypeParameter TContext - a state machine context class.
 */
export abstract class AbstractBaseState<TContext extends AbstractStateMachineContext<unknown, unknown>> implements IBaseState<TContext>
{
  /**
   * State machine context
   * @protected
   */
  protected _context: TContext;

  /**
   * State machine transitions
   * @protected
   */
  protected _transitions: IBaseTransition<TContext>[] = [];

  /**
   * Context property setter
   * @param pContext - A state machine context
   */
  public set Context(pContext: TContext)
  {
    this._context = pContext;
  }
  /**
   * Initialize the new instance of the AbstractBaseState
   */
  public get Context() 
  {
    return this._context;
  }
  /**
   * Initialize the new instance of the AbstractBaseState with context
   * @param pContext - A state machine context
   */
  public constructor(pContext: TContext) 
  {
    this._context = pContext;
  }

  /**
 * The method that state machine calling before entering the state
 * @constructor
 */
  BeforeEnter(): void
  {
  }
  /**
 * The method that state machine calling once this state has been 
 * set but before the main execution
 * @constructor
 */
  AfterEnter(): void
  {
  }
  /**
 * The method that state machine calling once this state has been set as the 
 * current state and callbacks BeforeEnter and AfterEnter finished.
 * @constructor
 */
  Execute(): void 
  {
    this._context.StateMachine.MoveNext();
  }

  /**
 * The method that state machine calling right before changing 
 * the current state
 * @constructor
 */
  BeforeExit(): void
  {
  }
  /**
 * The method that state machine calling right after changing the current state
 * @constructor
 */
  AfterExit(): void
  {
  }
  /**
 * Add transition to the list of transitions
 * @param pTransition - A transition object to save in the list of state transitions
 * @constructor
 */
  AddTransition(pTransition: IBaseTransition<TContext>): void 
  {
    this._transitions.push(pTransition);
  }
  /**
 * Remove a transition object from the list of state transitions
 * @param pTransition - A transition object to remove from the list of state transitions
 * @constructor
 */
  RemoveTransition(pTransition: IBaseTransition<TContext>): void 
  {
    const index = this._transitions.indexOf(pTransition, 0);
    if (index > -1) 
    {
      this._transitions.splice(index, 1);
    }
  }
  /**
  * A list of transitions for current state
  * @constructor
  */
  get Transitions(): IBaseTransition<TContext>[] 
  {
    return this._transitions;
  }
}