import {
    SimpleExecutorAdapter
} from '../SimpleExecutorAdapter';
import { IGoodDataSDK } from '../../interfaces/GoodDataSDK';

describe('SimpleExecutorAdapter', () => {
    const transformation = {};
    const projectId = 'abc';
    const afm = {};

    it('should request data via provided sdk', (done) => {
        const getDataStub = jest.fn().mockReturnValue(Promise.resolve());
        const DummySDK: IGoodDataSDK = {
            md: {
                getObjects: null,
                getUrisFromIdentifiers: null,
                translateElementLabelsToUris: null
            },
            execution: {
                getData: getDataStub
            },
            xhr: {
                get: null
            }
        };

        const adapter = new SimpleExecutorAdapter(DummySDK, projectId);
        adapter.createDataSource(afm).then((dataSource) => {
            dataSource.getData(transformation).then(() => {
                expect(getDataStub).toBeCalled();
                done();
            });
        });
    });
});
