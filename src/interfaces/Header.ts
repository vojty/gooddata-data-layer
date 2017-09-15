export enum HeaderType {
    Attribute = 'attrLabel',
    Metric = 'metric'
}

export interface IAttributeHeader {
    type: HeaderType.Attribute;
    id: string;
    uri: string;
    title: string;
}

export interface IMetricHeader {
    type: HeaderType.Metric;
    id: string;
    uri?: string;
    title: string;
    format?: string;
}

export type Header = IAttributeHeader | IMetricHeader;
