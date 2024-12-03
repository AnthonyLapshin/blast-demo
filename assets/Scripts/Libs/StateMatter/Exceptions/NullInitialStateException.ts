/**
 * Occurs when the initial state of state machine is null.
 */
export class NullInitialStateException extends Error
{
  /**
   * Initializes a new instance of the NullInitialStateException class.
   * @param pErrorMessage - The message that describes the error.
   */
  constructor(pErrorMessage:string) {
    super(pErrorMessage);
    // It's worth mentioning that Object.setPrototypeOf needs to be called 
    // immediately after any super(...) calls.

    // Set the prototype explicitly
    Object.setPrototypeOf(this, NullInitialStateException.prototype);
  }
}