import React, { useState } from "react";
import axios from 'axios'
import AsyncSelect from 'react-select/async'
import { useEffect } from "react";
const SearchBar = () =>{
  const [inputValue, setInput] = useState()
  const [selectedPlayer, updateSelectedPlayer] = useState([]);
  const [guess, setGuess] = useState();


  const fetchGuess = async() =>{
    var id = Math.floor(Math.random() * 3000)+1;
    await axios.get(`https://www.balldontlie.io/api/v1/players/237`)
      .then(res => {
          console.log(res.data)
          setGuess(res.data)
        })
  }

  useEffect(()=>{
    fetchGuess();
  }, [])

  const inputHandler = () => {
    return axios.get(`https://www.balldontlie.io/api/v1/players?search=${inputValue}`)
    .then(res =>{
      const dat = res.data.data;
      return dat;
    })
  }

  const handleChange = (p) =>{
    console.log(p)
    updateSelectedPlayer(arr => [...arr, p]);
  }
  const handleInput = (p) =>{
    setInput(p);
  }

  return (
    
    <div>
      {guess!==undefined && <h2>{guess.first_name} {guess.last_name}</h2>}
      <AsyncSelect
      className="search-bar" 
      cacheOptions
      defaultOptions
      loadOptions={inputHandler}
      getOptionLabel={e => e.first_name + ' ' + e.last_name}
      getOptionValue={e => e.id}
      onSelectResetsInput={false}
      onInputChange={handleInput}
      onChange={handleChange}
      placeholder={'Guess the player'}
      />
      {selectedPlayer.length>0 && 
      <table>
        <tbody>
              <tr>
                  <th>Player</th>
                  <th>Team</th>
                  <th>Conf</th>
                  <th>Division</th>
                  <th>Position</th>
                  <th>Height</th>
              </tr>
              {selectedPlayer.map(p =>(
                      <tr key ={p.id}>
                          <td>{p.first_name} {p.last_name}</td>
                          <td className={p.team.abbreviation === guess.team.abbreviation ? "right" : ""}>{p.team.abbreviation}</td>
                          <td className={p.team.conference === guess.team.conference ? "right" : ""}>{p.team.conference}</td>
                          <td className={p.team.division === guess.team.division ? "right" : ""}>{p.team.division}</td>
                          <td className={p.position === guess.position ? "right" : ""}>{p.position}</td>
                          <td className={(p.height_feet === guess.height_feet && p.height_inches === guess.height_inches) ? "right" : ""}>{p.height_feet}'{p.height_inches} 
                          {(p.height_feet*12 + p.height_inches > guess.height_feet*12+guess.height_inches) ? <p>{'\u2193'}</p> : <p>{'\u2191'}</p>}</td>
                      </tr>
                  ))}
            </tbody>
          </table>}
          <button className="btn" onClick={fetchGuess}>hi</button>
    </div>
    );
}

export default SearchBar;