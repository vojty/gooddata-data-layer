import { IAdapter } from '../interfaces/Adapter';
import { IDataSource } from '../interfaces/DataSource';
import { DataSource } from '../dataSources/DataSource';
import { IAfm } from '../interfaces/Afm';
import { AfmMapBuilder } from '../afmMap/AfmMapBuilder';
import { AfmMap } from '../afmMap/AfmMap';
import { AttributeMap } from '../afmMap/AttributeMap';
import { DateFilterMap } from '../afmMap/DateFilterMap';
import { buildRequest } from '../execution/ExecutionRequestBuilder';
import { getInsightDateFilter, hasInsightDateFilter, hasMetricDateFilters, normalizeAfm } from '../utils/AfmUtils';
import { ITransformation } from '../interfaces/Transformation';
import * as GoodData from 'gooddata';
// tslint:disable-next-line:no-duplicate-imports
import { ISimpleExecutorResult } from 'gooddata';

export class SimpleExecutorAdapter implements IAdapter<ISimpleExecutorResult> {
    // settings for gooddata SDK
    // @see https://github.com/gooddata/gooddata-js/blob/master/src/execution.js#L71
    constructor(private sdk: typeof GoodData, private projectId: string, private settings = {}) {}

    public createDataSource(
        afm: IAfm,
        fingerprint?: string
    ): Promise<IDataSource<ISimpleExecutorResult>> {
        const normalizedAfm = normalizeAfm(afm);

        const afmMapDataBuilder = new AfmMapBuilder(this.sdk, this.projectId);
        const execFactory = (transformation: ITransformation) => {
            return afmMapDataBuilder.build(normalizedAfm)
                .then((results: [AttributeMap, DateFilterMap]) => {
                    let insightDateFilter = null;
                    if (hasMetricDateFilters(normalizedAfm) && hasInsightDateFilter(normalizedAfm)) {
                        insightDateFilter = getInsightDateFilter(normalizedAfm);
                    }

                    const afmDataMap = new AfmMap(results, insightDateFilter);

                    const executionRequest = buildRequest(normalizedAfm, transformation, afmDataMap);

                    return this.sdk.execution.getData(this.projectId, executionRequest.execution.columns,
                        executionRequest.execution, this.settings);
                });
        };

        return Promise.resolve(new DataSource<ISimpleExecutorResult>(execFactory, normalizedAfm, fingerprint));
    }
}
