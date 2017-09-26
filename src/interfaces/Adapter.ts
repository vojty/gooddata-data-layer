import { IDataSource } from './DataSource';
import { IAfm } from './Afm';
import { IDataSourceParams } from './DataSourceParams';

export interface IAdapter {
    createDataSource<T>(source: IAfm | IDataSourceParams): Promise<IDataSource<T>>;
}
