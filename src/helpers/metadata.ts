import get = require('lodash/get');
import set = require('lodash/set');
import * as GoodData from 'gooddata';
import {
    IMeasuresMap,
    IAttributesMap,
    IVisualizationObject
} from '../legacy/model/VisualizationObject';
import { IAttribute } from '../afmMap/model/gooddata/Attribute';
import { IMeasure } from '../interfaces/Afm';

const getYearAttributeDisplayForm = (item: IAttribute): string => {
    const dateType = get(item, 'attribute.content.type');
    if (dateType === 'GDC.time.year') {
        return get(item, 'attribute.content.displayForms.0.meta.uri');
    }
};

const getDateFilter = (visualizationObject: IVisualizationObject) => {
    let dateFilterItem = get(visualizationObject, 'content.buckets.categories', [])
        .find(category => get(category, 'category.type', {}) === 'date');
    const dateFilter = dateFilterItem ? dateFilterItem.category : undefined;

    if (dateFilter) {
        return dateFilter;
    }

    dateFilterItem = get(visualizationObject, 'content.buckets.filters', [])
        .find(item => item.dateFilter !== undefined);

    return dateFilterItem ? dateFilterItem.dateFilter : undefined;
};

// tslint:disable-next-line:variable-name
export const getAttributesMap = (sdk: typeof GoodData, _projectId: string, visualizationObject: IVisualizationObject):
    Promise<IAttributesMap> => {
    const dateFilter = getDateFilter(visualizationObject);
    if (!dateFilter) {
        return Promise.resolve({});
    }

    const attrUri = get(dateFilter, 'attribute') as string;
    return sdk.md.getObjectDetails<IAttribute>(attrUri).then((attr) => {
        return {
            [attrUri]: getYearAttributeDisplayForm(attr)
        };
    });
};

export const fetchMeasures = (sdk: typeof GoodData, projectId: string, visualizationObject: IVisualizationObject):
    Promise<IMeasuresMap> => {
    const measures = get(visualizationObject, 'content.buckets.measures', []);
    if (!measures.length) {
        return Promise.resolve({});
    }

    const uris = measures.map(measure => measure.measure.objectUri);
    return sdk.md.getObjects<IMeasure[]>(projectId, uris).then((objects) => {
        return objects.reduce((acc: IMeasuresMap, metric: IMeasure) => {
            const uri = get(metric, 'metric.meta.uri');
            if (uri) {
                set(acc, uri, {
                    measure: {
                        format: get(metric, 'metric.content.format')
                    }
                });
            }

            return acc;
        }, {});
    });
};
