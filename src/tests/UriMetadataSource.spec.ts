import * as GoodData from 'gooddata';
import { UriMetadataSource } from '../UriMetadataSource';
import { empty } from '../fixtures/VisualizationObject.fixtures';

describe('UriMetadataSource', () => {
    const uri: string = '/gdc/md/FoodMartDemo/1';

    function createGooddataSDK(): typeof GoodData {
        const md = { visualization: empty };

        jest.spyOn(GoodData.md, 'getObjects')
            .mockImplementation(() => Promise.resolve([]));

        jest.spyOn(GoodData.xhr, 'get')
            .mockImplementation(() => Promise.resolve(md));

        return GoodData;
    }

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should request metadataobject on getData if not cached', () => {
        const source = new UriMetadataSource(createGooddataSDK(), uri);
        return source.getVisualizationMetadata().then((result) => {
            expect(result.metadata).toEqual(empty);
        });
    });

    it('should take md object from cache if already fetched', () => {
        const sdk = createGooddataSDK();

        const source = new UriMetadataSource(sdk, uri);
        return source.getVisualizationMetadata().then((first) => {
            return source.getVisualizationMetadata().then((second) => {
                expect(first.metadata).toEqual(second.metadata);
                expect(sdk.xhr.get).toHaveBeenCalledTimes(1);
            });
        });
    });
});
