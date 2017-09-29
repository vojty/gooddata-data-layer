import { IAdapter } from '../interfaces/Adapter';
import { IDataSource } from '../interfaces/DataSource';
import { DummyDataSource } from './DummyDataSource';
import { IAfm } from '../interfaces/Afm';
import { ISimpleExecutorResult } from 'gooddata';

export class DummyAdapter implements IAdapter<ISimpleExecutorResult> {
    private data: any;
    private success: boolean;
    private dataSource: any;

    // Intentional any
    constructor(data: any, success: boolean = true, dataSource: any = null) {
        this.data = data;
        this.success = success;
        this.dataSource = dataSource;
    }

    // tslint:disable-next-line:variable-name
    public createDataSource(_afm: IAfm): Promise<IDataSource<ISimpleExecutorResult>> {
        return this.dataSource
            ? Promise.resolve(this.dataSource)
            : Promise.resolve(new DummyDataSource<ISimpleExecutorResult>(this.data, this.success));
    }
}
