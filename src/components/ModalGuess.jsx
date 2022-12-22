import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useState, useEffect } from 'react';

const ModalGuess = ({stat, f, guess, didGuess}) => {
  const now = new Date()
  const hour = 23-now.getHours();
  const min = 59-now.getMinutes();
  const sec = 59-now.getSeconds();
  const [over, setOver] = useState(false);
  const [[h, m, s], setTime] = useState([hour, min, sec]);

  const tick =()=>{
      console.log(h+" "+m+ " "+ s)
      if (h === 0 && m === 0 && s === 0) {
          setOver(true);
      } else if (m === 0 && s === 0) {
          setTime([24-h, 59, 59]);
      } else if (s == 0) {
          setTime([h, m - 1, 59]);
      } else {
          setTime([h, m, s - 1]);
      }
  }

  useEffect(()=>{
      const timerID = setInterval(() => tick(), 1000);
      return () => clearInterval(timerID);
  })

    return (
        <Modal
        show={stat}
        onHide={() => {f(false)}}
          size ='lg'
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Game Rules
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {didGuess && "Krasavchik"} {!didGuess && "Loser"}
            <p>This is the player {guess!=undefined && guess.first_name + " " + guess.last_name}</p>
            
          <p>{`${h.toString().padStart(2, '0')}:${m
                .toString()
                .padStart(2, '0')}:${s.toString().padStart(2, '0')}`}</p>
          </Modal.Body>
        </Modal>
      );
}

export default ModalGuess;