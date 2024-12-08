/**
 * Mock implementation of ArrayUtils for testing purposes.
 * Provides deterministic behavior for array operations that are normally random.
 */
export const ArrayUtils = {
    /**
     * Mock implementation of getRandomItem that always returns the first item.
     * This makes tests deterministic by avoiding actual random selection.
     * @param list - Array to select an item from
     * @returns The first item in the array
     */
    getRandomItem: jest.fn().mockImplementation((list) => list[0])
};
