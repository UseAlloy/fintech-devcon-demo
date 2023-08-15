import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import './App.css'
 interface SingleEntityModalProps {
  openModal: boolean;
  closeModal: () => void;
  entity?: {
    name_first: string | null,
    name_last: string | null,
    email_address: string | null,
    social_security_number: string | null,
    phone_number: string | null,
    date_of_birth: string | null
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
        <p><b>First Name:</b> {props?.entity?.name_first}</p>
        <p><b>Last Name:</b> {props?.entity?.name_last}</p>
        <p><b>Email:</b> {props?.entity?.email_address}</p>
        <p><b>Phone Number:</b> {props?.entity?.phone_number}</p>        
        <p><b>Social Security Number:</b> {props?.entity?.social_security_number}</p>
        <p><b>Date of Birth:</b> {props?.entity?.date_of_birth}</p>
        <br />
        <br />
        <button onClick={closeModal}>Close</button>
    </Modal>
  );
};
 export default SingleEntityModal;
