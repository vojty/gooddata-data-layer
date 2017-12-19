import * as VisObj from '../../converters/model/VisualizationObject';
import {extendVisObjectTotals} from '../VisObjUtils';
import {
    VIS_OBJECT_WITH_EXTENDED_TOTALS,
    VIS_OBJECT_WITH_TOTALS, VIS_OBJECT_WITHOUT_TOTALS
} from './fixtures/VisObjUtils.fixtures';

describe('totals definition for all measures', () => {
    it('should extend totals definition to load values for each measure', () => {
        const extendedVisObj: VisObj.IVisualizationObjectContent = extendVisObjectTotals(VIS_OBJECT_WITH_TOTALS);
        expect(extendedVisObj).toEqual(VIS_OBJECT_WITH_EXTENDED_TOTALS);
    });

    it('should return unmodified visualization object if totals are not included', () => {
        const extendedVisObj: VisObj.IVisualizationObjectContent = extendVisObjectTotals(VIS_OBJECT_WITHOUT_TOTALS);
        expect(extendedVisObj).toEqual(VIS_OBJECT_WITHOUT_TOTALS);
    });
});
