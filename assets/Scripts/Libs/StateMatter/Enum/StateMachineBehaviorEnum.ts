/**
 * A state machine behavior enum defines the named behavior patterns and options
 * for state machine.
 */
export enum StateMachineBehaviorEnum 
{
  /**
   * The state machine will stop execution once any state in the
   * list of states will trigger the transition with target state that
   * equal the initial one.
   */
  STOP_ON_INITIAL_STATE
}