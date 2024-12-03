/**
 * Occurs when the index is not presented in the list of states.
 */
export class WrongStateIndexException extends Error
{
  /**
   * Initializes a new instance of the WrongStateIndexException class.
   * @param pErrorMessage - The message that describes the error.
   */
  constructor(pErrorMessage:string) {
    super(pErrorMessage);
    // It's worth mentioning that Object.setPrototypeOf needs to be called 
    // immediately after any super(...) calls.

    // Set the prototype explicitly
    Object.setPrototypeOf(this, WrongStateIndexException.prototype);
  }
}