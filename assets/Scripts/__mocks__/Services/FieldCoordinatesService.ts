/**
 * Mock implementation of FieldCoordinatesService.
 * Provides deterministic coordinate conversions for testing.
 */
export const FieldCoordinatesService = jest.fn().mockImplementation(() => ({
    fieldToWorldCoordsinates: jest.fn().mockReturnValue({ x: 0, y: 0 }),
    GetFieldPosition: jest.fn().mockReturnValue({ x: 0, y: 0 })
}));
