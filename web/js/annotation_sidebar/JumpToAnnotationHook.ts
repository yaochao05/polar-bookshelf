import * as React from 'react';
import {useDocURLLoader} from "../apps/main/doc_loaders/browser/DocURLLoader";
import {AnnotationLinks} from "./AnnotationLinks";
import {useSideNavHistory} from "../sidenav/SideNavStore";
import {useIsDocViewerContext} from "../../../apps/doc/src/renderers/DocRenderer";
import {IAnnotationPtr} from "./AnnotationPtrs";

/**
 * This is the default jump to annotation button that's used in the document
 * repository
 */
export function useJumpToAnnotationHandler() {

    const history = useSideNavHistory();
    const docURLLoader = useDocURLLoader();

    const isDocViewerContext = useIsDocViewerContext();

    const doJump = React.useCallback((ptr: IAnnotationPtr) => {

        if (isDocViewerContext) {
            const url = AnnotationLinks.createRelativeURL(ptr);
            history.push(url);
        } else {
            const url = AnnotationLinks.createURL(ptr);
            docURLLoader(url);
        }

    }, [docURLLoader, history, isDocViewerContext]);

    return React.useCallback((ptr: IAnnotationPtr) => {

        doJump(ptr)

    }, [docURLLoader, history, isDocViewerContext]);

}
