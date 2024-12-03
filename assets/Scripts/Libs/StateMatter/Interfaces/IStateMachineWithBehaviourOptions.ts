import { StateMachineBehaviorEnum } from "../Enum/StateMachineBehaviorEnum";

/**
 * A state machine with behavior options interface defines
 * the methods to set and unset behaviour options of the machine.
 */
export interface IStateMachineWithBehaviourOptions
{
  /**
   * Set the behaviour option to the state machine.
   * @param pMachineBehaviourOption - A state machine behaviour option.
   * @constructor
   */
  SetBehaviourOption(pMachineBehaviourOption: StateMachineBehaviorEnum): void;
  /**
   * Unset the specific option from the state machine behavior
   * @param pMachineBehaviourOption - A state machine behavior option.
   * @constructor
   */
  UnsetBehaviourOption(pMachineBehaviourOption: StateMachineBehaviorEnum): void;
}