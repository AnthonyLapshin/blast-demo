/**
 * Occurs when state machine have more than one initial state and can't resolve 
 * the operation (add state, remove state, reset etc).
 */
export class AmbiguousInitialStateException extends Error
{
  /**
   * Initializes a new instance of the AmbiguousInitialStateException class.
   * @param pErrorMessage - The message that describes the error.
   */
  constructor(pErrorMessage:string) {
    super(pErrorMessage);
    // It's worth mentioning that Object.setPrototypeOf needs to be called 
    // immediately after any super(...) calls.
    
    // Set the prototype explicitly
    Object.setPrototypeOf(this, AmbiguousInitialStateException.prototype);
  }
}