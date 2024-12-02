
export interface IAssociativeArray<T> {
    [key: string]: T;
}

export class ArrayUtils {
    protected static REMOVE_COUNT_ALL: number = -1;

    public static removeDuplicateCoordinates(arrays: number[][][]): void {
        const seen = new Set<string>();

        for (const array of arrays) {
            for (let i = array.length - 1; i >= 0; i--) {
                const coord = array[i];
                const key = `${coord[0]},${coord[1]}`;

                if (seen.has(key)) {
                    array.splice(i, 1);
                } else {
                    seen.add(key);
                }
            }
        }
    }

    public static removeItem(list: any[], item: any, removeCount: number = ArrayUtils.REMOVE_COUNT_ALL): boolean {
        let result: boolean = false;

        if (removeCount === ArrayUtils.REMOVE_COUNT_ALL) {
            removeCount = Number.MAX_VALUE;
        }

        let totalRemovedCount: number = 0;
        let itemIndex: number = list.indexOf(item);
        while (itemIndex !== -1 && totalRemovedCount < removeCount) {
            list.splice(itemIndex, 1);

            itemIndex = list.indexOf(item, itemIndex);
            totalRemovedCount++;

            result = true;
        }

        return result;
    }

    public static removeItemsFromArray<T>(list: T[], removeItems: T[]): void {
        let item: T;
        for (let itemIndex: number = 0; itemIndex < removeItems.length; itemIndex++) {
            item = removeItems[itemIndex];
            ArrayUtils.removeItem(list, item);
        }
    }

    public static getRandomItem<T>(list: T[], except?: T[]): T {
        let result: T;

        if (list && list.length > 0) {

            if (except) {
                list = list.concat();
                ArrayUtils.removeItemsFromArray(list, except);
            }

            const tempIndex: number = Math.floor(Math.random() * list.length);
            result = list[tempIndex];
        }

        return result;
    }

    public static removeDuplicates(array: any[]): any[] {
        return array.filter(ArrayUtils.removeDuplicatesFilter);
    }

    public static shuffle(array: any[]): any[] {
        return array.sort(() => Math.random() - 0.5);
    }

    static find<T>(array: Array<T>, predicate: (item: T) => boolean): T {
        for (const item of array) {
            if (predicate(item)) {
                return item;
            }
        }
        return null;
    }

    static mergeUnique<T>(a1: T[], a2: T[]): T[] {
        const res: T[] = a1.filter((value: T, index: number, a: T[]): boolean => a2.indexOf(value) < 0);
        return res.concat(a2);
    }

    static values<T>(map: IAssociativeArray<T>): T[] {
        const list: T[] = [];

        for (const key of Object.keys(map)) {
            list.push(map[key]);
        }
        return list;
    }

    protected static removeDuplicatesFilter(item: any, index: number, array: any[]): boolean {
        return (index === 0) ? true : array.lastIndexOf(item, index - 1) === -1;
    }

    public static getArrayFilledWithRange(start: number, end: number): number[] {
        return Array(end - start + 1).fill(0).map((_, idx) => start + idx);
    }

    public static getWeightedRandom(options: {item: number, weight: number}[]): number {
        let i;
        const weights: number[] = [];
        for (i = 0; i < options.length; i++) {
            weights[i] = options[i].weight + (weights[i - 1] || 0);
        }
        const random: number = Math.random() * weights[weights.length - 1];
        for (i = 0; i < weights.length; i++) {
            if (weights[i] > random) {
                break;
            }
        }
        return options[i].item;
    }
}
