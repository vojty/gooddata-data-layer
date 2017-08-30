import { IDataSource } from '../interfaces/DataSource';
import { IMetadataSource } from '../interfaces/MetadataSource';

export function dataSourcesMatch(first: IDataSource | IMetadataSource, second: IDataSource | IMetadataSource): boolean {
    const firstFingerprint = first ? first.getFingerprint() : null;
    const secondFingerprint = second ? second.getFingerprint() : null;

    return firstFingerprint === secondFingerprint;
}
