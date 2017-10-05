
export type DateFilterMap = IDateFilterRefData[];

export interface IAttributeElement {
    label: string;
    uri: string;
}

export interface IDateFilterRefData {
    dateDataSetId: string;
    dateAttributeType: string;
    dateAttributeUri: string;
    dateDisplayFormUri: string;
    attributeElements: IAttributeElement[];
}
