import {
    SimpleExecutorAdapter
} from '../SimpleExecutorAdapter';
import * as GoodData from 'gooddata';

describe('SimpleExecutorAdapter', () => {
    const transformation = {};
    const projectId = 'abc';
    const afm = {};

    it('should request data via provided sdk', () => {
        const getDataStub = jest.fn().mockReturnValue(Promise.resolve());

        jest.spyOn(GoodData.execution, 'getData')
            .mockImplementationOnce(getDataStub);

        const adapter = new SimpleExecutorAdapter(GoodData, projectId);
        return adapter.createDataSource(afm).then((dataSource) => {
            return dataSource.getData(transformation).then(() => {
                expect(getDataStub).toBeCalled();
            });
        });
    });

    it('should pass provided fingerprint to new dataSource', (done) => {
        const getDataStub = jest.fn().mockReturnValue(Promise.resolve);

        jest.spyOn(GoodData.execution, 'getData')
            .mockImplementationOnce(getDataStub);

        const adapter = new SimpleExecutorAdapter(GoodData, projectId);
        adapter.createDataSource(afm, 'myFingerprint').then((dataSource) => {
            expect(dataSource.getFingerprint()).toEqual('myFingerprint');
            done();
        });
    });
});
