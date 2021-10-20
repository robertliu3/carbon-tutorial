import {
  DataTable,
  TableContainer,
  Table,
  DataTableSkeleton,
  TableHead,
  TableRow,
  TableExpandHeader,
  TableHeader,
  TableBody,
  TableExpandRow,
  TableCell,
  TableExpandedRow,
  PaginationSkeleton,
  TableToolbar,
  TableToolbarSearch,
  Pagination,
  TableToolbarContent,
  Button,
} from 'carbon-components-react'

import React, { useEffect, useState } from 'react'
function TableSector(props) {

  //get total number of items, for now hard code to 2200, will be fetched from api later on.
  const [totalItems, setTotalItems] = useState(0);

  //set current page that UI is on
  const [currentPage, setPage] = useState(1);

  //set current page size
  const [currentPageSize, setCurrentPageSize] = useState(30);

  //rows for data fetched back from server api endpoint 
  const [rows, setRows] = useState([]);

  //indication variable to notify sub-component that data is ready or not 
  const [isLoaded, setLoaded] = useState(false);

  //indication variable to notify the backend to fetch data from database
  const [saveDB, setSaveDB] = useState(true);

  //indication variable to run a check on if there is a database table ready for use
  const [startUp, setStartUp] = useState(true);

  //rerender the page when current page number change or current page size change
  useEffect(() => {
    //call backend api to fetch data on page load, change indication variable to true when data fetched
    async function getResult() {
      const data = {
        page: currentPage,
        pageSize: currentPageSize,
        dataBase: saveDB
      }

      //make post request and send page number and page size to API
      const response = await fetch("http://localhost:5000/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      //put data to table once fetched back
      const listArr = await response.json();
      setRows(listArr.message);
      setLoaded(true);
    }

    //run this api after checking if the database table is in place
    if (!startUp) {
      getResult();
    }

  }, [currentPageSize, currentPage, saveDB, startUp]);


  //rerender page on page load and fetch the total number of repos from IBM Github
  useEffect(() => {
    async function getResult() {
      const data = {
        dataBase: saveDB
      }
      const response = await fetch("http://localhost:5000/ibm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const totalNumber = await response.json();

      setTotalItems(totalNumber.message);
    }
    
    //run this api after checking if the database table is in place
    if (!startUp) {
      getResult();
    }
  }, [saveDB, startUp])


  //set data source to database once data is downloaded
  useEffect(() => {
    if (totalItems !== 0) {
      setSaveDB(true);
    }
  }, [totalItems])


  //run a check on start up to see if the database table is in place
  useEffect(() => {
    async function getResult() {
      const response = await fetch("http://localhost:5000/checkDB", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
      const totalNumber = await response.json();

      if (totalNumber.message === 0) {
        setSaveDB(false);
      } else {
        setTotalItems(totalNumber.message);
      }
      setStartUp(false);
    }

    getResult();

  }, [])


  //handle on click when update button clicked, call api to update the database
  async function handleClick() {
    const data = {
      pages: Math.ceil(totalItems / currentPageSize),
    }

    const response = await fetch("http://localhost:5000/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const complete = await response.json();
    alert(complete.message);
  }
  return (
    isLoaded ?
      <div className="mainBody">
        <DataTable
          rows={rows}
          headers={props.headers}
          isSortable={true}
          render={({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getTableProps,
            onInputChange,
          }) => (
            <TableContainer
              title="List of Repositories"
              description="A collection of repositories from IBM github">
              <TableToolbar>
                <TableToolbarContent>
                  {/* pass in `onInputChange` change here to make filtering work */}
                  <TableToolbarSearch onChange={onInputChange} />
                  {/* only allow update when data table is in place*/}
                  <Button disabled={!saveDB} onClick={handleClick}>Refresh DataBase</Button>
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    <TableExpandHeader />
                    {headers.map(header => (
                      <TableHeader {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(row => (
                    <React.Fragment key={row.id}>
                      <TableExpandRow {...getRowProps({ row })}>
                        {row.cells.map(cell => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableExpandRow>
                      <TableExpandedRow colSpan={headers.length + 1}>
                        <p>Row description</p>
                      </TableExpandedRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        />
        {/* ready when total number of repositories fetched */}
        {totalItems === 0 ?
          <Pagination
            totalItems={totalItems}
            backwardText="Previous page"
            forwardText="Next page"
            pageSize={currentPageSize}
            pageSizes={[30, 50]}
            page={currentPage}
            itemsPerPageText="Items per page"
            onChange={({ page, pageSize }) => {
              if (pageSize !== currentPageSize) {
                setCurrentPageSize(pageSize);
                setLoaded(false);
              }
              if (page !== currentPage) {
                setPage(page);
                setLoaded(false);
              }
            }} /> :
          <PaginationSkeleton />}
      </div>
      :
      <div className="mainBody">
        <DataTableSkeleton rows={props.rows} headers={props.headers} >
        </DataTableSkeleton>
        <PaginationSkeleton />
      </div>
  )
};

export default TableSector;
