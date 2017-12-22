import { toAfmResultSpec } from '../toAfmResultSpec';
import {
    simpleMeasure,
    renamedMeasure,
    filteredMeasure,
    measureWithAbsoluteDate,
    measureWithRelativeDate,
    popMeasure,
    popMeasureWithSorting,
    showInPercent,
    showInPercentWithDate,
    measureWithSorting,
    categoryWithSorting,
    factBasedMeasure,
    factBasedRenamedMeasure,
    attributeBasedMeasure,
    attributeBasedRenamedMeasure,
    stackingAttribute,
    stackingRenamedAttribute,
    attributeFilter,
    attributeFilterWithAll,
    dateFilter,
    dateFilterWithoutInterval,
    segmentedAndTrendedLineChart,
    measuresOnlyPieChart,
    oneMeasureOneAttribute,
    reducedMultipleSorts
} from './fixtures/Afm.fixtures';
import { charts, tables } from './fixtures/VisObj.fixtures';
import { TABLE, BAR, LINE, PIE } from '../../constants/visualizationTypes';

describe('toAfmResultSpec', () => {
    const translatedPopSuffix = ' - translated-pop-suffix';

    it('should convert simple measures', () => {
        expect(toAfmResultSpec(charts.bar.simpleMeasure, translatedPopSuffix)).toEqual({
            ...simpleMeasure,
            type: BAR
        });
    });

    it('should convert simple renamed measures', () => {
        expect(toAfmResultSpec(charts.bar.renamedMeasure, translatedPopSuffix)).toEqual({
            ...renamedMeasure,
            type: BAR
        });
    });

    it('should convert filtered measures', () => {
        expect(toAfmResultSpec(charts.bar.filteredMeasure, translatedPopSuffix)).toEqual({
            ...filteredMeasure,
            type: BAR
        });
    });

    it('should convert relative date filtered measures', () => {
        expect(toAfmResultSpec(charts.bar.measureWithRelativeDate, translatedPopSuffix)).toEqual({
            ...measureWithRelativeDate,
            type: BAR
        });
    });

    it('should convert absolute date filtered measures', () => {
        expect(toAfmResultSpec(charts.bar.measureWithAbsoluteDate, translatedPopSuffix)).toEqual({
            ...measureWithAbsoluteDate,
            type: BAR
        });
    });

    it('should convert fact based measures', () => {
        expect(toAfmResultSpec(charts.bar.factBasedMeasure, translatedPopSuffix)).toEqual({
            ...factBasedMeasure,
            type: BAR
        });
    });

    it('should convert fact based renamed measures', () => {
        expect(toAfmResultSpec(charts.bar.factBasedRenamedMeasure, translatedPopSuffix)).toEqual({
            ...factBasedRenamedMeasure,
            type: BAR
        });
    });

    it('should convert attribute based measures', () => {
        expect(toAfmResultSpec(charts.bar.attributeBasedMeasure, translatedPopSuffix)).toEqual({
            ...attributeBasedMeasure,
            type: BAR
        });
    });

    it('should convert attribute based renamed measures', () => {
        expect(toAfmResultSpec(charts.bar.attributeBasedRenamedMeasure, translatedPopSuffix)).toEqual({
            ...attributeBasedRenamedMeasure,
            type: BAR
        });
    });

    it('should convert measure with show in percent with attribute', () => {
        expect(toAfmResultSpec(charts.bar.showInPercent, translatedPopSuffix)).toEqual({
            ...showInPercent,
            type: BAR
        });
    });

    it('should convert measure with show in percent with date', () => {
        expect(toAfmResultSpec(charts.bar.showInPercentWithDate, translatedPopSuffix)).toEqual({
            ...showInPercentWithDate,
            type: BAR
        });
    });

    it('should convert measure with sorting', () => {
        expect(toAfmResultSpec(charts.bar.measureWithSorting, translatedPopSuffix)).toEqual({
            ...measureWithSorting,
            type: BAR
        });
    });

    it('should convert pop measure', () => {
        expect(toAfmResultSpec(charts.bar.popMeasure, translatedPopSuffix)).toEqual({
            ...popMeasure,
            type: BAR
        });
    });

    it('should convert pop measure with sorting', () => {
        expect(toAfmResultSpec(charts.bar.popMeasureWithSorting, translatedPopSuffix)).toEqual({
            ...popMeasureWithSorting,
            type: BAR
        });
    });

    it('should convert category with sorting', () => {
        expect(toAfmResultSpec(charts.bar.categoryWithSorting, translatedPopSuffix)).toEqual({
            ...categoryWithSorting,
            type: BAR
        });
    });

    it('should convert attribute filter', () => {
        expect(toAfmResultSpec(charts.bar.attributeFilter, translatedPopSuffix)).toEqual({
            ...attributeFilter,
            type: BAR
        });
    });

    it('should convert date filter', () => {
        expect(toAfmResultSpec(charts.bar.dateFilter, translatedPopSuffix)).toEqual({
            ...dateFilter,
            type: BAR
        });
    });

    it('should convert date filter with from/to as strings', () => {
        expect(toAfmResultSpec(charts.bar.dateFilterWithStrings, translatedPopSuffix)).toEqual({
            ...dateFilter,
            type: BAR
        });
    });

    it('should skip filter when date filter from/to is undefined for relative (alltime)', () => {
        expect(toAfmResultSpec(charts.bar.dateFilterWithUndefs, translatedPopSuffix)).toEqual({
            ...dateFilterWithoutInterval,
            type: BAR
        });
    });

    it('should convert stacking attribute', () => {
        expect(toAfmResultSpec(charts.bar.stackingAttribute, translatedPopSuffix)).toEqual({
            ...stackingAttribute,
            type: BAR
        });
    });

    it('should convert stacking renamed attribute', () => {
        expect(toAfmResultSpec(charts.bar.stackingRenamedAttribute, translatedPopSuffix)).toEqual({
            ...stackingRenamedAttribute,
            type: BAR
        });
    });

    it('should skip attribute filter with ALL', () => {
        expect(toAfmResultSpec(charts.bar.attributeFilterWithAll, translatedPopSuffix)).toEqual({
            ...attributeFilterWithAll,
            type: BAR
        });
    });

    it('should convert segmented attribute for Line chart', () => {
        expect(toAfmResultSpec(charts.line.segmentedAndTrended, translatedPopSuffix)).toEqual({
            ...segmentedAndTrendedLineChart,
            type: LINE
        });
    });

    it('should convert measures only for pie chart', () => {
        expect(toAfmResultSpec(charts.pie.measuresOnly, translatedPopSuffix)).toEqual({
            ...measuresOnlyPieChart,
            type: PIE
        });
    });

    it('should convert table', () => {
        expect(toAfmResultSpec(tables.oneMeasureOneAttribute, translatedPopSuffix)).toEqual({
            ...oneMeasureOneAttribute,
            type: TABLE
        });
    });

    it('should convert only one sort item', () => {
        expect(toAfmResultSpec(tables.multipleSorts, translatedPopSuffix)).toEqual({
            ...reducedMultipleSorts,
            type: TABLE
        });
    });
});
