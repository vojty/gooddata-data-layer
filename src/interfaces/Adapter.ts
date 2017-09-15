import { IDataSource } from './DataSource';
import { IAfm } from './Afm';
import { IDataSourceParams } from './DataSourceParams';

export interface IAdapter {
    createDataSource(source: IAfm | IDataSourceParams): Promise<IDataSource>;
}
