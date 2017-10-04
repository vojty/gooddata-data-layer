import { IAfm, IDateFilter, IMeasure } from '../interfaces/Afm';
import * as DataSetFixtures from '../fixtures/DataSet.fixtures';

export const absoluteDateFilter1: IDateFilter = {
    id: DataSetFixtures.activityDateDataSet.dataSet.meta.uri,
    type: 'date',
    intervalType: 'absolute',
    between: ['2014-01-01', '2016-01-01'],
    granularity: 'date'
};

export const absoluteDateFilter2: IDateFilter = {
    id: DataSetFixtures.activityDateDataSet.dataSet.meta.uri,
    type: 'date',
    intervalType: 'absolute',
    between: ['2017-01-01', '2018-01-01'],
    granularity: 'date'
};

export const relativeDateFilter: IDateFilter = {
    id: DataSetFixtures.activityDateDataSet.dataSet.meta.uri,
    type: 'date',
    intervalType: 'relative',
    between: [-10, -9],
    granularity: 'year'
};

export const metricSum: IMeasure = {
    id: 'metric_sum',
    definition: {
        baseObject: {
            id: '/gdc/md/measure/obj/1'
        },
        aggregation: 'sum'
    }
};

export const metricSum2: IMeasure = {
    id: 'metric_sum_2',
    definition: {
        baseObject: {
            id: '/gdc/md/measure/obj/2'
        },
        filters: [relativeDateFilter],
        aggregation: 'sum'
    }
};

export const metricSum3: IMeasure = {
    id: 'metric_sum_3',
    definition: {
        baseObject: {
            id: '/gdc/md/measure/obj/3'
        },
        filters: [absoluteDateFilter2],
        aggregation: 'sum'
    }
};

export const metricSum4: IMeasure = {
    id: 'metric_sum_4',
    definition: {
        baseObject: {
            id: '/gdc/md/measure/obj/4'
        },
        filters: [absoluteDateFilter1],
        aggregation: 'sum'
    }
};

export const metricInPercent: IMeasure = {
    id: 'measure_in_percent',
    definition: {
        baseObject: {
            id: 'measure_identifier'
        },
        showInPercent: true,
        filters: [
            relativeDateFilter
        ]
    }
};

export const metricInPercentPop: IMeasure = {
    id: 'measure_pop',
    definition: {
        baseObject: {
            lookupId: 'measure_in_percent'
        },
        popAttribute: {
            id: 'attribute_display_form_identifier'
        }
    }
};

export const afmWithMetricDateFilter: IAfm = {
    measures: [
        metricSum,
        metricSum2
    ],
    filters: [
        absoluteDateFilter1
    ]
};

export const afmWithMetricDateFilters: IAfm = {
    measures: [
        metricSum,
        metricSum2,
        metricSum3
    ],
    filters: [
        absoluteDateFilter1
    ]
};

export const afmWithoutMetricDateFilters: IAfm = {
    measures: [
        metricSum,
        {
            id: 'metric4_sum',
            definition: {
                baseObject: {
                    id: '/gdc/md/measure/obj/4'
                },
                filters: [],
                aggregation: 'sum'
            }
        }, {
            id: 'metric5_sum',
            definition: {
                baseObject: {
                    id: '/gdc/md/measure/obj/5'
                },
                filters: [],
                aggregation: 'sum'
            }
        }],
    filters: [
        absoluteDateFilter1
    ]
};

export const afmWithTwoDimensions: IAfm = {
    attributes: [
        {
            id: '/gdc/md/project/obj/657',
            type: 'date'
        }
    ],
    measures: [
        {
            id: 'm1',
            definition: {
                baseObject: {
                    id: '/gdc/md/project/obj/1507'
                },
                filters: [
                    {
                        type: 'date',
                        id: '/gdc/md/project/obj/727',
                        intervalType: 'relative',
                        between: [-7, -7],
                        granularity: 'quarter'
                    }
                ]
            }
        },
        {
            id: 'm2',
            definition: {
                baseObject: {
                    id: '/gdc/md/project/obj/1507'
                }
            }
        }
    ],
    filters: [
        {
            id: '/gdc/md/project/obj/727',
            type: 'date',
            intervalType: 'absolute',
            between: ['2016-01-01', '2016-12-31'],
            granularity: 'date'
        },
        {
            id: '/gdc/md/project/obj/361',
            type: 'date',
            intervalType: 'relative',
            between: [0, 0],
            granularity: 'year'
        }
    ]
};
