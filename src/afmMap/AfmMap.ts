import invariant = require('invariant');
import { DateFilterMap, IDateFilterRefData } from './DateFilterMap';
import { AttributeMap, ObjectUri } from './AttributeMap';
import { IDateFilter } from '../interfaces/Afm';

export class AfmMap {
    private globalDateFilters: IDateFilter[] = null;
    private dateFilterMap: DateFilterMap = [];
    private attributeMap: AttributeMap = [];

    constructor(results: [AttributeMap, DateFilterMap] = [[], []], globalDateFilters: IDateFilter[] = null) {
        this.attributeMap = results[0];
        this.dateFilterMap = results[1];
        this.globalDateFilters = globalDateFilters;
    }

    public getAttributeByDisplayForm(displayForm: ObjectUri): string {
        const item = this.attributeMap.find(i => i.attributeDisplayForm === displayForm);
        invariant(item, `${displayForm} not found in ${JSON.stringify(this.attributeMap)}`);
        return item.attribute;
    }

    public getDateAttribute(filter: IDateFilter): IDateFilterRefData {
        const dateType = `GDC.time.${filter.granularity}`;
        return this.dateFilterMap.find(item => item.dateAttributeType === dateType &&
            item.dateDataSetId === filter.id);
    }

    public getGlobalDateFilters() {
        return this.globalDateFilters;
    }
}

export function getDateElementUri(dateFilterRefData: IDateFilterRefData, elementValue: string): string {
    const element = dateFilterRefData.attributeElements.find(item => item.label === elementValue);
    return element.uri;
}
