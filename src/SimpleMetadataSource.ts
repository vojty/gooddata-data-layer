import * as stringify from 'json-stable-stringify';
import * as VisObj from './legacy/model/VisualizationObject';
import { IMetadataSource } from './interfaces/MetadataSource';

export class SimpleMetadataSource implements IMetadataSource {
    private fingerprint: string;

    constructor(
        private visualizationObjectContent: VisObj.IVisualizationObjectContent,
        private measuresMap: VisObj.IMeasuresMap
    ) {
        this.fingerprint = stringify(this.visualizationObjectContent);
    }

    public getVisualizationMetadata(): Promise<VisObj.IVisualizationMetadataResult> {
        return Promise.resolve({
            metadata: {
                content: this.visualizationObjectContent,
                meta: {
                    title: 'Test'
                }
            },
            measuresMap: this.measuresMap
        });
    }

    public getFingerprint() {
        return this.fingerprint;
    }
}
