import 'reflect-metadata';
import { _decorator, Component, Node, game } from 'cc';
import { GameConfigurationService } from '../Services/GameConfigurationService';
import { IGameConfigurationService } from '../Services/IGameConfigurationService';
import { ILevelConfiguration } from '../Services/ILevelConfiguration';
import { LevelConfiguration } from '../Services/LevelConfiguration';
import { ServiceCollection, ServiceProvider } from '../Libs/DI/ServiceProvider';
import { InGameSceneController } from '../Scene/InGameSceneController';

const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('SystemComponent')
@executeInEditMode
export class SystemComponent extends Component {
    private static _serviceProvider: ServiceProvider;
    private static _instance: SystemComponent;
    private static _initialized = false;
    private static _initializing = false;
    
    public static get serviceProvider(): ServiceProvider {
        console.log('[DI] Getting ServiceProvider:', !!this._serviceProvider);
        return this._serviceProvider;
    }

    public static get instance(): SystemComponent {
        return this._instance;
    }

    public static get initialized(): boolean {
        return this._initialized;
    }

    protected onLoad(): void {
        // Prevent multiple initializations
        if (SystemComponent._initializing || SystemComponent._initialized) {
            console.log('[DI] SystemComponent already initialized or initializing');
            return;
        }

        console.log('[DI] SystemComponent.onLoad - Starting initialization');
        SystemComponent._initializing = true;
        SystemComponent._instance = this;
        
        const services = new ServiceCollection();

        // Register dependencies
        services
            .addSingleton<IGameConfigurationService>(GameConfigurationService)
            .addSingleton<ILevelConfiguration>(LevelConfiguration)
            .addTransient(InGameSceneController);

        SystemComponent._serviceProvider = services.buildServiceProvider();
        
        // Initialize all singleton services
        const config = SystemComponent._serviceProvider.getService(GameConfigurationService);
        const levelConfig = SystemComponent._serviceProvider.getService(LevelConfiguration);
        
        if (config && levelConfig) {
            SystemComponent._initialized = true;
            SystemComponent._initializing = false;
            console.log('[DI] ServiceProvider initialized and services loaded');
        } else {
            console.error('[DI] Failed to initialize services');
        }

        // Force a game step to ensure everything is initialized
        game.step();
    }
}
