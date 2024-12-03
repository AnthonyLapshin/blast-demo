import {AbstractBaseStateMachine} from "../Abstract/AbstractBaseStateMachine";
import {TerminableContext} from "./TerminableContext";
import {BaseTerminableState} from "./BaseTerminableState";
import {IBaseState} from "../Interfaces/IBaseState";

export class BaseTerminableStateMachine<TContext extends TerminableContext<any, any>, TEvent> extends AbstractBaseStateMachine<TContext, TEvent>
{
    protected _currentState: IBaseState<TContext> | BaseTerminableState<TContext> | null = null;

    public get currentStateName(): string
    {
        return this._currentState.constructor.name;
    }

    public Terminate(): void
    {
        this._context.isTerminated = true;
        if (this._currentState instanceof BaseTerminableState) {
            this._currentState.Terminate();
        }
    }
}
