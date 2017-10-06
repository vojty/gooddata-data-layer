import { IAdapter } from '../interfaces/Adapter';
import { IDataSource } from '../interfaces/DataSource';
import { DataSource } from '../dataSources/DataSource';
import { IAfm } from '../interfaces/Afm';
import { AfmMapBuilder } from '../afmMap/AfmMapBuilder';
import { AfmMap } from '../afmMap/AfmMap';
import { AttributeMap } from '../afmMap/AttributeMap';
import { DateFilterMap } from '../afmMap/DateFilterMap';
import { buildRequest } from '../execution/ExecutionRequestBuilder';
import { IGoodDataSDK } from '../interfaces/GoodDataSDK';
import { getGlobalDateFilters, hasGlobalDateFilter, hasMetricDateFilters, normalizeAfm } from '../utils/AfmUtils';

export class SimpleExecutorAdapter implements IAdapter {

    private projectId: string;
    private settings;
    private sdk;

    constructor(sdk: IGoodDataSDK, projectId: string, settings = {}) {
        this.sdk = sdk;
        this.projectId = projectId;
        // settings for gooddata SDK
        // @see https://github.com/gooddata/gooddata-js/blob/master/src/execution.js#L71
        this.settings = settings;
    }

    public createDataSource(afm: IAfm, fingerprint?: string): Promise<IDataSource> {
        const normalizedAfm = normalizeAfm(afm);

        const afmMapDataBuilder = new AfmMapBuilder(this.sdk, this.projectId);
        const execFactory = (transformation) => {
            return afmMapDataBuilder.build(normalizedAfm)
                .then((results: [AttributeMap, DateFilterMap]) => {
                    let globalDateFilters = null;
                    if (hasMetricDateFilters(normalizedAfm) && hasGlobalDateFilter(normalizedAfm)) {
                        globalDateFilters = getGlobalDateFilters(normalizedAfm);
                    }

                    const afmDataMap = new AfmMap(results, globalDateFilters);

                    const executionRequest = buildRequest(normalizedAfm, transformation, afmDataMap);

                    return this.sdk.execution.getData(this.projectId, executionRequest.execution.columns,
                        executionRequest.execution, this.settings);
                });
        };

        return Promise.resolve(new DataSource(execFactory, normalizedAfm, fingerprint));
    }
}
