export interface IGameConfigurationService {
    get reshuffles(): number;
    get minClusterSize(): number;
    get startPointsAmount(): number;
    set startPointsAmount(value: number);
}