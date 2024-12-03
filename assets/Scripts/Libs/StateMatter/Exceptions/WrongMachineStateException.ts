/**
 * Occurs when state machine has wrong or empty (or even null) exception.
 */
export class WrongMachineStateException extends Error
{
  /**
   * Initializes a new instance of the WrongMachineStateException class.
   * @param pErrorMessage - The message that describes the error.
   */
  constructor(pErrorMessage:string) {
    super(pErrorMessage);
    // It's worth mentioning that Object.setPrototypeOf needs to be called 
    // immediately after any super(...) calls.

    // Set the prototype explicitly
    Object.setPrototypeOf(this, WrongMachineStateException.prototype);
  }
}