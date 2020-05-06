import * as React from 'react';
import {AnnotationPreview} from './AnnotationPreview';
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import TablePagination from "@material-ui/core/TablePagination";
import Divider from "@material-ui/core/Divider";
import isEqual from "react-fast-compare";
import {
    useAnnotationRepoCallbacks,
    useAnnotationRepoStore
} from './AnnotationRepoStore';
import {IDStr} from "polar-shared/src/util/Strings";

interface ToolbarProps {
    readonly nrRows: number;
    readonly page: number;
    readonly rowsPerPage: number;
    readonly onChangePage: (page: number) => void;
    readonly onChangeRowsPerPage: (rowsPerPage: number) => void;
}

// FIXME: move to a dedicated component
const Toolbar = React.memo((props: ToolbarProps) => {

    const handleChangePage = (event: unknown, newPage: number) => {
        props.onChangePage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rowsPerPage = parseInt(event.target.value, 10);
        props.onChangeRowsPerPage(rowsPerPage);

    };

    return (
        <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            size="small"
            count={props.nrRows}
            rowsPerPage={props.rowsPerPage}
            style={{
                padding: 0,
                overflow: "hidden",
                minHeight: '4.5em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end'
            }}
            // onDoubleClick={event => {
            //     event.stopPropagation();
            //     event.preventDefault();
            // }}
            page={props.page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
        />
    )

}, isEqual);

export const AnnotationRepoTable2 = React.memo(() => {

    const store = useAnnotationRepoStore();
    const callbacks = useAnnotationRepoCallbacks();

    const {page, rowsPerPage, view, viewPage, selected} = store;
    const {onDragStart, onDragEnd, setPage, setRowsPerPage} = callbacks;

    const handleSelect = React.useCallback((selectedID: IDStr, event: React.MouseEvent) => {
        callbacks.selectRow(selectedID, event, 'click');
    }, [callbacks]);

    return (

        <Paper square id="doc-repo-table"
               elevation={0}
               style={{
                   display: 'flex',
                   flexDirection: 'column',
                   minHeight: 0,
                   flexGrow: 1
               }}>

            <Toolbar nrRows={view.length}
                     rowsPerPage={rowsPerPage}
                     page={page}
                     onChangePage={setPage}
                     onChangeRowsPerPage={setRowsPerPage}/>

            <Divider orientation="horizontal"/>

            <div id="doc-table"
                 style={{
                     display: 'flex',
                     flexDirection: 'column',
                     minHeight: 0,
                     flexGrow: 1,
                     overflow: 'auto'
                 }}>


                <TableContainer style={{
                                    flexGrow: 1,
                                    overflow: 'auto'
                                }}>

                    <Table stickyHeader
                           style={{
                               minWidth: 0,
                               maxWidth: '100%',
                               tableLayout: 'fixed'
                           }}
                           aria-labelledby="tableTitle"
                           size={'medium'}
                           aria-label="enhanced table">

                        {/*FIXME: migrate the TableRow to its own component that can be cached.*/}
                        <TableBody>
                            {viewPage.map((annotation, index) => {

                                    const viewIndex = (page * rowsPerPage) + index;
                                    const id = 'annotation-title' + viewIndex;
                                    const rowSelected = selected.includes(annotation.id);

                                    // FIXME: migrate this to a dedicated
                                    // component so it can be cached easier.
                                    return (
                                        <TableRow key={viewIndex}
                                                  hover
                                                  // className={classes.tr}
                                                  role="checkbox"
                                                  // tabIndex={1}
                                                  // onFocus={() => handleSelect(viewIndex, annotation)}
                                                  onClick={(event) => handleSelect(annotation.id, event)}
                                                  // onDoubleClick={() => props.onOpen(row)}
                                                  draggable
                                                  onDragStart={onDragStart}
                                                  onDragEnd={onDragEnd}
                                                  selected={rowSelected}>

                                            <TableCell padding="checkbox">
                                                <Box p={1}>
                                                    <AnnotationPreview id={id}
                                                                       text={annotation.text}
                                                                       img={annotation.img}
                                                                       color={annotation.color}
                                                                       lastUpdated={annotation.lastUpdated}
                                                                       created={annotation.created}/>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );

                                })}

                        </TableBody>
                    </Table>
                </TableContainer>

            </div>

        </Paper>

    );
});
