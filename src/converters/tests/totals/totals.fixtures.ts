import {IVisualizationObjectContent} from '../../model/VisualizationObject';
import {IFixture} from '../fixtures/Afm.fixtures';

export const METRIC_ID_URI = '/gdc/md/project/obj/100';
export const METRIC_ID_URI_2 = '/gdc/md/project/obj/101';
export const ATTRIBUTE_DISPLAY_FORM_URI = '/gdc/md/project/obj/1';
export const ATTRIBUTE_URI = '/gdc/md/project/obj/11';
export const ATTRIBUTE_DISPLAY_FORM_URI_2 = '/gdc/md/project/obj/2';
export const ATTRIBUTE_URI_2 = '/gdc/md/project/obj/22';

export const executionWithTotals: IFixture = {
    afm: {
        attributes: [
            {
                localIdentifier: 'a1',
                displayForm: {
                    uri: ATTRIBUTE_DISPLAY_FORM_URI
                }
            },
            {
                localIdentifier: 'a2',
                displayForm: {
                    uri: ATTRIBUTE_DISPLAY_FORM_URI_2
                }
            }
        ],
        measures: [
            {
                localIdentifier: 'm1',
                alias: 'Sum of Σ Users enabled',
                definition: {
                    measure: {
                        item: {
                            uri: METRIC_ID_URI
                        }
                    }
                }
            },
            {
                localIdentifier: 'm2',
                alias: 'Count of Customer',
                definition: {
                    measure: {
                        item: {
                            uri: METRIC_ID_URI_2
                        }
                    }
                }
            }
        ],
        nativeTotals: [
            {
                measureIdentifier: 'm1',
                attributeIdentifiers: []
            },
            {
                measureIdentifier: 'm2',
                attributeIdentifiers: []
            }
        ]
    },
    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: ['a1', 'a2'],
                totals: [
                    {
                        measureIdentifier: 'm1',
                        type: 'avg',
                        attributeIdentifier: 'a1'
                    },
                    {
                        measureIdentifier: 'm2',
                        type: 'avg',
                        attributeIdentifier: 'a1'
                    },
                    {
                        measureIdentifier: 'm2',
                        type: 'max',
                        attributeIdentifier: 'a1'
                    },
                    {
                        measureIdentifier: 'm1',
                        type: 'nat',
                        attributeIdentifier: 'a1'
                    },
                    {
                        measureIdentifier: 'm2',
                        type: 'nat',
                        attributeIdentifier: 'a1'
                    }
                ]
            },
            {
                itemIdentifiers: ['measureGroup']
            }
        ]
    }
};

export const tableWithTotals: IVisualizationObjectContent = {
    type: 'table',
    buckets: {
        measures: [{
            measure: {
                showInPercent: false,
                objectUri: METRIC_ID_URI,
                showPoP: false,
                title: 'Sum of Σ Users enabled',
                type: 'fact',
                measureFilters: []
            }
        }, {
            measure: {
                showInPercent: false,
                objectUri: METRIC_ID_URI_2,
                showPoP: false,
                title: 'Count of Customer',
                type: 'attribute',
                measureFilters: []
            }
        }],
        categories: [{
            category: {
                type: 'attribute',
                collection: 'attribute',
                attribute: ATTRIBUTE_URI,
                displayForm: ATTRIBUTE_DISPLAY_FORM_URI
            }
        }, {
            category: {
                type: 'attribute',
                collection: 'attribute',
                attribute: ATTRIBUTE_URI_2,
                displayForm: ATTRIBUTE_DISPLAY_FORM_URI_2
            }
        }],
        filters: [],
        totals: [{
            total: {
                type: 'avg',
                outputMeasureIndexes: [0, 1]
            }
        }, {
            total: {
                type: 'max',
                outputMeasureIndexes: [1]
            }
        }, {
            total: {
                type: 'nat',
                outputMeasureIndexes: [0, 1]
            }
        }]
    }
};
