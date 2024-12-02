import { tween, Tween } from "cc";

interface IAssociativeArray<T> {
    [key: string]: T;
}

export class TimeoutUtils {

    protected static lastId: number = 0;
    protected static maxInteger: number;
    private static readonly timers: IAssociativeArray<Tween<any>> = {};

    static wait(timeOut: number): Promise<void> {
        return new Promise(resolve => {
            TimeoutUtils.setTimeout(() => {
                resolve();
            }, timeOut);
        });
    }

    static setTimeout(handler: (...args: any[]) => void, timeout: number, ...args: any[]): number {
        const id = this.getId();
        const move = tween({time: 0}).by(timeout / 1000, {time: 100});
        const checkEnd = tween().call(() => {
            handler(args);
        });

        move
            .then(checkEnd)
            .start();

        this.timers[id] = move;
        return id;
    }

    static isActive(id: number): boolean {
        return this.timers[id] !== undefined;
    }

    static clearTimeout(id: number): void {
        this.clearById(id);
    }

    static setInterval(handler: Function, timeout: number, ...args: any[]): number {
        const id = this.getId();
        const move = this.getIntervalTween(timeout, handler, id, args);

        this.timers[id] = move;
        return id;
    }

    static clearInterval(id: number): void {
        this.clearById(id);
    }

    protected static clearById(id: number) {
        if (isNaN(id)) {
            console.warn(`TimeoutUtils: check timeout/interval id. id = ${id}`);
            return;
        }
        const tl = this.timers[id];
        if (tl) {
            tl.stop();
            delete this.timers[id];
        }
    }

    protected static getId() {
        // (Number as any) is used to prevent failing of compiler,
        // take into account, that is Number.MAX_SAFE_INTEGER returns undefined,
        // and the next Math.pow result will be taken
        this.maxInteger = this.maxInteger || (Number as any).MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;
        if (this.lastId >= this.maxInteger - 1) {
            this.lastId = 0;
        }
        return ++this.lastId;
    }

    private static getIntervalTween(timeout: number, handler: Function, timerId:number, args: any[], ) {
        const move = tween({time: 0}).by(timeout / 1000, {time: 100});
        const checkEnd = tween().call(() => {
            handler(args);
            if (this.timers[timerId]) {
                TimeoutUtils.getIntervalTween(timeout, handler, timerId, args);
                this.timers[timerId] = move;
            }
        });

        move
            .then(checkEnd)
            .start();
        return move;
    }
}
