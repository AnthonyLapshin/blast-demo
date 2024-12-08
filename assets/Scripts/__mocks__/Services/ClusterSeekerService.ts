/**
 * Mock implementation of ClusterSeekerService.
 * Returns predefined clusters for testing.
 */
export const ClusterSeekerService = jest.fn().mockImplementation(() => ({
    FindAllClusters: jest.fn().mockReturnValue([[{ x: 0, y: 0 }]])
}));
