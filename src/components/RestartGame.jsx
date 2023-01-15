import Button from 'react-bootstrap/Button';


const RestartButton = () =>{
    return(
        <div className='game-restart'>
            <Button 
            className='btn-restart'
            onClick={clearStorage}>New Game</Button>
        </div>
    )
}


function clearStorage(){
    var stats = JSON.parse(localStorage.getItem("stats"))
    localStorage.clear()
    localStorage.setItem("stats", JSON.stringify(stats))
    location.reload()
}

export default RestartButton;