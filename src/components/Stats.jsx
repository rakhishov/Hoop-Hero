import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useState } from 'react';
import * as NBAIcons from 'react-nba-logos';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

const ModalStats = (props) => {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
      );
    const options = {
        scales: {
            x: {
              grid: {
                display: false
              },
              
            },
            y: {
              grid: {
                display: false
              },
              ticks: {
                precision: 0
              }
            }
        },
        indexAxis: 'x',
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            display: false
          },
          title: {
            display: true,
            text: 'Your Guesses',
          },
        },
    };  
    const labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    const stats = JSON.parse(localStorage.getItem("stats")) || Array(11).fill(0);

    const data = {
        labels,
    
        datasets: [
          {
            label: "guesses",
            data: stats.map((p) => p),
            borderColor: 'rgb(0,128,0)',
            backgroundColor: 'rgba(0,128,0, 0.5)',
          },
        ],
    };

    const total = stats.reduce((sum, a)=> sum+a, 0);
    const win = total-stats[stats.length-1]
    return (
        <Modal
          {...props}
          
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title className='modal-title mx-auto' id="contained-modal-title-vcenter">
                <span className='stats-title'>Stats</span>
              
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="statistics">
                <div className="stats-item">Games played: <h2 className="stats-num">{total}</h2></div>
                <div className="stats-item">Win percentage: <h2 className='stats-num'>{total!=0 ? Math.round(win/total*100 *10)/10 + "%" : 0 + "%"}</h2></div>
                <div className="stats-item">Win-Lose <h2 className='stats-num'>{win + "-"}{total-win}</h2></div>
            
            </div>
            
            
            
            <Bar options={options} data={data} />
          </Modal.Body>
        </Modal>
      );
}

export default ModalStats;



