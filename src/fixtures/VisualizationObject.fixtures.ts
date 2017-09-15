import { IVisualizationObject } from '../legacy/model/VisualizationObject';

const empty: IVisualizationObject = {
    meta: {
        title: 'My vis'
    },
    content: {
        type: 'bar',
        buckets: {
            measures: [],
            categories: [],
            filters: []
        }
    }
};

export {
    empty
};
