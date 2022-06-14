import React from "react";
import PropTypes from "prop-types";

import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFilters,
  useResizeColumns,
  useFlexLayout,
  useExpanded,
  usePagination
} from "react-table";
import {
  Table,
  InputGroup,
  FormControl,
  Row,
  Col,
  Button
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight
} from "@fortawesome/free-solid-svg-icons";

import GlobalFilter from "./GlobalFilter";
import ColumnFilter from "./ColumnFilter";

import "./Table.css";
import "bootstrap/dist/css/bootstrap.min.css";

const MyTable = ({
  columns: userColumns,
  data,
  renderRowSubComponent,
  rowOnClick,
  rowClickHandler,
  headerColor,
  showPagination,
  showGlobalFilter,
  expandRows,
  expandedRowObj
}) => {
  const filterTypes = React.useMemo(
    () => ({
      includes: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .includes(String(filterValue).toLowerCase())
            : true;
        });
      },

      startsWith: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      }
    }),
    []
  );

  const sortTypes = React.useMemo(
    () => ({
      dateSort: (a, b) => {
        a = new Date(a).getTime();
        b = new Date(b).getTime();
        return b > a ? 1 : -1;
      }
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      Filter: ColumnFilter,
      disableFilters: true,
      minWidth: 30,
      width: 150,
      maxWidth: 500
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { globalFilter, pageIndex, pageSize }
  } = useTable(
    {
      columns: userColumns,
      data,
      initialState: {
        expanded:
          expandRows && expandedRowObj.hasOwnProperty(0) ? expandedRowObj : {}
      },
      defaultColumn,
      filterTypes,
      sortTypes
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useResizeColumns,
    useExpanded,
    usePagination,
    useFlexLayout
  );

  return (
    <React.Fragment>
      <Row className="float-right">
        <Col>
          {showGlobalFilter ? (
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          ) : (
            ""
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <Table
            striped
            bordered
            hover
            size="sm"
            responsive
            {...getTableProps()}
          >
            <thead>
              {headerGroups.map((headerGroup, i) => (
                <React.Fragment key={headerGroup.headers.length + "_hfrag"}>
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        key={column.id}
                        className={`p-2 table-header ${
                          headerColor ? "primary-" + headerColor : "primary-deq"
                        }`}
                        {...column.getHeaderProps()}
                      >
                        <span {...column.getSortByToggleProps()}>
                          {column.render("Header")}
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <FontAwesomeIcon
                                className="ms-3"
                                icon={faArrowDown}
                              />
                            ) : (
                              <FontAwesomeIcon
                                className="ms-3"
                                icon={faArrowUp}
                              />
                            )
                          ) : (
                            ""
                          )}
                        </span>
                        <div
                          {...column.getResizerProps()}
                          className="resizer"
                        />
                        {column.canResize && (
                          <div
                            {...column.getResizerProps()}
                            className={`resizer ${
                              column.isResizing ? "isResizing" : ""
                            }`}
                          />
                        )}
                        <div>
                          {column.canFilter ? column.render("Filter") : null}
                        </div>
                      </th>
                    ))}
                  </tr>
                </React.Fragment>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <React.Fragment key={i + "_frag"}>
                    <tr
                      {...row.getRowProps()}
                      onClick={
                        rowOnClick
                          ? () => rowClickHandler(row.original)
                          : () => ""
                      }
                    >
                      {row.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                    {row.isExpanded ? (
                      <tr>
                        <td>
                          <span className="subTable">
                            {renderRowSubComponent({ row })}
                          </span>
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </tbody>
          </Table>
          {showPagination ? (
            <Row className="mt-2 text-center">
              <Col>
                <Button
                  className="me-2"
                  size="sm"
                  variant="secondary"
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                >
                  <FontAwesomeIcon icon={faAngleDoubleLeft} />
                </Button>
                <Button
                  className="me-2"
                  size="sm"
                  variant="secondary"
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  <FontAwesomeIcon icon={faAngleLeft} />
                </Button>
              </Col>
              <Col>
                <span>
                  Page{" "}
                  <strong>
                    {pageIndex + 1} of {pageOptions.length}
                  </strong>
                </span>
                <span>
                  | Go to page:{" "}
                  <InputGroup
                    size="sm"
                    style={{ width: "20%", display: "inline-flex" }}
                  >
                    <FormControl
                      type="number"
                      defaultValue={pageIndex + 1}
                      onChange={(e) => {
                        const page = e.target.value
                          ? Number(e.target.value) - 1
                          : 0;
                        gotoPage(page);
                      }}
                    />
                  </InputGroup>
                </span>
                <InputGroup
                  size="sm"
                  style={{ width: "30%", display: "inline-flex" }}
                >
                  <FormControl
                    className="mt-4"
                    size="sm"
                    as="select"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                    }}
                  >
                    {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                      </option>
                    ))}
                  </FormControl>
                </InputGroup>
              </Col>
              <Col>
                <Button
                  className="me-2"
                  size="sm"
                  variant="secondary"
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                >
                  <FontAwesomeIcon icon={faAngleRight} />
                </Button>
                <Button
                  className="me-2"
                  size="sm"
                  variant="secondary"
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                >
                  <FontAwesomeIcon icon={faAngleDoubleRight} />
                </Button>
              </Col>
            </Row>
          ) : (
            ""
          )}
        </Col>
      </Row>
    </React.Fragment>
  );
};

MyTable.defaultProps = {
  rowOnClick: false,
  showPagination: false,
  expandRows: false,
  expandedRowObj: {}
};

MyTable.propTypes = {
  /** Specified if pagination should show or not */
  showPagination: PropTypes.bool.isRequired,

  /** Specifies if there should be a row onClick action*/
  rowOnClick: PropTypes.bool.isRequired,

  /** OPTIONAL: The onClick Action to be taken */
  rowClickHandler: PropTypes.func,

  /** header color background. There are six possible choices. Refer to ReadMe file for specifics */
  headerColor: PropTypes.string
};

export default MyTable;
