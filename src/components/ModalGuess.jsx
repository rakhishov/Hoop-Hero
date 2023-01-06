import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useState, useEffect } from 'react';
import {db} from './firebase/Firebase'
import { onValue, ref } from "firebase/database";
import loading from '../assets/loading.svg'


const ModalGuess = ({stat, f, guess, didGuess, numOfGuess}) => {

  const now = new Date()
  const hour = 23-now.getHours();
  const min = 59-now.getMinutes();
  const sec = 59-now.getSeconds();
  
  const [[h, m, s], setTime] = useState([hour, min, sec]);
  const [imgId, setImgId] = useState(null);
  const urlImg = "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/"

  const tick =()=>{
      if (h === 0 && m === 0 && s === 0) {
          setTime(23, 59, 59);
      } else if (m === 0 && s === 0) {
          setTime([24-h, 59, 59]);
      } else if (s == 0) {
          setTime([h, m - 1, 59]);
      } else {
          setTime([h, m, s - 1]);
      }
  }
  useEffect(()=>{
    const query = ref(db, "Players2022");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();
      const key = guess.first_name + " "+ guess.last_name
      setImgId(data[key])
    });
  }, []);


  useEffect(()=>{
      const timerID = setInterval(() => tick(), 1000);
      return () => clearInterval(timerID);
  })

    return (
        <Modal
        className='text-center'
        show={stat}
        onHide={() => {f(false)}}
          
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
         
          <Modal.Body>
            <h3 className="guess-name">{guess!=undefined && guess.first_name + " " + guess.last_name} </h3>
            <div className={'guess-borders ' + (didGuess ? "success-try" : "unsuccess-try")}>
              <div className='guess-content'>
                <img className='guess-photo' src={imgId == null ? loading : urlImg + imgId + ".png"}
                />
                
                <p>{didGuess && `Amazing! It took only ${numOfGuess} guesses`} {!didGuess && "Loser"}</p>
              </div>
              
            </div>
            
          <p>{`The next player will be available in ${h.toString().padStart(2, '0')}:${m
                .toString()
                .padStart(2, '0')}:${s.toString().padStart(2, '0')}`}</p>
          </Modal.Body>
        </Modal>
      );
}




export default ModalGuess;