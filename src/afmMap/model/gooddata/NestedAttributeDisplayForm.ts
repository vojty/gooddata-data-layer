import { IMetadataObject } from './MetadataObject';

export interface INestedAttributeDisplayForm extends IMetadataObject {
    content: {
        expression: string;
        formOf: string;
        ldmexpression?: string;
        type?: string;
    };

    links: {
        elements: string;
    };
}
