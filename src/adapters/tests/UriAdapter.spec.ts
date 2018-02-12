import { factory, SDK } from 'gooddata';
import { charts } from '../../converters/tests/fixtures/VisObj.fixtures';
import { UriAdapter } from '../UriAdapter';

const sdk = factory();

describe('UriAdapter', () => {
    const projectId = 'FoodMartDemo';
    const uri = '/gdc/md/FoodMartDemo/1';
    const uri2 = '/gdc/md/FoodMartDemo/2';

    function createDummySDK(): SDK {
        const visualizationObject = {
            visualizationObject: {
                content: charts.simpleMeasure
            }
        };

        jest.spyOn(sdk.xhr, 'get')
            .mockImplementation(() => Promise.resolve(visualizationObject));

        return sdk;
    }

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should fetch visualization object when creating data source', () => {
        const dummySDK = createDummySDK();
        const adapter = new UriAdapter(dummySDK, projectId);
        return adapter.createDataSource({ uri }).then(() => {
            expect(dummySDK.xhr.get).toBeCalledWith(uri);
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
