/**
 * Occurs when the state is not presented in the list of states of the state machine.
 */
export class StateNotFoundException extends Error
{
  /**
   * Initializes a new instance of the StateNotFoundException class.
   * @param pErrorMessage - The message that describes the error.
   */
  constructor(pErrorMessage:string) {
    super(pErrorMessage);
    // It's worth mentioning that Object.setPrototypeOf needs to be called 
    // immediately after any super(...) calls.

    // Set the prototype explicitly
    Object.setPrototypeOf(this, StateNotFoundException.prototype);
  }
}