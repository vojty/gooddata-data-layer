import { toAfmResultSpec } from '../../toAfmResultSpec';
import {
    executionWithTotals,
    tableWithTotals
} from './totals.fixtures';

import { TABLE } from '../../../constants/visualizationTypes';

describe('totals toAfmResultSpec', () => {
    const translatedPopSuffix = 'translated-pop-suffix';

    it('should convert table grand totals', () => {
        const executionObject = toAfmResultSpec(tableWithTotals, translatedPopSuffix);
        expect(executionObject).toEqual({
            ...executionWithTotals,
            type: TABLE
        });
    });
});
