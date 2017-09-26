import partial = require('lodash/partial');
import get = require('lodash/get');
import * as AfmUtils from '../utils/AfmUtils';
import * as TransformationUtils from '../utils/TransformationUtils';
import * as ExecutionRequestBuilder from '../execution/ExecutionRequestBuilder';
import * as Afm from '../interfaces/Afm';
import * as Transformation from '../interfaces/Transformation';
import { isUri } from '../helpers/uri';

import * as VisObj from './model/VisualizationObject';
import { Header } from '../interfaces/Header';

// Now ignores attribute elements, will be added in ONE-2706
function convertMeasureFilter(): VisObj.IEmbeddedListAttributeFilter {
    return {
        listAttributeFilter: {
            attribute: 'attribute',
            displayForm: 'displayForm',
            default: {
                negativeSelection: false,
                attributeElements: []
            }
        }
    };
}

function getLookupId(measure: Afm.IMeasure): string {
    return (measure.definition.baseObject as Afm.ILookupObject).lookupId;
}

const EmptyMeasure: Afm.IMeasure = {
    id: '___not_found___',
    definition: {
        baseObject: {
            id: '___not_found___'
        }
    }
};

function getMeasureTitle(transformation: Transformation.ITransformation, measure: Afm.IMeasure): string {
    const id = getLookupId(measure) || measure.id;

    const { title } = ExecutionRequestBuilder.getMeasureAdditionalInfo(transformation, id);

    return title || measure.id;
}

function getAttributeSorting(
    transformation: Transformation.ITransformation,
    attribute: Afm.IAttribute
): { sort: VisObj.SortDirection } {
    const sorting = TransformationUtils.getSorting(transformation).find(s => s.column === attribute.id);

    if (!sorting) {
        return null;
    }

    return { sort: (sorting.direction as VisObj.SortDirection) };
}

function getMeasureSorting(
    transformation: Transformation.ITransformation,
    measure: Afm.IMeasure
): { sort: VisObj.IMeasureSort } {
    const sorting = TransformationUtils.getSorting(transformation)
        .find(s => (s.column === getLookupId(measure) || s.column === measure.id));

    if (!sorting) {
        return null;
    }

    return {
        sort: {
            direction: (sorting.direction as VisObj.SortDirection),
            sortByPoP: getLookupId(measure) && sorting.column !== getLookupId(measure) || false
        }
    };
}

function getMeasureFormat(transformation: Transformation.ITransformation, measure: Afm.IMeasure): { format?: string } {
    const id = getLookupId(measure) || measure.id;

    const { format } = ExecutionRequestBuilder.getMeasureAdditionalInfo(transformation, id);

    return format ? { format } : {};
}

function findMeasure(afm: Afm.IAfm, id: string): Afm.IMeasure {
    return afm.measures.find(m => m.id === id);
}

function getBaseObjectId(measure: Afm.IMeasure): string {
    return (measure.definition.baseObject as Afm.ISpecificObject).id;
}

function getReferencedObjectId(afm: Afm.IAfm, measure: Afm.IMeasure): string {
    const id = (measure.definition.baseObject as Afm.ILookupObject).lookupId;

    return getBaseObjectId(findMeasure(afm, id));
}

function getObjectId(afm: Afm.IAfm, measure: Afm.IMeasure): string {
    return getBaseObjectId(measure) || getReferencedObjectId(afm, measure);
}

function getMeasureType(aggregation: string = ''): VisObj.MeasureType {
    switch (aggregation.toLowerCase()) {
        case 'count':
            return 'attribute';
        case '':
            return 'metric';
        default:
            return 'fact';
    }
}

function convertMeasure(
    transformation: Transformation.ITransformation,
    afm: Afm.IAfm,
    measure: Afm.IMeasure
): VisObj.IMeasure {
    const filters = measure.definition.filters || [];
    const sorting = getMeasureSorting(transformation, measure) || {};
    const aggregation = measure.definition.aggregation ?
        { aggregation: measure.definition.aggregation } : {};
    const format = getMeasureFormat(transformation, measure) || {};

    return {
        measure: {
            measureFilters: filters.map(convertMeasureFilter),
            objectUri: getObjectId(afm, measure),
            showInPercent: Boolean(measure.definition.showInPercent),
            showPoP: Boolean(measure.definition.popAttribute),
            title: getMeasureTitle(transformation, measure),
            type: getMeasureType(measure.definition.aggregation),
            ...format,
            ...aggregation,
            ...sorting
        }
    };
}

function isStacking(transformation: Transformation.ITransformation, attribute: Afm.IAttribute): boolean {
    return get(transformation, 'dimensions', []).some((dimension) => {
        return dimension.name === 'stacks' &&
            (dimension.attributes || []).some((attr: Afm.IAttribute) => attr.id === attribute.id);
    });
}

function getAttributeDisplayForm(attribute: Afm.IAttribute, headers: Header[]) {
    if (isUri(attribute.id)) {
        return attribute.id;
    }
    return headers.find(header => header.id === attribute.id).uri;
}

function convertAttribute(
    transformation: Transformation.ITransformation,
    headers: Header[] = [],
    attribute: Afm.IAttribute
): VisObj.ICategory {
    const sorting = getAttributeSorting(transformation, attribute) || {};

    const collection = isStacking(transformation, attribute) ? 'stack' : 'attribute';

    return {
        category: {
            collection,
            displayForm: getAttributeDisplayForm(attribute, headers),
            type: attribute.type,
            ...sorting
        }
    };
}

function isNotReferencedMeasure(measures: Afm.IMeasure[], measure: Afm.IMeasure): boolean {
    const popMeasure = measures.find(m => Boolean(m.definition.popAttribute)) || EmptyMeasure;

    return measure.id !== getLookupId(popMeasure);
}

function isDateFilter(filter: Afm.IFilter): filter is Afm.IDateFilter {
    return filter.type === 'date';
}

function isPositiveAttributeFilter(filter: Afm.IAttributeFilter): filter is Afm.IPositiveAttributeFilter {
    return !!(filter as Afm.IPositiveAttributeFilter).in;
}

function isNegativeAttributeFilter(filter: Afm.IAttributeFilter): filter is Afm.INegativeAttributeFilter {
    return !!(filter as Afm.INegativeAttributeFilter).notIn;
}

function toUris(ids: string[], attributeUri: string) {
    return ids.map((id) => {
        return `${attributeUri}?id=${id}`;
    });
}

function convertFilter(filter: Afm.IFilter): VisObj.EmbeddedFilter {
    if (isDateFilter(filter)) {
        const [from, to] = filter.between;

        const dateFilter: VisObj.IEmbeddedDateFilter = {
            dateFilter: {
                type: filter.intervalType,
                from,
                to,
                dataset: filter.id,
                granularity: `GDC.time.${filter.granularity}`
            }
        };

        return dateFilter;
    }

    if (isPositiveAttributeFilter(filter)) {
        const attributeFilter: Afm.IPositiveAttributeFilter = filter;

        const listAttributeFilter: VisObj.IEmbeddedListAttributeFilter = {
            listAttributeFilter: {
                displayForm: attributeFilter.id,
                default: {
                    negativeSelection: false,
                    // Note: should lookup attribute uri from displayForm and pass that to the toUris method, ONE-2706
                    attributeElements: toUris(attributeFilter.in, attributeFilter.id)
                }
            }
        };

        return listAttributeFilter;
    }

    if (isNegativeAttributeFilter(filter)) {
        const attributeFilter: Afm.INegativeAttributeFilter = filter;

        const listAttributeFilter: VisObj.IEmbeddedListAttributeFilter = {
            listAttributeFilter: {
                displayForm: attributeFilter.id,
                default: {
                    negativeSelection: true,
                    attributeElements: toUris(attributeFilter.notIn, attributeFilter.id)
                }
            }
        };

        return listAttributeFilter;
    }
}

export function toVisObj(
    type: VisObj.VisualizationType,
    Afm: Afm.IAfm,
    transformation: Transformation.ITransformation,
    resultHeaders: Header[] = []
): VisObj.IVisualizationObjectContent {
    const normalized = AfmUtils.normalizeAfm(Afm);

    return {
        type,

        buckets: {
            measures: normalized.measures
                .filter(partial(isNotReferencedMeasure, normalized.measures))
                .map(partial(convertMeasure, transformation, normalized)),

            categories: normalized.attributes.map(partial(convertAttribute, transformation, resultHeaders)),

            filters: normalized.filters.map(convertFilter)
        }
    };
}
