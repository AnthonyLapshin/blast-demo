/**
 * @file ClusterSeekerService.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 * 
 * Service responsible for finding clusters of matching items in the game field.
 * A cluster is a group of adjacent items that share the same property value.
 * The service uses a flood-fill algorithm to identify connected components.
 */

import { singleton } from "../Libs/Injects/decorators/singleton";
import { GameFieldItem } from "../GameField/GameFieldItem";
import { IClusterSeekerService } from "./Interfaces/IClusterSeekerService";

/**
 * Service responsible for finding clusters of matching items in the game field.
 * A cluster is a group of adjacent items of the same type. This service provides
 * methods to find such clusters around a selected item or across the entire field.
 */
@singleton()
export class ClusterSeekerService implements IClusterSeekerService {

    /**
     * Finds all valid clusters in the game field by scanning each position
     * @param items 2D array of game field items to search in
     * @param minClusterSize Minimum number of connected items required for a valid cluster
     * @param propertyName Property to match items by (e.g., 'color', 'type')
     * @returns Array of clusters, where each cluster is an array of connected GameFieldItems
     */
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
        return allClusters;
    }

    /**
     * Collects a cluster starting from a specific position using flood-fill algorithm
     * @param items 2D array of game field items to search in
     * @param minClusterSize Minimum number of connected items required for a valid cluster
     * @param startX Starting X coordinate for cluster search
     * @param startY Starting Y coordinate for cluster search
     * @param propertyName Property to match items by (e.g., 'color', 'type')
     * @returns Array of connected GameFieldItems forming a cluster, or empty array if cluster is too small
     */
    public CollectCluster(items: GameFieldItem[][], minClusterSize: number, startX: number, startY: number, propertyName: string): GameFieldItem[] {
        const visited: boolean[][] = Array(items.length).fill(null).map(() => Array(items[0].length).fill(false));
        
        if (!items[startX]?.[startY]) {
            return [];
        }

        const targetValue = items[startX][startY][propertyName];
        
        const cluster = this.findCluster(items, visited, startX, startY, targetValue);
        
        return cluster.length >= minClusterSize ? cluster : [];
    }

    /**
     * Helper method that performs recursive flood-fill to find connected items
     * @param items 2D array of game field items
     * @param visited Set tracking visited positions to avoid cycles
     * @param x Current X coordinate being checked
     * @param y Current Y coordinate being checked
     * @param targetValue Value to match against (from propertyName)
     * @returns Array of GameFieldItems that form a connected cluster
     * @private
     */
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