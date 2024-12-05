/**
 * @file UniqueUtils.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-02
 */

export class UniqueUtils {

    protected static UNIQUE_ID_PROP_NAME: string = "UniqueId";
    protected static globalUniqueId: number = 0;
    protected static prevGlobalUniqueId: number = 0;

    public static getObjectUniqueId(object: object): string {
        if (!object.hasOwnProperty(UniqueUtils.UNIQUE_ID_PROP_NAME)) {
            UniqueUtils.prevGlobalUniqueId = UniqueUtils.globalUniqueId;

            UniqueUtils.globalUniqueId++;
            // An additional checking in case max number value limit is reached
            if (UniqueUtils.globalUniqueId === UniqueUtils.prevGlobalUniqueId) {
                UniqueUtils.globalUniqueId = 0;
            }
            (object as any)[UniqueUtils.UNIQUE_ID_PROP_NAME] = UniqueUtils.globalUniqueId.toString();
        }

        return (object as any)[UniqueUtils.UNIQUE_ID_PROP_NAME];
    }
}
