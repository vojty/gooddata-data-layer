import * as GoodData from 'gooddata';
import * as VisObj from './legacy/model/VisualizationObject';
import { IMetadataSource } from './interfaces/MetadataSource';
import { REG_URI_OBJ } from './helpers/uri';
import { fetchMeasures } from './helpers/metadata';

export class UriMetadataSource implements IMetadataSource {
    private mdResult: VisObj.IVisualizationMetadataResult;

    constructor(private sdk: typeof GoodData, private uri: string) {}

    public getVisualizationMetadata(): Promise<VisObj.IVisualizationMetadataResult> {
        if (this.mdResult) {
            return Promise.resolve(this.mdResult);
        }

        return this.sdk.xhr.get<VisObj.IVisualizationObjectResponse>(this.uri).then((visualizationObjectMetadata) => {
            const unwrapped = visualizationObjectMetadata.visualization;

            const uriSplit: string[] = REG_URI_OBJ.exec(this.uri) || [];
            const projectId = uriSplit[1];
            return fetchMeasures(this.sdk, projectId, unwrapped).then((measuresMap) => {
                this.mdResult = {
                    metadata: unwrapped,
                    measuresMap
                };

                return this.mdResult;
            });
        });
    }

    public getFingerprint() {
        return this.uri;
    }
}
