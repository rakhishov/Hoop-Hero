import "./css/Header.css"
import Modal from 'react-bootstrap/Modal';

const Header = ({show, onHide, cl}) =>{

    const info = <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMmM1LjUxNCAwIDEwIDQuNDg2IDEwIDEwcy00LjQ4NiAxMC0xMCAxMC0xMC00LjQ4Ni0xMC0xMCA0LjQ4Ni0xMCAxMC0xMHptMC0yYy02LjYyNyAwLTEyIDUuMzczLTEyIDEyczUuMzczIDEyIDEyIDEyIDEyLTUuMzczIDEyLTEyLTUuMzczLTEyLTEyLTEyem0tLjAwMSA1Ljc1Yy42OSAwIDEuMjUxLjU2IDEuMjUxIDEuMjVzLS41NjEgMS4yNS0xLjI1MSAxLjI1LTEuMjQ5LS41Ni0xLjI0OS0xLjI1LjU1OS0xLjI1IDEuMjQ5LTEuMjV6bTIuMDAxIDEyLjI1aC00di0xYy40ODQtLjE3OSAxLS4yMDEgMS0uNzM1di00LjQ2N2MwLS41MzQtLjUxNi0uNjE4LTEtLjc5N3YtMWgzdjYuMjY1YzAgLjUzNS41MTcuNTU4IDEgLjczNXYuOTk5eiIvPjwvc3ZnPg=="></img>

    return(
    <div className="header">
        <div className="info header-item" onClick={cl}>
                {info} <span className="text-title">How to play</span>
        </div> 
        
        <Modal
            show={show}
            onHide={onHide}
        />
        
        
    </div>
    );
}

export default Header;