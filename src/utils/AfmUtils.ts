import get = require('lodash/get');
import compact = require('lodash/compact');
import {
    IAfm, IDateFilter, IFilter, IAttributeFilter, IMeasure, IPositiveAttributeFilter,
    INegativeAttributeFilter
} from '../interfaces/Afm';

export function normalizeAfm(afm: IAfm): IAfm {
    return {
        attributes: afm.attributes || [],
        measures: afm.measures || [],
        filters: afm.filters || []
    };
}

export const isPoP = (item: IMeasure): boolean => {
    return !!(item.definition && item.definition.popAttribute);
};

export function hasMetricDateFilters(afm: IAfm): boolean {
    const normalizedAfm = normalizeAfm(afm);
    return normalizedAfm.measures.some((measure) => {
        if (!isPoP(measure)) {
            return !!measure.definition.filters && measure.definition.filters.some(isDateFilter);
        }
        return false;
    });
}

export function getInsightDateFilter(afm: IAfm): IDateFilter {
    if (afm.filters) {
        return afm.filters.find(isDateFilter) as IDateFilter;
    }
    return null;
}

export const isShowInPercent = (item: IMeasure): boolean => {
    return item.definition && item.definition.showInPercent;
};

export const hasFilters = (item: IMeasure): boolean => {
    return !!(item.definition && item.definition.filters);
};

export function isAttributeFilter(filter: IFilter): filter is IAttributeFilter {
    return filter.type === 'attribute';
}

export function isDateFilter(filter: IFilter): filter is IDateFilter {
    return filter.type === 'date' && filter.between[0] !== undefined &&
        filter.between[1] !== undefined;
}

export function isAbsoluteDateFilter(filter: IDateFilter) {
    return filter.intervalType === 'absolute';
}

export function isPositiveAttributeFilter(filter: IAttributeFilter): filter is IPositiveAttributeFilter {
    return (filter as IPositiveAttributeFilter).in !== undefined;
}

export function isNegativeAttributeFilter(filter: IAttributeFilter): filter is INegativeAttributeFilter {
    return (filter as INegativeAttributeFilter).notIn !== undefined;
}

export function hasInsightDateFilter(afm: IAfm): boolean {
    return afm.filters.some(isDateFilter);
}

/**
 * Append attribute filters and date filter to afm
 * Date filter handling:
 * * Override if date filter has the same id
 * * Add if date filter if date filter id is different
 * Attribute filter handling:
 * * Add all
 */
export const appendFilters = (afm: IAfm, attributeFilters: IAttributeFilter[], dateFilter: IDateFilter): IAfm => {
    const dateFilters = (dateFilter && dateFilter.granularity) ? [dateFilter] : [];
    const afmDateFilter = afm.filters && afm.filters.find(filter => filter.type === 'date') as IDateFilter;

    // all-time selected, need to delete date filter from filters
    let afmFilters = afm.filters || [];
    if (dateFilter && !dateFilter.granularity) {
        afmFilters = afmFilters.filter(filter => filter.id !== dateFilter.id);
    }

    if ((afmDateFilter && dateFilter && afmDateFilter.id !== dateFilter.id)
        || (afmDateFilter && !dateFilter)) {
        dateFilters.unshift(afmDateFilter);
    }

    const afmAttributeFilters = afmFilters.filter(filter => filter.type !== 'date');
    const filters = compact([
        ...afmAttributeFilters,
        ...attributeFilters,
        ...dateFilters
    ]) as IFilter[];

    return {
        ...afm,
        filters
    };
};

export function isAfmExecutable(afm: IAfm) {
    return get(afm, 'measures.length') > 0 || get(afm, 'attributes.length') > 0;
}
