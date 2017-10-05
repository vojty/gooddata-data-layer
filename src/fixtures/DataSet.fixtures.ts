import {IDataSet} from '../afmMap/model/gooddata/DataSet';

export const activityDateDataSet: IDataSet = {
    dataSet: {
        content: {
            facts : [],
            attributes: [
                '/gdc/md/project/obj/15200'
            ]
        },
        meta: {
            uri : '/gdc/md/project/obj/727',
            identifier : 'activity.dataset.dt',
            deprecated : false,
            summary : 'DataSet Date',
            isProduction : true,
            title : 'Date (Activity)',
            category : 'dataSet',
        }
    }
};
