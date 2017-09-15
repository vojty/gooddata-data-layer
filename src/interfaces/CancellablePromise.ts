export interface ICancellablePromise<T> {
    promise: Promise<T>;
    error?: any;
    cancel: () => void;
}
