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

export const metric_sum: IMeasure = {
    id: 'metric_sum',
    definition: {
        baseObject: {
            id: '/gdc/md/measure/obj/1'
        },
        aggregation: 'sum'
    }
};

export const metric2_sum: IMeasure = {
    id: 'metric2_sum',
    definition: {
        baseObject: {
            id: '/gdc/md/measure/obj/2'
        },
        filters: [relativeDateFilter],
        aggregation: 'sum'
    }
};

export const metric3_sum: IMeasure = {
    id: 'metric3_sum',
    definition: {
        baseObject: {
            id: '/gdc/md/measure/obj/3'
        },
        filters: [absoluteDateFilter2],
        aggregation: 'sum'
    }
};

export const metric4_sun: IMeasure = {
    id: 'metric4_sum',
    definition: {
        baseObject: {
            id: '/gdc/md/measure/obj/4'
        },
        filters: [absoluteDateFilter1],
        aggregation: 'sum'
    }
};

export const metric_in_percent: IMeasure = {
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

export const metric_in_percent_pop: IMeasure = {
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
        metric_sum,
        metric2_sum
    ],
    filters: [
        absoluteDateFilter1
    ]
};

export const afmWithMetricDateFilters: IAfm = {
    measures: [
        metric_sum,
        metric2_sum,
        metric3_sum
    ],
    filters: [
        absoluteDateFilter1
    ]
};

export const afmWithoutMetricDateFilters: IAfm = {
    measures: [
        metric_sum,
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
