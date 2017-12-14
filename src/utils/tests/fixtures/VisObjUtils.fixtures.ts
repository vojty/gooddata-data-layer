import * as VisObj from '../../../converters/model/VisualizationObject';

export const ATTRIBUTE_DISPLAY_FORM_URI = '/gdc/md/project/obj/1';

const defaultBuckets: VisObj.IBuckets = {
    measures: [{
        measure: {
            measureFilters: [],
            objectUri: ATTRIBUTE_DISPLAY_FORM_URI,
            showInPercent: false,
            showPoP: false,
            title: 'COUNT of Measure M1',
            type: 'attribute',
            aggregation: 'count'
        }
    }, {
        measure: {
            measureFilters: [],
            objectUri: ATTRIBUTE_DISPLAY_FORM_URI,
            showInPercent: false,
            showPoP: true,
            title: 'COUNT of Measure M1',
            type: 'attribute',
            aggregation: 'count'
        }
    }, {
        measure: {
            measureFilters: [],
            objectUri: ATTRIBUTE_DISPLAY_FORM_URI,
            showInPercent: false,
            showPoP: false,
            title: 'COUNT of Measure M1',
            type: 'attribute',
            aggregation: 'count'
        }
    }],
    categories: [],
    filters: []
};

export const VIS_OBJECT_WITHOUT_TOTALS: VisObj.IVisualizationObjectContent = {
    type: 'table',
    buckets: {
        ...defaultBuckets
    }
};

export const VIS_OBJECT_WITH_TOTALS: VisObj.IVisualizationObjectContent = {
    type: 'table',
    buckets: {
        ...defaultBuckets,
        totals: [{
            total: {
                type: 'sum',
                outputMeasureIndexes: [0]
            }
        }, {
            total: {
                type: 'avg',
                outputMeasureIndexes: []
            }
        }, {
            total: {
                type: 'nat',
                outputMeasureIndexes: [1, 2]
            }
        }]
    }
};

export const VIS_OBJECT_WITH_EXTENDED_TOTALS: VisObj.IVisualizationObjectContent = {
    type: 'table',
    buckets: {
        ...defaultBuckets,
        totals: [{
            total: {
                type: 'sum',
                outputMeasureIndexes: [0, 1, 2, 3]
            }
        }, {
            total: {
                type: 'avg',
                outputMeasureIndexes: [0, 1, 2, 3]
            }
        }, {
            total: {
                type: 'nat',
                outputMeasureIndexes: [0, 1, 2, 3]
            }
        }]
    }
};
