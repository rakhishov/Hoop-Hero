import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useState } from 'react';
import * as NBAIcons from 'react-nba-logos';
const ModalInstructions = (props) => {
    
    return (
        <Modal
          {...props}
          
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
            For example, your guess is Joel Embiid: 
            <div className="player-full">
                  
                      <div className ="modal-player">
                        <div className="player-box">
                          <div className="player-item modal-item">
                            {React.createElement(NBAIcons["PHI"],{size:70})}
                          </div>
                          <div className="tag-modal">
                            TEAM
                          </div>
                        </div>
                        <div className="player-box">
                          <div className="player-item right modal-item">
                            East
                          </div>
                          <div className="tag-modal">
                            CONF
                          </div>
                        </div>
                        <div className="player-box">
                          <div className="player-item right modal-item">C</div>
                          <div className="tag-modal">POS</div>
                        </div>
                        <div className="player-box">
                          <div className="player-item modal-item">{33.5 + '\u2193'}</div>
                          <div className="tag-modal">PTS</div>
                        </div>
                        <div className="player-box">
                          <div className="player-item close modal-item">{4.6 + '\u2191'}</div>
                          <div className="tag-modal">AST</div>
                        </div>
                        <div className="player-box">
                          <div className="player-item close modal-item">{9.8 + '\u2191'}</div>
                          <div className="tag-modal">REB</div>
                        </div>
                        
                        </div>
                    </div>
            </p>
            <span>This means that mystery player <b>is not playing for 76ers</b>,
              he is from <b>East</b> conference playing <b>Center</b> position. This player
              averages <b>less than 33.5 PTS </b>, <b>more and close to 4.6 AST</b> and <b>9.8 REB</b>.
            </span>
          </Modal.Body>
        </Modal>
      );
}

export default ModalInstructions;