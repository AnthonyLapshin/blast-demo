import { IBaseState } from "./IBaseState";
import { ConditionCallBack } from "./ConditionCallBack";
import { TransitionBehaviorEnum } from "../Enum/TransitionBehaviourEnum";
import { IBaseTransition } from "./IBaseTransition";
import { IAbstractEventDispatcher } from "../Abstract/AbstractEventDispatcher";

/**
 * Base state machine interface
 * @TypeParameter TContext - a state machine context class.
 * @constructor
 */
export interface IBaseStateMachine<TContext, TEvent> extends IAbstractEventDispatcher<TEvent>
{
  /**
   * Set the initial state by index of the state in the list of states.
   * @param pStateIndex - An index of the state in the list of states
   * @constructor
   */
  SetInitialStateByIndex(pStateIndex: number): void;
  /**
   * Set the initial state by instance of the state.
   * @param pState - An instance of state
   * @param pResetContextData - Is it necessary to reset a state machine context data.
   * @constructor
   */
  SetInitialState(pState: IBaseState<TContext>, pResetContextData: boolean): void;
  /**
   * The property that contains state machine current context.
   * @param pContext - A state machine context
   * @constructor
   */
  set Context(pContext: TContext | null);
  /**
   * Getter method of the property that contains state machine current context.
   * @constructor
   */
  get Context(): TContext | null;
  /**
   * Move state machine to the next state
   * @constructor
   */
  MoveNext(): void;
  /**
   * Add state to the state machine collection.
   * @param pState - A state object.
   * @param pSetAsInitial - Set a newly added state as initial one
   * @returns Array state order in the list of states.
   * @constructor
   */
  AddState(pState: IBaseState<TContext>, pSetAsInitial: boolean): number;
  /**
   * Remove a state from the list of states.
   * @param pState - A state object to remove.
   * @constructor
   */
  RemoveState(pState: IBaseState<TContext>): void;
  /**
   * Check the current state in state machine and return true in case if this state is initial one.
   * @returns Does the current state is initial one or not.
   * @constructor
   */
  InInitialState(): boolean;
  /**
  * Reset the processing state of the state machine to initial one
  * and optionally reset the context of the state machine.
  * @param pResetTheContext - 
  * @constructor
  */
  Reset(pResetTheContext: boolean): void;
  /**
   * Start the state machine processing chain.
   * @constructor
   */
  Run(): void;
  /**
   * Create transition between states in the state machine.
   * @param pFromState - A state from which this transition will start.
   * @param pToState - A target state that will be applied to the state machine.
   * @param pCondition - A function that will be called in order to analyse the 
   *                     possibility to move through the transition
   * @param pOrder - The evaluation order that defines what transition 
   *                 will be analyzed first.
   * @param pBehaviorEnumAfterTransition - Defines state machine behavior after the completion the transition. 
   * In case if true - state machine will not call Execute callback after the transition.
   * @remarks In spite of the value of the pBehaviorEnumAfterTransition all transition callbacks such as BeforeEnter,
   * BeforeExit, etc will be called.
   * @constructor
   */
  AddTransition(pFromState: IBaseState<TContext>,
    pToState: IBaseState<TContext>,
    pCondition: ConditionCallBack<TContext>,
    pOrder: number,
    pBehaviorEnumAfterTransition: TransitionBehaviorEnum): IBaseTransition<TContext>;
  /**
   * Remove transition from the list of transitions and related states.
   * @param pTransition - An object of transition to remove.
   * @constructor
   */
  RemoveTransition(pTransition: IBaseTransition<TContext>): void;
}