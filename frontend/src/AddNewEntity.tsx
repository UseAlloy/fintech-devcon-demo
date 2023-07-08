import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

interface AddNewEntityProps {
    addNewModal: boolean;
    closeModal: () => void;
}
 const AddNewEntity: React.FC<AddNewEntityProps> = (props) => {
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
    <Modal>
        <p>add new</p>
      {/* <h2>Add New Entity</h2>
      <div>
        <label>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div>
        <label>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Date of Birth:</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
      </div>
      <div>
        <label>SSN:</label>
        <input
          type="text"
          value={ssn}
          onChange={(e) => setSsn(e.target.value)}
        />
      </div>
      <div>
        <label>Number:</label>
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
      </div>
      <button onClick={handleSave}>Save</button> */}
    </Modal>
  );
};
 export default AddNewEntity;