/**
 * @file IGuard.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-02
 */

export interface IGuard {
    (data?: any): boolean;
}