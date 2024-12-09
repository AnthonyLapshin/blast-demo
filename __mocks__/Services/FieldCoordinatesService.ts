/**
 * Mock implementation of FieldCoordinatesService.
 * Provides deterministic coordinate conversions for testing.
 */

const mockFieldCoordinates = {
    x: 0,
    y: 0
};

const createMockService = () => ({
    fieldToWorldCoordsinates: () => mockFieldCoordinates,
    GetFieldPosition: () => mockFieldCoordinates
});

// Conditional export based on environment
export const FieldCoordinatesService = typeof jest !== 'undefined'
    ? jest.fn().mockImplementation(() => ({
        fieldToWorldCoordsinates: jest.fn().mockReturnValue(mockFieldCoordinates),
        GetFieldPosition: jest.fn().mockReturnValue(mockFieldCoordinates)
    }))
    : createMockService;
