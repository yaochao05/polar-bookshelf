/**
 * Loads PHZs directly by opening them, decompressing them, and parsing the HTML
 * and then replacing the iframes directly.
 */
import {PathStr} from '../util/Strings';
import {URLStr} from '../util/Strings';
import {URLs} from '../util/URLs';
import {PHZReader} from './PHZReader';
import {Logger} from '../logger/Logger';
import {Captured} from '../capture/renderer/Captured';
import {Resources} from './Resources';
import {Reducers} from '../util/Reducers';
import {Blobs} from '../util/Blobs';

const log = Logger.create();

export class DirectPHZLoader {

    public static async load(resource: PathStr | URLStr) {

        const toPHZReader = async () => {

            const phzReader = new PHZReader();

            if (URLs.isURL(resource)) {
                const response = await fetch(resource);
                const blob = await response.blob();

                phzReader.init(blob);

            } else {
                // this is a path string.
                phzReader.init(resource);
            }

            return phzReader;

        };

        const phzReader = await toPHZReader();

        const metadata = await phzReader.getMetadata();

        if (metadata) {
            const resources = await phzReader.getResources();
        } else {
            log.warn("Document has no metadata: " + resource);
        }


    }

    private static async doDocumentLoad(phzReader: PHZReader, metadata: Captured, resources: Resources) {

        const url = metadata.url;

        const primaryResource = Object.values(resources.entries)
            .filter(current => current.resource.url === url)
            .reduce(Reducers.FIRST);

        if (primaryResource) {

            const blob = await phzReader.getResourceAsBlob(primaryResource);

            // now that we have the blob, which should be HTML , parse it into
            // its own document object.

            const str = await Blobs.toText(blob);

            const doc = new DOMParser().parseFromString(str, 'text/html');

            // FIXME: now we need to cleanup here and:
            // fix the iframe resources
            // the target properly...

        } else {
            log.warn("No primary resource found for: " + url);
        }

    }

}
