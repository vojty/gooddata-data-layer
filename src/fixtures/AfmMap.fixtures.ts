import { AfmMap } from '../afmMap/AfmMap';
import { absoluteDateFilter1 } from './Afm.fixtures';
import * as DataSetFixtures from './DataSet.fixtures';

export const afmDataMap1 = new AfmMap([
    [
        {
            attribute: 'attribute_identifier',
            attributeDisplayForm: 'attribute_display_form_identifier'
        },
        {
            attribute: 'attribute_identifier_1',
            attributeDisplayForm: 'attribute_display_form_identifier_1'
        }
    ],
    [
        {
            dateDataSetId: DataSetFixtures.activityDateDataSet.dataSet.meta.uri,
            dateAttributeType: 'GDC.time.year',
            dateAttributeUri: '/gdc/md/dateAttributeUriYEAR/obj/1',
            dateDisplayFormUri: null,
            attributeElements: []
        },
        {
            dateDataSetId: DataSetFixtures.activityDateDataSet.dataSet.meta.uri,
            dateAttributeType: 'GDC.time.date',
            dateAttributeUri: '/gdc/md/dateAttributeUri/obj/1',
            dateDisplayFormUri: '/gdc/md/dateDisplayFormUri/obj/1',
            attributeElements: [
                {
                    label: '2014-01-01',
                    uri: '/gdc/md/2014-01-01URI/obj/1'
                },
                {
                    label: '2016-01-01',
                    uri: '/gdc/md/2016-01-01URI/obj/1'
                },
                {
                    label: '2017-01-01',
                    uri: '/gdc/md/2017-01-01URI/obj/1'
                },
                {
                    label: '2018-01-01',
                    uri: '/gdc/md/2018-01-01URI/obj/1'
                }
            ]
        }]]
);

export const afmDataMap2 = new AfmMap([
    [
        {
            attribute: 'attribute_identifier',
            attributeDisplayForm: 'attribute_display_form_identifier'
        },
        {
            attribute: 'attribute_identifier_1',
            attributeDisplayForm: 'attribute_display_form_identifier_1'
        }
    ],
    [
        {
            dateDataSetId: DataSetFixtures.activityDateDataSet.dataSet.meta.uri,
            dateAttributeType: 'GDC.time.year',
            dateAttributeUri: '/gdc/md/dateAttributeUriYEAR/obj/1',
            dateDisplayFormUri: null,
            attributeElements: []
        },
        {
            dateDataSetId: DataSetFixtures.activityDateDataSet.dataSet.meta.uri,
            dateAttributeType: 'GDC.time.date',
            dateAttributeUri: '/gdc/md/dateAttributeUri/obj/1',
            dateDisplayFormUri: '/gdc/md/dateDisplayFormUri/obj/1',
            attributeElements: [
                {
                    label: '2014-01-01',
                    uri: '/gdc/md/2014-01-01URI/obj/1'
                },
                {
                    label: '2016-01-01',
                    uri: '/gdc/md/2016-01-01URI/obj/1'
                },
                {
                    label: '2017-01-01',
                    uri: '/gdc/md/2017-01-01URI/obj/1'
                },
                {
                    label: '2018-01-01',
                    uri: '/gdc/md/2018-01-01URI/obj/1'
                }
            ]
        }]],
    [absoluteDateFilter1]
);

export const afmDataMap3 = new AfmMap(
    [[],
    [{
        dateDataSetId: '/gdc/md/project/obj/361',
        dateAttributeType: 'GDC.time.year',
        dateAttributeUri: '/gdc/md/project/obj/354',
        dateDisplayFormUri: null,
        attributeElements: []
    }, {
        dateDataSetId: '/gdc/md/project/obj/727',
        dateAttributeType: 'GDC.time.date',
        dateAttributeUri: '/gdc/md/TeamOneGoodSales1/obj/590',
        dateDisplayFormUri: '/gdc/md/TeamOneGoodSales1/obj/592',
        attributeElements: [
            {
                label: '2016-01-01',
                uri: '/gdc/md/project/obj/590/elements?id=42369'
            },
            {
                label: '2016-12-31',
                uri: '/gdc/md/project/obj/590/elements?id=42734'
            }
        ]
    }, {
        dateDataSetId: '/gdc/md/project/obj/727',
        dateAttributeType: 'GDC.time.quarter',
        dateAttributeUri: '/gdc/md/project/obj/656',
        dateDisplayFormUri: null,
        attributeElements: []
    }, {
        dateDataSetId: '/gdc/md/project/obj/727',
        dateAttributeType: 'GDC.time.year',
        dateAttributeUri: '/gdc/md/project/obj/720',
        dateDisplayFormUri: null,
        attributeElements: []
    }]],
    [{
        id: '/gdc/md/project/obj/727',
        type: 'date',
        intervalType: 'absolute',
        between: ['2016-01-01', '2016-12-31'],
        granularity: 'date'
    }, {
        id: '/gdc/md/project/obj/361',
        type: 'date',
        intervalType: 'relative',
        between: [0, 0],
        granularity: 'year'
    }]
);
