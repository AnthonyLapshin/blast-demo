/**
 * Mock implementation of ClusterSeekerService.
 * Provides deterministic cluster results for testing.
 */

const mockCluster = [{
    x: 0,
    y: 0
}];

const createMockService = () => ({
    FindAllClusters: () => [mockCluster]
});

// Conditional export based on environment
export const ClusterSeekerService = typeof jest !== 'undefined'
    ? jest.fn().mockImplementation(() => ({
        FindAllClusters: jest.fn().mockReturnValue([mockCluster])
    }))
    : createMockService;
