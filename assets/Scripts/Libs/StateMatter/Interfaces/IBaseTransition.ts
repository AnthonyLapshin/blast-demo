import { IBaseState } from "./IBaseState";
import { ConditionCallBack } from "./ConditionCallBack";
import { TransitionBehaviorEnum } from "../Enum/TransitionBehaviourEnum";

/**
 * Base interface for simple transition between two states
 * @TypeParameter TContext - a state machine context class.
 * @constructor
 */
export interface IBaseTransition<TContext>
{
  /**
   * A setter for checking order in case of multiple transitions.
   * @constructor
   */
  get Order(): number;
  /**
   * A setter for checking order in case of multiple transitions.
   * @constructor
   */
  set Order(CSSFontPaletteValuesRule: number);
  /**
   * A getter for a state that state machine will use to change <b>from</b>.
   * @constructor
   */
  get FromState(): IBaseState<TContext>;
  /**
   * A setter for state that state machine will use to change <b>from</b>.
   * @constructor
   */
  set FromState(pState: IBaseState<TContext>);
  /**
   * A setter for a state that state machine will use to change <b>to</b>.
   * @constructor
   */
  get ToState(): IBaseState<TContext>;
  /**
   * A setter for a state that state machine will use to change <b>to</b>.
   * @param pState - A target state.
   * @constructor
   */
  set ToState(pState: IBaseState<TContext>);
  /**
   * Remove transition links from the states inside.
   * @constructor
   */
  RemoveFromStates(): void;
  /**
   * Is this transition active
   * @constructor
   */
  get IsActive(): boolean;
  /**
   * Is this transition active
   * @param pValue - Is active state of transition
   * @constructor
   */
  set IsActive(pValue: boolean);
  /**
   * Define possibility to execute transition between defined states
   * @param pContext - A state machine context
   * @constructor
   */
  CanExecute(pContext: TContext | null): boolean;
  /**
   * A getter for an action that defines a possibility to make a transition
   * @constructor
   */
  get Condition(): ConditionCallBack<TContext> | null;
  /**
   * A setter for an action that defines a possibility to make a transition
   * @param pCondition
   * @constructor
   */
  set Condition(pCondition: ConditionCallBack<TContext> | null);
  /**
   * Stop state machine execution after performing transition thru the state
   * @constructor
   */
  get AfterTransitionBehaviorEnum(): TransitionBehaviorEnum;
  /**
   * Stop state machine execution after performing transition through the state
   * @param pBehaviour - A parameter that defines a stop state machine execution behaviour 
   * after performing transition through the state
   * @constructor
   */
  set AfterTransitionBehaviorEnum(pBehaviour: TransitionBehaviorEnum);
}