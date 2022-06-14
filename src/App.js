import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";

import MyTable from "./Table";
import { data } from "./Data";

const GroupedSamplingStationTable = (props) => {
  // const [expandedRows, setExpandedRows] = useState([]);
  // const expandedRows = [{ 0: true }, { 1: true }, { 2: true }, { 3: true }]; //This works

  const columns = React.useMemo(
    () => [
      {
        Header: () => null,
        id: "expander",
        width: 30,
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? (
              <FontAwesomeIcon className="font-icon" icon={faCaretDown} />
            ) : (
              <FontAwesomeIcon className="font-icon" icon={faCaretRight} />
            )}
          </span>
        )
      },
      {
        Header: "Sample Group ID",
        accessor: "groupId",
        width: 75
      },
      {
        Header: "Sample Group",
        accessor: "groupName",
        width: 200
      }
    ],
    []
  );

  const details = React.useMemo(
    () => [
      {
        Header: "Source ID",
        accessor: "sourceId",
        width: 50
      },
      {
        Header: "Source Name",
        accessor: "sourceName",
        width: 125
      },
      {
        Header: "Sample Group Details",
        accessor: "groupDetails",
        width: 100
      },
      {
        Header: "System",
        accessor: (d) => {
          return d.systemNumber + " " + d.systemName;
        },
        width: 200
      }
    ],
    []
  );

  const subTable = React.useCallback(
    ({ row }) =>
      row.original.groupDetails.length > 0 ? (
        <MyTable
          columns={details}
          data={row.original.groupDetails}
          headerColor="grey"
        />
      ) : (
        "No Data"
      ),
    [details]
  );

  const expandedRows = React.useMemo(() => {
    if (data?.data) {
      let arr;
      let d = data.data;
      if (d.getGroupedSamplingStationBySystemId.length > 0) {
        arr = d.getGroupedSamplingStationBySystemId.map((sid, ind) => {
          return { [ind]: true };
        });
      }
      return arr;
    }
  }, []);

  return (
    <>
      {data.data.getGroupedSamplingStationBySystemId.length > 0 ? (
        <MyTable
          data={data.data.getGroupedSamplingStationBySystemId}
          columns={columns}
          renderRowSubComponent={subTable}
          expandRows
          expandedRowObj={expandedRows}
        />
      ) : (
        <span>
          <em>No data was found for grouped sampling stations.</em>
        </span>
      )}
    </>
  );
};

export default GroupedSamplingStationTable;
