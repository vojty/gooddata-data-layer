import * as stringify from 'json-stable-stringify';
import { IDataSource } from '../interfaces/DataSource';
import { IAfm } from '../interfaces/Afm';

export {
    IDataSource
};

export type execFactory = (transformation) => Promise<any>;

export class DataSource implements IDataSource {
    constructor(private execFactory: execFactory, private afm?: IAfm) {}

    public getData(transformation): Promise<any> {
        return this.execFactory(transformation);
    }

    public getAfm(): IAfm {
        return this.afm;
    }

    public getFingerprint(): string {
        return stringify(this.afm);
    }
}
