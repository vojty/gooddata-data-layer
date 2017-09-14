import { AfmMap } from '../afmMap/AfmMap';
import { absoluteDateFilter1 } from './Afm.fixtures';

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
            dateAttributeType: 'GDC.time.year',
            dateAttributeUri: '/gdc/md/dateAttributeUriYEAR/obj/1',
            dateDisplayFormUri: null,
            attributeElements: []
        },
        {
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
            dateAttributeType: 'GDC.time.year',
            dateAttributeUri: '/gdc/md/dateAttributeUriYEAR/obj/1',
            dateDisplayFormUri: null,
            attributeElements: []
        },
        {
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
    absoluteDateFilter1
);
