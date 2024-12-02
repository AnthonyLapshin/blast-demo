/**
 * A dependency injection container. It allows you to register classes as dependencies
 * and resolve them later by a given token.
 *
 * @example
 * Container.getInstance().register('MyService', MyService);
 * const myService = Container.getInstance().resolve<MyService>('MyService');
 */
type Constructor<T = any> = new (...args: any[]) => T;

/**
 * Represents registration metadata for a dependency
 */
interface ServiceDescriptor {
    implementation: Constructor<any>;
    lifetime: ServiceLifetime;
    instance?: any;
}

/**
 * Service lifetime options similar to ASP.NET Core
 */
export enum ServiceLifetime {
    Singleton,
    Transient
}

/**
 * A dependency injection container with ASP.NET Core style registration
 */
export class Container {
    /**
     * A static instance of the container.
     */
    private static _instance: Container;

    /**
     * A map of dependencies. The key is the token of the dependency, the value is the service descriptor.
     */
    private readonly _services = new Map<string, ServiceDescriptor>();

    /**
     * A private constructor to prevent creating an instance of the container.
     */
    private constructor() {}

    /**
     * Get the static instance of the container.
     */
    public static getInstance(): Container {
        if (!Container._instance) {
            Container._instance = new Container();
        }
        return Container._instance;
    }

    /**
     * Register a transient service
     * @param pImplementation The implementation class
     */
    public addTransient<TInterface>(pImplementation: Constructor<TInterface>): void {
        const token = this._getToken(pImplementation);
        this._services.set(token, {
            implementation: pImplementation,
            lifetime: ServiceLifetime.Transient
        });
    }

    /**
     * Register a singleton service
     * @param pImplementation The implementation class
     */
    public addSingleton<TInterface>(pImplementation: Constructor<TInterface>): void {
        const token = this._getToken(pImplementation);
        this._services.set(token, {
            implementation: pImplementation,
            lifetime: ServiceLifetime.Singleton
        });
    }

    /**
     * Resolve a service by its interface
     */
    public resolve<TInterface>(type: Constructor<TInterface>): TInterface {
        const token = this._getToken(type);
        const descriptor = this._services.get(token);
        
        if (!descriptor) {
            throw new Error(`No implementation found for interface ${token}`);
        }

        return this._resolveService(descriptor);
    }

    /**
     * Clear all registrations
     */
    public clear(): void {
        this._services.clear();
    }

    private _resolveService(pDescriptor: ServiceDescriptor): any {
        switch (pDescriptor.lifetime) {
            case ServiceLifetime.Singleton:
                if (!pDescriptor.instance) {
                    pDescriptor.instance = new pDescriptor.implementation();
                }
                return pDescriptor.instance;

            case ServiceLifetime.Transient:
                return new pDescriptor.implementation();

            default:
                throw new Error(`Unknown service lifetime: ${pDescriptor.lifetime}`);
        }
    }

    private _getToken<T>(type: Constructor<T>): string {
        return type.name ?? 'Anonymous';
    }
}