import { uniqBy, omitBy, isUndefined, get } from 'lodash';
import { ITransformation, ISort, IMeasure, IBucket } from '../interfaces/Transformation';

/**
 * Merge two transformations into one, second one has higher priority
 */
export function combineTransformations(first: ITransformation = {}, second: ITransformation = {}): ITransformation {
    let measures;
    let sorting;
    let buckets;

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
    if (first.buckets || second.buckets) {
        buckets = uniqBy([
            ...get(second, 'buckets', []),
            ...get(first, 'buckets', [])], 'name') as IBucket[];
    }

    // clear properties if empty in the second transformation
    if (second.measures && second.measures.length === 0) {
        measures = [];
    }
    if (second.sorting && second.sorting.length === 0) {
        sorting = [];
    }
    if (second.buckets && second.buckets.length === 0) {
        buckets = [];
    }

    return omitBy({
        sorting,
        measures,
        buckets
    }, isUndefined);
}
