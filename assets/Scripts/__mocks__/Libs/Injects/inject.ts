import { FieldCoordinatesService } from "../../../Services/FieldCoordinatesService";
import { ClusterSeekerService } from "../../../Services/ClusterSeekerService";
import { LevelConfigurationService } from "../../../Services/LevelConfiguration";

export const inject = jest.fn().mockImplementation((type) => {
    if (type === FieldCoordinatesService) {
        return {
            fieldToWorldCoordsinates: jest.fn().mockReturnValue({ x: 0, y: 0 }),
            GetFieldPosition: jest.fn().mockReturnValue({ x: 0, y: 0 })
        };
    } else if (type === ClusterSeekerService) {
        return {
            FindAllClusters: jest.fn().mockReturnValue([[{ x: 0, y: 0 }]])
        };
    } else if (type === LevelConfigurationService) {
        return {
            GetLevelConfiguration: jest.fn().mockReturnValue({
                width: 5,
                height: 5,
                minClusterSize: 2
            })
        };
    }
    return new type();
});
