import { SHOW_IN_PERCENT_MEASURE_FORMAT, DEFAULT_METRIC_FORMAT } from '../../constants/formats';
import { IAfm, IMeasure } from '../../interfaces/Afm';
import { ITransformation } from '../../interfaces/Transformation';
import {
    buildRequest,
    generateFilters, generateMetricDefinition,
    generateMetricExpression, getMeasureAdditionalInfo,
    getMeasureFormat
} from '../ExecutionRequestBuilder';
import { AfmMap } from '../../afmMap/AfmMap';
import { normalizeAfm } from '../../utils/AfmUtils';
import {
    absoluteDateFilter1, afmWithMetricDateFilters, metric2_sum, metric3_sum, metric_in_percent, metric_in_percent_pop,
    metric_sum,
    relativeDateFilter, afmWithTwoDimensions
} from '../../fixtures/Afm.fixtures';
import { afmDataMap1, afmDataMap2, afmDataMap3 } from '../../fixtures/AfmMap.fixtures';
import {simpleTransformation} from '../../fixtures/Transformation.fixtures';

describe('buildRequest', () => {
    it('should build config one simple metric', () => {
        const afm: IAfm = {
            measures: [
                metric_sum
            ]
        };

        const executionRequest = buildRequest(normalizeAfm(afm), {}, new AfmMap());
        expect(executionRequest).toMatchSnapshot();
    });

    it('should build config with metric and relative global date filter', () => {
        const afm: IAfm = {
            measures: [
                metric_sum
            ],
            filters: [
                relativeDateFilter
            ]
        };

        const executionRequest = buildRequest(normalizeAfm(afm), {}, new AfmMap());
        expect(executionRequest).toMatchSnapshot();
    });

    it('should build config with metric and absolute global date filter', () => {
        const afm: IAfm = {
            measures: [
                metric_sum
            ],
            filters: [
                absoluteDateFilter1
            ]
        };

        const executionRequest = buildRequest(normalizeAfm(afm), {}, afmDataMap1);
        expect(executionRequest).toMatchSnapshot();
    });

    it('should build config with metrics and different date filters', () => {
        const executionRequest = buildRequest(normalizeAfm(afmWithMetricDateFilters), {}, afmDataMap2);
        expect(executionRequest).toMatchSnapshot();
    });

    it('should build config without global date filter', () => {
        const afm: IAfm = {
            measures: [
                metric_sum,
                metric2_sum,
                metric3_sum
            ]
        };

        const executionRequest = buildRequest(normalizeAfm(afm), {}, afmDataMap1);
        expect(executionRequest).toMatchSnapshot();
    });

    it('should build config for pop metric with global and date filter', () => {
        const afm: IAfm = {
            measures: [
                metric_in_percent,
                metric_in_percent_pop
            ],
            filters: [
                absoluteDateFilter1
            ]
        };

        const executionRequest = buildRequest(normalizeAfm(afm), {}, afmDataMap2);
        expect(executionRequest).toMatchSnapshot();
    });

    it('should build config with 2 date dimensions in one metric expression', () => {
        const normalizedAfm: IAfm = normalizeAfm(afmWithTwoDimensions);
        const executionRequest = buildRequest(normalizedAfm, simpleTransformation, afmDataMap3);
        expect(executionRequest).toMatchSnapshot();
    });
});

describe('generateMetricExpression', () => {
    it('should generate metric with aggregation and uri', () => {
        const afm: IAfm = {
            measures: [{
                id: 'metric_sum',
                definition: {
                    baseObject: {
                        id: '/gdc/md/measure/obj/1'
                    },
                    aggregation: 'sum'
                }
            }]
        };
        expect(generateMetricExpression(afm.measures[0], afm, new AfmMap())).toEqual(
            'SELECT SUM([/gdc/md/measure/obj/1])'
        );
    });

    it('should generate metric with aggregation and identifier', () => {
        const afm: IAfm = {
            measures: [{
                id: 'metric_sum',
                definition: {
                    baseObject: {
                        id: 'identifier'
                    },
                    aggregation: 'sum'
                }
            }]
        };
        expect(generateMetricExpression(afm.measures[0], afm, new AfmMap())).toEqual(
            'SELECT SUM({identifier})'
        );
    });

    it('should generate metric with empty filter and uri', () => {
        const afm: IAfm = {
            measures: [{
                id: 'metric_empty_filter',
                definition: {
                    baseObject: {
                        id: '/gdc/md/measure/obj/1'
                    },
                    filters: [
                        {
                            id: '/uri',
                            type: 'attribute',
                            in: []
                        }
                    ]
                }
            }]
        };
        expect(generateMetricExpression(afm.measures[0], afm, new AfmMap())).toEqual(
            'SELECT [/gdc/md/measure/obj/1]'
        );
    });

    it('should generate metric with empty filter and identifier', () => {
        const afm: IAfm = {
            measures: [{
                id: 'metric_empty_filter',
                definition: {
                    baseObject: {
                        id: 'identifier'
                    },
                    filters: [
                        {
                            id: '/uri',
                            type: 'attribute',
                            in: []
                        }
                    ]
                }
            }]
        };
        expect(generateMetricExpression(afm.measures[0], afm, new AfmMap())).toEqual(
            'SELECT {identifier}'
        );
    });

    it('should generate metric with filters and uris', () => {
        const afm: IAfm = {
            measures: [
                {
                    id: 'metric_with_filters',
                    definition: {
                        baseObject: {
                            id: '/gdc/md/measure/obj/1'
                        },
                        filters: [{
                            id: '/gdc/md/filter_attr_display_form1/obj/1',
                            type: 'attribute',
                            in: [
                                '1',
                                '2'
                            ]
                        }, {
                            id: '/gdc/md/filter_attr_display_form2/obj/1',
                            type: 'attribute',
                            in: [
                                '1',
                                '2'
                            ]
                        }]
                    }
                }
            ]
        };

        const afmDataMap = new AfmMap([
            [
                {
                    attribute: '/gdc/md/filter_attr1/obj/1',
                    attributeDisplayForm: '/gdc/md/filter_attr_display_form1/obj/1'
                },
                {
                    attribute: '/gdc/md/filter_attr2/obj/1',
                    attributeDisplayForm: '/gdc/md/filter_attr_display_form2/obj/1'
                }
            ],
            []
        ]);

        expect(generateMetricExpression(afm.measures[0], afm, afmDataMap)).toEqual(
            'SELECT [/gdc/md/measure/obj/1] ' +
            'WHERE [/gdc/md/filter_attr1/obj/1] ' +
            'IN ([/gdc/md/filter_attr1/obj/1/elements?id=1],[/gdc/md/filter_attr1/obj/1/elements?id=2]) ' +
            'AND [/gdc/md/filter_attr2/obj/1] ' +
            'IN ([/gdc/md/filter_attr2/obj/1/elements?id=1],[/gdc/md/filter_attr2/obj/1/elements?id=2])'
        );
    });

    it('should generate metric with filters and identifiers', () => {
        const afm: IAfm = {
            measures: [
                {
                    id: 'metric_with_filters',
                    definition: {
                        baseObject: {
                            id: 'measureIdentifier'
                        },
                        filters: [{
                            id: 'attribute_display_form_identifier_1',
                            type: 'attribute',
                            in: [
                                '1',
                                '2'
                            ]
                        }, {
                            id: 'attribute_display_form_identifier_2',
                            type: 'attribute',
                            in: [
                                '1',
                                '2'
                            ]
                        }]
                    }
                }
            ]
        };

        const afmDataMap = new AfmMap([
            [
                {
                    attribute: 'attribute_identifier_1',
                    attributeDisplayForm: 'attribute_display_form_identifier_1'
                },
                {
                    attribute: 'attribute_identifier_2',
                    attributeDisplayForm: 'attribute_display_form_identifier_2'
                }
            ],
            []
        ]);

        expect(generateMetricExpression(afm.measures[0], afm, afmDataMap)).toEqual(
            'SELECT {measureIdentifier} ' +
            'WHERE {attribute_identifier_1} ' +
            'IN ({attribute_identifier_1?1},{attribute_identifier_1?2}) ' +
            'AND {attribute_identifier_2} ' +
            'IN ({attribute_identifier_2?1},{attribute_identifier_2?2})'
        );
    });

    it('should generate PoP with uris', () => {
        const afm: IAfm = {
            measures: [
                {
                    id: 'm1',
                    definition: {
                        baseObject: {
                            id: '/gdc/md/measure/obj/1'
                        }
                    }
                },
                {
                    id: 'close_bop_pop',
                    definition: {
                        baseObject: {
                            id: '/gdc/md/measure/obj/1'
                        },
                        popAttribute: {
                            id: '/gdc/md/date_display_form/obj/1'
                        }
                    }
                }
            ],
            attributes: [

            ]
        };

        const afmDataMap = new AfmMap([
            [{
                attribute: '/gdc/md/date_attribute/obj/1',
                attributeDisplayForm: '/gdc/md/date_display_form/obj/1'
            }],
            []
        ]);

        expect(generateMetricExpression(afm.measures[1], afm, afmDataMap)).toEqual(
            'SELECT [/gdc/md/measure/obj/1] FOR PREVIOUS ([/gdc/md/date_attribute/obj/1])'
        );
    });

    it('should generate PoP with identifiers', () => {
        const afm: IAfm = {
            measures: [
                {
                    id: 'm1',
                    definition: {
                        baseObject: {
                            id: 'measure_identifier'
                        }
                    }
                },
                {
                    id: 'close_bop_pop',
                    definition: {
                        baseObject: {
                            id: 'measure_identifier'
                        },
                        popAttribute: {
                            id: 'attribute_display_form_identifier'
                        }
                    }
                }
            ],
            attributes: [

            ]
        };

        const afmDataMap = new AfmMap([
            [{
                attribute: 'attribute_identifier',
                attributeDisplayForm: 'attribute_display_form_identifier'
            }],
            []
        ]);
        expect(generateMetricExpression(afm.measures[1], afm, afmDataMap)).toEqual(
            'SELECT {measure_identifier} FOR PREVIOUS ({attribute_identifier})'
        );
    });

    it('should generate showInPercent with uris', () => {
        const afm: IAfm = {
            measures: [
                {
                    id: 'close_bop_percent',
                    definition: {
                        baseObject: {
                            id: '/gdc/md/measure/obj/1'
                        },
                        showInPercent: true
                    }
                }
            ],
            attributes: [
                {
                    id: '/gdc/md/attribute_display_form/obj/1',
                    type: 'attribute'
                }
            ]
        };

        const afmDataMap = new AfmMap([
            [{
                attribute: '/gdc/md/attribute/obj/1',
                attributeDisplayForm: '/gdc/md/attribute_display_form/obj/1'
            }],
            []
        ]);

        expect(generateMetricExpression(afm.measures[0], afm, afmDataMap)).toEqual(
            'SELECT (SELECT [/gdc/md/measure/obj/1]) / (SELECT [/gdc/md/measure/obj/1] ' +
            'BY ALL [/gdc/md/attribute/obj/1])'
        );
    });

    it('should generate showInPercent with identifiers', () => {
        const afm: IAfm = {
            measures: [
                {
                    id: 'close_bop_percent',
                    definition: {
                        baseObject: {
                            id: 'measure_identifier'
                        },
                        showInPercent: true
                    }
                }
            ],
            attributes: [
                {
                    id: 'attribute_display_form_identifier',
                    type: 'attribute'
                }
            ]
        };

        const afmDataMap = new AfmMap([
            [{
                attribute: 'attribute_identifier',
                attributeDisplayForm: 'attribute_display_form_identifier'
            }],
            []
        ]);

        expect(generateMetricExpression(afm.measures[0], afm, afmDataMap)).toEqual(
            'SELECT (SELECT {measure_identifier}) / (SELECT {measure_identifier} ' +
            'BY ALL {attribute_identifier})'
        );
    });

    it('should generate showInPercent with filters and uris', () => {
        const afm: IAfm = {
            measures: [
                {
                    id: 'close_bop_percent',
                    definition: {
                        baseObject: {
                            id: '/gdc/md/measure/obj/1'
                        },
                        filters: [{
                            id: '/gdc/md/filter_attr_display_form/obj/1',
                            type: 'attribute',
                            in: [
                                '1',
                                '2'
                            ]
                        }],
                        showInPercent: true
                    }
                }
            ],
            attributes: [
                {
                    id: '/gdc/md/attribute_display_form/obj/1',
                    type: 'attribute'
                }
            ]
        };

        const afmDataMap = new AfmMap([
            [
                {
                    attribute: '/gdc/md/attribute/obj/1',
                    attributeDisplayForm: '/gdc/md/attribute_display_form/obj/1'
                },
                {
                    attribute: '/gdc/md/filter_attr/obj/1',
                    attributeDisplayForm: '/gdc/md/filter_attr_display_form/obj/1'
                }
            ],
            []
        ]);

        expect(generateMetricExpression(afm.measures[0], afm, afmDataMap)).toEqual(
            'SELECT ' +
            '(SELECT [/gdc/md/measure/obj/1] ' +
                'WHERE [/gdc/md/filter_attr/obj/1] ' +
                'IN ([/gdc/md/filter_attr/obj/1/elements?id=1],[/gdc/md/filter_attr/obj/1/elements?id=2])) ' +
            '/ ' +
            '(SELECT [/gdc/md/measure/obj/1] ' +
                'BY ALL [/gdc/md/attribute/obj/1] ' +
                'WHERE [/gdc/md/filter_attr/obj/1] ' +
                'IN ([/gdc/md/filter_attr/obj/1/elements?id=1],[/gdc/md/filter_attr/obj/1/elements?id=2]))'
        );
    });

    it('should generate showInPercent with filters and identifiers', () => {
        const afm: IAfm = {
            measures: [
                {
                    id: 'close_bop_percent',
                    definition: {
                        baseObject: {
                            id: 'measure_identifier'
                        },
                        filters: [{
                            id: 'filter_attr_display_form_identifier',
                            type: 'attribute',
                            in: [
                                '1',
                                '2'
                            ]
                        }],
                        showInPercent: true
                    }
                }
            ],
            attributes: [
                {
                    id: 'attribute_display_form_identifier',
                    type: 'attribute'
                }
            ]
        };

        const afmDataMap = new AfmMap([
            [
                {
                    attribute: 'attribute_identifier',
                    attributeDisplayForm: 'attribute_display_form_identifier'
                },
                {
                    attribute: 'filter_attribute_identifier',
                    attributeDisplayForm: 'filter_attr_display_form_identifier'
                }
            ],
            []
        ]);

        expect(generateMetricExpression(afm.measures[0], afm, afmDataMap)).toEqual(
            'SELECT ' +
            '(SELECT {measure_identifier} ' +
            'WHERE {filter_attribute_identifier} ' +
            'IN ({filter_attribute_identifier?1},{filter_attribute_identifier?2})) ' +
            '/ ' +
            '(SELECT {measure_identifier} ' +
            'BY ALL {attribute_identifier} ' +
            'WHERE {filter_attribute_identifier} ' +
            'IN ({filter_attribute_identifier?1},{filter_attribute_identifier?2}))'
        );
    });

    it('should generate PoP & showInPercent (referenced definitions) with uris', () => {
        const afm: IAfm = {
            measures: [
                {
                    id: 'measure_in_percent',
                    definition: {
                        baseObject: {
                            id: '/gdc/md/measure/obj/1'
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
                            id: '/gdc/md/attribute_display_form/obj/1'
                        }
                    }
                }
            ],
            attributes: [
                {
                    id: '/gdc/md/attribute_display_form/obj/1',
                    type: 'date'
                }
            ]
        };

        const afmDataMap = new AfmMap([
            [{
                attribute: '/gdc/md/attribute/obj/1',
                attributeDisplayForm: '/gdc/md/attribute_display_form/obj/1'
            }],
            []
        ]);

        expect(generateMetricExpression(afm.measures[0], afm, afmDataMap)).toEqual(
            'SELECT (SELECT [/gdc/md/measure/obj/1]) / (SELECT [/gdc/md/measure/obj/1] ' +
            'BY ALL [/gdc/md/attribute/obj/1])'
        );
        expect(generateMetricExpression(afm.measures[1], afm, afmDataMap)).toEqual(
            'SELECT (SELECT (SELECT [/gdc/md/measure/obj/1]) ' +
            '/ (SELECT [/gdc/md/measure/obj/1] BY ALL [/gdc/md/attribute/obj/1])) ' +
            'FOR PREVIOUS ([/gdc/md/attribute/obj/1])'
        );
    });

    it('should generate PoP & showInPercent (referenced definitions) with identifiers', () => {
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
                            id: 'attribute_display_form_identifier'
                        }
                    }
                }
            ],
            attributes: [
                {
                    id: 'attribute_display_form_identifier',
                    type: 'attribute'
                }
            ]
        };

        const afmDataMap = new AfmMap([
            [{
                attribute: 'attribute_identifier',
                attributeDisplayForm: 'attribute_display_form_identifier'
            }],
            []
        ]);

        expect(generateMetricExpression(afm.measures[0], afm, afmDataMap)).toEqual(
            'SELECT (SELECT {measure_identifier}) / (SELECT {measure_identifier} ' +
            'BY ALL {attribute_identifier})'
        );
        expect(generateMetricExpression(afm.measures[1], afm, afmDataMap)).toEqual(
            'SELECT (SELECT (SELECT {measure_identifier}) ' +
            '/ (SELECT {measure_identifier} BY ALL {attribute_identifier})) ' +
            'FOR PREVIOUS ({attribute_identifier})'
        );
    });
});

describe('getMeasureAdditionalInfo', () => {
    it('should generate measure info with titles and formats', () => {
        const transformation: ITransformation = {
            measures: [
                {
                    id: 'a',
                    title: 'A',
                    format: 'fA'
                },
                {
                    id: 'b',
                    title: 'B',
                    format: 'fB'
                }
            ]
        };

        expect(getMeasureAdditionalInfo(transformation, 'a')).toEqual({
            title: 'A',
            format: 'fA'
        });

        expect(getMeasureAdditionalInfo(transformation, 'b')).toEqual({
            title: 'B',
            format: 'fB'
        });
    });
});

describe('generateMetricDefinition', () => {
    it('should generate metric definition with given format for normal measure', () => {
        const afm: IAfm = {
            measures: [
                {
                    id: 'close_bop',
                    definition: {
                        baseObject: {
                            id: '/gdc/md/measure/obj/2'
                        }
                    }
                }
            ],
            attributes: [
                {
                    id: '/gdc/md/attribute_display_form/obj/1',
                    type: 'attribute'
                }
            ]
        };

        const transformation: ITransformation = {
            measures: [
                { id: 'close_bop', title: 'Measure', format: '#,##0.00' }
            ]
        };

        const afmMap = new AfmMap([
            [{
                attribute: '/gdc/md/attribute/obj/123',
                attributeDisplayForm: '/gdc/md/attribute_display_form/obj/1'
            }],
            []
        ]);

        expect(generateMetricDefinition(afm, transformation, afmMap, afm.measures[0])).toEqual({
            metricDefinition: {
                expression: 'SELECT [/gdc/md/measure/obj/2]',
                format: '#,##0.00',
                identifier: 'close_bop',
                title: 'Measure'
            }
        });
    });

    it('should generate metric definition with special format for show in percent measure', () => {
        const afm: IAfm = {
            measures: [
                {
                    id: 'close_bop_percent',
                    definition: {
                        baseObject: {
                            id: '/gdc/md/measure/obj/2'
                        },
                        showInPercent: true
                    }
                }
            ],
            attributes: [
                {
                    id: '/gdc/md/attribute_display_form/obj/1',
                    type: 'attribute'
                }
            ]
        };

        const transformation: ITransformation = {
            measures: [
                { id: 'close_bop_percent', title: '% Measure', format: '#,##0.00' }
            ]
        };

        const afmDataMap = new AfmMap([[
            {
                attribute: '/gdc/md/attribute/obj/123',
                attributeDisplayForm: '/gdc/md/attribute_display_form/obj/1'
            }],
            []
        ]);

        expect(generateMetricDefinition(afm, transformation, afmDataMap, afm.measures[0])).toEqual({
            metricDefinition: {
                expression: 'SELECT (SELECT [/gdc/md/measure/obj/2]) / '
                + '(SELECT [/gdc/md/measure/obj/2] BY ALL [/gdc/md/attribute/obj/123])',
                format: SHOW_IN_PERCENT_MEASURE_FORMAT,
                identifier: 'close_bop_percent',
                title: '% Measure'
            }
        });
    });
});

describe('generateFilters', () => {
    it('should generate date and attribute filters', () => {
        const afm: IAfm = {
            filters: [
                {
                    id: '/gdc/md/datefilter/obj/1',
                    type: 'date',
                    intervalType: 'relative',
                    between: [0, 12],
                    granularity: 'year'
                },
                {
                    id: '/gdc/md/attribute1/obj/1',
                    type: 'attribute',
                    in: [
                        'a',
                        'b'
                    ]
                },
                {
                    id: '/gdc/md/attribute2/obj/1',
                    type: 'attribute',
                    notIn: [
                        'c',
                        'd'
                    ]
                },
                {
                    id: '/gdc/attribute2',
                    type: 'attribute',
                    notIn: []
                }
            ]
        };

        expect(generateFilters(normalizeAfm(afm))).toEqual(
            {
                $and: [{
                    '/gdc/md/attribute1/obj/1': {
                        $in: [{
                            id: 'a'
                        }, {
                            id: 'b'
                        }]
                    }
                }, {
                    '/gdc/md/attribute2/obj/1': {
                        $not: {
                            $in: [{
                                id: 'c'
                            }, {
                                id: 'd'
                            }]
                        }
                    }
                }],
                '/gdc/md/datefilter/obj/1': {
                    $between: [0, 12],
                    $granularity: 'GDC.time.year'
                }
            }
        );
    });
});

describe('getMeasureFormat', () => {
    it('should return default format', () => {
        const afm: IAfm = {
            measures: [
                {
                    id: 'close_bop',
                    definition: {
                        baseObject: {
                            id: '/gdc/md/measure/obj/2'
                        }
                    }
                }
            ],
            attributes: [
                {
                    id: '/gdc/md/attribute_display_form/obj/1',
                    type: 'attribute'
                }
            ]
        };

        const measure: IMeasure = afm.measures[0];
        const defaultFormat = '#,##0.00000';
        expect(getMeasureFormat(measure, afm, defaultFormat)).toEqual('#,##0.00000');
    });

    it('should return default format if no format provided', () => {
        const afm: IAfm = {
            measures: [
                {
                    id: 'close_bop',
                    definition: {
                        baseObject: {
                            id: '/gdc/md/measure/obj/2'
                        }
                    }
                }
            ],
            attributes: [
                {
                    id: '/gdc/md/attribute_display_form/obj/1',
                    type: 'attribute'
                }
            ]
        };

        const measure: IMeasure = afm.measures[0];
        expect(getMeasureFormat(measure, afm)).toEqual(DEFAULT_METRIC_FORMAT);
    });

    it('should return default format for PoP metric', () => {
        const afm: IAfm = {
            measures: [
                {
                    id: 'close_bop',
                    definition: {
                        baseObject: {
                            id: '/gdc/md/measure/obj/2'
                        }
                    }
                },
                {
                    id: 'close_bop_pop',
                    definition: {
                        baseObject: {
                            lookupId: 'close_bop'
                        },
                        popAttribute: {
                            id: '/gdc/md/date_display_form'
                        }
                    }
                }
            ],
            attributes: [
                {
                    id: '/gdc/md/attribute_display_form/obj/1',
                    type: 'attribute'
                }
            ]
        };

        const measure: IMeasure = afm.measures[1];
        const defaultFormat = '#,##0.00000';
        expect(getMeasureFormat(measure, afm, defaultFormat)).toEqual('#,##0.00000');
    });

    it('should return % format for metric with showInPercent: true', () => {
        const afm: IAfm = {
            measures: [
                {
                    id: 'close_bop_percent',
                    definition: {
                        baseObject: {
                            id: '/gdc/md/measure/obj/2'
                        },
                        showInPercent: true
                    }
                }
            ],
            attributes: [
                {
                    id: '/gdc/md/attribute_display_form/obj/1',
                    type: 'attribute'
                }
            ]
        };

        const measure: IMeasure = afm.measures[0];
        const defaultFormat = '#,##0.00000';
        expect(getMeasureFormat(measure, afm, defaultFormat)).toEqual(SHOW_IN_PERCENT_MEASURE_FORMAT);
    });

    it('should return % format for PoP derived from metric with showInPercent: true', () => {
        const afm: IAfm = {
            measures: [
                {
                    id: 'close_bop_percent',
                    definition: {
                        baseObject: {
                            id: '/gdc/md/measure/obj/2'
                        },
                        showInPercent: true
                    }
                },
                {
                    id: 'close_bop_percent_pop',
                    definition: {
                        baseObject: {
                            lookupId: 'close_bop_percent'
                        },
                        popAttribute: {
                            id: '/gdc/md/date_display_form'
                        }
                    }
                }
            ],
            attributes: [
                {
                    id: '/gdc/md/attribute_display_form/obj/1',
                    type: 'attribute'
                }
            ]
        };

        const measure: IMeasure = afm.measures[1];
        const defaultFormat = '#,##0.00000';
        expect(getMeasureFormat(measure, afm, defaultFormat)).toEqual(SHOW_IN_PERCENT_MEASURE_FORMAT);
    });
});
