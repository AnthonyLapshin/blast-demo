import { AbstractTransition } from "../Abstract/AbstractTransition";
import { IBaseState } from "../Interfaces/IBaseState";
import { ConditionCallBack } from "../Interfaces/ConditionCallBack";
import { TransitionBehaviorEnum } from "../Enum/TransitionBehaviourEnum";

/**
 * Transition for state machine.
 * @TypeParameter TContext - a state machine context class.
 */
export class StateTransition<TContext> extends AbstractTransition<TContext>
{
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
    super(pFromState, pToState, pCondition, pOrder, pAfterTransitionBehaviorEnum);
  }
}