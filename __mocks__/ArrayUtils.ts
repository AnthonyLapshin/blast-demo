/**
 * Mock implementation of ArrayUtils for testing purposes.
 * Provides deterministic behavior for array operations that are normally random.
 */

// Helper function that returns the first item of an array
const getFirstItem = <T>(list: T[]): T => list[0];

// Conditional export based on environment
export const ArrayUtils = {
    /**
     * Mock implementation of getRandomItem that always returns the first item.
     * This makes tests deterministic by avoiding actual random selection.
     * @param list - Array to select an item from
     * @returns The first item in the array
     */
    getRandomItem: typeof jest !== 'undefined' 
        ? jest.fn().mockImplementation(getFirstItem)
        : getFirstItem
};
