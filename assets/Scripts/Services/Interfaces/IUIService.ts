/**
 * @file IUIService.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

import { Node, Prefab } from "cc";
import { Paddings } from "../../UI/Paddings";

/**
 * Interface defining the service responsible for managing UI elements.
 * This service handles the creation, display, and management of UI components
 * such as windows, popups, and other interface elements.
 */
export interface IUIService {
   /**
     * Resets the size of the given UI elements based on the level configuration and paddings.
     * @param scaleTargets The UI elements to reset the size for
     * @param paddings The paddings to apply to the UI elements
     */
   resetSize(scaleTargets: Node[], paddings: Paddings | null): Promise<void> 
}