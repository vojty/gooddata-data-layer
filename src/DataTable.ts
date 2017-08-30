import isEqual = require('lodash/isEqual');

import { IAdapter } from './interfaces/Adapter';
import { IDataSource } from './interfaces/DataSource';
import { isAfmExecutable } from './utils/AfmUtils';

export type IDataSubscriber = (data: any) => any;
export type IErrorSubscriber = (error: any) => any;

/*
 * We are not able to cancel Promise, so we make it "cancellable".
 * Cancelled promise is "rejected" with:
 * { isCanceled: true, (error: ErrorReason)? }
 *
 * Inspiration: https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html
 * Fixed solution: https://github.com/facebook/react/issues/5465#issuecomment-269805565
 * see https://www.youtube.com/watch?v=otCpCn0l4Wo
 */
const makeCancelable = (promise) => {
    let isCancelled = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then(
            // Don't split - UnhandledPromiseRejectionWarning may occur
            value => isCancelled ? reject({ isCancelled }) : resolve(value),
            error => isCancelled ? reject({ isCancelled, error }) : reject(error)
        );
    });

    return {
        promise: wrappedPromise,
        cancel() {
            isCancelled = true;
        }
    };
};

export class DataTable {
    private adapter: IAdapter;

    private dataSubscribers: IDataSubscriber[] = [];
    private errorSubscribers: IErrorSubscriber[] = [];

    private afm;

    private dataSource: IDataSource;
    private cancellablePromise;

    constructor(adapter: IAdapter) {
        this.adapter = adapter;
    }

    public getData(afm, transformation) {
        if (!isAfmExecutable(afm)) {
            return;
        }

        if (!isEqual(afm, this.afm)) {
            this.afm = afm;
            this.adapter.createDataSource(afm)
                .then((dataSource) => {
                    this.dataSource = dataSource;
                    this.fetchData(transformation);
                    return;
                });
        } else if (this.dataSource) {
            this.fetchData(transformation);
        }
    }

    /**
     * @return Promise instance which could be cancelled. When promise is
     * cancelled, it's rejected with object { isCancelled: true }
     */
    public execute(afm, transformation) {
        if (!isAfmExecutable(afm)) {
            return Promise.resolve(null);
        }

        if (!isEqual(afm, this.afm) || !this.dataSource) {
            this.afm = afm;
            return this.adapter.createDataSource(afm)
                .then((dataSource) => {
                    this.dataSource = dataSource;
                    return this.getDataPromise(transformation);
                });
        } else {
            return this.getDataPromise(transformation);
        }
    }

    public onData(callback) {
        this.dataSubscribers.push(callback);
    }

    public onError(callback) {
        this.errorSubscribers.push(callback);
    }

    public resetDataSubscribers() {
        this.dataSubscribers = [];
        return this;
    }

    public resetErrorSubscribers() {
        this.errorSubscribers = [];
        return this;
    }

    private fetchData(transformation) {
        this.getDataPromise(transformation)
            .then(result => this.dataSubscribers.forEach(handler => handler(result)))
            .catch((error) => {
                if (!error.isCancelled) {
                    this.errorSubscribers.forEach(handler => handler(error));
                }
            });

        return this;
    }

    private getDataPromise(transformation) {
        if (this.cancellablePromise) {
            this.cancellablePromise.cancel();
        }

        this.cancellablePromise = makeCancelable(
            this.dataSource.getData(transformation)
        );

        return this.cancellablePromise.promise;
    }
}
