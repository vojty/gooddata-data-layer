import first = require('lodash/first');
import compact = require('lodash/compact');
import flatMap = require('lodash/flatMap');
import flow = require('lodash/flow');
import isEmpty = require('lodash/isEmpty');
import uniq = require('lodash/uniq');
import flatten = require('lodash/flatten');
import * as AFM from '../interfaces/Afm';
import { areUris } from '../helpers/uri';
import { DateFilterMap, IAttributeElement, IDateFilterRefData } from './DateFilterMap';
import { AttributeMap } from './AttributeMap';
import {
    getInsightDateFilter,
    hasFilters, isAbsoluteDateFilter, isAttributeFilter,
    isDateFilter, isPoP, isShowInPercent
} from '../utils/AfmUtils';
import { IGoodDataSDK } from '../interfaces/GoodDataSDK';
import { IAttributeDisplayForm } from './model/gooddata/AttributeDisplayForm';
import { IAttribute } from './model/gooddata/Attribute';
import { IDataSet } from './model/gooddata/DataSet';

export class AfmMapBuilder {
    private sdk: IGoodDataSDK;
    private projectId: string;

    constructor(sdk: IGoodDataSDK, projectId: string) {
        this.sdk = sdk;
        this.projectId = projectId;
    }

    public build(afm: AFM.IAfm): Promise<[AttributeMap, DateFilterMap]> {
        const promises: [Promise<AttributeMap>, Promise<DateFilterMap>] = [
            this.buildAttributeMap(afm),
            this.buildDateFilterMap(afm)
        ];

        return Promise.all(promises);
    }

    public buildAttributeMap(afm: AFM.IAfm): Promise<AttributeMap> {
        const attributes = lookupAttributes(afm);

        if (isEmpty(attributes)) {
            return Promise.resolve([]);
        }

        const loadAttributeUris = areUris(attributes)
            ? Promise.resolve(attributes)
            : this.sdk.md.getUrisFromIdentifiers(this.projectId, attributes)
                .then(pairs => pairs.map((pair: { uri: string }) => pair.uri));

        return loadAttributeUris.then((objectUris) => {
            return this.sdk.md.getObjects(this.projectId, objectUris)
                .then(items => items.map((item: IAttributeDisplayForm) => ({
                    attribute: item.attributeDisplayForm.content.formOf,
                    attributeDisplayForm: areUris(attributes) ?
                        item.attributeDisplayForm.meta.uri :
                        item.attributeDisplayForm.meta.identifier
                })));
        });
    }

    public buildDateFilterMap(afm: AFM.IAfm): Promise<DateFilterMap> {
        const dateFilters = getMeasureDateFilters(afm);
        if (isEmpty(dateFilters)) {
            return Promise.resolve([]);
        }

        const insightDateFilter = getInsightDateFilter(afm);
        if (insightDateFilter) {
            dateFilters.push(insightDateFilter);
        }

        const dataSetUri = (dateFilters[0] as AFM.IDateFilter).id;

        return this.sdk.md.getObjects(this.projectId, [dataSetUri])
            .then((dataSetObjects) => {
                const dateAttributes = first<IDataSet>(dataSetObjects).dataSet.content.attributes;
                return this.sdk.md.getObjects(this.projectId, dateAttributes);
            })
            .then((dateAttributeObjects: IAttribute[]) => {
                const dateRefDataPromises: Array<Promise<IDateFilterRefData>> = dateAttributeObjects
                    .map(dateAttribute  => this.buildDateRefData(dateAttribute, dateFilters));

                return Promise.all(dateRefDataPromises);
            });
    }

    public buildDateRefData(
        dateAttribute: IAttribute,
        dateFilters: AFM.IDateFilter[]
    ): Promise<IDateFilterRefData> {
        const refData: IDateFilterRefData = {
            dateAttributeType: dateAttribute.attribute.content.type,
            dateAttributeUri: dateAttribute.attribute.meta.uri,
            dateDisplayFormUri: null,
            attributeElements: []
        };

        const dateDisplayFormUri = getDefaultDateDisplayForm(dateAttribute);
        if (dateDisplayFormUri) {
            const elementsLabels = getAbsoluteFiltersElementsLabels(dateFilters, dateDisplayFormUri);
            if (elementsLabels.length > 0) {
                return this.buildAttributeElements(elementsLabels, dateDisplayFormUri)
                    .then((elements) => {
                        refData.dateDisplayFormUri = dateDisplayFormUri;
                        refData.attributeElements = elements;
                        return Promise.resolve(refData);
                    });
            }
        }

        return Promise.resolve(refData);
    }

    public buildAttributeElements(
        elementsLabels: string[],
        displayFormUri: string
    ): Promise<IAttributeElement[]> {
        return this.sdk.md.translateElementLabelsToUris(this.projectId, displayFormUri, elementsLabels)
            .then((elementLabelUri) => {
                const results = elementLabelUri[0].result;
                const attributeElements = elementsLabels.map((elementLabel): IAttributeElement => {
                    const elementResult = results
                        .find((result: { pattern: string }) => result.pattern === elementLabel);
                    return {
                        label: elementResult.elementLabels[0].elementLabel,
                        uri: elementResult.elementLabels[0].uri
                    };
                });

                return Promise.resolve(attributeElements);
            });
    }
}

export function getMeasureDateFilters(normalizedAfm: AFM.IAfm): AFM.IDateFilter[] {
    return flatMap(normalizedAfm.measures, (measure) => {
        return hasFilters(measure) ? measure.definition.filters.filter(isDateFilter) : [];
    });
}

export function lookupAttributes(afm: AFM.IAfm) {
    const attributes = afm.measures.map((measure: AFM.IMeasure) => {
        const ids = [];
        if (isPoP(measure)) { // MAQL - FOR PREVIOUS ([attributeUri]) OR ({attributeId})
            ids.push(measure.definition.popAttribute.id);
        }

        if (isShowInPercent(measure)) { // MAQL - BY ALL [attributeUri1], ALL [attributeUri2] OR ALL {attributeId2}
            ids.push(...afm.attributes.map((attribute: AFM.IAttribute) => attribute.id));
        }

        if (hasFilters(measure)) {
            ids.push(...measure.definition.filters
                .filter(isAttributeFilter)
                .map(filter => filter.id));
        }

        return ids;
    });

    return flow(
        flatten,
        compact,
        uniq
    )(attributes);
}

function getDefaultDateDisplayForm(dateAttribute: IAttribute): string {
    const defaultDisplayForm = dateAttribute.attribute.content.displayForms
        .find(displayForm => displayForm.content.type === 'GDC.time.day');
    return (defaultDisplayForm) ? defaultDisplayForm.meta.uri : null;
}

// tslint:disable-next-line:variable-name
function getAbsoluteFiltersElementsLabels(dateFilters: AFM.IDateFilter[], _displayFormUri: string): string[] {
    const betweenStrings = dateFilters.filter(isAbsoluteDateFilter)
        .map((filter) => {
            return filter.between as [string, string];
        });

    return flow(flatten, uniq)(betweenStrings);
}
