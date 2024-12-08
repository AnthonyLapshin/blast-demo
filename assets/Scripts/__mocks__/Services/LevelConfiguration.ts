/**
 * Mock implementation of LevelConfigurationService.
 * Returns predefined level configuration for testing.
 */
export const LevelConfigurationService = jest.fn().mockImplementation(() => ({
    GetLevelConfiguration: jest.fn().mockReturnValue({
        width: 5,
        height: 5,
        minClusterSize: 2
    })
}));
