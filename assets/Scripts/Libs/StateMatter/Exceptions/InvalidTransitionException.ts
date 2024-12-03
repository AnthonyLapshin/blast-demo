/**
 * Occurs when state trying to examine or perform a transition between states.
 */
export class InvalidTransitionException extends Error
{
  /**
   * Initializes a new instance of the InvalidTransitionException class.
   * @param pErrorMessage - The message that describes the error.
   */
  constructor(pErrorMessage:string) {
    super(pErrorMessage);
    // It's worth mentioning that Object.setPrototypeOf needs to be called 
    // immediately after any super(...) calls.

    // Set the prototype explicitly
    Object.setPrototypeOf(this, InvalidTransitionException.prototype);
  }
}