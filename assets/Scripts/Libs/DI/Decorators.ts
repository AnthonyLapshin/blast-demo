import "reflect-metadata";
import { Container } from './Container';

/**
 * A token representing a type.
 */
type Constructor<T = any> = new (...args: any[]) => T;

/**
 * A decorator to mark a class as injectable.
 */
export function Injectable() {
    return function(pTarget: Constructor) {
        // Этот декоратор помечает класс как доступный для внедрения
    };
}

/**
 * A decorator to inject a dependency into a class.
 */
export function Inject<T>(type: Constructor<T>) {
    return function(pTarget: any, pPropertyKey: string) {
        const container = Container.getInstance();
        
        // Add the dependency to the container
        Object.defineProperty(pTarget, pPropertyKey, {
            get: () => container.resolve<T>(type)
        });
    };
}