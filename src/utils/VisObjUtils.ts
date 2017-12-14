import * as VisObj from '../converters/model/VisualizationObject';
import {isEmpty, range, cloneDeep} from 'lodash';

/**
 * Extend table totals in visualization object to request all totals data for all measures included in object.
 *
 * Usage: It helps to improve UX experience where values are pre-loaded.
 *
 * @param {IVisualizationObjectContent} visObj
 * @returns {IVisualizationObjectContent}
 */
export function extendVisObjectTotals(visObj: VisObj.IVisualizationObjectContent): VisObj.IVisualizationObjectContent {
    if (isEmpty(visObj.buckets.totals)) {
        return visObj;
    }

    const newVisObj = cloneDeep(visObj);

    const measures = newVisObj.buckets.measures;
    const measureCount = measures.length + getMeasurePopCount(measures);

    newVisObj.buckets.totals.forEach((visTotal) => {
        visTotal.total.outputMeasureIndexes = range(measureCount);
    });

    return newVisObj;
}

function getMeasurePopCount(measures: VisObj.IMeasure[]) {
    return measures.filter(measure => measure.measure.showPoP).length;
}
