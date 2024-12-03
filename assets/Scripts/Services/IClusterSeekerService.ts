import { GameFieldItem } from "../GameField/GameFieldItem";

export interface IClusterSeekerService {
    CollectCluster(items: GameFieldItem[][], minClusterSize: number, startX: number, startY: number, propertyName: string): GameFieldItem[];
    FindAllClusters(items: GameFieldItem[][], minClusterSize: number, propertyName: string): GameFieldItem[][];
    //findCluster(items: GameFieldItem[][], visited: boolean[][], x: number, y: number, targetValue: any, propertyName: string): GameFieldItem[];
}