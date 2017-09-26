import { Header } from './Header';

export type WarningParameterType = boolean | number | string | null;

export interface ISimpleExecutorWarning {
    errorCode: string;
    message: string;
    parameters: WarningParameterType[];
}

export type MetricValue = string;

export interface IAttributeValue {
    id: string;
    name: string;
}

export type ResultDataType = MetricValue | IAttributeValue;

export interface ISimpleExecutorResult {
    rawData?: ResultDataType[][];
    isEmpty?: boolean;
    headers?: Header[];
    isLoaded?: boolean;
    warnings?: ISimpleExecutorResult[];
}
