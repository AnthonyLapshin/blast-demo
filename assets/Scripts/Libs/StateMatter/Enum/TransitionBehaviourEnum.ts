/**
 * A transition behavior enum defines the specific behavior
 * for processing the transition.
 */
export enum TransitionBehaviorEnum 
{
  /**
   * Stop executing of states in the chain of states.
   * @remarks All states callbacks will be processed in spite of this
   * type of behavior however the Execute method on the state object
   * will not be called once transition is finished.
   */
  STOP_AFTER_TRANSITION,
  /**
   * A default behavior of transition, basically means that transition
   * will execute all transition callbacks and finally call the Execute
   * method on the state.
   */
  CONTINUE_AFTER_TRANSITION
}