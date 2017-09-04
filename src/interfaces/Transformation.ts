export interface ISort {
    column: string;
    direction: string;
}

export interface IObject {
    id: string;
    title?: string;
}

export interface IMeasure extends IObject {
    format?: string;
}

export interface IDimension {
    name: string;
    attributes: IObject[];
}

/**
 * Dimensions group bunch
 * of attributes belonging together.
 * E.g.:
 * - for pivot table we split attributes between "columns" and "rows"
 * bucket
 * - for stack bar chart we can put "view by" into "series" bucket
 * and "stack by" into "stack" bucket
 */
export interface ITransformation {
    sorting?: ISort[];
    measures?: IMeasure[];
    dimensions?: IDimension[];
}
