import { combineTransformations, getSorting } from '../TransformationUtils';
import { ITransformation } from '../../interfaces/Transformation';

describe('getSorting', () => {
    it('should generate sorting from transformation', () => {
        const transformation: ITransformation = {
            sorting: [
                {
                    column: '/gdc/md/column1',
                    direction: 'desc'
                },
                {
                    column: '/gdc/md/column2',
                    direction: 'asc'
                }
            ]
        };

        expect(getSorting(transformation)).toEqual([
            {
                column: '/gdc/md/column1',
                direction: 'desc'
            }, {
                column: '/gdc/md/column2',
                direction: 'asc'
            }
        ]);
    });
});

describe('combineTransformations', () => {
    const emptyTransformation = {};
    const emptyValues: ITransformation = {
        measures: [],
        sorting: [],
        dimensions: []
    };
    const t1 = {
        measures: [{
            id: 'measure-identifier',
            title: 'measure-title',
            format: 'measure-format'
        }],
        sorting: [{
            column: 'sorting-column',
            direction: 'asc'
        }]
    };

    const t1Override = {
        measures: [{
            id: 'measure-identifier',
            title: 'measure-title',
            format: 'measure-format-override'
        }],
        sorting: [{
            column: 'sorting-column',
            direction: 'desc'
        }]
    };

    const t2 = {
        measures: [{
            id: 'measure-identifier-2',
            title: 'measure-title-2',
            format: 'measure-format-2'
        }],
        sorting: [{
            column: 'sorting-column-2',
            direction: 'asc'
        }]
    };

    it('should handle undefined params', () => {
        const result = combineTransformations();
        expect(result).toEqual({});
    });

    it('should handle empty transformations', () => {
        const result = combineTransformations(emptyTransformation, emptyTransformation);
        expect(result).toEqual({});
    });

    it('should handle empty properties', () => {
        const result = combineTransformations(emptyValues, emptyValues);
        expect(result).toEqual(
            {
                measures: [],
                sorting: [],
                dimensions: []
            }
        );
    });

    it('should combine transformations', () => {
        const result = combineTransformations(t1, t2);
        expect(result).toEqual({
            measures: [{
                id: 'measure-identifier-2',
                title: 'measure-title-2',
                format: 'measure-format-2'
            }, {
                id: 'measure-identifier',
                title: 'measure-title',
                format: 'measure-format'
            }],
            sorting: [{
                column: 'sorting-column-2',
                direction: 'asc'
            }, {
                column: 'sorting-column',
                direction: 'asc'
            }]
        });
    });

    it('should override transformation', () => {
        const result = combineTransformations(t1, t1Override);
        expect(result).toEqual({
            measures: [{
                id: 'measure-identifier',
                title: 'measure-title',
                format: 'measure-format-override'
            }],
            sorting: [{
                column: 'sorting-column',
                direction: 'desc'
            }]
        });
    });

    it('should clear transformation', () => {
        const result = combineTransformations(t1, emptyValues);
        expect(result).toEqual({
            measures: [],
            sorting: [],
            dimensions: []
        });
    });
});
