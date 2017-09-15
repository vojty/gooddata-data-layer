import uniqBy = require('lodash/uniqBy');
import omitBy = require('lodash/omitBy');
import isUndefined = require('lodash/isUndefined');
import get = require('lodash/get');

import { ITransformation, ISort, IMeasure, IDimension } from '../interfaces/Transformation';

export function getSorting(transformation: ITransformation): ISort[] {
    return get(transformation, 'sorting', []);
}

/**
 * Merge two transformations into one, second one has higher priority
 */
export function combineTransformations(first: ITransformation = {}, second: ITransformation = {}): ITransformation {
    let measures;
    let sorting;
    let dimensions;

    // merge exsting properties
    if (first.measures || second.measures) {
        measures = uniqBy([
            ...get(second, 'measures', []),
            ...get(first, 'measures', [])], 'id') as IMeasure[];
    }
    if (first.sorting || second.sorting) {
        sorting = uniqBy([
            ...get(second, 'sorting', []),
            ...get(first, 'sorting', [])], 'column') as ISort[];
    }
    if (first.dimensions || second.dimensions) {
        dimensions = uniqBy([
            ...get(second, 'dimensions', []),
            ...get(first, 'dimensions', [])], 'name') as IDimension[];
    }

    // clear properties if empty in the second transformation
    if (second.measures && second.measures.length === 0) {
        measures = [];
    }
    if (second.sorting && second.sorting.length === 0) {
        sorting = [];
    }
    if (second.dimensions && second.dimensions.length === 0) {
        dimensions = [];
    }

    return omitBy({
        sorting,
        measures,
        dimensions
    }, isUndefined);
}
