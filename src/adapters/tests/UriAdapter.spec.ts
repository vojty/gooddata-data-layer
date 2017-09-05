jest.mock('../SimpleExecutorAdapter', () => {
    class DummySimpleExecutorAdapter {
        constructor() {}
        createDataSource() {
            return Promise.resolve({});
        }
    }

    return {
        SimpleExecutorAdapter: DummySimpleExecutorAdapter
    };
});

import { charts } from '../../legacy/tests/fixtures/VisObj.fixtures';
import {
    UriAdapter
} from '../UriAdapter';

describe('UriAdapter', () => {
    const projectId = 'FoodMartDemo';
    const uri = '/gdc/md/FoodMartDemo/1';
    const uri2 = '/gdc/md/FoodMartDemo/2';
    const dummyDataSource = {};
    
    function createDummySDK() {
        const visualizationObject = {
            visualization: { content: charts.bar.simpleMeasure }
        };

        return {
            xhr: {
                get: jest.fn(() => Promise.resolve(visualizationObject))
            }
        };
    }

    it('should fetch visualization object when creating data source', (done) => {
        const DummySDK = createDummySDK();
        const adapter = new UriAdapter(DummySDK, projectId);
        adapter.createDataSource({ uri }).then((dataSource) => {
            expect(DummySDK.xhr.get).toBeCalledWith(uri);
            done();
        });
    });

    it('should retrieve datasource when requested', (done) => {
        const DummySDK = createDummySDK();
        const adapter = new UriAdapter(DummySDK, projectId);
        adapter.createDataSource({ uri }).then((dataSource) => {
            expect(dataSource).toEqual(dummyDataSource);
            done();
        });
    });

    it('should handle fail of vis. obj. fetch', (done) => {
        const DummySDK = createDummySDK();
        const adapter = new UriAdapter(DummySDK, projectId);
        DummySDK.xhr.get = jest.fn(() => Promise.reject('invalid URI'));
        adapter.createDataSource({ uri }).catch((error) => {
            expect(error).toBe('invalid URI');
            done();
        });
    });

    it('should request visualization object for consecutive createDataSource call only when uri changes', (done) => {
        const DummySDK = createDummySDK();
        const adapter = new UriAdapter(DummySDK, projectId);
        adapter.createDataSource({ uri }).then((dataSource) => {
            expect(DummySDK.xhr.get).toHaveBeenCalledTimes(1);
            adapter.createDataSource({ uri }).then((dataSource) => {
                expect(DummySDK.xhr.get).toHaveBeenCalledTimes(1);
                adapter.createDataSource({ uri: uri2 }).then((dataSource) => {
                    expect(DummySDK.xhr.get).toHaveBeenCalledTimes(2);
                    done();
                });
            });
        });
    });
});
