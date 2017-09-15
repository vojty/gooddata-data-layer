import * as stringify from 'json-stable-stringify';
import { DataSource } from '../DataSource';
import { IAfm } from '../../interfaces/Afm';

describe('DataSource', () => {
    const afm: IAfm = { measures: [], filters: [], attributes: [] };

    it('should call execfactory for getData', () => {
        const result = Promise.resolve();
        const execFactory = jest.fn().mockReturnValue(result);
        const dataSource = new DataSource(execFactory);

        const dataPromise = dataSource.getData({});
        expect(dataPromise).toEqual(result);
    });

    it('should return afm', () => {
        const execFactory = (): Promise<number> => Promise.resolve(1);
        const dataSource = new DataSource(execFactory, afm);

        expect(dataSource.getAfm()).toEqual(afm);
    });

    it('should return correct fingerprint', () => {
        const execFactory = () => Promise.resolve({});
        const dataSource = new DataSource(execFactory, afm);

        expect(dataSource.getFingerprint()).toEqual(stringify(afm));
    });

    it('should return explicit fingerprint when provided', () => {
        const execFactory = () => Promise.resolve({});
        const dataSource = new DataSource(execFactory, afm, 'myFingeprint');

        expect(dataSource.getFingerprint()).toEqual('myFingeprint');
    });
});
