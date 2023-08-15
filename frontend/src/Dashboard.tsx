import './App.css';
import React, {
  useState,
  useEffect,
} from 'react';
import { Table, Button, Form, Dropdown } from 'react-bootstrap';
import SingleEntityModal from './SingleEntity';
import AddNewEntity from './AddNewEntity';


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

type Entity = {
    name_first: string | null,
    name_last: string | null,
    email_address: string | null,
    date_of_birth: string | null,
    phone_number: string | null,
    social_security_number: string | null,
    user_token: string | null,
    created_at: string | null,
}

const mapped = new Map<string, string>([
  ['First Name', 'name_first'],
  ['Last Name', 'name_last'],
  ['Date of Birth', 'date_of_birth'],
  ['Number', 'phone_number'],
  ['Email', 'email_address'],
  ['SSN', 'social_security_number'],
]);

const Dashboard = () => {
  const [showSingleEntityModal, setShowSingleEntityModal] = useState(false);
  const [records, setRecords] = useState<Record[]>([]);
  const [singleEntity, setSingleEntity] =  useState<Entity>();
  const [openAddNew, setOpenAddNew] = React.useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    getRecords();
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

  const openSingleEntityModal = async (userToken: string) => {
    //add get request here selectedEntityToken
    try {
      await getSingleRecord(userToken);
      setShowSingleEntityModal(!showSingleEntityModal)
    } catch(error:any) {
      console.log(error.stack)
    }
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

  const resetSearch = async () => {
    setFilter('');
    await getRecords();
  }

  const getSingleRecord = async (userToken:string) => {
    try {
      const response = await ajaxFetch(`http://localhost:8000/users/${userToken}`, 'GET')
      if (response) {
        setSingleEntity(response)
      }
    } catch (error:any) {
      console.log(error.stack)
    }
  };

  const searchEntities = async () => {
    const searchKey = mapped.get(filter) as string;
    try {
      const body = {
        filters: {
          [searchKey]: [searchTerm],
        }
      };
      const response = await ajaxFetch('http://localhost:8000/users/search', 'POST', body);
      if (response) {
        setRecords(response);
      }
    } catch (error:any) {
      console.log(error.stack)
    }
  }

   return (
    <>
      <div className="dashboard-container">
        <h1>View All Entities</h1>
        <div className="search-container">
          <div className="search-bar">
          <select value={filter} onChange={handleFilterChange}>
            <option value="" disabled hidden>
              Select Filter
            </option>
            <option value="First Name">First Name</option>
            <option value="Last Name">Last Name</option>
            <option value="Date of Birth">DOB</option>
            <option value="Number">Phone Number</option>
            <option value="Email">Email Address</option>
            <option value="SSN">Social Security Number</option>
          </select>
          {filter && (
            <>
              <button onClick={()=> resetSearch()}>Clear Filter</button>
              <input
                type="text"
                placeholder={`Search by ${filter}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={() => searchEntities()}>Search</button>
            </>
          )}
          </div>
          <Button onClick={openAddNewModal}>Add New Entity</Button>
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
                <Button variant="primary" onClick={() => openSingleEntityModal(item.user_token)}>
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    {showSingleEntityModal && singleEntity && (
      <div>
        <div className="overlay"></div>
          <div className="modal">
          <SingleEntityModal
            openModal={showSingleEntityModal}
            closeModal={handleCloseModal}
            entity={singleEntity}
          />
        </div>
      </div>

    )}
    {openAddNew && (
      <div>
        <div className="overlay"></div>
          <div className="modal">
            <AddNewEntity
            addNewModal={openAddNew}
            closeModal={closeAddNewModal}
            ajaxFetch={ajaxFetch}
            getRecords={getRecords} />
          </div>
         </div>
    )}
    </>
  );
};
 export default Dashboard;
