import './App.css';
import React, {
  useState,
  useEffect,
} from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import SingleEntityModal from './SingleEntity';
import AddNewEntity from './AddNewEntity';
// import userRoutes from '../../api/src/routes';


function ajaxFetchOptions(method: string, data?: object) {
    const options = {
      method: method,
      mode: 'cors' as RequestMode,
      headers: {
        "Content-Type": "application/json",
      },
      body: data && JSON.stringify(data), 
    }
    return options;
}

async function ajaxFetch(url: string, method: string, data?: object) {
  const requestOptions = ajaxFetchOptions(method, data);
  const response = await fetch(url, requestOptions)
  return response.json()
}

type Record = {
  name_first: string,
  name_last: string,
  email_address: string,
  date_of_birth: string,
  phone_number: string,
  social_security_number: string,
  user_token: string,
  created_at: string,
}

const Dashboard = () => {
  const data = [
    {firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', ssn: '123456789', number: '333-222-3333', dob: '1980-02-03'},
    {firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', ssn: '213456789', number: '434-334-2436', dob: '1985-08-23'},
    {firstName: 'Jake', lastName: 'Barnes', email: 'jake.barnes@example.com', ssn: '384593821', number: '987-343-2434', dob: '1998-12-22'},
    {firstName: 'Betty', lastName: 'Forrest', email: 'betty.forrest@example.com', ssn: '198302957', number: '423-366-6331', dob: '1990-11-10'},
    {firstName: 'Lucy', lastName: 'Blaire', email: 'lucy.blaire@example.com', ssn: '434293812', number: '134-243-2436', dob: '1974-01-01'},
    {firstName: 'Charles', lastName: 'Michaels', email: 'charles.michaels@example.com', ssn: '983274334', number: '545-335-6553', dob: '1968-06-17'},
    {firstName: 'Pete', lastName: 'Short', email: 'pete.short@example.com', ssn: '811923451', number: '243-499-5000', dob: '1985-08-23'},
    {firstName: 'Elenor', lastName: 'Wilson', email: 'elenor.wilson@example.com', ssn: '291839823', number: '434-905-3244', dob: '1998-03-24'},
    {firstName: 'Ben', lastName: 'Lexington', email: 'ben.lexington@example.com', ssn: '312345892', number: '414-504-0558', dob: '1994-07-13'},
    {firstName: 'Jamir', lastName: 'Stone', email: 'jamir.stone@example.com', ssn: '823456912', number: '315-310-2736', dob: '1978-10-09'},
    {firstName: 'Carol', lastName: 'Bobette', email: 'carol.bobette@example.com', ssn: '891232325', number: '525-434-9988', dob: '1988-11-04'},
  ];
  const [showSingleEntityModal, setShowSingleEntityModal] = useState(false);
  const [records, setRecords] = useState<Record[]>([]);
  const [selectedEntity, setSelectedEntity] = React.useState({
    name_first: null,
    name_last: null,
    email_address: null,
    date_of_birth: null,
    phone_number: null,
    social_security_number: null,
    user_token: null,
    created_at: null,
  });
  const [openAddNew, setOpenAddNew] = React.useState(false)

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event:any) => {
    setSearchTerm(event.target.value);
  };

  // will update this once search is implemented
  const filteredData = records.filter((item: Record) =>
  item.name_first.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.name_last.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.email_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openSingleEntityModal = (item: any) => {
    setSelectedEntity(item)
    setShowSingleEntityModal(!showSingleEntityModal)
  }

  const openAddNewModal = () => {
    setOpenAddNew(!openAddNew)
  }

  const closeAddNewModal = () => {
    setOpenAddNew(false)
  }

  const handleCloseModal = () => {
    setShowSingleEntityModal(false);
  };

  const getRecords = async () => {
    try {
      const response = await ajaxFetch('http://localhost:8000/users','GET')
      if (response) {
        setRecords(response)
      }
    } catch (error:any) {
      console.log(error.stack)
    }
  }

  useEffect(() => {
    getRecords();
  }, [])
  //write a fetch function that wraps the fetch function
   return (
    <>
    <div className="dashboard-container">
      <h1>View All Entities</h1>
      <div className="search-bar"> 
        <Form.Control
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <Button onClick={() => openAddNewModal()}>Add New Entity</Button>
      </div>
      
      <Table striped bordered hover className="dashboard-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email Address</th>
            <th>Actions</th> {/* Add a new table header for the actions */}
          </tr>
        </thead>
        <tbody>
          {records.map((item, index) => (
            <tr key={index}>
              <td>{item.name_first}</td>
              <td>{item.name_last}</td>
              <td>{item.email_address}</td>
              <td>
                <Button variant="primary" onClick={() => openSingleEntityModal(item)}>
                  View
                </Button> 
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    {showSingleEntityModal && (
      <div>
        <div className="overlay"></div>
        <div className="modal">
        <SingleEntityModal 
      openModal={showSingleEntityModal}
      closeModal={handleCloseModal}
      entity={selectedEntity} //need to get a specific row 
      />
        </div>
      </div>
      
    )}
    {openAddNew && (
      <div>
        <div className="overlay">
          <div className="modal">
            <AddNewEntity addNewModal={openAddNew}
            closeModal={closeAddNewModal}/>
          </div> 
         </div>
     </div>
      
    )}
    </>
  );
};
 export default Dashboard;
