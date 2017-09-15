import { ISort } from '../interfaces/Transformation';

export interface IMetricDefinition {
    identifier: string;
    expression: string;
    format?: string;
    title?: string;
}

export interface IDefinition {
    metricDefinition: IMetricDefinition;
}

export interface IExecutionRequest {
    execution: {
        columns: string[];
        orderBy?: ISort[];
        filters?: any[];
        definitions?: IDefinition[];
        where?: {
            [key: string]: any;
        }
    };
}
