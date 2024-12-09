import type { FieldCoordinatesService } from "../../../assets/Scripts/Services/FieldCoordinatesService";
import type { ClusterSeekerService } from "../../../assets/Scripts/Services/ClusterSeekerService";
import type { LevelConfigurationService } from "../../../assets/Scripts/Services/LevelConfiguration";

const mockCoordinates = { x: 0, y: 0 };
const mockCluster = [{ x: 0, y: 0 }];
const mockLevelConfig = {
    width: 5,
    height: 5,
    minClusterSize: 2
};

const createMockService = (type: any) => {
    if (type.name === 'FieldCoordinatesService') {
        return {
            fieldToWorldCoordsinates: () => mockCoordinates,
            GetFieldPosition: () => mockCoordinates
        };
    } else if (type.name === 'ClusterSeekerService') {
        return {
            FindAllClusters: () => [mockCluster]
        };
    } else if (type.name === 'LevelConfigurationService') {
        return {
            GetLevelConfiguration: () => mockLevelConfig
        };
    }
    return new type();
};

// Conditional export based on environment
export const inject = typeof jest !== 'undefined'
    ? jest.fn().mockImplementation((type) => {
        if (type.name === 'FieldCoordinatesService') {
            return {
                fieldToWorldCoordsinates: jest.fn().mockReturnValue(mockCoordinates),
                GetFieldPosition: jest.fn().mockReturnValue(mockCoordinates)
            };
        } else if (type.name === 'ClusterSeekerService') {
            return {
                FindAllClusters: jest.fn().mockReturnValue([mockCluster])
            };
        } else if (type.name === 'LevelConfigurationService') {
            return {
                GetLevelConfiguration: jest.fn().mockReturnValue(mockLevelConfig)
            };
        }
        return new type();
    })
    : createMockService;
