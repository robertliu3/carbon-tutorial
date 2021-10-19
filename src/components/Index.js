import { useState } from 'react';
import NavHeader from './Header';
import TableSector from './Table'




//render sub-compoment, changed the api call to sub-compoment for performance
function Index() {

    //header input for carbon table class
    const header = [
        {
            key: 'name',
            header: 'Repository Name',
        },
        {
            key: 'stars',
            header: 'Number of Star',
        },
        {
            key: 'language',
            header: 'Language',
        },
        {
            key: 'lastUpdate',
            header: 'Latest Update Time',
        }
    ]

    //change header if necessary
    const [headers, setHeaders] = useState(header);

    return (
        <div className="App">
            <NavHeader />
            <TableSector headers={headers}></TableSector>
        </div>
    );

}


export default Index;
