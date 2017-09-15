import {
    fetchMeasures,
    getAttributesMap
} from '../metadata';

import {
    CategoryCollection,
    CategoryType,
    EmbeddedDateFilterType, IAttributesMap,
    IMeasuresMap, IVisualizationObject, MeasureType,
    VisualizationType
} from '../../legacy/model/VisualizationObject';

import { empty } from '../../fixtures/VisualizationObject.fixtures';

describe('metadataHelpers', () => {
    const projectId = 'projectId';
    const m1Uri = '/m/1';
    const m2Uri = '/m/2';
    const m1Format = { format: '#.##1' };
    const m2Format = { format: '#.##2' };

    describe('fetchMeasures', () => {
        const sdkMockMetrics = {
            md: {
                getObjects: () => Promise.resolve([{
                    metric: {
                        content: m1Format,
                        meta: { uri: m1Uri }
                    }
                }, {
                    metric: {
                        content: m2Format,
                        meta: { uri: m2Uri }
                    }
                }])
            }
        };

        it('should return empty object if there are no measures', () => {
            return fetchMeasures(sdkMockMetrics, projectId, empty).then((result: IMeasuresMap) => {
                expect(result).toEqual({});
            });
        });

        it('should prepare mapping with formats for measures in md object', () => {
            const visualizationObject: IVisualizationObject = {
                meta: {
                    title: 'My vis. object'
                },
                content: {
                    type: 'column' as VisualizationType,
                    buckets: {
                        measures: [{
                            measure: {
                                type: 'metric' as MeasureType,
                                objectUri: m1Uri,
                                showInPercent: false,
                                showPoP: false,
                                title: 'metric 1',
                                measureFilters: []
                            }
                        }, {
                            measure: {
                                type: 'metric' as MeasureType,
                                objectUri: m2Uri,
                                showInPercent: false,
                                showPoP: false,
                                title: 'metric 2',
                                measureFilters: []
                            }
                        }],
                        categories: [],
                        filters: []
                    }
                }
            };

            return fetchMeasures(sdkMockMetrics, projectId, visualizationObject).then((result: IMeasuresMap) => {
                expect(result).toEqual({
                    '/m/1': { measure: m1Format },
                    '/m/2': { measure: m2Format }
                });
            });
        });
    });

    describe('getAttributesMap', () => {
        const yearUri = '/gdc/md/1';
        const dateUri = '/gdc/md/2';
        const sdkMockAttributes = {
            md: {
                getObjects: () => Promise.resolve([{
                    attribute: {
                        content: {
                            type: 'GDC.time.year',
                            displayForms: [{
                                meta: { uri: yearUri }
                            }]
                        }
                    }
                }])
            }
        };

        it('should return empty if no date filter present', () => {
            return getAttributesMap(sdkMockAttributes, projectId, empty).then((result: IAttributesMap) => {
                expect(result).toEqual({});
            });
        });

        it('should return empty if date filter in filter bucket', () => {
            const visualizationObject: IVisualizationObject = {
                meta: {
                    title: 'vis obj. with date filter'
                },
                content: {
                    type: 'column' as VisualizationType,
                    buckets: {
                        measures: [],
                        categories: [],
                        filters: [
                            {
                                dateFilter: {
                                    attribute: dateUri,
                                    type: 'relative' as EmbeddedDateFilterType,
                                    granularity: 'year'
                                }
                            }
                        ]
                    }
                }
            };

            return getAttributesMap(sdkMockAttributes, projectId, visualizationObject)
                .then((result: IAttributesMap) => {
                    expect(result).toEqual({ [dateUri]: yearUri });
                });
        });

        it('should return empty if date filter in categories', () => {
            const visualizationObject: IVisualizationObject = {
                meta: {
                    title: 'Vis obj. with date category'
                },
                content: {
                    type: 'column' as VisualizationType,
                    buckets: {
                        measures: [],
                        categories: [{
                            category: {
                                type: 'date' as CategoryType,
                                attribute: dateUri,
                                collection: 'view' as CategoryCollection,
                                displayForm: 'df/uri'
                            }
                        }],
                        filters: []
                    }
                }
            };

            return getAttributesMap(sdkMockAttributes, projectId, visualizationObject)
                .then((result: IAttributesMap) => {
                    expect(result).toEqual({
                        [dateUri]: yearUri
                    });
                });
        });
    });
});
