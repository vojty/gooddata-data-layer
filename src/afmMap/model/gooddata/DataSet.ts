import { IMetadataObject } from './MetadataObject';

export interface IDataSetInternal extends IMetadataObject {
    content: {
        attributes: string[],
        facts: string[]
    };
}

export interface IDataSet {
    dataSet: IDataSetInternal;
}
