import {AbstractStateMachineContext} from "../Abstract/AbstractStateMachineContext";
import {BaseTerminableStateMachine} from "./BaseTerminableStateMachine";

export class TerminableContext<TContext, TEvent> extends AbstractStateMachineContext<TContext, TEvent> {
    public isTerminated: boolean = false;

    get StateMachine(): BaseTerminableStateMachine<any, any>
    {
        return this._stateMachine as BaseTerminableStateMachine<any, any>;
    }
}