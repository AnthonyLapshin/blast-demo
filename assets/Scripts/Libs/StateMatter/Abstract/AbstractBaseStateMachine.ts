import { IBaseStateMachine } from "../Interfaces/IBaseStateMachine";
import { IBaseState } from "../Interfaces/IBaseState";
import { ConditionCallBack } from "../Interfaces/ConditionCallBack";
import { TransitionBehaviorEnum } from "../Enum/TransitionBehaviourEnum";
import { IBaseTransition } from "../Interfaces/IBaseTransition";
import { WrongMachineStateException } from "../Exceptions/WrongMachineStateException";
import { InvalidTransitionException } from "../Exceptions/InvalidTransitionException";
import { NullInitialStateException } from "../Exceptions/NullInitialStateException";
import { NullStateException } from "../Exceptions/NullStateException";
import { WrongStateIndexException } from "../Exceptions/WrongStateIndexException";
import { AmbiguousInitialStateException } from "../Exceptions/AmbiguousInitialStateException";
import { StateNotFoundException } from "../Exceptions/StateNotFoundException";
import { StateMachineBehaviorEnum } from "../Enum/StateMachineBehaviorEnum";
import { AbstractStateMachineContext } from "./AbstractStateMachineContext";
import { StateTransition } from "../Base/StateTransition";
import { IStateMachineWithBehaviourOptions } from "../Interfaces/IStateMachineWithBehaviourOptions";
import { AbstractEventDispatcher } from "./AbstractEventDispatcher";

/**
 * Abstract class that define the basic behavior of state machine.
 * @TypeParameter TContext - a state machine context class.
 */
export class AbstractBaseStateMachine<TContext extends AbstractStateMachineContext<unknown, unknown>, TEvent> extends AbstractEventDispatcher<TEvent> implements IBaseStateMachine<TContext, TEvent>, IStateMachineWithBehaviourOptions
{
  /**
   * The list fo options for current state machine.
   * @protected
   */
  protected readonly _options: Array<StateMachineBehaviorEnum> = new Array<StateMachineBehaviorEnum>();
  /**
   * A collection of all possible states for state machine.
   * @protected
   */
  protected readonly _states: Array<IBaseState<TContext>> = new Array<IBaseState<TContext>>();
  /**
   * A list of transitions for this state machine.
   * @protected
   */
  protected readonly _transitions: Array<IBaseTransition<TContext>> = new Array<IBaseTransition<TContext>>();
  /**
   * Initial state of the state machine.
   * @protected
   */
  protected _initialState: IBaseState<TContext> | null = null;
  /**
   * The current state for state machine.
   * @protected
   */
  protected _currentState: IBaseState<TContext> | null = null;
  /**
   * The background field for Context property.
   * @protected
   */
  protected _context: TContext | null;

  /**
   * Initialize the new instance of the AbstractBaseStateMachine
   */
  constructor(pContext: TContext | null = null, pInitialState: IBaseState<TContext> | null = null)
  {
    super()
    this._context = pContext;
    if (pInitialState != null)
    {
      this.AddState(pInitialState, true);
    }
  }

  /**
   * Add state to the state machine collection
   * @param pState - An IBaseState object to add into the list of states
   * @param pSetAsInitial - Set a newly added state as a initial one.
   * @constructor
   */
  AddState(pState: IBaseState<TContext>, pSetAsInitial = false): number
  {
    this._states.push(pState);
    if (pSetAsInitial)
    {
      // Set the passed state as initial one
      this.SetInitialState(pState);
    }
    return this._states.length - 1; // Return the last index of the state (currently added state)
  }

  /**
   * Create transition between states in the state machine.
   * @param pFromState - A state from which this transition will start.
   * @param pToState - A target state that will be applied to the state machine.
   * @param pCondition - A function that will be called in order to analyse the possibility to move through the transition.
   * @param pOrder - The evaluation order that defines what transition will be analyzed first.
   * @param pBehaviorEnumAfterTransition - Defines state machine behavior after the completion the transition. 
   * In case if true - state machine will not call Execute callback after the transition.
   * @remarks In spite of the value of the pBehaviorEnumAfterTransition all transition callbacks such as BeforeEnter, BeforeExit, etc will be called.
   * @constructor
   */
  AddTransition(pFromState: IBaseState<TContext>,
    pToState: IBaseState<TContext>,
    pCondition?: ConditionCallBack<TContext>,
    pOrder: number = 0,
    pBehaviorEnumAfterTransition: TransitionBehaviorEnum = TransitionBehaviorEnum.CONTINUE_AFTER_TRANSITION): IBaseTransition<TContext>
  {
    const transition = new StateTransition<TContext>(
      pFromState,
      pToState,
      pCondition,
      pOrder,
      pBehaviorEnumAfterTransition);

    this._transitions.push(transition);
    return transition;
  }
  /**
   * A state machine context setter.
   * @param pContext - A state machine context object.
   * @constructor
   */
  set Context(pContext: TContext | null)
  {
    this._context = pContext;
  }
  /**
   * A state machine context getter.
   * @constructor
   */
  get Context(): TContext | null
  {
    return this._context;
  }

  get CurrentState(): IBaseState<TContext> | null
  {
    return this._currentState;
  }

  /**
   * Check the current state in state machine and return true in case if this state is initial one.
   * @constructor
   */
  InInitialState(): boolean
  {
    return this._currentState == this._initialState;
  }

  IsState(state: IBaseState<TContext>): boolean
  {
    return this._currentState === state;
  }

  /**
   * Add state to the state machine collection.
   * @exception WrongMachineStateException - Occurs when current state is null.
   * @exception InvalidTransitionException - Occurs when transition checks is failed.
   * @constructor
   */
  MoveNext(): void
  {
    if (this._currentState == null)
    {
      throw new WrongMachineStateException("The current state in state machine is null!");
    }

    for (const transition of this._currentState.Transitions)
    {
      if (!this.CanExecuteTransition(transition)) continue;
      // All checks have been passed - start transition
      this.PerformTransition(transition);
      return;
    }
  }
  /**
   * Remove a state from the list of states.
   * @param pState - A state machine state object. 
   * @constructor
   */
  RemoveState(pState: IBaseState<TContext>): void
  {
    const index = this._states.indexOf(pState, 0);
    if (index > -1)
    {
      this._states.splice(index, 1);
    }// todo throw an exception for false?
  }
  /**
   * Remove transition from the list of transitions and related states.
   * @param pTransition - An object of transition to remove.
   * @constructor
   */
  RemoveTransition(pTransition: IBaseTransition<TContext>): void
  {
    const index = this._transitions.indexOf(pTransition, 0);
    if (index > -1)
    {
      this._transitions.splice(index, 1);
    }// todo throw an exception for false?
    pTransition.RemoveFromStates();
  }
  /**
   * Reset the processing state of the state machine to initial one
   * and optionally reset the context of the state machine.
   * @param pResetTheContext - Should the method reset the context of the state machine or not.
   * @constructor
   */
  Reset(pResetTheContext: boolean): void
  {
    if (pResetTheContext)
    {
      this._context?.Reset();
    }
    if (this._initialState != null)
    {
      this.ExecuteStateChangeLifecycle(this._initialState);
      return;
    }
    throw new NullInitialStateException("The initial state of state machine is null, please call the SetInitialState before teh call Run method");
  }
  /**
   * Start the state machine processing chain.
   * @exception NullStateException - Occur when the initial state of state machine is null.
   * @constructor
   */
  Run(): void
  {
    if (this._currentState == null)
    {
      throw new NullStateException("The current state of state machine is null, please set the state before the call Run method");
    }
    this._currentState.Execute();
  }
  /**
   * Set the initial state by index of the state in the list of states.
   * @param pStateIndex - A state index in the list of states.
   * @remarks During the process of the setting state up this method will call the
   * BeforeEnter and AfterEnter callbacks.
   * @exception WrongStateIndexException - Occurs when the index passed as an argument is not presented in the list of states.
   * @constructor
   */
  SetInitialStateByIndex(pStateIndex: number): void
  {
    if (pStateIndex < 0 || pStateIndex >= this._states.length)
    {
      throw new WrongStateIndexException("The index passed as an argument is not presented in the list of states.");
    }

    const state = (this._states)[pStateIndex];
    this._initialState = state;
    //todo possible could make a problem with null previous state
    this.ExecuteStateChangeLifecycle(state)
  }
  /**
   * Set the initial state by instance of the state.
   * @param pState - An instance of state.
   * @param pResetContextData - Is it necessary to reset a state machine context data or not.
   * @exception WrongMachineStateException - Occurs when the initial state is not presented in the list of states.
   * @exception AmbiguousInitialStateException - Occurs when someone is trying to set up the initial state via calling 
   * AddState on the state machine when the initial state already set up previously.
   * @constructor
   */
  SetInitialState(pState: IBaseState<TContext>, pResetContextData = false): void
  {
    if (this._initialState != null)
    {
      throw new AmbiguousInitialStateException("Trying to setup the initial state via calling AddState on " +
        "the state machine when the initial state already set up previously.");
    }
    const index = this._states.indexOf(pState, 0);
    if (index == -1)
    {
      throw new StateNotFoundException("The initial state is not presented in the list of states.");
    }
    this._initialState = this._states[index];
    this.Reset(pResetContextData);
  }

  /**
   * Checking the given transition and return the possibility to move through one.
   * @param pTransition - An transition to examine.
   * @param pStrictCheck - Define the behaviour of checking, in case if true throw an WrongMachineStateException in case if current state
   * of the state machine is not the one we have in the initial state for transition.
   * @exception WrongMachineStateException - Occurs if the pStrictCheck have been passed as true and current state
   *            is not the initial one from the transition.
   * @constructor
   * @protected
   */
  protected CanExecuteTransition(pTransition: IBaseTransition<TContext>, pStrictCheck = false): boolean
  {
    // Check the activity of state
    if (!pTransition.IsActive)
      return false; // Skip the transition in case if it is not Active

    // Check the initial state of transition to prevent undefined transitions 
    if (pTransition.FromState != this._currentState)
    {
      if (!pStrictCheck)
      {
        return false;
      }
      throw new InvalidTransitionException("Current state is not the initial state of executed transaction." +
        " Current state: {_currentState?.GetType().Name}, initial state of transition: " +
        typeof (pTransition.FromState));
    }

    // Check the conditions and Skip the transition in case if the condition is not allow us to pas thru
    return pTransition.CanExecute(this._context);
  }
  /**
   * Execute a transition procedure and define the sequence of transition callbacks.
   * @param pTransition - A transition object that state machine will use for performing transition.
   * @constructor
   * @protected
   */
  protected PerformTransition(pTransition: IBaseTransition<TContext>): void
  {
    this.ExecuteStateChangeLifecycle(pTransition.ToState);
    if (this.IsBehaviourOptionSet(StateMachineBehaviorEnum.STOP_ON_INITIAL_STATE)
      && pTransition.ToState == this._initialState
      && this._currentState == this._initialState)
    {
      // We should not call execute if we have set the STOP_ON_INITIAL_STATE,
      // and we are already in it.
      return;
    }

    if (pTransition.AfterTransitionBehaviorEnum.toFixed() == TransitionBehaviorEnum.STOP_AFTER_TRANSITION.toFixed())
    {
      return;
    }

    this._currentState?.Execute()
  }
  /**k
   * Make transition of the state from current one to given one.
   * @param pTargetState - The target state to transit to.
   * @remarks - The call of this method is idempotent
   * @constructor
   * @protected
   */
  protected ExecuteStateChangeLifecycle(pTargetState: IBaseState<TContext> | null): void
  {
    if (this._currentState == pTargetState)
    {
      return; // Let's make a call of this method is idempotent
    }
    const oldState = this._currentState;
    //Make before callbacks
    this._currentState?.BeforeExit();
    pTargetState?.BeforeEnter();
    // Transition itself
    this._currentState = pTargetState;
    // make after callbacks
    this._currentState?.AfterEnter();
    oldState?.AfterExit();
  }
  /**
   * Checking whatever state is enabled in the state machine.
   * @param pMachineBehaviourOption - A state machine behaviour option.
   * @constructor
   */
  public IsBehaviourOptionSet(pMachineBehaviourOption: StateMachineBehaviorEnum): boolean
  {
    let index = -1;

    this._options.forEach((pOprion, pIndex) =>
    {
      if (pOprion.toFixed() == pMachineBehaviourOption.toFixed())
        index = pIndex
    });
    return index > -1;
  }

  /**
 * Set the behaviour option to the state machine.
 * @param pMachineBehaviourOption - A state machine behaviour option.
 * @constructor
 */
  SetBehaviourOption(pMachineBehaviourOption: StateMachineBehaviorEnum): void
  {
    if (!this.IsBehaviourOptionSet(pMachineBehaviourOption))
    {
      this._options.push(pMachineBehaviourOption)
    }
  }
  /**
   * Unset the specific option from the state machine behaviour.
   * @param pMachineBehaviourOption - A state machine behaviour option.
   * @constructor
   */
  UnsetBehaviourOption(pMachineBehaviourOption: StateMachineBehaviorEnum): void
  {
    if (!this.IsBehaviourOptionSet(pMachineBehaviourOption))
    {
      const index = this._options.indexOf(pMachineBehaviourOption, 0);
      if (index > -1)
      {
        this._options.splice(index, 1);
      }// todo throw an exception for false?
    }
  }
  public GetCurrentState():IBaseState<TContext>
  {
    return this._currentState;
  }
}
