/**
 * Mock implementation of LevelConfigurationService.
 * Provides deterministic level configuration for testing.
 */

const mockLevelConfig = {
    width: 5,
    height: 5,
    minClusterSize: 2
};

const createMockService = () => ({
    GetLevelConfiguration: () => mockLevelConfig
});

// Conditional export based on environment
export const LevelConfigurationService = typeof jest !== 'undefined'
    ? jest.fn().mockImplementation(() => ({
        GetLevelConfiguration: jest.fn().mockReturnValue(mockLevelConfig)
    }))
    : createMockService;
