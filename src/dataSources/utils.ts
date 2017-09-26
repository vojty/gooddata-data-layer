import { IDataSource } from '../interfaces/DataSource';
import { IMetadataSource } from '../interfaces/MetadataSource';

export function dataSourcesMatch<T>(
    first: IDataSource<T> | IMetadataSource,
    second: IDataSource<T> | IMetadataSource
): boolean {
    const firstFingerprint = first ? first.getFingerprint() : null;
    const secondFingerprint = second ? second.getFingerprint() : null;

    return firstFingerprint === secondFingerprint;
}
