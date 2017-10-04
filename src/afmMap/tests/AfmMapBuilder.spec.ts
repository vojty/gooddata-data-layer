import flatMap = require('lodash/flatMap');
import { IAfm } from '../../interfaces/Afm';
import { AfmMapBuilder, lookupAttributes } from '../AfmMapBuilder';
import * as AfmFixtures from '../../fixtures/Afm.fixtures';
import * as DataSetFixtures from '../../fixtures/DataSet.fixtures';
import { normalizeAfm, getMeasureDateFilters } from '../../utils/AfmUtils';
import { IAttribute } from '../model/gooddata/Attribute';
import * as GoodData from 'gooddata';
import {IDateFilterRefData} from '../DateFilterMap';

const defaultObjectsResponse = {
    attributeDisplayForm: {
        content: {
            formOf: '/gdc/md/project/obj/11'
        },
        meta: {
            uri: '/gdc/md/project/obj/1',
            identifier: 'abcd1'
        }
    }
};

const dateAttribute: IAttribute = {
    attribute: {
        content: {
            type: 'GDC.time.date',
            displayForms : [
                {
                    content: {
                        type: 'GDC.time.day',
                        expression: 'xyz',
                        formOf: '/gdc/md/project/obj/15200',
                    },
                    links: {
                        elements: '/gdc/md/project/obj/15200/elements'
                    },
                    meta: {
                        uri: '/gdc/md/project/obj/15202',
                        title: 'Date DF'
                    }
                }
            ]
        },
        meta: {
            uri: '/gdc/md/project/obj/15200',
            title: 'Date'
        }
    }
};

const dateDataSetResponse = {
    dataSet: {
        content: {
            attributes: [
                '/gdc/md/project/obj/15200'
            ]
        }
    }
};

const getUrisFromIdentifiersResponse = [
    {
        uri: '/gdc/md/project/obj/1'
    }
];

const getElementLabelsToUrisResponse = [
    {
        mode : 'EXACT',
        labelUri : '/gdc/md/project/obj/15202',
        result : [
            {
                pattern : '2014-01-01',
                elementLabels : [
                    {
                        elementLabel : '2014-01-01',
                        uri : '/gdc/md/project/obj/15200/elements?id=41639'
                    }
                ]
            },
            {
                pattern : '2016-01-01',
                elementLabels : [
                    {
                        elementLabel : '2016-01-01',
                        uri : '/gdc/md/project/obj/15200/elements?id=42004'
                    }
                ]
            }
        ]
    }
];

const projectId = 'project';

 // tslint:disable-next-line:variable-name
const getObjectsResponse = (_projectId: string, uris: string[]) => {
    const results = flatMap(uris, (uri) => {
        switch (uri) {
            case DataSetFixtures.activityDateDataSet.dataSet.meta.uri: {
                return DataSetFixtures.activityDateDataSet;
            }
            case '/gdc/md/project/obj/15200': {
                return dateAttribute;
            }
            case '/gdc/md/project/obj/1':
            case '/gdc/md/project/obj/11': {
                return defaultObjectsResponse;
            }
            default: {
                return null;
            }
        }

    });
    return Promise.resolve(results);
};

const createSdkMock = (): typeof GoodData => {
    jest.spyOn(GoodData.md, 'getUrisFromIdentifiers')
        .mockImplementation(() => Promise.resolve(getUrisFromIdentifiersResponse));

    jest.spyOn(GoodData.md, 'getObjects')
        .mockImplementation(getObjectsResponse);

    jest.spyOn(GoodData.md, 'translateElementLabelsToUris')
        .mockImplementation(() => Promise.resolve(getElementLabelsToUrisResponse));

    jest.spyOn(GoodData.md, 'getObjectDetails')
        .mockImplementation(() => Promise.resolve(dateDataSetResponse));

    return GoodData;
};

describe('AfmMapBuilder', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('buildAttributeMap', () => {
        it('should return array with attributes and display forms for AFM with uris', () => {
            const sdk = createSdkMock();
            const afm: IAfm = {
                measures: [
                    {
                        id: 'measure_in_percent',
                        definition: {
                            baseObject: {
                                id: 'measure_identifier'
                            },
                            showInPercent: true
                        }
                    },
                    {
                        id: 'measure_pop',
                        definition: {
                            baseObject: {
                                lookupId: 'measure_in_percent'
                            },
                            popAttribute: {
                                id: '/gdc/md/project/obj/11'
                            }
                        }
                    }
                ],
                attributes: [
                    {
                        id: '/gdc/md/project/obj/11',
                        type: 'attribute'
                    }
                ]
            };
            const AfmDataMapBuilder = new AfmMapBuilder(sdk, projectId);
            return AfmDataMapBuilder.buildAttributeMap(afm).then((attributesMap) => {
                expect(sdk.md.getObjects).toHaveBeenCalled();
                expect(sdk.md.getUrisFromIdentifiers).not.toHaveBeenCalled();
                expect(attributesMap).toEqual([
                    {
                        attribute: '/gdc/md/project/obj/11',
                        attributeDisplayForm: '/gdc/md/project/obj/1'
                    }
                ]);
            });
        });

        it('should return array with attributes and display forms for AFM with identifiers', () => {
            const sdk = createSdkMock();
            const afm: IAfm = {
                measures: [
                    {
                        id: 'measure_in_percent',
                        definition: {
                            baseObject: {
                                id: 'measure_identifier'
                            },
                            showInPercent: true
                        }
                    },
                    {
                        id: 'measure_pop',
                        definition: {
                            baseObject: {
                                lookupId: 'measure_in_percent'
                            },
                            popAttribute: {
                                id: 'attrDfIdentifier'
                            }
                        }
                    }
                ],
                attributes: [
                    {
                        id: 'attrDfIdentifier',
                        type: 'attribute'
                    }
                ]
            };

            const afmDataMapBuilder = new AfmMapBuilder(sdk, projectId);
            return afmDataMapBuilder.buildAttributeMap(afm).then((attributesMap) => {
                expect(sdk.md.getObjects).toHaveBeenCalled();
                expect(sdk.md.getUrisFromIdentifiers).toHaveBeenCalled();
                expect(attributesMap).toEqual([
                    {
                        attribute: '/gdc/md/project/obj/11',
                        attributeDisplayForm: 'abcd1'
                    }
                ]);
            });
        });
    });

    describe('buildAttributeElements', () => {
        it('should return 2 element attributes', () => {
            const sdk = createSdkMock();
            const afmMapBuilder = new AfmMapBuilder(sdk, projectId);
            return afmMapBuilder.buildAttributeElements(['2014-01-01', '2016-01-01'],
                '/gdc/md/project/obj/15202')
                .then((attributeElements) => {
                    expect(sdk.md.translateElementLabelsToUris).toHaveBeenCalled();
                    expect(attributeElements).toEqual([
                        {
                            label: '2014-01-01',
                            uri: '/gdc/md/project/obj/15200/elements?id=41639'
                        },
                        {
                            label: '2016-01-01',
                            uri: '/gdc/md/project/obj/15200/elements?id=42004'
                        }
                    ]);
                });
        });
    });

    describe('buildDateFilterMap', () => {
        it('should return dateFilterMap', () => {
            const afm: IAfm = {
                measures: [
                    AfmFixtures.metricSum,
                    AfmFixtures.metricSum4
                ]
            };
            const sdk = createSdkMock();
            const afmMapBuilder = new AfmMapBuilder(sdk, projectId);
            return afmMapBuilder.buildDateFilterMap(normalizeAfm(afm))
                .then((dateFilterMap) => {
                    const result: IDateFilterRefData = {
                        attributeElements: [
                            {
                                label: '2014-01-01',
                                uri: '/gdc/md/project/obj/15200/elements?id=41639'
                            },
                            {
                                label: '2016-01-01',
                                uri: '/gdc/md/project/obj/15200/elements?id=42004'
                            }
                        ],
                        dateAttributeType: 'GDC.time.date',
                        dateAttributeUri: '/gdc/md/project/obj/15200',
                        dateDisplayFormUri: '/gdc/md/project/obj/15202',
                        dateDataSetId: '/gdc/md/project/obj/727'
                    };

                    expect(dateFilterMap).toEqual([ result]);
                });
        });

        it('should build afmMap with only global date filter data', () => {
            const afm: IAfm = {
                measures: [
                    AfmFixtures.metricSum
                ],
                filters: [
                    AfmFixtures.absoluteDateFilter1
                ]
            };

            const sdk = createSdkMock();
            const afmMapBuilder = new AfmMapBuilder(sdk, projectId);
            return afmMapBuilder.buildDateFilterMap(afm)
                .then((dateFilterMap) => {
                    expect(dateFilterMap).toEqual([]);
                });
        });
    });

    describe('buildDateRefData', () => {
        it('should build correct dateRefData', () => {
            const sdk = createSdkMock();
            const afmMapBuilder = new AfmMapBuilder(sdk, projectId);
            return afmMapBuilder.buildDateRefData(dateAttribute, [AfmFixtures.absoluteDateFilter1],
                DataSetFixtures.activityDateDataSet)
                .then((dateRefData) => {
                    expect(sdk.md.translateElementLabelsToUris).toHaveBeenCalled();
                    expect(dateRefData).toEqual({
                        attributeElements: [
                            {
                                label: '2014-01-01',
                                uri: '/gdc/md/project/obj/15200/elements?id=41639'
                            },
                            {
                                label: '2016-01-01',
                                uri: '/gdc/md/project/obj/15200/elements?id=42004'
                            }
                        ],
                        dateAttributeType: 'GDC.time.date',
                        dateAttributeUri: '/gdc/md/project/obj/15200',
                        dateDisplayFormUri: '/gdc/md/project/obj/15202',
                        dateDataSetId: '/gdc/md/project/obj/727',
                    });
                });
        });
    });

    describe('getMeasureDateFilters', () => {
        it('should find metric date filters', () => {
            const result = getMeasureDateFilters(normalizeAfm(AfmFixtures.afmWithMetricDateFilters));
            expect(result).toEqual([
                {
                    between: [-10, -9],
                    granularity: 'year',
                    id: DataSetFixtures.activityDateDataSet.dataSet.meta.uri,
                    intervalType: 'relative',
                    type: 'date'
                },
                {
                    between: ['2017-01-01', '2018-01-01'],
                    granularity: 'date',
                    id: DataSetFixtures.activityDateDataSet.dataSet.meta.uri,
                    intervalType: 'absolute',
                    type: 'date'
                }
            ]);
        });

        it('should NOT find metric date filters', () => {
            const result = getMeasureDateFilters(normalizeAfm(AfmFixtures.afmWithoutMetricDateFilters));
            expect(result).toEqual([]);
        });
    });

    describe('lookupAttributes', () => {
        it('should extract displayForm from showInPercent', () => {
            const showInPercentAfm: IAfm = {
                measures: [
                    {
                        id: 'close_bop_percent',
                        definition: {
                            baseObject: {
                                id: '/gdc/md/close_bop'
                            },
                            showInPercent: true
                        }
                    }
                ],
                attributes: [
                    {
                        id: '/gdc/md/date_display_form',
                        type: 'date'
                    }
                ]
            };

            expect(lookupAttributes(showInPercentAfm)).toEqual([
                '/gdc/md/date_display_form'
            ]);
        });

        it('should extract displayForm from PoP', () => {
            const simplePopAfm: IAfm = {
                measures: [
                    {
                        id: 'close_bop',
                        definition: {
                            baseObject: {
                                id: '/gdc/md/close_bop'
                            }
                        }
                    },
                    {
                        id: 'close_bop_pop',
                        definition: {
                            baseObject: {
                                id: '/gdc/md/close_bop'
                            },
                            popAttribute: {
                                id: '/gdc/md/date_display_form'
                            }
                        }
                    }
                ]
            };

            expect(lookupAttributes(simplePopAfm)).toEqual([
                '/gdc/md/date_display_form'
            ]);
        });

        it('should extract displayForm from metric filters', () => {
            const afm: IAfm = {
                measures: [
                    {
                        id: 'measure_with_filter',
                        definition: {
                            baseObject: {
                                id: '/gdc/md/close_bop'
                            },
                            filters: [{
                                id: '/gdc/md/attr_display_form',
                                type: 'attribute',
                                in: [
                                    '/gdc/md/attr?id=1',
                                    '/gdc/md/attr?id=2'
                                ]
                            }]
                        }
                    }
                ]
            };

            expect(lookupAttributes(afm)).toEqual([
                '/gdc/md/attr_display_form'
            ]);
        });

        it('should extract displayForm from metric with filters & showInPercent and attribute', () => {
            const popAfm: IAfm = {
                measures: [
                    {
                        id: 'measure_with_filter',
                        definition: {
                            baseObject: {
                                id: '/gdc/md/close_bop'
                            },
                            filters: [{
                                id: '/gdc/md/filter_attr_display_form',
                                type: 'attribute',
                                in: [
                                    '/gdc/md/attr?id=1',
                                    '/gdc/md/attr?id=2'
                                ]
                            }],
                            showInPercent: true
                        }
                    }
                ],
                attributes: [
                    {
                        id: '/gdc/md/attr_display_form',
                        type: 'attribute'
                    }
                ]
            };

            expect(lookupAttributes(popAfm)).toEqual([
                '/gdc/md/attr_display_form',
                '/gdc/md/filter_attr_display_form'
            ]);
        });

        it('should not extract displayForm for simple AFM', () => {
            const simpleAfm: IAfm = {
                measures: [
                    {
                        id: 'close_bop_percent',
                        definition: {
                            baseObject: {
                                id: '/gdc/md/close_bop/percent'
                            }
                        }
                    }
                ],
                attributes: [
                    {
                        id: '/gdc/md/date_display_form',
                        type: 'date'
                    }
                ]
            };

            expect(lookupAttributes(simpleAfm)).toEqual([]);
        });
    });
});
