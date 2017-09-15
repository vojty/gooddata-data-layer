import { IMetadataObject } from './MetadataObject';

export interface IAttributeDisplayFormInternal extends IMetadataObject {
    content: {
        expression: string;
        formOf: string;
        ldmexpression?: string;
        type?: string;
        'default'?: number;
    };

    links: {
        elements: string;
    };
}

export interface IAttributeDisplayForm {
    attributeDisplayForm: IAttributeDisplayFormInternal;
}
