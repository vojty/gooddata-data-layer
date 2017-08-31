import { IAttributeFilter, IDateFilter } from './Afm';

export interface IDataSourceParams {
    uri: string;
    attributeFilters?: IAttributeFilter[];
    dateFilter?: IDateFilter;
}
