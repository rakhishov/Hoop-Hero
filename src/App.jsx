import { useState } from 'react'
import Game from './components/Game'
import './App.css'
import ModalInstructions from './components/Modal'
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './components/Footer';
import Header from './components/Header';


function App() {
  var modalOpen = JSON.parse(localStorage.getItem("didFinish") || false);
  const [modalInstructionsShow, setModalInstructionsShow] = useState(!modalOpen);
  return (
  <>
      <Header
        show={modalInstructionsShow}
        onHide={() => setModalInstructionsShow(false)}
        cl={setModalInstructionsShow}
      />
      <h1 className='title'>HOOP HERO</h1>
      <h2 className='title-info'>Try to Guess the NBA Player</h2>
      <Game/>
      <Footer />
      <ModalInstructions
        show={modalInstructionsShow}
        onHide={() => setModalInstructionsShow(false)}
      />
    </>
  )
}

export default App;
