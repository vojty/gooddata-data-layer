import { IAdapter } from '../interfaces/Adapter';
import { IDataSource } from '../interfaces/DataSource';
import { DummyDataSource } from './DummyDataSource';
import { IAfm } from '../interfaces/Afm';

export class DummyAdapter implements IAdapter {
    private data: any;
    private success: boolean;
    private dataSource: any;

    // Intentional any
    constructor(data: any, success: boolean = true, dataSource: any = null) {
        this.data = data;
        this.success = success;
        this.dataSource = dataSource;
    }

    public createDataSource<T>(_afm: IAfm): Promise<IDataSource<T>> { // tslint:disable-line:variable-name
        return this.dataSource
            ? Promise.resolve(this.dataSource)
            : Promise.resolve(new DummyDataSource<T>(this.data, this.success));
    }
}
