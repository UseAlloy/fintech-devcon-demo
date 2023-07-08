import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import './App.css'
 interface SingleEntityModalProps {
  openModal: boolean;
  closeModal: () => void;
  entity: {
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    ssn: string | null,
    number: string | null,
    dob: string | null
  }
}
 const SingleEntityModal: React.FC<SingleEntityModalProps> = (props) => {
  const closeModal = () => {
    props.closeModal();
  };
   return (
    <Modal
      show={props.openModal}
      onHide={closeModal}
      centered
      className='modal'
    >
        <h3><u>View Single Entity</u></h3>
        <br />
        <p><b>First Name:</b> {props.entity.firstName}</p>
        <p><b>Last Name:</b> {props.entity.lastName}</p>
        <p><b>Email:</b> {props.entity.email}</p>
        <p><b>Phone Number:</b> {props.entity.number}</p>        
        <p><b>Social Security Number:</b> {props.entity.ssn}</p>
        <p><b>Date of Birth:</b> {props.entity.dob}</p>
        <br />
        <br />
        <button onClick={closeModal}>Close</button>
    </Modal>
  );
};
 export default SingleEntityModal;
