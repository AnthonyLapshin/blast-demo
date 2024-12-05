/**
 * @file EnumGameTool.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

/**
 * Enum representing the different tools available in the game.
 * Each tool provides a unique way to interact with and modify the game field.
 */
export enum GameTool {
    /** Default tool for selecting items */
    SELECTOR = "SELECTOR", 
    
    /** Bomb tool that clears items in a radius of 1 item */
    BOMB_1 = "BOMB_1", 
    
    /** Bomb tool that clears items in a radius of 2 items */
    BOMB_2 = "BOMB_2", 
    /** Single-row rocket that clears one horizontal line */
    ROW_ROCKET_1 = "ROW_ROCKET_1", 
    
    /** Single-column rocket that clears one vertical line */
    COL_ROCKET_1 = "COL_ROCKET_1", 
    
    /** Double-row rocket that clears two adjacent horizontal lines */
    ROW_ROCKET_2 = "ROW_ROCKET_2",
    
    /** Double-column rocket that clears two adjacent vertical lines */
    COL_ROCKET_2 = "COL_ROCKET_2",
    
    /** Nuke bomb that clears the entire field */
    NUKE_BOMB = "NUKE_BOMB"
}