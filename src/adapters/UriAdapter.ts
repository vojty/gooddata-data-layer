import { IAdapter } from '../interfaces/Adapter';
import { IDataSource } from '../interfaces/DataSource';
import { IAfm } from '../interfaces/Afm';
import { SimpleExecutorAdapter } from './SimpleExecutorAdapter';
import { toAFM } from '../legacy/converters';
import { appendFilters } from '../utils/AfmUtils';
import { getAttributesMap } from '../helpers/metadata';
import { IDataSourceParams } from '../interfaces/DataSourceParams';
import { IGoodDataSDK } from '../interfaces/GoodDataSDK';

export class UriAdapter implements IAdapter {
    private projectId: string;
    private sdk: IGoodDataSDK;
    private uri;
    private visObject;

    constructor(sdk: IGoodDataSDK, projectId: string) {
        this.sdk = sdk;
        this.projectId = projectId;
    }

    public createDataSource(sourceParams: IDataSourceParams): Promise<IDataSource> {
        return this.fetchVisualizationObject(sourceParams.uri)
            .then((visObject) => {
                return getAttributesMap(this.sdk, this.projectId, visObject.visualization)
                    .then((attributesMap = {}) => {
                        const content = visObject.visualization.content;
                        const { afm } = toAFM(content, attributesMap);
                        const afmWithAttributeFilters: IAfm = appendFilters(afm,
                            sourceParams.attributeFilters,
                            sourceParams.dateFilter);
                        const simpleAdapter = new SimpleExecutorAdapter(this.sdk, this.projectId);

                        return simpleAdapter.createDataSource(afmWithAttributeFilters);
                    });
            });
    }

    private fetchVisualizationObject(uri: string)  {
        if (uri === this.uri) {
            return Promise.resolve(this.visObject);
        }
        return this.sdk.xhr.get(uri).then((visObject) => {
            this.uri = uri;
            return this.visObject = visObject;
        });
    }
}
