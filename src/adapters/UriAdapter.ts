import { IAdapter } from '../interfaces/Adapter';
import { IDataSource } from '../interfaces/DataSource';
import { IAfm } from '../interfaces/Afm';
import { SimpleExecutorAdapter } from './SimpleExecutorAdapter';
import { toAFM } from '../legacy/toAFM';
import { appendFilters } from '../utils/AfmUtils';
import { getAttributesMap } from '../helpers/metadata';
import { IDataSourceParams } from '../interfaces/DataSourceParams';
import * as GoodData from 'gooddata';
// tslint:disable-next-line:no-duplicate-imports
import { ISimpleExecutorResult } from 'gooddata';
import { IVisualizationObjectResponse } from '../legacy/model/VisualizationObject';

export class UriAdapter implements IAdapter<ISimpleExecutorResult> {
    private uri: string;
    private visObject: IVisualizationObjectResponse;

    constructor(private sdk: typeof GoodData, private projectId: string) {}

    public createDataSource(sourceParams: IDataSourceParams): Promise<IDataSource<ISimpleExecutorResult>> {
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
        return this.sdk.xhr.get<IVisualizationObjectResponse>(uri).then((visObject) => {
            this.uri = uri;
            return this.visObject = visObject;
        });
    }
}
