import { IGoodDataSDK } from '../../interfaces/GoodDataSDK';
import { charts } from '../../legacy/tests/fixtures/VisObj.fixtures';
import {
    UriAdapter
} from '../UriAdapter';

jest.mock('../SimpleExecutorAdapter', () => {
    class DummySimpleExecutorAdapter {
        public createDataSource() {
            return Promise.resolve({});
        }
    }

    return {
        SimpleExecutorAdapter: DummySimpleExecutorAdapter
    };
});

describe('UriAdapter', () => {
    const projectId = 'FoodMartDemo';
    const uri = '/gdc/md/FoodMartDemo/1';
    const uri2 = '/gdc/md/FoodMartDemo/2';
    const dummyDataSource = {};

    function createDummySDK(): IGoodDataSDK {
        const visualizationObject = {
            visualization: { content: charts.bar.simpleMeasure }
        };

        return {
            md: {
                getObjects: null,
                getUrisFromIdentifiers: null,
                translateElementLabelsToUris: null
            },
            execution: {
                getData: null
            },
            xhr: {
                get: jest.fn(() => Promise.resolve(visualizationObject))
            }
        };
    }

    it('should fetch visualization object when creating data source', () => {
        const DummySDK = createDummySDK();
        const adapter = new UriAdapter(DummySDK, projectId);
        return adapter.createDataSource({ uri }).then(() => {
            expect(DummySDK.xhr.get).toBeCalledWith(uri);
        });
    });

    it('should retrieve datasource when requested', () => {
        const DummySDK = createDummySDK();
        const adapter = new UriAdapter(DummySDK, projectId);
        return adapter.createDataSource({ uri }).then((dataSource) => {
            expect(dataSource).toEqual(dummyDataSource);
        });
    });

    it('should handle fail of vis. obj. fetch', () => {
        const DummySDK = createDummySDK();
        const adapter = new UriAdapter(DummySDK, projectId);
        DummySDK.xhr.get = jest.fn(() => Promise.reject('invalid URI'));
        return adapter.createDataSource({ uri }).catch((error) => {
            expect(error).toBe('invalid URI');
        });
    });

    it('should request visualization object for consecutive createDataSource call only when uri changes', () => {
        const DummySDK = createDummySDK();
        const adapter = new UriAdapter(DummySDK, projectId);
        return adapter.createDataSource({ uri }).then(() => {
            expect(DummySDK.xhr.get).toHaveBeenCalledTimes(1);
            return adapter.createDataSource({ uri }).then(() => {
                expect(DummySDK.xhr.get).toHaveBeenCalledTimes(1);
                return adapter.createDataSource({ uri: uri2 }).then(() => {
                    expect(DummySDK.xhr.get).toHaveBeenCalledTimes(2);
                });
            });
        });
    });
});
