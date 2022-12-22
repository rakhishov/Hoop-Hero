import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useState } from 'react';

const ModalInstructions = (props) => {
    
    return (
        <Modal
          {...props}
          size ='sm'
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              How to play
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4 className='title-modal'>Game Rules</h4>
            <p>
            Test your knowledge and guess the current basketball player in 5 tries. 
            The mystery player will play for a club in the NBA.
            </p>
            <p>
            If you choose to show the player photo, there will be a blurred image of the player to start you off. It will become slightly less blurred after each guess. If you want more of a challenge, selecting the hide photo option will mean that you will be entirely reliant upon the feedback to your guesses.
            </p>
            <p>
            Feedback will be revealed comparing your guessed player.
            For example, you guess was Joel Embiid 
            </p>
          </Modal.Body>
        </Modal>
      );
}

export default ModalInstructions;