import { ITransformation } from '../interfaces/Transformation';

export const simpleTransformation: ITransformation = {
    measures: [
        {
            id: 'm1',
            title: '# of Activities, 7 quarters ago',
            format: '#,##0'
        },
        {
            id: 'm2',
            title: '# of Activities',
            format: '#,##0'
        }
    ]
};
