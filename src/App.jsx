import { useState } from 'react'
import Game from './components/Game'
import './App.css'
import ModalInstructions from './components/Modal'
import ModalStats from './components/Stats'
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './components/Footer';
import Header from './components/Header';
import RestartButton from './components/RestartGame';
function App() {
  var modalOpen = JSON.parse(localStorage.getItem("didFinish") || false);
  const [modalInstructionsShow, setModalInstructionsShow] = useState(!modalOpen);
  const [modalStatsShow, setModalStatsShow] = useState(false);
  
  return (
  <>
      <Header
        show={modalInstructionsShow}
        onHide={() => setModalInstructionsShow(false)}
        cl={setModalInstructionsShow}
        showStats ={modalStatsShow}
        onHideStats={()=> setModalStatsShow(false)}
        clStats={setModalStatsShow}
      />
      <h1 className='title'>HOOP HERO</h1>
      <h2 className='title-info'>Try to Guess the NBA Player</h2>
      <Game/>
      <Footer />
      <ModalInstructions
        show={modalInstructionsShow}
        onHide={() => setModalInstructionsShow(false)}
      />
      <ModalStats
        show={modalStatsShow}
        onHide={()=> setModalStatsShow(false)}
      />
    </>
  )
}

export default App;
