import { IBaseTransition } from "../Interfaces/IBaseTransition";
import { TransitionBehaviorEnum } from "../Enum/TransitionBehaviourEnum";
import { ConditionCallBack } from "../Interfaces/ConditionCallBack";
import { IBaseState } from "../Interfaces/IBaseState";
import { NullStateException } from "../Exceptions/NullStateException";

/**
 * An abstract implementation of the IBaseTransition
 * @TypeParameter TContext - a state machine context class.
 */
export class AbstractTransition<TContext> implements IBaseTransition<TContext>
{
  /**
   * The evaluation order for this transition, the default value is 0.
   * @protected
   */
  protected _order = 0;

  protected _condition: ConditionCallBack<TContext> | null = null;
  protected _transitionBehavior: TransitionBehaviorEnum =
    TransitionBehaviorEnum.CONTINUE_AFTER_TRANSITION;
  /**
   * The initial state of transition.
   * In case if this parameter will not be equal to the state machine current state
   * in moment of calling the method CanExecute, state machine can rise an exception.
   * @protected
   */
  protected _fromState: IBaseState<TContext>;
  /**
   * The target state of transition.
   * @protected
   */
  protected _toState: IBaseState<TContext>;
  protected _isActive = true;

  /**
   * Initializes a new instance of the AbstractTransition class and setup
   * @param pFromState - The initial state of transition.
   * @param pToState - The target state of transition.
   * @param pCondition - A function that must return bool and indicates the availability of passing transition.
   * @param pOrder - An evaluation order.
   * @param pAfterTransitionBehaviorEnum - State machine behavior execution after performing transition through the state.
   * @remarks The default behavior for the state machine after transaction is
   * CONTINUE_AFTER_TRANSITION witch will continue the execution (call the Execute callback) after transaction.
   */
  constructor(pFromState: IBaseState<TContext>,
    pToState: IBaseState<TContext>,
    pCondition: ConditionCallBack<TContext> | null = null,
    pOrder = 0,
    pAfterTransitionBehaviorEnum: TransitionBehaviorEnum =
      TransitionBehaviorEnum.CONTINUE_AFTER_TRANSITION)
  {
    this._fromState = pFromState;
    this._toState = pToState;
    this._condition = pCondition;
    this._order = pOrder;
    this._transitionBehavior = pAfterTransitionBehaviorEnum;
    this._fromState.AddTransition(this);
    this._toState.AddTransition(this);
  }
  /**
   * State machine execution behavior after performing transition through the state.
   * @constructor
   */
  get AfterTransitionBehaviorEnum(): TransitionBehaviorEnum 
  {
    return this._transitionBehavior;
  }
  /**
   * State machine execution behavior after performing transition through the state.
   * @param pValue - An enumeration value that represents the behavior after 
   * performing transition through the state.
   * @constructor
   */
  set AfterTransitionBehaviorEnum(pValue: TransitionBehaviorEnum) 
  {
    this._transitionBehavior = pValue;
  }

  /**
   * A condition function, that defines availability of transition and returns
   * the Boolean that representing the availability of transaction to pass.
   * @constructor
   */
  get Condition(): ConditionCallBack<TContext> | null
  {
    return this._condition;
  }

  /**
   * A condition function, that defines availability of transition and returns
   * the Boolean that representing the availability of transaction to pass.
   * @param pCondition - A condition callback that will be used as pass through guard.
   * @constructor
   */
  set Condition(pCondition: ConditionCallBack<TContext> | null)
  {
    this._condition = pCondition;
  }

  /**
   * The initial state of transition.
   * @remarks In case if this parameter will not be equal to the state machine
   * current state in moment of calling the method CanExecute, state machine 
   * can rise an exception.
   * @constructor
   */
  get FromState(): IBaseState<TContext>
  {
    return this._fromState;
  }

  /**
   * The initial state of transition.
   * @param pState - An initial state of transition.
   * @remarks In case if this parameter will not be equal to the state machine
   * current state in moment of calling the method CanExecute, state machine
   * can rise an exception.
   * @constructor
   */
  set FromState(pState: IBaseState<TContext>)
  {
    this._fromState = pState;
  }

  /**
   * Represents tha state of the transition: Is this transition active or not.
   * @constructor
   */
  get IsActive(): boolean 
  {
    return this._isActive;
  }

  /**
   * Represents tha state of the transition: Is this transition active or not.
   * @param pValue - An activity of the transition: true - active, false - not active.
   * @constructor
   */
  set IsActive(pValue: boolean) 
  {
    this._isActive = pValue;
  }

  /**
   * The evaluation order for this transition, the default value is 0.
   * @constructor
   */
  get Order(): number 
  {
    return this._order;
  }

  /**
   * The evaluation order for this transition, the default value is 0.
   * @param pOrder - an order value.
   * @constructor
   */
  set Order(pOrder: number)
  {
    this._order = pOrder;
  }

  /**
   * The target state of transition.
   * @constructor
   */
  get ToState(): IBaseState<TContext>
  {
    return this._toState;
  }

  /**
   * The target state of transition.
   * @param pToState - A target stare to move to.
   * @constructor
   */
  set ToState(pToState: IBaseState<TContext>)
  {
    this._toState = pToState;
  }

  /**
   * Define possibility to execute transition between defined states.
   * @param pContext - A state machine context to analyse.
   * @constructor
   */
  CanExecute(pContext: TContext | null): boolean
  {
    if (pContext == null) 
    {
      throw new NullStateException('The state passed to the method is null!');
    }

    // If we haven't set up condition - just pass the transition
    if (this.Condition == null)
    {
      return true;
    }

    const result = this.Condition.call(this, pContext);
    // In case if the result is true - pass the condition 
    return result || result == null;
  }

  /**
   * Remove the current transition from the states (FromState, ToState).
   * @constructor
   */
  RemoveFromStates(): void
  {
    if (this.FromState != null)
    {
      this.FromState.RemoveTransition(this);
    }

    if (this.ToState != null)
    {
      this.ToState.RemoveTransition(this);
    }
  }
}