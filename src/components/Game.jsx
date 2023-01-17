import React, { useState } from "react";
import axios from "axios";
import AsyncSelect from "react-select/async";
import { useEffect } from "react";
import * as NBAIcons from "react-nba-logos";
import ModalGuess from "./ModalGuess";
import { set } from "firebase/database";

const Game = () => {
  const [inputValue, setInput] = useState();
  const [selectedPlayer, updateSelectedPlayer] = useState([]);
  const [guess, setGuess] = useState();
  const [numOfGuess, setNGuess] = useState(0);
  const [didGuess, setDidGuess] = useState(false);
  const [finish, setFinish] = useState(false);
  const [modalGuess, setModalGuessShow] = useState(true);

  const limitOfGuess = 10;
  const arrowUp = "\u2191";
  const arrowDown = "\u2193";
  const fetchGuess = async () => {
    setGuess(JSON.parse(localStorage.getItem("guess")));
    var id = JSON.parse(localStorage.getItem("playerid"));
    if (guess === undefined) {
      await axios
        .get(`https://www.balldontlie.io/api/v1/players/${id}`)
        .then(async (res) => {
          const guess = res.data;
          await axios
            .get(
              `https://www.balldontlie.io/api/v1/season_averages?player_ids[]=${guess.id}`
            )
            .then((res) => {
              const stats = res.data.data[0];
              guess.pts = roundToOne(stats.pts);
              guess.ast = roundToOne(stats.ast);
              guess.reb = roundToOne(stats.reb);
              setGuess(guess);
            });

          localStorage.setItem("guess", JSON.stringify(res.data));
        });
    }
  };

  const getId = () => {
    if ("playerid" in localStorage) {
    } else {
      var ids = [
        666786, 145, 132, 175, 15, 434, 115, 140, 322, 57, 237, 490, 117, 70,
        125, 666969, 246, 172, 3547238, 274, 472, 416, 297, 387, 161, 268, 419,
        182, 378, 1125, 4, 666581, 265, 38017683, 17895966, 666682, 666633, 54,
        303, 403, 666848, 443, 100, 334, 3547245, 360, 17896026, 666423, 666849,
        3547246, 406, 335, 458, 79, 192, 3547254,
      ];
      var randPlayer = ids[Math.floor(Math.random() * ids.length)];
      localStorage.setItem("playerid", randPlayer);
    }
  };

  useEffect(() => {
    setStorage();
    createStats();
    getId();
    fetchGuess();
    var players = JSON.parse(localStorage.getItem("players") || "[]");
    var didG = JSON.parse(localStorage.getItem("didGuess") || false);
    var didFinish = JSON.parse(localStorage.getItem("didFinish") || false);
    var nGuess = JSON.parse(localStorage.getItem("numOfGuess") || 0);
    updateSelectedPlayer(players);
    setDidGuess(didG);
    setFinish(didFinish);
    setNGuess(nGuess);
  }, []);

  const inputHandler = () => {
    return axios
      .get(`https://www.balldontlie.io/api/v1/players?search=${inputValue}`)
      .then((res) => {
        const dat = res.data.data.filter((p) => {
          return p.position != "";
        });
        return dat;
      });
  };

  const handleChange = async (p) => {
    const response = await axios
      .get(
        `https://www.balldontlie.io/api/v1/season_averages?player_ids[]=${p.id}`
      )
      .then((res) => {
        const stats = res.data.data[0];

        if (stats != undefined) {
          p.pts = roundToOne(stats.pts);
          p.ast = roundToOne(stats.ast);
          p.reb = roundToOne(stats.reb);
        } else {
          p.pts = "DNP";
          p.ast = "THIS";
          p.reb = "SEASON";
        }
      });

    updateSelectedPlayer((arr) => [...arr, p]);

    var players = JSON.parse(localStorage.getItem("players") || "[]");

    players.push(p);
    localStorage.setItem("players", JSON.stringify(players));

    if (JSON.stringify(p) === JSON.stringify(guess)) {
      setDidGuess(true);
      setFinish(true);
      localStorage.setItem("didGuess", true);
      localStorage.setItem("didFinish", true);
      setRecord(true, numOfGuess);
    }
    setNGuess(numOfGuess + 1);
    var n = JSON.parse(localStorage.getItem("numOfGuess") || 0);
    localStorage.setItem("numOfGuess", n + 1);
    if (numOfGuess == limitOfGuess - 1) {
      setFinish(true);
      setRecord(false, numOfGuess);
      localStorage.setItem("didFinish", true);
    }
  };
  const handleInput = (p) => {
    setInput(p);
  };

  return (
    <>
      <div className="game">
        <div className>
          <AsyncSelect
            className="search-bar"
            // cacheOptions
            // defaultOptions
            loadOptions={inputHandler}
            getOptionLabel={(e) => e.first_name + " " + e.last_name}
            getOptionValue={(e) => e.id}
            onInputChange={handleInput}
            isSearchable={finish ? false : true}
            isDisabled={finish ? true : false}
            onChange={handleChange}
            labelText="hello"
            value={inputValue || ""}
            placeholder={
              !didGuess
                ? finish
                  ? "Try harder next time!"
                  : `Guess ${Math.min(
                      numOfGuess + 1,
                      limitOfGuess
                    )} of ${limitOfGuess}`
                : "Winner Winner Chicken Dinner"
            }
          />
        </div>
        <div>
          {
            <div className="guesses">
              <div className="players">
                {selectedPlayer.map((p, index) =>
                  getPlayer(p, guess, arrowDown, arrowUp, index)
                )}
                {numOfGuess === limitOfGuess && !didGuess && (
                  <div className="player-full">
                    <h2 className="player-name">
                      {guess.first_name} {guess.last_name}
                    </h2>
                    <div className="player">
                      <div className="player-box">
                        <div className={"player-item wrong animate"}>
                          {React.createElement(
                            NBAIcons[guess.team.abbreviation],
                            { size: 70 }
                          )}
                        </div>
                        <div className="tag">TEAM</div>
                      </div>
                      <div className="player-box">
                        <div className={"player-item wrong animate delay1"}>
                          {guess.team.conference}
                        </div>
                        <div className="tag">CONF</div>
                      </div>

                      <div className="player-box">
                        <div className={"player-item wrong animate delay2"}>
                          {guess.position}
                        </div>
                        <div className="tag">POS</div>
                      </div>
                      <div className="player-box">
                        <div className={"player-item wrong animate delay3"}>
                          {guess.pts}
                        </div>
                        <div className="tag">PTS</div>
                      </div>
                      <div className="player-box">
                        <div className={"player-item wrong animate delay4"}>
                          {guess.ast}
                        </div>
                        <div className="tag">AST</div>
                      </div>
                      <div className="player-box">
                        <div className={"player-item wrong animate delay5"}>
                          {guess.reb}
                        </div>
                        <div className="tag">REB</div>
                      </div>
                    </div>
                  </div>
                )}
                {finish && (
                  <ModalGuess
                    stat={modalGuess}
                    f={() => setModalGuessShow(false)}
                    guess={guess}
                    didGuess={didGuess}
                    numOfGuess={numOfGuess}
                  />
                )}
              </div>
            </div>
          }
        </div>
      </div>
    </>
  );
};

function isClose(stats, player, guess) {
  if (player === "DNP" || player === "THIS" || player === "SEASON") {
    return "retired";
  }
  if (stats === "pts" && Math.abs(player - guess) < 5) {
    return "close";
  }

  if (stats === "ast" && Math.abs(player - guess) < 2) {
    return "close";
  }

  if (stats === "reb" && Math.abs(player - guess) < 3) {
    return "close";
  }
  return "";
}

function getPlayer(p, guess, arrowDown, arrowUp, index) {
  return (
    <div key={index} className="player-full">
      <h2 className="player-name">
        {index + 1 + "."} {p.first_name} {p.last_name}{" "}
      </h2>
      <div className="player">
        <div className="player-box">
          <div
            className={
              p.team.abbreviation === guess.team.abbreviation
                ? "player-item right animate"
                : "player-item animate"
            }
          >
            {React.createElement(NBAIcons[p.team.abbreviation], { size: 70 })}
          </div>
          <div className="tag">TEAM</div>
        </div>
        <div className="player-box">
          <div
            className={
              p.team.conference === guess.team.conference
                ? "player-item right animate delay1"
                : "player-item animate delay1"
            }
          >
            {p.team.conference}
          </div>
          <div className="tag">CONF</div>
        </div>
        <div className="player-box">
          <div
            className={
              p.position === guess.position ||
              p.position === guess.position[0] ||
              p.position === guess.position[2] ||
              p.position[0] === guess.position ||
              p.position[2] === guess.position ||
              p.position[0] === guess.position[2] ||
              p.position[2] === guess.position[0]
                ? "player-item right animate delay2"
                : "player-item animate delay2"
            }
          >
            {p.position}
          </div>
          <div className="tag">POS</div>
        </div>
        <div className="player-box">
          <div
            className={
              p.pts === guess.pts
                ? "player-item right animate delay3"
                : "player-item animate delay3 " +
                  isClose("pts", p.pts, guess.pts)
            }
          >
            {p.pts}
            {p.pts === "DNP" || p.pts === guess.pts
              ? ""
              : p.pts > guess.pts
              ? arrowDown
              : arrowUp}
          </div>
          <div className="tag">PTS</div>
        </div>
        <div className="player-box">
          <div
            className={
              p.ast === guess.ast
                ? "player-item right animate delay4"
                : "player-item animate delay4 " +
                  isClose("ast", p.ast, guess.ast)
            }
          >
            {p.ast}
            {p.ast === "THIS" || p.ast === guess.ast
              ? ""
              : p.ast > guess.ast
              ? arrowDown
              : arrowUp}
          </div>
          <div className="tag">AST</div>
        </div>
        <div className="player-box">
          <div
            className={
              p.reb === guess.reb
                ? "player-item right animate delay5"
                : "player-item animate delay5 " +
                  isClose("reb", p.reb, guess.reb)
            }
          >
            {p.reb}
            {p.reb === "SEASON" || p.reb === guess.reb
              ? ""
              : p.reb > guess.reb
              ? arrowDown
              : arrowUp}
          </div>
          <div className="tag">REB</div>
        </div>
      </div>
    </div>
  );
}
function setStorage() {
  var now = new Date().getTime();
  var expiryTime = localStorage.getItem("expiryTime");
  var setupTime = localStorage.getItem("setupTime");
  var ttl = timeLeftUntilMidnight();
  if (expiryTime == null) {
    localStorage.setItem("expiryTime", ttl);
    localStorage.setItem("setupTime", now);
  } else {
    if (now - setupTime > expiryTime) {
      var stats = JSON.parse(localStorage.getItem("stats"));
      localStorage.clear();
      localStorage.setItem("stats", JSON.stringify(stats));
      localStorage.setItem("setupTime", now);
      localStorage.setItem("expiryTime", timeLeftUntilMidnight());
    }
  }
}

function timeLeftUntilMidnight() {
  var h = new Date().getHours();
  var m = new Date().getMinutes();
  var s = new Date().getSeconds();

  var h_left = 23 - h;
  var m_left = 59 - m;
  var s_left = 59 - s;
  var ttl = s_left * 1000 + m_left * 60 * 1000 + h_left * 60 * 60 * 1000;
  return ttl;
}

function createStats() {
  var stats = localStorage.getItem("stats");
  if (stats == null) {
    var stats = Array(11).fill(0);
    localStorage.setItem("stats", JSON.stringify(stats));
  }
}

function setRecord(isGuess, numOfGuess) {
  var stats = JSON.parse(localStorage.getItem("stats"));
  if (isGuess) {
    stats[numOfGuess]++;
  } else {
    stats[stats.length - 1]++;
  }
  localStorage.setItem("stats", JSON.stringify(stats));
}

function roundToOne(n) {
  return Math.round((n + Number.EPSILON) * 10) / 10;
}

export default Game;
