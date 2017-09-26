import { appendFilters, hasMetricDateFilters, isAfmExecutable, normalizeAfm } from '../AfmUtils';
import { IAfm, IAttributeFilter, IDateFilter } from '../../interfaces/Afm';
import * as AfmFixture from '../../fixtures/Afm.fixtures';

describe('hasMetricDateFilters', () => {
    it('TRUE if contains at least one metric date filter', () => {
        const result = hasMetricDateFilters(AfmFixture.afmWithMetricDateFilter);
        expect(result).toEqual(true);
    });

    it('FALSE if does not contain any metric date filter', () => {
        const result = hasMetricDateFilters(AfmFixture.afmWithoutMetricDateFilters);
        expect(result).toEqual(false);
    });
});

describe('normalizeAfm', () => {
    it('should add optional arrays', () => {
        const afm: IAfm = {};
        expect(normalizeAfm(afm)).toEqual({
            measures: [],
            attributes: [],
            filters: []
        });

        expect(normalizeAfm({
            attributes: [
                {
                    id: '1',
                    type: 'date'
                }
            ]
        })).toEqual({
            attributes: [
                {
                    id: '1',
                    type: 'date'
                }
            ],
            measures: [],
            filters: []
        });

        expect(normalizeAfm({
            measures: [
                {
                    id: '1',
                    definition: {
                        baseObject: {
                            id: '/uri'
                        }
                    }
                }
            ]
        })).toEqual({
            measures: [
                {
                    id: '1',
                    definition: {
                        baseObject: {
                            id: '/uri'
                        }
                    }
                }
            ],
            attributes: [],
            filters: []
        });

        expect(normalizeAfm({
            filters: [
                {
                    id: '1',
                    type: 'date',
                    intervalType: 'relative',
                    between: [0, 1],
                    granularity: 'year'
                }
            ]
        })).toEqual({
            attributes: [],
            measures: [],
            filters: [
                {
                    id: '1',
                    type: 'date',
                    intervalType: 'relative',
                    between: [0, 1],
                    granularity: 'year'
                }
            ]
        });
    });
});

describe('AFM utils', () => {
    const af1: IAttributeFilter = {
        id: '1',
        type: 'attribute',
        in: []
    };
    const af2: IAttributeFilter = {
        id: '2',
        type: 'attribute',
        notIn: []
    };

    const df1: IDateFilter = {
        id: 'd1',
        type: 'date',
        intervalType: 'relative',
        granularity: 'GDC.time.year',
        between: [-1, -1]
    };
    const df2: IDateFilter = {
        id: 'd2',
        type: 'date',
        intervalType: 'relative',
        granularity: 'GDC.time.year',
        between: [-1, -1]
    };
    const df1AllTime: IDateFilter = {
        id: 'd1',
        type: 'date',
        intervalType: 'relative',
        granularity: '',
        between: [0, 0]
    };

    describe('appendFilters', () => {
        it('should concatenate filters when all different', () => {
            const afm = {
                filters: [
                    af1
                ]
            };
            const attributeFilters = [af2];
            const dateFilter = df1;

            const enriched = appendFilters(afm, attributeFilters, dateFilter);
            expect(enriched.filters).toEqual([
                af1, af2, df1
            ]);
        });

        it('should override date filter if id identical', () => {
            const afm = {
                filters: [
                    af1, df1
                ]
            };
            const attributeFilters: IAttributeFilter[] = [];
            const dateFilter = df1;

            const enriched = appendFilters(afm, attributeFilters, dateFilter);
            expect(enriched.filters).toEqual([
                af1, df1
            ]);
        });

        it('should duplicate date filter if id different', () => {
            const afm = {
                filters: [
                    df1
                ]
            };
            const attributeFilters: IAttributeFilter[] = [];
            const dateFilter = df2;

            const enriched = appendFilters(afm, attributeFilters, dateFilter);
            expect(enriched.filters).toEqual([
                df1, df2
            ]);
        });

        it('should delete date filter from afm if all time date filter requested', () => {
            const afm = {
                filters: [
                    df1
                ]
            };
            const attributeFilters: IAttributeFilter[] = [];
            const dateFilter = df1AllTime;

            const enriched = appendFilters(afm, attributeFilters, dateFilter);
            expect(enriched.filters).toEqual([]);
        });
    });

    describe('isAfmExecutable', () => {
        it('should be false for only filters', () => {
            const afm = {
                filters: [
                    df1
                ]
            };

            expect(isAfmExecutable(afm)).toBeFalsy();
        });

        it('should be true for at least one measure', () => {
            const afm = {
                measures: [
                    {
                        id: 'm1',
                        definition: {
                            baseObject: {
                                id: 'm1'
                            },
                            aggregation: 'count'
                        }
                    }
                ]
            };

            expect(isAfmExecutable(afm)).toBeTruthy();
        });

        it('should be true for at least one attribute', () => {
            const afm: IAfm = {
                attributes: [
                    {
                        id: '/gdc/project/dsdf1',
                        type: 'date'
                    }
                ]
            };

            expect(isAfmExecutable(afm)).toBeTruthy();
        });
    });
});
