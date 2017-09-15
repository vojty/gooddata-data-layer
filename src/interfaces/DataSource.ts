import { IAfm } from './Afm';
import { ITransformation } from './Transformation';

export interface IDataSource<T> {
    getData(transformation: ITransformation): Promise<T>;
    getAfm(): IAfm;
    getFingerprint(): string;
}
