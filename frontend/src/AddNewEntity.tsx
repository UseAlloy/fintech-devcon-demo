import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

interface AddNewEntityProps {
    addNewModal: boolean;
    closeModal: () => void;
}
 const AddNewEntity: React.FC<AddNewEntityProps> = (props) => {
  const closeModal = () => {
  props.closeModal()
 };
 const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [ssn, setSsn] = useState('');
  const [number, setNumber] = useState('');
   const handleSave = () => {
    const newEntity = {
      firstName,
      lastName,
      email,
      dob,
      ssn,
      number,
    };
    // onAddEntity(newEntity);
    setFirstName('');
    setLastName('');
    setEmail('');
    setDob('');
    setSsn('');
    setNumber('');
  };
   return (
    <Modal
      show={props.addNewModal}
      onHide={closeModal}
      cenetered
      className='modal'
    >
      <h2>Add New Entity</h2>
      <div>
        <label>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <br />
        <label>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <br />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>Date of Birth:</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <br />
        <label>SSN:</label>
        <input
          type="text"
          value={ssn}
          onChange={(e) => setSsn(e.target.value)}
        />
        <br />
        <label>Number:</label>
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <br />
        <br />
        <br />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>        
        <button onClick={closeModal}>Cancel</button>
        <button onClick={handleSave}>Save</button>
      </div>
      
     </Modal>
  );
};
 export default AddNewEntity;