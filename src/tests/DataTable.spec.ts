import { IAfm } from '../interfaces/Afm';
import { DataTable } from '../DataTable';
import { DummyAdapter } from '../utils/DummyAdapter';
import { ISimpleExecutorResult } from '../interfaces/ExecutorResult';

describe('DataTable', () => {
    const dataResponse: ISimpleExecutorResult = { rawData: [['1', '2', '3']] };
    const afm: IAfm = {
        measures: [
            {
                id: 'a',
                definition: {
                    baseObject: {
                        id: 'b'
                    }
                }
            }
        ]
    };
    const afm2: IAfm = {
        measures: [
            {
                id: 'c',
                definition: {
                    baseObject: {
                        id: 'd'
                    }
                }
            }
        ]
    };
    const nonExecutableAfm: IAfm = {};
    const transformation = {};

    describe('Events', () => {
        const setupDataTable = (success = true) => {
            const dt = new DataTable(new DummyAdapter(dataResponse, success));
            const dataCb = jest.fn();
            const errCb = jest.fn();

            dt.onData(dataCb);
            dt.onError(errCb);

            return {
                dt,
                dataCb,
                errCb
            };
        };

        it('should return data via onData callback', (done) => {
            const { dt, errCb, dataCb } = setupDataTable();

            dt.getData(afm, transformation);

            setTimeout(() => {
                expect(errCb).not.toBeCalled();
                expect(dataCb).toHaveBeenCalledWith(dataResponse);

                done();
            }, 0);
        });

        it('should dispatch onError callback when error occurs', (done) => {
            const { dt, errCb, dataCb } = setupDataTable(false);

            dt.getData(afm, transformation);

            setTimeout(() => {
                expect(dataCb).not.toBeCalled();
                expect(errCb).toHaveBeenCalled();

                done();
            }, 0);
        });

        it('should not get new data for invalid AFM', (done) => {
            const { dt, errCb, dataCb } = setupDataTable();

            dt.getData(nonExecutableAfm, transformation);

            setTimeout(() => {
                expect(dataCb).not.toBeCalled();
                expect(errCb).not.toBeCalled();

                done();
            }, 0);
        });

        it('should be able to reset subscribers', (done) => {
            const { dt, errCb, dataCb } = setupDataTable();

            dt.onData(dataCb);
            dt.onError(errCb);

            dt
                .resetDataSubscribers()
                .resetErrorSubscribers();

            dt.getData(nonExecutableAfm, transformation);

            setTimeout(() => {
                expect(dataCb).not.toBeCalled();
                expect(errCb).not.toBeCalled();

                done();
            }, 0);
        });

        it('should call handler only once', (done) => {
            const { dt, errCb, dataCb } = setupDataTable();

            dt.getData(afm, transformation);
            dt.getData(afm2, transformation);

            setTimeout(() => {
                try {
                    expect(dataCb).toHaveBeenCalledTimes(1);
                    expect(errCb).not.toHaveBeenCalled();

                    done();
                } catch (error) {
                    done(error);
                }
            }, 0);
        });
    });
});
