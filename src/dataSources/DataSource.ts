import * as stringify from 'json-stable-stringify';
import { IDataSource } from '../interfaces/DataSource';
import { IAfm } from '../interfaces/Afm';
import { ITransformation } from '../interfaces/Transformation';

export {
    IDataSource
};

export type ExecFactory<T> = (transformation: ITransformation) => Promise<T>;

export class DataSource<T> implements IDataSource<T> {
    constructor(
        private execFactory: ExecFactory<T>,
        private afm?: IAfm,
        private fingerprint?: string
    ) {}

    public getData(transformation: ITransformation): Promise<T> {
        return this.execFactory(transformation);
    }

    public getAfm(): IAfm {
        return this.afm;
    }

    public getFingerprint(): string {
        return this.fingerprint ? this.fingerprint : stringify(this.afm);
    }
}
