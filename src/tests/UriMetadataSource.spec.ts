import { UriMetadataSource } from '../UriMetadataSource';
import { IGoodDataSDK } from '../interfaces/GoodDataSDK';
import { empty } from '../fixtures/VisualizationObject.fixtures';

describe('UriMetadataSource', () => {
    const uri: string = '/gdc/md/FoodMartDemo/1';

    function createGooddataSDK(): IGoodDataSDK {
        const md = { visualization: empty };

        return {
            md: {
                getObjects: jest.fn().mockReturnValue(Promise.resolve([]))
            },
            xhr: {
                get: jest.fn().mockReturnValue(Promise.resolve(md))
            }
        };
    }

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
