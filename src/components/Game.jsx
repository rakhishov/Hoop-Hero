import React, { useState } from "react";
import axios from 'axios'
import AsyncSelect from 'react-select/async'
import { useEffect } from "react";
import * as NBAIcons from 'react-nba-logos';
import ModalGuess from "./ModalGuess";
const Game = () =>{
  const [inputValue, setInput] = useState()
  const [selectedPlayer, updateSelectedPlayer] = useState([]);
  const [guess, setGuess] = useState();
  const [numOfGuess, setNGuess] = useState(0);
  const [didGuess, setDidGuess] = useState(false);
  const [finish, setFinish] = useState(false);
  const [modalGuess, setModalGuessShow] = useState(true)

  const limitOfGuess = 5
  const arrowUp = <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M11 2.206l-6.235 7.528-.765-.645 7.521-9 7.479 9-.764.646-6.236-7.53v21.884h-1v-21.883z"/></svg>
  const arrowDown = <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M11 21.883l-6.235-7.527-.765.644 7.521 9 7.479-9-.764-.645-6.236 7.529v-21.884h-1v21.883z"/></svg>
  const fetchGuess = async(id) =>{

    await axios.get(`https://www.balldontlie.io/api/v1/players/${id}`)
      .then(res => {
          setGuess(res.data)
        })
  }

  useEffect(()=>{
    fetchGuess(115);
  }, [])


  const inputHandler = () => {
    return axios.get(`https://www.balldontlie.io/api/v1/players?search=${inputValue}`)
    .then(res =>{
      const dat = res.data.data.filter(p=>{
        return p.position!="";
      })
      return dat;
    })
  }

  
  const handleChange = (p) =>{
    console.log(p)
    updateSelectedPlayer(arr => [...arr, p]);
    console.log(guess);
    if( JSON.stringify(p) === JSON.stringify(guess)){
      setDidGuess(true);
      setFinish(true);
    }
    setNGuess(numOfGuess+1);
    console.log(numOfGuess)
    if(numOfGuess == limitOfGuess-1){
      setFinish(true);
    }
  }
  const handleInput = (p) =>{
    setInput(p);
  }

  return (
    <div className="game">
      
      <div>
      {/* {guess!==undefined && <h2>{guess.first_name} {guess.last_name}</h2>} */}
      <AsyncSelect
      
      className="search-bar" 
      // cacheOptions
      // defaultOptions
      loadOptions={inputHandler}
      getOptionLabel={e => e.first_name + ' ' + e.last_name}
      getOptionValue={e => e.id}
      onInputChange={handleInput}
      isSearchable={finish ? false : true}
      isDisabled={finish ? true : false}
      onChange={handleChange}
      escapeClearsValue={true}
      
      placeholder={`Guess ${numOfGuess+1} of ${limitOfGuess}`}
      /> 
      </div>
    <div>
      {
      <div className="guesses">
        <div className="players">
                  {selectedPlayer.map(p =>(
                    <div className="player-full">
                    <h2 className="player-name">{p.first_name} {p.last_name}</h2>
                      <div className ="player">
                        <div>
                          <div className={p.team.abbreviation === guess.team.abbreviation ? "player-item right animate" :"player-item animate"}>
                            {React.createElement(NBAIcons[p.team.abbreviation],{size:70})}
                          </div>
                          <div className="tag">
                            TEAM
                          </div>
                        </div>
                        <div>
                          <div className={p.team.conference === guess.team.conference ? "player-item right animate delay1" :"player-item animate delay1"}>
                            {p.team.conference}
                          </div>
                          <div className="tag">
                            CONF
                          </div>
                        </div>
                        <div>
                          <div className={p.team.division === guess.team.division ? "player-item right animate delay2" :"player-item animate delay2"}>{p.team.division}</div>
                          <div className="tag">DIV</div>
                        </div>
                        <div>
                          <div className={p.position === guess.position ? "player-item right animate delay3" :"player-item animate delay3"}>{p.position}</div>
                          <div className="tag">POS</div>
                        </div>
                        <div>
                        <div className={(p.height_feet === guess.height_feet && p.height_inches === guess.height_inches) ? "player-item right animate delay4" : "player-item animate delay4"}>
                        {p.height_feet === "" || p.height_feet === null ? "" : p.height_feet + "'" + p.height_inches + "''"} {p.height_feet!=" " && p.height_feet!=null && p.height_feet*12+p.height_inches>guess.height_feet*12+guess.height_inches && arrowDown} 
                        {p.height_feet!=" " && p.height_feet!=null && p.height_feet*12+p.height_inches<guess.height_feet*12+guess.height_inches && arrowUp} 
                        </div>
                        <div className="tag">HT</div>
                        </div>
                        </div>
                    </div>
                  ))}
                  {(numOfGuess === limitOfGuess && !didGuess)&&
                  <div className="player-full">
                    <h2 className="player-name">{guess.first_name} {guess.last_name}</h2>
                    <div className ="player">
                      <div>
                        <div className={"player-item wrong animate"}>{React.createElement(NBAIcons[guess.team.abbreviation],{size:70})}</div>
                        <div className="tag">
                          TEAM
                        </div>
                      </div>
                      <div>
                        <div className={"player-item wrong animate delay1"}>{guess.team.conference}</div>
                        <div className="tag">
                          CONF
                        </div>
                      </div>
                      <div>
                        <div className={"player-item wrong animate delay2"}>{guess.team.division}</div> 
                        <div className="tag">
                          DIV
                        </div>
                      </div>
                      <div>
                        <div className={"player-item wrong animate delay3"}>{guess.position}</div>
                        <div className="tag">
                          POS
                        </div>
                      </div>
                      <div>
                        <div className={"player-item wrong animate delay4"}>{guess.height_feet}'{guess.height_inches}''</div>
                        <div className="tag">
                          HT
                        </div>
                      </div>
                      </div>
                  </div> 
                  }
                  {(finish) &&
                  <ModalGuess
                    stat={modalGuess}
                    f={() => setModalGuessShow(false)}
                    guess = {guess}
                    didGuess = {didGuess}
                  />}
            </div>
        </div>
        }
      </div>
    </div>
    );
}

export default Game;