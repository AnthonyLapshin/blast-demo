import { singleton } from "../Libs/Injects/decorators/singleton";
import { GameFieldItem } from "../GameField/GameFieldItem";
import { IClusterSeekerService } from "./IClusterSeekerService";

@singleton()
export class ClusterSeekerService implements IClusterSeekerService {

    public CollectCluster(items: GameFieldItem[][], minClusterSize: number, startX: number, startY: number, propertyName: string): GameFieldItem[] {
        const visited: boolean[][] = Array(items.length).fill(null).map(() => Array(items[0].length).fill(false));
        
        if (!items[startX]?.[startY]) {
            return [];
        }

        const targetValue = items[startX][startY][propertyName];
        
        const cluster = this.findCluster(items, visited, startX, startY, targetValue);
        
        if (cluster.length >= minClusterSize) {
            return cluster;
        }

        return [];
    }

    public FindAllClusters(items: GameFieldItem[][], minClusterSize: number, propertyName: string): GameFieldItem[][] {
        const allClusters: GameFieldItem[][] = [];
        const visited: boolean[][] = Array(items.length).fill(null).map(() => Array(items[0].length).fill(false));
        for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < items[i].length; j++) {
                if (!visited[i][j] && items[i][j]) {
                    if (items[i][j].IsBooster){
                        allClusters.push([items[i][j]]);
                        continue;
                    }
                    const targetValue = items[i][j].ItemType;
                    const cluster = this.findCluster(items, visited, i, j, targetValue);                    
                    if (cluster.length >= minClusterSize) {
                        allClusters.push(cluster);

                    }
                }
            }
        }
        console.log(`Total clusters found: ${allClusters.length}`);
        return allClusters;
    }

    private findCluster(
        items: GameFieldItem[][], 
        visited: boolean[][], 
        x: number, 
        y: number, 
        targetValue: string
    ): GameFieldItem[] {
        const cluster: GameFieldItem[] = [];
        const queue: [number, number][] = [[x, y]];
        
        while (queue.length > 0) {
            const [currentX, currentY] = queue.shift()!;

            if (
                currentX < 0 || currentX >= items.length ||
                currentY < 0 || currentY >= items[0].length ||
                visited[currentX][currentY] ||
                !items[currentX][currentY] ||
                items[currentX][currentY].ItemType !== targetValue
            ) {
                continue;
            }

            visited[currentX][currentY] = true;
            cluster.push(items[currentX][currentY]);

            const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
            for (const [dx, dy] of directions) {
                const newX = currentX + dx;
                const newY = currentY + dy;
                if (
                    newX >= 0 && newX < items.length &&
                    newY >= 0 && newY < items[0].length &&
                    !visited[newX][newY] &&
                    items[newX][newY] &&
                    items[newX][newY].ItemType === targetValue
                ) {
                    queue.push([newX, newY]);
                }
            }
        }
        return cluster;
    }
}