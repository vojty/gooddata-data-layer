import { AFM, Execution } from '@gooddata/typings';
import * as GoodData from 'gooddata';

import { IAdapter } from '../interfaces/Adapter';
import { IDataSource } from '../interfaces/DataSource';
import { ExecuteAfmAdapter } from './ExecuteAfmAdapter';
import { toAfmResultSpec } from '../converters/toAfmResultSpec';
import { appendFilters } from '../utils/AfmUtils';
import { IDataSourceParams } from '../interfaces/DataSourceParams';
import { IVisualizationObjectResponse } from '../converters/model/VisualizationObject';

function defaultExecuteAdapterFactory(
    sdk: typeof GoodData,
    projectId: string
): IAdapter<Execution.IExecutionResponses> {
    return new ExecuteAfmAdapter(sdk, projectId);
}

export class UriAdapter implements IAdapter<Execution.IExecutionResponses> {
    private uri: string;
    private visObject: IVisualizationObjectResponse;

    constructor(
        private sdk: typeof GoodData,
        private projectId: string,
        private translatedPopSuffix: string,
        private executeAdapterFactory: any = defaultExecuteAdapterFactory
    ) {}

    public createDataSource(sourceParams: IDataSourceParams): Promise<IDataSource<any>> {
        return this.fetchVisualizationObject(sourceParams.uri)
            .then((visObject) => {
                const content = visObject.visualization.content;
                const { afm, resultSpec } = toAfmResultSpec(content, this.translatedPopSuffix);
                const afmWithAttributeFilters: AFM.IAfm = appendFilters(
                    afm,
                    sourceParams.attributeFilters || [],
                    sourceParams.dateFilter
                );
                const executeAdapter = this.executeAdapterFactory(this.sdk, this.projectId);
                const execution: AFM.IExecution = {
                    execution: {
                        afm: afmWithAttributeFilters,
                        resultSpec
                    }
                };
                return executeAdapter.createDataSource(execution);
            });
    }

    private fetchVisualizationObject(uri: string) {
        if (uri === this.uri) {
            return Promise.resolve(this.visObject);
        }
        return this.sdk.xhr.get<IVisualizationObjectResponse>(uri).then((visObject) => {
            this.uri = uri;
            return this.visObject = visObject;
        });
    }
}
