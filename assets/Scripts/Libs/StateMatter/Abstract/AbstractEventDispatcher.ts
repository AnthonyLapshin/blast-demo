import {Component} from "cc";

export interface IAbstractEventDispatcher<TEvents>
{
	addEventListener(pEvent: TEvents, pCallback: (pData: any) => void);
	removeEventListener(pEvent: TEvents, pCallback: (pData: any) => void);
	dispatch(pEvent: TEvents, pData: any);
	removeAllListeners();
}

export abstract class AbstractEventDispatcher<TEvents> extends Component implements IAbstractEventDispatcher<TEvents>
{
	private callbacks: Map<TEvents, ((pData: any) => void)[]> = new Map<TEvents, ((pData: any) => void)[]>();
	private callbacksForDelete: Map<TEvents, ((pData: any) => void)[]> = new Map<TEvents, ((pData: any) => void)[]>();
	private callbacksForAdd: Map<TEvents, ((pData: any) => void)[]> = new Map<TEvents, ((pData: any) => void)[]>();
	private InDispatch: boolean = false;

	public removeAllListeners(): void
	{
		this.callbacks = new Map();
		this.callbacksForDelete = new Map();
		this.callbacksForAdd = new Map();
	}

	public addEventListener(pEvent: TEvents, pCallback?: (pData: any) => void)
	{
		let cbArray = this.callbacks;
		if (this.InDispatch)
		{
			if (this.callbacksForAdd.size > 0)
				cbArray = this.callbacksForAdd;
		}

		if (!cbArray.has(pEvent))
		{
			cbArray.set(pEvent, [pCallback]);
			return;
		}
		cbArray.get(pEvent).push(pCallback);
	}

	public removeEventListener(pEvent: TEvents, pCallback?: (pData: any) => void)
	{
		if (!this.callbacks.has(pEvent))
		{
			return;
		}

		if (this.callbacksForDelete.has(pEvent))
		{
			const eventCallBacks = this.callbacksForDelete.get(pEvent);
			eventCallBacks.push(pCallback);
			this.callbacksForDelete.set(pEvent, eventCallBacks);
		}
		else
		{
			this.callbacksForDelete.set(pEvent, [pCallback]);
		}

		if (this.InDispatch)
		{
			return;
		}

		this.deleteCallbacks();
	}

	private deleteCallbacks(): void
	{
		if (this.callbacksForDelete.size <= 0)
		{
			return;
		}
		this.callbacksForDelete.forEach((pCallbackToDeleteArray, pEventName) =>
		{
			const callbackArray = this.callbacks.get(pEventName);

			if (callbackArray && callbackArray.length > 0)
			{
				const callbacks = callbackArray.filter(pCallback =>
					!pCallbackToDeleteArray?.some(pCallbackToDelete => pCallbackToDelete === pCallback)
				);
				this.callbacks.set(pEventName, callbacks);
			}
		});

		this.callbacksForDelete.clear();
	}

	private addCallbacks(): void
	{
		if (this.callbacksForAdd.size <= 0)
		{
			return;
		}
		this.callbacksForAdd.forEach((pCallbacksToAddArray, pEventName) =>
		{
			const callbackArray = this.callbacks.get(pEventName);
			if (callbackArray && callbackArray.length > 0)
			{
				const callbacksToAdd = pCallbacksToAddArray.filter(pCallback =>
				{
					return callbackArray?.some(pCallbackToAdd => pCallbackToAdd === pCallback);
				});
				if (callbackArray.length > 0)
				{
					this.callbacks.set(pEventName, [...callbackArray, ...callbacksToAdd]);
				}
			} else
			{
				this.callbacks.set(pEventName, pCallbacksToAddArray);
			}
		});

		this.callbacksForAdd.clear();
	}

	dispatch(pEvent: TEvents, pData?: any)
	{
		this.InDispatch = true;
		if (!this.callbacks.has(pEvent))
		{
			return;
		}

		let callbackArray = this.callbacks.get(pEvent)
		for (let i = 0; i < callbackArray.length; i++)
		{
			const callback = callbackArray[i];
			callback(pData);
		}

		this.InDispatch = false;
		this.addCallbacks();
		this.deleteCallbacks();
	}
}
