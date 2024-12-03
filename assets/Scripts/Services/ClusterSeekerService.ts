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
        
        const cluster = this.findCluster(items, visited, startX, startY, targetValue, propertyName);
        
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
                    const targetValue = items[i][j][propertyName];
                    const cluster = this.findCluster(items, visited, i, j, targetValue, propertyName);
                    
                    if (cluster.length >= minClusterSize) {
                        allClusters.push(cluster);
                    }
                }
            }
        }

        return allClusters;
    }

    private findCluster(
        items: GameFieldItem[][], 
        visited: boolean[][], 
        x: number, 
        y: number, 
        targetValue: any, 
        propertyName: string
    ): GameFieldItem[] {
        const cluster: GameFieldItem[] = [];
        const queue: [number, number][] = [[x, y]];
        
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

        while (queue.length > 0) {
            const [currentX, currentY] = queue.shift()!;

            if (
                currentX < 0 || currentX >= items.length ||
                currentY < 0 || currentY >= items[0].length ||
                visited[currentX][currentY] ||
                !items[currentX][currentY] ||
                items[currentX][currentY][propertyName] !== targetValue
            ) {
                continue;
            }

            visited[currentX][currentY] = true;
            cluster.push(items[currentX][currentY]);

            for (const [dx, dy] of directions) {
                queue.push([currentX + dx, currentY + dy]);
            }
        }

        return cluster;
    }
}