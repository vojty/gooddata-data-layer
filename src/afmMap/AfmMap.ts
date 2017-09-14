import invariant = require('invariant');
import { DateFilterMap, IDateFilterRefData } from './DateFilterMap';
import { AttributeMap } from './AttributeMap';
import { IDateFilter } from '../interfaces/Afm';

export class AfmMap {
    private insightDateFilter: IDateFilter = null;
    private dateFilterMap: DateFilterMap = [];
    private attributeMap: AttributeMap = [];

    constructor(results: [AttributeMap, DateFilterMap] = [[],[]], insightDateFilter: IDateFilter = null) {
        this.attributeMap = results[0];
        this.dateFilterMap = results[1];
        this.insightDateFilter = insightDateFilter;
    }

    public getAttributeByDisplayForm(displayForm): string {
        const item = this.attributeMap.find(i => i.attributeDisplayForm === displayForm);
        invariant(item, `${displayForm} not found in ${JSON.stringify(this.attributeMap)}`);
        return item.attribute;
    }

    public getDateAttribute(filter: IDateFilter): IDateFilterRefData {
        const dateType = `GDC.time.${filter.granularity}`;
        const item = this.dateFilterMap.find(item => item.dateAttributeType === dateType);
        return item;
    }

    public getInsightDateFilter() {
        return this.insightDateFilter;
    }
}

export function getDateElementUri(dateFilterRefData: IDateFilterRefData, elementValue): string {
    const element = dateFilterRefData.attributeElements.find(item => item.label === elementValue);
    return element.uri;
}

