import { afmDataMap1 } from '../../fixtures/AfmMap.fixtures';
import { getDateElementUri } from '../AfmMap';
import { absoluteDateFilter1, relativeDateFilter } from '../../fixtures/Afm.fixtures';

describe('AfmMap', () => {
    it('getDateElementUri', () => {
        const dateAttribute = afmDataMap1.getDateAttribute(absoluteDateFilter1);

        const elementUri = getDateElementUri(dateAttribute, '2014-01-01');
        expect(elementUri).toEqual('/gdc/md/2014-01-01URI/obj/1');
    });

    describe('getAttributeByDisplayForm', () => {
        it('should find right attribute', () => {
            const attribute = afmDataMap1.getAttributeByDisplayForm('attribute_display_form_identifier');
            expect(attribute).toEqual('attribute_identifier');
        });
    });

    describe('getDateAttribute', () => {
        it('should found absolute date attribute data map', () => {
            const dateAttribute = afmDataMap1.getDateAttribute(absoluteDateFilter1);
            expect(dateAttribute).toEqual({
                attributeElements:  [
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
                ],
                dateAttributeType: 'GDC.time.date',
                dateAttributeUri: '/gdc/md/dateAttributeUri/obj/1',
                dateDisplayFormUri: '/gdc/md/dateDisplayFormUri/obj/1'
            });
        });

        it('should found relative date attribute data map', () => {
            const dateAttribute = afmDataMap1.getDateAttribute(relativeDateFilter);
            expect(dateAttribute).toEqual({
                attributeElements: [],
                dateAttributeType: 'GDC.time.year',
                dateAttributeUri: '/gdc/md/dateAttributeUriYEAR/obj/1',
                dateDisplayFormUri: null
            });
        });
    });
});
