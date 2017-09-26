import { IMetadataObject } from './MetadataObject';
import { INestedAttributeDisplayForm } from './NestedAttributeDisplayForm';

export interface IKey {
    data: string;
    type: string;
}

export interface ISortDF {
    uri: string;
}

export type Sort = 'pk' | 'byUsedDF' | ISortDF;

export type Direction = 'asc' | 'desc';

export interface IAttributeContent {
    pk?: IKey[];
    fk?: IKey[];
    rel?: string;
    compositeAttribute?: string[];
    compositeAttributePk?: string[];
    dimension?: string;
    displayForms: INestedAttributeDisplayForm[];
    sort?: Sort;
    direction?: Direction;
    drillDownStepAttributeDF?: string;
    linkAttributeDF?: string;
    folders?: string[];
    type?: string;
    grain?: string;
}

export interface IAttributeInternal extends IMetadataObject {
    content: IAttributeContent;
}

export interface IAttribute {
    attribute: IAttributeInternal;
}
