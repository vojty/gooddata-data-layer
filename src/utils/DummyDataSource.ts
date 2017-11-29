import { IDataSource } from '../interfaces/DataSource';

export class DummyDataSource<T> implements IDataSource<T> {
    private data: T;
    private resolve: boolean;

    constructor(data: T, resolve: boolean = true) {
        this.data = data;
        this.resolve = resolve;
    }

    public getData(): Promise<T> { // tslint:disable-line:variable-name
        if (this.resolve) {
            return Promise.resolve(this.data);
        }

        return Promise.reject('DummyDataSource reject');
    }

    public getFingerprint() {
        return '';
    }

    public getResultSpec() {
        return {};
    }

    public getAfm() {
        return {};
    }
}
