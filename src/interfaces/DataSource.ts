import { AFM } from '@gooddata/typings';

export interface IDataSource<T> {
    getData(resultSpec: AFM.IResultSpec): Promise<T>;
    getAfm(): AFM.IAfm;
    getFingerprint(): string;
}
