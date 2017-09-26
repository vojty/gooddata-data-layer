export interface IGoodDataSDK {
    md?: {
        getUrisFromIdentifiers?: (projectId: string, attributes: string[]) => Promise<any>;
        getObjects?: (projectId: string, objectUris: string[]) => Promise<any>;
        translateElementLabelsToUris?:
            (projectId: string, displayFormUri: string, elementsLabels: string[]) => Promise<any>;
    };
    execution?: {
        getData?:
            (projectId: string, columns: string[], executionConfiguration: object,
             settings: object
        ) => Promise<any>
    };
    xhr?: {
        get?: (url: string, settings?: any) => Promise<any>
    };
}
