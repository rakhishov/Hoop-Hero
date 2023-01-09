import React, { useState } from "react";
import axios from 'axios'
import AsyncSelect from 'react-select/async'
import { useEffect } from "react";
import * as NBAIcons from 'react-nba-logos';
import ModalGuess from "./ModalGuess";
import { set } from "firebase/database";

const Game = () =>{
  const [inputValue, setInput] = useState()
  const [selectedPlayer, updateSelectedPlayer] = useState([]);
  const [guess, setGuess] = useState();
  const [numOfGuess, setNGuess] = useState(0);
  const [didGuess, setDidGuess] = useState(false);
  const [finish, setFinish] = useState(false);
  const [modalGuess, setModalGuessShow] = useState(true)

  const limitOfGuess = 5
  const arrowUp = "\u2191"
  const arrowDown = "\u2193"
  const fetchGuess = async() =>{
    setGuess(JSON.parse(localStorage.getItem("guess")));
    var id = JSON.parse(localStorage.getItem("playerid"));
    if(guess === undefined){
      await axios.get(`https://www.balldontlie.io/api/v1/players/${id}`)
      .then(async(res) => {
          const guess = res.data
          await axios.get(`https://www.balldontlie.io/api/v1/season_averages?player_ids[]=${guess.id}`)
            .then(res =>{
              
              const stats = res.data.data[0]
              guess.pts = roundToOne(stats.pts)
              guess.ast = roundToOne(stats.ast)
              guess.reb = roundToOne(stats.reb)
              setGuess(guess);
            })
          
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
    //setStorage();
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

  
  const handleChange = async(p) =>{
    
    const response = await axios.get(`https://www.balldontlie.io/api/v1/season_averages?player_ids[]=${p.id}`)
    .then(res =>{
      const stats = res.data.data[0]
      
      if(stats!=undefined){
        p.pts = roundToOne(stats.pts)
        p.ast = roundToOne(stats.ast)
        p.reb = roundToOne(stats.reb)
      }
      else{
        p.pts = "DNP"
        p.ast = "THIS"
        p.reb = "SEASON"
      }
    })
    
    
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
    <>
    <div className="game">
      <div className>
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
      escapeClear sValue={true}
      
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
                    getPlayer(p, guess, arrowDown, arrowUp, numOfGuess)
                  ))}
                  {(numOfGuess === limitOfGuess && !didGuess)&&
                  <div className="player-full">
                    <h2 className="player-name">{guess.first_name} {guess.last_name}</h2>
                    <div className ="player">
                      <div className="player-box">
                        <div className={"player-item wrong animate"}>{React.createElement(NBAIcons[guess.team.abbreviation],{size:70})}</div>
                        <div className="tag">
                          TEAM
                        </div>
                      </div>
                      <div className="player-box">
                        <div className={"player-item wrong animate delay1"}>{guess.team.conference}</div>
                        <div className="tag">
                          CONF
                        </div>
                      </div>
                     
                      <div className="player-box">
                        <div className={"player-item wrong animate delay2"}>{guess.position}</div>
                        <div className="tag">
                          POS
                        </div>
                      </div>
                      <div className="player-box">
                        <div className={"player-item wrong animate delay3"}>{guess.pts}</div>
                        <div className="tag">
                          PTS
                        </div>
                      </div>
                      <div className="player-box">
                        <div className={"player-item wrong animate delay4"}>{guess.ast}</div>
                        <div className="tag">
                          AST
                        </div>
                      </div>
                      <div className="player-box">
                        <div className={"player-item wrong animate delay5"}>{guess.reb}</div>
                        <div className="tag">
                          AST
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
    </>
    );
} 

function isClose(stats, player, guess){
  if(player === "DNP" || player === "THIS" || player === "SEASON"){
    return "retired";
  }
  if(stats === 'pts' && Math.abs(player-guess)<5){
      return "close";
  }

  if(stats === 'ast' && Math.abs(player-guess)<2){
    return "close";
  }

  if(stats === 'reb' && Math.abs(player-guess)<3){
    return "close";
  }
  return ""
  
}

function getPlayer(p, guess, arrowDown, arrowUp){
  return(
              <div className="player-full">
                
                    <h2 className="player-name">{p.first_name} {p.last_name} </h2>
                    
                      <div className ="player">
                      
                        <div className="player-box">
                          <div className={p.team.abbreviation === guess.team.abbreviation ? "player-item right animate" :"player-item animate"}>
                            {React.createElement(NBAIcons[p.team.abbreviation],{size:70})}
                          </div>
                          <div className="tag">
                            TEAM
                          </div>
                        </div>
                        <div className="player-box">
                          <div className={p.team.conference === guess.team.conference ? "player-item right animate delay1" :"player-item animate delay1"}>
                            {p.team.conference}
                          </div>
                          <div className="tag">
                            CONF
                          </div>
                        </div>
                        <div className="player-box">
                          <div className={p.position === guess.position ? "player-item right animate delay2" :"player-item animate delay2"}>{p.position}</div>
                          <div className="tag">POS</div>
                        </div>
                        <div className="player-box">
                          <div className={p.pts === guess.pts ? "player-item right animate delay3" :"player-item animate delay3 " + isClose("pts", p.pts, guess.pts)}>{p.pts}{(p.pts === "DNP" || p.pts === guess.pts) ? "" : (p.pts>guess.pts ? arrowDown : arrowUp)}</div>
                          <div className="tag">PTS</div>
                        </div>
                        <div className="player-box">
                          <div className={p.ast === guess.ast ? "player-item right animate delay4" :"player-item animate delay4 " + isClose("ast", p.ast, guess.ast)}>{p.ast}{(p.ast === "THIS" || p.ast === guess.ast) ? "" : (p.ast>guess.ast ? arrowDown : arrowUp)}</div>
                          <div className="tag">AST</div>
                        </div>
                        <div className="player-box">
                          <div className={p.reb === guess.reb ? "player-item right animate delay5" :"player-item animate delay5 " + isClose("reb", p.reb, guess.reb)}>{p.reb}{(p.reb === "SEASON" || p.reb === guess.reb) ? "" : (p.reb>guess.reb ? arrowDown : arrowUp)}</div>
                          <div className="tag">REB</div>
                        </div>
                        
                        </div>
                    </div>
  )
}
function setStorage(){
  var now = new Date().getTime()
  var setupTime = localStorage.getItem("setupTime")
  if(setupTime == null){
    localStorage.setItem("setupTime", now);
  }
  else{
    if(now-setupTime > 10*1000){
      localStorage.clear()
      localStorage.setItem("setupTime", now)
    }
  }
}

function roundToOne(n){
  return Math.round((n + Number.EPSILON)*10)/10;
}

export default Game;