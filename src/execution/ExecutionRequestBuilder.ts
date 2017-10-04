import isEmpty = require('lodash/isEmpty');
import compact = require('lodash/compact');
import pick = require('lodash/pick');
import get = require('lodash/get');
import {
    IAfm, IAttributeFilter, IDateFilter, ILookupObject,
    IMeasure, INegativeAttributeFilter, IPositiveAttributeFilter, ISpecificObject
} from '../interfaces/Afm';
import { ITransformation } from '../interfaces/Transformation';
import { AfmMap, getDateElementUri } from '../afmMap/AfmMap';
import { IDefinition, IExecutionRequest } from './ExecutionRequest';
import { DEFAULT_METRIC_FORMAT, SHOW_IN_PERCENT_MEASURE_FORMAT } from '../constants/formats';
import { isUri, wrapId } from '../helpers/uri';
import { getSorting } from '../utils/TransformationUtils';
import {
    hasMetricDateFilters,
    isAbsoluteDateFilter, isAttributeFilter, isDateFilter,
    isNegativeAttributeFilter, isPoP, isPositiveAttributeFilter,
    isShowInPercent
} from '../utils/AfmUtils';

export function buildRequest(afm: IAfm, transformation: ITransformation, afmDataMap: AfmMap): IExecutionRequest {
    // Get columns
    const columns = generateColumns(afm);
    const definitions = afm.measures.map(item =>
            generateMetricDefinition(afm, transformation, afmDataMap, item));
    const orderBy = getSorting(transformation);
    const where = generateFilters(afm);

    return {
        execution: {
            columns,
            definitions,
            orderBy,
            where
        }
    };
}

export function generateMetricDefinition(
    afm: IAfm,
    transformation: ITransformation,
    afmDataMap: AfmMap,
    item: IMeasure
): IDefinition {
    const { title, format } = getMeasureAdditionalInfo(transformation, item.id);

    return {
        metricDefinition: {
            expression: generateMetricExpression(item, afm, afmDataMap),
            identifier: item.id,
            title,
            format: getMeasureFormat(item, afm, format)
        }
    };
}

export function generateMetricExpression(item: IMeasure, afm: IAfm, afmDataMap: AfmMap): string {
    if (isPoP(item)) {
        return createPoPMetric(item, afm, afmDataMap);
    }

    if (isShowInPercent(item)) {
        const attributesUris = afm.attributes.map(
            attribute => afmDataMap.getAttributeByDisplayForm(attribute.id)
        );
        return getPercentMetricExpression(item, afmDataMap, attributesUris);
    }

    return getGeneratedMetricExpression(item, afmDataMap);
}

function getAttributeFilterExpression(filter: IAttributeFilter, afmDataMap: AfmMap): string {
    const elements = (filter as IPositiveAttributeFilter).in || (filter as INegativeAttributeFilter).notIn;

    if (isEmpty(elements)) {
        return null;
    }

    const id = afmDataMap.getAttributeByDisplayForm(filter.id);
    const inExpr = isNegativeAttributeFilter(filter) ? 'NOT IN' : 'IN';
    const elementsForQuery = elements.map(e => isUri(id) ? `[${id}/elements?id=${e}]` : `{${id}?${e}}`);
    return `${wrapId(id)} ${inExpr} (${elementsForQuery.join(',')})`;
}

function getDateFilterExpression(filter: IDateFilter, afmDataMap: AfmMap): string {
    const dateFilterRefData = afmDataMap.getDateAttribute(filter);

    let dateRange;
    if (isAbsoluteDateFilter(filter)) {
        const fromUri = getDateElementUri(dateFilterRefData, filter.between[0] as string);
        const toUri = getDateElementUri(dateFilterRefData, filter.between[1] as string);

        dateRange = `${wrapId(fromUri)} AND ${wrapId(toUri)}`;
    } else {
        dateRange = `THIS + (${filter.between[0]}) AND THIS + (${filter.between[1]})`;
    }

    return `(${wrapId(dateFilterRefData.dateAttributeUri)} BETWEEN ${dateRange})`;
}

function getFiltersExpression(item: IMeasure, afmDataMap: AfmMap) {
    const { filters = [] } = item.definition;

    const filterExpressions = filters.map((filter) => {
        if (isAttributeFilter(filter)) {
            return getAttributeFilterExpression(filter, afmDataMap);
        }
        if (isDateFilter(filter)) {
            return getDateFilterExpression(filter, afmDataMap);
        }

        return null;
    });

    const globalDateFilters = afmDataMap.getGlobalDateFilters();
    if (!isEmpty(globalDateFilters) && !filters.some(isDateFilter)) {
        filterExpressions.push(...globalDateFilters.map(
            dateFilter => getDateFilterExpression(dateFilter, afmDataMap)));
    }

    return compact(filterExpressions).join(' AND ');
}

function getSimpleMetricExpression(item: IMeasure, afmDataMap: AfmMap, includeFilters = true) {
    const { baseObject, aggregation } = item.definition;
    const filterExpression = includeFilters ? getFiltersExpression(item, afmDataMap) : null;
    const id = (baseObject as ISpecificObject).id;
    const wrappedIdentifier = wrapId(id);

    return `${aggregation ? `${aggregation.toUpperCase()}(${wrappedIdentifier})` : `${wrappedIdentifier}`
        }${filterExpression ? ` WHERE ${filterExpression}` : ''}`;
}

function getGeneratedMetricExpression(item: IMeasure, afmDataMap: AfmMap, includeFilters = true) {
    return `SELECT ${getSimpleMetricExpression(item, afmDataMap, includeFilters)}`;
}

function getPercentMetricExpression(item: IMeasure, afmDataMap: AfmMap, attributesUris: string[]) {
    const metricExpressionWithoutFilters = getGeneratedMetricExpression(item, afmDataMap, false);

    const filterExpression = getFiltersExpression(item, afmDataMap);
    const whereExpression = filterExpression ? ` WHERE ${filterExpression}` : '';

    const byAllExpression = attributesUris.map((attributeUri: string) => `ALL ${wrapId(attributeUri)}`).join(',');

    return `SELECT (${metricExpressionWithoutFilters}${whereExpression}) ` +
        `/ (${metricExpressionWithoutFilters} BY ${byAllExpression}${whereExpression})`;
}

function createPoPMetric(item: IMeasure, afm: IAfm, afmDataMap: AfmMap) {
    const baseObject = (item.definition.baseObject as ILookupObject);
    let generatedMetricExpression;
    if (baseObject.lookupId) {
        const base = afm.measures.find(measure => measure.id === baseObject.lookupId);
        generatedMetricExpression = `SELECT (${generateMetricExpression(base, afm, afmDataMap)})`;
    } else {
        generatedMetricExpression = `SELECT ${getSimpleMetricExpression(item, afmDataMap)}`;
    }
    const attributeUri = afmDataMap.getAttributeByDisplayForm(item.definition.popAttribute.id);

    return `${generatedMetricExpression} FOR PREVIOUS (${wrapId(attributeUri)})`;
}

export function getMeasureFormat(item: IMeasure, afm: IAfm, format: string = DEFAULT_METRIC_FORMAT): string {
    if (isPoP(item)) {
        const baseObject = item.definition.baseObject as any;

        // baseObject defined by lookupId can define eg. showInPercent
        if (baseObject.lookupId) {
            const base = afm.measures.find(measure => measure.id === baseObject.lookupId);
            return getMeasureFormat(base, afm, format);
        }
        // baseObject defined by URL have to use default format
        return format;
    }
    return (item.definition.showInPercent ? SHOW_IN_PERCENT_MEASURE_FORMAT : format);
}

export function generateColumns(afm: IAfm): string[] {
    const columns = [];
    /*
        we should use here 'transformation' to organize better attributes
        in exec request but /simpleexecutor is not able to handle it and also
        is not able to provide "well transformed" result data
     */
    columns.push(...afm.attributes.map(attribute => attribute.id));
    // Get columns
    columns.push(...afm.measures.map(item => item.id));

    return columns;
}

export function generateFilters(afm: IAfm) {
    return afm.filters.reduce((memo, filter) => {
        if (isDateFilter(filter) && !hasMetricDateFilters(afm)) {
            memo[filter.id] = generateDateFilter(filter);
        }

        if (isAttributeFilter(filter)) {
            const attrFilter = generateAttributeFilter(filter);
            if (attrFilter) {
                memo.$and.push({
                    [filter.id]: attrFilter
                });
            }
        }

        return memo;
    }, { $and: [] });
}

function generateDateFilter(filter: IDateFilter) {
    return {
        $between: [...filter.between],
        $granularity: `GDC.time.${filter.granularity}`
    };
}

function generateAttributeFilter(filter: IAttributeFilter) {
    if (isPositiveAttributeFilter(filter) && filter.in.length > 0) {
        return {
            $in: filter.in.map(id => ({ id }))
        };
    }

    if (isNegativeAttributeFilter(filter) && filter.notIn.length > 0) {
        return {
            $not: {
                $in: filter.notIn.map(id => ({ id }))
            }
        };
    }

    return null;
}

export interface IAdditionalInfo {
    title?: string;
    format?: string;
}

export function getMeasureAdditionalInfo(transformation: ITransformation, id: string): IAdditionalInfo  {
    const info = get(transformation, 'measures', []).find(measure => measure.id === id);
    return pick<IAdditionalInfo, {}>(info, ['title', 'format']);
}
