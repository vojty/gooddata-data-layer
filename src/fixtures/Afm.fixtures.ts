import { IAfm, IDateFilter, IMeasure } from '../interfaces/Afm';

export const absoluteDateFilter1: IDateFilter = {
    id: '/gdc/md/datefilter/obj/1',
    type: 'date',
    intervalType: 'absolute',
    between: ['2014-01-01', '2016-01-01'],
    granularity: 'date'
};

export const absoluteDateFilter2: IDateFilter = {
    id: '/gdc/md/datefilter/obj/1',
    type: 'date',
    intervalType: 'absolute',
    between: ['2017-01-01', '2018-01-01'],
    granularity: 'date'
};

export const relativeDateFilter: IDateFilter = {
    id: '/gdc/md/datefilter/obj/1',
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
