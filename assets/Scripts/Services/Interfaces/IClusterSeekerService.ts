/**
 * @file IClusterSeekerService.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 * 
 * Interface for the cluster seeking service that handles finding groups of matching items
 * in the game field. The service is responsible for identifying connected items that share
 * the same property value.
 * A cluster is defined as a group of adjacent items of the same type.
 */
import { GameFieldItem } from "../../GameField/GameFieldItem";

export interface IClusterSeekerService {
    /**
     * Collects a cluster of connected items starting from a specific position
     * @param items The 2D array of game field items to search in
     * @param minClusterSize The minimum number of connected items required to form a valid cluster
     * @param startX The starting X coordinate to begin the cluster search
     * @param startY The starting Y coordinate to begin the cluster search
     * @param propertyName The name of the property to match items by (e.g., 'color', 'type')
     * @returns Array of GameFieldItems that form a cluster, or empty array if cluster size is less than minimum
     */
    CollectCluster(items: GameFieldItem[][], minClusterSize: number, startX: number, startY: number, propertyName: string): GameFieldItem[];

    /**
     * Finds all valid clusters in the game field
     * @param items The 2D array of game field items to search in
     * @param minClusterSize The minimum number of connected items required to form a valid cluster
     * @param propertyName The name of the property to match items by (e.g., 'color', 'type')
     * @returns Array of clusters, where each cluster is an array of GameFieldItems
     */
    FindAllClusters(items: GameFieldItem[][], minClusterSize: number, propertyName: string): GameFieldItem[][];
}