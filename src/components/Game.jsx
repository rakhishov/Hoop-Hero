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
  const fetchGuess = async() =>{
    setGuess(JSON.parse(localStorage.getItem("guess")));
    var id = JSON.parse(localStorage.getItem("playerid"));
    if(guess === undefined){
      await axios.get(`https://www.balldontlie.io/api/v1/players/${id}`)
      .then(res => {
          setGuess(res.data);
          localStorage.setItem("guess", JSON.stringify(res.data))
        })
    }
  }

  const getId = ()=>{
    if("playerid" in localStorage){
    }
    else{
      var ids = [666786, 145, 132, 175, 15, 434, 115, 140, 322, 57, 237, 490, 117, 70, 125, 666969, 246, 172, 3547238, 274, 472, 417]
      var randPlayer = ids[Math.floor(Math.random() * ids.length)]
      localStorage.setItem("playerid", randPlayer);
    }
  }

  useEffect(()=>{
    getId();
    fetchGuess();
    var players = JSON.parse(localStorage.getItem("players") || "[]")
    var didG = JSON.parse(localStorage.getItem("didGuess") || false);
    var didFinish = JSON.parse(localStorage.getItem("didFinish") || false);
    var nGuess = JSON.parse(localStorage.getItem("numOfGuess") || 0);
    updateSelectedPlayer(players);
    setDidGuess(didG);
    setFinish(didFinish);
    setNGuess(nGuess);
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
    
    updateSelectedPlayer(arr => [...arr, p]);

    var players = JSON.parse(localStorage.getItem("players") || "[]")
    
    players.push(p);
    localStorage.setItem("players", JSON.stringify(players));


    if( JSON.stringify(p) === JSON.stringify(guess)){
      setDidGuess(true);
      setFinish(true);
      localStorage.setItem("didGuess", true);
      localStorage.setItem("didFinish", true);
    }
    setNGuess(numOfGuess+1);
    var n = JSON.parse(localStorage.getItem('numOfGuess') || 0)
    localStorage.setItem("numOfGuess", n+1);
    if(numOfGuess == limitOfGuess-1){
      setFinish(true);
      localStorage.setItem("didFinish", true)
    }
  }
  const handleInput = (p) =>{
    setInput(p);
  }

  return (
    <div className="game">
      <div>
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
      
      placeholder={!didGuess ? 
      `Guess ${Math.min(numOfGuess+1, limitOfGuess)} of ${limitOfGuess}`
      :"Nice Job Man"}
      /> 
      </div>
      <div>
      {
      <div className="guesses">
        <div className="players">
                  {selectedPlayer.map(p =>(
                    <div className="player-full">
                    <h2 className="player-name">{p.first_name} {p.last_name} </h2>
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
                          <div className={p.team.division === guess.team.division ? "player-item right animate delay2" :"player-item animate delay2"}>{shortDivision(p.team.division)}</div>
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
                        <div className={"player-item wrong animate delay2"}>{shortDivision(guess.team.division)}</div> 
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
                    numOfGuess = {numOfGuess}
                  />}
            </div>
        </div>
        }
      </div>
    </div>
    );
}
function shortDivision(div){
  if("Atlantic"){
    return "Atl.";
  }
  if("Pacific"){
    return "Pacific";
  }

  if("Southwest"){
    return "SW";
  }
  if("Southeast"){
    return "SE";
  }

  if("Central"){
    return "Cent."
  }

  if("Northwest"){
    return "NW";
  }
}
export default Game;