declare global {
    interface Array<T> {
        shuffle2D(): T[][];
    }
}

Array.prototype.shuffle2D = function<T>(): T[][] {
    const array = this as T[][];
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            const newI = Math.floor(Math.random() * array.length);
            const newJ = Math.floor(Math.random() * array[i].length);
            [array[i][j], array[newI][newJ]] = [array[newI][newJ], array[i][j]];
        }
    }
    return array;
};

export {};