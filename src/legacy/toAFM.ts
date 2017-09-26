import flatten = require('lodash/flatten');
import get = require('lodash/get');
import compact = require('lodash/compact');
import omitBy = require('lodash/omitBy');
import isUndefined = require('lodash/isUndefined');
import * as Afm from '../interfaces/Afm';
import * as Transformation from '../interfaces/Transformation';

import * as VisObj from './model/VisualizationObject';

import { SHOW_IN_PERCENT_MEASURE_FORMAT } from '../constants/formats';

const getMeasureId = (n: number, isPoP?: boolean, measure?: VisObj.IMeasure): string => {
    if (measure && measure.measure.generatedId) {
        return measure.measure.generatedId;
    }
    return `m${n + 1}${isPoP ? '_pop' : ''}`;
};

function convertBaseAttributeFilter(filter: VisObj.IEmbeddedListAttributeFilter): Afm.IAttributeFilter {
    const items = filter.listAttributeFilter.default.attributeElements.map((el) => {
        return el.split('=')[1]; // pick ID from URL: /gdc/md/obj/1/elements?id=1
    });

    // skip filters with ALL
    if (items.length > 0) {
        if (filter.listAttributeFilter.default.negativeSelection) {
            // Negative filter
            return {
                id: filter.listAttributeFilter.displayForm,
                type: 'attribute',
                notIn: items
            };
        }

        // Positive filter
        return {
            id: filter.listAttributeFilter.displayForm,
            type: 'attribute',
            in: items
        };
    }

    return null;
}

function convertAttributeFilter(filter: VisObj.IEmbeddedListAttributeFilter): Afm.IAttributeFilter {
    const baseFilter = convertBaseAttributeFilter(filter);
    if (!baseFilter) {
        return null;
    }

    return baseFilter;
}

function convertMeasureFilters(measure: VisObj.IMeasure): Afm.IFilter[] {
    return measure.measure.measureFilters.map(convertFilter) as Afm.IFilter[];
}

function convertMeasureAfm(measure: VisObj.IMeasure, index: number, popAttribute?: string): Afm.IMeasure[] {
    const showInPercent = measure.measure.showInPercent ? { showInPercent: true } : {};
    const aggregation = measure.measure.aggregation ? { aggregation: measure.measure.aggregation } : {};
    const filters = compact(convertMeasureFilters(measure));
    const filtersProp = filters.length ? { filters } : {};
    const measures: Afm.IMeasure[] = [
        {
            id: getMeasureId(index, false, measure),
            definition: {
                baseObject: {
                    id: measure.measure.objectUri
                },
                ...aggregation,
                ...showInPercent,
                ...filtersProp
            }
        }
    ];

    if (measure.measure.showPoP) {
        const popMeasure: Afm.IMeasure = {
            id: getMeasureId(index, true),
            definition: {
                baseObject: {
                    lookupId: getMeasureId(index)
                },
                popAttribute: {
                    id: popAttribute
                }
            }
        };

        measures.unshift(popMeasure);
    }

    return measures;
}

function convertAttribute(attribute: VisObj.ICategory): Afm.IAttribute {
    return {
        id: attribute.category.displayForm,
        type: attribute.category.type
    };
}

function convertDateFilter(filter: VisObj.IEmbeddedDateFilter): Afm.IDateFilter {
    // skip All time date filters or broken filters with one of from/to undefined
    if (filter.dateFilter.from === undefined ||
        filter.dateFilter.to === undefined) {
        return null;
    }
    const retVal: Afm.IDateFilter = {
        type: 'date',
        id: filter.dateFilter.dataset,
        intervalType: filter.dateFilter.type,
        between: [
            String(filter.dateFilter.from),
            String(filter.dateFilter.to)
        ],
        granularity: filter.dateFilter.granularity.split('.')[2]
    };

    if (filter.dateFilter.type === 'relative') {
        retVal.between = [
            parseInt(filter.dateFilter.from as string, 10),
            parseInt(filter.dateFilter.to as string, 10)
        ];
    }
    return retVal;
}

function convertFilter(filter: VisObj.EmbeddedFilter): Afm.IFilter {
    if ((filter as VisObj.IEmbeddedDateFilter).dateFilter) {
        return convertDateFilter(filter as VisObj.IEmbeddedDateFilter);
    }

    return convertAttributeFilter(filter as VisObj.IEmbeddedListAttributeFilter);
}

function convertMeasureTransformation(
    measure: VisObj.IMeasure,
    index: number,
    measuresMap?: VisObj.IMeasuresMap
): Transformation.IMeasure[] {
    const measureUri = get(measure, 'measure.objectUri');
    const measureFromMap = get(measuresMap, measureUri);
    const measureFromMapFormat = get(measureFromMap, 'measure.format');
    const itemFormat = measure.measure.format || measureFromMapFormat;
    const format = (measure.measure.showInPercent ? SHOW_IN_PERCENT_MEASURE_FORMAT : itemFormat) as string;

    const measures: Transformation.IMeasure[] = [
        omitBy({
            id: getMeasureId(index),
            title: measure.measure.title,
            format
        }, isUndefined) as Transformation.IMeasure
    ];
    if (measure.measure.showPoP) {
        const transformationMeasure: Transformation.IMeasure = {
            id: getMeasureId(index, true),
            title: `${measure.measure.title} - previous year`,
            format
        };

        measures.push(transformationMeasure);
    }
    return measures;
}

function convertSortingTransformation(visObj: VisObj.IVisualizationObjectContent): Transformation.ISort[] {
    const measureSorting = visObj.buckets.measures.map((measure, index) => {
        if (!measure.measure.sort) {
            return null;
        }

        return {
            column: getMeasureId(index, measure.measure.sort.sortByPoP),
            direction: measure.measure.sort.direction
        };
    });

    const attributesSorting = visObj.buckets.categories.map((category) => {
        if (!category.category.sort) {
            return null;
        }

        return {
            column: category.category.displayForm,
            direction: category.category.sort
        };
    });

    return compact([...measureSorting, ...attributesSorting]);
}

function getPoPAttribute(resolver: DisplayFormResolver, visObj: VisObj.IVisualizationObjectContent) {
    const category = visObj.buckets.categories[0];

    if (category && category.category.type === 'date') {
        return resolver(category.category.attribute);
    }

    const filter: VisObj.IEmbeddedDateFilter = (visObj.buckets.filters as VisObj.IEmbeddedDateFilter[])
        .find((f): f is VisObj.IEmbeddedDateFilter => {
            return !!f.dateFilter;
        });

    if (filter) {
        return resolver(filter.dateFilter.attribute);
    }

    return null;
}

function convertAFM(visObj: VisObj.IVisualizationObjectContent, resolver: DisplayFormResolver): Afm.IAfm {
    const attributes = visObj.buckets.categories.map(convertAttribute);
    const attrProp = attributes.length ? { attributes } : {};

    const popAttribute = getPoPAttribute(resolver, visObj);
    const measures = flatten(visObj.buckets.measures.map((measure, index) => {
        return convertMeasureAfm(measure, index, popAttribute);
    }));
    const measuresProp = measures.length ? { measures } : {};

    const filters = compact(visObj.buckets.filters.map(convertFilter));
    const filtersProp = filters.length ? { filters } : {};

    return {
        ...measuresProp,
        ...attrProp,
        ...filtersProp
    };
}

function convertTransformation(
    visObj: VisObj.IVisualizationObjectContent,
    measuresMap: VisObj.IMeasuresMap
): Transformation.ITransformation {
    const sorting = convertSortingTransformation(visObj);
    const sortProp = sorting.length ? { sorting } : {};

    const measuresTransformation = flatten(visObj.buckets.measures.map((measure, index) => {
        return convertMeasureTransformation(measure, index, measuresMap);
    }));
    const measuresTransformationProp = measuresTransformation.length ? { measures: measuresTransformation } : {};

    const stackingAttributes = visObj.buckets.categories
        .filter(category => category.category.collection === 'stack')
        .map(category => ({
            id: category.category.displayForm
        }));
    const stackingProp = stackingAttributes.length ?
        { dimensions: [{ attributes: stackingAttributes, name: 'stacks' }] } :
        {};

    return {
        ...measuresTransformationProp,
        ...stackingProp,
        ...sortProp
    };
}

export interface IConvertedAFM {
    afm: Afm.IAfm;
    transformation: Transformation.ITransformation;
    type: VisObj.VisualizationType;
}

type DisplayFormResolver = (uri: string) => string;

function makeDisplayFormUriResolver(attributesMap: VisObj.IAttributesMap): DisplayFormResolver {
    return (uri: string) => {
        return attributesMap[uri];
    };
}

export function toAFM(
    visObj: VisObj.IVisualizationObjectContent,
    attributesMap: VisObj.IAttributesMap,
    measuresMap?: VisObj.IMeasuresMap
): IConvertedAFM {
    return {
        type: visObj.type,

        afm: convertAFM(visObj, makeDisplayFormUriResolver(attributesMap)),

        transformation: convertTransformation(visObj, measuresMap)
    };
}
