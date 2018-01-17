import { AFM } from '@gooddata/typings';
import { Granularities } from '../../../constants/granularities';

export interface IFixture {
    afm: AFM.IAfm;
    resultSpec: AFM.IResultSpec;
}

export const empty: IFixture = {
    afm: {},

    resultSpec: {}
};

export const METRIC_ID_URI = '/gdc/md/project/obj/metric.id';
export const ATTRIBUTE_DISPLAY_FORM_URI = '/gdc/md/project/obj/1';
export const ATTRIBUTE_URI = '/gdc/md/project/obj/11';
export const ATTRIBUTE_DISPLAY_FORM_URI_2 = '/gdc/md/project/obj/2';
export const ATTRIBUTE_URI_2 = '/gdc/md/project/obj/22';
export const DATE_DISPLAY_FORM_URI = '/gdc/md/project/obj/3';
export const DATE_URI = '/gdc/md/project/33';
export const DATE_DATA_SET_URI = '/gdc/md/project/333';

export const simpleMeasure: IFixture = {
    afm: {
        measures: [
            {
                localIdentifier: 'm1',
                definition: {
                    measure: {
                        item: {
                            uri: METRIC_ID_URI
                        }
                    }
                },
                alias: 'Measure M1'
            }
        ]
    },
    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: ['measureGroup']
            },
            {
                itemIdentifiers: []
            }
        ]
    }
};

export const renamedMeasure: IFixture = {
    afm: {
        measures: [
            {
                localIdentifier: 'm1',
                definition: {
                    measure: {
                        item: {
                            uri: METRIC_ID_URI
                        }
                    }
                },
                alias: 'Alias A1'
            }
        ]
    },
    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: ['measureGroup']
            },
            {
                itemIdentifiers: []
            }
        ]
    }
};

export const filteredMeasure: IFixture = {
    afm: {
        measures: [
            {
                localIdentifier: 'm1',
                definition: {
                    measure: {
                        item: {
                            uri: METRIC_ID_URI
                        },
                        filters: [
                            {
                                positiveAttributeFilter: {
                                    displayForm: {
                                        uri: ATTRIBUTE_DISPLAY_FORM_URI
                                    },
                                    in: [
                                        `${ATTRIBUTE_URI}?id=1`,
                                        `${ATTRIBUTE_URI}?id=2`
                                    ]
                                }
                            }
                        ]
                    }
                },
                alias: 'Measure M1'
            }
        ]
    },

    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: ['measureGroup']
            },
            {
                itemIdentifiers: []
            }
        ]
    }
};

export const measureWithRelativeDate: IFixture = {
    afm: {
        measures: [
            {
                localIdentifier: 'm1',
                definition: {
                    measure: {
                        item: {
                            uri: METRIC_ID_URI
                        },
                        filters: [
                            {
                                relativeDateFilter: {
                                    dataSet: {
                                        uri: DATE_DATA_SET_URI
                                    },
                                    granularity: Granularities.DATE,
                                    from: -89,
                                    to: 0
                                }
                            },
                            {
                                positiveAttributeFilter: {
                                    displayForm: {
                                        uri: ATTRIBUTE_DISPLAY_FORM_URI
                                    },
                                    in: [
                                        `${ATTRIBUTE_URI}?id=1`,
                                        `${ATTRIBUTE_URI}?id=2`
                                    ]
                                }
                            }
                        ]
                    }
                },
                alias: 'Measure M1'
            }
        ]
    },

    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: ['measureGroup']
            },
            {
                itemIdentifiers: []
            }
        ]
    }
};

export const measureWithAbsoluteDate: IFixture = {
    afm: {
        measures: [
            {
                localIdentifier: 'm1',
                definition: {
                    measure: {
                        item: {
                            uri: METRIC_ID_URI
                        },
                        filters: [
                            {
                                absoluteDateFilter: {
                                    dataSet: {
                                        uri: DATE_DATA_SET_URI
                                    },
                                    from: '2016-01-01',
                                    to: '2017-01-01'
                                }
                            },
                            {
                                positiveAttributeFilter: {
                                    displayForm: {
                                        uri: ATTRIBUTE_DISPLAY_FORM_URI
                                    },
                                    in: [
                                        `${ATTRIBUTE_URI}?id=1`,
                                        `${ATTRIBUTE_URI}?id=2`
                                    ]
                                }
                            }
                        ]
                    }
                },
                alias: 'Measure M1'
            }
        ]
    },

    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: ['measureGroup']
            },
            {
                itemIdentifiers: []
            }
        ]
    }
};

export const popMeasure: IFixture = {
    afm: {
        measures: [
            {
                localIdentifier: 'm1_pop',
                definition: {
                    popMeasure: {
                        measureIdentifier: 'm1',
                        popAttribute: {
                            uri: ATTRIBUTE_URI
                        }
                    }
                },
                alias: 'Measure M1 - translated-pop-suffix'
            },
            {
                localIdentifier: 'm1',
                definition: {
                    measure: {
                        item: {
                            uri: METRIC_ID_URI
                        }
                    }
                },
                alias: 'Measure M1'
            }
        ],
        attributes: [
            {
                displayForm: {
                    uri: ATTRIBUTE_DISPLAY_FORM_URI
                },
                localIdentifier: 'a1'
            }
        ]
    },

    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: ['measureGroup']
            },
            {
                itemIdentifiers: ['a1']
            }
        ],
        sorts: [
            {
                measureSortItem: {
                    direction: 'desc',
                    locators: [
                        {
                            measureLocatorItem: {
                                measureIdentifier: 'm1'
                            }
                        }
                    ]
                }
            }
        ]
    }
};

export const popMeasureWithSorting: IFixture = {
    afm: {
        measures: [
            {
                localIdentifier: 'm1_pop',
                definition: {
                    popMeasure: {
                        measureIdentifier: 'm1',
                        popAttribute: {
                            uri: ATTRIBUTE_URI
                        }
                    }
                },
                alias: 'Measure M1 - translated-pop-suffix'
            },
            {
                localIdentifier: 'm1',
                definition: {
                    measure: {
                        item: {
                            uri: METRIC_ID_URI
                        }
                    }
                },
                alias: 'Measure M1'
            }
        ],
        attributes: [
            {
                displayForm: {
                    uri: ATTRIBUTE_DISPLAY_FORM_URI
                },
                localIdentifier: 'a1'
            }
        ]
    },

    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: ['measureGroup']
            },
            {
                itemIdentifiers: ['a1']
            }
        ],
        sorts: [
            {
                measureSortItem: {
                    direction: 'desc',
                    locators: [
                        {
                            measureLocatorItem: {
                                measureIdentifier: 'm1_pop'
                            }
                        }
                    ]
                }
            }
        ]
    }
};

export const showInPercent: IFixture = {
    afm: {
        measures: [
            {
                localIdentifier: 'm1',
                definition: {
                    measure: {
                        item: {
                            uri: METRIC_ID_URI
                        },
                        computeRatio: true
                    }
                },
                format: '#,##0.00%',
                alias: 'Measure M1'
            }
        ],

        attributes: [
            {
                displayForm: {
                    uri: ATTRIBUTE_DISPLAY_FORM_URI
                },
                localIdentifier: 'a1'
            }
        ]
    },

    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: ['measureGroup']
            },
            {
                itemIdentifiers: ['a1']
            }
        ]
    }
};

export const showInPercentWithDate: IFixture = {
    afm: {
        measures: [
            {
                localIdentifier: 'm1',
                definition: {
                    measure: {
                        item: {
                            uri: METRIC_ID_URI
                        },
                        computeRatio: true
                    }
                },
                format: '#,##0.00%',
                alias: 'Measure M1'
            }
        ],

        attributes: [
            {
                displayForm: {
                    uri: DATE_DISPLAY_FORM_URI
                },
                localIdentifier: 'a1'
            }
        ]
    },
    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: ['measureGroup']
            },
            {
                itemIdentifiers: ['a1']
            }
        ]
    }
};

export const measureWithSorting: IFixture = {
    afm: {
        measures: [
            {
                localIdentifier: 'm1',
                definition: {
                    measure: {
                        item: {
                            uri: METRIC_ID_URI
                        }
                    }
                },
                alias: 'Measure M1'
            }
        ]
    },

    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: ['measureGroup']
            },
            {
                itemIdentifiers: []
            }
        ],
        sorts: [
            {
                measureSortItem: {
                    direction: 'desc',
                    locators: [
                        {
                            measureLocatorItem: {
                                measureIdentifier: 'm1'
                            }
                        }
                    ]
                }
            }
        ]
    }
};

export const categoryWithSorting: IFixture = {
    afm: {
        attributes: [
            {
                displayForm: {
                    uri: ATTRIBUTE_DISPLAY_FORM_URI
                },
                localIdentifier: 'a1'
            }
        ]
    },

    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: []
            },
            {
                itemIdentifiers: ['a1']
            }
        ],
        sorts: [
            {
                attributeSortItem: {
                    direction: 'desc',
                    attributeIdentifier: 'a1'
                }
            }
        ]
    }
};

export const factBasedMeasure: IFixture = {
    afm: {
        measures: [
            {
                localIdentifier: 'm1',
                definition: {
                    measure: {
                        item: {
                            uri: '/gdc/md/project/obj/fact.id'
                        },
                        aggregation: 'sum'
                    }
                },
                alias: 'SUM of Measure M1'
            }
        ]
    },

    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: ['measureGroup']
            },
            {
                itemIdentifiers: []
            }
        ]
    }
};

export const factBasedRenamedMeasure: IFixture = {
    afm: {
        measures: [
            {
                localIdentifier: 'm1',
                definition: {
                    measure: {
                        item: {
                            uri: '/gdc/md/project/obj/fact.id'
                        },
                        aggregation: 'sum'
                    }
                },
                alias: 'Summary'
            }
        ]
    },

    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: ['measureGroup']
            },
            {
                itemIdentifiers: []
            }
        ]
    }
};

export const attributeBasedMeasure: IFixture = {
    afm: {
        measures: [
            {
                localIdentifier: 'm1',
                definition: {
                    measure: {
                        item: {
                            uri: ATTRIBUTE_DISPLAY_FORM_URI
                        },
                        aggregation: 'count'
                    }
                },
                alias: 'COUNT of Measure M1',
                format: '#,##0'
            }
        ]
    },
    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: ['measureGroup']
            },
            {
                itemIdentifiers: []
            }
        ]
    }
};

export const attributeBasedRenamedMeasure: IFixture = {
    afm: {
        measures: [
            {
                localIdentifier: 'm1',
                definition: {
                    measure: {
                        item: {
                            uri: ATTRIBUTE_DISPLAY_FORM_URI
                        },
                        aggregation: 'count'
                    }
                },
                alias: 'Count',
                format: '#,##0'
            }
        ]
    },
    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: ['measureGroup']
            },
            {
                itemIdentifiers: []
            }
        ]
    }
};

export const stackingAttribute: IFixture = {
    afm: {
        measures: [
            {
                localIdentifier: 'm1',
                definition: {
                    measure: {
                        item: {
                            uri: METRIC_ID_URI
                        },
                        aggregation: 'sum'
                    }
                },
                alias: 'Sum of Bundle cost'
            }
        ],
        attributes: [
            {
                displayForm: {
                    uri: DATE_DISPLAY_FORM_URI
                },
                localIdentifier: 'a1'
            },
            {
                displayForm: {
                    uri: ATTRIBUTE_DISPLAY_FORM_URI
                },
                localIdentifier: 'a2'
            }
        ],
        filters: [
            {
                relativeDateFilter: {
                    dataSet: {
                        uri: DATE_DATA_SET_URI
                    },
                    granularity: 'GDC.time.quarter',
                    from: -3,
                    to: 0
                }
            },
            {
                negativeAttributeFilter: {
                    displayForm: {
                        uri: ATTRIBUTE_DISPLAY_FORM_URI
                    },
                    notIn: [
                        `${ATTRIBUTE_URI}?id=1`
                    ]
                }
            }
        ]
    },

    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: ['a2']
            },
            {
                itemIdentifiers: ['a1', 'measureGroup']
            }
        ]
    }
};

export const stackingRenamedAttribute: IFixture = {
    afm: {
        measures: [
            {
                localIdentifier: 'm1',
                definition: {
                    measure: {
                        item: {
                            uri: METRIC_ID_URI
                        },
                        aggregation: 'sum'
                    }
                },
                alias: 'My Metric Alias'
            }
        ],
        attributes: [
            {
                alias: 'My Date Alias',
                displayForm: {
                    uri: DATE_DISPLAY_FORM_URI
                },
                localIdentifier: 'a1'
            },
            {
                alias: 'My Attribute Alias',
                displayForm: {
                    uri: ATTRIBUTE_DISPLAY_FORM_URI
                },
                localIdentifier: 'a2'
            }
        ]
    },

    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: ['a2']
            },
            {
                itemIdentifiers: ['a1', 'measureGroup']
            }
        ]
    }
};

export const attributeFilter: IFixture = {
    afm: {
        filters: [
            {
                positiveAttributeFilter: {
                    displayForm: {
                        uri: ATTRIBUTE_DISPLAY_FORM_URI
                    },
                    in: [
                        `${ATTRIBUTE_URI}?id=1`,
                        `${ATTRIBUTE_URI}?id=2`,
                        `${ATTRIBUTE_URI}?id=3`
                    ]
                }
            },
            {
                positiveAttributeFilter: {
                    displayForm: {
                        uri: ATTRIBUTE_DISPLAY_FORM_URI_2
                    },
                    in: [
                        `${ATTRIBUTE_URI_2}?id=a`
                    ]
                }
            }
        ]
    },
    resultSpec: {}
};

export const attributeFilterWithAll: IFixture = {
    afm: {
        filters: [
            {
                positiveAttributeFilter: {
                    displayForm: {
                        uri: ATTRIBUTE_DISPLAY_FORM_URI_2
                    },
                    in: [
                        `${ATTRIBUTE_URI_2}?id=a`
                    ]
                }
            }
        ]
    },
    resultSpec: {}
};

export const dateFilter: IFixture = {
    afm: {
        filters: [
            {
                relativeDateFilter: {
                    dataSet: {
                        uri: DATE_DATA_SET_URI
                    },
                    from: -89,
                    to: 0,
                    granularity: Granularities.DATE
                }
            }
        ]
    },
    resultSpec: {}
};

export const dateFilterWithoutInterval: IFixture = {
    afm: {},
    resultSpec: {}
};

export const attributeWithIdentifier: IFixture = {
    afm: {
        measures: [
            {
                localIdentifier: 'm1',
                definition: {
                    measure: {
                        item: {
                            identifier: 'foo'
                        }
                    }
                }
            }
        ],
        attributes: [
            {
                displayForm: {
                    identifier: 'bar'
                },
                localIdentifier: 'a1'
            }
        ]
    },

    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: ['measureGroup']
            },
            {
                itemIdentifiers: []
            }
        ]
    }
};

export const segmentedAndTrendedLineChart: IFixture = {
    afm: {
        measures: [
            {
                localIdentifier: 'm1',
                definition: {
                    measure: {
                        item: {
                            uri: METRIC_ID_URI
                        },
                        aggregation: 'sum'
                    }
                },
                alias: 'Sum of Bundle cost'
            }
        ],
        attributes: [
            {
                displayForm: {
                    uri: DATE_DISPLAY_FORM_URI
                },
                localIdentifier: 'a1'
            },
            {
                displayForm: {
                    uri: ATTRIBUTE_DISPLAY_FORM_URI
                },
                localIdentifier: 'a2'
            }
        ]
    },
    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: ['a2']
            },
            {
                itemIdentifiers: ['a1', 'measureGroup']
            }
        ]
    }
};

export const measuresOnlyPieChart: IFixture = {
    afm: {
        measures: [
            {
                localIdentifier: 'm1',
                definition: {
                    measure: {
                        item: {
                            uri: METRIC_ID_URI
                        }
                    }
                },
                alias: 'Close BOP'
            },
            {
                localIdentifier: 'm2',
                definition: {
                    measure: {
                        item: {
                            uri: METRIC_ID_URI
                        }
                    }
                },
                alias: 'Close EOP'
            }
        ]
    },
    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: []
            },
            {
                itemIdentifiers: ['measureGroup']
            }
        ]
    }
};

export const oneMeasureOneAttribute: IFixture = {
    afm: {
        measures: [
            {
                localIdentifier: 'm1',
                definition: {
                    measure: {
                        aggregation: 'sum',
                        item: {
                            uri: METRIC_ID_URI
                        }
                    }
                },
                alias: 'Sum of Bundle cost'
            }
        ],
        attributes: [
            {
                localIdentifier: 'a1',
                displayForm: {
                    uri: ATTRIBUTE_DISPLAY_FORM_URI
                }
            }
        ]
    },
    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: ['a1']
            },
            {
                itemIdentifiers: ['measureGroup']
            }
        ]
    }
};

export const reducedMultipleSorts: IFixture = {
    afm: {
        measures: [
            {
                localIdentifier: 'm1',
                definition: {
                    measure: {
                        aggregation: 'sum',
                        item: {
                            uri: METRIC_ID_URI
                        }
                    }
                },
                alias: 'Sum of Bundle cost'
            },
            {
                localIdentifier: 'm2',
                definition: {
                    measure: {
                        aggregation: 'sum',
                        item: {
                            uri: METRIC_ID_URI
                        }
                    }
                },
                alias: 'Sum of Bundle cost'
            }
        ]
    },
    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: []
            },
            {
                itemIdentifiers: ['measureGroup']
            }
        ],
        sorts: [
            {
                measureSortItem: {
                    direction: 'desc',
                    locators: [
                        {
                            measureLocatorItem: {
                                measureIdentifier: 'm1'
                            }
                        }
                    ]
                }
            }
        ]
    }
};
