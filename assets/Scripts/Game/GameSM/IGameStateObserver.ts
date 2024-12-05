export interface IGameStateObserver {
    onGameStateChanged(newState: string): void;
}